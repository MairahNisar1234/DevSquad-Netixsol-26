"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 bg-[#eef2ff]">
      <div className="max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-black text-[#1e2b58] mb-6 leading-tight">
          Find Your Dream Car <br /> 
          <span className="text-blue-600 font-medium italic">At The Best Price.</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          Welcome to Car Deposit—the most trusted bidding platform for luxury vehicles, 
          classics, and everyday commuters. Start bidding or sell your car today.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auction" 
            className="bg-[#1e2b58] text-white px-10 py-4 rounded-md font-bold text-lg hover:bg-blue-800 transition-all shadow-lg active:scale-95"
          >
            Browse Auctions
          </Link>
          <Link 
            href="/auth/register" 
            className="bg-[#ffcc41] text-[#1e2b58] px-10 py-4 rounded-md font-bold text-lg hover:bg-[#f5c236] transition-all shadow-lg active:scale-95"
          >
            Sell Your Car
          </Link>
        </div>
      </div>

      {/* Hero Image Section */}
      <div className="mt-16 w-full max-w-5xl">
        <div className="relative h-[300px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
           <img 
             src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920" 
             alt="Luxury Car" 
             className="object-cover w-full h-full"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-[#1e2b58]/60 to-transparent"></div>
        </div>
      </div>
    </main>
  );
}