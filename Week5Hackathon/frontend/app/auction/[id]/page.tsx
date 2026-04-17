"use client";

import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { FaTrophy } from 'react-icons/fa';
import { FiStar } from 'react-icons/fi';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import { io, Socket } from 'socket.io-client';
import toast from 'react-hot-toast';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../../../src/components/layout/Navbar';
import Footer from '../../../src/components/layout/Footer';

// ✅ Added Backend URL constant
const BACKEND_URL = "https://auction-backend-gt06.onrender.com";

export default function AuctionDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');
  const [socket, setSocket] = useState<Socket | null>(null);

  // 1. Extract User ID from Token
  const currentUserId = useMemo(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          return decoded.id || decoded._id || decoded.sub;
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  }, []);

  // 2. Initialize Socket with Live Backend URL
  useEffect(() => {
    const newSocket = io(BACKEND_URL, {
      transports: ['websocket'],
      query: { userId: currentUserId }, 
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [currentUserId]);

  const isWinner = useMemo(() => {
    if (!auction || auction.status !== 'closed' || !currentUserId) return false;
    const dbWinnerId = auction.winnerId?._id || auction.winnerId;
    return String(dbWinnerId) === String(currentUserId);
  }, [auction, currentUserId]);

  const fetchAllData = async () => {
    try {
      // ✅ Updated to Live URL
      const auctionRes = await axios.get(`${BACKEND_URL}/auctions/${id}`);
      const data = auctionRes.data;
      setAuction(data);
      setActiveImage(data.images?.[0] || '');
      const currentPrice = data.highestBid || data.basePrice;
      setBidAmount(currentPrice + (data.minIncrement || 100));
      
      // ✅ Updated to Live URL
      const bidsRes = await axios.get(`${BACKEND_URL}/bids/auction/${id}`);
      setBids(bidsRes.data.history || []);
    } catch (error) {
      console.error("Error loading data", error);
    }
  };

  // 3. Socket Event Listeners
  useEffect(() => {
    if (!id || !socket) return;

    fetchAllData();

    socket.on(`auction-${id}`, () => fetchAllData());
    socket.on('auction-closed', () => fetchAllData());
    
    socket.on('won-auction', (data: any) => {
      if (String(data.auctionId) === String(id)) {
        toast.success("Congratulations! You won this auction!", { icon: '🎉', duration: 5000 });
        
        setAuction((prev: any) => ({
          ...prev,
          status: 'closed',
          winnerId: currentUserId
        }));

        fetchAllData(); 
      }
    });

    return () => {
      socket.off(`auction-${id}`);
      socket.off('auction-closed');
      socket.off('won-auction');
    };
  }, [id, socket, currentUserId]);

  useEffect(() => {
    if (isWinner) {
      const timer = setTimeout(() => {
        router.push(`/auction/pay/${id}`);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isWinner, id, router]);

  const handleBidSubmit = async () => {
    const token = localStorage.getItem('token');
    const currentPrice = auction.highestBid || auction.basePrice;
    if (!token) return toast.error("Please log in.");
    if (bidAmount <= currentPrice) return toast.error("Bid too low");
    
    setIsSubmitting(true);
    try {
      // ✅ Updated to Live URL
      await axios.post(`${BACKEND_URL}/bids/place`,
        { auctionId: id, amount: Number(bidAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Bid placed!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error placing bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!auction) return (
    <div className="min-h-screen flex items-center justify-center bg-[#dce8f8]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#1e2b58] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#1e2b58] font-bold uppercase tracking-widest text-sm">Loading Auction...</p>
      </div>
    </div>
  );

  const currentPrice = auction.highestBid || auction.basePrice;
  const topBidder = bids[0]?.bidderId;

  const paymentSteps = [
    { date: 'Step 1', label: 'Auction Won', status: 'done' },
    { date: 'Step 2', label: 'Payment Pending', status: 'active' },
    { date: 'Step 3', label: 'Payment Received', status: 'pending' },
    { date: 'Step 4', label: 'Processing', status: 'pending' },
    { date: 'Step 5', label: 'Shipped', status: 'pending' },
    { date: 'Step 6', label: 'Delivered', status: 'pending' },
  ];

  return (
    <>
      <Navbar />

      <section className="bg-[#dce8f8] py-8 md:py-10 text-center px-4">
        <h1 className="text-2xl md:text-4xl font-extrabold text-[#1e2b58] mb-2 tracking-tight">
          {auction.year} {auction.make} {auction.model}
        </h1>
        <p className="text-gray-500 text-xs md:text-sm max-w-xl mx-auto mb-3">
          {auction.tagline || `Explore the details and place your bid on this ${auction.make} ${auction.model}.`}
        </p>
        <div className="flex justify-center items-center gap-2 text-[10px] md:text-xs text-gray-400">
          <span>Home</span>
          <span>›</span>
          <span className="text-[#1a2e5a] font-semibold uppercase">Auction Detail</span>
        </div>
      </section>

      <main className="bg-white min-h-screen pb-20">
        <div className="max-w-5xl mx-auto px-4 py-8">

          {/* Image Gallery Card */}
          <div className="border border-gray-200 rounded overflow-hidden mb-6 shadow-sm">
            <div className="bg-[#1e2b58] px-5 py-3 flex items-center justify-between">
              <span className="text-white font-bold text-xs md:text-sm uppercase tracking-wide">
                {auction.make} {auction.model}
              </span>
              <FiStar className="text-white w-5 h-5 cursor-pointer hover:text-[#f5c518] transition-colors" />
            </div>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-0 md:h-[340px]">
              <div className="relative bg-gray-100 h-[250px] md:h-full">
                {auction.status === 'active' && (
                  <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Live
                  </span>
                )}
                <img src={activeImage} className="w-full h-full object-cover" alt="Main" />
              </div>
              <div className="grid grid-cols-3 md:grid-cols-2 grid-rows-2 md:grid-rows-3 gap-0.5 bg-gray-200 h-[150px] md:h-full">
                {auction.images?.slice(0, 6).map((img: string, i: number) => (
                  <img
                    key={i}
                    src={img}
                    className={`w-full h-full object-cover cursor-pointer transition-opacity hover:opacity-80 ${activeImage === img ? 'ring-2 ring-inset ring-[#f5c518]' : ''}`}
                    onClick={() => setActiveImage(img)}
                    alt={`Thumbnail ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Stats + Bid Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <div className="lg:col-span-2 border border-gray-200 rounded bg-[#f7f9ff] px-4 md:px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:divide-x divide-gray-200">
                <StatCell label="Start Price" value={`$${(auction.basePrice || 0).toLocaleString()}`} />
                <StatCell label="End Date" value={auction.endTime ? new Date(auction.endTime).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'} />
                <StatCell label="Lot No." value={auction.lotNumber|| 'N/A'} />
                <StatCell label="Total Bids" value={String(bids.length)} />
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 md:grid-cols-3 gap-4 text-center md:divide-x divide-gray-200">
                <StatCell label="Views" value={auction.views || '0'} />
                <StatCell label="KM" value={auction.odometer ? `${Number(auction.odometer).toLocaleString()} KM` : 'N/A'} />
                <div className="col-span-2 md:col-span-1 border-t md:border-t-0 pt-3 md:pt-0">
                   <StatCell
                    label={auction.status === 'closed' ? 'Final Price' : 'Current Bid'}
                    value={`$${currentPrice.toLocaleString()}`}
                    isGreen={auction.status === 'closed'}
                  />
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded p-5 bg-white shadow-sm flex flex-col justify-center">
              {auction.status === 'active' ? (
                <div className="space-y-3">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider text-center">Place Your Bid</p>
                  <div className="flex items-center justify-between border border-gray-200 rounded p-1">
                    <button onClick={() => setBidAmount(prev => Math.max(currentPrice + 100, prev - 100))} className="p-2 text-gray-400 hover:text-[#1e2b58]"><AiOutlineMinus size={14} /></button>
                    <span className="text-sm font-black text-[#1e2b58]">${bidAmount.toLocaleString()}</span>
                    <button onClick={() => setBidAmount(prev => prev + 100)} className="p-2 text-gray-400 hover:text-[#1e2b58]"><AiOutlinePlus size={14} /></button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <span>${(currentPrice).toLocaleString()}</span>
                    <input type="range" min={currentPrice} max={currentPrice * 3} value={bidAmount} onChange={e => setBidAmount(Number(e.target.value))} className="flex-1 accent-[#1e2b58] h-1" />
                    <span>${(currentPrice * 3).toLocaleString()}</span>
                  </div>
                  <button onClick={handleBidSubmit} disabled={isSubmitting} className="w-full bg-[#1e2b58] text-white py-3 text-xs font-bold uppercase rounded hover:bg-[#243d7a] transition-all tracking-widest disabled:opacity-50">
                    {isSubmitting ? "Processing..." : "Submit A Bid"}
                  </button>
                </div>
              ) : isWinner ? (
                <div className="space-y-3 text-center">
                  <FaTrophy className="text-[#f5c518] text-2xl mx-auto" />
                  <p className="text-[#1e2b58] font-black text-sm uppercase">Congratulations!</p>
                  <button onClick={() => router.push(`/auction/pay/${id}`)} className="w-full bg-[#f5c518] text-[#1e2b58] py-3 text-xs font-black uppercase rounded animate-pulse tracking-widest border border-[#e0b000]">
                    Make Payment
                  </button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-red-500 font-black uppercase tracking-widest text-xs">Bidding Ended</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-xs md:text-sm font-bold text-[#1e2b58] mb-3 border-b-2 border-[#f5c518] inline-block pb-1 uppercase tracking-wider">Description</h3>
                <p className="text-gray-500 text-sm leading-relaxed mt-3 bg-gray-50 p-4 rounded border-l-4 border-[#dce8f8]">{auction.description}</p>
              </div>

              {auction.status === 'closed' && (
                <div className="border border-gray-200 rounded overflow-hidden">
                  <div className="bg-[#1e2b58] px-5 py-3 font-bold text-white text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2">
                    <FaTrophy className="text-[#f5c518]" /> {isWinner ? 'Winner' : 'Top Bidder'}
                  </div>
                  <div className="p-5 flex flex-col md:flex-row items-center gap-6 bg-[#f7f9ff]">
                    <img src={topBidder?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(topBidder?.name || 'User')}&background=1e2b58&color=fff`} className="w-16 h-16 rounded-full border-4 border-white shadow-md flex-shrink-0" alt="Winner" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 flex-1 w-full">
                      <InfoPair label="Full Name" value={topBidder?.name || "N/A"} />
                      <InfoPair label="Email" value={topBidder?.email || "N/A"} />
                      <InfoPair label="Mobile" value={topBidder?.phone || "N/A"} />
                      <InfoPair label="Nationality" value={topBidder?.nationality || "N/A"} />
                      <InfoPair label="ID Type" value={topBidder?.idType || "N/A"} />
                    </div>
                  </div>
                </div>
              )}

              {isWinner && auction.status === 'closed' && (
                <div className="border border-gray-200 rounded overflow-hidden">
                  <div className="bg-[#1e2b58] px-5 py-3 font-bold text-white text-[10px] md:text-xs uppercase tracking-widest">Steps of Payment</div>
                  <div className="p-5 bg-white overflow-x-auto">
                    <div className="relative min-w-[500px] md:min-w-0">
                      <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 z-0" />
                      <div className="grid grid-cols-6 gap-2 relative z-10">
                        {paymentSteps.map((step, i) => (
                          <div key={i} className="flex flex-col items-center text-center gap-2">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-black z-10
                              ${step.status === 'done' ? 'bg-green-500 border-green-500 text-white' : 
                                step.status === 'active' ? 'bg-[#f5c518] border-[#f5c518] text-[#1e2b58]' : 
                                'bg-white border-gray-300 text-gray-300'}`}>
                              {step.status === 'done' ? '✓' : i + 1}
                            </div>
                            <div className="hidden md:block">
                              <p className="text-[9px] text-gray-400 font-bold">{step.date}</p>
                              <p className={`text-[10px] font-bold mt-0.5 ${step.status === 'done' ? 'text-green-600' : step.status === 'active' ? 'text-[#1e2b58]' : 'text-gray-300'}`}>{step.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded overflow-hidden h-fit shadow-sm bg-white">
              <div className="bg-[#1e2b58] px-5 py-3 text-white font-bold text-[10px] md:text-xs uppercase tracking-widest">Bidders List</div>
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {bids.length === 0 ? (
                  <div className="px-5 py-8 text-center text-gray-400 text-[10px] font-bold uppercase tracking-wide">No bids yet</div>
                ) : (
                  bids.map((bid, i) => (
                    <div key={i} className="flex justify-between items-center px-5 py-3 hover:bg-[#f7f9ff] transition-colors">
                      <div className="flex items-center gap-2">
                        {i === 0 && <FaTrophy className="text-[#f5c518] text-xs" />}
                        <span className="text-[10px] md:text-[11px] text-[#1e2b58] font-bold">{bid.bidderId?.name || `Bidder ${i + 1}`}</span>
                      </div>
                      <span className="text-xs md:text-sm font-black text-[#1e2b58]">${bid.amount.toLocaleString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function StatCell({ label, value, isGreen }: { label: string; value: string; isGreen?: boolean }) {
  return (
    <div className="px-1">
      <p className={`text-xs md:text-sm font-black ${isGreen ? 'text-green-600' : 'text-[#1e2b58]'}`}>{value}</p>
      <p className="text-[9px] md:text-[10px] text-gray-400 uppercase font-bold mt-0.5 tracking-tight">{label}</p>
    </div>
  );
}

function InfoPair({ label, value }: { label: string; value: string }) {
  return (
    <div className="mb-2 md:mb-0">
      <p className="text-[9px] text-blue-500 uppercase font-black mb-0.5 tracking-wide">{label}</p>
      <p className="text-xs md:text-sm font-bold text-[#1e2b58] break-all">{value}</p>
    </div>
  );
}