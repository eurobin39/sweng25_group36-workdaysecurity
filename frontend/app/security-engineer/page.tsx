"use client";
import React, { useState } from "react";
import { FileUpload } from "@/components/file-upload";
import CircularProgress from "@mui/material/CircularProgress";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false); // Track upload status

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  const handleUploadClick = () => {
    setLoading(true);
    setUploadComplete(false); // Reset 'Done' button when a new upload starts

    setTimeout(() => {
      setLoading(false);
      setUploadComplete(true); // Show "Done" button after upload finishes
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-600">
      <Lock className="w-16 h-16 text-cyan-300 mb-4" />
      <div
        className="w-full max-w-3xl mx-auto min-h-96 rounded-lg p-4 flex flex-col items-center justify-center"
        style={{
          background: "opacity-0", // Deep blue background       
          borderColor: "rgb(96, 165, 250)", // Light blue border
        }}
      >
        {/* FileUpload component with matching background */}
        <FileUpload
          onChange={handleFileUpload} // Set the background color to match page
        />

        {/* Upload & Done Buttons */}
        {files.length > 0 && (
          <div className="mt-6 flex justify-center">
            {!uploadComplete ? (
              <button
                onClick={handleUploadClick}
                className="py-3 px-6 bg-blue-700 text-white text-xl font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <CircularProgress size={24} sx={{ color: "white" }} />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </button>
            ) : (
              <Link
              href="http://172.20.10.12:4000/d/security-test-dashboard/security-test-dashboard?orgId=1&from=now-6h&to=now&timezone=browser"
              target="_blank"
             >
              <button className="px-6 py-3 bg-blue-700 text-white text-2xl border-2 border-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105">
                Open Grafana
              </button>
            </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
