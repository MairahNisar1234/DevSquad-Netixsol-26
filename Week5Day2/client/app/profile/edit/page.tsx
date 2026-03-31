"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
];

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  // --- UPDATED BACKEND URL ---
  const BACKEND_URL = "https://deploy-nexus.onrender.com";

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setSelectedAvatar(parsed.profilePicture || AVATAR_OPTIONS[0]);
      setBio(parsed.bio || "");
    }
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      // UPDATED FETCH LINK
      const res = await fetch(`${BACKEND_URL}/users/update-profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ profilePicture: selectedAvatar, bio })
      });

      if (res.ok) {
        const data = await res.json();
        // 1. UPDATE LOCAL STORAGE
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // 2. TRIGGER NAVBAR REFRESH
        window.dispatchEvent(new Event("storage"));
        
        // 3. REDIRECT
        router.push(`/profile/${user.username}`);
      }
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F172A', color: 'white' }}>
      <Navbar isDarkMode={true} />
      <main style={{ maxWidth: '500px', margin: '60px auto', padding: '0 20px' }}>
        <div style={{ backgroundColor: '#1E293B', padding: '30px', borderRadius: '24px', border: '1px solid #334155' }}>
          <h2 style={{ marginBottom: '25px' }}>Customize Identity</h2>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src={selectedAvatar} style={{ width: '110px', height: '110px', borderRadius: '20px', border: '3px solid #10B981' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '30px' }}>
            {AVATAR_OPTIONS.map((url) => (
              <img
                key={url} src={url}
                onClick={() => setSelectedAvatar(url)}
                style={{
                  width: '100%', borderRadius: '12px', cursor: 'pointer',
                  border: selectedAvatar === url ? '3px solid #10B981' : '2px solid transparent',
                  background: '#0F172A', padding: '4px', transition: '0.2s'
                }}
              />
            ))}
          </div>
          <label style={{ fontSize: '14px', color: '#94A3B8' }}>Bio</label>
          <textarea 
            value={bio} onChange={(e) => setBio(e.target.value)}
            style={{ width: '100%', background: '#0F172A', border: '1px solid #334155', color: 'white', padding: '12px', borderRadius: '8px', marginTop: '5px', minHeight: '80px' }}
          />
          <button onClick={handleUpdate} disabled={loading} style={{ width: '100%', marginTop: '20px', padding: '12px', borderRadius: '8px', background: '#10B981', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
            {loading ? "Syncing..." : "Save Profile"}
          </button>
        </div>
      </main>
    </div>
  );
}