// modules/eligibility/screens/EligibilityCheckScreen.tsx

import React from 'react';
import { Box, Typography, Card, CardContent, Button, Alert, CircularProgress, Stack } from '@mui/material';
import { useEligibilityCheck } from '../hooks/useEligibilityCheck';
import { useNavigate } from 'react-router-dom';
import DigitalIdPath from '../../../routes/path';

export function EligibilityCheckScreen({ citizenId }: { citizenId: string }) {
  const { data: status, isLoading, error } = useEligibilityCheck(citizenId);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !status) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error instanceof Error ? error.message : 'Failed to check eligibility'}
      </Alert>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Digital ID Eligibility</Typography>
      
      <Card sx={{ mt: 3, maxWidth: 600 }}>
        <CardContent>
          {status.isEligible ? (
            <Stack spacing={3}>
              <Alert severity="success">
                <Typography variant="h6">You are eligible!</Typography>
                <Typography>You can now proceed with your Digital ID application.</Typography>
              </Alert>
              
              <Box>
                <Typography variant="body2" color="text.secondary">Age: {status.citizenAge}</Typography>
                <Typography variant="body2" color="text.secondary">Date of Birth: {new Date(status.dateOfBirth).toLocaleDateString()}</Typography>
              </Box>

              <Button 
                variant="contained" 
                size="large" 
                onClick={() => navigate(DigitalIdPath.application.new)}
              >
                Start Application
              </Button>
            </Stack>
          ) : (
            <Stack spacing={3}>
              <Alert severity="warning">
                <Typography variant="h6">Not Eligible Yet</Typography>
                <Typography>
                  {status.reason === 'UNDER_18' 
                    ? `You must be 18 years old to apply. You will be eligible on ${new Date(status.turnsEighteenOn).toLocaleDateString()}.`
                    : status.reason === 'ALREADY_HAS_ACTIVE_ID'
                    ? 'You already have an active Digital ID.'
                    : 'An application is already in progress.'}
                </Typography>
              </Alert>

              {status.reason === 'UNDER_18' && (
                <Typography variant="body1">
                  Remaining time: <strong>{status.daysUntilEligible} days</strong>
                </Typography>
              )}

              {status.reason === 'ALREADY_HAS_ACTIVE_ID' && (
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(DigitalIdPath.management.myId)}
                >
                  View My ID
                </Button>
              )}
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
