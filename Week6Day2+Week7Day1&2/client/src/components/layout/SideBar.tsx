import React from 'react';
import { LayoutDashboard, ShoppingBag, ClipboardList, Settings, ChevronDown } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: false },
    { name: 'All Products', icon: ShoppingBag, active: true },
    { name: 'Order List', icon: ClipboardList, active: false },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full">
      <div className="p-8 mb-4">
        <h1 className="text-3xl font-black text-[#0F172A] italic tracking-tighter">Arık</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
              item.active 
              ? 'bg-[#0F172A] text-white shadow-xl shadow-slate-200' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <item.icon size={20} strokeWidth={item.active ? 2.5 : 2} />
            <span className="font-bold text-sm tracking-wide">{item.name}</span>
          </button>
        ))}

        <div className="pt-6">
          <button className="w-full flex items-center justify-between px-4 py-2 text-slate-400">
            <span className="text-[11px] uppercase font-black tracking-[0.15em]">Categories</span>
            <ChevronDown size={14} />
          </button>
          {/* Mapping categories from your backend could go here */}
        </div>
      </nav>

      <div className="p-6">
        <div className="bg-slate-50 rounded-3xl p-4 flex items-center space-x-3 border border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-[#0F172A] flex items-center justify-center text-white text-xs font-black">
            MN
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-black text-slate-900 truncate">Mairah Nisar</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;