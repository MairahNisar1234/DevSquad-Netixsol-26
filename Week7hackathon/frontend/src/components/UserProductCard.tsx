"use client";
import React from 'react';

interface UserProductCardProps {
  name: string;
  price: number;
  available: number;
  imageUrl: string;
  onAddToCart: () => void;
}

export default function UserProductCard({ name, price, available, imageUrl, onAddToCart }: UserProductCardProps) {
  return (
    <div 
      onClick={onAddToCart}
      className="bg-[#1F1D2B] rounded-[24px] p-4 sm:p-6 pt-16 sm:pt-24 text-center relative group cursor-pointer hover:ring-1 hover:ring-[#EA7C69]/50 transition-all duration-300 active:scale-95"
    >
      {/* Floating Image - Scaled for mobile and desktop */}
      <div className="absolute -top-10 sm:-top-12 left-1/2 -translate-x-1/2 w-full flex justify-center">
        <img 
          src={imageUrl || 'https://via.placeholder.com/150'} 
          alt={name} 
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover shadow-[0_15px_40px_rgba(0,0,0,0.5)] sm:shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300 border-4 border-[#1F1D2B]"
        />
      </div>

      {/* Product Title */}
      <h3 className="text-white text-xs sm:text-sm font-medium leading-tight sm:leading-relaxed px-1 sm:px-2 line-clamp-2 min-h-[32px] sm:min-h-[40px] capitalize">
        {name}
      </h3>
      
      {/* Pricing */}
      <p className="mt-1 sm:mt-2 text-white text-xs sm:text-sm font-normal">
        $ {Number(price).toFixed(2)}
      </p>
      
      {/* Availability Status */}
      <p className="mt-1 text-gray-500 text-[10px] sm:text-sm">
        {available > 0 ? (
          <span>{available} <span className="hidden xs:inline">Bowls</span> available</span>
        ) : (
          <span className="text-red-500 font-medium">Out of Stock</span>
        )}
      </p>
    </div>
  );
}