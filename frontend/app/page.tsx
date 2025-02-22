"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      className="relative flex flex-col items-center justify-center min-h-screen text-white"
      style={{
        backgroundImage: "url('/secImg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      {/* 오버레이 효과 추가 */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* 헤더 */}
      <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <h1 className="text-2xl font-bold">SecuriDay</h1>
        <button
          onClick={() => router.push("/login")}
          className="px-6 py-3 text-lg font-semibold bg-white text-purple-700 rounded-lg shadow-lg hover:bg-gray-100 transition-all"
        >
          Login
        </button>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="text-center z-10">
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Automated Security <br /> Seamless Development.
        </h2>
        <p className="text-lg text-gray-200 max-w-xl mx-auto">
          From Commit to Security in One Flow.
        </p>
      </div>
    </div>
  );
}
