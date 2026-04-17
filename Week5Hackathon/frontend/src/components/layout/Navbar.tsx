"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  FiBell, FiChevronDown,
  FiLogOut, FiAlertCircle,
  FiPlusCircle, FiX, FiStar, FiMail, FiPhone, FiMenu
} from "react-icons/fi";
import { FaCarSide } from "react-icons/fa";
import { GiTrophyCup } from "react-icons/gi"; 
import { io } from "socket.io-client";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); 
  const [notifications, setNotifications] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [currentAlert, setCurrentAlert] = useState<any>(null);

  const syncWishlist = () => {
    setWishlist(JSON.parse(localStorage.getItem("wishlist") || "[]"));
  };

  useEffect(() => {
    syncWishlist();
    window.addEventListener("wishlistUpdated", syncWishlist);

    // Pointing to your deployed Render URL
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
    if (token) {
      router.push("/profile");
    } else {
      router.push("/auth/login");
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Car Auction", href: "/auction" },
    { label: "Sell Your Car", href: "/sellcar" },
    { label: "About us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      {/* ── Toast Alert ── */}
      {currentAlert && (
        <div className="fixed top-20 right-4 lg:right-8 z-[100]">
          <div className="bg-white border-l-4 border-[#f5c518] shadow-2xl p-4 rounded-sm flex items-start gap-4 min-w-[280px] lg:min-w-[320px]">
            <div className="bg-[#E8EDFA] p-2 rounded-full text-[#1a2e5a]">
              {currentAlert.type === "BID_WINNER"
                ? <GiTrophyCup className="w-5 h-5" />
                : <FiPlusCircle className="w-5 h-5" />}
            </div>
            <div className="flex-1">
              <h4 className="text-[#1a2e5a] font-normal text-sm tracking-tight">
                {currentAlert.title || "New Update"}
              </h4>
              <p className="text-gray-600 text-xs mt-1">{currentAlert.message}</p>
              <button
                onClick={() => router.push(`/auction/${currentAlert.auctionId}`)}
                className="text-[#1a2e5a] text-[10px] font-black underline mt-2"
              >
                View Auction
              </button>
            </div>
            <button onClick={() => setCurrentAlert(null)} className="text-gray-400 hover:text-red-500">
              <FiX className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ── Top Bar (Hidden on Mobile) ── */}
      <div className="hidden lg:flex w-full bg-[#1a2e5a] text-white text-[11px] font-normal tracking-widest py-2 px-10 justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2 opacity-80">
            <FiPhone className="text-[#f5a623]" size={12} /> 570-694-4002
          </span>
          <span className="flex items-center gap-2 opacity-80">
            <FiMail className="text-[#f5a623]" size={12} /> info@cardeposit.com
          </span>
        </div>
        <div className="flex items-center gap-4 opacity-70">
          <span>Mon - Sat: 9:00am - 6:00pm</span>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <nav
        style={{ backgroundColor: "#d6e4f7", borderBottom: "1.5px solid #c2d6f0" }}
        className="w-full py-2.5 px-4 lg:px-10 flex items-center justify-between relative z-40"
      >
        {/* Mobile Burger (Left) */}
        <button 
          className="lg:hidden text-[#1a2e5a] p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX size={24}/> : <FiMenu size={24} />}
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <svg width="34" height="24" viewBox="0 0 54 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="lg:w-[38px] lg:h-[26px]">
            <path
              d="M6 22 L13 9 Q15.5 4 21 4 L33 4 Q38.5 4 41 9 L48 22"
              stroke="#f5a623" strokeWidth="3" fill="none" strokeLinejoin="round" strokeLinecap="round"
            />
            <rect x="3" y="20" width="48" height="11" rx="5" fill="#f5a623" />
            <circle cx="14" cy="33" r="4.5" fill="#f5a623" stroke="#d6e4f7" strokeWidth="1.5" />
            <circle cx="40" cy="33" r="4.5" fill="#f5a623" stroke="#d6e4f7" strokeWidth="1.5" />
            <rect x="19" y="7" width="16" height="11" rx="2.5" fill="#d6e4f7" stroke="#f5a623" strokeWidth="1.5" />
          </svg>
          <span className="text-[#1a2e5a] font-normal text-[15px] lg:text-[17px] leading-none">Car</span>
          <span className="text-[#f5a623] font-normal text-[15px] lg:text-[17px] leading-none">Deposit</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden lg:flex items-center gap-9">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[13.5px] transition-colors"
                  style={{
                    color: "#1a2e5a",
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-3 lg:gap-5">
          <div className="relative">
            <button
              onClick={() => { setWishlistOpen(!wishlistOpen); setNotifOpen(false); setDropdownOpen(false); }}
              className="relative flex items-center justify-center p-1 transition-transform active:scale-90"
              style={{ color: wishlistOpen ? "#f5a623" : "#1a2e5a" }}
            >
              <FiStar className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]" fill={wishlistOpen ? "currentColor" : "none"} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-black w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {wishlistOpen && (
              <div className="absolute right-[-50px] lg:right-0 top-10 bg-white border border-gray-100 shadow-2xl rounded-sm w-[280px] lg:w-80 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-[#1a2e5a] p-3 text-white text-[10px] font-black tracking-widest flex justify-between items-center">
                  <span>My Wishlist ({wishlist.length})</span>
                  <FiStar className="text-[#f5c518]" />
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {wishlist.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-xs">Your wishlist is empty</div>
                  ) : (
                    wishlist.map((item) => (
                      <Link
                        key={item._id}
                        href={`/auction/${item._id}`}
                        className="flex items-center gap-3 p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors"
                        onClick={() => setWishlistOpen(false)}
                      >
                        <img src={item.images?.[0]} className="w-10 h-10 lg:w-12 lg:h-12 object-cover rounded-sm" alt="car" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[#1a2e5a] text-xs font-semibold truncate">{item.title}</p>
                          <p className="text-[10px] text-gray-400">${item.basePrice?.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
                <Link
                  href="/profile"
                  className="block text-center p-3 text-[10px] font-black text-[#1a2e5a] bg-gray-50 hover:bg-[#f5c518] transition-colors"
                  onClick={() => setWishlistOpen(false)}
                >
                  View Full Wishlist
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setNotifOpen(!notifOpen); setWishlistOpen(false); setDropdownOpen(false); }}
              className="relative flex items-center justify-center p-1"
              style={{ color: "#1a2e5a" }}
            >
              <FiBell className="w-[20px] h-[20px] lg:w-[22px] lg:h-[22px]" />
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#f5c518] text-[#1a2e5a] text-[8px] font-black w-3.5 h-3.5 lg:w-4 lg:h-4 rounded-full flex items-center justify-center animate-pulse">
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-[-20px] lg:right-0 top-10 bg-white shadow-2xl rounded-sm w-64 lg:w-72 z-50 overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2">
                <div className="bg-[#1a2e5a] p-3 text-white text-[10px] font-black flex justify-between items-center">
                  <span>Notifications</span>
                  <button onClick={() => setNotifications([])} className="text-[#f5c518] hover:underline text-[10px] font-black">
                    Clear
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-xs">No notifications yet</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className={`p-3 border-b border-gray-50 text-xs ${n.read ? "opacity-60" : ""}`}>
                        <p className="font-normal text-[#1a2e5a] text-[11px]">{n.title || "Update"}</p>
                        <p className="text-gray-500 mt-0.5">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="flex items-center gap-0.5">
              <button
                onClick={handleProfileClick}
                className="transition-transform active:scale-95"
                style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "#fff", border: "1.5px solid #c2d6f0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <FaCarSide style={{ width: 15, height: 15, color: "#1a2e5a" }} />
              </button>
              <button 
                onClick={() => { setDropdownOpen(!dropdownOpen); setNotifOpen(false); setWishlistOpen(false); }}
                style={{ color: "#1a2e5a" }}
              >
                <FiChevronDown className="w-4 h-4 ml-0.5" />
              </button>
            </div>

            {dropdownOpen && (
              <div className="absolute right-0 top-11 bg-white border border-gray-100 shadow-lg rounded-sm w-44 lg:w-48 z-50 py-1 overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 mb-1">
                  <p className="text-[9px] font-black text-gray-400">Account</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#1a2e5a] font-normal hover:bg-[#f0f4ff] transition-colors"
                >
                  <FaCarSide className="w-4 h-4" /> Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 font-normal hover:bg-red-50 transition-colors border-t border-gray-50 mt-1"
                >
                  <FiLogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-[#d6e4f7] border-t border-[#c2d6f0] lg:hidden animate-in slide-in-from-top duration-300 shadow-xl">
            <ul className="flex flex-col p-4 gap-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-[14px] p-2 rounded-md transition-colors"
                      style={{
                        color: "#1a2e5a",
                        backgroundColor: isActive ? "#c2d6f0" : "transparent",
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}