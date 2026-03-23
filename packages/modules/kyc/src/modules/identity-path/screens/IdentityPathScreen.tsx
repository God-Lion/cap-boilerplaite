import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Alert,
  AlertTitle,
  Button
} from '@mui/material';
import {
  VerifiedUser as VerifiedUserIcon,
  Badge as BadgeIcon,
  FlightTakeoff as FlightIcon,
  Home as HomeIcon,
  Gavel as GavelIcon,
  LocationCity as LocationCityIcon,
  SupportAgent as SupportAgentIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Mock hook for now
const useIdentityPath = () => {
  return {
    detectPath: (answers: any) => console.log('Detecting path with:', answers),
    isDetecting: false,
    pathResult: null,
  };
};

export function IdentityPathScreen() {
  const [answers, setAnswers] = useState<any>({});
  const { detectPath, isDetecting } = useIdentityPath();

  const pathOptions = [
    {
      id: 'SSN_CITIZEN',
      icon: <BadgeIcon sx={{ fontSize: 48 }} />,
      title: 'I have a Social Security Number',
      subtitle: 'Fastest path — verification in minutes',
      color: 'success',
    },
    {
      id: 'PASSPORT',
      icon: <FlightIcon sx={{ fontSize: 48 }} />,
      title: 'I have a foreign passport',
      subtitle: 'Foreign nationals — 1-3 business days',
      color: 'primary',
    },
    {
      id: 'REFUGEE',
      icon: <HomeIcon sx={{ fontSize: 48 }} />,
      title: 'I have refugee documentation (UNHCR)',
      subtitle: 'Refugees — dedicated support available',
      color: 'info',
    },
    {
      id: 'ASYLUM',
      icon: <GavelIcon sx={{ fontSize: 48 }} />,
      title: 'I am an asylum seeker',
      subtitle: 'Asylum certificate accepted',
      color: 'warning',
    },
    {
      id: 'RESIDENCE',
      icon: <LocationCityIcon sx={{ fontSize: 48 }} />,
      title: 'I have a residence or work permit',
      subtitle: 'Permit holders — standard process',
      color: 'primary',
    },
    {
      id: 'NONE',
      icon: <SupportAgentIcon sx={{ fontSize: 48 }} />,
      title: 'I have no official documents',
      subtitle: 'Community route — we will help you',
      color: 'secondary',
    },
  ];

  return (
    <Box maxWidth={800} mx="auto" py={4}>
      {/* Header */}
      <Box textAlign="center" mb={4}>
        <VerifiedUserIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Let's verify your identity
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Everyone deserves access to services. Select the option that best
          describes your situation — all paths are valid.
        </Typography>
      </Box>

      {/* No-judgment banner */}
      <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 3 }}>
        <AlertTitle>All paths are equally valid</AlertTitle>
        There is no preferred option. Whether you have a passport or no
        documents at all, we have a process to help you access services.
        Your information is kept confidential and secure.
      </Alert>

      {/* Path options grid */}
      <Grid container spacing={2}>
        {pathOptions.map(option => (
          <Grid size={{ xs: 12, sm: 6 }} key={option.id}>
            <Card
              onClick={() => setAnswers((a: any) => ({ ...a, primaryPath: option.id }))}
              sx={{
                cursor: 'pointer',
                border: 2,
                borderColor: answers.primaryPath === option.id
                  ? `${option.color}.main` : 'divider',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: `${option.color}.main`,
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ color: `${option.color}.main` }}>
                    {option.icon}
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {option.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.subtitle}
                    </Typography>
                  </Box>
                  {answers.primaryPath === option.id && (
                    <CheckCircleIcon
                      color="success"
                      sx={{ ml: 'auto', flexShrink: 0 }}
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Special help for undocumented */}
      {answers.primaryPath === 'NONE' && (
        <Alert severity="success" sx={{ mt: 3 }}>
          <AlertTitle>We can help</AlertTitle>
          <Typography variant="body2">
            If you have no official documents, you can still be verified through:
          </Typography>
          <ul style={{ paddingLeft: '20px' }}>
            <li>A social worker or NGO support letter</li>
            <li>A community or religious leader attestation</li>
            <li>Two independent witness declarations</li>
            <li>School enrollment or hospital records</li>
          </ul>
          <Typography variant="body2">
            You will be assigned a dedicated support officer to guide you
            through the process.
          </Typography>
        </Alert>
      )}

      {/* Continue button */}
      {answers.primaryPath && (
        <Button
          variant="contained"
          size="large"
          fullWidth
          sx={{ mt: 3 }}
          onClick={() => detectPath(answers)}
          disabled={isDetecting}
        >
          {isDetecting ? 'Detecting best path...' : 'Continue →'}
        </Button>
      )}
    </Box>
  );
}
