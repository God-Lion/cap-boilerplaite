import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  useTheme,
  alpha,
  Stack,
  Button,
} from '@mui/material'
import {
  TrendingUp,
  Refresh,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Speed,
  Storage as StorageIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export default function SystemHealthDashboard() {
  const { t } = useTranslation('common')
  const theme = useTheme()

  const services = [
    { name: 'Core Auth API', status: 'operational', pulse: 98.4, latency: '45ms', load: 32 },
    { name: 'Redis Session Store', status: 'operational', pulse: 100, latency: '2ms', load: 12 },
    { name: 'Database (PG)', status: 'operational', pulse: 99.9, latency: '12ms', load: 45 },
    { name: 'MFA SMS Provider', status: 'operational', pulse: 95.2, latency: '450ms', load: 3 },
    { name: 'Email Gateway', status: 'degraded', pulse: 88.0, latency: '2.4s', load: 88 },
  ]

  const metrics = [
    {
      label: t('auth.monitoring.avg_latency'),
      value: '82 ms',
      trend: '+2.1%',
      icon: <Speed />,
      color: 'primary',
    },
    {
      label: t('auth.monitoring.req_s'),
      value: '1.2k',
      trend: '-5.4%',
      icon: <TrendingUp />,
      color: 'secondary',
    },
    {
      label: t('auth.monitoring.errors_1h'),
      value: '14',
      trend: '+12%',
      icon: <ErrorIcon />,
      color: 'error',
    },
    {
      label: t('auth.monitoring.cpu_usage'),
      value: '42%',
      trend: 'stable',
      icon: <StorageIcon />,
      color: 'info',
    },
  ]

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, letterSpacing: '-0.027em', mb: 1 }}>
            {t('auth.monitoring.health_title')}
          </Typography>
          <Stack direction='row' spacing={1} alignItems='center'>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'success.main',
                animation: 'pulse 2s infinite',
              }}
            />
            {t('auth.monitoring.live_status_operational')}
          </Stack>
        </Box>
        <IconButton>
          <Refresh />
        </IconButton>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metrics.map((metric, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
              <CardContent>
                <Stack
                  direction='row'
                  justifyContent='space-between'
                  alignItems='center'
                  sx={{ mb: 2 }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha((theme.palette as any)[metric.color].main, 0.1),
                      color: (theme.palette as any)[metric.color].main,
                    }}
                  >
                    {metric.icon}
                  </Avatar>
                  <Chip
                    label={metric.trend}
                    size='small'
                    color={
                      metric.trend.startsWith('+')
                        ? 'error'
                        : metric.trend.startsWith('-')
                          ? 'success'
                          : 'default'
                    }
                    sx={{ fontWeight: 700, height: 20, fontSize: '0.65rem' }}
                  />
                </Stack>
                <Typography variant='h4' sx={{ fontWeight: 800 }}>
                  {metric.value}
                </Typography>
                <Typography
                  variant='caption'
                  color='text.secondary'
                  sx={{ fontWeight: 700, textTransform: 'uppercase' }}
                >
                  {metric.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Services List */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <CardContent>
              <Typography variant='h6' sx={{ fontWeight: 800, mb: 3 }}>
                {t('auth.monitoring.services_status')}
              </Typography>
              <Stack spacing={3}>
                {services.map((service) => (
                  <Box key={service.name}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {service.status === 'operational' ? (
                          <CheckCircle color='success' fontSize='small' />
                        ) : (
                          <Warning color='warning' fontSize='small' />
                        )}
                        <Typography variant='body1' sx={{ fontWeight: 700 }}>
                          {service.name}
                        </Typography>
                      </Box>
                      <Stack direction='row' spacing={2}>
                        {t('auth.monitoring.latency_label', { latency: service.latency })}
                        <Chip
                          label={service.status}
                          size='small'
                          variant='outlined'
                          sx={{
                            textTransform: 'uppercase',
                            fontWeight: 800,
                            fontSize: '0.6rem',
                            height: 18,
                          }}
                          color={service.status === 'operational' ? 'success' : 'warning'}
                        />
                      </Stack>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress
                          variant='determinate'
                          value={service.load}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            bgcolor: alpha(theme.palette.divider, 0.5),
                            '& .MuiLinearProgress-bar': {
                              borderRadius: 3,
                              bgcolor: service.load > 80 ? 'error.main' : 'primary.main',
                            },
                          }}
                        />
                      </Box>
                      {t('auth.monitoring.load_label', { load: service.load })}
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none', height: '100%' }}
          >
            <CardContent>
              <Typography variant='h6' sx={{ fontWeight: 800, mb: 3 }}>
                {t('auth.monitoring.recent_incidents')}
              </Typography>
              <Stack spacing={2}>
                {[
                  { title: 'Email Relay Delay', time: '1h ago', status: 'investigating' },
                  { title: 'API Gateway Spike', time: '4h ago', status: 'resolved' },
                ].map((incident, i) => (
                  <Box
                    key={i}
                    sx={{ p: 2, bgcolor: alpha(theme.palette.action.hover, 0.5), borderRadius: 2 }}
                  >
                    <Typography variant='subtitle2' sx={{ fontWeight: 800 }}>
                      {incident.title}
                    </Typography>
                    <Stack
                      direction='row'
                      justifyContent='space-between'
                      alignItems='center'
                      sx={{ mt: 1 }}
                    >
                      <Typography variant='caption' color='text.secondary'>
                        {incident.time}
                      </Typography>
                      <Chip
                        label={incident.status}
                        size='small'
                        variant='outlined'
                        color={incident.status === 'resolved' ? 'success' : 'warning'}
                        sx={{ height: 16, fontSize: '0.55rem', fontWeight: 900 }}
                      />
                    </Stack>
                  </Box>
                ))}
                <Button
                  variant='text'
                  fullWidth
                  sx={{ textTransform: 'none', fontWeight: 700, mt: 2 }}
                >
                  {t('auth.monitoring.view_full_status')}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
      `,
        }}
      />
    </Box>
  )
}
