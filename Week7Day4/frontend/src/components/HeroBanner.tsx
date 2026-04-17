"use client";
import React from 'react';

const HeroBanner = () => {
  return (
    <section className="w-full bg-black">
      {/* 1. THE IMAGE GRID (Top on mobile, Background on desktop) */}
      <div className="relative w-full overflow-hidden">
        {/* Responsive Image Container */}
        <div className="relative md:absolute md:inset-0 w-full h-auto md:h-full">
          <img 
            src="/pic1.png" 
            alt="Nike 50 Years"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 2. TEXT CONTENT BOX */}
<div className="relative z-10 w-full md:aspect-[10/3] flex flex-col justify-center px-6 py-8 md:px-20 md:py-0">
  <div className="max-w-xl">
    {/* Reduced from 11vw to 9vw for a more refined look on mobile */}
    <h1 className="italic font-black text-[20vw] sm:text-6xl md:text-7xl lg:text-7xl uppercase leading-[0.85] tracking-tighter text-white mb-4 md:mb-6 drop-shadow-2xl">
      We Are <br /> Never Done
    </h1>
    
    <p className="text-white text-sm md:text-lg font-medium mb-6 md:mb-10 leading-snug opacity-90">
      Celebrating 50 years of Nike from May 16th! <br className="hidden md:block" />
      Exclusive products, experiences and much more <br className="hidden md:block" />
      await you for five days. Join the Nike app!
    </p>

    <a href="#product-list">
      <button 
        className="bg-white text-black font-bold py-3.5 px-10 mb-2 rounded-xl w-full md:w-fit hover:bg-zinc-200 active:scale-95 transition-all duration-300 shadow-xl text-base uppercase tracking-tight"
      >
        Celebrate with us
      </button>
    </a>
  </div>
</div>
      </div>

      {/* 3. THE TICKER */}
      <div className="bg-white py-2 md:py-3 border-y border-black overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap items-center">
          <img src="/tick.png" alt="Nike Ticker" className="h-6 md:h-10 w-auto px-4" />
          <img src="/tick.png" alt="Nike Ticker" className="h-6 md:h-10 w-auto px-4" />
          <img src="/tick.png" alt="Nike Ticker" className="h-6 md:h-10 w-auto px-4" />
          <img src="/tick.png" alt="Nike Ticker" className="h-6 md:h-10 w-auto px-4" />
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;