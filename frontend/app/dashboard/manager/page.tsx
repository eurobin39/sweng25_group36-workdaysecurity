"use client";

import { BarChart } from "lucide-react"; 

export default function ManagerDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-800 to-purple-600 text-white">
      <BarChart className="w-16 h-16 text-pink-300 mb-4" />
      <h1 className="text-4xl font-bold">Manager Dashboard</h1>
      <p className="text-gray-200 mt-2">Track performance, reports, and analytics.</p>
    </div>
  );
}
