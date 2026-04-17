"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link"; // Recommended for navigation

export default function LiveAuction() {
  const [auctions, setAuctions] = useState<any[]>([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        // Pointing to your deployed Render backend
        const { data } = await axios.get("https://auction-backend-gt06.onrender.com/auctions");
        
        // Handling both simple array responses and paginated object responses
        const fetchedDocs = data.docs || data;

        // --- FIX: Filter only active auctions ---
        const now = new Date();
        const activeAuctions = Array.isArray(fetchedDocs) 
          ? fetchedDocs.filter((auction: any) => {
              if (!auction.endTime) return false;
              const end = new Date(auction.endTime);
              return end > now; // Only keep auctions where end time is in the future
            })
          : [];

        // Show first 4 active auctions
        setAuctions(activeAuctions.slice(0, 4));
      } catch (error) {
        console.error("Error fetching auctions", error);
      }
    };
    fetchAuctions();
    
    // Optional: Refresh list every minute to catch newly ended auctions
    const interval = setInterval(fetchAuctions, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Live Auction</h2>
          <div className="flex justify-center items-center mt-2 gap-1">
            <span className="block w-8 h-0.5 bg-gray-300"></span>
            <span className="text-[#f5c518] text-lg leading-none">◆</span>
            <span className="block w-8 h-0.5 bg-gray-300"></span>
          </div>
        </div>

        <div className="border-b border-gray-200 mb-8">
          <button className="text-sm font-semibold text-[#1a2e5a] border-b-2 border-[#1a2e5a] pb-2 px-1 -mb-px">
            Live Auction
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {auctions.length > 0 ? (
            auctions.map((auction: any) => (
              <div key={auction._id} className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={auction?.images?.[0] || 'https://via.placeholder.com/400x300?text=Car+Image'}
                    alt={`${auction?.make} ${auction?.model}`}
                    className="w-full h-44 object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                    Live
                  </span>
                </div>

                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm mb-3">{auction?.make} {auction?.model}</h3>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Current Bid</p>
                      <p className="text-[#1a2e5a] font-bold text-sm">
                        ${(auction?.highestBid || auction?.maxBid)?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <Link href={'/auction'}>
                    <button className="w-full bg-[#1a2e5a] text-white text-sm py-2 rounded-sm font-medium hover:bg-[#243d7a] transition-colors">
                      Submit A Bid
                    </button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 py-10">No live auctions available right now.</p>
          )}
        </div>
      </div>
    </section>
  );
}