"use client";
import React from 'react';
import { ShoppingCart } from 'lucide-react';

// ✅ Interface remains unchanged
interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  return (
    <nav className="sticky top-0 bg-[#1F1D2B] border-b border-gray-800 z-[100]">
      <div className="flex justify-between items-center py-4 px-4 md:px-8 max-w-[1400px] mx-auto">
        
        {/* Left: Logo Only */}
        <div className="flex items-center">
          <h1 className="text-xl md:text-2xl font-bold text-white whitespace-nowrap">
            Jaegar Resto
          </h1>
        </div>

        {/* Right: Cart Action Only */}
        <div className="flex items-center">
          <button 
            onClick={onCartClick}
            className="relative p-2.5 md:p-3 bg-[#2D303E] rounded-xl text-[#EA7C69] hover:bg-[#393C49] transition-all active:scale-95"
            aria-label="Open Cart"
          >
            <ShoppingCart size={22} className="md:w-6 md:h-6" />
            
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#EA7C69] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1F1D2B]">
                {cartCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </nav>
  );
}