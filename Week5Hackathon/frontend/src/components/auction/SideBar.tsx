"use client";

import React, { useState } from 'react';

// Sync these lists exactly with your SellYourCar component
const MAKES = ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi", "Hyundai", "Kia", "Nissan", "Chevrolet"];

const MODELS: Record<string, string[]> = {
  Toyota: ["Camry", "Corolla", "RAV4", "Land Cruiser", "Prado"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "HR-V"],
  Ford: ["F-150", "Mustang", "Explorer", "Escape", "Edge"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "7 Series"],
  Mercedes: ["C-Class", "E-Class", "GLE", "S-Class", "GLC"],
  Audi: ["A3", "A4", "Q5", "Q7", "A6"],
  Hyundai: ["Elantra", "Tucson", "Santa Fe", "Sonata", "Creta"],
  Kia: ["Sportage", "Sorento", "Seltos", "Picanto", "Carnival"],
  Nissan: ["Altima", "Sentra", "Rogue", "Pathfinder", "X-Trail"],
  Chevrolet: ["Malibu", "Equinox", "Traverse", "Silverado", "Tahoe"],
};

const PAINTS = ["White", "Black", "Silver", "Grey", "Red", "Blue", "Green", "Brown", "Gold", "Orange"];

interface SidebarProps {
  onFilter?: (filters: any) => void;
}

const SideBar: React.FC<SidebarProps> = ({ onFilter }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [paint, setPaint] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500000); // Increased range for car prices

  const handleApplyFilter = () => {
    if (onFilter) {
      const activeFilters: any = {};
      if (make) activeFilters.make = make;
      if (model) activeFilters.model = model;
      if (paint) activeFilters.paint = paint;
      
      activeFilters.minPrice = minPrice;
      activeFilters.maxPrice = maxPrice;
      
      onFilter(activeFilters);
    }
  };

  const selectClass = "w-full bg-[#2d3a8c] border border-white/20 rounded-sm px-4 py-3 text-sm text-white outline-none focus:border-white/50 transition-all cursor-pointer mb-3";

  return (
    <div className="w-full bg-[#2d3a8c] text-white rounded-sm shadow-xl overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <span className="block w-1 h-5 bg-[#ffcc41] rounded-full"></span>
        <h3 className="text-sm font-bold uppercase tracking-widest text-white">
          Filter Search
        </h3>
      </div>

      <div className="p-5 space-y-1">
        {/* Make Selection */}
        <div className="relative">
          <label className="text-[10px] uppercase text-white/50 mb-1 block">Brand</label>
          <select
            value={make}
            onChange={(e) => { setMake(e.target.value); setModel(""); }}
            className={selectClass}
          >
            <option value="">Any Make</option>
            {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Model Selection (Dynamic based on Make) */}
        <div className="relative">
          <label className="text-[10px] uppercase text-white/50 mb-1 block">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className={selectClass}
            disabled={!make}
          >
            <option value="">{make ? "All Models" : "Select Make First"}</option>
            {(MODELS[make] || []).map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {/* Paint/Color Selection */}
        <div className="relative">
          <label className="text-[10px] uppercase text-white/50 mb-1 block">Exterior Color</label>
          <select
            value={paint}
            onChange={(e) => setPaint(e.target.value)}
            className={selectClass}
          >
            <option value="">Any Color</option>
            {PAINTS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Price Slider Section */}
        <div className="pt-4 pb-2">
          <label className="text-xs font-bold uppercase mb-4 block text-white/70">Price Range</label>
          
          <div className="relative w-full h-8 flex items-center">
            <div className="absolute h-1.5 bg-white/20 rounded-full w-full"></div>
            <div 
               className="absolute h-1.5 bg-[#ffcc41] rounded-full"
               style={{ 
                 left: `${(minPrice / 500000) * 100}%`, 
                 right: `${100 - (maxPrice / 500000) * 100}%` 
               }}
            ></div>

            <input
              type="range"
              min="0"
              max="500000"
              step="5000"
              value={minPrice}
              onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 5000))}
              className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 cursor-pointer accent-[#ffcc41]"
            />
            <input
              type="range"
              min="0"
              max="500000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 5000))}
              className="absolute w-full appearance-none bg-transparent pointer-events-none z-20 cursor-pointer accent-[#ffcc41]"
            />
          </div>

          <div className="flex justify-between mt-4 mb-6">
             <span className="text-xs bg-[#1e2b58] px-2 py-1 rounded">${minPrice.toLocaleString()}</span>
             <span className="text-xs bg-[#1e2b58] px-2 py-1 rounded">${maxPrice.toLocaleString()}</span>
          </div>

          <button
            onClick={handleApplyFilter}
            className="w-full bg-[#ffcc41] text-[#1e2b58] font-black py-3.5 rounded-sm uppercase tracking-widest text-sm hover:bg-[#f5c236] transition-all active:scale-95 shadow-lg"
          >
            Apply Filters
          </button>
        </div>
      </div>
      
      <style jsx>{`
        input[type='range'] {
            -webkit-appearance: none;
            width: 100%;
        }
        input[type='range']::-webkit-slider-thumb {
          pointer-events: auto;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid #ffcc41;
        }
        input[type='range']::-moz-range-thumb {
          pointer-events: auto;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          border: 2px solid #ffcc41;
        }
      `}</style>
    </div>
  );
};

export default SideBar;