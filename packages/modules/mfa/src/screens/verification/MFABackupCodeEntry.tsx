import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Typography, TextField, Link as MuiLink,
  CircularProgress, Alert, Avatar, alpha, useTheme,
} from '@mui/material'
import { Key, ArrowForward, PhonelinkLock } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function MFABackupCodeEntry() {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const navigate = useNavigate()
  const [backupCode, setBackupCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = useCallback(() => {
    if (backupCode.length < 8) return
    setIsVerifying(true)
    setError(null)
    setTimeout(() => setIsVerifying(false), 1500)
  }, [backupCode])

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)
    setBackupCode(value)
    setError(null)
  }, [])

  return (
    <Box
      className="animate-scale-in"
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      sx={{ width: '100%', maxWidth: 440, mx: 'auto', p: { xs: 3, md: 5 }, textAlign: 'center' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Avatar variant="square"
          sx={{ width: 56, height: 56, bgcolor: 'transparent', color: 'primary.main', borderRadius: '24px', border: '2px solid', borderColor: alpha(theme.palette.primary.main, 0.2) }}>
          <Key sx={{ fontSize: 32 }} />
        </Avatar>
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
        {t('mfa.backupCodeEntryTitle', 'Enter Backup Code')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, mb: 4, lineHeight: 1.6 }}>
        {t('mfa.backupCodeEntryDescription', 'Enter one of your 8-character recovery codes to verify your identity.')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2, textAlign: 'left', '& .MuiAlert-message': { fontWeight: 600 } }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', ml: 1, mb: 1, display: 'block', color: 'text.secondary', textAlign: 'left' }}>
          {t('mfa.backupCodeLabel', 'Recovery Code')}
        </Typography>
        <TextField fullWidth value={backupCode} onChange={handleCodeChange} placeholder="XXXX-XXXX"
          autoFocus
          inputProps={{ maxLength: 8, style: { textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.15em', fontFamily: 'monospace' } }}
          slotProps={{ input: { sx: { borderRadius: 3, bgcolor: alpha(theme.palette.background.paper, 0.6) } } }} />
      </Box>

      <Button fullWidth variant="contained" size="large" onClick={handleVerify}
        disabled={backupCode.length < 8 || isVerifying}
        endIcon={isVerifying ? <CircularProgress size={18} color="inherit" /> : <ArrowForward />}
        sx={{ py: 1.5, mb: 3, borderRadius: 3, fontWeight: 800, fontSize: '1rem', textTransform: 'none', bgcolor: 'info.main', boxShadow: (t) => `0 4px 14px ${alpha(t.palette.info.main, 0.4)}`, '&:hover': { bgcolor: 'info.dark', transform: 'translateY(-1px)' } }}>
        {isVerifying ? t('mfa.verifying', 'Verifying...') : t('mfa.verifySignIn', 'Verify & Sign In')}
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <MuiLink component="button" variant="body2" onClick={() => navigate(-1)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'info.main', fontWeight: 600, textDecoration: 'none', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
          <PhonelinkLock sx={{ fontSize: 16 }} />
          {t('mfa.useAuthenticatorInstead', 'Use authenticator app instead')}
        </MuiLink>
        <MuiLink component="button" variant="body2"
          sx={{ color: 'text.secondary', fontWeight: 500, textDecoration: 'none', cursor: 'pointer', '&:hover': { textDecoration: 'underline', color: 'text.primary' } }}>
          {t('mfa.lostBackupCodes', 'I lost my backup codes')}
        </MuiLink>
      </Box>
    </Box>
  )
}
