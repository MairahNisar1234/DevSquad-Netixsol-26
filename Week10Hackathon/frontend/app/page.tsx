"use client";

import Image from "next/image";
import { Sparkles, Upload, FileText, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  // 🔐 simple auth check (token-based)
  const handleDashboardRedirect = () => {
    const token = localStorage.getItem("token");

    if (token) {
      router.push("/dashboard/teacher");
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">

      {/* TOP NAV */}
      <header className="w-full bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <Image
              src="/next.svg"
              alt="logo"
              width={90}
              height={20}
              className="dark:invert"
            />
            <span className="font-bold text-slate-800 text-sm sm:text-base">
              AI Assignment Grader
            </span>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <button className="px-3 sm:px-4 py-2 text-sm rounded-xl bg-slate-100 hover:bg-slate-200 transition">
              Docs
            </button>

            <button className="px-3 sm:px-4 py-2 text-sm rounded-xl bg-indigo-600 text-white hover:opacity-90 transition">
              Get Started
            </button>
          </div>

        </div>
      </header>

      {/* HERO */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24">

        <div className="max-w-4xl w-full text-center space-y-10">

          {/* ICON */}
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <Sparkles className="text-indigo-600" />
            </div>
          </div>

          {/* TITLE */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl font-bold text-slate-800 leading-tight">
              AI Powered Assignment Grading System
            </h1>

            <p className="text-slate-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Upload student assignments, define requirements, and let AI automatically
              evaluate, score, and generate structured feedback in seconds.
            </p>
          </div>

          {/* FEATURE CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 px-2 sm:px-0">

            <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <Upload className="text-indigo-600 mb-3" />
              <h3 className="font-semibold text-slate-800">Batch Upload</h3>
              <p className="text-sm text-slate-500 mt-1">
                Upload multiple PDF assignments at once
              </p>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <FileText className="text-indigo-600 mb-3" />
              <h3 className="font-semibold text-slate-800">Smart Evaluation</h3>
              <p className="text-sm text-slate-500 mt-1">
                AI checks logic, structure & correctness
              </p>
            </div>

            <div className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
              <CheckCircle2 className="text-indigo-600 mb-3" />
              <h3 className="font-semibold text-slate-800">Instant Results</h3>
              <p className="text-sm text-slate-500 mt-1">
                Get scores + feedback in real-time
              </p>
            </div>

          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">

            <button
              onClick={handleDashboardRedirect}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-lg hover:opacity-90 transition"
            >
              Go to Dashboard
            </button>

            <a
              href="#features"
              className="px-6 py-4 rounded-2xl border border-slate-300 text-slate-700 hover:bg-white transition"
            >
              Learn More
            </a>

          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center text-sm text-slate-400 border-t bg-white">
        Built for AI-powered education systems • Next.js + NestJS + AI Grader
      </footer>

    </div>
  );
}