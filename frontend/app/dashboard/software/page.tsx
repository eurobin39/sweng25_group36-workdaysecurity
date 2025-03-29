"use client";

import { Code, Users2, FolderKanban, BarChart2, Monitor } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Define types for our data structures
interface Team {
  id: number;
  name: string;
  description?: string | null;
  createdAt: Date;
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
  commitActivity: number[]; // 팀별 최근 5일간 커밋 수
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
  const [animateGraph, setAnimateGraph] = useState(false);
  const [currentContribution, setCurrentContribution] = useState<{
    commits: number;
    percentage: number;
    commitActivity: number[];
  }>({
    commits: 0,
    percentage: 0,
    commitActivity: [0, 0, 0, 0, 0],
  });

  // 가짜 팀 데이터
  const fakeTeams: Team[] = [
    {
      id: 1,
      name: "Team Alpha",
      description: "A team focused on innovation and development.",
      createdAt: new Date("2024-01-15"),
    },
    {
      id: 2,
      name: "Team Beta",
      description: "A team dedicated to quality assurance and testing.",
      createdAt: new Date("2024-03-10"),
    },
  ];

  // 가짜 프로젝트 데이터
  const fakeProjects: Project[] = [
    {
      id: 1,
      name: "Project X",
      startDate: new Date("2024-02-01"),
      status: "In Progress",
    },
    {
      id: 2,
      name: "Project Y",
      startDate: new Date("2024-04-01"),
      status: "Planning",
    },
  ];

  // 가짜 Contribution 데이터
  const fakeContributions: ContributionData = {
    totalCommits: 150,
    contributionPercentage: 100,
    teamCommits: {
      "Team Alpha": {
        commits: 90,
        percentage: 60,
        commitActivity: [3, 6, 9, 5, 7], // Team Alpha의 최근 5일간 커밋 수
      },
      "Team Beta": {
        commits: 60,
        percentage: 40,
        commitActivity: [0, 0, 6, 1, 0], // Team Beta의 최근 5일간 커밋 수
      },
    },
  };

  // 가짜 데이터로 userData 설정
  const [userData] = useState<UserData>({
    teams: fakeTeams,
    projects: fakeProjects,
    contributions: fakeContributions,
  });

  // 선택된 팀에 따라 기여도 데이터 계산
  const getContribution = () => {
    if (!selectedTeam) {
      // 선택된 팀이 없을 경우 기본값 반환
      return {
        commits: 0,
        percentage: 0,
        commitActivity: [0, 0, 0, 0, 0],
      };
    }

    const teamContribution = userData.contributions.teamCommits?.[selectedTeam] || {
      commits: 0,
      percentage: 0,
      commitActivity: [0, 0, 0, 0, 0],
    };
    return {
      commits: teamContribution.commits,
      percentage: teamContribution.percentage,
      commitActivity: teamContribution.commitActivity,
    };
  };

  // selectedTeam이 변경될 때 currentContribution 업데이트
  useEffect(() => {
    const newContribution = getContribution();
    setCurrentContribution(newContribution);
  }, [selectedTeam]); // selectedTeam이 변경될 때마다 실행

  // 커밋 활동 그래프 데이터 정규화 (최대 높이를 100%로 설정)
  const maxCommits = Math.max(...currentContribution.commitActivity, 1); // 0으로 나누는 경우 방지
  const graphData = currentContribution.commitActivity.map(
    (commits) => (commits / maxCommits) * 100
  );

  // 그래프 애니메이션 트리거
  useEffect(() => {
    setAnimateGraph(false); // 탭 변경 시 애니메이션 초기화
    const timer = setTimeout(() => setAnimateGraph(true), 500); // 약간의 지연 후 애니메이션 시작
    return () => clearTimeout(timer);
  }, [tab, selectedTeam, selectedProject]); // 탭, 선택된 팀, 선택된 프로젝트가 변경될 때마다 애니메이션 재실행

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-800 to-green-600 text-white">
      <Code className="w-16 h-16 text-lime-300 mb-4" />
      <h1 className="text-4xl font-bold">Software Engineer Dashboard</h1>
      <p className="text-gray-200 mt-2 mb-8">Develop, test, and deploy applications efficiently.</p>

