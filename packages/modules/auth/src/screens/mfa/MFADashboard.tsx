import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  alpha,
} from '@mui/material'
import {
  Smartphone,
  Sms,
  Email,
  UsbOutlined,
  Key,
  Settings,
  ArrowForward,
  ArrowBack,
  VerifiedUser,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

interface MfaMethodCard {
  id: string
  icon: React.ReactNode
  name: string
  label: string
  labelColor: 'primary' | 'success' | 'warning' | 'default' | 'info'
  description: string
  detail: string
  isConfigured: boolean
}

const MOCK_METHODS = (t: any): MfaMethodCard[] => [
  {
    id: 'authenticator',
    icon: <Smartphone />,
    name: t('auth.mfa.methods.authenticator'),
    label: t('auth.mfa.labels.recommended'),
    labelColor: 'primary',
    description: t('auth.mfa.descriptions.authenticator'),
    detail: t('auth.mfa.details.authenticator'),
    isConfigured: true,
  },
  {
    id: 'sms',
    icon: <Sms />,
    name: t('auth.mfa.methods.sms'),
    label: t('auth.mfa.labels.standard'),
    labelColor: 'info',
    description: t('auth.mfa.descriptions.sms'),
    detail: t('auth.mfa.details.sms'),
    isConfigured: true,
  },
  {
    id: 'email',
    icon: <Email />,
    name: t('auth.mfa.methods.email'),
    label: t('auth.mfa.labels.backup'),
    labelColor: 'warning',
    description: t('auth.mfa.descriptions.email'),
    detail: t('auth.mfa.details.email'),
    isConfigured: true,
  },
  {
    id: 'security_key',
    icon: <UsbOutlined />,
    name: t('auth.mfa.methods.security_key'),
    label: t('auth.mfa.labels.hardware'),
    labelColor: 'default',
    description: t('auth.mfa.descriptions.security_key'),
    detail: t('auth.mfa.details.security_key'),
    isConfigured: false,
  },
  {
    id: 'recovery',
    icon: <Key />,
    name: t('auth.mfa.methods.recovery'),
    label: t('auth.mfa.labels.emergency'),
    labelColor: 'warning',
    description: t('auth.mfa.descriptions.recovery'),
    detail: t('auth.mfa.details.recovery'),
    isConfigured: false,
  },
]

export default function MFADashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [methods] = useState<MfaMethodCard[]>(MOCK_METHODS(t))

  const configuredCount = methods.filter((m) => m.isConfigured).length

  return (
    <Container maxWidth='md' sx={{ py: 4 }}>
      {/* Breadcrumb */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
        >
          {t('auth.common.back')}
        </Button>
        <Typography variant='body2' color='text.secondary'>
          /
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('auth.mfa.security')}
        </Typography>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant='h4' fontWeight={700} letterSpacing='-0.02em' sx={{ mb: 1 }}>
          {t('auth.mfa.dashboard_title')}
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ maxWidth: 600 }}>
          {t('auth.mfa.dashboard_subtitle')}
        </Typography>
      </Box>

      {/* Security Score Banner */}
      <Card
        sx={{
          mb: 4,
          borderRadius: 3,
          border: 1,
          borderColor: 'success.main',
          bgcolor: (theme) => alpha(theme.palette.success.main, 0.05),
        }}
      >
        <CardContent
          sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}
        >
          <VerifiedUser sx={{ color: 'success.main', fontSize: 32 }} />
          <Box>
            <Typography variant='subtitle1' fontWeight={700} color='success.dark'>
              {t('auth.mfa.security_high')}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {t('auth.mfa.active_methods_count', { count: configuredCount })}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Methods Overview */}
      <Typography variant='h6' fontWeight={600} sx={{ mb: 2 }}>
        {t('auth.mfa.configured_methods_overview')}
      </Typography>

      <Grid container spacing={2}>
        {methods.map((method) => (
          <Grid key={method.id} size={{ xs: 12 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: 1,
                borderColor: method.isConfigured
                  ? 'divider'
                  : (theme) => alpha(theme.palette.text.disabled, 0.2),
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: (theme) => `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                  py: 2.5,
                  '&:last-child': { pb: 2.5 },
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    bgcolor: (theme) =>
                      method.isConfigured
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.text.disabled, 0.08),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& .MuiSvgIcon-root': {
                      fontSize: 22,
                      color: method.isConfigured ? 'primary.main' : 'text.disabled',
                    },
                    flexShrink: 0,
                  }}
                >
                  {method.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant='subtitle1' fontWeight={600}>
                      {method.name}
                    </Typography>
                    <Chip
                      label={method.label}
                      size='small'
                      color={method.labelColor as any}
                      variant={method.isConfigured ? 'filled' : 'outlined'}
                      sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                    />
                  </Box>
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ mb: method.detail ? 0.25 : 0 }}
                  >
                    {method.description}
                  </Typography>
                  {method.detail && (
                    <Typography variant='caption' color='text.disabled'>
                      {method.detail}
                    </Typography>
                  )}
                </Box>
                <Button
                  variant={method.isConfigured ? 'outlined' : 'contained'}
                  size='small'
                  endIcon={
                    method.isConfigured ? (
                      <Settings sx={{ fontSize: 16 }} />
                    ) : (
                      <ArrowForward sx={{ fontSize: 16 }} />
                    )
                  }
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    mt: 0.5,
                  }}
                >
                  {method.isConfigured ? t('auth.mfa.manage') : t('auth.mfa.configure')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Footer */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant='body2' color='text.secondary'>
          {t('auth.mfa.need_help')}{' '}
          <Typography
            component='span'
            variant='body2'
            color='primary'
            sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
          >
            {t('auth.mfa.contact_support')}
          </Typography>{' '}
          {t('auth.common.or')}{' '}
          <Typography
            component='span'
            variant='body2'
            color='primary'
            sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
          >
            {t('auth.mfa.security_guide')}
          </Typography>
          .
        </Typography>
      </Box>
    </Container>
  )
}
