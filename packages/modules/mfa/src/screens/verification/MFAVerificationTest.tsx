import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Button, Typography, TextField, Alert, Link as MuiLink,
  Avatar, alpha, useTheme, Stack,
} from '@mui/material'
import { LockOpen, Lock as LockIcon, ArrowForward } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function MFAVerificationTest() {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const navigate = useNavigate()
  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => { inputRefs.current[0]?.focus() }, [])

  const handleVerify = useCallback((codeString: string) => {
    if (codeString === '123456') {
      setError(null)
      setSuccessMsg(t('mfa.verificationSuccessful', 'Verification successful!'))
      setTimeout(() => navigate('/mfa/backup-codes'), 1500)
    } else {
      setSuccessMsg(null)
      setError(t('mfa.invalidCode', 'Invalid code. Please try again.'))
      setCode(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    }
  }, [navigate, t])

  const handleChange = useCallback((index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setError(null)
    if (value && index < 5) inputRefs.current[index + 1]?.focus()
    if (newCode.every((d) => d !== '') && index === 5) handleVerify(newCode.join(''))
  }, [code, handleVerify])

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) inputRefs.current[index - 1]?.focus()
      else { const n = [...code]; n[index] = ''; setCode(n) }
    } else if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    else if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus()
    else if (e.key === 'Enter' && code.every((d) => d !== '')) handleVerify(code.join(''))
  }, [code, handleVerify])

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setCode(pasted.split(''))
      inputRefs.current[5]?.focus()
      setTimeout(() => handleVerify(pasted), 100)
    }
  }, [handleVerify])

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
          <LockOpen sx={{ fontSize: 32 }} />
        </Avatar>
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
        {t('mfa.title', 'Two-Factor Authentication')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, mb: 4 }}>
        {t('mfa.testDesc', 'Enter the 6-digit code from your authenticator app.')}
      </Typography>

      {successMsg && <Alert severity="success" sx={{ mb: 3, borderRadius: 2, '& .MuiAlert-message': { fontWeight: 600 } }}>{successMsg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2, '& .MuiAlert-message': { fontWeight: 600 } }}>{error}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: { xs: 1, sm: 1.5 }, mb: 4, width: '100%' }}>
        {code.map((digit, index) => (
          <TextField key={index}
            inputRef={(el) => { inputRefs.current[index] = el }}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e as React.KeyboardEvent<HTMLInputElement>)}
            onPaste={index === 0 ? handlePaste : undefined}
            inputProps={{ maxLength: 1, inputMode: 'numeric', pattern: '[0-9]', style: { textAlign: 'center', fontSize: '1.25rem', fontWeight: 500, padding: 0 }, 'aria-label': `Digit ${index + 1}` }}
            sx={{ width: { xs: 40, sm: 48 }, '& .MuiOutlinedInput-root': { height: { xs: 48, sm: 56 }, borderRadius: 2, '&.Mui-focused': { boxShadow: (t) => `0 0 0 4px ${alpha(t.palette.primary.main, 0.1)}` } } }}
            placeholder="-"
          />
        ))}
      </Box>

      <Stack spacing={2}>
        <Button fullWidth variant="contained" onClick={() => handleVerify(code.join(''))}
          disabled={code.some((d) => d === '')} endIcon={<ArrowForward />}
          sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1rem', textTransform: 'none', bgcolor: 'info.main', boxShadow: (t) => `0 4px 14px ${alpha(t.palette.info.main, 0.4)}`, '&:hover': { bgcolor: 'info.dark', transform: 'translateY(-1px)' } }}>
          {t('mfa.buttonVerify', 'Verify Code')}
        </Button>
        <MuiLink component="button" onClick={() => navigate('/mfa/backup-code')}
          sx={{ color: 'text.secondary', fontSize: '0.875rem', fontWeight: 500, textDecoration: 'none', cursor: 'pointer', '&:hover': { color: 'info.main' } }}>
          {t('mfa.tryAnotherMethod', 'Try another method')}
        </MuiLink>
      </Stack>

      <Box sx={{ mt: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.disabled' }}>
        <LockIcon sx={{ fontSize: 13 }} />
        <Typography variant="caption">{t('mfa.securedBy', 'Secured connection')}</Typography>
      </Box>
    </Box>
  )
}
