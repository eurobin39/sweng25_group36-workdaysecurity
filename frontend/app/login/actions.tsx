"use server";

import { z } from "zod";
import { PASSWORD_REGEX } from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

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
}
