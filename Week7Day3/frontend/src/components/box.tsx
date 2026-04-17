'use client';
import { Box } from '@mui/material';

/**
 * A purely decorative component that renders five specific green 'bokeh' spots
 * in fixed positions across the background to match the design.
 */
export default function BokehGlows() {
  // Common style for all spots to keep the code dry
  const spotStyle = {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(100px)', // Creates the soft 'bokeh' blur from the mockup
    pointerEvents: 'none',
    zIndex: 0,
  };

  return (
    <Box sx={{ 
      position: 'fixed', // Spots stay anchored relative to the viewport
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      zIndex: -1, // Stays behind all content (as layered in your Home.tsx)
      pointerEvents: 'none', 
      overflow: 'hidden' ,
      opacity: 1.0
    }}>
      
      {/* 1. TOP-LEFT SPOT (Behind 'Save, Buy and Sell') */}
      <Box sx={{ 
        ...spotStyle, 
        top: '-10%', // Sits off-screen slightly
        left: '-8%', 
        width: '55vw', 
        height: '55vw', 
        // 18% alpha is used here for a slightly hotter core than previous tests
        background: 'radial-gradient(circle, rgba(46, 213, 115, 0.18) 0%, transparent 70%)', 
      }} />

      {/* 2. TOP-RIGHT SPOT (Behind the illustration assets) */}
      <Box sx={{ 
        ...spotStyle, 
        top: '2%', 
        right: '-12%', 
        width: '50vw', 
        height: '50vw', 
        background: 'radial-gradient(circle, rgba(46, 213, 115, 0.14) 0%, transparent 70%)', 
      }} />

      {/* 3. MID-RIGHT SPOT (Behind 'Token control' list item) */}
      <Box sx={{ 
        ...spotStyle, 
        top: '40%', // Positioned exactly in the middle vertically
        right: '-10%', 
        width: '45vw', 
        height: '45vw', 
        background: 'radial-gradient(circle, rgba(46, 213, 115, 0.12) 0%, transparent 75%)', 
      }} />

      {/* 4. CENTER SPOT (A subtle haze behind 'Market Trend' title) */}
      <Box sx={{ 
        ...spotStyle, 
        top: '55%', 
        left: '50%', // Centers the spot horizontally
        transform: 'translateX(-50%)', // Offsets by half its width to perfectly center
        width: '600px', // Smaller, more defined spot for the center
        height: '600px', 
        background: 'radial-gradient(circle, rgba(46, 213, 115, 0.10) 0%, transparent 70%)', 
        filter: 'blur(120px)', // High blur for subtlety
      }} />

      {/* 5. BOTTOM-CENTER SPOT (The primary glow behind the Newsletter card) */}
      <Box sx={{ 
        ...spotStyle, 
        bottom: '8%', // Anchored near the bottom of the viewport
        left: '50%', // Centers the spot horizontally
        transform: 'translateX(-50%)', // Centers horizontally
        width: '500px', // Medium size spot for the card
        height: '500px', 
        background: 'radial-gradient(circle, rgba(46, 213, 115, 0.6) 0%, transparent 70%)', 
      }} />

    </Box>
  );
}