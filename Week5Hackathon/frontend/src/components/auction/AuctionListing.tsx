"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../../components/auction/SideBar';
import AuctionListCard from '../../components/auction/AuctionListCard';

const AuctionListing: React.FC = () => {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // --- Pagination & Sort States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortOption, setSortOption] = useState('newest');

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      let sortBy = 'createdAt';
      let order = 'desc';

      if (sortOption === 'low-to-high') { sortBy = 'basePrice'; order = 'asc'; }
      if (sortOption === 'high-to-low') { sortBy = 'basePrice'; order = 'desc'; }

      // Pointing to the deployed Render backend
      const { data } = await axios.get(`https://auction-backend-gt06.onrender.com/auctions`, {
        params: {
          page: currentPage,
          limit: 10,
          sortBy,
          order
        }
      });

      // Handling both simple array responses and paginated object responses
      const fetchedDocs = data.docs || data;
      const fetchedTotal = data.totalPages || 1;

      setAuctions(Array.isArray(fetchedDocs) ? fetchedDocs : []); 
      setTotalPages(fetchedTotal);
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, [currentPage, sortOption]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen font-sans text-[#1e2b58]">
      {/* Header Banner */}
      <div className="bg-[#dce8f8] py-12 md:py-16 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#1e2b58] mb-4 tracking-tight">Auction</h1>
        <div className="flex justify-center mb-4">
          <span className="block w-16 h-1 bg-[#1a2e5a] rounded-full"></span>
        </div>
        <p className="text-gray-500 max-w-xl mx-auto text-xs md:text-sm">
          Browse our exclusive listings and find the perfect match for your needs.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 flex flex-col lg:flex-row gap-8">
        
        {/* Main Content */}
        <div className="flex-1 w-full">
          
          {/* Top Bar */}
          <div className="bg-[#1e2b58] text-white px-4 md:px-5 py-3 rounded-sm flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
            <span className="font-semibold text-xs md:text-sm">
              {loading ? "Loading..." : `Showing Page ${currentPage} of ${totalPages}`}
            </span>
            <select 
              value={sortOption}
              onChange={(e) => { setSortOption(e.target.value); setCurrentPage(1); }}
              className="w-full sm:w-auto bg-white text-[#1e2b58] text-[10px] md:text-xs font-semibold px-4 py-2 rounded-sm outline-none cursor-pointer"
            >
              <option value="newest">Sort By Newness</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>

          {/* Auction Cards & Pagination Section */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="text-center py-20 text-gray-400 font-bold">Fetching auctions...</div>
            ) : auctions.length > 0 ? (
              <>
                <div className="flex flex-col gap-4">
                  {auctions.map((auction) => (
                    <AuctionListCard key={auction._id} auction={auction} />
                  ))}
                </div>

                {/* --- Pagination UI --- */}
                <div className="flex justify-center items-center gap-2 mt-12 mb-6">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-4 py-2 border text-xs font-bold rounded-sm disabled:opacity-30 hover:bg-gray-50 transition-all border-gray-200"
                  >
                    PREV
                  </button>
                  
                  <div className="flex gap-2">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-10 h-10 border text-xs font-bold rounded-sm transition-all ${
                            currentPage === pageNum 
                            ? "bg-[#1a2e5a] text-white border-[#1a2e5a] shadow-md" 
                            : "bg-white text-[#1a2e5a] border-gray-200 hover:border-[#1a2e5a]"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-4 py-2 border text-xs font-bold rounded-sm disabled:opacity-30 hover:bg-gray-50 transition-all border-gray-200"
                  >
                    NEXT
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 border border-dashed border-gray-300 bg-gray-50 rounded-sm">
                <p className="text-gray-500 font-bold">No auctions found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-[280px] shrink-0 order-first lg:order-last">
          <SideBar />
        </aside>

      </div>
    </div>
  );
};

export default AuctionListing;