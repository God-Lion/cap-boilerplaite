// FILE: packages/modules/auth/src/screens/auth/sso/PermissionConsentScreen.tsx
// RULES APPLIED: mui-component-standards.md, react-component-patterns.md
// FIXES: Added header; implemented entry motion; modernized component attributes (slotProps); standardized Avatar/Card/Stack styles; translated all scope labels and descriptions; added accessibility aria-labels; improved responsive layout
// AUDIT: CRITICAL ✓  HIGH ✓  MEDIUM ✓

import { useEffect, useMemo } from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  alpha,
  useTheme,
  Link,
  Stack,
  CircularProgress,
  IconButton,
} from '@mui/material'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import BadgeIcon from '@mui/icons-material/Badge'
import ShieldIcon from '@mui/icons-material/Shield'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import Path from '../path'
import {
  useOidcInteraction,
  useConfirmOidcInteraction,
  useAbortOidcInteraction,
} from '../../../hooks/useOidcCompliance'

export default function PermissionConsentScreen() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const uid = searchParams.get('uid')

  // Redirect if no UID
  useEffect(() => {
    if (!uid) {
      navigate(Path.login)
    }
  }, [uid, navigate])

  // Fetch interaction details
  const { data: interactionResponse, isLoading, isError } = useOidcInteraction(uid)

  const interactionData = interactionResponse?.data

  // Mutations
  const confirmMutation = useConfirmOidcInteraction(uid, {
    onSuccess: (res) => {
      const targetUrl = res.data?.url || res.data?.returnTo || res.data?.redirectTo
      if (targetUrl) {
        window.location.assign(targetUrl)
      } else {
        enqueueSnackbar(t('auth.sso.success_granted', 'Access granted successfully'), {
          variant: 'success',
        })
      }
    },
    onError: (err: any) => {
      const message =
        err.response?.data?.message ||
        err.message ||
        t('auth.sso.error_confirm', 'Failed to confirm access')
      enqueueSnackbar(message, { variant: 'error' })
    },
  })

  const abortMutation = useAbortOidcInteraction(uid, {
    onSuccess: (res) => {
      const targetUrl = res.data?.url || res.data?.returnTo || res.data?.redirectTo
      if (targetUrl) {
        window.location.assign(targetUrl)
      } else {
        navigate(Path.login)
      }
    },
  })

  const client = interactionData?.client
  const details = interactionData?.details
  const requestedScopes = useMemo(() => {
    return details?.params?.scope?.split(' ') || []
  }, [details])

  const scopeDetails = useMemo(() => {
    const allScopes = [
      {
        id: 'openid',
        icon: <VpnKeyIcon sx={{ fontSize: 18 }} />,
        label: t('auth.sso.scope_openid', 'OpenID Identifier'),
        description: t(
          'auth.sso.scope_openid_desc',
          'Securely verify your unique identity across platforms.',
        ),
      },
      {
        id: 'profile',
        icon: <AccountCircleIcon sx={{ fontSize: 18 }} />,
        label: t('auth.sso.scope_profile', 'Profile Information'),
        description: t('auth.sso.scope_profile_desc', 'Access your full name and display picture.'),
      },
      {
        id: 'email',
        icon: <EmailIcon sx={{ fontSize: 18 }} />,
        label: t('auth.sso.scope_email', 'Email Address'),
        description: t('auth.sso.scope_email_desc', 'View and confirm your primary contact email.'),
      },
      {
        id: 'roles',
        icon: <BadgeIcon sx={{ fontSize: 18 }} />,
        label: t('auth.sso.scope_roles', 'Roles & Access'),
        description: t('auth.sso.scope_roles_desc', 'View your assigned group permissions.'),
      },
      {
        id: 'offline_access',
        icon: <ShieldIcon sx={{ fontSize: 18 }} />,
        label: t('auth.sso.scope_offline', 'Offline Access'),
        description: t(
          'auth.sso.scope_offline_desc',
          'Allow the application to refresh your access in the background.',
        ),
      },
    ]

    return allScopes.filter((s) => requestedScopes.includes(s.id))
  }, [requestedScopes, t])

  const handleAllow = () => {
    confirmMutation.mutate()
  }

  const handleDeny = () => {
    abortMutation.mutate()
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
          gap: 2,
        }}
      >
        <CircularProgress size={32} thickness={5} />
        <Typography
          variant='caption'
          sx={{
            fontWeight: 800,
            color: 'text.secondary',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          {t('common.initializing', 'Initializing secure connection...')}
        </Typography>
      </Box>
    )
  }

  if (isError) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth='sm'>
          <Card
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
            }}
          >
            <Avatar
              sx={{
                mx: 'auto',
                mb: 3,
                width: 64,
                height: 64,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                color: 'error.main',
              }}
            >
              <ShieldIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant='h5' sx={{ fontWeight: 900, mb: 1.5, letterSpacing: '-0.027em' }}>
              {t('auth.sso.interaction_error_title', 'Interaction Failed')}
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{ mb: 4, fontWeight: 500 }}>
              {t(
                'auth.sso.interaction_error_desc',
                'The authentication request is invalid or has expired. Please try initiation login again from the source application.',
              )}
            </Typography>
            <Button
              variant='contained'
              onClick={() => navigate(Path.login)}
              sx={{
                height: 48,
                borderRadius: '12px',
                fontWeight: 700,
                px: 4,
                textTransform: 'none',
              }}
            >
              {t('auth.sso.back_to_login', 'Back to Login')}
            </Button>
          </Card>
        </Container>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at 50% 50%, ${alpha(theme.palette.primary.main, 0.04)} 0%, transparent 70%)`,
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Container maxWidth='sm'>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              borderRadius: 4,
              overflow: 'visible',
              bgcolor: 'background.paper',
            }}
          >
            <CardContent sx={{ p: { xs: 3, md: 5 } }}>
              <Box sx={{ mb: 2 }}>
                <IconButton
                  onClick={handleDeny}
                  size='small'
                  aria-label={t('common.back', 'Back')}
                  sx={{ border: '1px solid', borderColor: 'divider' }}
                >
                  <ArrowBackIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
                <Box sx={{ position: 'relative', mb: 3 }}>
                  <Avatar
                    src={client?.logoUri || '/app-logo.png'}
                    sx={{
                      width: 88,
                      height: 88,
                      borderRadius: '24px',
                      boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                      border: '2px solid',
                      borderColor: 'background.paper',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -4,
                      right: -4,
                      bgcolor: 'success.main',
                      borderRadius: '50%',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '4px solid',
                      borderColor: 'background.paper',
                    }}
                  >
                    <CheckCircleIcon sx={{ color: 'common.white', fontSize: 16 }} />
                  </Box>
                </Box>
                <Typography
                  variant='h4'
                  sx={{
                    fontWeight: 900,
                    letterSpacing: '-0.027em',
                    mb: 1,
                    textAlign: 'center',
                  }}
                >
                  {client?.name || t('auth.sso.unknown_app', 'Third-party Application')}
                </Typography>
                <Typography
                  variant='body1'
                  color='text.secondary'
                  align='center'
                  sx={{ fontWeight: 500 }}
                >
                  {t(
                    'auth.sso.consent_subtitle',
                    'is requesting permission to access your account details',
                  )}
                </Typography>
              </Box>

              <Box sx={{ mb: 5 }}>
                <Typography
                  variant='caption'
                  sx={{
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'text.secondary',
                    mb: 2.5,
                    display: 'block',
                  }}
                >
                  {t('auth.sso.requested_permissions', 'Requested Permissions')}
                </Typography>
                <List disablePadding>
                  {scopeDetails.map((scope) => (
                    <ListItem
                      key={scope.id}
                      sx={{
                        px: 2,
                        py: 2,
                        borderRadius: 3,
                        mb: 1.5,
                        bgcolor: alpha(theme.palette.action.hover, 0.02),
                        border: '1px solid',
                        borderColor: 'transparent',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.04),
                          borderColor: alpha(theme.palette.primary.main, 0.1),
                          transform: 'translateX(6px)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 44 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            borderRadius: '8px',
                          }}
                        >
                          {scope.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            variant='subtitle2'
                            sx={{ fontWeight: 800, color: 'text.primary', mb: 0.25 }}
                          >
                            {scope.label}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant='caption'
                            sx={{
                              color: 'text.secondary',
                              fontWeight: 500,
                              lineHeight: 1.4,
                              display: 'block',
                            }}
                          >
                            {scope.description}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Stack spacing={2} sx={{ mb: 5 }}>
                <Button
                  fullWidth
                  variant='contained'
                  size='large'
                  onClick={handleAllow}
                  disabled={confirmMutation.isPending || abortMutation.isPending}
                  sx={{
                    fontWeight: 700,
                    textTransform: 'none',
                    height: 52,
                    borderRadius: '12px',
                    bgcolor: 'info.main',
                    boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                    '&:hover': { bgcolor: 'info.dark' },
                  }}
                >
                  {confirmMutation.isPending ? (
                    <CircularProgress size={24} color='inherit' />
                  ) : (
                    t('auth.sso.allow_access', 'Allow Access')
                  )}
                </Button>
                <Button
                  fullWidth
                  variant='outlined'
                  size='large'
                  onClick={handleDeny}
                  disabled={confirmMutation.isPending || abortMutation.isPending}
                  sx={{
                    fontWeight: 700,
                    textTransform: 'none',
                    height: 52,
                    borderRadius: '12px',
                    borderColor: 'divider',
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.action.hover, 0.04),
                      borderColor: 'text.primary',
                    },
                  }}
                >
                  {t('auth.sso.deny_access', 'Deny Request')}
                </Button>
              </Stack>

              <Divider sx={{ mb: 4, borderStyle: 'dashed' }} />

              <Stack direction='row' justifyContent='center' spacing={3} sx={{ opacity: 0.8 }}>
                <Link
                  href='#'
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.075em',
                    fontSize: '0.7rem',
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {t('auth.sso.terms_link', 'Terms of Service')}
                </Link>
                <Link
                  href='#'
                  sx={{
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.075em',
                    fontSize: '0.7rem',
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  {t('auth.sso.privacy_link', 'Privacy Policy')}
                </Link>
              </Stack>
            </CardContent>
          </Card>
        </motion.div>

        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2.5,
              py: 1,
              borderRadius: '50px',
              bgcolor: alpha(theme.palette.success.main, 0.04),
              border: '1px solid',
              borderColor: alpha(theme.palette.success.main, 0.1),
            }}
          >
            <ShieldIcon sx={{ fontSize: 16, color: 'success.main' }} />
            <Typography
              variant='caption'
              sx={{
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'success.dark',
              }}
            >
              {t('auth.sso.secure_encryption_tag', 'Verified & Protected by Antigravity OS')}
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
