import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import { KycProfileCard } from '../components/KycProfileCard';
import { VERIFICATION_TIERS } from '../../../domain-kernel/src/types/VerificationLevel';

export const MyKycScreen: React.FC = () => {
  // Mock data for now
  const mockProfile = {
    status: 'VERIFIED' as const,
    tier: 2,
    identityPath: 'UNHCR_REFUGEE_CARD' as const,
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      nationality: 'SYR',
    },
    riskProfile: {
      level: 'LOW' as const,
      score: 15,
      lastScreeningDate: new Date().toISOString(),
    },
    validUntil: new Date(Date.now() + 31536000000).toISOString(), // 1 year from now
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          My KYC Verification
        </Typography>
        <Typography color="text.secondary">
          Manage your identity verification status and access levels.
        </Typography>
      </Box>

      <KycProfileCard profile={mockProfile as any} />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Verification Tiers Explained
        </Typography>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
          {Object.values(VERIFICATION_TIERS).map((tier: any) => (
            <Paper key={tier.tier} sx={{ p: 2, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Tier {tier.tier}: {tier.label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {tier.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Container>
  );
};
