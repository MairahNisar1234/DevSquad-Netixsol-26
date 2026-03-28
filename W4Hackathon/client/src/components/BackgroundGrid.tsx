import React from 'react';

import a1 from '../assets/a1.png';
import a2 from '../assets/a2.png';
import a3 from '../assets/a3.png';
import a4 from '../assets/a4.png';
import a5 from '../assets/a5.png';
import a6 from '../assets/a6.png';
import a7 from '../assets/a7.png';
import a8 from '../assets/a8.png';
import a9 from '../assets/a9.png';
import a10 from '../assets/a10.png';
import a11 from '../assets/a11.png';
import a12 from '../assets/a12.png';
import a13 from '../assets/a13.png';
import a14 from '../assets/a14.png';
import a15 from '../assets/a15.png';
import a16 from '../assets/a16.png';
import a17 from '../assets/a17.png';
import a19 from '../assets/a19.png';
import a20 from '../assets/a20.png';
import a21 from '../assets/a21.png';
import a22 from '../assets/a22.png';
import a23 from '../assets/a23.png';
import a24 from '../assets/24.png'; 
import a25 from '../assets/a25.png';
import a26 from '../assets/a26.png';
import a27 from '../assets/a27.png';

const BackgroundGrid: React.FC = () => {
  
  const posters = [
    a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, 
    a11, a12, a13, a14, a15, a16, a17, a19, a20, 
    a21, a22, a23, a24, a25, a26, a27
  ]; 

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#141414]">
      
      {/* 1. GRID: Increased opacity to 50% for better color visibility */}
      <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-9 gap-4 p-4 opacity-50">
        {posters.map((imgSrc, i) => (
          <div 
            key={i} 
            className="aspect-2/3 w-full rounded-2xl bg-[#1A1A1A] border border-[#262626] overflow-hidden shadow-2xl"
          >
            <img 
              src={imgSrc} 
              // REMOVED 'grayscale' and 'brightness-75' so they are colored!
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
              alt={`poster-${i}`} 
            />
          </div>
        ))}
      </div>
      
      {/* 2. THE GRADIENT OVERLAY */}
      {/* THE FIGMA GRADIENT OVERLAY (Flipped & Darkened) */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none" 
        style={{ 
          background: `
            linear-gradient(180deg, 
              rgba(20, 20, 20, 0.9) 0%, 
              rgba(20, 20, 20, 0.6) 8%, 
              rgba(20, 20, 20, 0.8) 80%, 
              #141414 100%)
          ` 
        }}
      ></div>
    </div>
  );
};

export default BackgroundGrid;