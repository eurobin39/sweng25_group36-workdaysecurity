"use client";

import { Clock } from "lucide-react";
import Link from "next/link";

export default function PendingApprovalPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-600 to-amber-400 text-white">
      <Clock className="w-16 h-16 text-white mb-4 animate-pulse" />
      <h1 className="text-4xl font-bold text-center">Account Pending Approval</h1>
      <div className="max-w-md mt-6 text-center p-6 bg-white/10 backdrop-blur-sm rounded-lg">
        <p className="text-xl">
          Thank you for registering!
        </p>
        <p className="mt-4">
          Your account is currently pending approval from an administrator.
          You&apos;ll be notified when your account has been approved and a role has been assigned.
        </p>
        <p className="mt-4 text-amber-100">
          Please check back later or contact your administrator for more information.
        </p>
      </div>
      <Link href="/login" className="mt-8">
        <button className="px-6 py-3 bg-amber-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-amber-500 hover:scale-105">
          Return to Login
        </button>
      </Link>
    </div>
  );
}