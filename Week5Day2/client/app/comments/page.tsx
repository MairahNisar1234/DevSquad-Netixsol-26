"use client";
import { useEffect, useState } from 'react';
import CommentSection from '../components/CommentSection';
import Navbar from '../components/Navbar'; // 👈 Your new Notification Bell Navbar

export default function BlogPost() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      {/* 1. The Global Navbar with Notification logic */}
      <Navbar isDarkMode={isDarkMode} />

      <main style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
        {/* 2. Blog Content */}
        <article style={{ 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          marginBottom: '30px' 
        }}>
          <h1 style={{ fontSize: '32px', color: '#111', marginBottom: '20px' }}>
            Building Real-Time Systems at NetixSol
          </h1>
          <p style={{ lineHeight: '1.8', color: '#444', fontSize: '17px' }}>
            In this post, we're testing the new notification system. When a user replies 
            to a comment, the original author receives a real-time alert via Socket.io 
            rooms. This ensures a high-engagement experience for our community.
          </p>
          <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px', color: '#888' }}>
            {user ? (
              <span>Logged in as <b>{user.username}</b></span>
            ) : (
              <span>Viewing as Guest</span>
            )}
          </div>
        </article>

        {/* 3. The Interactive Comment Section */}
        <section style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '12px', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)' 
        }}>
          <h3 style={{ marginBottom: '25px', borderBottom: '2px solid #0070f3', display: 'inline-block', paddingBottom: '5px' }}>
            Discussion
          </h3>
          <CommentSection postId="tech-news" isDarkMode={isDarkMode} />
        </section>
      </main>
    </div>
  );
}