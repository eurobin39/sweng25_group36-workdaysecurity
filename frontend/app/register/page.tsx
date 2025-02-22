"use client";

import Input from "../components/input";
import { useActionState } from "react";
import { createAccount } from "./actions";
import Button from "../components/button";
import Link from "next/link";

export default function CreateAccount() {
  const [state, action] = useActionState(createAccount, null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
      <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full">
        <div className="flex flex-col gap-3 items-center">
          <Link href="/" className="font-extrabold text-4xl text-indigo-700 tracking-wide">
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
            className="rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500"
            errors={state?.fieldErrors.username}
          />
          <Input
            name="email"
            required
            type="email"
            placeholder="Email"
            className="rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500"
            errors={state?.fieldErrors.email}
          />
          <Input
            name="password"
            required
            type="password"
            placeholder="Password"
            className="rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500"
            errors={state?.fieldErrors.password}
          />
          <Input
            name="confirmPassword"
            required
            type="password"
            placeholder="Confirm Password"
            className="rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500"
            errors={state?.fieldErrors.confirmPassword}
          />
          <Input
            name="role"
            required
            type="text"
            placeholder="Choose Your Role"
            className="rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500"
            errors={state?.fieldErrors.role}
          />
          <Button
            text="Create Account"

          />
        </form>
        <p className="mt-4 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
