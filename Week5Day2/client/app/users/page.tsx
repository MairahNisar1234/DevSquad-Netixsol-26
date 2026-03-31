"use client";
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { FiArrowRight, FiSearch, FiCpu } from "react-icons/fi";

// This replaces the backend database for now
const MOCK_USERS = [
  { _id: "1", username: "John_Dev", bio: "Full-stack engineer exploring the Nexus.", profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
  { _id: "2", username: "Sarah_Cloud", bio: "Specializing in RAG and LLM architecture.", profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
  { _id: "3", username: "Nexus_Admin", bio: "System maintainer. Welcome to the core.", profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" },
  { _id: "4", username: "Mairah_N", bio: "Software developer & AI enthusiast.", profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mairah" },
  { _id: "5", username: "Crypto_Knight", bio: "Web3 and Real-time sockets enthusiast.", profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Knight" },
];

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const isDarkMode = true; // Matches your Nexus terminal theme

  const filteredUsers = MOCK_USERS.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: 'white', display: 'flex', flexDirection: 'column' }}>
      <Navbar isDarkMode={isDarkMode} />

      <main style={{ flex: 1, maxWidth: '1000px', margin: '40px auto', width: '100%', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '50px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontSize: '12px', fontWeight: 'bold', marginBottom: '16px' }}>
            <FiCpu /> NETWORK ONLINE
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: '800', letterSpacing: '-2px', marginBottom: '10px' }}>Discover Explorers</h1>
          <p style={{ color: '#94A3B8', fontSize: '1.1rem' }}>Search the Nexus database for active connections.</p>
          
          <div style={{ position: 'relative', maxWidth: '500px', margin: '30px auto' }}>
            <FiSearch style={{ position: 'absolute', left: '18px', top: '18px', color: '#64748B' }} size={20} />
            <input 
              type="text" 
              placeholder="Query username..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', padding: '16px 20px 16px 55px', 
                backgroundColor: '#1E293B', border: '1px solid #334155', 
                borderRadius: '16px', color: 'white', outline: 'none',
                fontSize: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}
            />
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '25px' 
        }}>
          {filteredUsers.map((user) => (
            <div key={user._id} style={{ 
              backgroundColor: '#1E293B', 
              padding: '24px', 
              borderRadius: '24px', 
              border: '1px solid #334155',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = '#10B981';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#334155';
            }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img 
                  src={user.profilePicture} 
                  style={{ width: '65px', height: '65px', borderRadius: '15px', background: '#0F172A', padding: '5px' }}
                  alt={user.username}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>{user.username}</h3>
                  <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 'bold' }}>ACTIVE_NODE</span>
                </div>
              </div>
              
              <p style={{ margin: 0, fontSize: '14px', color: '#94A3B8', lineHeight: '1.5', minHeight: '42px' }}>
                {user.bio}
              </p>

              <Link href={`/profile/${user.username}`} style={{ textDecoration: 'none', marginTop: '10px' }}>
                <div style={{ color: '#10B981', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  VIEW TERMINAL <FiArrowRight />
                </div>
              </Link>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748B' }}>
            <p>No explorers found in current sector.</p>
          </div>
        )}
      </main>

      <Footer isDarkMode={isDarkMode} />
    </div>
  );
}