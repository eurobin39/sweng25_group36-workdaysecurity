"use client";

import { Code } from "lucide-react";
import Link from "next/link";

export default function SoftwareEngineerDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-800 to-green-600 text-white">
      <Code className="w-16 h-16 text-lime-300 mb-4" />
      <h1 className="text-4xl font-bold">Software Engineer Dashboard</h1>
      <p className="text-gray-200 mt-2">Develop, test, and deploy applications efficiently.</p>

      <Link
        href="http://localhost:4000/d/security-test-dashboard/security-test-dashboard?orgId=1&from=now-6h&to=now&timezone=browser"
        target="_blank"
        className="mt-6"
      >
        <button className="px-6 py-3 bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-green-500 hover:scale-105">
          Open Grafana
        </button>
      </Link>
    </div>
  );
}
