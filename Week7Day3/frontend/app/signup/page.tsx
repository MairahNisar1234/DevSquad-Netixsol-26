'use client';
import AuthLayout from '@/src/components/AuthLayout';
import { Typography, Button, TextField, Box } from '@mui/material';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <AuthLayout>
      <Typography variant="h4" fontWeight="900" className="text-neon-gradient" gutterBottom>
        Create Account
      </Typography>
      <Typography variant="body2" sx={{ color: '#9CA3AF', mb: 4 }}>
        Join Circlechain and start managing assets
      </Typography>

      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField label="Full Name" variant="outlined" fullWidth />
        <TextField label="Email Address" variant="outlined" fullWidth />
        <TextField label="Password" type="password" variant="outlined" fullWidth />
        
        <Button variant="contained" className="bg-mint text-black font-bold py-3 rounded-xl">
          Get Started
        </Button>

        <Typography variant="caption" sx={{ mt: 2, color: '#9CA3AF' }}>
          Already registered? <Link href="/login" style={{ color: '#A8FFEC', fontWeight: 'bold' }}>Login</Link>
        </Typography>
      </Box>
    </AuthLayout>
  );
}