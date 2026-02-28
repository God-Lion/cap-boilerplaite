import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Stepper,
  Step,
  StepLabel,
  alpha,
  Divider,
  CircularProgress,
  Snackbar,
} from '@mui/material'
import {
  Smartphone,
  Sms,
  Email,
  UsbOutlined,
  Key,
  ArrowBack,
  ArrowForward,
  Shield,
  Lock,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, IStatus } from '@cap/platform-core'
import { useTotpEnrollmentOptions, useTotpConfirmEnrollment } from '../../hooks/useAuthQuery'

const MFA_METHODS = [
  {
    value: 'authenticator',
    icon: <Smartphone />,
    label: 'Authenticator App',
    description: 'Use Google Authenticator, Authy, or 1Password.',
  },
  {
    value: 'sms',
    icon: <Sms />,
    label: 'SMS / Text Message',
    description: 'Receive a verification code via text message.',
  },
  {
    value: 'email',
    icon: <Email />,
    label: 'Email Verification',
    description: 'Receive a link or code to your registered email.',
  },
  {
    value: 'security_key',
    icon: <UsbOutlined />,
    label: 'Security Key',
    description: 'Use a hardware key like YubiKey.',
  },
  {
    value: 'backup_codes',
    icon: <Key />,
    label: 'Backup Codes',
    description: 'Generate recovery codes for emergencies.',
  },
]

const STEPS = ['Select Method', 'Setup']

