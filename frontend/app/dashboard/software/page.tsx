"use client";

import { Code, ExternalLink } from "lucide-react";
import Link from "next/link";
import Button from "@/components/button";

export default function SoftwareEngineerDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-800 to-green-600 text-white">
      <Code className="w-16 h-16 text-lime-300 mb-4" />
      <h1 className="text-4xl font-bold">Software Engineer Dashboard</h1>
      <p className="text-gray-200 mt-2">Develop, test, and deploy applications efficiently.</p>

      <Link href="http://your-grafana-url.com" target="_blank">
        <Button
          text="Grafana"
        />
      </Link>
    </div>
  );
}
