import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  alpha,
  Stack,
  Avatar,
  useTheme,
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
  Shield,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
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
    name: t('mfa.methods.authenticator'),
    label: t('mfa.labels.recommended'),
    labelColor: 'primary',
    description: t('mfa.descriptions.authenticator'),
    detail: t('mfa.details.authenticator'),
    isConfigured: true,
  },
  {
    id: 'sms',
    icon: <Sms />,
    name: t('mfa.methods.sms'),
    label: t('mfa.labels.standard'),
    labelColor: 'info',
    description: t('mfa.descriptions.sms'),
    detail: t('mfa.details.sms'),
    isConfigured: true,
  },
  {
    id: 'email',
    icon: <Email />,
    name: t('mfa.methods.email'),
    label: t('mfa.labels.backup'),
    labelColor: 'warning',
    description: t('mfa.descriptions.email'),
    detail: t('mfa.details.email'),
    isConfigured: true,
  },
  {
    id: 'security_key',
    icon: <UsbOutlined />,
    name: t('mfa.methods.security_key'),
    label: t('mfa.labels.hardware'),
    labelColor: 'default',
    description: t('mfa.descriptions.security_key'),
    detail: t('mfa.details.security_key'),
    isConfigured: false,
  },
  {
    id: 'recovery',
    icon: <Key />,
    name: t('mfa.methods.recovery'),
    label: t('mfa.labels.emergency'),
    labelColor: 'warning',
    description: t('mfa.descriptions.recovery'),
    detail: t('mfa.details.recovery'),
    isConfigured: false,
  },
]

export default function MFADashboard() {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const navigate = useNavigate()
  const [methods] = useState<MfaMethodCard[]>(MOCK_METHODS(t))

  const configuredCount = methods.filter((m) => m.isConfigured).length

  return (
    <Box
      className="animate-scale-in"
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      sx={{
        width: '100%',
        maxWidth: 640,
        mx: 'auto',
        p: { xs: 3, md: 5 },
        position: 'relative',
      }}
    >
      {/* Breadcrumb */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
        >
          {t('common.back', 'Back')}
        </Button>
        <Typography variant="body2" color="text.secondary">/</Typography>
        <Typography variant="body2" color="text.secondary">
          {t('mfa.security', 'Security')}
        </Typography>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar
          variant="square"
          sx={{
            width: 56,
            height: 56,
            bgcolor: 'transparent',
            color: 'primary.main',
            borderRadius: '24px',
            border: '2px solid',
            borderColor: alpha(theme.palette.primary.main, 0.2),
            flexShrink: 0,
          }}
        >
          <Shield sx={{ fontSize: 32 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: '-0.027em' }}>
            {t('mfa.dashboardTitle', 'Two-Factor Authentication')}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, maxWidth: 480 }}>
            {t('mfa.dashboardSubtitle', 'Manage your authentication methods to keep your account secure.')}
          </Typography>
        </Box>
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
        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
          <VerifiedUser sx={{ color: 'success.main', fontSize: 32 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight={700} color="success.dark">
              {t('mfa.securityHigh', 'Security level: High')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('mfa.activeMethodsCount', { count: configuredCount, defaultValue: `${configuredCount} active method(s)` })}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', ml: 1, mb: 2, display: 'block', color: 'text.secondary' }}>
        {t('mfa.configuredMethodsOverview', 'Authentication Methods')}
      </Typography>

      <Grid container spacing={2}>
        {methods.map((method) => (
          <Grid key={method.id} size={{ xs: 12 }}>
            <Card
              sx={{
                borderRadius: 3,
                border: 1,
                borderColor: method.isConfigured ? 'divider' : (theme) => alpha(theme.palette.text.disabled, 0.2),
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  boxShadow: (theme) => `0 0 0 1px ${alpha(theme.palette.primary.main, 0.2)}`,
                },
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, py: 2.5, '&:last-child': { pb: 2.5 } }}>
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
                    <Typography variant="subtitle1" fontWeight={600}>
                      {method.name}
                    </Typography>
                    <Chip
                      label={method.label}
                      size="small"
                      color={method.labelColor as any}
                      variant={method.isConfigured ? 'filled' : 'outlined'}
                      sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600 }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: method.detail ? 0.25 : 0 }}>
                    {method.description}
                  </Typography>
                  {method.detail && (
                    <Typography variant="caption" color="text.disabled">
                      {method.detail}
                    </Typography>
                  )}
                </Box>
                <Button
                  variant={method.isConfigured ? 'outlined' : 'contained'}
                  size="small"
                  endIcon={method.isConfigured ? <Settings sx={{ fontSize: 16 }} /> : <ArrowForward sx={{ fontSize: 16 }} />}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    mt: 0.5,
                    ...(method.isConfigured
                      ? {}
                      : {
                          bgcolor: 'info.main',
                          '&:hover': { bgcolor: 'info.dark' },
                          boxShadow: (theme: any) => `0 4px 14px ${alpha(theme.palette.info.main, 0.3)}`,
                        }),
                  }}
                >
                  {method.isConfigured ? t('mfa.manage', 'Manage') : t('mfa.configure', 'Configure')}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {t('mfa.needHelp', 'Need help?')}{' '}
          <Typography component="span" variant="body2" color="primary" sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}>
            {t('mfa.contactSupport', 'Contact support')}
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}
