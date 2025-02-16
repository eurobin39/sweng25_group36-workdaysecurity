"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
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
    </div>
  );
}
