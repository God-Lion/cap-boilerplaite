import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Snackbar,
  Backdrop,
  CircularProgress,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
} from '@mui/material'
import { PhonelinkLock, ContentCopy, ArrowForward } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, themeConfig, IStatus } from '@cap/platform-core'
import { useTotpEnrollmentOptions, useTotpConfirmEnrollment } from '../../hooks/useAuthQuery'
import Path from '../path'

type MFAMethod = 'totp' | 'sms' | 'email'

interface MFASetupInitiationV2Props {
  onNext?: () => void
}

/**
 * MFASetupInitiationV2 - Enhanced Two-Factor Authentication Setup Screen
 *
 * Features:
 * - Responsive sidebar navigation (desktop) and drawer (mobile)
 * - Toggle between App/SMS/Email MFA methods
 * - QR code display for authenticator apps
 * - Manual setup key with copy functionality
 * - 6-digit verification code input
 * - Light/Dark mode support via MUI theme
 */
export default function MFASetupInitiation({ onNext }: MFASetupInitiationV2Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mfaMethod, setMfaMethod] = useState<MFAMethod>('totp')
  const [verificationCode, setVerificationCode] = useState('')

  const [status, setStatus] = useState<IStatus>({
    open: false,
    type: '',
    state: '',
    msg: '',
  })

  const handleCloseStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, open: false }))
  }, [])

  const handleMethodChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newMethod: MFAMethod | null) => {
      if (newMethod) {
        setMfaMethod(newMethod)
      }
    },
    [],
  )

  const verifySuccess = useCallback(() => {
    setStatus({
      open: true,
      type: 'success',
      state: 'success',
      msg: t('auth.mfa.setup_successful'),
    })
    setTimeout(() => {
      if (onNext) onNext()
      else navigate(Path.account.overview)
    }, 1500)
  }, [navigate, onNext, t])

  const verifyError = useCallback(
    (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : t('auth.mfa.verification_failed')
      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg: errorMessage,
      })
    },
    [t],
  )

  // TOTP v2 confirm mutation (unified enrollment path)
  const totpConfirmMutation = useTotpConfirmEnrollment({
    onSuccess: verifySuccess,
    onError: verifyError,
  })

  // TOTP v2 options query — fetches QR code and manual key
  const totpOptions = useTotpEnrollmentOptions({
    enabled: mfaMethod === 'totp',
  })

  const setupData = mfaMethod === 'totp' ? totpOptions.data?.data : null

  // Type narrowing for manual key and QR code (TOTP v2 only)
  let setupKey = ''
  let qrCodeUrl = ''

  if (mfaMethod === 'totp' && setupData && 'manualEntry' in setupData) {
    setupKey = (setupData as { manualEntry: string; qrDataUrl: string }).manualEntry
    qrCodeUrl = (setupData as { manualEntry: string; qrDataUrl: string }).qrDataUrl
  }

  const handleCopyKey = useCallback(() => {
    if (setupKey) {
      navigator.clipboard.writeText(setupKey.replace(/\s/g, ''))
      setStatus({
        open: true,
        type: 'info',
        state: 'info',
        msg: t('auth.mfa.key_copied'),
      })
    }
  }, [setupKey, t])

  const handleVerify = useCallback(() => {
    if (verificationCode.length === 6 && setupKey && mfaMethod === 'totp') {
      totpConfirmMutation.mutate({ code: verificationCode })
    }
  }, [verificationCode, setupKey, mfaMethod, totpConfirmMutation])

  return (
    <>
      <title>
        {t('auth.mfa.setup_title')} - {themeConfig.templateName}
      </title>

      <Box
        component='main'
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          p: { xs: 2, md: 4 },
          bgcolor: 'background.default',
        }}
      >
        <Backdrop
          open={totpOptions.isLoading || totpConfirmMutation.isPending}
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={status.open}
          autoHideDuration={6000}
          onClose={handleCloseStatus}
        >
          <MAlert onClose={handleCloseStatus} severity={status.type as any} sx={{ width: '100%' }}>
            {status.msg}
          </MAlert>
        </Snackbar>

        <Card
          sx={{
            width: '100%',
            maxWidth: 480,
            borderRadius: 1,
            boxShadow: 3,
            border: 1,
            borderColor: 'divider',
            mt: { xs: 2, md: 5 },
            mb: 4,
            animation: 'fadeInUp 0.4s ease-out',
            '@keyframes fadeInUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Header Section */}
            <Box
              sx={{
                px: { xs: 3, md: 4 },
                pt: { xs: 3, md: 4 },
                pb: 1,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  mx: 'auto',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.5,
                  opacity: 0.1,
                }}
              >
                <PhonelinkLock sx={{ fontSize: 32 }} />
              </Box>
              <Typography
                variant='h5'
                sx={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  mb: 1,
                  letterSpacing: '-0.025em',
                }}
              >
                {t('auth.mfa.setup_heading')}
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  fontSize: '0.875rem',
                  color: 'text.secondary',
                  maxWidth: '90%',
                  mx: 'auto',
                  lineHeight: 1.5,
                }}
              >
                {t('auth.mfa.setup_desc')}
              </Typography>
            </Box>

            {/* Method Selector */}
            <Box sx={{ px: { xs: 3, md: 4 }, py: 2 }}>
              <ToggleButtonGroup
                value={mfaMethod}
                exclusive
                onChange={handleMethodChange}
                fullWidth
                sx={{
                  bgcolor: 'action.hover',
                  borderRadius: 1,
                  p: 0.75,
                  border: 'none',
                  '& .MuiToggleButtonGroup-grouped': {
                    border: 'none',
                    borderRadius: '8px !important',
                    mx: 0,
                    '&.Mui-selected': {
                      bgcolor: 'background.paper',
                      color: 'primary.main',
                      fontWeight: 600,
                      boxShadow: 1,
                      '&:hover': {
                        bgcolor: 'background.paper',
                      },
                    },
                    '&:not(.Mui-selected)': {
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    },
                  },
                }}
              >
                <ToggleButton value='totp' sx={{ py: 1, px: 1.5, fontSize: '0.875rem' }}>
                  {t('auth.mfa.method_app')}
                </ToggleButton>
                <ToggleButton value='sms' sx={{ py: 1, px: 1.5, fontSize: '0.875rem' }}>
                  {t('auth.mfa.method_sms')}
                </ToggleButton>
                <ToggleButton value='email' sx={{ py: 1, px: 1.5, fontSize: '0.875rem' }}>
                  {t('auth.mfa.method_email')}
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Content Section */}
            <Box
              sx={{
                px: { xs: 3, md: 4 },
                pb: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
              }}
            >
              {/* Logic for TOTP (App) */}
              {mfaMethod === 'totp' && qrCodeUrl && (
                <>
                  <Typography
                    variant='body2'
                    sx={{
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      color: 'text.primary',
                    }}
                  >
                    {t('auth.mfa.scan_qr')}
                  </Typography>

                  {/* QR Code */}
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: 'background.paper',
                      borderRadius: 2,
                      border: 1,
                      borderColor: 'divider',
                      boxShadow: 1,
                    }}
                  >
                    <Box
                      component='img'
                      src={qrCodeUrl}
                      alt='QR Code for MFA setup'
                      sx={{
                        width: 176,
                        height: 176,
                        borderRadius: 1,
                        display: 'block',
                      }}
                    />
                  </Box>

                  {/* Setup Key */}
                  {setupKey && (
                    <Box sx={{ width: '100%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                          p: 1.5,
                          px: 2,
                          border: 1,
                          borderColor: 'divider',
                          transition: 'border-color 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            borderOpacity: 0.3,
                          },
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant='caption'
                            sx={{
                              fontSize: '0.6875rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              color: 'text.secondary',
                              fontWeight: 700,
                              display: 'block',
                              mb: 0.5,
                            }}
                          >
                            {t('auth.mfa.setup_key_label')}
                          </Typography>
                          <Typography
                            variant='body2'
                            sx={{
                              fontSize: '0.875rem',
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              letterSpacing: '0.2em',
                              userSelect: 'all',
                            }}
                          >
                            {setupKey}
                          </Typography>
                        </Box>
                        <IconButton
                          onClick={handleCopyKey}
                          size='small'
                          aria-label='Copy setup key'
                          sx={{
                            color: 'primary.main',
                            ml: 1,
                            '&:hover': {
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              opacity: 0.1,
                            },
                          }}
                        >
                          <ContentCopy sx={{ fontSize: 20 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  )}
                </>
              )}

              {/* SMS/Email — Coming Soon */}
              {(mfaMethod === 'sms' || mfaMethod === 'email') && (
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    {mfaMethod === 'sms'
                      ? t('auth.mfa.sms_coming_soon', 'SMS verification is coming soon.')
                      : t('auth.mfa.email_coming_soon', 'Email verification is coming soon.')}
                  </Typography>
                  <Typography variant='caption' color='text.disabled'>
                    {t('auth.mfa.use_authenticator', 'Please use an authenticator app for now.')}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ width: '100%' }} />

              {/* Verification Input */}
              <Box sx={{ width: '100%' }}>
                <Typography
                  component='label'
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    mb: 1.5,
                  }}
                >
                  {t('auth.mfa.enter_code')}
                </Typography>
                <TextField
                  fullWidth
                  value={verificationCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6)
                    setVerificationCode(val)
                  }}
                  placeholder='000 000'
                  inputProps={{
                    maxLength: 6,
                    style: {
                      textAlign: 'center',
                      fontSize: '1.5rem',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '0.5em',
                      padding: '12px 16px',
                    },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      boxShadow: 1,
                    },
                  }}
                />
              </Box>

              {/* Action Buttons */}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  mt: 1,
                }}
              >
                <Button
                  fullWidth
                  variant='contained'
                  onClick={handleVerify}
                  disabled={
                    verificationCode.length !== 6 ||
                    !setupKey ||
                    mfaMethod !== 'totp' ||
                    totpConfirmMutation.isPending
                  }
                  endIcon={<ArrowForward />}
                  sx={{
                    height: 48,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: 1,
                    '&:hover': {
                      boxShadow: 3,
                    },
                    '&:active': {
                      transform: 'scale(0.98)',
                    },
                  }}
                >
                  {totpConfirmMutation.isPending
                    ? t('auth.mfa.verifying')
                    : t('auth.mfa.verify_enable')}
                </Button>

                <Button
                  fullWidth
                  variant='text'
                  onClick={() => navigate(-1)}
                  sx={{
                    textTransform: 'none',
                    color: 'text.secondary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {t('auth.common.cancel')}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
