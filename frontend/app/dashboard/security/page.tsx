"use client";

import { Lock } from "lucide-react"; 

export default function SecurityEngineerDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 text-white">
      <Lock className="w-16 h-16 text-cyan-300 mb-4" />
      <h1 className="text-4xl font-bold">Security Engineer Dashboard</h1>
      <p className="text-gray-200 mt-2">Monitor security logs and detect vulnerabilities.</p>
    </div>
  );
}
