'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Box, Button, TextField, Paper, Typography,
  Stepper, Step, StepLabel, CircularProgress, Divider, Chip, Stack
} from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import ArchitectureIcon from '@mui/icons-material/Architecture';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAnalyzePdfMutation } from '@/src/store/apiSlice';

export default function PdfAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState<string>('');
  const [trace, setTrace] = useState<any[]>([]);

  const [analyzePdf, { isLoading, data, error, reset }] = useAnalyzePdfMutation();

  useEffect(() => {
    if (data) {
      setMessage('');
      toast.success('Intelligence Report Generated');
    }
  }, [data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File is too large (Max 10MB)');
        return;
      }
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      reset();
      toast.success(`${selectedFile.name} uploaded`);
    }
  };

const handleRunAnalysis = async () => {
  
  if (!message.trim()) {
    toast.error("Please enter a prompt.");
    return;
  }

  if (!file) {
    toast.error("Please upload a PDF first.");
    return;
  }

  try {
    // 2. Call the API (casting file as File to satisfy TS)
    // We cast result as 'any' or your specific Interface to access .success
    const result = await analyzePdf({ 
      file: file as File, 
      message 
    }).unwrap() as any;

    // 3. Handle Backend Guardrail blocks (nonsense/random numbers)
    if (result.success === false) {
      toast.error(result.error || "Request blocked by system guardrails.");
      // We return here so we don't show the success toast or update state
      return; 
    }

    // 4. Handle actual Success
    // 'finalResponse' is the field where your Agent sends the final string
    setResponse(result.finalResponse);
    setTrace(result.steps || []);
    
    toast.success("Intelligence Report Generated");

  } catch (err: any) {
    // 5. Handle Network or Server crashes (500 errors)
    console.error("Analysis Error:", err);
    toast.error(err?.data?.message || "The analyst encountered a system error.");
  }
};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleRunAnalysis(); }
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '320px 1fr' },
        gap: '2px',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid #E8E8E0',
        boxShadow: '0 2px 40px rgba(0,0,0,0.06)',
        bgcolor: '#F9F9F6',
        fontFamily: '"DM Sans", sans-serif',
      }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '13px',
            fontWeight: 600,
            borderRadius: '10px',
            border: '1px solid #E8E8E0',
          },
        }}
      />

      {/* ── LEFT SIDEBAR ── */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {/* Upload zone */}
        <Box sx={{ p: 3, borderBottom: '1px solid #EFEFEB' }}>
          <Typography
            sx={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#A0A090',
              mb: 2,
              textTransform: 'uppercase',
            }}
          >
            Document Source
          </Typography>

          <input
            accept="application/pdf"
            style={{ display: 'none' }}
            id="pdf-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label htmlFor="pdf-upload" style={{ display: 'block' }}>
            <Box
              component="span"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1.5,
                py: 3.5,
                px: 2,
                borderRadius: '12px',
                border: '1.5px dashed',
                borderColor: file ? '#C5F0E0' : '#DDDDD8',
                bgcolor: file ? 'rgba(39,227,171,0.04)' : '#FAFAF8',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#27e3ab',
                  bgcolor: 'rgba(39,227,171,0.04)',
                },
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  bgcolor: file ? 'rgba(39,227,171,0.15)' : '#F0F0EC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CloudUploadIcon
                  sx={{ fontSize: 18, color: file ? '#27e3ab' : '#A0A090' }}
                />
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                {file ? (
                  <>
                    <Typography
                      sx={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#2D2D2A',
                        lineHeight: 1.3,
                        wordBreak: 'break-word',
                      }}
                    >
                      {file.name}
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: '#27e3ab', fontWeight: 600, mt: 0.3 }}>
                      Tap to replace
                    </Typography>
                  </>
                ) : (
                  <>
                    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: '#2D2D2A' }}>
                      Drop PDF here
                    </Typography>
                    <Typography sx={{ fontSize: '11px', color: '#A0A090', mt: 0.3 }}>
                      or click to browse · max 10 MB
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
          </label>
        </Box>

        {/* PDF Preview */}
        {previewUrl && (
          <Box sx={{ p: 3, borderBottom: '1px solid #EFEFEB' }}>
            <Typography
              sx={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#A0A090',
                mb: 1.5,
                textTransform: 'uppercase',
              }}
            >
              Preview
            </Typography>
            <Box
              sx={{
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid #EFEFEB',
                height: '240px',
              }}
            >
              <iframe src={previewUrl} width="100%" height="100%" title="PDF Preview" style={{ display: 'block' }} />
            </Box>
          </Box>
        )}

        {/* Agent Trace */}
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Typography
            sx={{
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#A0A090',
              mb: 2,
              textTransform: 'uppercase',
            }}
          >
            Agentic Trace
          </Typography>

          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <CircularProgress size={14} thickness={6} sx={{ color: '#27e3ab' }} />
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: '#555' }}>
                Router delegating…
              </Typography>
            </Box>
          ) : !data?.steps || data.steps.length === 0 ? (
            <Typography sx={{ fontSize: '12px', color: '#C0C0B8', fontStyle: 'italic' }}>
              Waiting for query…
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {data.steps.map((step: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1.5,
                  }}
                >
                  <Box
                    sx={{
                      mt: '3px',
                      width: 20,
                      height: 20,
                      borderRadius: '6px',
                      bgcolor: index === data.steps.length - 1 ? '#27e3ab' : '#F0F0EC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Typography sx={{ fontSize: '9px', fontWeight: 800, color: index === data.steps.length - 1 ? '#fff' : '#A0A090' }}>
                      {index + 1}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#1a1a1a' }}>
                      {step.agent.toUpperCase()}
                    </Typography>
                    <Typography sx={{ fontSize: '10px', color: '#A0A090', mt: 0.2 }}>
                      {step.type === 'handoff' ? '↪ Handoff to specialist' : '⚙ Tool executed'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* ── RIGHT PANEL ── */}
      <Box
        sx={{
          bgcolor: '#FAFAF8',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Query Bar */}
        <Box
          sx={{
            px: 3,
            py: 2.5,
            bgcolor: '#FFFFFF',
            borderBottom: '1px solid #EFEFEB',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            variant="standard"
            placeholder="Ask the agent anything about your document…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            slotProps={{
              input: {
                disableUnderline: true,
                sx: {
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#1a1a1a',
                  '&::placeholder': { color: '#C0C0B8' },
                },
              },
            }}
          />

          <Button
            onClick={handleRunAnalysis}
            disabled={isLoading || !file || !message}
            sx={{
              minWidth: 44,
              height: 44,
              borderRadius: '12px',
              flexShrink: 0,
              background: 'linear-gradient(135deg, #27e3ab 0%, #a6e35a 100%)',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(39,227,171,0.3)',
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 8px 20px rgba(39,227,171,0.4)',
              },
              '&.Mui-disabled': {
                background: '#EDEDEA',
                color: '#BEBEB8',
                boxShadow: 'none',
              },
            }}
          >
            {isLoading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <SendIcon sx={{ fontSize: 18 }} />
            )}
          </Button>
        </Box>

        {/* Result Area */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 3, md: 4 },
            minHeight: '480px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
              }}
            >
              <CircularProgress size={36} thickness={3} sx={{ color: '#27e3ab' }} />
              <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#B0B0A8' }}>
                Analyzing document…
              </Typography>
            </Box>
          ) : !data ? (
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                opacity: 0.18,
              }}
            >
              <ArchitectureIcon sx={{ fontSize: 80, color: '#1a1a1a' }} />
              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#1a1a1a',
                  letterSpacing: '-0.02em',
                }}
              >
                Multi-Agent System Ready
              </Typography>
            </Box>
          ) : (
            <Box>
              {/* Header row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.8,
                    px: 1.5,
                    py: 0.6,
                    borderRadius: '8px',
                    bgcolor: 'rgba(39,227,171,0.12)',
                  }}
                >
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      bgcolor: '#27e3ab',
                    }}
                  />
                  <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#1A8060' }}>
                    Verified Answer
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1.5,
                    py: 0.6,
                    borderRadius: '8px',
                    border: '1px solid #E0E0D8',
                  }}
                >
                  <Typography sx={{ fontSize: '11px', fontWeight: 700, color: '#909088' }}>
                    PDF Grounded
                  </Typography>
                </Box>
              </Box>

              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '20px',
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  color: '#1a1a1a',
                  mb: 2,
                }}
              >
                Intelligence Report
              </Typography>

              <Divider sx={{ mb: 3, borderColor: '#EFEFEB' }} />

              <Typography
                sx={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '14px',
                  lineHeight: 1.85,
                  color: '#3D3D38',
                  whiteSpace: 'pre-line',
                }}
              >
                {data.data}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}