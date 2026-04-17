'use client';
import { Box, Container } from '@mui/material';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      bgcolor: '#020617', // Deep Navy base
      py: { xs: 5, md: 10 }
    }}>
      
      {/* --- Figma Background Glows --- */}
      <Box sx={{ 
        position: 'absolute', top: '-10%', left: '-10%', 
        width: '50vw', height: '50vw', 
        background: 'radial-gradient(circle, rgba(46, 213, 115, 0.12) 0%, transparent 70%)', 
        filter: 'blur(100px)', zIndex: 0 
      }} />
      
      <Box sx={{ 
        position: 'absolute', bottom: '-10%', right: '-10%', 
        width: '40vw', height: '40vw', 
        background: 'radial-gradient(circle, rgba(46, 213, 115, 0.08) 0%, transparent 70%)', 
        filter: 'blur(120px)', zIndex: 0 
      }} />

      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            // --- The Glassmorphism Card Style ---
            background: 'rgba(255, 255, 255, 0.01)',
            backdropFilter: 'blur(20px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '32px',
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            boxShadow: '0 40px 100px rgba(0, 0, 0, 0.5)',
          }}
        >
          {children}
        </Box>
      </Container>
    </Box>
  );
}