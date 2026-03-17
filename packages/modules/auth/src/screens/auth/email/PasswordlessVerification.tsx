import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, CircularProgress, Button, Avatar, alpha, useTheme,
} from '@mui/material'
import { Login, ErrorOutline, CheckCircleOutline, ArrowForward } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Path from '../path'

export default function PasswordlessVerification() {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(token ? 'verifying' : 'error')

  useEffect(() => {
    const performVerification = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2500))
        if (token === 'expired') {
          setStatus('error')
        } else {
          setStatus('success')
          setTimeout(() => navigate('/dashboard'), 2000)
        }
      } catch {
        setStatus('error')
      }
    }
    if (token) performVerification()
  }, [token, navigate])

  if (status === 'verifying') {
    return (
      <Box sx={{ height: '100dvh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', gap: 3 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress size={80} thickness={4} sx={{ color: 'primary.main' }} />
          <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Login sx={{ color: 'primary.main', fontSize: 32 }} />
          </Box>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
          {t('passwordless.verifyingHeading', 'Verifying your link')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('passwordless.verifyingDescription', 'Checking your secure connection. You will be logged in automatically.')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      className="animate-scale-in"
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      sx={{ width: '100%', maxWidth: 400, mx: 'auto', p: { xs: 3, md: 5 }, textAlign: 'center' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Avatar variant="square"
          sx={{ width: 56, height: 56, bgcolor: 'transparent', borderRadius: '24px', border: '2px solid',
            color: status === 'success' ? 'success.main' : 'error.main',
            borderColor: alpha(status === 'success' ? theme.palette.success.main : theme.palette.error.main, 0.2) }}>
          {status === 'success' ? <CheckCircleOutline sx={{ fontSize: 32 }} /> : <ErrorOutline sx={{ fontSize: 32 }} />}
        </Avatar>
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
        {status === 'success' ? t('passwordless.successHeading', 'Successfully logged in') : t('passwordless.errorHeading', 'Link Expired')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, mb: 4, lineHeight: 1.6 }}>
        {status === 'success'
          ? t('passwordless.successDescription', 'Your identity has been confirmed. Welcome back!')
          : t('passwordless.errorDescription', 'For your security, login links are only valid for 10 minutes and can only be used once.')}
      </Typography>

      {status === 'error' && (
        <Button variant="contained" onClick={() => navigate(Path.signin)} endIcon={<ArrowForward />}
          sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1rem', textTransform: 'none', bgcolor: 'info.main', boxShadow: (t) => `0 4px 14px ${alpha(t.palette.info.main, 0.4)}`, '&:hover': { bgcolor: 'info.dark', transform: 'translateY(-1px)' }, px: 4 }}>
          {t('common.backToLogin', 'Back to Login')}
        </Button>
      )}
    </Box>
  )
}
