// modules/id-issuance/components/IdCardFront.tsx

import React from 'react';
import { Box, Typography, Paper, Grid, Avatar, Stack, Divider } from '@mui/material';

export interface IdCardFrontProps {
  photoUrl?: string;
  firstName: string;
  lastName: string;
  idNumber: string;
  dateOfBirth: string;
  sex: string;
  nationality: string;
  expiryDate: string;
}

export function IdCardFront({ 
  photoUrl, firstName, lastName, idNumber, dateOfBirth, sex, nationality, expiryDate 
}: IdCardFrontProps) {
  return (
    <Paper elevation={4} sx={{ 
      width: 500, height: 310, 
      p: 2, borderRadius: 3, 
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background patterns */}
      <Box sx={{ position: 'absolute', top: -50, right: -50, opacity: 0.1 }}>
        <Typography variant="h1" fontWeight="bold">ID</Typography>
      </Box>

      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold" sx={{ letterSpacing: 1.5 }}>
            REPUBLIC OF DIGITALIA
          </Typography>
          <Typography variant="subtitle2">NATIONAL IDENTIFICATION CARD</Typography>
        </Stack>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
      </Stack>

      <Grid container sx={{ mt: 2 }} spacing={2}>
        <Grid size={{ xs: 4 }}>
          <Box sx={{ 
            width: '100%', pt: '125%', 
            bgcolor: 'rgba(255,255,255,0.1)', 
            borderRadius: 2, 
            backgroundImage: photoUrl ? `url(${photoUrl})` : 'none',
            backgroundSize: 'cover'
          }} />
        </Grid>
        <Grid size={{ xs: 8 }}>
          <Stack spacing={1}>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>SURNAME</Typography>
              <Typography variant="body1" fontWeight="bold">{lastName.toUpperCase()}</Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>GIVEN NAMES</Typography>
              <Typography variant="body1" fontWeight="bold">{firstName.toUpperCase()}</Typography>
            </Box>
            <Grid container spacing={1}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>DATE OF BIRTH</Typography>
                <Typography variant="body2">{dateOfBirth}</Typography>
              </Grid>
              <Grid size={{ xs: 3 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>SEX</Typography>
                <Typography variant="body2">{sex[0]}</Typography>
              </Grid>
              <Grid size={{ xs: 3 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>NAT</Typography>
                <Typography variant="body2">{nationality.substring(0,3).toUpperCase()}</Typography>
              </Grid>
            </Grid>
            <Box>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>CARD ID NUMBER</Typography>
              <Typography variant="h6" fontWeight="bold" sx={{ color: '#ffd700' }}>{idNumber}</Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      <Box sx={{ position: 'absolute', bottom: 15, right: 15 }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>EXPIRY DATE: </Typography>
        <Typography variant="caption" fontWeight="bold">{expiryDate}</Typography>
      </Box>
    </Paper>
  );
}
