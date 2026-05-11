"use client";

import { useState } from 'react';
import api from '@/src/lib/api';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, AlertCircle, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // This is your "Toast" message state
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;

      // Store the JWT and user role in local storage
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);

      // Redirect based on the role returned by the backend
      if (data.role === 'teacher') {
        router.push('/dashboard/teacher');
      } else {
        router.push('/dashboard/student');
      }
    } catch (err: any) {
      // Capture error message from backend or set a default
      const errorMessage = err.response?.data?.message || 'Invalid email or password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="bg-white p-8 shadow-2xl rounded-2xl w-full max-w-md border border-slate-100">
        {/* Header Section */}
        <div className="flex justify-center mb-4 text-indigo-600">
          <LogIn size={48} />
        </div>
        <h1 className="text-3xl font-extrabold mb-2 text-center text-slate-800">Welcome Back</h1>
        <p className="text-center text-slate-500 mb-8">Login to access the AI Assignment Checker.</p>

        {/* Error Toast Message (Inline) */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3 animate-in fade-in duration-300">
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Email Address</label>
            <input 
              type="email" 
              placeholder="name@university.edu" 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition bg-slate-50 focus:bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition bg-slate-50 focus:bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:bg-indigo-300 disabled:cursor-not-allowed mt-4 shadow-lg shadow-indigo-100"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-indigo-600 font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}