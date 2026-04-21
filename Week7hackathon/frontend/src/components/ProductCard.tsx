"use client";
import React from 'react';
import { Trash2, Edit3, CircleDollarSign, Package } from 'lucide-react';

interface ProductCardProps {
  _id: string; 
  name: string;
  price: number;
  available: number;
  imageUrl: string;
  onDelete?: (id: string) => void;
  onEdit?: (product: any) => void;
  productData: any; 
}

export default function ProductCard({ 
  _id, 
  name, 
  price, 
  available, 
  imageUrl, 
  onDelete, 
  onEdit,
  productData 
}: ProductCardProps) {
  
  const isOutOfStock = available <= 0;

  return (
    <div className="bg-[#1F1D2B] p-4 sm:p-6 rounded-3xl flex flex-col items-center text-center border border-gray-800 relative mt-12 group transition-all hover:border-[#EA7C69]/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      
      {/* Floating Action Buttons - Visible by default on touch devices, hover on desktop */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 flex gap-2">
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(_id);
          }}
          className="p-2 bg-red-500/10 text-red-500 rounded-xl md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-10 shadow-lg"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Product Image with Ring Decor - Scaled for mobile */}
      <div className="relative -mt-12 sm:-mt-16 mb-4">
        <div className="absolute inset-0 bg-[#EA7C69] blur-2xl opacity-0 md:group-hover:opacity-20 transition-opacity rounded-full"></div>
        <img 
          src={imageUrl || 'https://via.placeholder.com/150?text=No+Image'} 
          alt={name} 
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-2xl border-4 border-[#1F1D2B] relative z-1"
        />
      </div>

      {/* Title & Category Info */}
      <h3 className="text-sm sm:text-base font-bold text-white px-2 capitalize leading-tight min-h-[36px] sm:min-h-[40px] flex items-center justify-center">
        {name}
      </h3>
      
      {/* Pricing & Stock Grid */}
      <div className="mt-4 w-full grid grid-cols-2 gap-1 sm:gap-2 border-t border-gray-800 pt-4">
        <div className="flex flex-col items-center border-r border-gray-800">
          <span className="text-[8px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-1">
            <CircleDollarSign size={10} /> Price
          </span>
          <span className="text-xs sm:text-sm font-semibold text-white">
            ${Number(price || 0).toFixed(2)}
          </span>
        </div>
        
        <div className="flex flex-col items-center">
          <span className="text-[8px] sm:text-[10px] text-gray-500 uppercase font-bold tracking-widest flex items-center gap-1">
            <Package size={10} /> Stock
          </span>
          <span className={`text-xs sm:text-sm font-semibold ${isOutOfStock ? "text-red-500" : "text-[#EA7C69]"}`}>
            {available} <span className="text-[8px] sm:text-[10px] opacity-70">pcs</span>
          </span>
        </div>
      </div>

      {/* Edit Action */}
      <button 
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(productData);
        }}
        className="mt-5 sm:mt-6 w-full py-2.5 sm:py-3 bg-[#EA7C69]/10 text-[#EA7C69] rounded-2xl flex items-center justify-center gap-2 hover:bg-[#EA7C69] hover:text-white transition-all border border-[#EA7C69]/20 font-bold text-[10px] sm:text-xs active:scale-95"
      >
        <Edit3 size={14} />
        Edit Dish Info
      </button>

      {/* Out of Stock Overlay Ribbon */}
      {isOutOfStock && (
        <div className="absolute top-2 left-2 bg-red-500 text-white text-[7px] sm:text-[8px] font-black px-1.5 sm:px-2 py-1 rounded-lg uppercase tracking-tighter shadow-md">
          Sold Out
        </div>
      )}
    </div>
  );
}