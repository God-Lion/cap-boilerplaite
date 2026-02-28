import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Divider,
  CircularProgress,
  alpha,
} from '@mui/material'
import { Fingerprint, ArrowForward, Lock } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export default function PasskeyLoginOption() {
  const { t } = useTranslation()
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [email, setEmail] = useState('')

  const handlePasskeyLogin = () => {
    setIsAuthenticating(true)
    // Simulate authentication
    setTimeout(() => setIsAuthenticating(false), 2000)
  }

  return (
    <Container maxWidth='xs' sx={{ py: 6 }}>
      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
          }}
        >
          <Fingerprint sx={{ fontSize: 36, color: 'primary.main' }} />
        </Box>
        <Typography variant='h4' fontWeight={800} letterSpacing='-0.02em' sx={{ mb: 1 }}>
          {t('auth.passkey.welcome_back', 'Welcome back')}
        </Typography>
        <Typography variant='body1' color='text.secondary'>
          {t('auth.passkey.login_subtitle', 'Sign in with your passkey for quick, secure access.')}
        </Typography>
      </Box>

      {/* Email Input */}
      <TextField
        fullWidth
        label={t('auth.passkey.email_label', 'Email address')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='you@example.com'
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': { borderRadius: 2 },
        }}
      />

      {/* Passkey Login Button */}
      <Button
        fullWidth
        variant='contained'
        size='large'
        onClick={handlePasskeyLogin}
        disabled={isAuthenticating || !email}
        startIcon={
          isAuthenticating ? <CircularProgress size={20} color='inherit' /> : <Fingerprint />
        }
        sx={{
          textTransform: 'none',
          fontWeight: 700,
          fontSize: '1rem',
          borderRadius: 2,
          py: 1.5,
          mb: 2,
        }}
      >
        {isAuthenticating
          ? t('auth.passkey.authenticating', 'Authenticating...')
          : t('auth.passkey.login_passkey', 'Sign in with Passkey')}
      </Button>

      {/* Divider */}
      <Divider sx={{ my: 3 }}>
        <Typography variant='caption' color='text.secondary'>
          {t('common.or', 'or')}
        </Typography>
      </Divider>

      {/* Alternative Login */}
      <Button
        fullWidth
        variant='outlined'
        size='large'
        endIcon={<ArrowForward />}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 2,
          py: 1.25,
          mb: 1,
        }}
      >
        {t('auth.passkey.use_password', 'Sign in with password')}
      </Button>

      {/* Security Footer */}
      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography
          variant='caption'
          color='text.disabled'
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
        >
          <Lock sx={{ fontSize: 12 }} />
          {t(
            'auth.passkey.phishing_resistant',
            'Passkeys are phishing-resistant and encrypted end-to-end.',
          )}
        </Typography>
      </Box>
    </Container>
  )
}
