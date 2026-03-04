import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, CircularProgress, alpha, Button } from '@mui/material'
import { CheckCircleOutline, ErrorOutline } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'
import authService from '../../../services/auth.service'
import Path from '../path'

export default function EmailChangeVerification() {
  const { t } = useTranslation()
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await authService.verifyEmailChange(token as string)
        if (response.status === 200 || response.status === 202) {
          setStatus('success')
          setTimeout(() => navigate(Path.emailChangeSuccess), 2000)
        } else {
          setStatus('error')
        }
      } catch (err) {
        console.error('Email verification error:', err)
        setStatus('error')
      }
    }

    if (token) {
      verifyToken()
    } else {
      setTimeout(() => setStatus('error'), 0)
    }
  }, [token, navigate])

  return (
    <>
      <title>
        {t('auth.email.verifying_change_title', 'Verifying Email Change')} -{' '}
        {themeConfig.templateName}
      </title>

      <Container
        component='main'
        maxWidth={false}
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
          p: 3,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {status === 'verifying' && (
            <>
              <CircularProgress size={64} sx={{ mb: 4, thickness: 5 }} />
              <Typography variant='h5' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.02em' }}>
                {t('auth.email.verifying_heading', 'Verifying your new email')}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {t(
                  'auth.email.verifying_description',
                  'Please wait while we securely update your account information.',
                )}
              </Typography>
            </>
          )}

          {status === 'success' && (
            <>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                }}
              >
                <CheckCircleOutline sx={{ color: 'success.main', fontSize: 48 }} />
              </Box>
              <Typography variant='h5' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.02em' }}>
                {t('auth.email.verified_heading', 'Email Verified!')}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {t(
                  'auth.email.verified_description',
                  'Your email address has been successfully updated. Redirecting you now...',
                )}
              </Typography>
            </>
          )}

          {status === 'error' && (
            <>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 4,
                }}
              >
                <ErrorOutline sx={{ color: 'error.main', fontSize: 48 }} />
              </Box>
              <Typography variant='h5' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.02em' }}>
                {t('auth.email.verification_failed_heading', 'Verification Failed')}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
                {t(
                  'auth.email.verification_failed_description',
                  'The verification link is invalid or has expired.',
                )}
              </Typography>
              <Button
                variant='contained'
                onClick={() => navigate(Path.requestEmailChange)}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                }}
              >
                {t('auth.email.try_again', 'Try Again')}
              </Button>
            </>
          )}
        </Box>
      </Container>
    </>
  )
}
