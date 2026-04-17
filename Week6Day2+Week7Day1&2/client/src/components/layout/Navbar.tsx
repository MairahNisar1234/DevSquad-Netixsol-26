'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  User,
  Search,
  X,
  LogOut,
  Menu,
} from 'lucide-react';

import { useCart } from '@/src/context/cartContext';
import { useAuth } from '@/src/context/authContext';

export default function Navbar() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state

  const { totalItems } = useCart();
  const { logout } = useAuth();
  const router = useRouter();

  const BASE_URL = 'http://localhost:3000/api';

  const handleLogout = useCallback(() => {
    logout();
    localStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setUserProfile(null);
    setIsMenuOpen(false);
    router.push('/auth/login');
  }, [logout, router]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      setIsLoggedIn(true);
      fetch(`${BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(async (res) => {
        if (!res.ok) throw new Error("Session Expired");
        return res.json();
      })
      .then(data => {
        const userData = data.user || data;
        setUserProfile(userData);
      })
      .catch(err => {
        console.error("Navbar Auth Sync Error:", err);
        handleLogout();
      });
    } else {
      setIsLoggedIn(false);
      setUserProfile(null);
    }
  }, [handleLogout]);

  const handleProfileClick = () => {
    const token = localStorage.getItem('access_token');
    setIsMenuOpen(false);
    if (token) {
      router.push('/dashboard'); 
    } else {
      router.push('/auth/login'); 
    }
  };

  return (
    <>
      {/* TOP BANNER */}
      {bannerVisible && (
        <div className="bg-black text-white text-center py-2 text-xs relative z-[60]">
          Sign up and get 20% off
          <button
            onClick={() => setBannerVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          
          <div className="flex items-center gap-4">
            {/* HAMBURGER ICON (Mobile Only) */}
            <button 
              className="md:hidden p-1"
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            {/* LOGO */}
            <Link href="/" className="font-black text-2xl tracking-tighter">
              SHOP.CO
            </Link>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="/shop" className="hover:text-gray-600 transition">Shop</Link>
            <Link href="/shop" className="hover:text-gray-600 transition">On Sale</Link>
            <Link href="/shop" className="hover:text-gray-600 transition">New Arrivals</Link>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search size={16} className="absolute left-4 top-2.5 text-gray-400" />
              <input
                className="w-full bg-gray-100 rounded-full pl-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                placeholder="Search products..."
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2 md:gap-4">
            
            {/* MOBILE SEARCH ICON (Visible only on small screens) */}
            <button className="md:hidden p-2">
               <Search size={22} />
            </button>

            {/* CART */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition">
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* PROFILE */}
            <button 
              onClick={handleProfileClick}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 hover:scale-105 transition"
            >
              {isLoggedIn && userProfile?.avatar ? (
                <img src={userProfile.avatar} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className={isLoggedIn ? "text-black" : "text-gray-400"} />
              )}
            </button>

            {/* LOGOUT (Desktop only for cleaner mobile UI, or keep for both) */}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="hidden md:block p-2 hover:bg-red-50 text-red-500 rounded-full transition"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 z-[100] transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" onClick={() => setIsMenuOpen(false)} />
        
        {/* Drawer content */}
        <div className="absolute inset-y-0 left-0 w-3/4 max-w-sm bg-white shadow-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <span className="font-black text-2xl">SHOP.CO</span>
            <button onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
          </div>

          <nav className="flex flex-col gap-6 text-lg font-bold uppercase tracking-tight">
            <Link href="/shop" onClick={() => setIsMenuOpen(false)}>Shop</Link>
            <Link href="/shop" onClick={() => setIsMenuOpen(false)}>On Sale</Link>
            <Link href="/shop" onClick={() => setIsMenuOpen(false)}>New Arrivals</Link>
            <Link href="/shop" onClick={() => setIsMenuOpen(false)}>Brands</Link>
          </nav>

          <div className="mt-auto border-t pt-6">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-bold"
              >
                <LogOut size={20} /> Logout
              </button>
            ) : (
              <Link 
                href="/auth/login" 
                onClick={() => setIsMenuOpen(false)}
                className="block bg-black text-white text-center py-3 rounded-xl font-bold"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}