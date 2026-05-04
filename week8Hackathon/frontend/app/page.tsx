'use client';
import { Container, Box, Typography, Stack } from '@mui/material';
import PdfAnalyzer from '@/src/components/PdfAnalyzer';

export default function Home() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        bgcolor: '#F9F9F6',
        fontFamily: '"DM Sans", sans-serif',
        pb: { xs: 8, md: 16 }, // Reduced padding on mobile
      }}
    >
      {/* ── Top Nav Bar ── */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          bgcolor: 'rgba(249,249,246,0.88)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #EBEBE7',
          px: { xs: 2, md: 6 }, // Smaller padding on mobile
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #27e3ab 0%, #a6e35a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ width: 10, height: 10, borderRadius: '3px', bgcolor: 'rgba(255,255,255,0.9)' }} />
          </Box>
          <Typography
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: '15px',
              fontWeight: 800,
              color: '#1a1a1a',
              letterSpacing: '-0.03em',
            }}
          >
            Intellidoc
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.5,
            py: 0.6,
            borderRadius: '20px',
            border: '1px solid #E0E0D8',
            bgcolor: '#fff',
          }}
        >
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#27e3ab' }} />
          <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#1A8060' }}>
            System online
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ pt: { xs: 4, md: 12 } }}> {/* Reduced top padding for mobile */}

        {/* ── Hero ── */}
        <Box sx={{ mb: { xs: 6, md: 12 } }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              px: 1.5,
              py: 0.7,
              borderRadius: '20px',
              border: '1px solid #DDDDD8',
              bgcolor: '#fff',
              mb: 3,
            }}
          >
            <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: 'linear-gradient(135deg, #27e3ab, #a6e35a)' }} />
            <Typography sx={{ fontSize: '10px', fontWeight: 700, color: '#606058', letterSpacing: '0.06em' }}>
              POWERED BY MULTI-AGENT DELEGATION
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 900,
              fontSize: { xs: '2.2rem', sm: '3.5rem', md: '5rem' }, // Scaled down for mobile
              lineHeight: { xs: 1.1, md: 0.95 },
              letterSpacing: '-0.05em',
              color: '#1a1a1a',
              mb: { xs: 3, md: 5 },
              maxWidth: 850,
            }}
          >
            Agentic<br />
            Intelligence<br />
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #27e3ab 0%, #a6e35a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              for Documents.
            </Box>
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile
              alignItems: { xs: 'flex-start', md: 'flex-end' },
              gap: { xs: 4, md: 8 },
            }}
          >
            <Typography
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '16px',
                lineHeight: 1.65,
                color: '#80807A',
                maxWidth: 450,
              }}
            >
              Automated PDF analysis through orchestrated agent handoffs.
              Grounded reasoning, zero hallucination.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}> {/* Wrap pills on tiny screens */}
              {[
                { value: '< 30s', label: 'avg response' },
                { value: '99%', label: 'PDF grounded' },
              ].map((s) => (
                <Box
                  key={s.label}
                  sx={{
                    textAlign: 'left',
                    minWidth: '120px',
                    px: 2,
                    py: 1.5,
                    borderRadius: '12px',
                    border: '1px solid #E0E0D8',
                    bgcolor: '#fff',
                  }}
                >
                  <Typography sx={{ fontSize: '20px', fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>
                    {s.value}
                  </Typography>
                  <Typography sx={{ fontSize: '10px', fontWeight: 600, color: '#A0A090', mt: 0.4, textTransform: 'uppercase' }}>
                    {s.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* ── Main Analyzer ── */}
        <PdfAnalyzer />

        {/* ── Feature row ── */}
        <Box
          sx={{
            mt: { xs: 6, md: 10 },
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, // Adaptive columns
            gap: 2,
          }}
        >
          {[
            { title: 'Router Agent', body: 'Intelligently classifies your query and delegates to the right specialist.' },
            { title: 'Tool Execution', body: 'Specialist agents run targeted extractions directly on the PDF source.' },
            { title: 'Grounded Output', body: 'Every answer is traceable back to your document — no hallucinations.' },
          ].map((f) => (
            <Box
              key={f.title}
              sx={{
                p: 3,
                borderRadius: '16px',
                border: '1px solid #E8E8E0',
                bgcolor: '#fff',
              }}
            >
              <Typography sx={{ fontSize: '13px', fontWeight: 800, color: '#1a1a1a', mb: 1 }}>
                {f.title}
              </Typography>
              <Typography sx={{ fontSize: '12px', lineHeight: 1.65, color: '#808078' }}>
                {f.body}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}