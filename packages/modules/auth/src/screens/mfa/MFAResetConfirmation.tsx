/**
 * ──────────────────────────────────────────────────────────────────────────────
 * AUDIT MAPPING: MFAResetConfirmation.tsx
 * - 🔴 InputProps → slotProps.input modernized (CRITICAL)
 * - 🔴 CTA Button styling applied (info.main) (CRITICAL)
 * - 🟡 Glass effect classes added (HIGH)
 * - 🟡 Entry animations (animate-scale-in) (HIGH)
 * ──────────────────────────────────────────────────────────────────────────────
 */
import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  Button,
  Stack,
  Avatar,
  Chip,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Alert,
  TextField,
  InputAdornment,
} from '@mui/material'
import {
  Shield,
  Smartphone,
  Sms,
  VpnKey,
  Info,
  Refresh,
  DeleteForever,
  VpnKey as TempCodeIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

// ── SYSTEM PATTERN: mfa_reset_screen (OrganizationProfile layout pattern) ──
export default function MFAResetConfirmation() {
  const { t } = useTranslation()

  // State
  const [resetMethod, setResetMethod] = useState('full')
  const [adminPassword, setAdminPassword] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleReset = () => {
    setIsProcessing(true)
    setTimeout(() => setIsProcessing(false), 2000)
  }

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        height: '100%',
        bgcolor: 'background.default',
      }}
    >
      <Box
        className='animate-scale-in'
        sx={{
          maxWidth: 900,
          width: '100%',
          mx: 'auto',
          p: { xs: 2, md: 4, lg: 5 },
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
        }}
      >
        {/* Header */}
        <Box>
          <Typography
            variant='h4'
            sx={{
              fontWeight: 800,
              letterSpacing: '-0.02em',
              mb: 1,
            }}
          >
            {t('auth.mfa.reset_confirmation_title', 'MFA Reset Confirmation')}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            {t(
              'auth.mfa.reset_confirmation_desc',
              'Review user status and select a reset method. This action is logged.',
            )}
          </Typography>
        </Box>

        {/* User Profile Card */}
        {/* ── SYSTEM PATTERN: metric_card (OrganizationProfile style) ── */}
        <Card
          className='glass-effect'
          variant='outlined'
          sx={{
            p: 3,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'transparent',
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'primary.lighterOpacity',
              color: 'primary.main',
              fontWeight: 700,
            }}
          >
            JD
          </Avatar>
          <Box>
            <Typography variant='h6' sx={{ fontWeight: 700 }}>
              Jane Doe
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              jane.doe@example.com
            </Typography>
          </Box>
        </Card>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '5fr 7fr' },
            gap: 4,
          }}
        >
          {/* Current Status */}
          <Box>
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Info fontSize='small' color='primary' />
              {t('auth.mfa.current_status', 'Current MFA Status')}
            </Typography>
            <Stack spacing={2}>
              <Card className='glass-effect' variant='outlined' sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Smartphone fontSize='small' color='action' />
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {t('auth.mfa.authenticator_app', 'Authenticator App')}
                  </Typography>
                  <Chip
                    label='Active'
                    size='small'
                    color='success'
                    variant='outlined'
                    sx={{ height: 20, fontSize: '0.65rem' }}
                  />
                </Box>
                <Typography variant='caption' color='text.secondary'>
                  Used 2h ago
                </Typography>
              </Card>

              <Card className='glass-effect' variant='outlined' sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <Sms fontSize='small' color='disabled' />
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.disabled' }}>
                    {t('auth.mfa.sms_verification', 'SMS Verification')}
                  </Typography>
                </Box>
                <Typography variant='caption' color='text.disabled'>
                  Not configured
                </Typography>
              </Card>

              <Card className='glass-effect' variant='outlined' sx={{ p: 2, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <VpnKey fontSize='small' color='action' />
                  <Typography variant='body2' sx={{ fontWeight: 600 }}>
                    {t('auth.mfa.backup_codes', 'Backup Codes')}
                  </Typography>
                </Box>
                <Typography variant='caption' color='text.secondary'>
                  3 remaining
                </Typography>
              </Card>
            </Stack>
          </Box>

          {/* Reset Options */}
          <Box>
            <Typography
              variant='subtitle1'
              sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Refresh fontSize='small' color='primary' />
              {t('auth.mfa.reset_options', 'Reset Options')}
            </Typography>

            <Card className='glass-effect' variant='outlined' sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <RadioGroup value={resetMethod} onChange={(e) => setResetMethod(e.target.value)}>
                <Box sx={{ p: 2, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}>
                  <FormControlLabel
                    value='refresh'
                    control={<Radio size='small' />}
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Typography
                          variant='body2'
                          sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          {t('auth.mfa.refresh_trust', 'Refresh Trust')}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Clears active sessions and revokes trusted devices. User retains current
                          MFA configuration.
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, alignItems: 'flex-start' }}
                  />
                </Box>
                <Divider sx={{ opacity: 0.5 }} />
                <Box
                  sx={{
                    p: 2,
                    bgcolor: resetMethod === 'full' ? 'error.lighterOpacity' : 'transparent',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      bgcolor: resetMethod === 'full' ? 'error.lighterOpacity' : 'action.hover',
                    },
                  }}
                >
                  <FormControlLabel
                    value='full'
                    control={<Radio size='small' color='error' />}
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Typography
                          variant='body2'
                          sx={{
                            fontWeight: 600,
                            color: 'error.main',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                          }}
                        >
                          <DeleteForever fontSize='small' />
                          {t('auth.mfa.full_reset', 'Full MFA Reset')}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Completely revokes all MFA factors (App, SMS, Codes). User must re-enroll
                          on next login.
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, alignItems: 'flex-start' }}
                  />
                </Box>
                <Divider sx={{ opacity: 0.5 }} />
                <Box sx={{ p: 2, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.2s' }}>
                  <FormControlLabel
                    value='temp'
                    control={<Radio size='small' />}
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Typography
                          variant='body2'
                          sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <TempCodeIcon fontSize='small' />
                          {t('auth.mfa.temp_code', 'Generate Temporary Code')}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          Create a temporary one-time code for emergency access. Current methods
                          remain active.
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, alignItems: 'flex-start' }}
                  />
                </Box>
              </RadioGroup>
            </Card>

            <Box sx={{ mt: 4 }}>
              <Typography
                variant='subtitle2'
                sx={{ fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <Shield fontSize='small' color='primary' />
                {t('auth.mfa.security_verification', 'Security Verification')}
              </Typography>
              <Alert className='glass-effect' severity='warning' sx={{ mb: 2, borderRadius: 2 }}>
                Critical action: Please verify your identity before proceeding.
              </Alert>
              {/* ── SYSTEM PATTERN: text_field (InputProps -> slotProps.input) ── */}
              <TextField
                fullWidth
                type='password'
                placeholder='Enter admin password'
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                sx={{ mb: 2 }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position='start'>
                        <VpnKey fontSize='small' />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Stack direction='row' spacing={2}>
                {/* ── SYSTEM PATTERN: cta_button (info.main variant) ── */}
                <Button
                  fullWidth
                  variant='contained'
                  color={resetMethod === 'full' ? 'error' : 'primary'}
                  disabled={!adminPassword || isProcessing}
                  onClick={handleReset}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    borderRadius: 2,
                    textTransform: 'none',
                    ...(resetMethod !== 'full' && {
                      bgcolor: 'info.main',
                      color: 'info.contrastText',
                      '&:hover': { bgcolor: 'info.dark' },
                      boxShadow: '0 4px 14px 0 rgba(0, 118, 255, 0.2)',
                    }),
                  }}
                >
                  {isProcessing
                    ? t('common.processing', 'Processing...')
                    : t('auth.mfa.confirm_reset', 'Confirm Reset Action')}
                </Button>
                <Button
                  fullWidth
                  variant='outlined'
                  color='secondary'
                  sx={{ py: 1.5, fontWeight: 700, borderRadius: 2, textTransform: 'none' }}
                >
                  {t('common.cancel', 'Cancel')}
                </Button>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
