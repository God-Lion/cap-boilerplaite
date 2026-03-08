import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  useTheme,
  alpha,
  Stack,
  LinearProgress,
  Avatar,
  Paper,
  Chip,
} from '@mui/material'
import {
  Security,
  Smartphone,
  Tag,
  VpnKey,
  TrendingUp,
  TrendingDown,
  VerifiedUser,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export default function MFAUsageAnalytics() {
  const { t } = useTranslation('common')
  const theme = useTheme()

  const stats = [
    {
      label: t('auth.admin.overallMfaAdoption'),
      value: '68.4%',
      trend: '+4.2% monthly',
      color: 'primary',
    },
    { label: t('auth.admin.avgAuthTime'), value: '4.2s', trend: '-0.3s', color: 'success' },
    { label: t('auth.admin.mfaChallenges24h'), value: '1,242', trend: '+12%', color: 'info' },
    { label: t('auth.admin.successRate'), value: '99.2%', trend: 'stable', color: 'warning' },
  ]

  const methodDistribution = [
    {
      name: 'Authenticator App (TOTP)',
      count: 842,
      percentage: 65,
      icon: <Smartphone />,
      color: '#3f51b5',
    },
    {
      name: 'Passkey / Hardware Key',
      count: 245,
      percentage: 22,
      icon: <VpnKey />,
      color: '#009688',
    },
    { name: 'SMS (OTP)', count: 122, percentage: 11, icon: <Tag />, color: '#ff9800' },
    { name: 'Backup Codes', count: 32, percentage: 2, icon: <History />, color: '#9c27b0' },
  ]

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='body1' color='text.secondary'>
          {t('auth.admin.mfaAnalyticsSubtitle')}
        </Typography>
      </Box>

      {/* High-level Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ fontWeight: 800, textTransform: 'uppercase' }}
                >
                  {stat.label}
                </Typography>
                <Typography variant='h4' sx={{ fontWeight: 800, my: 1 }}>
                  {stat.value}
                </Typography>
                <Stack direction='row' spacing={0.5} alignItems='center'>
                  {stat.trend.startsWith('+') ? (
                    <TrendingUp color='success' sx={{ fontSize: 16 }} />
                  ) : (
                    <TrendingDown color='error' sx={{ fontSize: 16 }} />
                  )}
                  <Typography
                    variant='caption'
                    sx={{
                      fontWeight: 700,
                      color: stat.trend.startsWith('+') ? 'success.main' : 'error.main',
                    }}
                  >
                    {stat.trend}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Distribution & Insights */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant='h6' sx={{ fontWeight: 800, mb: 4 }}>
                {t('auth.admin.methodDistribution')}
              </Typography>
              <Stack spacing={4}>
                {methodDistribution.map((method) => (
                  <Box key={method.name}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Stack direction='row' spacing={2} alignItems='center'>
                        <Avatar
                          sx={{
                            bgcolor: alpha(method.color, 0.1),
                            color: method.color,
                            width: 32,
                            height: 32,
                          }}
                        >
                          {React.cloneElement(method.icon as any, { sx: { fontSize: 18 } })}
                        </Avatar>
                        <Box>
                          <Typography variant='body2' sx={{ fontWeight: 800 }}>
                            {method.name}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {t('auth.admin.usersEnrolledLabel', { count: method.count })}
                          </Typography>
                        </Box>
                      </Stack>
                      <Typography variant='subtitle2' sx={{ fontWeight: 900 }}>
                        {method.percentage}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant='determinate'
                      value={method.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: alpha(theme.palette.divider, 0.5),
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          bgcolor: method.color,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            <Card
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
                bgcolor: alpha(theme.palette.primary.main, 0.03),
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant='body2' sx={{ lineHeight: 1.7, mb: 3 }}>
                  {t('auth.admin.mfaInsightDesc')}
                </Typography>
                <Stack direction='row' spacing={2}>
                  <Chip
                    icon={<Security sx={{ fontSize: '1rem !important' }} />}
                    label='SOC2 Compliant'
                    size='small'
                    sx={{
                      fontWeight: 700,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <Chip
                    icon={<VerifiedUser sx={{ fontSize: '1rem !important' }} />}
                    label='99.9% Effective'
                    size='small'
                    sx={{
                      fontWeight: 700,
                      bgcolor: 'background.paper',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                </Stack>
              </CardContent>
            </Card>

            <Paper
              variant='outlined'
              sx={{
                p: 4,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.success.main, 0.03),
                borderColor: alpha(theme.palette.success.main, 0.2),
              }}
            >
              <Typography
                variant='subtitle1'
                sx={{ fontWeight: 800, color: 'success.main', mb: 1 }}
              >
                {t('auth.admin.bestPracticeTip')}
              </Typography>
              <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                {t('auth.admin.bestPracticeDesc')}
              </Typography>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
import { History } from '@mui/icons-material'
