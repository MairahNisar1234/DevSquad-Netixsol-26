"use client";
import { useEffect, useState } from 'react';
import { socket } from '@/lib/socket';
import Link from 'next/link';
import { FiBell, FiUser, FiLogOut, FiInfo, FiCheckCircle } from "react-icons/fi";

interface NavbarProps {
  isDarkMode?: boolean;
}

export default function Navbar({ isDarkMode = true }: NavbarProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState<{ username: string; id: string; profilePicture?: string } | null>(null);
  
  // NEW: State for the popup alert
  const [activeToast, setActiveToast] = useState<any>(null);

  const theme = {
    bg: isDarkMode ? '#1E293B' : '#FFFFFF',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    textMain: isDarkMode ? '#FFFFFF' : '#0F172A',
    textMuted: isDarkMode ? '#94A3B8' : '#64748B',
    dropdownBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    accent: '#10B981',
  };

  const loadUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  useEffect(() => {
    loadUserData();
    const handleStorageUpdate = () => loadUserData();
    window.addEventListener('storage', handleStorageUpdate);

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.id) {
        socket.emit('join_notifications', parsed.id);
        
        const handleNewNotif = (notif: any) => {
          setNotifications(prev => [notif, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // TRIGGER POPUP ALERT
          setActiveToast(notif);
          setTimeout(() => setActiveToast(null), 5000); // Auto-hide after 5s
        };

        socket.on('new_notification', handleNewNotif);
        return () => { 
          socket.off('new_notification', handleNewNotif);
          window.removeEventListener('storage', handleStorageUpdate);
        };
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
  <nav style={{ 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 40px', height: '85px', backgroundColor: theme.bg, 
    borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, zIndex: 1000,
    fontFamily: "'Inter', sans-serif"
  }}>
    
    {/* --- BEAUTIFUL POPUP ALERT --- */}
    {activeToast && (
      <div style={{
        position: 'fixed', top: '100px', right: '20px', 
        backgroundColor: theme.dropdownBg, borderLeft: `4px solid ${theme.accent}`,
        padding: '15px 25px', borderRadius: '8px', zIndex: 9999,
        boxShadow: '0 15px 35px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: '12px',
        animation: 'slideIn 0.3s ease-out forwards', color: theme.textMain
      }}>
        <FiCheckCircle color={theme.accent} size={20} />
        <div>
          <div style={{ fontSize: '11px', color: theme.accent, fontWeight: 'bold', textTransform: 'uppercase' }}>New Signal</div>
          <div style={{ fontSize: '13px' }}><b style={{ color: theme.accent }}>@{activeToast.from}</b> {activeToast.message}</div>
        </div>
        <button onClick={() => setActiveToast(null)} style={{ background: 'none', border: 'none', color: theme.textMuted, cursor: 'pointer', marginLeft: '10px' }}>×</button>
      </div>
    )}

    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
        <div style={{ width: '22px', height: '22px', background: theme.accent, borderRadius: '4px' }}></div>
        <span style={{ color: theme.textMain, fontWeight: '800', letterSpacing: '-0.5px', fontSize: '20px' }}>NEXUS CORE</span>
      </Link>
    </div>
    
    <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
      <div style={{ position: 'relative' }}>
          <div onClick={() => { setShowDropdown(!showDropdown); setUnreadCount(0); }} style={{ cursor: 'pointer', position: 'relative' }}>
            <FiBell size={22} color={unreadCount > 0 ? theme.accent : theme.textMuted} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: '#EF4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px' }}>
                {unreadCount}
              </span>
            )}
          </div>

          {showDropdown && (
            <div style={{
              position: 'absolute', top: '40px', right: '0', width: '280px', 
              backgroundColor: theme.dropdownBg, border: `1px solid ${theme.border}`, 
              borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 1001,
              maxHeight: '350px', overflowY: 'auto'
            }}>
              <div style={{ padding: '12px', fontWeight: 'bold', borderBottom: `1px solid ${theme.border}`, color: theme.textMain }}>Notifications</div>
              {notifications.length === 0 ? (
                <div style={{ padding: '20px', color: theme.textMuted, textAlign: 'center', fontSize: '13px' }}>No new updates</div>
              ) : (
                notifications.map((n, i) => (
                  <div key={i} style={{ padding: '12px', borderBottom: `1px solid ${theme.border}`, fontSize: '13px', color: theme.textMain }}>
                    <b style={{ color: theme.accent }}>@{n.from}</b> {n.message}
                  </div>
                ))
              )}
            </div>
          )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderLeft: `1px solid ${theme.border}`, paddingLeft: '20px' }}>
        {user ? (
          <>
            <Link href={`/profile/${user.username}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: theme.textMain, textDecoration: 'none' }}>
              <div style={{ width: '35px', height: '35px', borderRadius: '8px', overflow: 'hidden', border: `2px solid ${theme.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#334155' }}>
                {user.profilePicture ? <img src={user.profilePicture} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <FiUser color={theme.accent} />}
              </div>
              <span style={{ fontWeight: '600', fontSize: '14px' }}>{user.username}</span>
            </Link>
            <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #EF4444', color: '#EF4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Logout</button>
          </>
        ) : (
          <Link href="/login" style={{ backgroundColor: theme.accent, color: 'white', padding: '8px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', fontWeight: '700' }}>Login</Link>
        )}
      </div>
    </div>

    {/* Inline Animation Script */}
    <style>{`
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `}</style>
  </nav>
);
}