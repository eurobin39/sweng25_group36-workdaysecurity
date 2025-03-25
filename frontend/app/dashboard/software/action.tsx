"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

// 반환 데이터 타입 정의
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

interface ContributionData {
  totalCommits: number;
  contributionPercentage: number;
  teamCommits: { [teamName: string]: { commits: number; percentage: number } };
  commitActivity: number[]; // 최근 5일간 커밋 활동 데이터
}

interface UserData {
  teams: Team[];
  projects: Project[];
  contributions: ContributionData;
}

export async function getCurrentUserTeamsAndProjects() {
  try {
    // 세션에서 현재 사용자 정보 가져오기
    const session = await getSession();
    const userId = session.id;

    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }

    // 사용자 조회 (팀과 프로젝트 포함)
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        teams: {
          include: {
            users: true, // 팀에 속한 사용자 정보 포함
          },
        },
        projects: {
          include: {
            users: true, // 프로젝트에 속한 사용자 정보 포함
          },
        },
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    // 전체 커밋 수 계산
    const totalCommits = await db.security_test_results.count({
      where: {
        project: {
          users: {
            some: { id: userId },
          },
        },
      },
    });

    // 팀별 커밋 수 계산 (최적화된 쿼리)
    const teamCommits: { [teamName: string]: { commits: number; percentage: number } } = {};
    for (const team of user.teams) {
      // 팀에 속한 프로젝트 ID 목록
      const projectIds = user.projects
        .filter((project) =>
          project.users.some((u) => team.users.some((tu) => tu.id === u.id))
        )
        .map((project) => project.id);

      // 팀에 연결된 프로젝트의 커밋 수
      const teamCommitsCount = await db.security_test_results.count({
        where: {
          projectId: {
            in: projectIds,
          },
        },
      });

      teamCommits[team.name] = {
        commits: teamCommitsCount,
        percentage: totalCommits > 0 ? Math.round((teamCommitsCount / totalCommits) * 100) : 0,
      };
    }

    // 최근 5일간 커밋 활동 데이터 계산
    const recentCommits = await db.security_test_results.findMany({
      where: {
        project: {
          users: {
            some: { id: userId },
          },
        },
      },
      orderBy: { timestamp: "desc" },
      take: 50, // 최근 50개 커밋을 가져와서 날짜별로 집계
      select: { timestamp: true },
    });

    const commitActivity = Array(5).fill(0); // 최근 5일간 커밋 수
    const now = new Date();
    recentCommits.forEach((commit) => {
      const commitDate = new Date(commit.timestamp);
      const dayDiff = Math.floor(
        (now.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (dayDiff >= 0 && dayDiff < 5) {
        commitActivity[4 - dayDiff] += 1; // 최근 날짜가 배열의 오른쪽에 오도록
      }
    });

    // 반환 데이터 구성
    const contributions: ContributionData = {
      totalCommits,
      contributionPercentage: 100, // 전체 기여도는 100%로 가정
      teamCommits,
      commitActivity,
    };

    return {
      success: true,
      data: {
        teams: user.teams,
        projects: user.projects,
        contributions,
      },
    };
  } catch (error) {
    console.error("Error fetching user teams and projects:", {
      error: error instanceof Error ? error.message : String(error),
      userId,
    });
    return { success: false, error: "Failed to fetch user teams and projects" };
  }
}

export async function getPendingUsers() {
  try {
    const users = await db.user.findMany({
      where: { role: "Pending" },
    });
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching pending users:", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error: "Failed to fetch pending users" };
  }
}

export async function getAllTeams() {
  try {
    const teams = await db.team.findMany({
      include: {
        users: true,
      },
    });
    return { success: true, teams };
  } catch (error) {
    console.error("Error fetching teams:", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error: "Failed to fetch teams" };
  }
}

export async function login(email: string, password: string) {
  try {
    // 사용자 조회
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) {
      return { success: false, error: "Invalid email or password" };
    }

    // 세션에 사용자 ID 저장
    const session = await getSession();
    session.id = user.id;
    await session.save();

    return { success: true, user };
  } catch (error) {
    console.error("Error during login:", {
      error: error instanceof Error ? error.message : String(error),
      email,
    });
    return { success: false, error: "Failed to login" };
  }
}

export async function logout() {
  try {
    const session = await getSession();
    await session.destroy();
    return { success: true };
  } catch (error) {
    console.error("Error during logout:", {
      error: error instanceof Error ? error.message : String(error),
    });
    return { success: false, error: "Failed to logout" };
  }
}