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
const checkEmailExists = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email,
        },
        select: {
            id: true,
        },
    });
    return Boolean(user);
};

const formSchema = z.object({
    email: z
        .string()
        .email()
        .toLowerCase()
        .refine(checkEmailExists, "User does not exist"),
    password: z
        .string()
        // .min(10)
        // .regex(
        //     PASSWORD_REGEX,
        //     "Password must have lowercase, UPPERCASE, number, and special character!"
        // ),
});

export async function login(prevState: any, formData: FormData) {
    const data = {
        email: formData.get("email"),
        password: formData.get("password"),
    };

    const result = await formSchema.spa(data);

    if (!result.success) {
        return result.error.flatten();
    } else {
        const user = await db.user.findUnique({
            where: {
                email: result.data.email,
            },
            select: {
                id: true,
                password: true,
                role: true, // Role check
            },
        });

        const ok = await bcrypt.compare(result.data.password, user!.password ?? "xxxx");

        if (ok) {
            const session = await getSession();
            session.id = user!.id;
            await session.save();
            console.log("User authenticated, redirecting...");

            // Role redirection
            switch (user!.role) {
                case "Admin":
                    redirect("/dashboard/admin");
                    break;
                case "Security Engineer":
                    redirect("/dashboard/security");
                    break;
                case "Software Engineer":
                    redirect("/dashboard/software");
                    break;
                case "Manager":
                    redirect("/dashboard/manager");
                    break;
                default:
                    redirect("/home");
            }
        } else {
            return {
                fieldErrors: {
                    password: ["Wrong password!"],
                    email: [],
                },
            };
        }
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