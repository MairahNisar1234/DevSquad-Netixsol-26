"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiAlertCircle, FiCheckCircle, FiX, FiTrendingUp, FiStar } from 'react-icons/fi';

interface AuctionProps {
  auction?: any; 
}

const AuctionListCard: React.FC<AuctionProps> = ({ auction }) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });
  const [alert, setAlert] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const totalBidsCount = auction?.bidCount || 0;

  const currentDisplayPrice = auction?.highestBid || auction?.currentBid || auction?.basePrice || 0;

  useEffect(() => {
    if (!auction?._id) return;
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setIsWishlisted(wishlist.some((item: any) => item._id === auction._id));
  }, [auction?._id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); 
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (isWishlisted) {
      const updated = wishlist.filter((item: any) => item._id !== auction?._id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setIsWishlisted(false);
      showAlert("Removed from wishlist", "success");
    } else {
      wishlist.push(auction);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      setIsWishlisted(true);
      showAlert("Added to wishlist", "success");
    }
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const formatEndTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const showAlert = (message: string, type: 'error' | 'success') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3500);
  };

  const handleBidClick = (e: React.MouseEvent) => {
    const token = localStorage.getItem("token");
    if (!token) {
      e.preventDefault();
      showAlert("Please sign in to place a bid on this vehicle.", "error");
      setTimeout(() => router.push("/auth/login"), 1500);
    }
  };

  useEffect(() => {
    const targetDate = auction?.endTime ? new Date(auction.endTime).getTime() : new Date().getTime();
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [auction?.endTime]);

  return (
    <>
      {alert && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-2xl text-white text-sm font-semibold transition-all duration-300
          ${alert.type === 'error' ? 'bg-[#e63946]' : 'bg-green-500'}`}
        >
          {alert.type === 'error' ? <FiAlertCircle className="w-5 h-5 shrink-0" /> : <FiCheckCircle className="w-5 h-5 shrink-0" />}
          <span>{alert.message}</span>
          <button onClick={() => setAlert(null)} className="ml-4 text-white/70 hover:text-white">
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="w-full bg-white border border-gray-200 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow duration-300 relative rounded-sm">

        {/* 1. Image */}
        <div className="w-full md:w-[220px] relative shrink-0">
          <img
            src={auction?.images?.[0] || 'https://via.placeholder.com/400x300?text=Car+Image'}
            className="w-full h-48 md:h-full object-cover"
            alt={`${auction?.make} ${auction?.model}`}
          />
          <button 
            onClick={toggleWishlist}
            className={`absolute top-2 right-2 p-1.5 rounded-full shadow-md transition-all z-10 ${
              isWishlisted ? 'bg-[#f5c518] text-[#1e2b58]' : 'bg-white/80 text-gray-400 hover:text-[#f5c518]'
            }`}
          >
            <FiStar className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <div className="absolute top-2 left-2 bg-[#e63946] text-white text-[9px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 uppercase tracking-wide">
            <FiTrendingUp className="w-3 h-3" /> Trending
          </div>
        </div>

        {/* 2. Middle Info */}
        <div className="p-5 flex-1 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-[#1e2b58] mb-1">
              {auction?.make} {auction?.model}
            </h2>
            <div className="flex items-center gap-0.5 text-[#ffcc41] mb-3 text-sm">
              ★ ★ ★ ★ ★
            </div>
            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 md:line-clamp-3 mb-3">
              {auction?.description || "Explore this premium listing. High-quality vehicle with verified history and excellent performance metrics."}
            </p>
            <Link
              href={`/auction/${auction?._id}`}
              onClick={handleBidClick}
              className="text-[#1e2b58] text-xs font-bold underline hover:text-blue-700"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* 3. Right Panel */}
        <div className="p-5 flex flex-col justify-between items-start w-full md:w-[260px] shrink-0 gap-4 md:gap-3 bg-gray-50/30 md:bg-transparent">
          <div className="flex justify-between w-full">
            <div>
              <p className="text-[#1e2b58] font-black text-xl leading-none">
                ${currentDisplayPrice.toLocaleString()}
              </p>
              <p className="text-gray-400 text-[10px] font-semibold uppercase mt-1">Current Bid</p>
            </div>
            <div className="text-right">
              <p className="text-[#1e2b58] font-black text-xl leading-none">
                {totalBidsCount}
              </p>
              <p className="text-gray-400 text-[10px] font-semibold uppercase mt-1">Total Bids</p>
            </div>
          </div>

          <div className="w-full">
            <div className="flex gap-1 mb-1">
              {[
                { val: timeLeft.days, label: 'Days' },
                { val: timeLeft.hours, label: 'Hours' },
                { val: timeLeft.mins, label: 'Mins' },
                { val: timeLeft.secs, label: 'Secs' },
              ].map((unit, i) => (
                <div key={i} className="bg-[#f0f4ff] border border-blue-100 flex-1 h-11 rounded flex flex-col items-center justify-center min-w-[40px]">
                  <p className="text-xs font-bold text-[#1e2b58]">{String(unit.val).padStart(2, '0')}</p>
                  <p className="text-[7px] text-gray-400 uppercase font-bold">{unit.label}</p>
                </div>
              ))}
            </div>
            <p className="text-[9px] font-bold text-gray-400 uppercase">Time Left</p>
          </div>

          <div className="w-full">
            <p className="text-[#1e2b58] text-xs font-bold">{formatEndTime(auction?.endTime)}</p>
            <p className="text-gray-400 text-[9px] uppercase font-semibold mt-0.5">End Time</p>
          </div>

          <Link href={`/auction/${auction?._id}`} onClick={handleBidClick} className="w-full">
            <button className="w-full border-2 border-[#1e2b58] text-[#1e2b58] py-2.5 rounded-sm font-black text-xs uppercase tracking-wider hover:bg-[#1e2b58] hover:text-white transition-all active:scale-[0.98]">
              Submit A Bid
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AuctionListCard;