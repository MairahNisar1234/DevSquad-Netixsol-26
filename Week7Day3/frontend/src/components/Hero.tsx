'use client';
import React from 'react';
import Image from 'next/image';
import { Box, Container, Typography, Button } from '@mui/material';

export default function Hero() {
  return (
    <Box 
      component="section" 
      sx={{ 
        position: 'relative', 
    
        color: 'white', 
        pt: { xs: 15, md: 20 }, 
        pb: 12, 
        overflow: 'hidden',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* 1. Background Glows */}
      <Box 
        sx={{
          position: 'absolute',
          top: '-10%',
          left: '-15%',
          width: '45vw',
          height: '45vw',
          borderRadius: '50%',
          filter: 'blur(140px)',
          opacity: 0.15,
          pointerEvents: 'none',
          background: 'radial-gradient(circle, #2ED573 0%, transparent 70%)',
          zIndex: 0
        }} 
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: '-15%',
          right: '0%',
          width: '40vw',
          height: '40vw',
          borderRadius: '50%',
          filter: 'blur(120px)',
          opacity: 0.2,
          pointerEvents: 'none',
          background: 'radial-gradient(circle, #A8FFEC 0%, transparent 70%)',
          zIndex: 0
        }} 
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
        <Box 
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 6, 
            alignItems: 'center' 
          }}
        >
          
          {/* 2. Text Content */}
          <Box>
           <Typography 
  variant="h1" 
  sx={{ 
    fontFamily: 'var(--font-montserrat), sans-serif',
    color: 'white',
    // Changed from 900 to 700 for a more refined look
    fontWeight: 700, 
    fontSize: { xs: '2.8rem', sm: '3.5rem', md: '4.2rem' },
    lineHeight: 1.1,
    mb: 3,
    letterSpacing: '-0.02em',
  }}
>
  Save, Buy and Sell <br />
  Your blockchain asset
</Typography>
<Typography 
  variant="body1" 
  sx={{ 
    // Changed from #94a3b8 to white
    color: 'white', 
    // Added fontWeight - 500 is a great balance for readability
    fontWeight: 500, 
    fontSize: { xs: '1rem', md: '1.15rem' },
    fontFamily: 'var(--font-montserrat), sans-serif',
    lineHeight: 1.7,
    maxWidth: '480px',
    mb: 5,
    // Optional: add a slight opacity if pure white feels too bright
    opacity: 0.9 
  }}
>
  The easy to manage and trade your cryptocurrency asset
</Typography>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: '#BBFFFF', 
              
                  color: 'black', 
                  fontWeight: '800', 
                  px: 4, 
                  py: 1.6, 
                  borderRadius: '47px',
                  textTransform: 'none',
                  fontFamily: 'var(--font-montserrat)',
                  '&:hover': { bgcolor: '#BBFFFF', boxShadow: '0 0 20px rgba(168, 255, 236, 0.4)' }
                }}
              >
                Connect Wallet
              </Button>

              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: '#fff', 
                  color: '#020617', 
                  fontWeight: '800', 
                  px: 4, 
                  py: 1.6, 
                  borderRadius: '47px',
                  textTransform: 'none',
                  fontFamily: 'var(--font-montserrat)',
                  '&:hover': { bgcolor: '#A8FFEC' }
                }}
              >
                Start Trading
              </Button>
            </Box>
          </Box>

          {/* 3. Illustration Side */}
          <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
             {/* Local glow behind image */}
             <Box 
                sx={{ 
                  position: 'absolute', 
                  width: '80%', 
                  height: '80%', 
                  borderRadius: '50%', 
                  filter: 'blur(80px)', 
                  opacity: 0.1, 
                  background: 'radial-gradient(circle, #A8FFEC 0%, transparent 60%)',
                  zIndex: -1 
                }} 
             />
             
             <Image 
                src="/main.png" 
                alt="3D Collage" 
                width={950} 
                height={800}
                style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                priority
             />
          </Box>

        </Box>
      </Container>
    </Box>
  );
}