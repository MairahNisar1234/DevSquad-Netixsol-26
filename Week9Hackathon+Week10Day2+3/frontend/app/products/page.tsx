"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard, { Product } from "@/src/components/ProductCard";
import { Search, Sparkles, X, ArrowLeft, Heart } from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearch, setActiveSearch] = useState(""); 
  const [isSearching, setIsSearching] = useState(false);

  const fetchProducts = async (query: string = "") => {
    setLoading(true);
    try {
      const url = query.trim() 
        ? "https://healthcareai-kappa.vercel.app/chat/search" 
        : "https://healthcareai-kappa.vercel.app/products";
      
      const options = query.trim()
        ? {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
          }
        : { method: "GET" };

      const response = await fetch(url, options);
      const data = await response.json();
      setProducts(data);
      setActiveSearch(query); // Set active search state
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      handleBackToAll();
      return;
    }
    setIsSearching(true);
    fetchProducts(searchQuery);
  };

  const handleBackToAll = () => {
    setSearchQuery("");
    setActiveSearch("");
    fetchProducts("");
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans">
      {/* Top Navigation / Logo */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="text-white" size={18} fill="currentColor" />
            </div>
            <span className="font-bold text-xl tracking-tighter dark:text-white">HealthAI</span>
          </Link>
          <div className="hidden md:block text-xs font-medium text-zinc-400 uppercase tracking-widest">
            Verified Healthcare Partner
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-6">
        <header className="mb-12 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-white">
                {activeSearch ? "Search Results" : "Healthcare Essentials"}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 max-w-lg">
                {activeSearch 
                  ? `Showing results for tailored to your symptoms.` 
                  : "Explore our expert-curated medical products and supplements."}
              </p>
            </div>

            {/* AI Search Bar */}
            <form onSubmit={handleSearch} className="relative w-full md:w-[400px]">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Describe your symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm group-hover:border-zinc-300 dark:group-hover:border-zinc-700"
                />
                <Search className="absolute left-4 top-4.5 text-zinc-400" size={20} />
                
                <div className="absolute right-3 top-3 flex items-center gap-2">
                  <button 
                    type="submit"
                    disabled={isSearching}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                  >
                    <Sparkles size={18} className={isSearching ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Contextual Back Button / Search Status */}
          {activeSearch && (
            <div className="flex items-center gap-4 animate-in slide-in-from-left-2 duration-300">
              <button 
                onClick={handleBackToAll}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
              >
                <ArrowLeft size={14} /> Back to Products
              </button>
              <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
              <span className="text-xs font-medium text-zinc-400">
                Results for: <span className="text-blue-600 dark:text-blue-400 italic">"{activeSearch}"</span>
              </span>
            </div>
          )}
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-3xl border border-zinc-200 dark:border-zinc-800" />
            ))}
          </div>
        ) : (
          <>
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 text-center space-y-4">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400">
                  <Search size={32} />
                </div>
                <div className="space-y-1">
                  <p className="text-xl font-bold text-zinc-900 dark:text-white">No products found</p>
                  <p className="text-zinc-500 dark:text-zinc-400 max-w-xs">
                    Try searching for symptoms like "fatigue" or "vitamin deficiency" instead.
                  </p>
                </div>
                <button 
                  onClick={handleBackToAll}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Clear search and view all
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}