// modules/application/screens/NewApplicationScreen.tsx

import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Stepper, Step, StepLabel, Button, Typography, Paper, Alert, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { digitalIdApplicationSchema, DigitalIdApplicationForm } from '../types/schema';
import { DigitalIdRegistry } from '../../../registry/DigitalIdRegistry';
import DigitalIdPath from '../../../routes/path';

const steps = ['Verify Identity', 'Personal Details', 'Supporting Documents', 'Confirm'];

export function NewApplicationScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const registry = DigitalIdRegistry.getInstance();
  
  const methods = useForm<DigitalIdApplicationForm>({
    resolver: zodResolver(digitalIdApplicationSchema as any),
    defaultValues: {
      citizenId: 'current-citizen-id', // Mocked
      birthCertificateId: 'BC-12345',  // Mocked
      personalInfo: {
        firstName: '', lastName: '', dateOfBirth: '', sex: 'MALE', 
        placeOfBirth: '', nationality: '',
        address: { street: '', city: '', state: '', postalCode: '', country: '' }
      }
    }
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onSubmit = async (data: DigitalIdApplicationForm) => {
    try {
      const applicationData = {
        ...data,
        supportingDocuments: data.supportingDocuments?.map((doc, idx) => ({
          id: `DOC-${idx}`,
          type: doc.type,
          url: 'mock-url', // In a real app, this would be the uploaded file URL
          verified: false,
        })) || [],
      };
      
      const app = await registry.applicationService.createApplication(applicationData as any);
      navigate(DigitalIdPath.application.status.replace(':id', app.id));
    } catch (error) {
      console.error('Failed to create application:', error);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>New Digital ID Application</Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}
      </Stepper>

      <Paper sx={{ p: 4 }}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {activeStep === 0 && (
              <Stack spacing={2}>
                <Typography variant="h6">Identity Verification</Typography>
                <Alert severity="info">
                  Your identity has been verified against the National Civil Registry.
                </Alert>
                <Typography>Citizen ID: <strong>current-citizen-id</strong></Typography>
                <Typography>Birth Certificate: <strong>BC-12345</strong></Typography>
              </Stack>
            )}

            {activeStep === 1 && (
                <Typography>Personal Information Form (Omitted for brevity in mockup)</Typography>
            )}
            
            {activeStep === 2 && (
                <Typography>Supporting Documents Upload (Omitted for brevity in mockup)</Typography>
            )}

            {activeStep === 3 && (
              <Stack spacing={2}>
                <Typography variant="h6">Review & Submit</Typography>
                <Typography>Please confirm that all information provided is accurate.</Typography>
                <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
                  {JSON.stringify(methods.getValues().personalInfo, null, 2)}
                </pre>
              </Stack>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>Back</Button>
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" type="submit" color="success">Submit Application</Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>Next</Button>
              )}
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
}
