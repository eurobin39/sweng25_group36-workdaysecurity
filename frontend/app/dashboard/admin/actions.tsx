"use server";

import db from "@/lib/db";

/**
 * Find a user by username
 */
export async function findUser(username: string) {
  try {
    // Make sure username is provided
    if (!username || username.trim() === "") {
      return { 
        success: false, 
        error: "Username is required" 
      };
    }

    // Find the user in the database
    const user = await db.user.findUnique({
      where: {
        username: username.trim(),
      },
      select: {
        id: true,
        username: true,
        email: true, 
        role: true,
        // Don't return the password
      },
    });

    if (!user) {
      return { 
        success: false, 
        error: "User not found" 
      };
    }

    return { 
      success: true, 
      user 
    };
  } catch (error) {
    console.error("Error finding user:", error);
    return { 
      success: false, 
      error: "An error occurred while searching for the user" 
    };
  }
}

/**
 * Get all users with "Pending" role
 */
export async function getPendingUsers() {
  try {
    const pendingUsers = await db.user.findMany({
      where: {
        role: "Pending",
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
      orderBy: {
        id: 'desc', // Show newest users first
      },
    });

    return { 
      success: true, 
      users: pendingUsers 
    };
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return { 
      success: false, 
      error: "An error occurred while fetching pending users" 
    };
  }
}

/**
 * Update a user's role
 */
export async function updateUserRole(username: string, newRole: string) {
  try {
    // Make sure all required data is provided
    if (!username || username.trim() === "") {
      return { 
        success: false, 
        error: "Username is required" 
      };
    }

    if (!newRole || newRole.trim() === "") {
      return { 
        success: false, 
        error: "New role is required" 
      };
    }

    // Validate the role is one of the acceptable values
    const validRoles = ["Pending", "Security Engineer", "Software Engineer", "Manager", "Admin"];
    if (!validRoles.includes(newRole)) {
      return { 
        success: false, 
        error: "Invalid role selected" 
      };
    }

    // Check if the user exists
    const existingUser = await db.user.findUnique({
      where: {
        username: username.trim(),
      },
      select: {
        id: true,
      },
    });

    if (!existingUser) {
      return { 
        success: false, 
        error: "User not found" 
      };
    }

    // Update the user's role
    await db.user.update({
      where: {
        username: username.trim(),
      },
      data: {
        role: newRole,
      },
    });

    return { 
      success: true, 
      message: `Successfully updated ${username}'s role to ${newRole}` 
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { 
      success: false, 
      error: "An error occurred while updating the user's role" 
    };
  }
}

/**
 * Create a new team
 */
export async function createTeam(teamName: string) {
  try {
    if (!teamName || teamName.trim() === "") {
      return {
        success: false,
        error: "Team name is required"
      };
    }

    // Check if team already exists
    const existingTeam = await db.team.findUnique({
      where: {
        name: teamName.trim(),
      },
    });

    if (existingTeam) {
      return {
        success: false,
        error: "A team with this name already exists"
      };
    }

    // Create the new team
    const team = await db.team.create({
      data: {
        name: teamName.trim(),
      },
    });

    return {
      success: true,
      team
    };
  } catch (error) {
    console.error("Error creating team:", error);
    return {
      success: false,
      error: "An error occurred while creating the team"
    };
  }
}

/**
 * Get all teams
 */
export async function getAllTeams() {
  try {
    const teams = await db.team.findMany({
      include: {
        users: {
          select: {
            id: true,
            username: true,
            email: true,
            role: true,
          },
        },
      },
    });

    return {
      success: true,
      teams
    };
  } catch (error) {
    console.error("Error fetching teams:", error);
    return {
      success: false,
      error: "An error occurred while fetching teams"
    };
  }
}

/**
 * Update a user's team
 */
export async function updateUserTeam(username: string, teamName: string) {
  try {
    if (!username || username.trim() === "") {
      return {
        success: false,
        error: "Username is required"
      };
    }

    if (!teamName || teamName.trim() === "") {
      return {
        success: false,
        error: "Team name is required"
      };
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: {
        username: username.trim(),
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found"
      };
    }

    // Check if team exists
    const team = await db.team.findUnique({
      where: {
        name: teamName.trim(),
      },
    });

    if (!team) {
      return {
        success: false,
        error: "Team not found"
      };
    }

    // Update user's team
    await db.user.update({
      where: {
        username: username.trim(),
      },
      data: {
        team: {
          connect: {
            name: teamName.trim(),
          },
        },
      },
    });

    return {
      success: true,
      message: `Successfully updated ${username}'s team to ${teamName}`
    };
  } catch (error) {
    console.error("Error updating user team:", error);
    return {
      success: false,
      error: "An error occurred while updating the user's team"
    };
  }
}

/**
 * Remove a user from their team
 */
export async function removeUserFromTeam(username: string) {
  try {
    if (!username || username.trim() === "") {
      return {
        success: false,
        error: "Username is required"
      };
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: {
        username: username.trim(),
      },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found"
      };
    }

    // Remove user from team
    await db.user.update({
      where: {
        username: username.trim(),
      },
      data: {
        team: {
          disconnect: true,
        },
      },
    });

    return {
      success: true,
      message: `Successfully removed ${username} from their team`
    };
  } catch (error) {
    console.error("Error removing user from team:", error);
    return {
      success: false,
      error: "An error occurred while removing the user from their team"
    };
  }
}