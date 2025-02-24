"use client";

import Input from "../components/input";
import { useActionState } from "react";
import { createAccount } from "./actions";
import Button from "@/components/button";
import Link from "next/link";
import { useState } from "react";

export default function CreateAccount() {
  const [state, action] = useActionState(createAccount, null);
  const [role, setRole] = useState("");

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

          {/* Role dropdown */}
          <div>

            <select
              name="role"
              id="role"
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border-gray-300 text-gray-600 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>
                Select a Role
              </option>
              <option value="Security Engineer">Security Engineer</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Manager">Manager</option>
              {/*<option value="Admin">Admin</option>*/}
            </select>
            {state?.fieldErrors.role && (
              <p className="text-red-500 text-sm mt-1">{state.fieldErrors.role}</p>
            )}
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
