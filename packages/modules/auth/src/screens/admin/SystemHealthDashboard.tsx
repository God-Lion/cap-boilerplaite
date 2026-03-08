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
  CircularProgress,
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
import { useSystemHealth, useSystemMetrics } from '../../hooks'

export default function SystemHealthDashboard() {
  const { t } = useTranslation('common')
  const theme = useTheme()

  const {
    data: healthRes,
    isLoading: isHealthLoading,
    error: healthError,
    refetch: refetchHealth,
    isRefetching: isHealthRefetching,
  } = useSystemHealth({ refetchInterval: 15000 })

  const {
    data: metricsRes,
    isLoading: isMetricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
    isRefetching: isMetricsRefetching,
  } = useSystemMetrics({ refetchInterval: 15000 })

  const health = healthRes?.data
  const basicMetrics = metricsRes?.data

  const isLoading = isHealthLoading || isMetricsLoading
  const isRefetching = isHealthRefetching || isMetricsRefetching
  const isError = !!healthError || !!metricsError

  const handleRefresh = () => {
    refetchHealth()
    refetchMetrics()
  }

  const rawServices = health?.dependencies || []

  // Create an array mapping from the API DependencyStatus
  const services = rawServices.map((service) => {
    return {
      name: service.name,
      status: service.status === 'healthy' ? 'operational' : service.status,
      latency: service.responseTime,
      load: service.status === 'healthy' ? 10 : 90, // mock load for now
      pulse: service.status === 'healthy' ? 100 : 0, // mock pulse for now
    }
  })

  // Format memory usage to MB
  const memoryMB = basicMetrics?.memoryUsage?.rss
    ? Math.round(basicMetrics.memoryUsage.rss / 1024 / 1024) + ' MB'
    : '--'

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
      label: t('auth.monitoring.memory_usage'),
      value: memoryMB,
      trend: 'stable',
      icon: <StorageIcon />,
      color: 'info',
    },
  ]

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto', textAlign: 'center' }}>
        <Typography color='error' variant='h6' sx={{ mb: 2 }}>
          {t('auth.admin.errorLoadingEvents')}
        </Typography>
        <Button variant='contained' onClick={handleRefresh} startIcon={<Refresh />}>
          {t('auth.common.retry')}
        </Button>
      </Box>
    )
  }

  const overallStatus = health?.status || 'unhealthy'

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
                bgcolor:
                  overallStatus === 'unhealthy'
                    ? 'error.main'
                    : overallStatus === 'degraded'
                      ? 'warning.main'
                      : 'success.main',
                animation: 'pulse 2s infinite',
              }}
            />
            {overallStatus === 'unhealthy'
              ? t('auth.monitoring.status_unhealthy')
              : overallStatus === 'degraded'
                ? t('auth.monitoring.status_degraded')
                : t('auth.monitoring.live_status_operational')}
          </Stack>
        </Box>
        <IconButton onClick={handleRefresh} disabled={isRefetching}>
          <Refresh sx={{ animation: isRefetching ? 'spin 1s linear infinite' : 'none' }} />
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
                        ) : service.status === 'degraded' ? (
                          <Warning color='warning' fontSize='small' />
                        ) : (
                          <ErrorIcon color='error' fontSize='small' />
                        )}
                        <Typography variant='body1' sx={{ fontWeight: 700 }}>
                          {service.name}
                        </Typography>
                      </Box>
                      <Stack direction='row' spacing={2}>
                        {t('auth.monitoring.latency_label')}: {service.latency || 'N/A'}
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
                          color={
                            service.status === 'operational'
                              ? 'success'
                              : service.status === 'degraded'
                                ? 'warning'
                                : 'error'
                          }
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
                      {t('auth.monitoring.load_label')}: {service.load}%
                    </Box>
                  </Box>
                ))}
                {services.length === 0 && (
                  <Typography variant='body2' color='text.secondary'>
                    {t('auth.admin.noEventsFound')}
                  </Typography>
                )}
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
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `,
        }}
      />
    </Box>
  )
}
