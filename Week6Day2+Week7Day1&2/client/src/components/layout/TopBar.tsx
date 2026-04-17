import React from 'react';
import { Search, Bell, User, Settings, LogOut } from 'lucide-react';

const Topbar = () => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
      {/* 1. Search Bar - Left Side */}
      <div className="relative w-96 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-slate-400 group-focus-within:text-[#0F172A] transition-colors" size={18} />
        </div>
        <input
          type="text"
          placeholder="Search for products, orders..."
          className="block w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium placeholder:text-slate-400 focus:ring-2 focus:ring-[#0F172A]/10 focus:bg-white transition-all outline-none"
        />
      </div>

      {/* 2. Actions - Right Side */}
      <div className="flex items-center space-x-6">
        {/* Notification Bell */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
          <Bell size={22} />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
        </button>

        {/* Vertical Divider */}
        <div className="h-8 w-[1px] bg-slate-200"></div>

        {/* Admin Profile Dropdown */}
        <div className="flex items-center space-x-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-none">Mairah Nisar</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AI Specialist</p>
          </div>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white text-xs font-black ring-4 ring-slate-50 transition-all group-hover:ring-slate-100">
              MN
            </div>
            {/* Status Indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;