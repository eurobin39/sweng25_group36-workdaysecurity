"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; 
import NavBar from "../components/ui/NavBar"; // Ensure the casing matches the file name

export default function HomePage() {
  const router = useRouter();

  return (
    <div>
    <NavBar />


    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-600 to-blue-300">
      <h1 className="text-white text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-400 drop-shadow-lg animate-bounce">
        What is your role?
      </h1>
      
      <div className="flex space-x-6">
        <a
          href="https://gitlab.scss.tcd.ie/tmanea/sweng25_group36-workdaysecurity/-/pipelines"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all no-underline"
        >
          Software Engineer
        </a>
        <button
          className="bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all"
          onClick={() => router.push("/security-engineer")}
        >
          Security Engineer
        </button>
      </div>
    </div>
    </div>
    
  );
}
