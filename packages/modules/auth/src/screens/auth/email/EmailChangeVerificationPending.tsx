import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  alpha,
  Link as MuiLink,
} from '@mui/material'
import { MarkEmailRead, Refresh, ArrowBack } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'
import Path from '../path'

export default function EmailChangeVerificationPending() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <title>
        {t('auth.email.verify_new_title', 'Verify New Email')} - {themeConfig.templateName}
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
                borderRadius: '16px',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
              }}
            >
              <MarkEmailRead sx={{ color: 'primary.main', fontSize: 32 }} />
            </Box>

            <Typography variant='h4' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.025em' }}>
              {t('auth.email.verify_new_heading', 'One last step')}
            </Typography>

            <Typography variant='body1' color='text.secondary' sx={{ mb: 4, lineHeight: 1.6 }}>
              {t(
                'auth.email.verify_new_description',
                "We've sent a final verification link to your **new** email address. Please click it to complete the change.",
              )}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant='contained'
                size='large'
                fullWidth
                onClick={() => window.open('https://mail.google.com', '_blank')}
                sx={{ height: 52, borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
              >
                {t('auth.email.open_email_app', 'Open Email App')}
              </Button>

              <Button
                variant='outlined'
                size='large'
                fullWidth
                startIcon={<Refresh />}
                sx={{ height: 52, borderRadius: '12px', fontWeight: 600, textTransform: 'none' }}
              >
                {t('auth.email.resend_button', 'Resend verification')}
              </Button>
            </Box>

            <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <MuiLink
                component='button'
                onClick={() => navigate(Path.team)}
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
                {t('auth.common.back_to_dashboard', 'Back to dashboard')}
              </MuiLink>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
