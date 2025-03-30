"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

interface Project {
  id: number;
  name: string;
  startDate: Date;
  status?: string;
}

interface SecurityTestData {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testActivity: number[];
}

interface UserData {
  projects: Project[];
  securityTests: SecurityTestData;
}

export async function getSecurityEngineerDashboardData(): Promise<UserData> {
  const session = await getSession();
  const userId = session?.id;

  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      projects: true,
    },
  });

  if (!user) throw new Error("User not found");

  const projects = user.projects.map((project) => ({
    id: project.id,
    name: project.name,
    startDate: project.startDate,
    status: project.status || undefined,
  }));

  const totalTests = await db.security_test_results.count({
    where: {
      project: {
        users: {
          some: { id: userId },
        },
      },
    },
  });

  const passedTests = await db.security_test_results.count({
    where: {
      project: {
        users: {
          some: { id: userId },
        },
      },
      status: "passed",
    },
  });

  const failedTests = totalTests - passedTests;

  const testActivity = Array(5).fill(0);
  const now = new Date();

  const recentTests = await db.security_test_results.findMany({
    where: {
      project: {
        users: {
          some: { id: userId },
        },
      },
    },
    orderBy: { timestamp: "desc" },
  });

  recentTests.forEach((test) => {
    const date = new Date(test.timestamp);
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < 5) {
      testActivity[4 - diff]++;
    }
  });

  return {
    projects,
    securityTests: {
      totalTests,
      passedTests,
      failedTests,
      testActivity,
    },
  };
}
