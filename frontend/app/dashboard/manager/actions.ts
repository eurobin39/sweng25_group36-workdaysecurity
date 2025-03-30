'use server';
import db from "@/lib/db";

export async function getManagerDashboardData() {
  const [users, teams, rawProjects, assertions] = await Promise.all([
    db.user.findMany({
      select: {
        id: true,
        username: true,
        teamId: true,
        role: true,
        projects: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    db.team.findMany({
      select: {
        id: true,
        name: true,
      },
    }),
    db.project.findMany({
      include: {
        users: {
          select: {
            id: true,
            username: true,
            role: true,
            teamId: true,
          },
        },
        testResults: {
          orderBy: { timestamp: "desc" },
          take: 1,
          select: {
            repository: true,
          },
        },
      },
    }),
    db.assertions.findMany({
      where: {
        risk: "HIGH",
      },
      include: {
        securityTestResult: {
          select: {
            projectId: true,
          },
        },
      },
    }),
  ]);

  const projects = rawProjects.map((project) => ({
    id: project.id,
    name: project.name,
    users: project.users,
    repository: project.testResults[0]?.repository ?? "unknown", // ✅ 필수 필드로 가공
  }));

  const vulnerabilities = assertions.map((a) => ({
    id: a.id,
    title: a.name,
    projectId: a.securityTestResult.projectId,
    severity: "high" as const,
  }));

  return {
    users,
    teams,
    projects,
    vulnerabilities,
  };
}



export async function assignUserToTeam(userId: number, teamId: number | null) {
  await db.user.update({
    where: { id: userId },
    data: { teamId },
  });
}


export async function assignUserToProject(userId: number, projectIds: number[]) {
  await db.user.update({
    where: { id: userId },
    data: {
      projects: {
        set: projectIds.map((id) => ({ id })), 
      },
    },
  });
}

