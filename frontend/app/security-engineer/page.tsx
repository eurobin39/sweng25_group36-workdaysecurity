"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { useRouter } from "next/navigation";
import NavBar from "@/components/ui/NavBar";

export default function FileUploadDemo() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div>
    <NavBar />
    <div className= "h-screen bg-gradient-to-br from-blue-600 to-blue-300 flex flex-col items-center justify-start pt-20"
          style={{
            backgroundImage: "url('/images/securityBackground.jpg')", 
            backgroundSize: "cover", 
            backgroundPosition: "center", 
          }}>
    
      <div className="w-full max-w-6xl mx-auto min-h-96 border bg-blue-800 dar:bg-blue-400 border-neutral-200 dark:border-neutral-100 rounded-lg p-4">
      
        <FileUpload onChange={handleFileUpload} />

        {/* Display uploaded files */}
        {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold" style={{ color: "var(--foreground)" }}>
            Uploaded Files:
          </h3>
          <ul className="list-disc list-inside">
            {files.map((file, idx) => (
              <li 
                key={idx} 
                className="text-sm"
                style={{ color: "var(--foreground)" }}
              >
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-center">
          <button
          className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-lg text-2xl shadow-xl transition-all"
          onClick={() => router.push("/security-engineer/uploaded-scripts")}
          >
            Upload
          </button>
          </div>

          {/* Grafana Button */}
        {/* <div className="mt-6 flex justify-center">
          <a
            href="http://localhost:4000"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all no-underline"
          >
          Grafana
          </a>
        </div> */}
        </div>
        )}
        
      </div>
    </div>
    </div>
  );
}
