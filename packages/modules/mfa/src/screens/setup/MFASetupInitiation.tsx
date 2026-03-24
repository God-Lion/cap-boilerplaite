import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, TextField, Typography, Card, CardContent, Alert, Avatar,
  CircularProgress, IconButton, ToggleButton, ToggleButtonGroup, Divider, alpha, useTheme,
} from '@mui/material'
import { PhonelinkLock, ContentCopy, ArrowForward } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTotpEnrollmentOptions, useTotpConfirmEnrollment } from '../../hooks/useMfaQuery'

type MFAMethod = 'totp' | 'sms' | 'email'

interface MFASetupInitiationProps {
  onNext?: () => void
}

export default function MFASetupInitiation({ onNext }: MFASetupInitiationProps) {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const navigate = useNavigate()
  const [mfaMethod, setMfaMethod] = useState<MFAMethod>('totp')
  const [verificationCode, setVerificationCode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleMethodChange = useCallback((_: React.MouseEvent, newMethod: MFAMethod | null) => {
    if (newMethod) setMfaMethod(newMethod)
  }, [])

  const totpConfirmMutation = useTotpConfirmEnrollment({
    onSuccess: () => {
      setError(null)
      if (onNext) onNext()
      else navigate('/account/overview')
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : t('mfa.verificationFailed', 'Verification failed'))
    },
  })

  const totpOptions = useTotpEnrollmentOptions({ enabled: mfaMethod === 'totp' })
  const setupData = mfaMethod === 'totp' ? totpOptions.data?.data : null
  let setupKey = ''
  let qrCodeUrl = ''
  if (mfaMethod === 'totp' && setupData) {
    // @ts-ignore
    setupKey = setupData.manualEntry
    // @ts-ignore
    qrCodeUrl = setupData.qrDataUrl
  }

  const handleCopyKey = useCallback(() => {
    if (setupKey) navigator.clipboard.writeText(setupKey.replace(/\s/g, ''))
  }, [setupKey])

  const handleVerify = useCallback(() => {
    if (verificationCode.length === 6 && setupKey && mfaMethod === 'totp') {
      totpConfirmMutation.mutate({ code: verificationCode })
    }
  }, [verificationCode, setupKey, mfaMethod, totpConfirmMutation])

  return (
    <Box
      className="animate-scale-in"
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      sx={{ width: '100%', maxWidth: 480, mx: 'auto', p: { xs: 3, md: 5 } }}
    >
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Avatar variant="square"
            sx={{ width: 56, height: 56, bgcolor: 'transparent', color: 'primary.main', borderRadius: '24px', border: '2px solid', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
            <PhonelinkLock sx={{ fontSize: 32 }} />
          </Avatar>
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
          {t('mfa.setupHeading', 'Set up two-factor authentication')}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
          {t('mfa.setupDesc', 'Add an extra layer of security to your account.')}
        </Typography>
      </Box>

      <ToggleButtonGroup value={mfaMethod} exclusive onChange={handleMethodChange} fullWidth
        sx={{ bgcolor: 'action.hover', borderRadius: 2, p: 0.75, mb: 3, '& .MuiToggleButtonGroup-grouped': { border: 'none', borderRadius: '8px !important', '&.Mui-selected': { bgcolor: 'background.paper', color: 'primary.main', fontWeight: 600, boxShadow: 1 }, '&:not(.Mui-selected)': { color: 'text.secondary' } } }}>
        <ToggleButton value="totp" sx={{ py: 1, px: 1.5, fontSize: '0.875rem', textTransform: 'none' }}>{t('mfa.methodApp', 'App')}</ToggleButton>
        <ToggleButton value="sms" sx={{ py: 1, px: 1.5, fontSize: '0.875rem', textTransform: 'none' }}>{t('mfa.methodSms', 'SMS')}</ToggleButton>
        <ToggleButton value="email" sx={{ py: 1, px: 1.5, fontSize: '0.875rem', textTransform: 'none' }}>{t('mfa.methodEmail', 'Email')}</ToggleButton>
      </ToggleButtonGroup>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2, '& .MuiAlert-message': { fontWeight: 600 } }}>{error}</Alert>}

      <Card sx={{ borderRadius: 3, border: 1, borderColor: 'divider', mb: 3 }}>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 3 }}>
          {mfaMethod === 'totp' && qrCodeUrl && (
            <>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary' }}>
                {t('mfa.scanQr', 'Scan QR Code')}
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, border: 1, borderColor: 'divider', boxShadow: 1 }}>
                <Box component="img" src={qrCodeUrl} alt="QR Code for MFA setup" sx={{ width: 176, height: 176, borderRadius: 1, display: 'block' }} />
              </Box>
              {setupKey && (
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'action.hover', borderRadius: 2, p: 1.5, px: 2, border: 1, borderColor: 'divider' }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" sx={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'text.secondary', fontWeight: 700, display: 'block', mb: 0.5 }}>
                      {t('mfa.setupKeyLabel', 'Setup key')}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.2em', userSelect: 'all' }}>{setupKey}</Typography>
                  </Box>
                  <IconButton onClick={handleCopyKey} size="small" aria-label="Copy setup key" sx={{ color: 'primary.main', ml: 1 }}>
                    <ContentCopy sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              )}
            </>
          )}
          {(mfaMethod === 'sms' || mfaMethod === 'email') && (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {mfaMethod === 'sms' ? t('mfa.smsComingSoon', 'SMS verification is coming soon.') : t('mfa.emailComingSoon', 'Email verification is coming soon.')}
              </Typography>
              <Typography variant="caption" color="text.disabled">{t('mfa.useAuthenticator', 'Please use an authenticator app for now.')}</Typography>
            </Box>
          )}
          <Divider sx={{ width: '100%' }} />
          <Box sx={{ width: '100%' }}>
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary', display: 'block', textAlign: 'center', mb: 2 }}>
              {t('mfa.enterCode', 'Enter verification code')}
            </Typography>
            <TextField fullWidth value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000 000"
              inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.5em', padding: '12px 16px' } }}
              slotProps={{ input: { sx: { borderRadius: 3 } } }} />
          </Box>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button fullWidth variant="contained" onClick={handleVerify}
          disabled={verificationCode.length !== 6 || !setupKey || mfaMethod !== 'totp' || totpConfirmMutation.isPending}
          endIcon={<ArrowForward />}
          sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1rem', textTransform: 'none', bgcolor: 'info.main', boxShadow: (t) => `0 4px 14px ${alpha(t.palette.info.main, 0.4)}`, '&:hover': { bgcolor: 'info.dark', transform: 'translateY(-1px)' } }}>
          {totpConfirmMutation.isPending ? t('mfa.verifying', 'Verifying...') : t('mfa.verifyEnable', 'Verify & Enable')}
        </Button>
        <Button fullWidth variant="text" onClick={() => navigate(-1)}
          sx={{ textTransform: 'none', color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' } }}>
          {t('common.cancel', 'Cancel')}
        </Button>
      </Box>
    </Box>
  )
}
