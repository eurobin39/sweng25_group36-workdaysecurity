"use client";

import { Code, Users2, FolderKanban, BarChart2, Monitor } from "lucide-react";
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
}

interface TeamContribution {
  commits: number;
  percentage: number;
  commitActivity: number[];
}

interface ContributionData {
  totalCommits: number;
  contributionPercentage: number;
  teamCommits: { [teamName: string]: TeamContribution };
}

interface UserData {
  teams: Team[];
  projects: Project[];
  contributions: ContributionData;
}

export default function SoftwareEngineerDashboard() {
  const [tab, setTab] = useState<"teams" | "projects" | "grafana">("teams");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentContribution, setCurrentContribution] = useState<TeamContribution>({
    commits: 0,
    percentage: 0,
    commitActivity: [0, 0, 0, 0, 0],
  });
  const [animateGraph, setAnimateGraph] = useState(false);

  useEffect(() => {
    getSoftwareEngineerDashboardData().then((data) => {
      setUserData(data);
    });
  }, []);

  useEffect(() => {
    if (selectedTeam && userData?.contributions.teamCommits[selectedTeam]) {
      setCurrentContribution(userData.contributions.teamCommits[selectedTeam]);
    }
  }, [selectedTeam, userData]);

  const maxCommits = Math.max(...currentContribution.commitActivity, 1);
  const graphData = currentContribution.commitActivity.map(
    (c) => (c / maxCommits) * 100
  );

  useEffect(() => {
    setAnimateGraph(false);
    const timer = setTimeout(() => setAnimateGraph(true), 500);
    return () => clearTimeout(timer);
  }, [tab, selectedTeam, selectedProject]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-800 to-green-600 text-white">
      <Code className="w-16 h-16 text-lime-300 mb-4" />
      <h1 className="text-4xl font-bold">Software Engineer Dashboard</h1>
      <p className="text-gray-200 mt-2 mb-8">Develop, test, and deploy applications efficiently.</p>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          {tab === "teams" && userData && (
            <>
              <h2 className="text-xl font-semibold mb-4">My Teams</h2>
              {userData.teams.length === 0 ? (
                <p className="text-center text-gray-400">You are not assigned to any teams yet.</p>
              ) : (
                <div className="space-y-4">
                  {userData.teams.map((team) => (
                    <div
                      key={team.id}
                      className={`p-4 border border-gray-700 rounded-md cursor-pointer transition-colors ${
                        selectedTeam === team.name ? "bg-gray-700" : "hover:bg-gray-700"
                      }`}
                      onClick={() => setSelectedTeam(team.name)}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-400">Team Name:</p>
                        <p>{team.name}</p>
                        <p className="text-sm text-gray-400">Description:</p>
                        
                        <p className="text-sm text-gray-400">Created At:</p>
                        
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

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
                        selectedProject === project.name ? "bg-gray-700" : "hover:bg-gray-700"
                      }`}
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
                <button className="mt-4 px-6 py-3 bg-lime-700 text-white font-semibold rounded-lg hover:bg-lime-500">
                  Open Grafana
                </button>
              </Link>
            </div>
          )}
        </div>

        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center">
          {(tab === "teams" && selectedTeam) || (tab === "projects" && selectedProject) ? (
            <>
              <h2 className="text-xl font-semibold mb-6">{selectedTeam || selectedProject} Contribution</h2>
              <div className="grid grid-cols-2 gap-4 w-full mb-6">
                <div>
                  <p className="text-sm text-gray-400">Total Commits:</p>
                  <p className="text-2xl font-bold">{currentContribution.commits}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Contribution %:</p>
                  <p className="text-2xl font-bold">{currentContribution.percentage}%</p>
                </div>
              </div>
              <div className="w-full">
                <h4 className="text-sm text-gray-400 mb-2">Commit Activity (Last 5 Days)</h4>
                <div className="flex items-end space-x-2 h-32">
                  {graphData.map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-xl"
                      style={{
                        height: animateGraph ? `${height}%` : "0%",
                        background: "linear-gradient(to top, #a3e635, #65a30d)",
                        transition: "height 0.8s ease-in-out",
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-400">
              <BarChart2 className="w-12 h-12 mb-3 mx-auto" />
              <p>Please select a team or project to view contribution data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
