'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#0B2447',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
          },
        }}
      />
      <Suspense
        fallback={
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6]">
            <Loader2 className="animate-spin text-[#0B2447]" size={40} />
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-400">Loading Portal</p>
          </div>
        }
      >
        <LoginPage />
      </Suspense>
    </>
  );
}

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSocialLogin = (provider: string) => {
    window.location.href = `http://localhost:3000/api/auth/${provider}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        'http://localhost:3000/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        // Reduced duration for snappy feel
        toast.error(data?.message || 'Invalid credentials.', { duration: 1500 });
        setLoading(false);
        return;
      }

      localStorage.setItem('access_token', data.access_token);

      const userRole = data?.user?.role?.toLowerCase();
      const redirectTo = searchParams.get('redirect');

      // Snappier success duration
      toast.success('Welcome back!', { duration: 1000 });

      setTimeout(() => {
        setLoading(false);

        if (redirectTo) {
          router.push(redirectTo);
        } else if (userRole === 'admin' || userRole === 'superadmin') {
          router.push('/admin');
        } else {
          router.push('/shop');
        }
      }, 300);

    } catch (error) {
      console.error(error);
      toast.error('Cannot connect to server.', { duration: 1500 });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 selection:bg-[#0B2447] selection:text-white">
      <div className="w-full max-w-[440px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12 space-y-8 border border-white">
        
        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0B2447] text-white rounded-2xl mb-4 rotate-3 shadow-lg">
             <Lock size={24} />
          </div>
          <h1 className="text-4xl font-black text-[#0B2447] tracking-tighter">Welcome Back</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Arik Management Portal
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0B2447] transition-colors" size={18} />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm text-black outline-none focus:ring-4 focus:ring-[#0B2447]/5 focus:border-[#0B2447] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#0B2447] transition-colors" size={18} />
              <input
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 text-sm text-black outline-none focus:ring-4 focus:ring-[#0B2447]/5 focus:border-[#0B2447] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0B2447] text-white py-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-[#1a3a6a] transition-all active:scale-[0.98] disabled:opacity-70 shadow-xl shadow-[#0B2447]/20"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* SOCIAL LOGIN */}
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="mx-4 text-gray-400 text-[9px] font-black uppercase tracking-widest">
              Social Auth
            </span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => handleSocialLogin('google')}
              className="flex items-center justify-center py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95"
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </button>

            <button
              onClick={() => handleSocialLogin('github')}
              className="flex items-center justify-center py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.77.42-1.3.76-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.05.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.47 5.93.42.36.81 1.1.81 2.22v3.29c0 .32.19.69.8.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/>
              </svg>
            </button>

            <button
              onClick={() => handleSocialLogin('discord')}
              className="flex items-center justify-center py-3 border border-gray-100 rounded-2xl hover:bg-gray-50 hover:border-gray-200 transition-all active:scale-95"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#5865F2">
                 <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152c-.069.1257-.1473.2573-.2346.3941a18.2735 18.2735 0 00-3.1973-.0001c-.0873-.1368-.1656-.2684-.2346-.3941a19.7913 19.7913 0 00-4.8851 1.5152 19.9149 19.9149 0 00-3.8155 12.054c2.5335 1.8617 4.956 2.9923 7.3306 3.7317.5847-.7992 1.0948-1.6669 1.5197-2.5848-.8796-.3304-1.7141-.7496-2.503-1.2504.2108-.152.4144-.3121.6103-.4795 4.8012 2.2128 10.0271 2.2128 14.8283 0 .1959.1674.3995.3275.6103.4795-.7889.5008-1.6234.92-2.503 1.2504.4249.9179.935 1.7856 1.5197 2.5848 2.3746-.7394 4.7971-1.87 7.3306-3.7317a19.9149 19.9149 0 00-3.8155-12.054zM8.02 15.3312c-1.4325 0-2.6113-1.3161-2.6113-2.9248 0-1.6087 1.1565-2.9248 2.6113-2.9248 1.4548 0 2.6336 1.3161 2.6113 2.9248 0 1.6087-1.1565 2.9248-2.6113 2.9248zm7.96 0c-1.4325 0-2.6113-1.3161-2.6113-2.9248 0-1.6087 1.1565-2.9248 2.6113-2.9248 1.4548 0 2.6336 1.3161 2.6113 2.9248 0 1.6087-1.1565 2.9248-2.6113 2.9248z" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-center text-xs font-bold text-gray-400">
          New user? <Link href="/auth/signup" className="text-[#0B2447] hover:underline ml-1">Create an account</Link>
        </p>
      </div>
    </div>
  );
}