"use client";

import { useState } from "react";
import api from "@/src/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function SignupPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: "", text: "" });

    try {
      await api.post("/auth/signup", {
        ...form,
        role: "teacher", // ✅ fixed role
      });

      setMsg({
        type: "success",
        text: "Account created! Redirecting...",
      });

      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err: any) {
      setMsg({
        type: "error",
        text:
          err.response?.data?.message ||
          "Signup failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4 font-sans">

      {/* CARD */}
      <div className="w-full max-w-md">

        {/* TOP BADGE */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center shadow-sm">
            <Sparkles className="text-indigo-600" />
          </div>
        </div>

        {/* TITLE */}
        <h1 className="text-center text-3xl font-bold text-slate-800">
          Create Teacher Account
        </h1>

        <p className="text-center text-slate-500 text-sm mt-2 mb-6">
          Join the AI Assignment Grading System
        </p>

        {/* TOAST */}
        {msg.text && (
          <div
            className={`mb-5 p-4 rounded-xl flex items-center gap-3 border ${
              msg.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span className="text-sm font-medium">
              {msg.text}
            </span>
          </div>
        )}

        {/* FORM CARD */}
        <div className="bg-white border shadow-lg rounded-3xl p-6">

          <form onSubmit={handleSignup} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Email
              </label>
              <input
                type="email"
                placeholder="teacher@school.com"
                className="mt-2 w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="mt-2 w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                required
              />
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50"
            >
              <UserPlus size={18} />
              {loading ? "Creating Account..." : "Create Teacher Account"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}