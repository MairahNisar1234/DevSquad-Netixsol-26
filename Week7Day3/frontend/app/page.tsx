'use client';

import { Box } from '@mui/material';
import Navbar from '../src/components/Navbar';
import Hero from '../src/components/Hero';
import Features from '../src/components/features'; 
import MarketTrendSection from '../src/components/MarketTrendSection';
import Newsletter from '../src/components/newsletter';
import Footer from '../src/components/Footer';
import BokehGlows from '../src/components/box';

export default function Home() {
  return (
    <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* 1. THE BASE BACKGROUND LAYER */}
      <Box sx={{ 
        position: 'fixed', 
        top: 0, left: 0, right: 0, bottom: 0, 
        bgcolor: '#020617', 
        zIndex: -2 
      }} />

      {/* 2. THE SPOTS LAYER */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: -1 }}>
         <BokehGlows />
      </Box>

      {/* 3. THE CONTENT LAYER */}
      <Navbar />
      <Box component="main" sx={{ position: 'relative', zIndex: 1 }}>
        <Hero />
        <Features /> 
        <Box sx={{ py: 8 }}><MarketTrendSection /></Box>
        <Box sx={{ pb: 10 }}><Newsletter /></Box>
      </Box>
      <Footer/>
    </Box>
  );
}