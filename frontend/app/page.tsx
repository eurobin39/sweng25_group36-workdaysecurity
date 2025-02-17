"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen" style={{ background: "var(--background)" }}>
      <h1 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: "var(--text-color)" }}>
        What is your role?
      </h1>
      <div className="flex space-x-6">
        <button
          className="hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all"
          style={{ background: "var(--primary)" }}
          onClick={() => router.push("/software-engineer")}
        >
          Software Engineer
        </button>
        <button
          className="hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all"
          style={{ background: "var(--primary)" }}
          onClick={() => router.push("/security-engineer")}
        >
          Security Engineer
        </button>
      </div>
    </div>
  );
}
