import { useEffect, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Button, Typography, CircularProgress, Avatar, Link as MuiLink, alpha, useTheme,
} from '@mui/material'
import { CheckCircle, ArrowForward } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface MFAVerificationSuccessProps {
  autoRedirect?: boolean
  redirectDelay?: number
  redirectPath?: string
}

export default function MFAVerificationSuccess({
  autoRedirect = true,
  redirectDelay = 5000,
  redirectPath = '/dashboard',
}: MFAVerificationSuccessProps) {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(Math.ceil(redirectDelay / 1000))
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (!autoRedirect) return
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((p) => p - 1), 1000)
      return () => clearTimeout(timer)
    }
    if (countdown === 0 && !isRedirecting) {
      setIsRedirecting(true)
      setTimeout(() => navigate(redirectPath), 500)
    }
  }, [autoRedirect, countdown, redirectPath, navigate, isRedirecting])

  const handleContinue = useCallback(() => {
    setIsRedirecting(true)
    setTimeout(() => navigate(redirectPath), 300)
  }, [navigate, redirectPath])

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
          sx={{ width: 56, height: 56, bgcolor: 'transparent', color: 'success.main', borderRadius: '24px', border: '2px solid', borderColor: alpha(theme.palette.success.main, 0.2) }}>
          <CheckCircle sx={{ fontSize: 32 }} />
        </Avatar>
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
        {t('mfa.verificationSuccessful', 'Verification successful!')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, mb: 4, lineHeight: 1.6 }}>
        {t('mfa.identityVerifiedRedirect', 'Your identity has been confirmed. Redirecting you now.')}
      </Typography>

      {isRedirecting ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <CircularProgress size={24} thickness={4} />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.75, mb: 4 }}>
          {[0, 1, 2].map((i) => (
            <Box key={i} sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.4), animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.2}s`, '@keyframes pulse': { '0%, 100%': { opacity: 0.4, transform: 'scale(1)' }, '50%': { opacity: 1, transform: 'scale(1.2)' } } }} />
          ))}
        </Box>
      )}

      <Button fullWidth variant="contained" onClick={handleContinue} disabled={isRedirecting}
        endIcon={<ArrowForward />}
        sx={{ py: 1.5, borderRadius: 3, fontWeight: 800, fontSize: '1rem', textTransform: 'none', bgcolor: 'info.main', boxShadow: (t) => `0 4px 14px ${alpha(t.palette.info.main, 0.4)}`, '&:hover': { bgcolor: 'info.dark', transform: 'translateY(-1px)' }, mb: 2 }}>
        {t('common.dashboard', 'Go to Dashboard')}
      </Button>

      <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
        {t('common.notRedirected', 'Not redirected?')}{' '}
        <MuiLink component={Link} to={redirectPath}
          sx={{ color: 'info.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
          {t('common.clickHere', 'Click here')}
        </MuiLink>
      </Typography>
    </Box>
  )
}
