"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

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

export async function getSoftwareEngineerDashboardData(): Promise<UserData> {
  const session = await getSession();
  const userId = session?.id;

  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      team: true,
      projects: {
        include: {
          users: {
            select: { id: true, username: true },
          },
          testResults: {
            orderBy: { timestamp: "desc" },
            take: 1,
            select: {
              repository: true,
              status: true,
              timestamp: true,
              vulnerability_found: true,
            },
          },
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  const projects = user.projects.map((project) => ({
    id: project.id,
    name: project.name,
    startDate: project.startDate,
    status: project.status ?? undefined,
    repository: project.testResults[0]?.repository ?? "unknown",
    latestStatus: project.testResults[0]?.status ?? "UNKNOWN",
    vulnFound: project.testResults[0]?.vulnerability_found ?? false,
    lastTestDate: project.testResults[0]?.timestamp ?? null,
    members: project.users,
  }));

  return {
    teams: user.team ? [{ id: user.team.id, name: user.team.name }] : [],
    projects,
  };
}
