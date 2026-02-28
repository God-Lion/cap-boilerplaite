import { useCallback, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
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
import { History, ArrowBack, Send } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, themeConfig } from '@cap/platform-core'
import Path from '../path'

export default function VerificationLinkExpired() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''

  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState({
    open: false,
    msg: '',
    type: 'success' as 'success' | 'error',
  })

  const handleRequestNewLink = useCallback(async () => {
    setSending(true)
    try {
      // Simulated request logic
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStatus({
        open: true,
        msg: t('auth.email.new_link_sent', 'A new verification link has been sent to your email.'),
        type: 'success',
      })
      // Optionally redirect to CheckEmailConfirmation with the email
      setTimeout(() => navigate(`${Path.checkEmail}?email=${encodeURIComponent(email)}`), 2000)
    } catch (error) {
      setStatus({
        open: true,
        msg: t('auth.email.new_link_error', 'Failed to send new link. Please try again later.'),
        type: 'error',
      })
    } finally {
      setSending(false)
    }
  }, [t, navigate, email])

  const handleCloseStatus = () => setStatus((prev) => ({ ...prev, open: false }))

  return (
    <>
      <title>
        {t('auth.email.expired_title', 'Link Expired')} - {themeConfig.templateName}
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
            maxWidth: '500px',
            borderRadius: '24px',
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
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
              }}
            >
              <History sx={{ color: 'warning.main', fontSize: 40 }} />
            </Box>

            <Typography variant='h4' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.025em' }}>
              {t('auth.email.expired_heading', 'Verification link expired')}
            </Typography>

            <Typography variant='body1' color='text.secondary' sx={{ mb: 5, lineHeight: 1.6 }}>
              {t(
                'auth.email.expired_description',
                "For security reasons, verification links expire after a short period. Don't worry, you can easily request a new one.",
              )}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant='contained'
                size='large'
                fullWidth
                disabled={sending}
                onClick={handleRequestNewLink}
                startIcon={<Send />}
                sx={{
                  height: 56,
                  borderRadius: '14px',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: (theme) => `0 8px 16px ${alpha(theme.palette.primary.main, 0.25)}`,
                }}
              >
                {sending
                  ? t('auth.email.sending', 'Sending...')
                  : t('auth.email.request_new_link', 'Request a new link')}
              </Button>

              <Button
                component={Link}
                to={Path.signin}
                variant='text'
                fullWidth
                sx={{
                  height: 48,
                  borderRadius: '14px',
                  fontWeight: 600,
                  color: 'text.secondary',
                  textTransform: 'none',
                }}
              >
                {t('auth.common.back_to_login', 'Back to log in')}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 5, display: 'flex', gap: 3 }}>
          <MuiLink
            href='#'
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
              textDecoration: 'none',
              '&:hover': { color: 'text.primary' },
            }}
          >
            {t('auth.common.terms', 'Terms')}
          </MuiLink>
          <MuiLink
            href='#'
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
              textDecoration: 'none',
              '&:hover': { color: 'text.primary' },
            }}
          >
            {t('auth.common.privacy', 'Privacy')}
          </MuiLink>
          <MuiLink
            href='#'
            sx={{
              color: 'text.secondary',
              fontSize: '0.875rem',
              textDecoration: 'none',
              '&:hover': { color: 'text.primary' },
            }}
          >
            {t('auth.common.contact', 'Contact')}
          </MuiLink>
        </Box>
      </Container>
    </>
  )
}
