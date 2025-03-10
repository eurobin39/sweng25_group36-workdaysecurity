"use client";

import { BarChart } from "lucide-react";
import Link from "next/link";

export default function ManagerDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 to-purple-600 text-white">
      <BarChart className="w-16 h-16 text-pink-300 mb-4" />
      <h1 className="text-4xl font-bold">Manager Dashboard</h1>
      <p className="text-gray-200 mt-2">Track performance, reports, and analytics.</p>

      <Link
        href="http:/172.20.10.3:4000/d/security-test-manager-dashboard/security-test-manager-dashboard?orgId=1&from=now-6h&to=now&timezone=browser&var-repository=sweng25_group36-workdaysecurity"
        target="_blank"
        className="mt-6"
      >
        <button className="px-6 py-3 bg-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-purple-500 hover:scale-105">
          Open Grafana
        </button>
      </Link>
    </div>
  );
}
