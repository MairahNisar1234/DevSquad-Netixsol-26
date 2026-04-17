'use client';
import React, { useState } from 'react';
import { Box, Container, Typography, Button, CircularProgress, keyframes } from '@mui/material';
const pulseGlow = keyframes`
  0% { box-shadow: 0 0 10px rgba(46, 213, 115, 0.2); }
  50% { box-shadow: 0 0 25px rgba(46, 213, 115, 0.4); }
  100% { box-shadow: 0 0 10px rgba(46, 213, 115, 0.2); }
`;

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: data.isExisting ? "You're already part of the circle!" : 'Welcome! Check your inbox.' });
        setEmail('');
      } else {
        setStatus({ type: 'error', msg: data.error || 'Something went wrong' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Connection failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 8, md: 15 }, 
        position: 'relative', 
        overflow: 'hidden', 
    
        width: '100%'
      }}
    >
      
      {/* --- REPLICATING THE BG GLOW SPOTS --- */}
      {/* Left/Bottom Glow Spot */}
      <Box sx={{ 
        position: 'absolute', 
        top: { xs: '60%', md: '50%' }, 
        left: { xs: '-10%', md: '-5%' }, 
        width: { xs: '300px', md: '500px' }, 
        height: { xs: '300px', md: '500px' }, 
        background: 'radial-gradient(circle, rgba(46, 213, 115, 0.25) 0%, transparent 70%)', 
        filter: 'blur(100px)', 
        zIndex: 1,
        transform: 'translateY(-50%)',
        pointerEvents: 'none'
      }} />

      {/* Right/Top Glow Spot */}
      <Box sx={{ 
        position: 'absolute', 
        top: { xs: '5%', md: '-5%' }, 
        right: { xs: '-5%', md: '5%' }, 
        width: { xs: '250px', md: '450px' }, 
        height: { xs: '250px', md: '450px' }, 
        background: 'radial-gradient(circle, rgba(46, 213, 115, 0.20) 0%, transparent 70%)', 
        filter: 'blur(120px)', 
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Main Content Container (Higher Z-Index) */}
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            // --- THE GLASS CARD ---
            background: 'rgba(255, 255, 255, 0.015)', // Extremely subtle background
            backdropFilter: 'blur(18px) saturate(180%)', // High blur for glassmorphism
            borderRadius: '20px',
            // Thin white border as seen in the image
            border: '1px solid rgba(255, 255, 255, 0.08)',
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            // Heavy shadow combined with a subtle green outer glow
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 20px rgba(46, 213, 115, 0.1)',
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              color: 'white', 
              fontWeight: 800, 
              mb: { xs: 4, md: 6 }, 
              fontFamily: 'inherit', // Uses your site's default font
              fontSize: { xs: '1.6rem', sm: '2rem', md: '2.5rem' },
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
          >
            Want to be aware of all update
          </Typography>

          {/* --- THE GLOWING INPUT AND BUTTON ROW --- */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            alignItems: 'center',
            gap: 2,
            maxWidth: '750px',
            mx: 'auto',
          }}>
            {/* --- GLOWING INPUT PILL --- */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50px',
              // Thin, bright glowing green border
              border: '1px solid rgba(46, 213, 115, 0.7)', 
              width: '100%',
              // Adds an inner glow and subtle outer glow to the pill
              boxShadow: 'inset 0 0 8px rgba(46, 213, 115, 0.2), 0 0 12px rgba(46, 213, 115, 0.15)',
              transition: 'all 0.3s ease',
              '&:focus-within': {
                borderColor: '#2ED573',
                boxShadow: 'inset 0 0 10px rgba(46, 213, 115, 0.3), 0 0 20px rgba(46, 213, 115, 0.3)',
              }
            }}>
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  padding: '16px 28px',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  // Styling for the placeholder text to match the image's faint look
                  '::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)'
                  }
                }}
              />
            </Box>
            
            {/* --- SUBSCRIBE BUTTON --- */}
            <Button
              type="submit"
              disabled={loading}
              sx={{
                bgcolor: '#2ED573', // Your primary neon green
                color: '#020617', // Contrasting dark navy text
                fontWeight: 900,
                px: { xs: 4, sm: 5 },
                py: { xs: 2, sm: 0 },
                minHeight: '56px',
                borderRadius: '50px',
                textTransform: 'none', // Prevents all-caps
                fontSize: '1rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                width: { xs: '100%', sm: 'auto' },
                // Hover effect adds brightness and a stronger glow
                '&:hover': { 
                  bgcolor: '#51e08f',
                  boxShadow: '0 0 25px rgba(46, 213, 115, 0.5)'
                },
                '&:disabled': {
                  bgcolor: 'rgba(46, 213, 115, 0.5)',
                  color: 'rgba(2, 6, 23, 0.7)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: '#020617' }} /> : 'Subscribe'}
            </Button>
          </Box>

          {/* Status Message Display */}
          {status && (
            <Typography 
              sx={{ 
                mt: 4, 
                color: status.type === 'success' ? '#2ED573' : '#ff4d4d', 
                fontWeight: 600,
                fontSize: '0.95rem',
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {status.msg}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
}