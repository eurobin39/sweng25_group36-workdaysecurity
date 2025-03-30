'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  AlarmClock,
  Monitor,
  BarChart,
  Users2,
  UserPlus,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  getManagerDashboardData,
  assignUserToTeam,
  assignUserToProject,
} from "./actions";

interface User {
  id: number;
  username: string;
  role : string;
  teamId?: number | null;
  projects: { id: number; name: string }[];
}


interface Team {
  id: number;
  name: string;
}

interface SimpleUser {
  id: number;
  username: string;
  teamId?: number | null;
}

interface Project {
  id: number;
  name: string;
  users: SimpleUser[];
  repository: string;
}

interface Vulnerability {
  id: number;
  title: string;
  projectId: number;
}

interface DashboardData {
  users: User[];
  teams: Team[];
  projects: Project[];
  vulnerabilities: Vulnerability[];
}

export default function ManagerDashboard() {
  const [tab, setTab] = useState<
    "projects" | "urgent" | "grafana" | "noTeamUsers" | "manageTeams"
  >("projects");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [data, setData] = useState<DashboardData>({
    users: [],
    teams: [],
    projects: [],
    vulnerabilities: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const res = await getManagerDashboardData();
      setData(res);
    };
    fetchData();
  }, []);

  const noTeamUsers = data.users.filter((u) => !u.teamId);

  const getGrafanaUrl = (repoName: string) => {
    const slug = repoName.toLowerCase().replace(/\s+/g, "-");
    return `http://localhost:4000/d/software-test-dashboard/software-test-dashboards?orgId=1&var-repository=${slug}`;
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role.toLowerCase()) {
      case "software engineer":
        return "bg-emerald-200 text-emerald-800";
      case "security engineer":
        return "bg-sky-200 text-sky-800";
      case "manager":
        return "bg-violet-200 text-violet-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role.toLowerCase()) {
      case "software engineer":
        return "bg-emerald-200 text-emerald-800";
      case "security engineer":
        return "bg-sky-200 text-sky-800";
      case "manager":
        return "bg-violet-200 text-violet-800";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };
  
  
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 to-purple-600 text-white">
      <BarChart className="w-16 h-16 text-pink-300 mb-4" />
      <h1 className="text-4xl font-bold">Manager Dashboard</h1>

      <div className="flex mb-8 mt-6 bg-gray-800 rounded-lg overflow-hidden">
        {[
          { id: "projects", icon: FolderKanban, label: "Projects" },
          { id: "urgent", icon: AlarmClock, label: "Urgent Tasks" },
          { id: "grafana", icon: Monitor, label: "Grafana" },
          { id: "noTeamUsers", icon: Users2, label: "No-Team Users" },
          { id: "manageTeams", icon: UserPlus, label: "Manage Teams" },
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id as any)}
            className={`px-6 py-3 flex items-center ${
              tab === id ? "bg-pink-700 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            <Icon className="w-5 h-5 mr-2" />
            {label}
          </button>
        ))}
      </div>

      <div className="w-full max-w-6xl bg-gray-800 p-6 rounded-xl shadow-xl">
      {tab === "projects" && (
  <>
    <h2 className="text-2xl font-semibold mb-4 text-center">Projects</h2>
    <input
      type="text"
      placeholder="Search projects..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full mb-6 px-4 py-2 rounded-lg bg-gray-700 text-white"
    />

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
      {data.projects
        .filter((p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((project) => (
          <div
            key={project.id}
            className="w-full max-w-md bg-gray-700 p-5 rounded-xl shadow hover:bg-gray-600 transition-all flex flex-col justify-between"
          >
            
            <h3 className="text-xl font-bold text-white text-center mb-3">
              {project.name}
            </h3>

            
            <div className="border-b border-gray-500 mb-3" />

            
            <div className="mb-4 text-sm text-gray-300 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Team Members</span>
                <span className="bg-pink-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {project.users.length}
                </span>
              </div>

              {project.users.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.users.map((u) => (
                    <span
                      key={u.id}
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getRoleBadgeStyle(
                        (u as any).role || "Unknown"
                      )}`}
                    >
                      {(u as any).username}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No members assigned.</p>
              )}
            </div>

            
            <div className="mt-auto text-center">
              <Link href={getGrafanaUrl(project.repository)} target="_blank">
                <button className="px-4 py-2 bg-pink-700 hover:bg-pink-600 text-sm rounded shadow font-semibold">
                  View Grafana
                </button>
              </Link>
            </div>
          </div>
        ))}
    </div>
  </>
)}



