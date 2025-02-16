"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-500">
      <h1 className="text-white text-3xl md:text-4xl font-bold mb-6">
        What is your role?
      </h1>
      <div className="flex space-x-6">
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg"
          onClick={() => router.push("/software-engineer")}
        >
          Software Engineer
        </button>
        <button
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg"
          onClick={() => router.push("/security-engineer")}
        >
          Security Engineer
        </button>
      </div>
    </div>
  );
}
