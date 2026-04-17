'use client';
import React, { useState } from 'react';
import { 
  Typography, 
  Button, 
  TextField, 
  Box, 
  Container, 
  Fade, 
  IconButton, 
  InputAdornment 
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Icons
import { FiMail, FiLock, FiEye, FiEyeOff, FiChevronRight } from 'react-icons/fi';
import { FaGoogle, FaApple, FaFacebookF } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔐 Example auth check
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/dashboard');
    } else {
      alert('Please login first');
    }
  };

  const textFieldStyles = {
    mb: 2.5,
    '& .MuiOutlinedInput-root': {
      color: 'white',
      borderRadius: '16px',
      background: 'linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      '& fieldset': {
        borderColor: 'rgba(255, 255, 255, 0.08)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(46, 213, 115, 0.4)',
      },
      '&.Mui-focused': {
        boxShadow: '0 0 0 2px rgba(46, 213, 115, 0.2)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2ED573',
      },
    },
    '& input:-webkit-autofill': {
      WebkitBoxShadow: '0 0 0 100px #020617 inset !important',
      WebkitTextFillColor: 'white !important',
    }
  };

  const socialIconStyles = {
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    p: 1.8,
    backdropFilter: 'blur(10px)',
    transition: '0.3s',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      borderColor: '#2ED573',
      transform: 'translateY(-4px) scale(1.05)'
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#020617', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      p: 2
    }}>
      
      {/* 🌌 Background Glow */}
      <Box sx={{ 
        position: 'absolute',
        top: '10%',
        right: '-10%',
        width: '40vw',
        height: '40vw',
        background: 'radial-gradient(circle, rgba(46, 213, 115, 0.12), transparent 70%)',
        filter: 'blur(120px)',
      }} />

      <Fade in timeout={1000}>
        <Container maxWidth="xs" sx={{ zIndex: 1 }}>
          <Box sx={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
            backdropFilter: 'blur(30px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '28px',
            boxShadow: `
              0 10px 40px rgba(0,0,0,0.6),
              inset 0 1px 0 rgba(255,255,255,0.05)
            `,
            p: { xs: 4, sm: 6 },
            textAlign: 'center',
            transition: '0.4s ease',
            '&:hover': {
              transform: 'translateY(-6px) scale(1.01)',
            }
          }}>
            
            {/* Top Icon */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box sx={{ 
                background: 'linear-gradient(135deg, #2ED573, #1dd1a1)',
                borderRadius: '50%',
                width: 56, 
                height: 56, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 10px 25px rgba(46,213,115,0.3)'
              }}>
                <FiChevronRight size={26} color="#020617" />
              </Box>
            </Box>

            <Typography variant="h5" fontWeight="800" sx={{ color: 'white', mb: 1 }}>
              Sign in with email
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', mb: 5 }}>
              Enter your details to continue
            </Typography>

            <Box component="form" onSubmit={handleSignIn}>
              
              {/* Email */}
              <TextField 
                placeholder="Email Address"
                fullWidth
                sx={textFieldStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiMail size={18} color="rgba(255,255,255,0.4)" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password */}
              <TextField 
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                sx={textFieldStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiLock size={18} color="rgba(255,255,255,0.4)" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box sx={{ textAlign: 'right', mb: 3 }}>
                <Link href="#" style={{ color: '#2ED573', fontSize: '0.85rem', fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </Box>

              {/* Button */}
              <Button
                type="submit"
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #2ED573, #1dd1a1)',
                  color: '#020617',
                  fontWeight: '900',
                  py: 1.8,
                  borderRadius: '16px',
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 10px 25px rgba(46,213,115,0.35)',
                  transition: '0.3s',
                  '&:hover': {
                    transform: 'translateY(-3px) scale(1.02)',
                    boxShadow: '0 14px 30px rgba(46,213,115,0.5)',
                  }
                }}
              >
                Get Started
              </Button>

              {/* Divider */}
              <Box sx={{ display: 'flex', alignItems: 'center', my: 4 }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />
                <Typography sx={{ px: 2, color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
                  OR
                </Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'rgba(255,255,255,0.1)' }} />
              </Box>

              {/* Social Icons */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <IconButton sx={socialIconStyles}><FaGoogle size={18} /></IconButton>
                <IconButton sx={socialIconStyles}><FaApple size={18} /></IconButton>
                <IconButton sx={socialIconStyles}><FaFacebookF size={18} /></IconButton>
              </Box>

              {/* Signup */}
              <Typography variant="body2" sx={{ mt: 5, color: 'rgba(255,255,255,0.4)' }}>
                Don't have an account?{' '}
                <Link href="/signup" style={{ color: '#2ED573', fontWeight: 'bold' }}>
                  Sign up
                </Link>
              </Typography>

            </Box>
          </Box>
        </Container>
      </Fade>
    </Box>
  );
}