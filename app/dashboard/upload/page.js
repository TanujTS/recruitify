"use client"
import React, { useRef, useState } from 'react'
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

const page = () => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("No file chosen");
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      // Set the file manually to the input element if needed
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a PDF file to upload.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must be logged in");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await fetch('http://localhost:8000/upload-resume', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard')
      } else {
        alert(data.detail || "Upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        alert("Only PDF files are allowed!");
        return;
      }
      setSelectedFile(file);
      setFileName(file.name);
    }
  };
  return (
    <div className="bg-[url(/upload-bg.png)] bg-cover bg-no-repeat min-h-[92vh] w-full flex text-white">
      <Card className="my-auto min-w-[40vw] max-h-[80vh] mx-20 rounded-xl border border-[#ffffff1a] bg-gradient-to-b from-[#1c1c1c] to-[#000000cc] shadow-xl">
        <CardTitle className="text-2xl font-serif text-white text-center mt-4">
          Resume Upload
        </CardTitle>
        <CardContent className="p-6 space-y-4 bg-[#1c1c1cbc]">
          <div
            className="border-2 border-dashed border-[#e6e6e680] rounded-xl flex flex-col gap-2 p-8 items-center bg-[#ffffff0a] text-white cursor-pointer transition hover:bg-[#ffffff10]"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current.click()}
          >
            <FileIcon className="w-12 h-12 text-[#f472b6]" />
            <span className="text-sm font-medium">
              Drag & drop file or{" "}
              <span className="text-[#f472b6] font-semibold">Browse</span>
            </span>
            <span className="text-xs text-white">
              Supported formats: JPEG, PNG, PDF, Word, PPT
            </span>
          </div>

          {/* File Input */}
          <div className="space-y-2 text-sm">
            <Label htmlFor="file" className="text-white font-medium">
              File
            </Label>
            <div className="relative w-full">
              <input
                id="file"
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 z-10 w-full cursor-pointer"
              />
              <div className="flex items-center justify-between w-full py-2 px-4 bg-[#ffffff24] border border-[#ffffff1a] text-white rounded-md pointer-events-none">
                <span className="truncate text-sm">{fileName}</span>
                <span className="bg-[#f472b6] text-black px-3 py-1 rounded-md font-semibold text-sm">
                  Choose File
                </span>
              </div>
            </div>
            <div onClick={handleUpload}>
              <Button size="lg" className="w-full bg-[#f472b6] text-black font-bold rounded-md shadow-md hover:bg-[#ff5eaa] transition">
                UPLOAD FILE
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  )
}

export default page
