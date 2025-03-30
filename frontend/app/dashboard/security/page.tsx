"use client";

import { Code, FolderKanban, Monitor, UploadCloud, BarChart2, Lock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSecurityEngineerDashboardData } from "./security_action";
import { FileUpload } from "@/components/file-upload";
import CircularProgress from "@mui/material/CircularProgress";

interface Project {
  id: number;
  name: string;
  startDate: Date;
  status?: string;
}

interface SecurityData {
  vulnerabilities: number;
  severityDistribution: { [severity: string]: number };
}

interface UserData {
  projects: Project[];
  securityData: { [projectName: string]: SecurityData };
}

export default function SecurityEngineerDashboard() {
  const [tab, setTab] = useState<"projects" | "grafana" | "upload">("projects");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
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
    // Reset the state when switching tabs
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

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-800 to-blue-600 text-white">
      <Code className="w-16 h-16 text-cyan-300 mb-4" />
      <h1 className="text-4xl font-bold">Security Engineer Dashboard</h1>
      <p className="text-gray-200 mt-2 mb-8">Monitor and manage security vulnerabilities efficiently.</p>

      <div className="flex mb-6 bg-gray-800 rounded-lg overflow-hidden">
        {[
          { tabId: "projects", icon: FolderKanban, label: "Projects" },
          { tabId: "grafana", icon: Monitor, label: "Grafana" },
          { tabId: "upload", icon: UploadCloud, label: "Upload Script" },
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          {tab === "projects" && userData && (
            <>
              <h2 className="text-xl font-semibold mb-4">My Projects</h2>
              {userData.projects.length === 0 ? (
                <p className="text-center text-gray-400">You are not assigned to any projects yet.</p>
              ) : (
                <div className="space-y-4">
                  {userData.projects.map((project) => (
                    <div
                      key={project.id}
                      className={`p-4 border border-gray-700 rounded-md cursor-pointer transition-colors ${
                        selectedProject === project.name ? "bg-gray-700" : "hover:bg-gray-700"}`}
                      onClick={() => setSelectedProject(project.name)}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-400">Project Name:</p>
                        <p>{project.name}</p>
                        <p className="text-sm text-gray-400">Start Date:</p>
                        <p>{new Date(project.startDate).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-400">Status:</p>
                        <p>{project.status || "Not specified"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === "grafana" && (
            <div className="text-center py-8 text-gray-400">
              <Monitor className="w-12 h-12 mb-3 mx-auto" />
              <p>Access the Grafana dashboard to view detailed system analytics.</p>
              <Link
                href="http://localhost:4000/d/security-test-dashboard/security-test-dashboard?orgId=1"
                target="_blank"
              >
                <button className="mt-4 px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-500">
                  Open Grafana
                </button>
              </Link>
            </div>
          )}

          {tab === "upload" && /*userData && */(
            <>
              <FileUpload onChange={handleFileUpload} />
              {files.length > 0 && (
                <div className="flex justify-center">
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
                    <Link href="http://localhost:4000/d/security-test-dashboard/security-test-dashboard?orgId=1" target="_blank">
                      <button className="px-6 py-2 bg-blue-700 text-white text-2xl border-2 border-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105">
                        Done
                      </button>
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center">
          {/*(tab === "projects" && selectedProject) || (tab === "upload" && selectedProject)*/
           selectedProject ? (
            <>
              <h2 className="text-xl font-semibold mb-6">{selectedProject} Security Data</h2>
              <p>Failed Tests %:</p>
            </>
          ) : (
            <div className="text-center text-gray-400">
              <BarChart2 className="w-12 h-12 mb-3 mx-auto" />
              <p>Please select a project to view project data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
