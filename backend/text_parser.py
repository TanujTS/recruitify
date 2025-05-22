from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import fitz  # Package Name-PyMuPDF
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import tempfile
from dotenv import load_dotenv
import os

# === Config ===
load_dotenv()
app = FastAPI()
BACKEND_URL = "http://localhost:8000"
userResponse = "professional resume"

# === Models ===
class AnalyzeRequest(BaseModel):
    username: str
    response: str

class AnalyzeResponse(BaseModel):
    score: float
    summary: str
    sections: dict

# === ML Functions ===
def extract_resume_sections(username):
    """Extract sections from PDF for given username"""
    try:
        print(f"Extracting resume sections for username: {username}")
        
        # Get PDF from main backend
        url = f"{BACKEND_URL}/pdf/{username}"
        print(f"Fetching PDF from: {url}")
        
        response = requests.get(url)
        
        if response.status_code != 200:
            print(f"Failed to fetch PDF: {response.status_code}, {response.text}")
            return None
        
        print(f"PDF fetched successfully, size: {len(response.content)} bytes")
        
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp_file:
            temp_file.write(response.content)
            temp_path = temp_file.name

        print(f"PDF saved to temporary file: {temp_path}")

        # Extract text from PDF
        doc = fitz.open(temp_path)
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        
        # Clean up temporary file
        os.unlink(temp_path)

        print(f"Extracted text length: {len(text)}")

        if text == "":
            print("No text extracted from PDF")
            return None

        text_lower = text.lower()
        keywords = ["education", "projects", "professional experience", "technical skills", 
                   "skills", "internships", "work experience", "experience", "accomplishments"]
        lines = text_lower.splitlines()
        sections = {}
        current_key = None
        buffer = []

        for line in lines:
            stripped = line.strip()
            if stripped in keywords:
                if current_key:
                    sections[current_key] = "\n".join(buffer).strip()
                current_key = stripped
                buffer = []
            elif current_key:
                buffer.append(line)

        if current_key:  # adding the final section
            sections[current_key] = "\n".join(buffer).strip()

        print(f"Extracted sections: {list(sections.keys())}")
        return sections

    except Exception as e:
        print(f"Error extracting resume sections: {e}")
        return None

def find_summary(text):

    GROQ_API_KEY = os.getenv('ML_TOKEN')

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    url = "https://api.groq.com/openai/v1/chat/completions"

    data = {
        "model": "llama3-8b-8192",  
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant that summarizes text into coherent, understandable sentences."
            },
            {
                "role": "user",
                "content": "Summarize the following text:\n\n"+text
            }
        ],
        "temperature": 0.7, #creativity.
        "max_tokens": 300
    }

    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        summary = response.json()["choices"][0]["message"]["content"]
        #print("📄 Summary:\n", summary)
        return(str(summary))
    else:
        print("🚨 Error:", response.status_code, response.text)

def calculate_similarity(summarised_data, query=userResponse):
    """Calculate similarity score"""
    try:
        print(f"Calculating similarity for {len(summarised_data)} sections")
        print("User query: ", userResponse)
        model = SentenceTransformer("all-mpnet-base-v2")
        query_embedding = model.encode(query)

        similarity_values = []
        for section_name, summary in summarised_data.items():
            if summary and summary.strip():  # Only process non-empty summaries
                section_embedding = model.encode(summary)
                similarity = cosine_similarity([section_embedding], [query_embedding])[0][0]
                similarity_values.append(similarity)
                print(f"Similarity for {section_name}: {similarity}")
        
        max_similarity = max(similarity_values) if similarity_values else 0.5
        print(f"Max similarity: {max_similarity}")
        return max_similarity
    
    except Exception as e:
        print(f"Error calculating similarity: {e}")
        return 0.5  # Default similarity score

def main_block(username):
    """Main processing function"""
    try:
        print(f"Starting main_block for username: {username}")
        
        resume_info = extract_resume_sections(username)
        
        if not resume_info:
            print("No resume info extracted")
            return {"score": 0.0, "summary": "Could not extract text from resume", "sections": {}}

        summarised = {}
        overall_summary = ""
        
        for key, value in resume_info.items():
            if value and value.strip():  # Only process non-empty sections
                print(f"Processing section: {key}")
                summary = find_summary(value)
                summarised[key] = summary
                overall_summary += summary + " "

        if not summarised:
            print("No valid sections found")
            return {"score": 0.0, "summary": "No valid sections found in resume", "sections": {}}

        score = calculate_similarity(summarised) * 100
        result = {
            "score": round(score, 2),
            "summary": overall_summary.strip(),
            "sections": summarised
        }

        print(f"Final result: score={result['score']}, sections={len(result['sections'])}")
        return result
    
    except Exception as e:
        print(f"Error in main_block: {e}")
        return {"score": 0.0, "summary": "Error processing resume", "sections": {}}

# === Routes ===


@app.post("/analyze-resume", response_model=AnalyzeResponse)
async def analyze_resume(request: AnalyzeRequest):
    """Analyze resume for given username"""
    try:
        print(f"Received analyze request for username: {request.username}")
        global userResponse
        userResponse = request.response
        result = main_block(request.username)
        
        return AnalyzeResponse(
            score=result["score"],
            summary=result["summary"],
            sections=result["sections"]
        )
    except Exception as e:
        print(f"Error analyzing resume: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to analyze resume: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}