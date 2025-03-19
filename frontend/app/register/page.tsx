"use client";

import Input from "../../components/input";
import { useActionState } from "react";
import { createAccount } from "./actions";
import Button from "@/components/button";
import Link from "next/link";

export default function CreateAccount() {
  const [state, action] = useActionState(createAccount, null);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-6"
      style={{
        background: "linear-gradient(to bottom, #007BFF, #A1D6FF, #FF9A3C, #FF4500)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
        <div className="flex flex-col gap-3 items-center">
          <Link href="/" className="font-extrabold text-4xl text-blue-500 tracking-wide">
            WORKDAY
          </Link>
          <h2 className="text-lg text-gray-600">Fill in the Form Below to Join!</h2>
        </div>
        <form action={action} className="flex flex-col gap-4 mt-6">
          <Input
            name="username"
            required
            type="text"
            placeholder="Username"
            className="rounded-lg border-gray-300 text-gray-600 shadow-sm focus:ring-indigo-500"
            errors={state?.fieldErrors.username}
          />
          <Input
            name="email"
            required
            type="email"
            placeholder="Email"
            className="rounded-lg border-gray-300 text-gray-600 shadow-sm focus:ring-indigo-500"
            errors={state?.fieldErrors.email}
          />
          <Input
            name="password"
            required
            type="password"
            placeholder="Password"
            className="rounded-lg border-gray-300 text-gray-600 shadow-sm focus:ring-indigo-500"
            errors={state?.fieldErrors.password}
          />
          <Input
            name="confirmPassword"
            required
            type="password"
            placeholder="Confirm Password"
            className="rounded-lg border-gray-300 text-gray-600 shadow-sm focus:ring-indigo-500"
            errors={state?.fieldErrors.confirmPassword}
          />

          {/* Note about role assignment */}
          <div className="text-center text-sm text-gray-500 p-2 bg-gray-100 rounded-lg">
            Your account will need to be approved by an administrator before access is granted.
          </div>

          <Button text="Create Account" />
        </form>
        <p className="mt-4 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}