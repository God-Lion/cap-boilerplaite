import {
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
  Avatar,
  Divider,
  Chip,
  Alert,
  AlertTitle,
  Button
} from '@mui/material';
import {
  VerifiedUser as VerifiedUserIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import {
  VerificationTier,
  VERIFICATION_TIERS,
  KycProfile
} from '../../../domain-kernel/src';

// Mock helpers
const formatIdentityPath = (path: string) => path.replace(/_/g, ' ');
const KycStatusChip = ({ status }: any) => <Chip label={status} size="small" />;
const RiskLevelChip = ({ level }: any) => <Chip label={level} size="small" />;
const ServiceAccessMatrix = ({ tier }: { tier: VerificationTier }) => <Typography variant="body2">Tier {tier} Access Granted</Typography>;
const isExpiringSoon = (_date?: string) => false;
const daysUntilExpiry = (_date?: string) => 30;
const formatDate = (_date?: string) => _date || 'N/A';

export function KycProfileCard({ profile }: { profile: KycProfile }) {
  const tierColors: Record<VerificationTier, string> = {
    0: '#9e9e9e', 1: '#ed6c02',
    2: '#0288d1', 3: '#2e7d32', 4: '#6a1b9a',
  };
  const tierColor = tierColors[profile.currentTier];

  return (
    <Card sx={{ maxWidth: 420, overflow: 'visible', position: 'relative' }}>

      {/* Tier badge */}
      <Box
        sx={{
          position: 'absolute',
          top: -16,
          right: 16,
          bgcolor: tierColor,
          color: 'white',
          px: 2,
          py: 0.5,
          borderRadius: 2,
          fontSize: '0.75rem',
          fontWeight: 'bold',
          boxShadow: 2,
        }}
      >
        TIER {profile.currentTier} — {VERIFICATION_TIERS[profile.currentTier].label.toUpperCase()}
      </Box>

      <CardContent>
        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Avatar sx={{ width: 56, height: 56, bgcolor: tierColor }}>
            <VerifiedUserIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {profile.personalInfo.firstName} {profile.personalInfo.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              KYC #{profile.kycNumber}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Identity path */}
        <Stack direction="row" justifyContent="space-between" mb={1.5}>
          <Typography variant="body2" color="text.secondary">
            Verification Type
          </Typography>
          <Chip
            label={formatIdentityPath(profile.identityPath)}
            size="small"
            variant="outlined"
          />
        </Stack>

        {/* Status */}
        <Stack direction="row" justifyContent="space-between" mb={1.5}>
          <Typography variant="body2" color="text.secondary">Status</Typography>
          <KycStatusChip status={profile.status} />
        </Stack>

        {/* Validity */}
        {profile.expiresAt && (
          <Stack direction="row" justifyContent="space-between" mb={1.5}>
            <Typography variant="body2" color="text.secondary">Valid Until</Typography>
            <Typography
              variant="body2"
              color={isExpiringSoon(profile.expiresAt) ? 'warning.main' : 'text.primary'}
              fontWeight="bold"
            >
              {formatDate(profile.expiresAt)}
              {isExpiringSoon(profile.expiresAt) && ' ⚠️'}
            </Typography>
          </Stack>
        )}

        {/* Risk level */}
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Typography variant="body2" color="text.secondary">Risk Level</Typography>
          <RiskLevelChip level={profile.riskProfile.overallRisk} />
        </Stack>

        <Divider sx={{ mb: 2 }} />

        {/* Service access summary */}
        <Typography variant="subtitle2" gutterBottom>
          Service Access
        </Typography>
        <ServiceAccessMatrix
          tier={profile.currentTier}
        />

        {/* Expiry warning */}
        {isExpiringSoon(profile.expiresAt) && (
          <Alert severity="warning" sx={{ mt: 2 }} icon={<AccessTimeIcon />}>
            KYC expires in {daysUntilExpiry(profile.expiresAt)} days.
            <Button size="small" sx={{ ml: 1 }}>Renew Now</Button>
          </Alert>
        )}

        {/* Conditional approval notice */}
        {profile.status === 'CONDITIONALLY_APPROVED' && profile.accessConditions && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <AlertTitle>Conditional Access</AlertTitle>
            <Typography variant="body2">
              {profile.accessConditions.join(' · ')}
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
