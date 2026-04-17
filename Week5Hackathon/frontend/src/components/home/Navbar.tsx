"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FiBell, FiChevronDown, FiMenu,
  FiLogOut, FiAlertCircle,
  FiPlusCircle, FiX, FiStar, FiMail, FiPhone
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa"; 
import { GiTrophyCup } from "react-icons/gi";
import { io } from "socket.io-client";

export default function Navbar() {
  const router   = useRouter();
  const pathname = usePathname();

  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [wishlistOpen,  setWishlistOpen]  = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const [notifications, setNotifications] = useState<any[]>([]);
  const [wishlist,      setWishlist]      = useState<any[]>([]);
  const [currentAlert,  setCurrentAlert]  = useState<any>(null);

  const syncWishlist = () => {
    setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
  };

  useEffect(() => {
    syncWishlist();
    window.addEventListener("wishlistUpdated", syncWishlist);

    // Pointing to the deployed Render backend for real-time updates
    const socket = io("https://auction-backend-gt06.onrender.com", { 
      transports: ["websocket"] 
    });

    socket.on("notification", (data) => {
      const n = {
        id: Date.now(), message: data.message, title: data.title,
        type: data.type, auctionId: data.auctionId, read: false, time: new Date(),
      };
      setNotifications((prev) => [n, ...prev]);
      setCurrentAlert(n);
      setTimeout(() => setCurrentAlert(null), 5000);
    });

    return () => {
      socket.disconnect();
      window.removeEventListener("wishlistUpdated", syncWishlist);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem("token");
    if (token) router.push("/profile");
    else router.push("/auth/login");
  };

  const navLinks = [
    { label: "Home",         href: "/" },
    { label: "Car Auction",    href: "/auction" },
    { label: "Sell Your Car",  href: "/sellcar" },
    { label: "About us",       href: "/about" },
    { label: "Contact",        href: "/contact" },
  ];

  return (
    <>
      {/* ── Toast Alert ── */}
      {currentAlert && (
        <div className="fixed top-20 right-4 md:right-8 z-[100] left-4 md:left-auto">
          <div className="bg-white border-l-4 border-[#f5c518] shadow-2xl p-4 rounded-sm flex items-start gap-4">
            <div className="bg-[#E8EDFA] p-2 rounded-full text-[#1a2e5a] shrink-0">
              {currentAlert.type === "BID_WINNER" ? <GiTrophyCup className="w-5 h-5" /> : <FiPlusCircle className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h4 className="text-[#1a2e5a] font-normal text-sm">{currentAlert.title || "New Update"}</h4>
              <p className="text-gray-600 text-xs mt-1">{currentAlert.message}</p>
              <button onClick={() => router.push(`/auction/${currentAlert.auctionId}`)} className="text-[#1a2e5a] text-[10px] font-black underline mt-2">View Auction</button>
            </div>
            <button onClick={() => setCurrentAlert(null)} className="text-gray-400"><FiX className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* ── Top Bar ── */}
      <div className="w-full bg-[#1a2e5a] text-white text-[10px] md:text-[11px] font-normal tracking-widest py-2 px-4 md:px-10 flex justify-between items-center">
        <div className="flex items-center gap-3 md:gap-6">
          <span className="flex items-center gap-1.5 md:gap-2 opacity-80">
            <FiPhone className="text-[#f5a623]" size={10} /> <span className="hidden xs:inline">570-694-4002</span>
          </span>
          <span className="flex items-center gap-1.5 md:gap-2 opacity-80">
            <FiMail className="text-[#f5a623]" size={10} /> <span className="hidden sm:inline">info@cardeposit.com</span>
          </span>
        </div>
        <div className="opacity-70 text-[9px] md:text-[11px]">
          <span>Mon - Sat: 9:00am - 6:00pm</span>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <nav
        style={{ backgroundColor: "#d6e4f7", borderBottom: "1.5px solid #c2d6f0" }}
        className="w-full py-3 px-4 md:px-10 flex items-center justify-between relative z-40"
      >
        {/* Mobile Menu Toggle */}
        <button 
          className="lg:hidden text-[#1a2e5a] text-2xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
          <svg width="32" height="22" viewBox="0 0 54 36" fill="none">
            <path d="M6 22 L13 9 Q15.5 4 21 4 L33 4 Q38.5 4 41 9 L48 22" stroke="#f5a623" strokeWidth="3" fill="none" />
            <rect x="3" y="20" width="48" height="11" rx="5" fill="#f5a623" />
            <circle cx="14" cy="33" r="4.5" fill="#f5a623" stroke="#d6e4f7" strokeWidth="1.5" />
            <circle cx="40" cy="33" r="4.5" fill="#f5a623" stroke="#d6e4f7" strokeWidth="1.5" />
          </svg>
          <span className="text-[#1a2e5a] font-bold text-base md:text-[17px]">Car</span>
          <span className="text-[#f5a623] font-bold text-base md:text-[17px]">Deposit</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-[13.5px]" style={{ color: "#1a2e5a", fontWeight: pathname === link.href ? 700 : 500 }}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-3 md:gap-5">
          <div className="relative">
            <button onClick={() => { setWishlistOpen(!wishlistOpen); setNotifOpen(false); setDropdownOpen(false); }} className="p-1" style={{ color: wishlistOpen ? "#f5a623" : "#1a2e5a" }}>
              <FiStar className="w-5 h-5 md:w-[22px] md:h-[22px]" fill={wishlistOpen ? "currentColor" : "none"} />
              {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{wishlist.length}</span>}
            </button>
            {wishlistOpen && (
              <div className="absolute right-[-50px] md:right-0 top-10 bg-white shadow-2xl rounded-sm w-72 md:w-80 z-50">
                <div className="bg-[#1a2e5a] p-3 text-white text-[10px] font-black flex justify-between items-center">
                  <span>Wishlist ({wishlist.length})</span>
                  <FiStar className="text-[#f5c518]" />
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {wishlist.length === 0 ? <div className="p-6 text-center text-gray-400 text-xs">Empty</div> : wishlist.map(item => (
                    <Link key={item._id} href={`/auction/${item._id}`} className="flex items-center gap-3 p-3 border-b hover:bg-gray-50" onClick={() => setWishlistOpen(false)}>
                      <img src={item.images?.[0]} className="w-10 h-10 object-cover rounded" alt="car" />
                      <div className="min-w-0"><p className="text-[#1a2e5a] text-xs font-semibold truncate">{item.title}</p></div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button onClick={() => { setNotifOpen(!notifOpen); setWishlistOpen(false); setDropdownOpen(false); }} className="p-1 text-[#1a2e5a]">
              <FiBell className="w-5 h-5 md:w-[22px] md:h-[22px]" />
              {notifications.filter(n => !n.read).length > 0 && <span className="absolute -top-1 -right-1 bg-[#f5c518] text-[#1a2e5a] text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">{notifications.filter(n => !n.read).length}</span>}
            </button>
          </div>

          <div className="relative flex items-center">
            <button onClick={handleProfileClick} className="w-8 h-8 md:w-[34px] md:h-[34px] rounded-full bg-white border border-[#c2d6f0] flex items-center justify-center">
              <FaCarSide className="text-[#1a2e5a] text-sm md:text-base" />
            </button>
            <button onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); setWishlistOpen(false); }} className="text-[#1a2e5a]">
              <FiChevronDown className="w-4 h-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-11 bg-white border shadow-lg rounded-sm w-40 z-50 py-1">
                <Link href="/profile" className="block px-4 py-2 text-sm text-[#1a2e5a] hover:bg-gray-50">Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 border-t">Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile Sidebar Menu ── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-[#d6e4f7] p-6 shadow-xl animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-[#1a2e5a]">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-2xl text-[#1a2e5a]"><FiX /></button>
            </div>
            <ul className="space-y-6">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-lg font-semibold text-[#1a2e5a]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}