'use client';
import React from 'react';
import { Box, Typography, Container, Grid, Paper, Fade } from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { FiActivity, FiCpu, FiShield, FiUser } from 'react-icons/fi';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get('name') || 'User';

  const stats = [
    { label: 'Active Nodes', value: '12', icon: <FiCpu size={24} color="#2ED573" /> },
    { label: 'Security Status', value: 'Protected', icon: <FiShield size={24} color="#2ED573" /> },
    { label: 'Total Activity', value: '1,240', icon: <FiActivity size={24} color="#2ED573" /> },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#020617', color: 'white', pt: 12, pb: 6 }}>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
               <Box sx={{ bgcolor: 'rgba(46, 213, 115, 0.1)', p: 1.5, borderRadius: '15px' }}>
                  <FiUser size={30} color="#2ED573" />
               </Box>
               <Box>
                 <Typography variant="h4" fontWeight="900" sx={{ letterSpacing: '-1px' }}>
                   Welcome back, {name}!
                 </Typography>
                 <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                   Circlechain Portal • System Overview
                 </Typography>
               </Box>
            </Box>

            <Grid container spacing={3}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Paper sx={{
                    p: 4,
                    bgcolor: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '24px',
                    transition: '0.3s',
                    '&:hover': { borderColor: '#2ED573', transform: 'translateY(-5px)' }
                  }}>
                    <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                    <Typography variant="h4" fontWeight="800" sx={{ mb: 0.5 }}>{stat.value}</Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                      {stat.label}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Placeholder for Main Content */}
            <Box sx={{ 
              mt: 4, 
              p: 8, 
              borderRadius: '24px', 
              border: '1px dashed rgba(255,255,255,0.1)',
              textAlign: 'center',
              bgcolor: 'rgba(255,255,255,0.01)'
            }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>
                DASHBOARD CONTENT AREA
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}