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