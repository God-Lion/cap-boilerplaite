// modules/birth-declaration/screens/NewDeclarationScreen.tsx

import React from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { birthDeclarationSchema } from '../types/schema';
import { 
  Box, 
  Stepper, 
  Step, 
  StepLabel, 
  Button, 
  Typography, 
  Paper,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';

const steps = ['Child Info', 'Birth Details', 'Parent Info', 'Review'];

export function NewDeclarationScreen() {
  const [activeStep, setActiveStep] = React.useState(0);
  const methods = useForm({
    resolver: zodResolver(birthDeclarationSchema as any),
    defaultValues: {
      childName: { firstName: '', lastName: '' },
      birthDetails: {
        dateOfBirth: '',
        timeOfBirth: '',
        sex: 'MALE',
        placeOfBirth: { 
          type: 'HOSPITAL',
          address: { street: '', city: '', state: '', postalCode: '', country: '' }
        },
      },
      parents: [
        { 
          role: 'MOTHER', 
          fullName: { firstName: '', lastName: '' },
          address: { street: '', city: '', state: '', postalCode: '', country: '' }
        }
      ],
    }
  });

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onSubmit = (data: any) => {
    console.log('Submitting Birth Declaration:', data);
    alert('Declaration Submitted Successfully!');
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
        New Birth Declaration
      </Typography>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            {activeStep === 0 && <ChildInfoStep />}
            {activeStep === 1 && <BirthDetailsStep />}
            {activeStep === 2 && <ParentInfoStep />}
            {activeStep === 3 && <ReviewStep data={methods.getValues()} />}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
              <Button disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button variant="contained" type="submit" color="success">
                  Submit Declaration
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              )}
            </Box>
          </form>
        </FormProvider>
      </Paper>
    </Box>
  );
}

function ChildInfoStep() {
  const { register } = useFormContext();
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="First Name" {...register('childName.firstName')} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Last Name" {...register('childName.lastName')} />
      </Grid>
    </Grid>
  );
}

function BirthDetailsStep() {
  return <Typography>Birth Details Form Fields...</Typography>;
}

function ParentInfoStep() {
  return <Typography>Parent Information Form Fields...</Typography>;
}

function ReviewStep({ data }: { data: any }) {
  return (
    <Box>
      <Typography variant="h6">Review Declaration</Typography>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </Box>
  );
}
