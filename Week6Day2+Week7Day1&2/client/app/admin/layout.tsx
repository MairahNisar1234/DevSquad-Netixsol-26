'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  ChevronDown, 
  ShieldCheck, 
  Menu, 
  X,
  Home // Added Home icon
} from 'lucide-react';
import AdminNavbar from '@/src/components/AdminNavbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [user, setUser] = useState({ role: 'superadmin' }); 

  const isProductsPage = pathname.startsWith('/admin/products');

  useEffect(() => {
    if (isProductsPage) {
      setCategoriesOpen(true);
    }
  }, [isProductsPage]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const navItems = [
    { href: '/admin',             label: 'DASHBOARD',    icon: LayoutDashboard },
    { href: '/admin/products',     label: 'ALL PRODUCTS', icon: Package },
    { href: '/admin/orders',       label: 'ORDER LIST',   icon: ClipboardList },
    { href: '/admin/manage-admins', label: 'MANAGE ADMINS', icon: ShieldCheck, isSuperAdmin: true },
  ];

  return (
    <div className="flex h-screen bg-[#E7E7E3] overflow-hidden">
      
      {/* ── MOBILE OVERLAY ── */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white flex flex-col shrink-0 border-r border-gray-100 shadow-xl 
        transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:relative lg:translate-x-0 lg:shadow-sm lg:z-20
      `}>
        {/* Logo Section */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 20 Q10 8 24 6 Q18 14 20 22 Q14 16 4 20Z" fill="#0B2447" />
            </svg>
            <span className="text-[#0B2447] text-xl font-bold tracking-wide">Arik</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 p-1">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-4 py-6 flex-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, isSuperAdmin }) => {
            if (isSuperAdmin && user.role !== 'superadmin') return null;

            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold tracking-widest transition-all ${
                  active
                    ? 'bg-[#0B2447] text-white shadow-md shadow-blue-900/20'
                    : 'text-gray-400 hover:text-[#0B2447] hover:bg-gray-50'
                }`}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 2} />
                {label}
              </Link>
            );
          })}

          {/* Conditional Categories */}
          {isProductsPage && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center justify-between px-4 py-2 text-[10px] font-bold tracking-widest text-gray-400 hover:text-[#0B2447] transition-colors w-full"
              >
                <span>CATEGORIES</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`}
                />
              </button>
              
              {categoriesOpen && (
                <div className="mt-2 flex flex-col gap-1">
                  {['Men', 'Women', 'Kids', 'Accessories'].map((cat) => (
                    <Link
                      key={cat}
                      href={`/admin/products?category=${cat.toLowerCase()}`}
                      className="px-8 py-2 rounded-lg text-[10px] font-semibold text-gray-400 hover:text-[#0B2447] hover:bg-gray-50 transition-all tracking-widest"
                    >
                      {cat.toUpperCase()}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* ── RETURN TO HOME OPTION ── */}
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold tracking-widest text-gray-400 hover:text-black hover:bg-gray-50 transition-all"
          >
            <Home size={18} />
            RETURN TO SHOP
          </Link>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="text-[#0B2447] p-1">
            <Menu size={24} />
          </button>
          <span className="text-[#0B2447] text-lg font-bold">Arik Admin</span>
          <div className="w-8" />
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}