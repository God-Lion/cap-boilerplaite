// modules/id-issuance/screens/IssuanceDashboard.tsx

import React from 'react';
import { Box, Typography, Grid, Paper, Button, Stack, LinearProgress } from '@mui/material';
import { IdCardFront } from '../components/IdCardFront';

export function IssuanceDashboard() {
  const [issuing, setIssuing] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const startIssuance = () => {
    setIssuing(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIssuing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Issuance Dashboard</Typography>
      
      <Grid container spacing={4} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h6" gutterBottom>Preview Card</Typography>
          <IdCardFront 
            firstName="John" 
            lastName="Doe" 
            idNumber="DIG-00982734" 
            dateOfBirth="2005-01-01" 
            sex="MALE" 
            nationality="Digitalian" 
            expiryDate="2033-10-25" 
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 4 }}>
            <Stack spacing={4}>
              <Typography variant="h6">Issuance Control</Typography>
              <Typography color="text.secondary">
                This will finalize the application, anchor the ID on the blockchain, 
                and encode the NFC chip.
              </Typography>
              
              {issuing ? (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Process: {progress}%</Typography>
                  <LinearProgress variant="determinate" value={progress} />
                </Box>
              ) : (
                <Button variant="contained" color="primary" size="large" onClick={startIssuance}>
                  Start Issuance Process
                </Button>
              )}

              <Stack direction="row" spacing={2}>
                <Button variant="outlined" fullWidth disabled={issuing}>Blockchain Anchor</Button>
                <Button variant="outlined" fullWidth disabled={issuing}>Generate PDF</Button>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
