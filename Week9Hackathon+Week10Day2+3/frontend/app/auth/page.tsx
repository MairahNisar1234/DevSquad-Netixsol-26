"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? "/auth/login" : "/auth/signup";
    
    try {
      const response = await fetch(`https://healthcareai-kappa.vercel.app${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (!isLogin) {
          // SIGN UP SUCCESS
          toast.success("Registration successful! Please login to continue.", {
            icon: '🚀',
            duration: 4000
          });
          setIsLogin(true); // Switch to login mode
          setFormData({ ...formData, password: "" }); // Clear password for security
        } else {
          // LOGIN SUCCESS
          toast.success("Welcome back, " + (data.username || "User") + "!");
          if (data.access_token) localStorage.setItem("token", data.access_token);
          
          setTimeout(() => {
            router.push("/products");
          }, 1200);
        }
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      toast.error("Connection error. Is the NestJS server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 font-sans">
      <Toaster position="top-center" />

      <div className="max-w-md w-full">
        {/* Logo Area */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
            <Activity className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">HealthGuard AI</h1>
          <p className="text-slate-500 text-sm mt-1">Smart Healthcare Solutions</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {isLogin ? "Access your personalized health dashboard" : "Join our community of wellness"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-slate-400" size={18} />
                  <input 
                    name="username"
                    type="text" 
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-700"
                    placeholder="e.g. Mairah Nisar"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  name="email"
                  type="email" 
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-700"
                  placeholder="name@email.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                <input 
                  name="password"
                  type="password" 
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-4 mt-6 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 disabled:opacity-70"
            >
              {loading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500">
              {isLogin ? "New to HealthGuard?" : "Already a member?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                {isLogin ? "Create an account" : "Log in to your account"}
              </button>
            </p>
            
            <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              <ShieldCheck size={14} />
              <span>Secure Encrypted Connection</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}