"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer'; 
import { HiOutlineBolt, HiOutlineRocketLaunch, HiOutlineCubeTransparent, HiOutlineSun, HiOutlineMoon } from "react-icons/hi2";
import { FiArrowRight } from "react-icons/fi";

const BLOG_POSTS = [
  {
    id: "tech-1",
    title: "Real-time Architecture",
    excerpt: "Scaling WebSocket gateways with NestJS and Redis for high-concurrency environments.",
    category: "Engineering",
    icon: <HiOutlineBolt size={32} />
  },
  {
    id: "mern-tips",
    title: "Next.js 16 Performance",
    excerpt: "Leveraging Turbopack and Server Components to achieve perfect Lighthouse scores.",
    category: "Frontend",
    icon: <HiOutlineRocketLaunch size={32} />
  },
  {
    id: "styling-guide",
    title: "Clean Design Systems",
    excerpt: "How to build accessible and scalable UI kits using Tailwind CSS utility classes.",
    category: "Design",
    icon: <HiOutlineCubeTransparent size={32} />
  }
];

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setIsDarkMode(false);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    // Optional: Dispatch event so other components know theme changed
    window.dispatchEvent(new Event("storage"));
  };

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    headerBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textMain: isDarkMode ? '#FFFFFF' : '#0F172A',
    textMuted: isDarkMode ? '#94A3B8' : '#64748B',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    accent: '#10B981',
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: theme.bg,
      transition: 'all 0.3s ease'
    }}>
      <Navbar isDarkMode={isDarkMode} />

      <main style={{ flex: 1, color: theme.textMain, fontFamily: "'Inter', sans-serif" }}>
        
        {/* THEME TOGGLE */}
        <button 
          onClick={toggleTheme}
          style={{
            position: 'fixed', bottom: '30px', right: '30px', zIndex: 2000,
            width: '50px', height: '50px', borderRadius: '50%',
            backgroundColor: theme.accent, color: 'white', border: 'none',
            cursor: 'pointer', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {isDarkMode ? <HiOutlineSun size={24} /> : <HiOutlineMoon size={24} />}
        </button>

        {/* HERO SECTION */}
        <header style={{ 
          backgroundColor: theme.headerBg, 
          padding: '100px 10% 60px 10%', 
          textAlign: 'center',
          borderBottom: `1px solid ${theme.border}`
        }}>
          <div style={{ 
            display: 'inline-block', padding: '6px 16px', borderRadius: '50px', 
            backgroundColor: 'rgba(16, 185, 129, 0.1)', color: theme.accent,
            fontSize: '13px', fontWeight: '600', marginBottom: '24px'
          }}>
            v2.0 Terminal Ready
          </div>
          <h1 style={{ fontSize: '3.5rem', margin: '0 0 24px 0', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-2px' }}>
            Modern Solutions for <span style={{ color: theme.accent }}>Next-Gen</span> Apps
          </h1>
          <p style={{ color: theme.textMuted, fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto' }}>
            Building real-time, scalable communities with NestJS and React.
          </p>
        </header>

        {/* BLOG GRID */}
        <section style={{ padding: '60px 10%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Latest Articles</h2>
            <div style={{ height: '1px', flex: 1, backgroundColor: theme.border, margin: '0 20px' }}></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {BLOG_POSTS.map((post) => (
              <Link href={`/post/${post.id}`} key={post.id} style={{ textDecoration: 'none' }}>
                <div 
                  style={{ 
                    backgroundColor: theme.cardBg, padding: '40px', border: `1px solid ${theme.border}`,
                    borderRadius: '16px', height: '100%', display: 'flex', flexDirection: 'column',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ marginBottom: '20px', color: theme.accent }}>{post.icon}</div>
                  <span style={{ color: theme.accent, fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>{post.category}</span>
                  <h3 style={{ color: theme.textMain, margin: '12px 0', fontSize: '22px' }}>{post.title}</h3>
                  <p style={{ color: theme.textMuted, flex: 1 }}>{post.excerpt}</p>
                  <div style={{ marginTop: '20px', color: theme.accent, fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    READ ARTICLE <FiArrowRight />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}