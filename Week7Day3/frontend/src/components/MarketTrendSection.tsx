'use client';
import React from 'react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import CallMadeIcon from '@mui/icons-material/CallMade'; // Arrow icon from your design

const cryptoData = [
  { symbol: 'BTC', name: 'BITCOIN', price: '$56,623.54', change: '1.41%', color: '#F7931A' },
  { symbol: 'ETH', name: 'ETHEREUM', price: '$4,267.90', change: '2.22%', color: '#627EEA' },
  { symbol: 'BNB', name: 'BINANCE', price: '$587.74', change: '0.82%', color: '#F3BA2F' },
  { symbol: 'USDT', name: 'TETHER', price: '$0.9998', change: '0.03%', color: '#26A17B' },
];

// Replicating your 4x4 grid layout
const displayData = [...cryptoData, ...cryptoData, ...cryptoData, ...cryptoData];

function Sparkline() {
  return (
    <svg width="100%" height="40" viewBox="0 0 100 40">
      <path
        d="M0 30 Q 25 10, 50 25 T 100 5"
        fill="none"
        stroke="#2ED573"
        strokeWidth="2"
      />
    </svg>
  );
}

export default function MarketTrendSection() {
  return (
    <Box sx={{ py: 10, bgcolor: '#020617' }}>
      <Container maxWidth="xl">
        <Typography
          variant="h3"
          sx={{ 
            color: 'white', 
            fontWeight: 900, 
            mb: 6, 
            fontFamily: 'var(--font-montserrat)',
            fontSize: { xs: '2rem', md: '2.5rem' } 
          }}
        >
          Market Trend
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { 
              xs: '1fr', 
              sm: 'repeat(2, 1fr)', 
              md: 'repeat(3, 1fr)', 
              lg: 'repeat(4, 1fr)' 
            },
            gap: 3,
          }}
        >
          {displayData.map((coin, index) => (
            <Card
              key={index}
              sx={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '16px',
                border: '1px solid rgba(46, 213, 115, 0.3)', // The glowing border from your image
                position: 'relative',
                transition: '0.3s ease',
                '&:hover': {
                  borderColor: '#2ED573',
                  transform: 'translateY(-5px)',
                  boxShadow: '0 0 20px rgba(46, 213, 115, 0.15)',
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* Header: Icon, Info, and Arrow */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: '50%',
                        bgcolor: coin.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.8rem'
                      }}
                    >
                      {coin.symbol[0]}
                    </Box>
                    <Box>
                      <Typography sx={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>
                        {coin.symbol}
                      </Typography>
                      <Typography sx={{ color: '#94a3b8', fontSize: '0.65rem', fontWeight: 600 }}>
                        {coin.name}
                      </Typography>
                    </Box>
                  </Box>
                  <CallMadeIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
                </Box>

                {/* Price and Percentage */}
                <Typography sx={{ color: 'white', fontWeight: 900, fontSize: '1.4rem', mb: 0.5 }}>
                  {coin.price}
                </Typography>
                <Typography sx={{ color: 'white', opacity: 0.7, fontSize: '0.85rem' }}>
                  {coin.change}
                </Typography>

                {/* Sparkline Visualization */}
                <Box sx={{ mt: 2, height: 40, width: '100%' }}>
                  <Sparkline />
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}