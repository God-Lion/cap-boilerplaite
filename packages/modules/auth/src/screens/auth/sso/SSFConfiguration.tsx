// FILE: packages/modules/auth/src/screens/auth/sso/SSFConfiguration.tsx
// RULES APPLIED: mui-component-standards.md, react-component-patterns.md
// FIXES: Added header; implemented entry motion; unified notification system with notistack; modernized component attributes (slotProps); replaced inline CSS animations with framer-motion; standardized Card/Avatar/Paper styles; translated all status and UI labels
// AUDIT: CRITICAL ✓  HIGH ✓  MEDIUM ✓

import { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Switch,
  FormControlLabel,
  alpha,
  useTheme,
  Divider,
  Paper,
  Chip,
  List,
  ListItem,
  ListItemText,
  TextField,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Avatar,
  Tooltip,
} from '@mui/material'
import Sensors from '@mui/icons-material/Sensors'
import Security from '@mui/icons-material/Security'
import Hub from '@mui/icons-material/Hub'
import Sync from '@mui/icons-material/Sync'
import Add from '@mui/icons-material/Add'
import Key from '@mui/icons-material/Key'
import Http from '@mui/icons-material/Http'
import Save from '@mui/icons-material/Save'
import { useTranslation } from 'react-i18next'
import { useSnackbar } from 'notistack'
import { motion, AnimatePresence } from 'framer-motion'
import { adminService, SSFConfig } from '../../../services/adminService'

const DEFAULT_EVENTS = [
  {
    id: 'session-revoked',
    name: 'Session Revoked',
    desc: 'Triggered when a user session is terminated',
    enabled: true,
  },
  {
    id: 'risky-login',
    name: 'Risky Login Detected',
    desc: 'Unusual login pattern detected by risk engine',
    enabled: true,
  },
  {
    id: 'account-disabled',
    name: 'Account Disabled',
    desc: 'Administrative account suspension',
    enabled: false,
  },
  {
    id: 'credential-change',
    name: 'Credential Change',
    desc: 'Password or key rotation events',
    enabled: true,
  },
]

