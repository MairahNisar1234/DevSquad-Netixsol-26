"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    const endpoint = isLogin ? "/auth/login" : "/auth/signup";
    
    try {
      const res = await fetch(`https://cricketbackend-ashen.vercel.app${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Authentication failed");

      if (isLogin) {
        localStorage.setItem("token", data.token);
        const storedName = data.username || username;
        localStorage.setItem("username", storedName);
        router.push("/chat");
      } else {
        alert("Account created! Please login.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 bg-[#0d0d1a] overflow-hidden">
      {/* Background Orbs to match theme */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 md:w-[500px] md:h-[500px] bg-[#16a34a] rounded-full blur-[80px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 md:w-[400px] md:h-[400px] bg-[#7c3aed] rounded-full blur-[80px] opacity-10 pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="text-4xl mb-2">🏏</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center">
              {isLogin ? "Welcome Back" : "Join the Squad"}
            </h2>
            <p className="text-slate-400 text-sm mt-2 text-center">
              {isLogin ? "Enter your credentials to access stats" : "Create an account to start tracking stats"}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                Username
              </label>
              <input 
                type="text" 
                required 
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                placeholder="Enter username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
                Password
              </label>
              <input 
                type="password" 
                required 
                className="w-full bg-white/5 border border-white/10 px-4 py-3 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none transition-all"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2">
                <span>⚠️</span> {error}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-4 text-[#0d0d1a] bg-[#4ade80] rounded-xl hover:bg-[#22c55e] transition-all font-bold text-sm shadow-[0_4px_20px_rgba(74,222,128,0.25)] active:scale-[0.98]"
            >
              {isLogin ? "Login Now" : "Create Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-slate-400">
              {isLogin ? "New to the platform?" : "Already have an account?"}{" "}
              <button 
                onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                }} 
                className="text-[#4ade80] font-bold hover:text-white transition-colors"
              >
                {isLogin ? "Sign Up Free" : "Login here"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}