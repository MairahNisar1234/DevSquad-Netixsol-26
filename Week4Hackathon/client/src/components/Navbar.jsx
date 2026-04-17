import React from 'react';
// @ts-ignore
import logoSrc from '../assets/logo.png'; 

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-10 py-6">
      
      {/* 1. LOGO */}
      <div className="flex items-center gap-2">
        <img src={logoSrc} alt="StreamVibe" className="h-10 w-auto" />
        <span className="text-white text-2xl font-bold tracking-tight">StreamVibe</span>
      </div>

      {/* 2. CENTER PILL (Match the Figma floating look) */}
      <div className="bg-[#0f0f0f] border border-[#262626] rounded-xl p-1.5 flex items-center gap-1">
        <button className="bg-[#1a1a1a] text-white px-5 py-2.5 rounded-lg text-sm font-medium">
          Home
        </button>
        <button className="text-[#bfbfbf] hover:text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
          Movies & Shows
        </button>
        <button className="text-[#bfbfbf] hover:text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
          Support
        </button>
        <button className="text-[#bfbfbf] hover:text-white px-5 py-2.5 rounded-lg text-sm font-medium transition">
          Subscriptions
        </button>
      </div>

      {/* 3. RIGHT ICONS */}
      <div className="flex items-center gap-5">
        <button className="text-white hover:text-gray-400">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
        <button className="text-white hover:text-gray-400">
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;