export default function AddMFAMethod() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [selectedMethod, setSelectedMethod] = useState('authenticator')
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

  // TOTP v2 enrollment — fetches QR code and manual key
  const totpOptions = useTotpEnrollmentOptions({
    enabled: activeStep === 1 && selectedMethod === 'authenticator',
  })

  // TOTP v2 confirm enrollment mutation
  const totpConfirmMutation = useTotpConfirmEnrollment({
    onSuccess: () => {
      setStatus({
        open: true,
        type: 'success',
        state: 'success',
        msg: t('auth.mfa.setup_successful', 'MFA enabled successfully!'),
      })
      setTimeout(() => navigate(-1), 1500)
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : t('auth.mfa.verification_failed', 'Verification failed')
      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg: errorMessage,
      })
    },
  })

  // Extract QR code and manual entry key from TOTP options
  const enrollmentData = totpOptions.data?.data as
    | { qrDataUrl?: string; manualEntry?: string }
    | undefined
  const qrCodeUrl = enrollmentData?.qrDataUrl ?? ''
  const manualKey = enrollmentData?.manualEntry ?? ''

  const handleNext = useCallback(() => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep((prev) => prev + 1)
    }
  }, [activeStep])

  const handleBack = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1)
    } else {
      navigate(-1)
    }
  }, [activeStep, navigate])

  const handleCompleteSetup = useCallback(() => {
    if (verificationCode.length === 6) {
      totpConfirmMutation.mutate({ code: verificationCode })
    }
  }, [verificationCode, totpConfirmMutation])

  return (
    <Container maxWidth='sm' sx={{ py: 4 }}>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={status.open}
        autoHideDuration={6000}
        onClose={handleCloseStatus}
      >
        <MAlert
          onClose={handleCloseStatus}
          severity={(status.type || 'info') as 'success' | 'error' | 'info'}
          sx={{ width: '100%' }}
        >
          {status.msg}
        </MAlert>
      </Snackbar>

      {/* Breadcrumb */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}
        >
          {t('common.back', 'Back')}
        </Button>
        <Typography variant='body2' color='text.secondary'>
          /
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {t('auth.mfa.security', 'Security')}
        </Typography>
      </Box>

      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 3,
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <Shield sx={{ fontSize: 28, color: 'primary.main' }} />
        </Box>
        <Typography variant='h5' fontWeight={700} letterSpacing='-0.02em' sx={{ mb: 0.5 }}>
          {t('auth.mfa.secure_account', 'Secure Your Account')}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {t(
            'auth.mfa.choose_method',
            'Choose a new authentication method to enhance your account security.',
          )}
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>
              {t(`auth.mfa.step_${label.toLowerCase().replace(' ', '_')}`, label)}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      {activeStep === 0 && (
        <Card sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant='subtitle1' fontWeight={600}>
                {t('auth.mfa.step_1_title', '1. Select Method')}
              </Typography>
            </Box>
            <RadioGroup value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
              {MFA_METHODS.map((method, index) => (
                <Box key={method.value}>
                  <FormControlLabel
                    value={method.value}
                    control={<Radio sx={{ ml: 2 }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: (theme) =>
                              selectedMethod === method.value
                                ? alpha(theme.palette.primary.main, 0.1)
                                : 'action.hover',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '& .MuiSvgIcon-root': {
                              fontSize: 20,
                              color:
                                selectedMethod === method.value ? 'primary.main' : 'text.secondary',
                            },
                          }}
                        >
                          {method.icon}
                        </Box>
                        <Box>
                          <Typography variant='subtitle2' fontWeight={600}>
                            {method.label}
                          </Typography>
                          <Typography variant='caption' color='text.secondary'>
                            {method.description}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{
                      mx: 0,
                      px: 1,
                      borderBottom: index < MFA_METHODS.length - 1 ? 1 : 0,
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'action.hover' },
                      transition: 'background-color 0.15s',
                    }}
                  />
                </Box>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      {activeStep === 1 && (
        <Card sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
          <CardContent>
            <Typography variant='subtitle1' fontWeight={600} sx={{ mb: 3 }}>
              {t('auth.mfa.step_2_title', '2. Setup Authenticator App')}
            </Typography>

            {/* QR Code Step */}
            <Box sx={{ mb: 4 }}>
              <Typography variant='subtitle2' fontWeight={600} sx={{ mb: 1 }}>
                {t('auth.mfa.scan_qr_step', '1. Scan QR Code')}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                {t(
                  'auth.mfa.scan_qr_instruction',
                  'Open your authenticator app and scan the image below.',
                )}
              </Typography>
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  mx: 'auto',
                  borderRadius: 3,
                  bgcolor: 'action.hover',
                  border: 2,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {totpOptions.isLoading ? (
                  <CircularProgress size={40} />
                ) : qrCodeUrl ? (
                  <Box
                    component='img'
                    src={qrCodeUrl}
                    alt='QR Code for MFA setup'
                    sx={{ width: 176, height: 176, borderRadius: 1, display: 'block' }}
                  />
                ) : (
                  <Typography variant='caption' color='text.disabled'>
                    {t('auth.mfa.qr_unavailable', 'QR code unavailable')}
                  </Typography>
                )}
              </Box>
              {manualKey && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    {t('auth.mfa.manual_key_label', 'Manual entry key:')}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      userSelect: 'all',
                    }}
                  >
                    {manualKey}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Verify Step */}
            <Box>
              <Typography variant='subtitle2' fontWeight={600} sx={{ mb: 1 }}>
                {t('auth.mfa.verify_setup_step', '2. Verify Setup')}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                {t(
                  'auth.mfa.verify_setup_instruction',
                  'Enter the 6-digit code generated by your app to confirm setup.',
                )}
              </Typography>
              <TextField
                fullWidth
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder='000000'
                inputProps={{
                  maxLength: 6,
                  style: {
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    letterSpacing: '0.3em',
                  },
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                  },
                }}
              />
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ mt: 1, display: 'block', textAlign: 'center' }}
              >
                {t('auth.mfa.code_refreshes', 'The code refreshes every 30 seconds.')}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={handleBack} sx={{ textTransform: 'none', fontWeight: 600 }}>
          {activeStep === 0 ? t('common.cancel', 'Cancel') : t('common.back', 'Back')}
        </Button>
        <Button
          variant='contained'
          onClick={activeStep === 1 ? handleCompleteSetup : handleNext}
          endIcon={activeStep === 1 ? undefined : <ArrowForward />}
          disabled={
            (activeStep === 1 && (verificationCode.length < 6 || totpConfirmMutation.isPending)) ||
            (activeStep === 0 && selectedMethod !== 'authenticator')
          }
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 2,
            px: 4,
          }}
        >
          {activeStep === 1
            ? totpConfirmMutation.isPending
              ? t('auth.mfa.verifying', 'Verifying...')
              : t('auth.mfa.complete_setup', 'Complete Setup')
            : t('common.continue', 'Continue')}
        </Button>
      </Box>

      {/* Security Footer */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography
          variant='caption'
          color='text.disabled'
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
        >
          <Lock sx={{ fontSize: 12 }} />
          {t('auth.mfa.security_priority', 'Your security is our priority. All data is encrypted.')}
        </Typography>
      </Box>
    </Container>
  )
}
