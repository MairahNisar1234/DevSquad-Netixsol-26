"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(res.data));

      if (res.data.role === 'ADMIN') {
        router.push('/settings');
      } else {
        router.push('/menu');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ✅ Added overflow-y-auto to handle small mobile screens in landscape
    <div className="min-h-screen bg-[#252836] flex items-center justify-center p-4 sm:p-6 font-sans overflow-y-auto">
      
      {/* ✅ Adjusted max-width and padding: p-6 on mobile, p-10 on tablets/desktop */}
      <div className="bg-[#1F1D2B] w-full max-w-[420px] p-6 sm:p-10 rounded-2xl border border-gray-800 shadow-2xl my-auto">
        
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Jaegar Resto</h1>
          <p className="text-gray-400 text-sm sm:text-base">Enter your credentials to continue</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 sm:p-4 rounded-xl text-xs sm:text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 sm:space-y-6">
          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-gray-300 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-[#2D303E] border border-gray-700 rounded-xl pl-12 pr-4 py-3 sm:py-3.5 text-white text-sm sm:text-base focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs sm:text-sm text-gray-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#2D303E] border border-gray-700 rounded-xl pl-12 pr-4 py-3 sm:py-3.5 text-white text-sm sm:text-base focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-[#EA7C69] py-3.5 sm:py-4 rounded-xl text-white font-bold shadow-lg shadow-[#EA7C69]/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Log In'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 sm:mt-8 text-xs sm:text-sm">
          Don't have an account? <Link href="/signup" className="text-[#EA7C69] cursor-pointer hover:underline">Sign Up here</Link>
        </p>
      </div>
    </div>
  );
}