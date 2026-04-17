"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../src/components/auction/SideBar';
import AuctionListCard from '../../src/components/auction/AuctionListCard';
import ProtectedRoute from "../../src/components/ProtectedRoute";
import { io } from 'socket.io-client';
import Navbar from "../../src/components/layout/Navbar";
import Footer from "../../src/components/layout/Footer";

// ─── Backend Configuration ───────────────────────────────────────────────────
const BACKEND_URL = "https://auction-backend-gt06.onrender.com";
const socket = io(BACKEND_URL); // Updated to use the live Render URL

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});
  
  // --- Pagination & Sort States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');

  const getAuctions = async (currentFilters = {}, page = 1, sort = 'createdAt', dir = 'desc') => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...currentFilters,
        page: page.toString(),
        limit: '2', // Adjust limit as needed
        sortBy: sort,
        order: dir
      }).toString();

      // Updated to use the live BACKEND_URL
      const url = `${BACKEND_URL}/auctions?${queryParams}`;
      const { data } = await axios.get(url);
      
      setAuctions(data.docs || data); 
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to load auctions", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAuctions(filters, currentPage, sortBy, order);

    socket.on('new-auction-added', (newAuction) => {
      setAuctions((prev) => [newAuction, ...prev]);
    });

    socket.on('auction-updated', (updatedAuction) => {
      setAuctions((prev) => prev.map((auc) => (auc._id === updatedAuction._id ? updatedAuction : auc)));
    });

    return () => {
      socket.off('new-auction-added');
      socket.off('auction-updated');
    };
  }, [currentPage, sortBy, order]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setCurrentPage(1);
    getAuctions(newFilters, 1, sortBy, order);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "newest") { setSortBy("createdAt"); setOrder("desc"); }
    else if (value === "low-high") { setSortBy("basePrice"); setOrder("asc"); }
    else if (value === "high-low") { setSortBy("basePrice"); setOrder("desc"); }
    setCurrentPage(1);
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero Banner */}
        <section>
            <div className="bg-[#dce8f8] py-14 text-center">
                <h1 className="text-5xl font-extrabold text-[#1e2b58] mb-3 tracking-tight">Auction</h1>
                <div className="flex justify-center mb-4"><span className="block w-16 h-1 bg-[#1a2e5a] rounded-full"></span></div>
                <p className="text-gray-500 text-sm">Find your dream car at the best price.</p>
            </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 w-full">
            {/* Top Bar */}
            <div className="bg-[#1e2b58] text-white px-5 py-3 rounded-sm flex justify-between items-center mb-6">
              <p className="font-semibold text-xs md:text-sm">
                {loading ? "Loading..." : `Showing Page ${currentPage} of ${totalPages}`}
              </p>
            </div>

            {/* Auction List */}
            <div className="flex flex-col gap-4">
              {loading ? (
                <div className="text-center py-20 text-gray-400">Loading fleet...</div>
              ) : auctions.length > 0 ? (
                auctions.map((item: any) => <AuctionListCard key={item._id} auction={item} />)
              ) : (
                <div className="text-center py-20 border border-dashed border-gray-300">No cars found.</div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1  && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  className="px-4 py-2 border text-[#1a2e5a] disabled:opacity-30"
                >
                  Prev
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 border transition-colors ${currentPage === i + 1 ? 'bg-[#1a2e5a] text-white' : 'hover:bg-gray-100'}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                   disabled={currentPage === totalPages}
                   onClick={() => setCurrentPage(prev => prev + 1)}
                   className="px-4 py-2 border text-[#1a2e5a] disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <aside className="w-full lg:w-[280px] shrink-0">
            <Sidebar onFilter={handleFilterChange} />
          </aside>
        </div>
      </main>
      <Footer />
    </ProtectedRoute>
  );
}