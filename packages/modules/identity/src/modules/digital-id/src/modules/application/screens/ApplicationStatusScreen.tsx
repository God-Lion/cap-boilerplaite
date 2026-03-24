// modules/application/screens/ApplicationStatusScreen.tsx

import React from 'react';
import { Box, Typography, Card, CardContent, Step, Stepper, StepLabel, Alert, Button, Stack } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DigitalIdPath from '../../../routes/path';

const steps = [
  { label: 'Application Submitted', status: 'APPLICATION_SUBMITTED' },
  { label: 'Capture Biometrics', status: 'PENDING_BIOMETRICS' },
  { label: 'Biometrics Captured', status: 'BIOMETRICS_CAPTURED' },
  { label: 'Auto Verification', status: 'AUTO_VERIFICATION' },
  { label: 'Manual Review', status: 'MANUAL_REVIEW' },
  { label: 'ID Issued', status: 'ISSUED' }
];

import { IdCardStatus } from '../../../domain-kernel/src/types/DigitalId';

export function ApplicationStatusScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Mocking status for UI demonstration
  const status = 'PENDING_BIOMETRICS' as IdCardStatus; 

  const activeStep = steps.findIndex(s => s.status === status);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Application Status</Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Application ID: {id}
      </Typography>

      <Card sx={{ mt: 3, p: 3 }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel 
                error={status === 'REJECTED' && index === activeStep}
                optional={index === activeStep ? <Typography variant="caption" color="primary">Current Stage</Typography> : null}
              >
                {step.label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Card>

      {status === 'PENDING_BIOMETRICS' && (
        <Card sx={{ mt: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Next Step: Biometric Capture</Typography>
              <Typography>Please visit the nearest enrollment center or use a supported device to capture your biometric data.</Typography>
              <Button 
                variant="contained" 
                color="secondary"
                onClick={() => navigate(DigitalIdPath.biometrics.capture.replace(':id', id || ''))}
              >
                Go to Biometric Capture
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
