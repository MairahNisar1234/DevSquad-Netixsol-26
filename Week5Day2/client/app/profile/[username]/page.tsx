"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { FiUserPlus, FiUserCheck, FiCalendar, FiSun, FiMoon } from "react-icons/fi";

export default function ProfilePage() {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [me, setMe] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // --- UPDATED BACKEND URL ---
  const BACKEND_URL = "https://deploy-nexus.onrender.com";

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') setIsDarkMode(false);

    const savedUser = localStorage.getItem('user');
    const parsedMe = savedUser ? JSON.parse(savedUser) : null;
    if (parsedMe) setMe(parsedMe);

    // UPDATED FETCH LINK
    fetch(`${BACKEND_URL}/users/profile/${username}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        const myId = parsedMe?.id;
        setIsFollowing(data.followers?.some((f: any) => (f._id || f) === myId));
      });
  }, [username]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const theme = {
    bg: isDarkMode ? '#0F172A' : '#F8FAFC',
    card: isDarkMode ? '#1E293B' : '#FFFFFF',
    text: isDarkMode ? '#F1F5F9' : '#1E293B',
    muted: isDarkMode ? '#94A3B8' : '#64748B',
    accent: '#10B981',
    border: isDarkMode ? '#334155' : '#E2E8F0'
  };

  const handleFollow = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert("Please login to follow!");

    // UPDATED FETCH LINK
    const res = await fetch(`${BACKEND_URL}/users/follow/${profile._id}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.ok) {
      const data = await res.json();
      setIsFollowing(data.isFollowing);
      setProfile({ ...profile, followers: data.updatedFollowers || profile.followers });
    }
  };

  if (!profile) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme.bg, color: theme.text }}>
      <div style={{ fontWeight: 'bold', letterSpacing: '1px' }}>Accessing Nexus Core...</div>
    </div>
  );

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      backgroundColor: theme.bg, 
      color: theme.text, 
      fontFamily: "'Inter', sans-serif",
      transition: 'all 0.3s ease'
    }}>
      <Navbar isDarkMode={isDarkMode} />

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
        {isDarkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
      </button>

      <main style={{ flex: 1 }}>
        {/* HERO BANNER */}
        <div style={{ height: '200px', background: `linear-gradient(135deg, ${theme.accent}, #3B82F6)`, position: 'relative' }}>
          <div className="avatar-container" style={{ position: 'absolute', bottom: '-60px', left: '10%', display: 'flex', alignItems: 'flex-end', gap: '20px' }}>
            <img 
              src={profile.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`} 
              style={{ width: '130px', height: '130px', borderRadius: '24px', border: `6px solid ${theme.bg}`, objectFit: 'cover', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }} 
              alt="Profile"
            />
          </div>
        </div>

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
          {/* HEADER INFO */}
          <div className="profile-header" style={{ marginTop: '75px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(24px, 5vw, 32px)', fontWeight: '800', marginBottom: '4px' }}>{profile.username}</h1>
              <div style={{ color: theme.muted, fontSize: '14px' }}>
                 <span><FiCalendar style={{ marginRight: '6px' }} /> Joined {new Date().getFullYear()}</span>
              </div>
            </div>

            {me?.id !== profile._id ? (
              <button 
                onClick={handleFollow}
                style={{
                  padding: '12px 25px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  backgroundColor: isFollowing ? theme.card : theme.accent,
                  color: isFollowing ? theme.text : 'white',
                  fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px',
                  whiteSpace: 'nowrap'
                }}
              >
                {isFollowing ? <FiUserCheck /> : <FiUserPlus />}
                {isFollowing ? "Following" : "Follow"}
              </button>
            ) : (
              <Link href="/profile/edit">
                <button style={{ padding: '10px 20px', borderRadius: '10px', border: `1px solid ${theme.border}`, background: theme.card, color: theme.text, cursor: 'pointer', fontWeight: '600', whiteSpace: 'nowrap' }}>
                    Edit Profile
                </button>
              </Link>
            )}
          </div>

          {/* TWO COLUMN CONTENT */}
          <div className="content-grid" style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px', paddingBottom: '60px' }}>
            
            {/* LEFT: BIO */}
            <div style={{ backgroundColor: theme.card, padding: '25px', borderRadius: '20px', border: `1px solid ${theme.border}`, height: 'fit-content' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: '700' }}>About</h3>
              <p style={{ lineHeight: '1.6', color: theme.muted }}>
                {profile.bio || "This explorer hasn't added a bio to their Nexus profile yet."}
              </p>
            </div>

            {/* RIGHT: STATS */}
            <div className="stats-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ backgroundColor: theme.card, padding: '20px', borderRadius: '20px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                 <div style={{ fontSize: '24px', fontWeight: '800' }}>{profile.followers?.length || 0}</div>
                 <div style={{ fontSize: '12px', color: theme.muted, textTransform: 'uppercase', letterSpacing: '1px' }}>Followers</div>
              </div>
              <div style={{ backgroundColor: theme.card, padding: '20px', borderRadius: '20px', border: `1px solid ${theme.border}`, textAlign: 'center' }}>
                 <div style={{ fontSize: '24px', fontWeight: '800' }}>{profile.following?.length || 0}</div>
                 <div style={{ fontSize: '12px', color: theme.muted, textTransform: 'uppercase', letterSpacing: '1px' }}>Following</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer isDarkMode={isDarkMode} />

      <style>{`
        @media (max-width: 768px) {
          .avatar-container {
            left: 50% !important;
            transform: translateX(-50%);
            bottom: -50px !important;
          }
          .profile-header {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            margin-top: 60px !important;
          }
          .content-grid {
            grid-template-columns: 1fr !important;
          }
          .stats-container {
            flex-direction: row !important;
          }
          .stats-container > div {
            flex: 1;
          }
        }

        @media (max-width: 480px) {
          .stats-container {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
}