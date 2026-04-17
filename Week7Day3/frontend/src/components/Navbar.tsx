'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Container, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText,
  Button,
  useMediaQuery,
  useTheme 
} from '@mui/material';

// React Icons for better branding control
import { FaFacebook, FaInstagram, FaLinkedin, FaDiscord, FaTelegram, FaGoogle } from 'react-icons/fa';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const navLinks = [
    { name: 'How it work', href: '/how-it-work' },
    { name: 'Blog', href: '/blog' },
    { name: 'Support', href: '/support' },
  ];

  // Map icons to their respective signup/home pages
  const socialData = [
    { icon: <FaFacebook />, url: 'https://www.facebook.com/signup' },
    { icon: <FaInstagram />, url: 'https://www.instagram.com/accounts/emailsignup/' },
    { icon: <FaLinkedin />, url: 'https://www.linkedin.com/signup' },
    { icon: <FaDiscord />, url: 'https://discord.com/register' },
    { icon: <FaTelegram />, url: 'https://web.telegram.org/k/' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Requirement: Redirect to backend Google Auth route
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google'; // Change to your actual backend URL
  };

  return (
    <Box 
      component="nav" 
      sx={{ 
        py: 2.5, 
        width: '100%', 
        position: 'absolute', 
        top: 0, 
        zIndex: 100,
        background: 'linear-gradient(to bottom, rgba(2, 6, 23, 0.9) 0%, transparent 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container maxWidth="xl" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* 1. Logo Section */}
        <Link href="/" className="flex items-center gap-3 group">
          <Box sx={{ position: 'relative', width: { xs: 32, md: 42 }, height: { xs: 32, md: 42 } }}>
            <Image 
              src="/logo.png" 
              alt="Circlechain Logo" 
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </Box>
          <span className="text-xl md:text-2xl font-black tracking-tighter text-white font-sans">
            Circlechain
          </span>
        </Link>

        {/* 2. Desktop Navigation */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {navLinks.map((item) => (
              <Link 
                key={item.name} 
                href={item.href}
                className="text-white/80 font-medium hover:text-[#2ED573] transition-all text-[17px] font-sans"
              >
                {item.name}
              </Link>
            ))}
          </Box>
        )}

        {/* 3. Action Area */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          
          {/* New Google Auth Button */}
         {!isMobile && (
    <Button
      onClick={handleGoogleLogin}
      startIcon={<FaGoogle size={14} />}
      sx={{
        bgcolor: '#2ED573', // Your signature green
        color: '#020617',    // High-contrast dark blue/black
        px: 3,
        py: 1,
        borderRadius: '50px', // Matches your rounded input/button style
        fontWeight: '900',
        textTransform: 'none',
        fontSize: '0.95rem',
        fontFamily: 'sans-serif',
        mr: 2,
        boxShadow: '0 4px 14px 0 rgba(46, 213, 115, 0.39)', // Subtle green glow
        transition: '0.3s ease',
        '&:hover': { 
          bgcolor: '#51e08f', 
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(46, 213, 115, 0.23)' 
        }
      }}
    >
      Sign in with Google
    </Button>
  )}

          {/* Desktop Socials */}
          {!isMobile && socialData.map((social, index) => (
            <IconButton 
              key={index}
              href={social.url}
              target="_blank"
              sx={{ 
                color: 'white', 
                border: '1px solid rgba(255,255,255,0.15)', 
                borderRadius: '10px',
                p: 0.8,
                transition: '0.3s',
                '&:hover': {
                  borderColor: '#2ED573',
                  color: '#2ED573',
                  backgroundColor: 'rgba(46, 213, 115, 0.08)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              {React.cloneElement(social.icon as React.ReactElement, { size: 20 })}
            </IconButton>
          ))}

          {/* Mobile Hamburger */}
          {isMobile && (
            <IconButton 
              onClick={handleDrawerToggle}
              sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px' }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Box>
      </Container>

      {/* --- MOBILE DRAWER MENU --- */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        PaperProps={{
          sx: { width: '280px', bgcolor: '#020617', borderLeft: '1px solid rgba(46, 213, 115, 0.2)', p: 3 }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <List>
          {navLinks.map((item) => (
            <ListItem key={item.name} disablePadding sx={{ mb: 2 }}>
              <ListItemButton 
                onClick={() => { router.push(item.href); handleDrawerToggle(); }}
                sx={{ borderRadius: '12px', '&:hover': { bgcolor: 'rgba(46, 213, 115, 0.1)' } }}
              >
                <ListItemText 
                  primary={item.name} 
                  primaryTypographyProps={{ color: 'white', fontWeight: 600, fontSize: '1.2rem' }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
          {/* Mobile Google Button */}
          <ListItem disablePadding>
             <Button
                fullWidth
                onClick={handleGoogleLogin}
                startIcon={<FaGoogle />}
                sx={{ bgcolor: '#2ED573', color: '#020617', fontWeight: 800, py: 1.5, borderRadius: '10px', mt: 2 }}
              >
                Google Sign In
              </Button>
          </ListItem>
        </List>

        <Box sx={{ mt: 'auto', pt: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
          {socialData.map((social, index) => (
            <IconButton 
              key={index} 
              href={social.url}
              target="_blank"
              sx={{ color: '#2ED573', border: '1px solid rgba(46, 213, 115, 0.3)', borderRadius: '8px' }}
            >
              {social.icon}
            </IconButton>
          ))}
        </Box>
      </Drawer>
    </Box>
  );
}