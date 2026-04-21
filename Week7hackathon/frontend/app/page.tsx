"use client";
import { useEffect, useState } from 'react';
import UserDashboard from './menu/page';
import LoginPage from './login/page';
import SideBar from '@/src/components/SideBar';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) return <div className="bg-[#252836] min-h-screen" />;

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen bg-[#252836]">
      <SideBar />
      <main className="flex-1 overflow-hidden">
        <UserDashboard />
      </main>
    </div>
  );
}