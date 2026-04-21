"use client";
import React from 'react';
import { useRouter } from 'next/navigation'; // Assuming Next.js based on "use client"
import { Home, Percent, Settings, PieChart, MessageSquare, Bell, LogOut } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { icon: <Home size={20} />, active: true },
    { icon: <Percent size={20} />, active: false },
    { icon: <PieChart size={20} />, active: false },
    { icon: <MessageSquare size={20} />, active: false },
    { icon: <Bell size={20} />, active: false },
    { icon: <Settings size={20} />, active: false },
  ];

  const handleLogout = () => {
    // 1. Clear session data
    localStorage.removeItem('token'); 
    sessionStorage.clear();
    
    // 2. Redirect to login page
    // router.push('/login'); 
    
    // 3. Simple alert for functionality demo
    alert("Logged out successfully!");
  };

  return (
    <aside className="
      /* Mobile: Bottom Fixed Navigation */
      fixed bottom-0 left-0 w-full h-20 border-t 
      /* Desktop: Vertical Sidebar Navigation */
      md:sticky md:top-0 md:w-24 md:h-screen md:min-h-screen md:flex-col md:border-r md:border-t-0
      bg-[#1F1D2B] flex items-center justify-around md:justify-start py-2 md:py-6 gap-0 md:gap-4 border-gray-800 z-[100]
    ">
      
      {/* Brand Logo - Top Section (Desktop Only) */}
      <div className="hidden md:block bg-[#EA7C69]/20 p-3 rounded-xl mb-4">
        <div className="bg-[#EA7C69] w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#EA7C69]/40">
           <span className="font-black">J</span>
        </div>
      </div>

      {/* Navigation Icons - Middle Section */}
      <div className="flex flex-row md:flex-col gap-1 md:gap-2 w-full items-center justify-around md:justify-center">
        {menuItems.map((item, idx) => (
          <div 
            key={idx} 
            className={`relative w-full flex justify-center py-2 md:py-4 transition-all group ${
              item.active ? 'text-white' : 'text-[#EA7C69]'
            }`}
          >
            {/* Desktop Active Indicator (Left) */}
            {item.active && (
              <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1.5 bg-[#EA7C69] rounded-r-lg shadow-[4px_0_15px_rgba(234,124,105,0.4)]" />
            )}

            {/* Mobile Active Indicator (Bottom) */}
            {item.active && (
              <div className="md:hidden absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#EA7C69] rounded-t-lg shadow-[0_-4px_10px_rgba(234,124,105,0.4)]" />
            )}

            <button className={`
              p-2.5 md:p-3 rounded-xl transition-all 
              ${item.active 
                ? 'bg-[#EA7C69] text-white shadow-lg shadow-[#EA7C69]/30 scale-105' 
                : 'hover:bg-[#252836]'
              }
            `}>
              {item.icon}
            </button>
          </div>
        ))}

        {/* Mobile Logout - Integrated into the bottom bar row */}
        <div className="md:hidden flex justify-center py-2">
          <button 
            onClick={handleLogout}
            className="p-2.5 text-[#EA7C69] active:bg-red-500/10 rounded-xl transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Logout - Bottom Section */}
      <div className="hidden md:flex mt-auto">
        <button 
          onClick={handleLogout}
          className="p-3 text-[#EA7C69] hover:bg-red-500/10 rounded-xl transition-colors group"
          title="Logout"
        >
          <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </aside>
  );
}