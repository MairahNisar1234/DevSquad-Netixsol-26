'use client';
import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Stack } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import { FaDiscord } from 'react-icons/fa'; // Install react-icons for Discord

const socialIcons = [
  { icon: <FacebookIcon />, url: '#' },
  { icon: <InstagramIcon />, url: '#' },
  { icon: <LinkedInIcon />, url: '#' },
  { icon: <FaDiscord />, url: '#' },
  { icon: <TelegramIcon />, url: '#' },
];

export default function Footer() {
  return (
    <Box 
      component="footer" 
      sx={{ 
      
        color: 'white', 
        pt: 10, 
        pb: 4, 
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative' 
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          {/* Logo & Description */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              {/* Custom Circlechain SVG Logo */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="8" cy="8" r="4" fill="white" />
                <circle cx="24" cy="8" r="4" fill="white" />
                <circle cx="8" cy="24" r="4" fill="white" />
                <circle cx="24" cy="24" r="4" fill="white" />
                <rect x="7" y="8" width="2" height="16" fill="white" opacity="0.5" />
                <rect x="23" y="8" width="2" height="16" fill="white" opacity="0.5" />
                <rect x="8" y="7" width="16" height="2" fill="white" opacity="0.5" />
                <rect x="8" y="23" width="16" height="2" fill="white" opacity="0.5" />
              </svg>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                Circlechain
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', lineHeight: 1.8, maxWidth: 350 }}>
              Amet minim mollit non deserunt ullamco est aliqua dolor do amet sint. 
              Velit officia consequat duis enim velit mollit. Exercitation veniam 
              consequat sunt nostrud amet.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              Quick Link
            </Typography>
            <Stack spacing={2}>
              {['How it work', 'Blog', 'Support'].map((link) => (
                <Link 
                  key={link} 
                  href="#" 
                  underline="none" 
                  sx={{ color: '#94a3b8', transition: '0.3s', '&:hover': { color: '#2ED573' } }}
                >
                  {link}
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Social Media */}
          <Grid item xs={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
              Social Media
            </Typography>
            <Stack direction="row" spacing={1}>
              {socialIcons.map((item, index) => (
                <IconButton 
                  key={index} 
                  sx={{ 
                    color: 'white', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    '&:hover': { bgcolor: '#2ED573', color: '#020617', borderColor: '#2ED573' }
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box sx={{ mt: 10, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.05)', textAlign: 'right' }}>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            (c) 2022 Circlechain
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}