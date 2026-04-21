"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Settings, 
  ShoppingBag, 
  PieChart, 
  LogOut, 
  Store,
  Box
} from 'lucide-react';

const menuItems = [
  { icon: <Home size={24} />, href: '/admin/dashboard', label: 'Dashboard' },
  { icon: <Store size={24} />, href: '/admin/orders', label: 'Orders' },
  { icon: <Box size={24} />, href: '/admin/products', label: 'Products' },
  { icon: <Settings size={24} />, href: '/admin/materials', label: 'Materials' },
  { icon: <PieChart size={24} />, href: '/admin/analytics', label: 'Analytics' },
];

export default function SideBar() {
  const pathname = usePathname();

  return (
    <nav className="
      /* Mobile: Bottom Fixed Bar */
      fixed bottom-0 left-0 w-full h-20 border-t 
      /* Desktop: Vertical Sidebar */
      md:sticky md:top-0 md:w-24 md:h-screen md:min-h-screen md:flex-col md:border-r md:border-t-0
      bg-[#1F1D2B] flex items-center justify-around md:justify-start md:py-8 border-gray-800 z-[100]
    ">
      
      {/* Brand Logo - Hidden on mobile bottom bar */}
      <div className="hidden md:flex mb-10 p-3 bg-[#EA7C69]/20 rounded-xl text-[#EA7C69] hover:rotate-12 transition-transform cursor-pointer">
        <ShoppingBag size={32} />
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-row md:flex-col gap-2 md:gap-4 w-full items-center justify-around md:justify-center">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <div key={item.href} className="relative group flex items-center justify-center w-full">
              {/* Desktop Active Indicator (Right) */}
              {isActive && (
                <div className="hidden md:block absolute right-0 w-1.5 h-10 bg-[#EA7C69] rounded-l-lg" />
              )}
              
              {/* Mobile Active Indicator (Top) */}
              {isActive && (
                <div className="block md:hidden absolute -top-4 w-10 h-1.5 bg-[#EA7C69] rounded-b-lg" />
              )}
              
              <Link
                href={item.href}
                className={`p-3 md:p-4 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#EA7C69] text-white shadow-lg shadow-[#EA7C69]/30 scale-110 md:scale-100' 
                    : 'text-[#EA7C69] hover:bg-[#252836]'
                }`}
                title={item.label}
              >
                {/* Responsive Icon Sizes */}
                {React.cloneElement(item.icon as React.ReactElement, { 
                  size: typeof window !== 'undefined' && window.innerWidth < 768 ? 22 : 24 
                })}
              </Link>
              
              {/* Tooltip - Desktop Only */}
              <span className="hidden md:block absolute left-24 scale-0 group-hover:scale-100 transition-all bg-[#1F1D2B] text-white text-xs p-2 rounded-md border border-gray-700 z-50 whitespace-nowrap shadow-xl">
                {item.label}
              </span>
            </div>
          );
        })}

        {/* Mobile Logout - Visible in the row */}
        <div className="md:hidden flex items-center justify-center w-full">
            <button className="p-3 text-[#EA7C69] hover:bg-[#EA7C69] hover:text-white rounded-xl transition-all">
                <LogOut size={22} />
            </button>
        </div>
      </div>

      {/* Desktop Logout - Bottom Section */}
      <div className="hidden md:flex mt-auto group relative items-center justify-center w-full">
        <button className="p-4 text-[#EA7C69] hover:bg-[#EA7C69] hover:text-white rounded-xl transition-all duration-300">
          <LogOut size={24} />
        </button>
        <span className="absolute left-24 scale-0 group-hover:scale-100 transition-all bg-[#1F1D2B] text-white text-xs p-2 rounded-md border border-gray-700 z-50">
          Logout
        </span>
      </div>
    </nav>
  );
}