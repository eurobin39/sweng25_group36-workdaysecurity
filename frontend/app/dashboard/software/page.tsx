"use client";

import { Code, Users2, FolderKanban, Monitor } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getSoftwareEngineerDashboardData } from "./action";

interface Team {
  id: number;
  name: string;
}

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

interface UserData {
  teams: Team[];
  projects: Project[];
}

export default function SoftwareEngineerDashboard() {
  const [tab, setTab] = useState<"teams" | "projects" | "grafana">("teams");
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    getSoftwareEngineerDashboardData().then(setUserData);
  }, []);

  const getGrafanaUrl = (repoName: string) => {
    const slug = repoName.toLowerCase().replace(/\s+/g, "-");
    return `http://localhost:4000/d/software-test-dashboard/software-test-dashboards?orgId=1&var-repository=${slug}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-800 to-green-600 text-white">
      <Code className="w-16 h-16 text-lime-300 mb-4" />
      <h1 className="text-4xl font-bold">Software Engineer Dashboard</h1>
      <p className="text-gray-200 mt-2 mb-8">Track your assigned projects and system dashboards.</p>

      <div className="flex mb-6 bg-gray-800 rounded-lg overflow-hidden">
        {[
          { tabId: "teams", icon: Users2, label: "Teams" },
          { tabId: "projects", icon: FolderKanban, label: "Projects" },
          { tabId: "grafana", icon: Monitor, label: "Grafana" },
        ].map(({ tabId, icon: Icon, label }) => (
          <button
            key={tabId}
            onClick={() => setTab(tabId as any)}
            className={`px-6 py-3 flex items-center ${
              tab === tabId ? "bg-lime-700 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            <Icon className="w-5 h-5 mr-2" />
            {label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-3xl bg-gray-800 p-6 rounded-xl shadow-lg">
        {tab === "teams" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">My Team</h2>
            {userData?.teams.length ? (
              <div className="p-4 bg-gray-700 rounded-md">
                <p className="text-lg font-bold mb-2">{userData.teams[0].name}</p>
                <h3 className="text-sm font-semibold text-gray-300">Team Members:</h3>
                <ul className="mt-2 list-disc list-inside text-sm text-gray-400">
                  {userData.projects.flatMap(p => p.members)
                    .filter((v, i, arr) => arr.findIndex(m => m.id === v.id) === i)
                    .map((member) => (
                      <li key={member.id}>{member.username}</li>
                    ))}
                </ul>
              </div>
            ) : (
              <p className="text-gray-400">You are not assigned to any team.</p>
            )}
          </>
        )}

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
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        project.latestStatus === "PASSED" ? "bg-green-600" : "bg-red-600"
                      }`}>
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
            <h2 className="text-2xl font-semibold mb-4 text-center">Grafana Dashboards</h2>
            {userData.projects.length === 0 ? (
              <p className="text-center text-gray-400">No projects available for Grafana.</p>
            ) : (
              <div className="space-y-4">
                {userData.projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex justify-between items-center bg-gray-700 p-4 rounded-lg shadow"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                      <p className="text-sm text-gray-400">
                        Start: {new Date(project.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-400">Status: {project.status || "N/A"}</p>
                    </div>
                    <Link href={getGrafanaUrl(project.repository)} target="_blank">
                      <button className="px-4 py-2 bg-lime-700 hover:bg-lime-500 rounded-md font-medium text-white shadow">
                        View Grafana
                      </button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}