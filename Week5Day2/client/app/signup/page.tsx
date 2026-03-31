"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiUser, FiArrowLeft, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [alert, setAlert] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- UPDATED BACKEND URL ---
  const BACKEND_URL = "https://deploy-nexus.onrender.com";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // UPDATED FETCH LINK
      const res = await fetch(`${BACKEND_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setAlert({ msg: "Account created successfully! Redirecting...", type: 'success' });
        setTimeout(() => router.push('/login'), 2000); 
      } else {
        setAlert({ msg: data.message || "Signup failed. Please try again.", type: 'error' });
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (err) {
      setAlert({ msg: "Connection error. Ensure your server is running.", type: 'error' });
      setTimeout(() => setAlert(null), 3000);
    } finally {
      setLoading(false);
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
      <div className="signup-card" style={{ 
        maxWidth: '1000px', 
        width: '100%', 
        backgroundColor: '#1E293B', 
        borderRadius: '20px', 
        overflow: 'hidden', 
        display: 'flex',
        flexDirection: 'row-reverse', 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid #334155'
      }}>
        
        {/* RIGHT PANEL (The Form) */}
        <div className="panel" style={{ flex: 1, padding: '60px 5%', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
            <div style={{ width: '28px', height: '28px', background: '#10B981', borderRadius: '4px' }}></div>
            <span style={{ color: 'white', fontWeight: 'bold' }}>NETIXSOL</span>
          </div>

          <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '800', margin: '0 0 20px 0', letterSpacing: '-1.5px' }}>Create Account</h1>
          
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <FiUser style={{ position: 'absolute', left: '15px', top: '16px', color: '#64748B' }} />
              <input 
                type="text" 
                placeholder="Username" 
                required
                onChange={e => setFormData({...formData, username: e.target.value})} 
                style={{ 
                  width: '100%', padding: '15px 15px 15px 45px', 
                  backgroundColor: '#0F172A', border: '1px solid #334155', 
                  borderRadius: '10px', color: 'white', outline: 'none'
                }} 
              />
            </div>

            <div style={{ position: 'relative' }}>
              <FiMail style={{ position: 'absolute', left: '15px', top: '16px', color: '#64748B' }} />
              <input 
                type="email" 
                placeholder="Email Address" 
                required
                onChange={e => setFormData({...formData, email: e.target.value})} 
                style={{ 
                  width: '100%', padding: '15px 15px 15px 45px', 
                  backgroundColor: '#0F172A', border: '1px solid #334155', 
                  borderRadius: '10px', color: 'white', outline: 'none'
                }} 
              />
            </div>

            <div style={{ position: 'relative' }}>
              <FiLock style={{ position: 'absolute', left: '15px', top: '16px', color: '#64748B' }} />
              <input 
                type="password" 
                placeholder="Password" 
                required
                onChange={e => setFormData({...formData, password: e.target.value})} 
                style={{ 
                  width: '100%', padding: '15px 15px 15px 45px', 
                  backgroundColor: '#0F172A', border: '1px solid #334155', 
                  borderRadius: '10px', color: 'white', outline: 'none'
                }} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              style={{ 
                marginTop: '10px',
                padding: '15px', 
                background: loading ? '#334155' : '#10B981', 
                color: 'white', 
                border: 'none', 
                borderRadius: '10px', 
                fontWeight: '700', 
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '15px',
                textTransform: 'uppercase' 
              }}
            >
              {loading ? "Initializing..." : "Register Account"}
            </button>
          </form>
        </div>

        {/* LEFT PANEL (Greeting) */}
        <div className="panel" style={{ 
          flex: 1, padding: '60px 5%', textAlign: 'center', 
          backgroundColor: '#10B981', 
          color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
        }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.5rem)', fontWeight: '800', margin: '0 0 20px 0', letterSpacing: '-1.5px' }}>Welcome Back!</h2>
          <p style={{ lineHeight: '1.6', fontSize: '15px', marginBottom: '40px', maxWidth: '300px' }}>
            To stay connected with the Netixsol community, please login with your personal information.
          </p>
          <Link href="/login" style={{ textDecoration: 'none' }}>
            <button style={{ 
              padding: '12px 50px', background: 'none', border: '2px solid white', 
              color: 'white', borderRadius: '50px', fontWeight: '700', 
              cursor: 'pointer', fontSize: '13px', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <FiArrowLeft /> SIGN IN
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
          .signup-card {
            flex-direction: column !important;
            max-width: 500px !important;
          }
          .panel {
            padding: 40px 20px !important;
          }
        }

        @media (max-width: 480px) {
          .signup-card {
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