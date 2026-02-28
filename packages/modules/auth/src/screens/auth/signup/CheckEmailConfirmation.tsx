import { useCallback, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  alpha,
  Link as MuiLink,
  Snackbar,
} from '@mui/material'
import { Mail, ArrowBack, Refresh } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, themeConfig } from '@cap/platform-core'
import Path from '../path'

export default function CheckEmailConfirmation() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const [resending, setResending] = useState(false)
  const [status, setStatus] = useState({
    open: false,
    msg: '',
    type: 'success' as 'success' | 'error',
  })

  const handleResendEmail = useCallback(async () => {
    setResending(true)
    // Simulated resend logic - would typically use a mutation
    try {
      // await resendVerificationEmailMutation.mutateAsync({ email })
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStatus({
        open: true,
        msg: t('auth.email.resend_success', 'Verification email resent successfully!'),
        type: 'success',
      })
    } catch (error) {
      setStatus({
        open: true,
        msg: t('auth.email.resend_error', 'Failed to resend email. Please try again later.'),
        type: 'error',
      })
    } finally {
      setResending(false)
    }
  }, [t])

  const handleCloseStatus = () => setStatus((prev) => ({ ...prev, open: false }))

  return (
    <>
      <title>
        {t('auth.email.check_title', 'Check your email')} - {themeConfig.templateName}
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
          py: { xs: 4, sm: 8 },
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={status.open}
          autoHideDuration={6000}
          onClose={handleCloseStatus}
        >
          <MAlert onClose={handleCloseStatus} severity={status.type} sx={{ width: '100%' }}>
            {status.msg}
          </MAlert>
        </Snackbar>

        <Card
          sx={{
            width: '100%',
            maxWidth: '480px',
            borderRadius: '16px',
            boxShadow: (theme) => `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            mx: 2,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 6 }, textAlign: 'center' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
              }}
            >
              <Mail sx={{ color: 'primary.main', fontSize: 32 }} />
            </Box>

            <Typography variant='h4' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.025em' }}>
              {t('auth.email.check_heading', 'Check your email')}
            </Typography>

            <Typography variant='body1' color='text.secondary' sx={{ mb: 4, lineHeight: 1.6 }}>
              {t('auth.email.check_description', "We've sent a verification link to")}
              <Box component='span' sx={{ fontWeight: 700, color: 'text.primary', ml: 0.5 }}>
                {email || t('auth.email.your_email', 'your email address')}
              </Box>
              . {t('auth.email.click_link', 'Please click the link to verify your account.')}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant='contained'
                size='large'
                fullWidth
                onClick={() => window.open('https://mail.google.com', '_blank')}
                sx={{ height: 52, borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
              >
                {t('auth.email.open_email_app', 'Open Gmail')}
              </Button>

              <Button
                variant='outlined'
                size='large'
                fullWidth
                disabled={resending}
                onClick={handleResendEmail}
                startIcon={
                  resending ? <Refresh sx={{ animation: 'spin 1s linear infinite' }} /> : null
                }
                sx={{
                  height: 52,
                  borderRadius: '12px',
                  fontWeight: 600,
                  textTransform: 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              >
                {resending
                  ? t('auth.email.resending', 'Resending...')
                  : t('auth.email.resend_button', 'Resend email')}
              </Button>
            </Box>

            <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <MuiLink
                component='button'
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
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <ArrowBack sx={{ fontSize: 18 }} />
                {t('auth.common.back_to_login', 'Back to log in')}
              </MuiLink>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant='caption' color='text.disabled'>
            {t('auth.email.not_received', "Didn't receive the email?")}{' '}
            <MuiLink
              href='#'
              sx={{ color: 'text.secondary', fontWeight: 600, textDecoration: 'none' }}
            >
              {t('auth.common.contact_support', 'Contact Support')}
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </>
  )
}
