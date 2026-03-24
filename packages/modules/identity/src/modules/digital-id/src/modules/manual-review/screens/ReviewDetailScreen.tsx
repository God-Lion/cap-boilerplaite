// modules/manual-review/screens/ReviewDetailScreen.tsx

import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button, TextField, Stack, Divider, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DigitalIdPath from '../../../routes/path';

export function ReviewDetailScreen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [notes, setNotes] = React.useState('');

  const handleApprove = () => {
    // Logic to approve
    navigate(DigitalIdPath.review.queue);
  };

  const handleDeny = () => {
    // Logic to deny
    navigate(DigitalIdPath.review.queue);
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>Review Application</Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Application ID: {id}
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Applicant Information</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}><Typography variant="caption">First Name</Typography><Typography>John</Typography></Grid>
                <Grid size={{ xs: 6 }}><Typography variant="caption">Last Name</Typography><Typography>Doe</Typography></Grid>
                <Grid size={{ xs: 12 }}><Typography variant="caption">SSN / Citizen ID</Typography><Typography>CIT-998877</Typography></Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 4 }} gutterBottom>Biometric Data</Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack direction="row" spacing={4}>
                <Box>
                  <Typography variant="caption">Captured Face</Typography>
                  <Box sx={{ width: 150, height: 150, bgcolor: '#eee', borderRadius: 2 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="caption">Liveness Score</Typography>
                  <Typography variant="h5" color="warning.main">0.82 <Chip label="Uncertain" color="warning" size="small" /></Typography>
                  <Typography variant="caption" sx={{ mt: 2, display: 'block' }}>Engine Feedback</Typography>
                  <Typography color="error">Low lighting detected during capture.</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Decision</Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={3}>
                <TextField
                  label="Reviewer Notes"
                  multiline
                  rows={4}
                  fullWidth
                  value={notes}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotes(e.target.value)}
                  placeholder="Explain your decision..."
                />
                <Button variant="contained" color="success" fullWidth onClick={handleApprove}>
                  Approve Application
                </Button>
                <Button variant="outlined" color="error" fullWidth onClick={handleDeny}>
                  Deny Application
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
