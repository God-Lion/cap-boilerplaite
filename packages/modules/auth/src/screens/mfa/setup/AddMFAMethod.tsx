import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Typography, Card, CardContent, Radio, RadioGroup, FormControlLabel,
  TextField, Stepper, Step, StepLabel, alpha, Divider, CircularProgress, Alert, Avatar, useTheme,
} from '@mui/material'
import {
  Smartphone, Sms, Email, UsbOutlined, Key, ArrowBack, ArrowForward, Shield, Lock,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTotpEnrollmentOptions, useTotpConfirmEnrollment } from '../../../hooks/useAuthQuery'

const MFA_METHODS = [
  { value: 'authenticator', icon: <Smartphone />, label: 'Authenticator App', description: 'Use Google Authenticator, Authy, or 1Password.' },
  { value: 'sms', icon: <Sms />, label: 'SMS / Text Message', description: 'Receive a verification code via text message.' },
  { value: 'email', icon: <Email />, label: 'Email Verification', description: 'Receive a link or code to your registered email.' },
  { value: 'security_key', icon: <UsbOutlined />, label: 'Security Key', description: 'Use a hardware key like YubiKey.' },
  { value: 'backup_codes', icon: <Key />, label: 'Backup Codes', description: 'Generate recovery codes for emergencies.' },
]
const STEPS = ['Select Method', 'Setup']

export default function AddMFAMethod() {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [selectedMethod, setSelectedMethod] = useState('authenticator')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const totpOptions = useTotpEnrollmentOptions({ enabled: activeStep === 1 && selectedMethod === 'authenticator' })

  const totpConfirmMutation = useTotpConfirmEnrollment({
    onSuccess: () => {
      setSuccessMsg(t('mfa.setupSuccessful', 'MFA enabled successfully!'))
      setTimeout(() => navigate(-1), 1500)
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : t('mfa.verificationFailed', 'Verification failed'))
    },
  })

  const enrollmentData = totpOptions.data?.data as { qrDataUrl?: string; manualEntry?: string } | undefined
  const qrCodeUrl = enrollmentData?.qrDataUrl ?? ''
  const manualKey = enrollmentData?.manualEntry ?? ''

  const handleNext = useCallback(() => { if (activeStep < STEPS.length - 1) setActiveStep((p) => p + 1) }, [activeStep])
  const handleBack = useCallback(() => { if (activeStep > 0) setActiveStep((p) => p - 1); else navigate(-1) }, [activeStep, navigate])
  const handleCompleteSetup = useCallback(() => { if (verificationCode.length === 6) totpConfirmMutation.mutate({ code: verificationCode }) }, [verificationCode, totpConfirmMutation])

  return (
    <Box
      className="animate-scale-in"
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      sx={{ width: '100%', maxWidth: 560, mx: 'auto', p: { xs: 3, md: 5 } }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)}
          sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 500 }}>
          {t('common.back', 'Back')}
        </Button>
        <Typography variant="body2" color="text.secondary">/</Typography>
        <Typography variant="body2" color="text.secondary">{t('mfa.security', 'Security')}</Typography>
      </Box>

      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Avatar variant="square"
            sx={{ width: 56, height: 56, bgcolor: 'transparent', color: 'primary.main', borderRadius: '24px', border: '2px solid', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
            <Shield sx={{ fontSize: 32 }} />
          </Avatar>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
          {t('mfa.secureAccount', 'Secure Your Account')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          {t('mfa.chooseMethod', 'Choose an authentication method to enhance your account security.')}
        </Typography>
      </Box>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {STEPS.map((label) => (<Step key={label}><StepLabel>{label}</StepLabel></Step>))}
      </Stepper>

      {successMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: 2, '& .MuiAlert-message': { fontWeight: 600 } }}>{successMsg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2, '& .MuiAlert-message': { fontWeight: 600 } }}>{error}</Alert>}

      {activeStep === 0 && (
        <Card sx={{ borderRadius: 3, border: 1, borderColor: 'divider' }}>
          <CardContent sx={{ p: 0 }}>
            <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary' }}>
                {t('mfa.step1Title', 'Select Method')}
              </Typography>
            </Box>
            <RadioGroup value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
              {MFA_METHODS.map((method, index) => (
                <Box key={method.value}>
                  <FormControlLabel value={method.value} control={<Radio sx={{ ml: 2 }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1.5 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: (t) => selectedMethod === method.value ? alpha(t.palette.primary.main, 0.1) : 'action.hover', display: 'flex', alignItems: 'center', justifyContent: 'center', '& .MuiSvgIcon-root': { fontSize: 20, color: selectedMethod === method.value ? 'primary.main' : 'text.secondary' } }}>
                          {method.icon}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>{method.label}</Typography>
                          <Typography variant="caption" color="text.secondary">{method.description}</Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ mx: 0, px: 1, borderBottom: index < MFA_METHODS.length - 1 ? 1 : 0, borderColor: 'divider', '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s' }}
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
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 3 }}>
              {t('mfa.step2Title', 'Setup Authenticator App')}
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>{t('mfa.scanQrStep', '1. Scan QR Code')}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{t('mfa.scanQrInstruction', 'Open your authenticator app and scan the image below.')}</Typography>
              <Box sx={{ width: 200, height: 200, mx: 'auto', borderRadius: 3, bgcolor: 'action.hover', border: 2, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {totpOptions.isLoading ? <CircularProgress size={40} /> : qrCodeUrl ? <Box component="img" src={qrCodeUrl} alt="QR Code" sx={{ width: 176, height: 176, borderRadius: 1, display: 'block' }} /> : <Typography variant="caption" color="text.disabled">{t('mfa.qrUnavailable', 'QR code unavailable')}</Typography>}
              </Box>
              {manualKey && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>{t('mfa.manualKeyLabel', 'Manual entry key:')}</Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.15em', userSelect: 'all' }}>{manualKey}</Typography>
                </Box>
              )}
            </Box>
            <Divider sx={{ my: 3 }} />
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', display: 'block', mb: 2 }}>
                {t('mfa.verifySetupStep', '2. Verify Setup')}
              </Typography>
              <TextField fullWidth value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.3em' } }}
                slotProps={{ input: { sx: { borderRadius: 3, bgcolor: 'action.hover' } } }} />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', textAlign: 'center' }}>
                {t('mfa.codeRefreshes', 'The code refreshes every 30 seconds.')}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={handleBack} sx={{ textTransform: 'none', fontWeight: 600 }}>
          {activeStep === 0 ? t('common.cancel', 'Cancel') : t('common.back', 'Back')}
        </Button>
        <Button variant="contained"
          onClick={activeStep === 1 ? handleCompleteSetup : handleNext}
          endIcon={activeStep === 1 ? undefined : <ArrowForward />}
          disabled={(activeStep === 1 && (verificationCode.length < 6 || totpConfirmMutation.isPending)) || (activeStep === 0 && selectedMethod !== 'authenticator')}
          sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2, px: 4, bgcolor: 'info.main', '&:hover': { bgcolor: 'info.dark' }, boxShadow: (t) => `0 4px 14px ${alpha(t.palette.info.main, 0.3)}` }}>
          {activeStep === 1 ? (totpConfirmMutation.isPending ? t('mfa.verifying', 'Verifying...') : t('mfa.completeSetup', 'Complete Setup')) : t('common.continue', 'Continue')}
        </Button>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="caption" color="text.disabled" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
          <Lock sx={{ fontSize: 12 }} />
          {t('mfa.securityPriority', 'Your security is our priority. All data is encrypted.')}
        </Typography>
      </Box>
    </Box>
  )
}
