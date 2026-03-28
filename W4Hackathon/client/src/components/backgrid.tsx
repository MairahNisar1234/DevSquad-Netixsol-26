import React from 'react';

import r1 from '../assets/row1/r1.png';
import r2 from '../assets/row1/r2.png';
import r3 from '../assets/row1/r3.png';
import r4 from '../assets/row1/r4.png';
import r5 from '../assets/row1/r5.png';
import r6 from '../assets/row1/r6.png';
import r7 from '../assets/row1/r7.png';
import r8 from '../assets/row1/r8.png';
import r9 from '../assets/row1/r9.png';

import d1 from '../assets/row1/d1.png';
import d2 from '../assets/row1/d2.png';
import d3 from '../assets/row1/d3.png';
import d4 from '../assets/row1/d4.png';
import d5 from '../assets/row1/d5.png';
import d6 from '../assets/row1/d6.png';
import d7 from '../assets/row1/d7.png';
import d8 from '../assets/row1/d8.png';
import d9 from '../assets/row1/d9.png';

import p1 from '../assets/row1/p1.png';
import p2 from '../assets/row1/p2.png';
import p3 from '../assets/row1/p3.png';
import p4 from '../assets/row1/p4.png';
import p5 from '../assets/row1/p5.png';
import p6 from '../assets/row1/p6.png';
import p7 from '../assets/row1/p7.png';
import p8 from '../assets/row1/p8.png';
import p9 from '../assets/row1/p9.png';

import o1 from '../assets/row1/o1.png';
import o2 from '../assets/row1/o2.png';
import o3 from '../assets/row1/03.png';
import o4 from '../assets/row1/o4.png';
import o5 from '../assets/row1/o5.png';
import o6 from '../assets/row1/o6.png';
import o7 from '../assets/row1/07.png';
import o8 from '../assets/row1/o8.png';
import o9 from '../assets/row1/o9.png';

const BackgroundGrid: React.FC = () => {
  const posters = [
    r1, r2, r3, r4, r5, r6, r7, r8, r9,
    d1, d2, d3, d4, d5, d6, d7, d8, d9,
    p1, p2, p3, p4, p5, p6, p7, p8, p9,
    o1, o2, o3, o4, o5, o6, o7, o8, o9
  ];

 return (
    // Change bg-[#141414] to bg-[#1a1a1a] to reduce red/darkness intensity
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#121212]">
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 p-3 opacity-40">
        {posters.map((imgSrc, i) => (
          <div 
            key={i} 
            // aspect-video matches the width/height ratio from your Figma (124x73)
            className="aspect-video w-full rounded-lg bg-[#222] border border-white/5 overflow-hidden shadow-lg"
          >
            <img 
              src={imgSrc} 
              className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-700 hover:scale-105" 
              alt={`poster-${i}`} 
            />
          </div>
        ))}
      </div>
      
      {/* 2. THE GRADIENT OVERLAY */}
      {/* Adjusted to be more subtle and less "red-heavy" */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none" 
        style={{ 
          background: `
            linear-gradient(180deg, 
              rgba(18, 18, 18, 0.95) 0%, 
              rgba(18, 18, 18, 0.4) 15%, 
              rgba(18, 18, 18, 0.4) 85%, 
              #121212 100%)
          ` 
        }}
      ></div>
    </div>
  );
};

export default BackgroundGrid;