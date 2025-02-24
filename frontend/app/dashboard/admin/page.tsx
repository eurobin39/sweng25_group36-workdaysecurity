"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <ShieldCheck className="w-16 h-16 text-yellow-400 mb-4" />
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-300 mt-2">Manage users, permissions, and system settings.</p>

      <Link
        href="http://localhost:4000/d/admin-dashboard/admin-dashboard?orgId=1&from=now-6h&to=now&timezone=browser"
        target="_blank"
        className="mt-6"
      >
        <button className="px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:bg-gray-500 hover:scale-105">
          Open Grafana
        </button>
      </Link>
    </div>
  );
}
