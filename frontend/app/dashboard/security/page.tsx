"use client";

import { Code, FolderKanban, Monitor, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSecurityEngineerDashboardData } from "./actions";
import { FileUpload } from "@/components/file-upload";
import CircularProgress from "@mui/material/CircularProgress";

interface Project {
  id: number;
  name: string;
  startDate: Date;
  status?: string;
  repository: string;
  latestStatus?: string;
  vulnFound?: boolean;
  lastTestDate?: Date;
  members: { id: number; username: string }[];
}

interface SecurityData {
  vulnerabilities: number;
  severityDistribution: { [severity: string]: number };
}

interface UserData {
  projects: Project[];
  securityData?: { [projectName: string]: SecurityData };
}

export default function SecurityEngineerDashboard() {
  const [tab, setTab] = useState<"projects" | "grafana" | "upload">("projects");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadComplete, setUploadComplete] = useState<boolean>(false);

  useEffect(() => {
    getSecurityEngineerDashboardData().then((data) => {
      setUserData(data);
    });
  }, []);

  useEffect(() => {
    if (tab !== "upload") {
      setFiles([]);
      setLoading(false);
      setUploadComplete(false);
    }
  }, [tab]);

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
  };

  const handleUploadClick = () => {
    setLoading(true);
    setUploadComplete(false);
    setTimeout(() => {
      setLoading(false);
      setUploadComplete(true);
    }, 4000);
  };

  const getGrafanaUrl = (projectName: string) => {
    const slug = projectName.toLowerCase().replace(/\s+/g, "-");
    return `http://localhost:4000/d/security-test-dashboard/security-test-dashboard?orgId=1&var-project=${slug}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 to-blue-600 text-white px-4">
      <Code className="w-16 h-16 text-cyan-300 mb-4" />
      <h1 className="text-4xl font-bold">Security Engineer Dashboard</h1>
      <p className="text-gray-200 mt-2 mb-8 text-center">Monitor and manage security vulnerabilities efficiently.</p>

      <div className="flex mb-6 bg-gray-800 rounded-lg overflow-hidden">
        {[
          { tabId: "projects", icon: FolderKanban, label: "Projects" },
          { tabId: "grafana", icon: Monitor, label: "Grafana" },
          { tabId: "upload", icon: UploadCloud, label: "File Drop" },
        ].map(({ tabId, icon: Icon, label }) => (
          <button
            key={tabId}
            onClick={() => setTab(tabId as any)}
            className={`px-6 py-3 flex items-center ${tab === tabId ? "bg-cyan-700 text-white" : "bg-gray-700 text-gray-300"}`}
          >
            <Icon className="w-5 h-5 mr-2" />
            {label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
          {tab === "projects" && (
            <>
              <h2 className="text-2xl font-semibold mb-4">My Projects</h2>
              {userData?.projects.length ? (
                <div className="space-y-4">
                  {userData.projects.map((project) => (
                    <div key={project.id} className="p-4 bg-gray-700 rounded-md flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                        <p className="text-sm text-gray-400">Start Date: {new Date(project.startDate).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-400">Status: {project.status || "N/A"}</p>
                        <p className="text-sm text-gray-400">Repository: {project.repository}</p>
                        <p className="text-sm text-gray-400">Last Test: {project.lastTestDate ? new Date(project.lastTestDate).toLocaleString() : "Unknown"}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            project.latestStatus === "PASSED" ? "bg-green-600" : "bg-red-600"
                          }`}
                        >
                          {project.latestStatus || "UNKNOWN"}
                        </span>
                        {project.vulnFound && (
                          <span className="px-2 py-1 bg-red-500 text-xs font-semibold rounded">
                            ⚠ Vulnerability Found
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400">You are not assigned to any projects.</p>
              )}
            </>
          )}

          {tab === "grafana" && userData && (
            <>
              <h2 className="text-2xl font-semibold mb-6">Grafana Dashboards</h2>
              {userData.projects.map((project) => (
                <div key={project.id} className="p-4 bg-gray-700 rounded-md mb-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{project.name}</h3>
                    <p className="text-sm text-gray-400">Start: {new Date(project.startDate).toLocaleDateString()}</p>
                  </div>
                  <Link href={getGrafanaUrl(project.name)} target="_blank">
                    <button className="px-4 py-2 bg-cyan-700 hover:bg-cyan-500 text-white font-semibold rounded-lg">
                      View Grafana
                    </button>
                  </Link>
                </div>
              ))}
            </>
          )}

{tab === "upload" && (
  <>
    {/* Main Upload Section: Side by Side */}
    <div className="flex flex-col md:flex-row gap-6 w-full">
      {/* Left: File Drop Area */}
      <div className="flex-1 border-2 border-dashed border-gray-500 bg-gray-800 rounded-xl p-8 text-center hover:border-cyan-400 transition-all">
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center h-full space-y-3"
        >
          <UploadCloud className="w-10 h-10 text-cyan-400" />
          <p className="text-white text-lg font-semibold">Click or drag files to upload</p>
          <p className="text-sm text-gray-400">Supports multiple files</p>
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={(e) =>
            setFiles((prev) => [...prev, ...Array.from(e.target.files ?? [])])
          }          
          className="hidden"
        />
      </div>

      {/* Right: File List */}
      <div className="flex-1 bg-gray-800 rounded-xl p-6 border border-gray-700 text-white shadow-inner">
        <h3 className="text-xl font-semibold mb-4">📄 Files to upload</h3>
        {files.length > 0 ? (
          <ul className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {files.map((file, index) => (
              <li key={index} className="bg-gray-700 p-3 rounded-lg shadow border border-gray-600">
                <p className="text-md font-medium truncate">{file.name}</p>
                <p className="text-sm text-gray-400">📁 {file.type || "Unknown type"}</p>
                <p className="text-sm text-gray-500">
                  📦 {(file.size / 1024).toFixed(2)} KB
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No files selected yet.</p>
        )}
      </div>
    </div>

    {/* Upload Button */}
    {files.length > 0 && (
      <div className="flex justify-center mt-6">
        {!uploadComplete ? (
          <button
            onClick={handleUploadClick}
            disabled={loading}
            className="flex items-center gap-2 py-3 px-6 bg-blue-700 hover:bg-blue-500 text-white text-lg font-semibold rounded-lg transition-all"
          >
            {loading ? (
              <>
                <CircularProgress size={20} sx={{ color: "white" }} />
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>
        ) : (
          <Link
            href="http://localhost:4000/d/security-test-dashboard/security-test-dashboard?orgId=1"
            target="_blank"
          >
            <button className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white text-lg font-semibold border border-white rounded-lg transition-all">
              ✅ Done – View Dashboard
            </button>
          </Link>
        )}
      </div>
    )}
  </>
)}



        </div>
      </div>
    </div>
  );
}
