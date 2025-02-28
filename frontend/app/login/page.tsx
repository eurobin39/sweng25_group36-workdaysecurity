"use client";

import Button from "@/components/button";
import Input from "../../components/input";
import Link from "next/link";
import { useActionState } from "react";
import { login } from "./actions";

export default function Login() {
    const [state, action] = useActionState(login, null);

    return (
        <div
            className="flex items-center justify-center min-h-screen px-4"
            style={{
                background: "linear-gradient(to bottom, #007BFF, #A1D6FF, #FF9A3C, #FF4500)",
                backgroundAttachment: "fixed",
            }}
        >
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
                <div className="flex flex-col items-center gap-6">
                    {/* Logo */}
                    <Link href="/" className="font-extrabold text-4xl text-blue-500 tracking-wide">
                        WORKDAY
                    </Link>
                    <h2 className="text-gray-600 text-lg">Welcome Back! Login to Your Account</h2>
                </div>

                {/* LOGIN FORM */}
                <form action={action} className="flex flex-col gap-4 mt-6">
                    <Input
                        name="email"
                        required
                        type="email"
                        placeholder="Email"
                        className="rounded-lg text-gray-600 border-gray-300 shadow-sm focus:ring-indigo-600 focus:border-indigo-600"
                        errors={state?.fieldErrors.email}
                    />
                    <Input
                        name="password"
                        required
                        type="password"
                        placeholder="Password"
                        className="rounded-lg border-gray-300 text-gray-600 shadow-sm focus:ring-indigo-600 focus:border-indigo-600"
                        errors={state?.fieldErrors.password}
                    />
                    <Button
                        text="Login"
                    />
                </form>

                {/* create Account */}
                <div className="mt-4 text-center">
                    <p className="text-gray-500 text-sm">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-500 hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
