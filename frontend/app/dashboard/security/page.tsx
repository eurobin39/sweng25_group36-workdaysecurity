"use client";

import { Lock } from "lucide-react";
import Link from "next/link";

export default function SecurityEngineerDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 text-white">
      <Lock className="w-16 h-16 text-cyan-300 mb-4" />
      <h1 className="text-4xl font-bold">Security Engineer Dashboard</h1>
      <p className="text-gray-200 mt-2">Monitor security logs and detect vulnerabilities.</p>

      <Link
        href="http://172.20.10.12:4000/d/security-test-dashboard/security-test-dashboard?orgId=1&from=now-6h&to=now&timezone=browser"
        target="_blank"
        className="mt-6"
      >
        <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105">
          Open Grafana
        </button>
      </Link>
    </div>
  );
}
