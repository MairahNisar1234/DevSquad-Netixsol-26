"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import Navbar from '../../../src/components/layout/Navbar';
import Footer from '../../../src/components/layout/Footer';

// ─── Backend Configuration ───────────────────────────────────────────────────
const BACKEND_URL = "https://auction-backend-gt06.onrender.com";

export default function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    isHuman: false,
    agreeTerms: false,
  });
  const [userStatus, setUserStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkUsername = async () => {
    if (!formData.username) return;
    setUserStatus("checking");
    setTimeout(() => {
      const takenNames = ["admin", "test"];
      setUserStatus(takenNames.includes(formData.username.toLowerCase()) ? "taken" : "available");
    }, 800);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      // Updated to use the live BACKEND_URL
      const response = await fetch(`${BACKEND_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          username: formData.username
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Redirect to login after successful registration
        router.push("/auth/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Connection to server failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-sm outline-none text-sm focus:border-[#1e2b58] transition-colors bg-white";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  return (
    <>
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-[#dce8f8] py-14 text-center">
        <h1 className="text-5xl font-extrabold text-[#1e2b58] mb-3">Register</h1>
        <div className="flex justify-center mb-4">
          <span className="block w-16 h-1 bg-[#1a2e5a] rounded-full"></span>
        </div>
        <p className="text-gray-500 text-sm max-w-lg mx-auto px-4 leading-relaxed mb-3">
          Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus.
        </p>
        <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
          <span>Home</span>
          <span className="text-gray-400">›</span>
          <span className="text-[#1a2e5a] font-semibold">Register</span>
        </div>
      </section>

      <div className="bg-white min-h-screen py-12 px-4">

        {/* Register / Login Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex border border-gray-200 rounded-full overflow-hidden shadow-sm w-64">
            <div className="flex-1 py-2.5 text-center text-sm font-bold text-white bg-[#1e2b58] rounded-full">
              Register
            </div>
            <Link
              href="/auth/login"
              className="flex-1 py-2.5 text-center text-sm font-semibold text-gray-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Register Card */}
        <div className="max-w-lg mx-auto bg-white border border-gray-200 rounded-sm shadow-sm p-8">

          {/* Card Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-[#1e2b58]">Register</h2>
            <p className="text-gray-400 text-xs mt-1">
              Do you already have an account?{' '}
              <Link href="/auth/login" className="text-[#1e2b58] font-bold underline">
                Login Here
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-sm mb-5 text-xs font-semibold border border-red-100 flex items-center gap-2">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">

            {/* Personal Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xs font-bold text-[#1e2b58] uppercase tracking-wide">Personal Information</h3>
                <div className="flex-1 h-px bg-[#f5c518]"></div>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className={labelClass}>Enter Your Full Name*</label>
                  <input
                    type="text"
                    required
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className={inputClass}
                  />
                </div>

                {/* Email + Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Enter Your Email*</label>
                    <input
                      type="email"
                      required
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Enter Mobile Number*</label>
                    <div className="flex gap-2">
                      <select className="border border-gray-200 rounded-sm px-2 py-2.5 text-xs outline-none focus:border-[#1e2b58] bg-white text-gray-600">
                        <option>Pakistan (92)</option>
                        <option>India (91)</option>
                        <option>UAE (971)</option>
                        <option>US (1)</option>
                      </select>
                      <input
                        type="tel"
                        required
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className={`${inputClass} flex-1`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xs font-bold text-[#1e2b58] uppercase tracking-wide">Account Information</h3>
                <div className="flex-1 h-px bg-[#f5c518]"></div>
              </div>

              <div className="space-y-4">
                {/* Username */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-gray-600">Username*</label>
                    <button
                      type="button"
                      onClick={checkUsername}
                      className="text-[11px] text-[#1e2b58] font-bold hover:underline"
                    >
                      Check Availability
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className={`${inputClass} ${userStatus === 'available' ? 'border-green-400' : userStatus === 'taken' ? 'border-red-400' : ''}`}
                    />
                    {userStatus === "available" && (
                      <CheckCircle2 size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />
                    )}
                    {userStatus === "checking" && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">...</span>
                    )}
                  </div>
                  {userStatus === "taken" && (
                    <p className="text-red-500 text-[10px] mt-1">Username is already taken.</p>
                  )}
                </div>

                {/* Password + Confirm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Password*</label>
                    <div className="relative">
                      <input
                        type={showPass ? "text" : "password"}
                        required
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className={`${inputClass} pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e2b58]"
                      >
                        {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Confirm Password*</label>
                    <input
                      type="password"
                      required
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Prove You Are Human */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-xs font-bold text-[#1e2b58] uppercase tracking-wide">Prove You Are Human</h3>
                <div className="flex-1 h-px bg-[#f5c518]"></div>
              </div>
              <div className="border border-gray-200 rounded-sm px-4 py-3 flex items-center justify-between max-w-xs">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-[#1e2b58]"
                    onChange={(e) => setFormData({...formData, isHuman: e.target.checked})}
                  />
                  <span className="text-sm text-gray-600">I'm not a robot</span>
                </label>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/ad/RecaptchaLogo.svg"
                  className="w-8 grayscale opacity-40"
                  alt="recaptcha"
                />
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                required
                className="w-4 h-4 accent-[#1e2b58]"
                onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
              />
              <span className="text-xs text-gray-500">
                I agree to the{' '}
                <Link href="/terms" className="text-[#1e2b58] font-bold underline">
                  Terms & Conditions
                </Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e2b58] text-white py-3 rounded-sm font-bold text-sm hover:bg-[#243d7a] transition-colors uppercase tracking-widest disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400 mb-4">Or Login With</p>
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