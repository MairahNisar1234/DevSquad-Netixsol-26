"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiUserPlus, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();

  // --- UPDATED BACKEND URL ---
  const BACKEND_URL = "https://deploy-nexus.onrender.com";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // UPDATED FETCH LINK
    const res = await fetch(`${BACKEND_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setAlert({ msg: "Success! Accessing terminal...", type: 'success' });
      setTimeout(() => router.push('/'), 1500); 
    } else {
      setAlert({ msg: "Authentication failed.", type: 'error' });
      setTimeout(() => setAlert(null), 3000);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0F172A', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: '20px'
    }}>
      <div className="login-card" style={{ 
        maxWidth: '1000px', 
        width: '100%', 
        backgroundColor: '#1E293B', 
        borderRadius: '24px', 
        overflow: 'hidden', 
        display: 'flex',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
        border: '1px solid #334155'
      }}>
        
        {/* LEFT PANEL: Form */}
        <div className="panel" style={{ flex: 1, padding: '60px 5%', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ width: '28px', height: '28px', background: '#10B981', borderRadius: '6px' }}></div>
            <span style={{ color: 'white', fontWeight: '800', letterSpacing: '-0.5px' }}>NETIXSOL</span>
          </div>

          <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '800', margin: '0 0 15px 0', letterSpacing: '-1.5px' }}>Sign in</h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '40px' }}>Access your secure terminal environment.</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '15px', top: '16px', color: '#64748B' }} />
              <input 
                type="text" 
                placeholder="Username" 
                required
                onChange={e => setUsername(e.target.value)} 
                style={{ 
                  width: '100%', padding: '15px 15px 15px 45px', 
                  backgroundColor: '#0F172A', border: '1px solid #334155', 
                  borderRadius: '12px', color: 'white', outline: 'none'
                }} 
              />
            </div>

            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '15px', top: '16px', color: '#64748B' }} />
              <input 
                type="password" 
                placeholder="Password" 
                required
                onChange={e => setPassword(e.target.value)} 
                style={{ 
                  width: '100%', padding: '15px 15px 15px 45px', 
                  backgroundColor: '#0F172A', border: '1px solid #334155', 
                  borderRadius: '12px', color: 'white', outline: 'none'
                }} 
              />
            </div>

            <Link href="#" style={{ color: '#64748B', fontSize: '12px', margin: '10px 0', textDecoration: 'none' }}>Forgot your password?</Link>

            <button 
              type="submit" 
              style={{ 
                padding: '16px', background: '#10B981', color: 'white', 
                border: 'none', borderRadius: '12px', fontWeight: '700', 
                cursor: 'pointer', fontSize: '15px', textTransform: 'uppercase',
                boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'
              }}
            >
              Sign In
            </button>
          </form>
        </div>

        {/* RIGHT PANEL: Redirect to Signup */}
        <div className="panel" style={{ 
          flex: 1, padding: '60px 5%', textAlign: 'center', 
          backgroundColor: '#10B981', 
          color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '800', margin: '0 0 20px 0', letterSpacing: '-1.5px' }}>Hello, Friend!</h2>
          <p style={{ lineHeight: '1.6', fontSize: '15px', marginBottom: '40px', maxWidth: '300px', opacity: 0.9 }}>
            Enter your personal details and start your real-time discussion journey with us.
          </p>
          
          <Link href="/signup" style={{ textDecoration: 'none' }}>
            <button style={{ 
              padding: '14px 55px', background: 'white', border: 'none', 
              color: '#10B981', borderRadius: '50px', fontWeight: '800', 
              cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase', 
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <FiUserPlus size={18} /> SIGN UP
            </button>
          </Link>
        </div>
      </div>

      {alert && (
        <div style={{ 
          position: 'fixed', top: '20px', right: '20px', padding: '16px 24px', 
          borderRadius: '12px', color: 'white', zIndex: 9999, fontWeight: '600',
          display: 'flex', alignItems: 'center', gap: '12px',
          backgroundColor: alert.type === 'success' ? '#10B981' : '#EF4444',
          boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
          animation: 'slideIn 0.3s ease-out' 
        }}>
          {alert.type === 'success' ? <FiCheckCircle size={20}/> : <FiAlertCircle size={20}/>}
          {alert.msg}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @media (max-width: 768px) {
          .login-card {
            flex-direction: column !important;
            max-width: 500px !important;
          }
          .panel {
            padding: 40px 20px !important;
          }
        }

        @media (max-width: 480px) {
          .login-card {
            border-radius: 16px !important;
          }
          input {
            font-size: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}