"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar'; 
import CommentSection from '@/app/components/CommentSection';
import Footer from '@/app/components/Footer';
import { FiArrowLeft, FiClock, FiShare2, FiBookmark, FiMoon, FiSun } from "react-icons/fi";

export default function PostPage() {
  const { id } = useParams();
  const [postData, setPostData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setIsDarkMode(false);

    const samplePosts: any = {
      "tech-1": { title: "Real-time Architecture", cat: "Engineering" },
      "mern-tips": { title: "Next.js 16 Performance", cat: "Frontend" },
      "styling-guide": { title: "Clean Design Systems", cat: "Design" }
    };
    setPostData(samplePosts[id as string] || { title: `Resource: ${id}`, cat: "Technical" });
  }, [id]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#FFFFFF',
    textMain: isDarkMode ? '#FFFFFF' : '#0F172A',
    textMuted: isDarkMode ? '#94A3B8' : '#64748B',
    border: isDarkMode ? '#334155' : '#F1F5F9',
    utilityBg: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
    accent: '#10B981'
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

      {/* --- MAIN CONTENT AREA --- */}
      <main style={{ flex: 1, color: theme.textMain, fontFamily: "'Inter', sans-serif" }}>
        
        {/* THEME TOGGLE BUTTON */}
        <button onClick={toggleTheme} style={{
          position: 'fixed', bottom: '30px', right: '30px', zIndex: 100,
          width: '50px', height: '50px', borderRadius: '50%',
          backgroundColor: theme.accent, color: 'white', border: 'none',
          cursor: 'pointer', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>

        {/* STICKY SUB-NAV */}
        <div style={{ 
          padding: '15px 10%', borderBottom: `1px solid ${theme.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          backgroundColor: theme.utilityBg, backdropFilter: 'blur(10px)',
          position: 'sticky', top: '0px', zIndex: 9 // Adjust top based on Navbar height
        }}>
          <Link href="/" style={{ color: theme.textMuted, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <FiArrowLeft /> Back to Feed
          </Link>
          <div style={{ display: 'flex', gap: '20px', color: theme.textMuted }}>
            <FiShare2 style={{ cursor: 'pointer' }} />
            <FiBookmark style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* POST CONTENT */}
        <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 25px' }}>
          <header style={{ marginBottom: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: theme.accent, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                {postData?.cat}
              </span>
              <span style={{ color: theme.textMuted, fontSize: '13px' }}>
                <FiClock style={{ marginRight: '4px' }} /> 6 min read
              </span>
            </div>
            
            <h1 style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', color: theme.textMain, marginBottom: '30px', letterSpacing: '-1.5px' }}>
              {postData?.title}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '20px 0', borderTop: `1px solid ${theme.border}` }}>
              <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: theme.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                MN
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '15px' }}>Mairah Nisar</div>
                <div style={{ color: theme.textMuted, fontSize: '13px' }}>Software Engineer @ Netixsol</div>
              </div>
            </div>
          </header>

          <article style={{ fontSize: '18px', lineHeight: '1.8', color: isDarkMode ? '#CBD5E1' : '#334155', marginBottom: '80px', borderBottom: `1px solid ${theme.border}`, paddingBottom: '60px' }}>
            <p>The integration of <b>NestJS</b> and <b>WebSockets</b> allows for high-concurrency data transfer.</p>
            <p>By leveraging Redis adapters, we can scale our real-time community interactions across multiple server instances without losing state.</p>
          </article>

          {/* DISCUSSION SECTION */}
          <section id="discussion" style={{ paddingBottom: '60px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: theme.textMain, marginBottom: '40px' }}>Discussion</h2>
            <CommentSection postId={id as string} isDarkMode={isDarkMode} />
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}