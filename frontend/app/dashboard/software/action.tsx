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
}

interface ContributionData {
  totalCommits: number;
  contributionPercentage: number;
  teamCommits: { [teamName: string]: { commits: number; percentage: number; commitActivity: number[] } };
}

interface UserData {
  teams: Team[];
  projects: Project[];
  contributions: ContributionData;
}

export async function getSoftwareEngineerDashboardData(): Promise<UserData> {
  const session = await getSession();
  const userId = session?.id;

  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      team: true,
      projects: true,
    },
  });

  if (!user) throw new Error("User not found");

  const team = user.team;
  const projects = user.projects.map((project) => ({
    id: project.id,
    name: project.name,
    startDate: project.startDate,
    status: project.status || undefined,
  }));

  const totalCommits = await db.security_test_results.count({
    where: {
      project: {
        users: {
          some: { id: userId },
        },
      },
    },
  });

  const teamCommits: ContributionData["teamCommits"] = {};

  if (team) {
    const fullTeam = await db.team.findUnique({
      where: { id: team.id },
    });

    const teamUsers = await db.user.findMany({
      where: { teamId: team.id },
      include: { projects: true },
    });

    const teamProjectIds = new Set<number>();
    teamUsers.forEach((u) => u.projects.forEach((p) => teamProjectIds.add(p.id)));

    const teamResults = await db.security_test_results.findMany({
      where: {
        projectId: { in: [...teamProjectIds] },
      },
      orderBy: { timestamp: "desc" },
    });

    const commitActivity = Array(5).fill(0);
    const now = new Date();

    teamResults.forEach((res) => {
      const date = new Date(res.timestamp);
      const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diff >= 0 && diff < 5) {
        commitActivity[4 - diff]++;
      }
    });

    if (fullTeam) {
      teamCommits[fullTeam.name] = {
        commits: teamResults.length,
        percentage: totalCommits ? Math.round((teamResults.length / totalCommits) * 100) : 0,
        commitActivity,
      };
    }
  }

  return {
    teams: team
      ? [
          {
            id: team.id,
            name: team.name,
          },
        ]
      : [],
    projects,
    contributions: {
      totalCommits,
      contributionPercentage: 100,
      teamCommits,
    },
  };
}
