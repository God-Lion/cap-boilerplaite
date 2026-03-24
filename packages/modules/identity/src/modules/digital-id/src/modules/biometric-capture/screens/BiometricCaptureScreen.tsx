// modules/biometric-capture/screens/BiometricCaptureScreen.tsx

import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Stepper, Step, StepLabel, Button, Stack, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { FaceCapture } from '../components/FaceCapture';
import DigitalIdPath from '../../../routes/path';

const steps = ['Instructions', 'Face Capture', 'Fingerprint Scan', 'Review'];

export function BiometricCaptureScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [faceImage, setFaceImage] = useState<string | null>(null);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onFaceCapture = (image: string) => {
    setFaceImage(image);
    handleNext();
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Biometric Enrollment</Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Application ID: {id}
      </Typography>

      <Stepper activeStep={activeStep} sx={{ my: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      <Card sx={{ maxWidth: 800, margin: '0 auto' }}>
        <CardContent>
          {activeStep === 0 && (
            <Stack spacing={3}>
              <Typography variant="h6">Biometric Data Collection Instructions</Typography>
              <Typography>
                We need to capture your facial biometric and fingerprints to issue your Digital ID.
                Please ensure you are in a well-lit area and have your camera ready.
              </Typography>
              <Alert severity="info" variant="outlined">
                Biometric data is encrypted and stored securely according to national standards.
              </Alert>
              <Button variant="contained" onClick={handleNext}>I'm Ready</Button>
            </Stack>
          )}

          {activeStep === 1 && (
            <FaceCapture onCapture={onFaceCapture} />
          )}

          {activeStep === 2 && (
            <Stack spacing={3} textAlign="center">
              <Typography variant="h6">Fingerprint Scanning</Typography>
              <Box sx={{ p: 5, border: '2px dashed #ccc', borderRadius: 2 }}>
                <Typography color="text.secondary">[ Fingerprint Scanner Hardware required ]</Typography>
                <Typography variant="caption">Simulator: Click 'Simulate' to proceed</Typography>
              </Box>
              <Button variant="contained" onClick={handleNext}>Simulate Scan</Button>
              <Button variant="text" onClick={handleBack}>Back</Button>
            </Stack>
          )}

          {activeStep === 3 && (
            <Stack spacing={3}>
              <Typography variant="h6">Review Captured Data</Typography>
              <Box display="flex" gap={2}>
                <Box>
                  <Typography variant="caption">Face Photo</Typography>
                  {faceImage && <img src={faceImage} alt="Face" style={{ width: 100, height: 100, borderRadius: 8 }} />}
                </Box>
                <Box>
                  <Typography variant="caption">Fingerprints</Typography>
                  <Box sx={{ width: 100, height: 100, bgcolor: 'success.light', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="white">Captured</Typography>
                  </Box>
                </Box>
              </Box>
              <Button 
                variant="contained" 
                color="success" 
                onClick={() => navigate(DigitalIdPath.verification.progress.replace(':id', id || ''))}
              >
                Submit for Verification
              </Button>
              <Button variant="text" onClick={() => setActiveStep(1)}>Recapture</Button>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
