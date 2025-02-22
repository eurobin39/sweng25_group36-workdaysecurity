"use client";

import { ShieldCheck } from "lucide-react"; 

export default function AdminDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <ShieldCheck className="w-16 h-16 text-yellow-400 mb-4" />
      <h1 className="text-4xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-300 mt-2">Manage users, permissions, and system settings.</p>
    </div>
  );
}
