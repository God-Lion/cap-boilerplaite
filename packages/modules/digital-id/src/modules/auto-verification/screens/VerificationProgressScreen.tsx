// modules/auto-verification/screens/VerificationProgressScreen.tsx

import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress, Stack, Fade, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DigitalIdPath from '../../../routes/path';

const verificationSteps = [
  { id: 'liveness', label: 'Face Liveness Detection' },
  { id: 'quality', label: 'Image Quality Assessment' },
  { id: 'registry', label: 'National Registry Cross-Check' },
  { id: 'blockchain', label: 'Initializing Blockchain Anchor' }
];

export function VerificationProgressScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (currentStep < verificationSteps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        // Redirect to status or success
        navigate(DigitalIdPath.application.status.replace(':id', id || ''));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, navigate, id]);

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
      <Typography variant="h4" gutterBottom>Verifying Identity</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Please wait while we process your biometric data...
      </Typography>

      <Card sx={{ width: '100%', maxWidth: 500 }}>
        <CardContent>
          <Stack spacing={3}>
            {verificationSteps.map((step, index) => (
              <Box key={step.id} sx={{ opacity: index <= currentStep ? 1 : 0.3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {index < currentStep ? (
                    <Chip label="✓ Done" color="success" size="small" />
                  ) : index === currentStep ? (
                    <CircularProgress size={20} />
                  ) : (
                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid #ccc' }} />
                  )}
                  <Typography variant="body1" fontWeight={index === currentStep ? 'bold' : 'normal'}>
                    {step.label}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        </CardContent>
      </Card>

      <Fade in={currentStep === verificationSteps.length}>
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="success.main">Verification Complete!</Typography>
          <Typography variant="body2" color="text.secondary">Finalizing your application...</Typography>
        </Box>
      </Fade>
    </Box>
  );
}
