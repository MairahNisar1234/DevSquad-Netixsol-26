'use client';

import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography } from '@mui/material';

// Define the content for the three horizontal glass bars
const featureData = [
  {
    title: 'Access Token Market',
    subtitle: 'Buy and sell token anytime and anywhere',
  },
  {
    title: 'User Friendly Interface',
    subtitle: 'Easy to navigate',
  },
  {
    title: 'Ownership Token control',
    subtitle: 'Be in control and own as many asset as possible',
  },
];

export default function Features() {
  return (
    <Box 
      component="section" 
      sx={{ 
        position: 'relative', 
      
        color: 'white', 
        py: { xs: 12, md: 18 }, 
        overflow: 'hidden',
      }}
    >
      {/* 1. SECTION GLOWS (Blur spots from image) */}
      {/* Large green glow behind the wallet graphic */}
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[140px] opacity-25 pointer-events-none" 
           style={{ background: 'radial-gradient(circle, #2ED573 0%, transparent 70%)' }} />
      {/* Subtle bottom Mint glow */}
      <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full blur-[120px] opacity-15 pointer-events-none" 
           style={{ background: 'radial-gradient(circle, #A8FFEC 0%, transparent 70%)' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
        
        {/* 2. SECTION HEADERS */}
        <Box sx={{ textAlign: 'center', mb: { xs: 8, md: 14 } }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontWeight: 800, // Matching the image weight
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem' },
              lineHeight: 1.2,
              mb: 2.5,
              color: 'white'
            }}
          >
            Global Decentralize currency based on <br />
            blockchain technology
          </Typography>

          <Typography 
            variant="body2" 
            sx={{ 
              color: '#2ED573', // Primary Neon Green
              fontSize: { xs: '0.95rem', md: '1.1rem' },
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontWeight: 500,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Web3 is the latest efficient technology
          </Typography>
        </Box>

        {/* 3. CONTENT GRID (Graphic on left, Bars on right) */}
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: The entire wallet/crypto graphic */}
          <Box sx={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
             <Image 
                src="/illustration.png" // Point to your optimized PNG export
                alt="Web3 Wallet and Crypto Icons Graphic" 
                width={650} 
                height={550}
                style={{ objectFit: 'contain' }}
                priority
             />
          </Box>

          {/* RIGHT: The three glass bars */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
           {featureData.map((feature, index) => (
  <Box 
    key={index}
    sx={{ 
      p: { xs: 4, md: 5 }, 
      borderRadius: '1.5rem', 
      border: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      flexDirection: 'column',
      gap: 1.2,
      transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      borderLeft: 'none',
      
      background: 'linear-gradient(270deg, rgba(115, 253, 170, 2) 0%, rgba(196, 196, 196, 0) 100%)',
      backdropFilter: 'blur(10px)', 

      '&:hover': {
        // Shifting the gradient intensity on hover for a "lit up" effect
        background: 'linear-gradient(270deg, rgba(115, 253, 170, 0.3) 0%, rgba(196, 196, 196, 0.05) 100%)',
        borderColor: 'rgba(46, 213, 115, 0.5)',
        transform: 'translateX(10px)', // Slides slightly right to emphasize the "sweep"
      }
    }}
  >
    <Typography 
      variant="h5" 
      sx={{ 
        fontFamily: 'var(--font-montserrat), sans-serif',
        fontWeight: 800, 
        fontSize: { xs: '1.4rem', md: '1.65rem' },
        color: 'white',
        letterSpacing: '-0.02em'
      }}
    >
      {feature.title}
    </Typography>

    <Typography 
      variant="body2" 
      sx={{ 
        color: '#cbd5e1', // Slightly lighter gray for better contrast on the gradient
        fontSize: { xs: '0.95rem', md: '1.05rem' },
        fontFamily: 'var(--font-montserrat), sans-serif',
        fontWeight: 400,
        lineHeight: 1.6
      }}
    >
      {feature.subtitle}
    </Typography>
  </Box>
))}
          </Box>

        </Box>
      </Container>
    </Box>
  );
}