import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
} from '@mui/material'
import {
  Shield,
  Error as ErrorIcon,
  Warning,
  CheckCircle,
  ArrowForward,
  Security,
  VpnKey,
  Password,
  PersonOff,
  Settings,
  Schedule,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface Recommendation {
  id: string
  title: string
  description: string
  severity: 'critical' | 'warning' | 'info'
  icon: React.ReactNode
}

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: '1',
    title: 'Missing MFA on Admin Accounts',
    description:
      '3 administrators do not have Multi-Factor Authentication enabled. This is a critical vulnerability.',
    severity: 'critical',
    icon: <Security />,
  },
  {
    id: '2',
    title: 'Weak Passwords Detected',
    description: '12 users are using passwords that have appeared in known data breaches.',
    severity: 'critical',
    icon: <Password />,
  },
  {
    id: '3',
    title: 'Old API Token Rotation',
    description: '5 API tokens have not been rotated in over 90 days.',
    severity: 'warning',
    icon: <VpnKey />,
  },
  {
    id: '4',
    title: 'Unused Account Cleanup',
    description: '8 user accounts have been inactive for more than 6 months.',
    severity: 'info',
    icon: <PersonOff />,
  },
]

const SEVERITY_CONFIG = (t: any) => ({
  critical: {
    color: 'error' as const,
    label: t('monitoring.security.severity_critical'),
    icon: <ErrorIcon />,
  },
  warning: {
    color: 'warning' as const,
    label: t('monitoring.security.severity_warning'),
    icon: <Warning />,
  },
  info: {
    color: 'info' as const,
    label: t('monitoring.security.severity_info'),
    icon: <CheckCircle />,
  },
})

export default function SecurityHealthCheck() {
  const { t } = useTranslation()
  const securityScore = 72

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success.main'
    if (score >= 60) return 'warning.main'
    return 'error.main'
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield sx={{ fontSize: 24, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant='h5' fontWeight={700} letterSpacing='-0.02em'>
              {t('monitoring.security.health_check_title')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {t('monitoring.security.health_check_subtitle')}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Score & Stats Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Main Score */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              borderRadius: 3,
              border: 1,
              borderColor: 'divider',
              height: '100%',
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Typography
                variant='subtitle2'
                fontWeight={600}
                color='text.secondary'
                sx={{ mb: 2 }}
              >
                {t('monitoring.security.overall_score')}
              </Typography>
              {/* Circular Score */}
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                <Box
                  sx={{
                    width: 140,
                    height: 140,
                    borderRadius: '50%',
                    border: 8,
                    borderColor: (theme) => alpha(theme.palette.divider, 0.2),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: -8,
                      borderRadius: '50%',
                      border: 8,
                      borderColor: 'transparent',
                      borderTopColor: getScoreColor(securityScore),
                      borderRightColor:
                        securityScore > 25 ? getScoreColor(securityScore) : 'transparent',
                      borderBottomColor:
                        securityScore > 50 ? getScoreColor(securityScore) : 'transparent',
                      borderLeftColor:
                        securityScore > 75 ? getScoreColor(securityScore) : 'transparent',
                      transform: 'rotate(-45deg)',
                    },
                  }}
                >
                  <Typography variant='h3' fontWeight={800} color={getScoreColor(securityScore)}>
                    {securityScore}
                  </Typography>
                </Box>
              </Box>
              <Typography variant='body2' color='text.secondary'>
                {t('monitoring.security.score_comparison')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Stat Cards */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Grid container spacing={2} sx={{ height: '100%' }}>
            {[
              {
                label: t('monitoring.security.stat_critical'),
                value: 3,
                color: 'error',
                icon: <ErrorIcon />,
              },
              {
                label: t('monitoring.security.stat_warnings'),
                value: 12,
                color: 'warning',
                icon: <Warning />,
              },
              {
                label: t('monitoring.security.stat_passed'),
                value: 45,
                color: 'success',
                icon: <CheckCircle />,
              },
            ].map((stat) => (
              <Grid key={stat.label} size={{ xs: 12 }}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <CardContent
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      py: 2,
                      '&:last-child': { pb: 2 },
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: (theme) => alpha((theme.palette as any)[stat.color].main, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '& .MuiSvgIcon-root': {
                          color: `${stat.color}.main`,
                          fontSize: 20,
                        },
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant='caption' color='text.secondary' fontWeight={500}>
                        {stat.label}
                      </Typography>
                      <Typography variant='h5' fontWeight={700}>
                        {stat.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* Prioritized Recommendations */}
      <Card sx={{ borderRadius: 3, border: 1, borderColor: 'divider', mb: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant='subtitle1' fontWeight={600}>
              {t('monitoring.security.recommendations_title')}
            </Typography>
          </Box>
          <List disablePadding>
            {MOCK_RECOMMENDATIONS.map((rec, index) => {
              const config = SEVERITY_CONFIG(t)[rec.severity]
              return (
                <ListItem
                  key={rec.id}
                  sx={{
                    px: 3,
                    py: 2,
                    borderBottom: index < MOCK_RECOMMENDATIONS.length - 1 ? 1 : 0,
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                    transition: 'background-color 0.15s',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 44,
                      '& .MuiSvgIcon-root': {
                        color: `${config.color}.main`,
                        fontSize: 22,
                      },
                    }}
                  >
                    {rec.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant='subtitle2' fontWeight={600}>
                          {rec.title}
                        </Typography>
                        <Chip
                          label={config.label}
                          size='small'
                          color={config.color}
                          variant='outlined'
                          sx={{ height: 20, fontSize: '0.65rem' }}
                        />
                      </Box>
                    }
                    secondary={rec.description}
                  />
                  <ArrowForward sx={{ color: 'text.disabled', fontSize: 18 }} />
                </ListItem>
              )
            })}
          </List>
        </CardContent>
      </Card>

      {/* Footer */}
      <Box
        sx={{
          textAlign: 'center',
          py: 2,
        }}
      >
        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
        >
          <Schedule sx={{ fontSize: 14 }} />
          {t(
            'auth.security.scan_info',
            'Security scans are performed automatically every 24 hours. Last scan: 2 hours ago.',
          )}
        </Typography>
        <Button
          startIcon={<Settings />}
          size='small'
          sx={{ textTransform: 'none', fontWeight: 600, mt: 1 }}
        >
          {t('auth.security.configure_scan', 'Configure Scan Settings')}
        </Button>
      </Box>
    </Container>
  )
}
