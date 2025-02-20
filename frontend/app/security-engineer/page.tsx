"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadMessage, setUploadMessage] = useState<string>("");

  // New function to upload file(s) to the serverless function
  const uploadFiles = async (files: File[]) => {
    // Create a new FormData object
    const formData = new FormData();
    // If you only want to allow one file, you can send files[0]
    // For multiple files, you may loop over the array.
    formData.append("file", files[0]);

    try {
      const response = await fetch("/api/uploadZest", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setUploadMessage("Upload successful!");
      } else {
        setUploadMessage(`Error: ${data.error}`);
      }
    } catch (error: any) {
      setUploadMessage(`Error: ${error.message}`);
    }
  };

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log("Files selected:", files);
    // Call the upload function once the file is selected
    uploadFiles(files);
  };

  return (
    <div className="w-full max-w-6xl mx-auto min-h-96 border bg-orange-500 dark:bg-orange-700 border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
      <FileUpload onChange={handleFileUpload} />

      {/* Display uploaded files */}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Uploaded Files:</h3>
          <ul className="list-disc list-inside">
            {files.map((file, idx) => (
              <li key={idx} className="text-sm text-neutral-700 dark:text-neutral-300">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display upload status */}
      {uploadMessage && (
        <div className="mt-4">
          <p className="text-sm text-green-600 dark:text-green-400">{uploadMessage}</p>
        </div>
      )}

      {/* Grafana Button */}
      <div className="mt-6 flex justify-center">
        <a
          href="http://localhost:4000"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-400 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all no-underline"
        >
          Grafana
        </a>
      </div>
    </div>
  );
}
