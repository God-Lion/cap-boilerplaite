import { useCallback, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box,
  Button,
  Typography,
  Alert,
  Avatar,
  Stack,
  CircularProgress,
  Link as MuiLink,
  alpha,
  useTheme,
} from '@mui/material'
import { Mail, ArrowBack, Refresh, ArrowForward } from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import Path from '../path'

export default function CheckEmailConfirmation() {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)

  const handleResendEmail = useCallback(async () => {
    setResending(true)
    setResendError(null)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setResendSuccess(true)
    } catch {
      setResendError(t('email.resendError', 'Failed to resend email. Please try again.'))
    } finally {
      setResending(false)
    }
  }, [t])

  return (
    <Box
      className="animate-scale-in"
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      sx={{
        width: '100%',
        maxWidth: 440,
        mx: 'auto',
        p: { xs: 3, md: 5 },
        textAlign: 'center',
        position: 'relative',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
        <Avatar
          variant="square"
          sx={{
            width: 56,
            height: 56,
            bgcolor: 'transparent',
            color: 'primary.main',
            borderRadius: '24px',
            border: '2px solid',
            borderColor: alpha(theme.palette.primary.main, 0.2),
          }}
        >
          <Mail sx={{ fontSize: 32 }} />
        </Avatar>
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
        {t('email.checkHeading', 'Check your email')}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, mb: 4, lineHeight: 1.6 }}>
        {t('email.checkDescription', "We've sent a verification link to")}{' '}
        <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
          {email || t('email.yourEmail', 'your email address')}
        </Box>
        . {t('email.clickLink', 'Please click the link to verify your account.')}
      </Typography>

      {resendSuccess && (
        <Alert severity="success" sx={{ mb: 4, borderRadius: 2, textAlign: 'left', '& .MuiAlert-message': { fontWeight: 600 } }}>
          {t('email.resendSuccess', 'Verification email resent successfully!')}
        </Alert>
      )}
      {resendError && (
        <Alert severity="error" sx={{ mb: 4, borderRadius: 2, textAlign: 'left', '& .MuiAlert-message': { fontWeight: 600 } }}>
          {resendError}
        </Alert>
      )}

      <Stack spacing={2}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => window.open('https://mail.google.com', '_blank')}
          endIcon={<ArrowForward />}
          sx={{
            py: 1.5,
            borderRadius: 3,
            fontWeight: 800,
            fontSize: '1rem',
            textTransform: 'none',
            bgcolor: 'info.main',
            boxShadow: (theme) => `0 4px 14px ${alpha(theme.palette.info.main, 0.4)}`,
            '&:hover': {
              bgcolor: 'info.dark',
              transform: 'translateY(-1px)',
              boxShadow: (theme) => `0 6px 20px ${alpha(theme.palette.info.main, 0.23)}`,
            },
          }}
        >
          {t('email.openEmailApp', 'Open Gmail')}
        </Button>

        <Button
          variant="outlined"
          size="large"
          fullWidth
          disabled={resending}
          onClick={handleResendEmail}
          startIcon={
            resending ? (
              <CircularProgress size={18} />
            ) : (
              <Refresh />
            )
          }
          sx={{
            py: 1.2,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: 'none',
            color: 'text.primary',
            borderColor: alpha(theme.palette.divider, 0.8),
            '&:hover': { bgcolor: alpha(theme.palette.action.hover, 0.5) },
          }}
        >
          {resending
            ? t('email.resending', 'Resending...')
            : t('email.resendButton', 'Resend email')}
        </Button>
      </Stack>

      <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
        <MuiLink
          component="button"
          onClick={() => navigate(Path.signin)}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'text.secondary',
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': { color: 'info.main' },
          }}
        >
          <ArrowBack sx={{ fontSize: 18 }} />
          {t('common.backToLogin', 'Back to log in')}
        </MuiLink>
      </Box>
    </Box>
  )
}
