"use client";

import { useEffect, useState } from "react"; // Added useEffect and useState
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Heart, LayoutDashboard } from "lucide-react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    // Replace 'token' or 'user' with whatever key you use to store auth state
    const user = localStorage.getItem("user"); 
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-100 dark:border-zinc-900 bg-white/80 dark:bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="text-white" size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tight dark:text-white">HealthAI</span>
          </div>
          
          {/* Dynamic Nav Link */}
          <Link 
            href={isLoggedIn ? "/products" : "/auth"} 
            className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {isLoggedIn ? "Dashboard" : "Sign In"}
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider animate-fade-in">
            <Zap size={14} /> New: AI-Powered Symptom Checker
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
            Your personal <span className="text-blue-600">Health Companion</span> powered by AI.
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Get instant health insights, track your wellness journey, and find the best supplements tailored specifically for your needs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {/* Conditional Button Logic */}
            <Link
              href={isLoggedIn ? "/products" : "/auth"}
              className="group flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-blue-600 px-8 text-white font-bold text-lg shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:bg-blue-700 hover:shadow-none transition-all active:scale-95"
            >
              {isLoggedIn ? (
                <>
                  Browse Products
                  <LayoutDashboard size={20} className="group-hover:rotate-12 transition-transform" />
                </>
              ) : (
                <>
                  Get Started Free
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                </>
              )}
            </Link>
            
            <button className="h-14 w-full sm:w-auto px-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 font-bold text-lg text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
              Learn More
            </button>
          </div>

          {/* Social Proof / Trust */}
          <div className="pt-16 flex flex-col items-center gap-6">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Trusted Security</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-semibold">
                <ShieldCheck size={20} /> HIPAA Compliant
              </div>
              <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-semibold">
                <ShieldCheck size={20} /> Data Encrypted
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Background Decor */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/10 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}