{tab === "urgent" && (
  <>
    <h2 className="text-2xl font-semibold mb-6 text-center">Urgent Vulnerabilities</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <div className="col-span-1 bg-gray-800 p-4 rounded-xl">
        <h3 className="text-lg font-semibold mb-4 text-center">Projects</h3>
        <div className="space-y-3">
          {data.projects.map((project) => {
            const related = data.vulnerabilities.filter(
              (v) => v.projectId === project.id
            );
            const hasIssues = related.length > 0;
            return (
              <button
                key={project.id}
                onClick={() => setExpandedUserId(project.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  expandedUserId === project.id
                    ? "border-pink-500 bg-gray-700"
                    : "border-gray-600 bg-gray-800"
                } hover:bg-gray-700`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">{project.name}</span>
                  {hasIssues ? (
                    <span className="bg-red-600 text-red-100 text-xs font-bold px-2 py-0.5 rounded-full">
                      {related.length} Issue{related.length > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="bg-emerald-600 text-emerald-100 text-xs font-bold px-2 py-0.5 rounded-full">
                      No Issues
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      
      <div className="col-span-2 bg-gray-800 p-6 rounded-xl">
        {expandedUserId ? (
          <>
            <h3 className="text-xl font-bold mb-4 text-center">
              Vulnerabilities in "{data.projects.find(p => p.id === expandedUserId)?.name}"
            </h3>
            {data.vulnerabilities.filter(v => v.projectId === expandedUserId).length > 0 ? (
              <ul className="space-y-3">
                {data.vulnerabilities
                  .filter((v) => v.projectId === expandedUserId)
                  .map((vuln) => (
                    <li
                      key={vuln.id}
                      className="bg-red-600 text-red-100 p-3 rounded-md text-sm font-semibold"
                    >
                      {vuln.title}
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-center text-gray-400">No urgent issues in this project.</p>
            )}
          </>
        ) : (
          <p className="text-center text-gray-400">
            Select a project to view its vulnerabilities.
          </p>
        )}
      </div>
    </div>
  </>
)}


        {tab === "grafana" && (
          <div className="text-center py-12">
            <Monitor className="w-12 h-12 mb-4 mx-auto text-pink-300" />
            <h2 className="text-xl font-semibold mb-4">General Grafana Dashboard</h2>
            <Link
              href="http://localhost:4000/d/security-test-manager-dashboard/security-test-manager-dashboard?orgId=1"
              target="_blank"
            >
              <button className="px-6 py-3 bg-pink-700 hover:bg-pink-500 rounded-lg font-semibold shadow-lg">
                Open General Dashboard
              </button>
            </Link>
          </div>
        )}

{tab === "noTeamUsers" && (
  <div className="space-y-4">
    <h2 className="text-2xl font-semibold mb-4 text-center">
      Users Without Team or Projects
    </h2>

    <input
      type="text"
      placeholder="Search users..."
      value={userSearch}
      onChange={(e) => setUserSearch(e.target.value)}
      className="w-full mb-6 px-4 py-2 rounded-lg bg-gray-700 text-white"
    />

    {data.users
      .filter(
        (u) =>
          (!u.teamId || u.projects.length === 0) &&
          u.username.toLowerCase().includes(userSearch.toLowerCase())
      )
      .map((user) => (
        <div key={user.id} className="bg-gray-700 p-4 rounded-lg space-y-3">
          
          <div className="text-center font-medium">
            <span
              className={`${getRoleBadgeClass(
                user.role
              )} text-xs font-semibold px-2 py-0.5 rounded-full mr-2`}
            >
              {user.role}
            </span>
            {user.username}
          </div>

          
          <div className="text-center">
            <label className="block text-sm mb-1 text-gray-300">
              Assign to Team:
            </label>
            <select
              value={user.teamId ?? ""}
              onChange={async (e) => {
                const newTeamId = e.target.value
                  ? Number(e.target.value)
                  : null;
                await assignUserToTeam(user.id, newTeamId);
                const updated = await getManagerDashboardData();
                setData(updated);
              }}
              className="bg-gray-800 text-white rounded px-3 py-1 w-full max-w-xs border border-gray-600"
            >
              <option value="">No Team</option>
              {data.teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          
          <div>
            <label className="block text-sm mb-1 text-gray-300 text-center">
              Assign to Projects:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 px-2">
              {data.projects.map((project) => {
                const isAssigned = user.projects.some(
                  (p) => p.id === project.id
                );
                return (
                  <label
                    key={project.id}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={isAssigned}
                      onChange={async (e) => {
                        const updatedProjects = e.target.checked
                          ? [...user.projects.map((p) => p.id), project.id]
                          : user.projects
                              .map((p) => p.id)
                              .filter((id) => id !== project.id);
                        await assignUserToProject(user.id, updatedProjects);
                        const updated = await getManagerDashboardData();
                        setData(updated);
                      }}
                      className="form-checkbox h-4 w-4 text-pink-500 rounded"
                    />
                    <span>{project.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    {data.users.filter((u) => !u.teamId || u.projects.length === 0).length === 0 && (
      <p className="text-gray-400 text-center">
        All users have teams and project assignments.
      </p>
    )}
  </div>
)}

{tab === "manageTeams" && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4 text-center">Manage Teams</h2>
            <input
              type="text"
              placeholder="Search users..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full mb-6 px-4 py-2 rounded-lg bg-gray-700 text-white"
            />

            
            <div className="grid grid-cols-3 gap-4 items-center bg-gray-900 p-2 rounded-lg">
              <div className="text-center font-semibold border-r border-gray-700">User Name</div>
              <div className="text-center font-semibold border-r border-gray-700">Team Assignment</div>
              <div className="text-center font-semibold">Project Management</div>
            </div>

            <div className="grid gap-4">
              {data.users
                .filter((u) =>
                  u.username.toLowerCase().includes(userSearch.toLowerCase())
                )
                .map((user) => (
                  <div key={user.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      
                      <div className="text-center font-medium border-r border-gray-600 pr-4">
                        <span
                          className={`${getRoleBadgeClass(user.role)} text-xs font-semibold px-2 py-0.5 rounded-full mr-2`}
                        >
                          {user.role}
                        </span>
                        {user.username}
                      </div>


                      
                      <div className="text-center border-r border-gray-600 pr-4">
                        <select
                          value={user.teamId ?? ""}
                          onChange={async (e) => {
                            const newTeamId = e.target.value
                              ? Number(e.target.value)
                              : null;
                            await assignUserToTeam(user.id, newTeamId);
                            const updated = await getManagerDashboardData();
                            setData(updated);
                          }}
                          className="bg-gray-800 text-white rounded px-3 py-1 w-full max-w-xs border border-gray-600"
                        >
                          <option value="">No Team</option>
                          {data.teams.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      
                      <div className="text-center">
                        <button
                          onClick={() =>
                            setExpandedUserId(
                              expandedUserId === user.id ? null : user.id
                            )
                          }
                          className="px-3 py-1 bg-pink-600 hover:bg-pink-500 rounded text-sm flex items-center justify-center mx-auto"
                        >
                          {expandedUserId === user.id ? (
                            <ChevronUp className="w-4 h-4 mr-1" />
                          ) : (
                            <ChevronDown className="w-4 h-4 mr-1" />
                          )}
                          Projects
                        </button>
                      </div>
                    </div>

                    
                    {expandedUserId === user.id && (
                      <div className="mt-4 pt-3 border-t border-gray-600">
                        <div className="p-3 bg-gray-800 rounded-lg">
                          <h3 className="text-sm font-semibold mb-2 text-center">
                            Project Assignment (Check/Uncheck to assign)
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                            {data.projects.map((project) => {
                              const isAssigned = user.projects.some(
                                (p) => p.id === project.id
                              );
                              return (
                                <label
                                  key={project.id}
                                  className="flex items-center space-x-2 text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isAssigned}
                                    onChange={async (e) => {
                                      const updatedProjects = e.target.checked
                                        ? [...user.projects.map((p) => p.id), project.id]
                                        : user.projects
                                            .map((p) => p.id)
                                            .filter((id) => id !== project.id);
                                      await assignUserToProject(user.id, updatedProjects);
                                      const updated = await getManagerDashboardData();
                                      setData(updated);
                                    }}
                                    className="form-checkbox h-4 w-4 text-pink-500 rounded"
                                  />
                                  <span>{project.name}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}