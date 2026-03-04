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
  Snackbar,
} from '@mui/material'
import { Sensors, Security, Hub, Sync, Add, Key, Http, Save } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, IStatus } from '@cap/platform-core'
import { adminService, SSFConfig } from '../../../services/adminService'

/** Default events shown when no config is loaded yet */
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

  const [ssfEnabled, setSsfEnabled] = useState(true)
  const [issuerUrl, setIssuerUrl] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('Push')
  const [events, setEvents] = useState(DEFAULT_EVENTS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [status, setStatus] = useState<IStatus>({
    open: false,
    type: '',
    state: '',
    msg: '',
  })

  const handleCloseStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, open: false }))
  }, [])

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
        const errorMessage = err instanceof Error ? err.message : 'Failed to load SSF configuration'
        setStatus({
          open: true,
          type: 'warning',
          state: 'warning',
          msg: errorMessage,
        })
      } finally {
        setIsLoading(false)
      }
    }

    void fetchConfig()
  }, [])

  // Save SSF config
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
      setStatus({
        open: true,
        type: 'success',
        state: 'success',
        msg: t('auth.sso.ssf_save_success', 'SSF configuration saved successfully'),
      })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save SSF configuration'
      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg: errorMessage,
      })
    } finally {
      setIsSaving(false)
    }
  }, [issuerUrl, deliveryMethod, events, t])

  const handleToggleEvent = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === eventId ? { ...event, enabled: !event.enabled } : event)),
    )
  }, [])

  if (isLoading) {
    return (
      <Container maxWidth='lg' sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  return (
    <Container maxWidth='lg' sx={{ py: 6 }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={status.open}
        autoHideDuration={6000}
        onClose={handleCloseStatus}
      >
        <MAlert
          onClose={handleCloseStatus}
          severity={(status.type || 'info') as 'success' | 'error' | 'warning' | 'info'}
          sx={{ width: '100%' }}
        >
          {status.msg}
        </MAlert>
      </Snackbar>

      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}
      >
        <Box>
          <Typography variant='h4' fontWeight={800} gutterBottom>
            {t('auth.sso.ssf_title', 'Shared Signals & Events (SSF)')}
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Chip
              label='BETA'
              size='small'
              sx={{
                fontWeight: 800,
                borderRadius: '6px',
                backgroundColor: alpha(theme.palette.warning.main, 0.1),
                color: 'warning.dark',
              }}
            />
            <Typography variant='body1' color='text.secondary'>
              {t(
                'auth.sso.ssf_subtitle',
                'Configure CAEP and RISC transmitters for inter-app security signaling',
              )}
            </Typography>
          </div>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant='contained'
            startIcon={isSaving ? <CircularProgress size={18} color='inherit' /> : <Save />}
            disabled={isSaving}
            onClick={() => void handleSave()}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 700,
              px: 3,
            }}
          >
            {isSaving
              ? t('common.saving', 'Saving...')
              : t('common.save_config', 'Save Configuration')}
          </Button>
          <FormControlLabel
            control={
              <Switch
                checked={ssfEnabled}
                onChange={(e) => setSsfEnabled(e.target.checked)}
                color='primary'
              />
            }
            label={
              <Typography fontWeight={700}>
                {ssfEnabled ? 'Transmitter Active' : 'Transmitter Paused'}
              </Typography>
            }
            sx={{
              backgroundColor: alpha(
                ssfEnabled ? theme.palette.success.main : theme.palette.error.main,
                0.05,
              ),
              px: 2,
              py: 0.5,
              borderRadius: '12px',
              mr: 0,
              border: `1px solid ${alpha(ssfEnabled ? theme.palette.success.main : theme.palette.divider, 0.1)}`,
            }}
          />
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              borderRadius: '24px',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              mb: 4,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Hub color='primary' />
                <Typography variant='h6' fontWeight={700}>
                  {t('auth.sso.transmitter_endpoint', 'Transmitter Identity')}
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label='Issuer URL'
                    value={issuerUrl}
                    onChange={(e) => setIssuerUrl(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Http fontSize='small' />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: '12px' },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label='Delivery Method'
                    value={deliveryMethod}
                    onChange={(e) => setDeliveryMethod(e.target.value)}
                    select
                    InputProps={{ sx: { borderRadius: '12px' } }}
                  >
                    <MenuItem value='Push'>Push (HTTP POST)</MenuItem>
                    <MenuItem value='Poll'>Poll (HTTP GET)</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Sensors color='primary' />
                  <Typography variant='h6' fontWeight={700}>
                    {t('auth.sso.monitored_events', 'Monitored Events')}
                  </Typography>
                </Box>
                <Button variant='text' size='small' startIcon={<Add />}>
                  {t('common.add_event', 'Add Event Type')}
                </Button>
              </Box>

              <List disablePadding>
                {events.map((event) => (
                  <ListItem
                    key={event.id}
                    sx={{
                      px: 0,
                      py: 2,
                      borderBottom: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                      '&:last-child': { borderBottom: 0 },
                    }}
                    secondaryAction={
                      <Switch
                        size='small'
                        checked={event.enabled}
                        onChange={() => handleToggleEvent(event.id)}
                      />
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant='subtitle2' fontWeight={700}>
                          {event.name}
                        </Typography>
                      }
                      secondary={event.desc}
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
              borderRadius: '24px',
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 120,
                height: 120,
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Security sx={{ fontSize: 60, opacity: 0.2 }} />
            </Box>

            <Typography
              variant='h6'
              fontWeight={800}
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Sync color='primary' sx={{ animation: 'spin 4s linear infinite' }} />
              {t('auth.sso.live_stream', 'Live Signals Stream')}
            </Typography>
            <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
              Recent events broadcasted to receivers.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[
                { type: 'push', timestamp: '2 mins ago', receivers: 4 },
                { type: 'push', timestamp: '15 mins ago', receivers: 3 },
                { type: 'error', timestamp: '1 hour ago', receivers: 0 },
              ].map((signal, i) => (
                <Card
                  key={i}
                  sx={{
                    borderRadius: '12px',
                    border: `1px solid ${alpha(theme.palette.divider, 0.05)}`,
                  }}
                >
                  <CardContent
                    sx={{
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Box>
                      <Typography
                        variant='caption'
                        fontWeight={700}
                        color={signal.type === 'error' ? 'error' : 'primary'}
                      >
                        {signal.type === 'error' ? 'DELIVERY_FAILED' : 'SIGNAL_PUSHED'}
                      </Typography>
                      <Typography variant='body2' display='block'>
                        {signal.timestamp}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${signal.receivers} Receivers`}
                      size='small'
                      variant='outlined'
                      sx={{ borderRadius: '6px', fontSize: '0.65rem' }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Button
              fullWidth
              variant='contained'
              onClick={async () => {
                try {
                  await adminService.testSSFStream()
                  setStatus({
                    open: true,
                    type: 'success',
                    state: 'success',
                    msg: t('auth.sso.ssf_test_success', 'Test signal broadcasted successfully'),
                  })
                } catch (err: unknown) {
                  setStatus({
                    open: true,
                    type: 'error',
                    state: 'error',
                    msg: err instanceof Error ? err.message : 'Failed to broadcast test signal',
                  })
                }
              }}
              sx={{
                mt: 4,
                height: 48,
                borderRadius: '12px',
                fontWeight: 700,
                textTransform: 'none',
              }}
            >
              {t('auth.sso.view_all_logs', 'Explore Signal History')}
            </Button>
          </Paper>

          <Box
            sx={{
              mt: 3,
              p: 3,
              borderRadius: '20px',
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant='subtitle2'
              fontWeight={800}
              gutterBottom
              display='flex'
              alignItems='center'
              gap={1}
            >
              <Key color='primary' fontSize='small' />
              {t('auth.sso.signing_keys', 'Signing Public Key (JWKS)')}
            </Typography>
            <Typography variant='caption' color='text.secondary' sx={{ mb: 2, display: 'block' }}>
              Receivers use this to verify the authenticity of your signals.
            </Typography>
            <Button variant='outlined' size='small' fullWidth sx={{ borderRadius: '8px' }}>
              {t('auth.sso.copy_jwks_url', 'Copy JWKS URL')}
            </Button>
          </Box>
        </Grid>
      </Grid>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Container>
  )
}
