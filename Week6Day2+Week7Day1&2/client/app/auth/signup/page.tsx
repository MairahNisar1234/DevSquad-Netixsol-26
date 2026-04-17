'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; 
import { User, Mail, Lock, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast'; 

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  
  const router = useRouter(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Account created successfully!");
        setTimeout(() => {
          router.push('/auth/login'); 
        }, 1500);
      } else {
        toast.error(result.message || "Signup failed");
      }
    } catch (error) {
      console.error("🔥 Connection Error:", error);
      toast.error("Could not connect to the live server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E7E7E3] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#0B2447]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white rounded-full blur-3xl pointer-events-none" />
      
      <Toaster position="top-right" />
      
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white p-10 space-y-8 animate-in fade-in zoom-in duration-700 relative z-10">
        
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-[#0B2447] rounded-3xl shadow-lg shadow-blue-900/20 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <svg width="32" height="32" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20 Q10 8 24 6 Q18 14 20 22 Q14 16 4 20Z" fill="white" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-black text-[#0B2447] tracking-tighter uppercase leading-none">Create<br/>Account</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] pt-2">Arik Management Portal</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Full Name</label>
            <div className="group relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0B2447] transition-colors" size={18} />
              <input 
                type="text" required
                className="w-full bg-white border-2 border-transparent rounded-[1.5rem] py-4 pl-14 pr-6 focus:border-[#0B2447]/10 focus:bg-white outline-none font-bold text-[#0B2447] transition-all shadow-sm placeholder:text-gray-300"
                placeholder="Mairah Nisar"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Corporate Email</label>
            <div className="group relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0B2447] transition-colors" size={18} />
              <input 
                type="email" required
                className="w-full bg-white border-2 border-transparent rounded-[1.5rem] py-4 pl-14 pr-6 focus:border-[#0B2447]/10 focus:bg-white outline-none font-bold text-[#0B2447] transition-all shadow-sm placeholder:text-gray-300"
                placeholder="admin@arik.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Security Key</label>
            <div className="group relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0B2447] transition-colors" size={18} />
              <input 
                type="password" required
                className="w-full bg-white border-2 border-transparent rounded-[1.5rem] py-4 pl-14 pr-6 focus:border-[#0B2447]/10 focus:bg-white outline-none font-bold text-[#0B2447] transition-all shadow-sm placeholder:text-gray-300"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#0B2447] text-white py-5 rounded-[1.5rem] font-black text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#162a4d] transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span>INITIALIZE ACCESS</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest inline-block border-b border-transparent hover:border-gray-200 pb-1 transition-all">
            Already registered? <Link href="/auth/login" className="text-[#0B2447] ml-1">Sign In Here</Link>
            </p>
        </div>
      </div>

      {/* Subtle Bottom Label */}
      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.5em] opacity-50">
        Secure Terminal v2.0
      </p>
    </div>
  );
}