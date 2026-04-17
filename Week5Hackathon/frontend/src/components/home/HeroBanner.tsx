"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroBanner() {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (category) params.set("category", category);
    if (color) params.set("color", color);
    router.push(`/auction?${params.toString()}`);
  };

  return (
    <section
      className="relative w-full min-h-[420px] flex items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(10,20,50,0.65), rgba(10,20,50,0.65)), url('https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=80')",
      }}
    >
      <div className="container mx-auto px-8 flex flex-col items-start gap-4 py-16">
        <span className="bg-[#1a2e5a] text-white text-xs font-semibold px-4 py-1.5 rounded-sm tracking-wide uppercase">
          Welcome To Auction
        </span>

        <h1 className="text-white text-5xl font-extrabold leading-tight max-w-md">
          Find Your<br />Dream Car
        </h1>

        <p className="text-gray-300 text-sm max-w-sm leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Turbus elementum cursus tincidunt sagittis elementum suspendisse velit amet.
        </p>

        <div className="mt-4 bg-white rounded-sm p-3 flex flex-wrap gap-2 items-center shadow-lg w-full max-w-2xl">
          
          {/* Make */}
          <select
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className="border border-gray-200 rounded px-3 py-2 text-sm text-gray-500 w-28 focus:outline-none focus:border-[#1a2e5a] bg-white"
          >
            <option value="">Any Make</option>
            <option value="Tesla">Tesla</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="Ford">Ford</option>
            <option value="Porsche">Porsche</option>
          </select>

          {/* Category / Car Type */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-200 rounded px-3 py-2 text-sm text-gray-500 w-28 focus:outline-none focus:border-[#1a2e5a] bg-white"
          >
            <option value="">Any Type</option>
            <option value="Sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Coupe">Coupe</option>
          </select>

          {/* Color */}
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="border border-gray-200 rounded px-3 py-2 text-sm text-gray-500 w-24 focus:outline-none focus:border-[#1a2e5a] bg-white"
          >
            <option value="">Any Color</option>
            <option value="White">White</option>
            <option value="Black">Black</option>
            <option value="Silver">Silver</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
          </select>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="bg-[#1a2e5a] text-white px-6 py-2 rounded text-sm font-medium flex items-center gap-2 hover:bg-[#243d7a] transition-colors ml-auto"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search
          </button>
        </div>
      </div>
    </section>
  );
}