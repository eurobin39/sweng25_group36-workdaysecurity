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


    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-600 to-blue-300"
          style={{
            backgroundImage: "url('/images/securityBackground.jpg')", 
            backgroundSize: "cover", 
            backgroundPosition: "center", 
          }}>

      <h1 className="text-blue-900 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-900 drop-shadow-lg animate-bounce">
        What is your role?
      </h1>
      
      <div className="flex justify-center space-x-6 p-10">
        <a
          href="https://gitlab.scss.tcd.ie/tmanea/sweng25_group36-workdaysecurity/-/pipelines"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-lg text-2xl shadow-xl transition-all"
        >
          Software Engineer
        </a>
        <a
          className="bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-lg text-2xl shadow-xl transition-all"
          onClick={() => router.push("/security-engineer")}
        >
          Security Engineer
        </a>
        <button
        className="mt-6 hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition-all"
        style={{ background: "var(--secondary)" }}
        onClick={() => router.push("/login")}
        >
        Login
      </button>
      </div>
    </div>
    </div>
    
  );
}