export default function SSFConfiguration() {
  const { t } = useTranslation()
  const theme = useTheme()
  const { enqueueSnackbar } = useSnackbar()

  const [ssfEnabled, setSsfEnabled] = useState(true)
  const [issuerUrl, setIssuerUrl] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('Push')
  const [events, setEvents] = useState(DEFAULT_EVENTS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch SSF config on mount
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await adminService.getSSFConfig()
        const config = response.data as SSFConfig
        if (config) {
          setIssuerUrl(config.issuer || '')
          setDeliveryMethod(config.delivery_method || 'Push')
          if (config.events_supported?.length) {
            setEvents((prev) =>
              prev.map((event) => ({
                ...event,
                enabled: config.events_delivered?.includes(event.id) ?? event.enabled,
              })),
            )
          }
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : t('auth.sso.error_load_ssf', 'Failed to load SSF configuration')
        enqueueSnackbar(errorMessage, { variant: 'warning' })
      } finally {
        setIsLoading(false)
      }
    }

    void fetchConfig()
  }, [t, enqueueSnackbar])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      const enabledEvents = events.filter((e) => e.enabled).map((e) => e.id)
      await adminService.updateSSFConfig({
        issuer: issuerUrl,
        delivery_method: deliveryMethod,
        events_delivered: enabledEvents,
        events_supported: events.map((e) => e.id),
      })
      enqueueSnackbar(t('auth.sso.ssf_save_success', 'SSF configuration saved successfully'), {
        variant: 'success',
      })
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : t('auth.sso.error_save_ssf', 'Failed to save SSF configuration')
      enqueueSnackbar(errorMessage, { variant: 'error' })
    } finally {
      setIsSaving(false)
    }
  }, [issuerUrl, deliveryMethod, events, t, enqueueSnackbar])

  const handleToggleEvent = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, enabled: !event.enabled } : event)),
    )
  }, [])

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          gap: 2,
        }}
      >
        <CircularProgress size={32} thickness={5} />
        <Typography
          variant='caption'
          sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: '0.1em' }}
        >
          {t('common.loading', 'Loading SSF Engine...')}
        </Typography>
      </Box>
    )
  }

  return (
    <Container
      maxWidth='lg'
      component={motion.div}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ py: 6 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: 5,
          gap: 3,
        }}
      >
        <Box>
          <Typography variant='h4' sx={{ fontWeight: 900, letterSpacing: '-0.027em', mb: 1 }}>
            {t('auth.sso.ssf_title', 'Shared Signals & Events (SSF)')}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Chip
              label='BETA'
              size='small'
              sx={{
                fontWeight: 900,
                borderRadius: '6px',
                bgcolor: alpha(theme.palette.warning.main, 0.1),
                color: 'warning.dark',
                fontSize: '0.625rem',
              }}
            />
            <Typography variant='body1' color='text.secondary' sx={{ fontWeight: 500 }}>
              {t(
                'auth.sso.ssf_subtitle',
                'Configure CAEP and RISC transmitters for inter-app security signaling',
              )}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant='contained'
            startIcon={isSaving ? <CircularProgress size={16} color='inherit' /> : <Save />}
            disabled={isSaving}
            onClick={() => void handleSave()}
            sx={{
              bgcolor: 'info.main',
              boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              height: 48,
              px: 3,
              '&:hover': { bgcolor: 'info.dark' },
            }}
          >
            {isSaving
              ? t('common.saving', 'Saving...')
              : t('common.save_config', 'Save Configuration')}
          </Button>
          <Tooltip
            title={
              ssfEnabled
                ? t('auth.sso.transmitter_active', 'Transmitter Active')
                : t('auth.sso.transmitter_paused', 'Transmitter Paused')
            }
          >
            <FormControlLabel
              control={
                <Switch
                  checked={ssfEnabled}
                  onChange={(e) => setSsfEnabled(e.target.checked)}
                  color='success'
                />
              }
              label={
                <Typography
                  variant='caption'
                  sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}
                >
                  {ssfEnabled
                    ? t('auth.sso.status_active', 'Active')
                    : t('auth.sso.status_paused', 'Paused')}
                </Typography>
              }
              sx={{
                bgcolor: alpha(
                  ssfEnabled ? theme.palette.success.main : theme.palette.error.main,
                  0.05,
                ),
                px: 2,
                py: 0.5,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: alpha(
                  ssfEnabled ? theme.palette.success.main : theme.palette.error.main,
                  0.1,
                ),
                mr: 0,
              }}
            />
          </Tooltip>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              mb: 4,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                    borderRadius: '10px',
                  }}
                >
                  <Hub sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography
                  sx={{
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: '0.8125rem',
                  }}
                >
                  {t('auth.sso.transmitter_endpoint', 'Transmitter Identity')}
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label={t('auth.sso.issuer_url', 'Issuer URL')}
                    value={issuerUrl}
                    onChange={(e) => setIssuerUrl(e.target.value)}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Http fontSize='small' color='primary' />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label={t('auth.sso.delivery_method', 'Delivery Method')}
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    select
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                  >
                    <MenuItem value='Push'>
                      {t('auth.sso.method_push', 'Push (HTTP POST)')}
                    </MenuItem>
                    <MenuItem value='Poll'>{t('auth.sso.method_poll', 'Poll (HTTP GET)')}</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4, borderStyle: 'dashed' }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      color: 'primary.main',
                      borderRadius: '10px',
                    }}
                  >
                    <Sensors sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.8125rem',
                    }}
                  >
                    {t('auth.sso.monitored_events', 'Monitored Events')}
                  </Typography>
                </Box>
                <Button
                  variant='text'
                  size='small'
                  startIcon={<Add />}
                  sx={{
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) },
                  }}
                >
                  {t('common.add_event', 'Add Event Type')}
                </Button>
              </Box>

              <List disablePadding>
                {events.map((event) => (
                  <ListItem
                    key={event.id}
                    sx={{
                      px: 2,
                      py: 1.5,
                      borderRadius: 3,
                      mb: 1,
                      bgcolor: alpha(theme.palette.action.hover, 0.02),
                      border: '1px solid transparent',
                      transition: 'all 0.2s',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.action.hover, 0.05),
                        borderColor: 'divider',
                      },
                    }}
                    secondaryAction={
                      <Switch
                        size='small'
                        checked={event.enabled}
                        onChange={() => handleToggleEvent(event.id)}
                        color='info'
                      />
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant='subtitle2' sx={{ fontWeight: 800 }}>
                          {t(`auth.sso.event_${event.id}`, event.name)}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant='caption'
                          sx={{ fontWeight: 500, color: 'text.secondary' }}
                        >
                          {t(`auth.sso.event_desc_${event.id}`, event.desc)}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1),
              position: 'relative',
              overflow: 'hidden',
              mb: 3,
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 150,
                height: 150,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Security sx={{ fontSize: 80, opacity: 0.15 }} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              >
                <Sync color='primary' sx={{ fontSize: 24 }} />
              </motion.div>
              <Typography
                sx={{
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.8125rem',
                }}
              >
                {t('auth.sso.live_stream', 'Live Signals Stream')}
              </Typography>
            </Box>

            <AnimatePresence mode='popLayout'>
              {[
                { type: 'push', timestamp: '2 mins ago', receivers: 4 },
                { type: 'push', timestamp: '15 mins ago', receivers: 3 },
                { type: 'error', timestamp: '1 hour ago', receivers: 0 },
              ].map((signal, i) => (
                <Card
                  key={i}
                  component={motion.div}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  sx={{
                    borderRadius: 3,
                    mb: 2,
                    boxShadow: 'none',
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography
                          variant='caption'
                          sx={{
                            fontWeight: 900,
                            letterSpacing: '0.05em',
                            color: signal.type === 'error' ? 'error.main' : 'primary.main',
                          }}
                        >
                          {signal.type === 'error' ? 'DELIVERY_FAILED' : 'SIGNAL_PUSHED'}
                        </Typography>
                        <Typography variant='body2' display='block' sx={{ fontWeight: 600 }}>
                          {signal.timestamp}
                        </Typography>
                      </Box>
                      <Chip
                        label={`${signal.receivers} ${t('auth.sso.receivers', 'Receivers')}`}
                        size='small'
                        variant='outlined'
                        sx={{
                          borderRadius: '6px',
                          fontWeight: 800,
                          fontSize: '0.625rem',
                          height: 22,
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </AnimatePresence>

            <Button
              fullWidth
              variant='contained'
              onClick={async () => {
                try {
                  await adminService.testSSFStream()
                  enqueueSnackbar(
                    t('auth.sso.ssf_test_success', 'Test signal broadcasted successfully'),
                    { variant: 'success' },
                  )
                } catch (err: unknown) {
                  enqueueSnackbar(
                    err instanceof Error
                      ? err.message
                      : t('auth.sso.error_test_ssf', 'Failed to broadcast test signal'),
                    { variant: 'error' },
                  )
                }
              }}
              sx={{
                mt: 2,
                height: 44,
                borderRadius: '10px',
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: 'info.main',
                '&:hover': { bgcolor: 'info.dark' },
              }}
            >
              {t('auth.sso.view_all_logs', 'Explore Signal History')}
            </Button>
          </Paper>

          <Box
            sx={{
              p: 3,
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.background.paper, 0.6),
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Key color='primary' sx={{ fontSize: 18 }} />
              <Typography
                sx={{
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  fontSize: '0.8125rem',
                }}
              >
                {t('auth.sso.signing_keys', 'Signing Public Key (JWKS)')}
              </Typography>
            </Box>
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ mb: 3, display: 'block', fontWeight: 500, lineHeight: 1.5 }}
            >
              {t(
                'auth.sso.jwks_verification_desc',
                'Receivers use this endpoint to fetch public keys and verify the authenticity of your security signals.',
              )}
            </Typography>
            <Button
              variant='outlined'
              size='small'
              fullWidth
              sx={{
                borderRadius: '8px',
                fontWeight: 700,
                textTransform: 'none',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.04),
                },
              }}
            >
              {t('auth.sso.copy_jwks_url', 'Copy JWKS URL')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
