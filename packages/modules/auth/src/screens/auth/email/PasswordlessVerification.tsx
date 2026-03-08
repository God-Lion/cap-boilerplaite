import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Container, Typography, CircularProgress, alpha, Button } from '@mui/material'
import { Login, ErrorOutline, CheckCircleOutline } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'
import Path from '../path'

export default function PasswordlessVerification() {
  const { t } = useTranslation()
  const { token } = useParams<{ token: string }>()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    token ? 'verifying' : 'error',
  )

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
      } catch (err) {
        setStatus('error')
      }
    }

    if (token) {
      performVerification()
    }
  }, [token, navigate])

  return (
    <>
      <title>
        {t('auth.passwordless.title', 'Secure Login')} - {themeConfig.templateName}
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
              <Box sx={{ position: 'relative', display: 'inline-flex', mb: 4 }}>
                <CircularProgress size={80} thickness={4} sx={{ color: 'primary.main' }} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Login sx={{ color: 'primary.main', fontSize: 32 }} />
                </Box>
              </Box>
              <Typography variant='h5' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.02em' }}>
                {t('auth.passwordless.verifying_heading', 'Verifying your link')}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {t(
                  'auth.passwordless.verifying_description',
                  'Checking your secure connection. You will be logged in automatically.',
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
                {t('auth.passwordless.success_heading', 'Successfully logged in')}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {t(
                  'auth.passwordless.success_description',
                  'Your identity has been confirmed. Welcome back!',
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
                {t('auth.passwordless.error_heading', 'Link Expired')}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
                {t(
                  'auth.passwordless.error_description',
                  'For your security, login links are only valid for 10 minutes and can only be used once.',
                )}
              </Typography>
              <Button
                variant='contained'
                onClick={() => navigate(Path.signin)}
                sx={{
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 700,
                  textTransform: 'none',
                }}
              >
                {t('auth.common.backToLogin', 'Back to Login')}
              </Button>
            </>
          )}
        </Box>
      </Container>
    </>
  )
}
