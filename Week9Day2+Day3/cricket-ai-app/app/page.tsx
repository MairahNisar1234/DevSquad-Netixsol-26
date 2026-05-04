"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <main className="relative flex items-center justify-center h-screen bg-[#0f172a] overflow-hidden text-slate-200">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-emerald-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="text-center space-y-8 p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl">
          
          {/* Logo Section */}
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-4">
              <span className="text-3xl">🏏</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              CricketInsights <span className="text-emerald-400">AI</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[240px] mx-auto">
              The next generation of cricket analytics powered by advanced AI.
            </p>
          </div>

          {/* Action Area */}
          <div className="pt-4">
            {isLoggedIn ? (
              <Link href="/chat">
                <button className="group relative w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-[#0f172a] rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300 font-bold overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Continue to Dashboard
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </span>
                </button>
              </Link>
            ) : (
              <Link href="/auth">
                <button className="group relative w-full py-4 bg-white hover:bg-slate-100 text-[#0f172a] rounded-2xl shadow-xl transition-all duration-300 font-bold overflow-hidden">
                   Login to Get Started
                </button>
              </Link>
            )}
            
            <p className="mt-6 text-xs text-slate-500 uppercase tracking-widest font-semibold">
              Trusted by 15k+ Analysts
            </p>
          </div>
        </div>

        {/* Subtle Footer info */}
        <p className="text-center mt-8 text-slate-600 text-xs">
          Built for the modern cricket era. v2.1.0
        </p>
      </div>
    </main>
  );
}