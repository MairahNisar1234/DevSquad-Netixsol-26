"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import Navbar from '../../../src/components/layout/Navbar';
import Footer from '../../../src/components/layout/Footer';

// ─── Backend Configuration ───────────────────────────────────────────────────
const BACKEND_URL = "https://auction-backend-gt06.onrender.com";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Updated to use the live BACKEND_URL
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        const token = data.access_token || data.accessToken;
        if (token) {
          localStorage.setItem("token", token);
          router.push("/auction");
        } else {
          setError("Session error: Token property mismatch in server response.");
        }
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err) {
      setError("Cannot connect to server. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-[#dce8f8] py-14 text-center">
        <h1 className="text-5xl font-extrabold text-[#1e2b58] mb-3">Login</h1>
        <div className="flex justify-center mb-4">
          <span className="block w-16 h-1 bg-[#1a2e5a] rounded-full"></span>
        </div>
        <p className="text-gray-500 text-sm max-w-lg mx-auto px-4 leading-relaxed mb-3">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>
        <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
          <span>Home</span>
          <span className="text-gray-400">›</span>
          <span className="text-[#1a2e5a] font-semibold">Login</span>
        </div>
      </section>

      <div className="bg-white min-h-screen py-12 px-4">

        {/* Register / Login Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex border border-gray-200 rounded-full overflow-hidden shadow-sm w-64">
            <Link
              href="/auth/register"
              className="flex-1 py-2.5 text-center text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Register
            </Link>
            <div className="flex-1 py-2.5 text-center text-sm font-bold text-white bg-[#1e2b58] rounded-full">
              Login
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-sm shadow-sm p-8">

          {/* Card Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#1e2b58]">Log In</h2>
            <p className="text-gray-400 text-xs mt-1">
              New member?{' '}
              <Link href="/auth/register" className="text-[#1e2b58] font-bold underline">
                Register Here
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-sm mb-5 text-xs font-semibold border border-red-100 flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Enter Your Email*
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-sm outline-none text-sm focus:border-[#1e2b58] transition-colors"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-600">
                Password*
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-sm outline-none text-sm focus:border-[#1e2b58] transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e2b58]"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#1e2b58]"
                />
                <span className="text-xs text-gray-500">Remember me</span>
              </label>
              
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e2b58] text-white py-3 rounded-sm font-bold text-sm hover:bg-[#243d7a] transition-colors uppercase tracking-widest disabled:opacity-60"
            >
              {loading ? "Authenticating..." : "Log in"}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 mb-4">Or Register With</p>
            <div className="flex justify-center gap-3">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#ea4335] hover:border-[#ea4335] transition-colors shadow-sm">
                <FaGoogle size={15} />
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1877f2] hover:border-[#1877f2] transition-colors shadow-sm">
                <FaFacebookF size={15} />
              </button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#1da1f2] hover:border-[#1da1f2] transition-colors shadow-sm">
                <FaTwitter size={15} />
              </button>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}