      {/* Tabs */}
      <div className="flex mb-6 bg-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setTab("teams")}
          className={`px-6 py-3 flex items-center ${
            tab === "teams" ? "bg-lime-700 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          <Users2 className="w-5 h-5 mr-2" />
          Teams
        </button>
        <button
          onClick={() => setTab("projects")}
          className={`px-6 py-3 flex items-center ${
            tab === "projects" ? "bg-lime-700 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          <FolderKanban className="w-5 h-5 mr-2" />
          Projects
        </button>
        <button
          onClick={() => setTab("grafana")}
          className={`px-6 py-3 flex items-center ${
            tab === "grafana" ? "bg-lime-700 text-white" : "bg-gray-700 text-gray-300"
          }`}
        >
          <Monitor className="w-5 h-5 mr-2" />
          Grafana
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Left column: Teams, Projects, or Grafana */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          {tab === "teams" ? (
            <>
              <div className="flex items-center mb-4">
                <Users2 className="w-6 h-6 text-lime-300 mr-2" />
                <h2 className="text-xl font-semibold">My Teams</h2>
              </div>

              {userData.teams.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <Users2 className="w-12 h-12 mb-3 mx-auto" />
                  <p>You are not assigned to any teams yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userData.teams.map((team) => (
                    <div
                      key={team.id}
                      className={`p-4 border border-gray-700 rounded-md cursor-pointer transition-colors ${
                        selectedTeam === team.name ? "bg-gray-700" : "hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        setTab("teams");
                        setSelectedTeam(team.name);
                      }}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        <p className="text-sm text-gray-400">Team Name:</p>
                        <p>{team.name}</p>

                        <p className="text-sm text-gray-400">Description:</p>
                        <p>{team.description || "No description available"}</p>

                        <p className="text-sm text-gray-400">Created At:</p>
                        <p>{new Date(team.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : tab === "projects" ? (
            <>
              <div className="flex items-center mb-4">
                <FolderKanban className="w-6 h-6 text-lime-300 mr-2" />
                <h2 className="text-xl font-semibold">My Projects</h2>
              </div>

              {userData.projects.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FolderKanban className="w-12 h-12 mb-3 mx-auto" />
                  <p>You are not assigned to any projects yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {userData.projects.map((project) => (
                    <div
                      key={project.id}
                      className={`p-4 border border-gray-700 rounded-md cursor-pointer transition-colors ${
                        selectedProject === project.name ? "bg-gray-700" : "hover:bg-gray-700"
                      }`}
                      onClick={() => {
                        setTab("projects");
                        setSelectedProject(project.name);
                      }}
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
          ) : (
            <>
              <div className="flex items-center mb-4">
                <Monitor className="w-6 h-6 text-lime-300 mr-2" />
                <h2 className="text-xl font-semibold">Grafana Dashboard</h2>
              </div>
              <div className="text-center py-8 text-gray-400">
                <Monitor className="w-12 h-12 mb-3 mx-auto" />
                <p>Access the Grafana dashboard to view detailed system analytics.</p>
              </div>
            </>
          )}
        </div>

        {/* Right column: Team Project Analysis or Grafana Link */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center">
          {tab === "grafana" ? (
            <>
              <h2 className="text-xl font-semibold mb-6">System Analytics</h2>
              <Link
                href="http://localhost:4000/d/security-test-dashboard/security-test-dashboard?orgId=1&from=now-6h&to=now&timezone=browser"
                target="_blank"
              >
                <button className="px-6 py-3 bg-lime-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-lime-500 hover:scale-105 w-60">
                  Open Grafana
                </button>
              </Link>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-6">Team Project Analysis</h2>

              {tab === "teams" && !selectedTeam ? (
                <div className="text-center py-8 text-gray-400">
                  <BarChart2 className="w-12 h-12 mb-3 mx-auto" />
                  <p>Please select a team to view contribution data.</p>
                </div>
              ) : tab === "projects" && !selectedProject ? (
                <div className="text-center py-8 text-gray-400">
                  <BarChart2 className="w-12 h-12 mb-3 mx-auto" />
                  <p>Please select a project to view contribution data.</p>
                </div>
              ) : (
                <>
                  {/* Contribution Summary */}
                  <div className="w-full mb-6">
                    <div className="flex items-center mb-2">
                      <BarChart2 className="w-6 h-6 text-lime-300 mr-2" />
                      <h3 className="text-lg font-semibold">
                        {selectedTeam
                          ? `${selectedTeam} Contribution`
                          : selectedProject
                          ? `${selectedProject} Contribution`
                          : "Contribution"}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Total Commits:</p>
                        <p className="text-2xl font-bold">{currentContribution.commits}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Contribution %:</p>
                        <p className="text-2xl font-bold">{currentContribution.percentage}%</p>
                      </div>
                    </div>
                  </div>

                  {/* Commit Activity Graph */}
                  <div className="w-full">
                    <h4 className="text-sm text-gray-400 mb-2">Commit Activity (Last 5 Days)</h4>
                    <div className="flex items-end space-x-2 h-32">
                      {graphData.map((height, index) => (
                        <div
                          key={index}
                          className="flex-1 rounded-t-xl" // 모든 팀에 대해 동일한 막대형 그래프
                          style={{
                            height: animateGraph ? `${height}%` : "0%", // 높이 애니메이션
                            background: "linear-gradient(to top, #a3e635, #65a30d)", // 초록색 그라데이션
                            transition: "height 0.8s ease-in-out", // 부드러운 높이 변화
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
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}