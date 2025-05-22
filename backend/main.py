from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from bson.binary import Binary
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import requests
import asyncio
from concurrent.futures import ThreadPoolExecutor

# === Config ===
load_dotenv()
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise ValueError("SECRET_KEY not set in environment variables.")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
MONGO_URI = "mongodb://localhost:27017"

# === Setup ===
app = FastAPI()
client = AsyncIOMotorClient(MONGO_URI)
db = client["recruitify"]
users = db["users"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (adjust in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (including OPTIONS)
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# === Models ===
class UserIn(BaseModel):
    username: str
    password: str
    has_submitted: bool;

class UserOut(BaseModel):
    username: str
    has_submitted: bool;

class Token(BaseModel):
    access_token: str
    token_type: str

class ResponseIn(BaseModel):
    response: str

class ResumeAnalysis(BaseModel):
    score: float
    summary: str
    sections: dict

# === Helpers ===
def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# === Auth ===
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if not username:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await users.find_one({"username": username})
    if not user:
        raise credentials_exception
    return user

# === Routes ===
@app.post("/register", response_model=UserOut)
async def register(user: UserIn):
    if await users.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed = hash_password(user.password)
    await users.insert_one({"username": user.username, "hashed_password": hashed, "has_submitted": user.has_submitted})
    return UserOut(username=user.username, has_submitted=user.has_submitted)

@app.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await users.find_one({"username": form_data.username})
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token({"sub": user["username"]})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me", response_model=UserOut)
async def read_me(current_user: dict = Depends(get_current_user)):
    return {"username": current_user["username"], "has_submitted": current_user.get("has_submitted")}

@app.post("/submit-response")
async def submit_response(data: ResponseIn, current_user: dict = Depends(get_current_user)):
    result = await users.update_one(
        {"username": current_user["username"]},
        {
            "$set": {
                "response": data.response,
            }
        }
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Update failed")
    return {"message": "Response submitted"}


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    if file.content_type != "application/pdf":
        return JSONResponse(status_code=400, content={"detail": "Only PDF files are allowed"})

    contents = await file.read()

    # Save PDF binary to MongoDB
    result = await users.update_one(
        {"username": current_user["username"]},
        {"$set": {"resume_pdf": Binary(contents), "has_submitted": True}}
    )

    if result.modified_count == 0:
        return JSONResponse(status_code=400, content={"detail": "Resume upload failed"})

    return {"message": "Resume uploaded successfully"}


#---------------------------------------------------------
# PDF endpoint for ML service to fetch PDFs
@app.get("/pdf/{username}")
async def get_pdf(username: str):
    """Endpoint for ML service to fetch PDF by username"""
    user = await users.find_one({"username": username})
    if not user or "resume_pdf" not in user:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    pdf_binary = user["resume_pdf"]
    return Response(content=pdf_binary, media_type="application/pdf")

@app.get("/process-resume", response_model=ResumeAnalysis)
async def process_resume(current_user: dict = Depends(get_current_user)):
    """Process the user's resume with ML service"""
    
    # Check if user has uploaded a resume
    if "resume_pdf" not in current_user:
        raise HTTPException(status_code=404, detail="No resume found for user")
    
    # Check if analysis already exists
    if "resume_analysis" in current_user:
        analysis = current_user["resume_analysis"]
        return ResumeAnalysis(
            score=analysis.get("score", 0.0),
            summary=analysis.get("summary", ""),
            sections=analysis.get("sections", {})
        )
    
    try:
        # Call ML service
        response = requests.post(
            f"{ML_SERVICE_URL}/analyze-resume",
            json={"username": current_user["username"]},
            timeout=120  # 2 minutes timeout for ML processing
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="ML service failed to process resume")
        
        result = response.json()
        
        # Save analysis results to database
        await users.update_one(
            {"username": current_user["username"]},
            {"$set": {"resume_analysis": result}}
        )
        
        return ResumeAnalysis(
            score=result["score"],
            summary=result["summary"],
            sections=result["sections"]
        )
        
    except requests.exceptions.RequestException as e:
        print(f"Error calling ML service: {e}")
        raise HTTPException(status_code=503, detail="ML service unavailable")
    except Exception as e:
        print(f"Error processing resume: {e}")
        raise HTTPException(status_code=500, detail="Error processing resume")

@app.get("/resume-analysis", response_model=ResumeAnalysis)
async def get_resume_analysis(current_user: dict = Depends(get_current_user)):
    """Get existing resume analysis or trigger processing if not available"""
    
    if "resume_analysis" in current_user:
        analysis = current_user["resume_analysis"]
        return ResumeAnalysis(
            score=analysis.get("score", 0.0),
            summary=analysis.get("summary", ""),
            sections=analysis.get("sections", {})
        )
    else:
        # Trigger processing if not available
        return await process_resume(current_user)
