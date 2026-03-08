import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, Typography, Card, CardContent, alpha, Zoom } from '@mui/material'
import { CheckCircleOutline, Logout } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'
import Path from '../path'

export default function EmailChangeSuccess() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <title>
        {t('auth.email.change_success_title', 'Email Updated')} - {themeConfig.templateName}
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
        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
          <Card
            sx={{
              width: '100%',
              maxWidth: '480px',
              borderRadius: '16px',
              boxShadow: (theme) => `0 20px 40px ${alpha(theme.palette.success.main, 0.15)}`,
              border: '1px solid',
              borderColor: 'success.light',
              bgcolor: 'background.paper',
              mx: 2,
              overflow: 'hidden',
              textAlign: 'center',
            }}
          >
            <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 4,
                  animation: 'pulseSuccess 2s infinite ease-in-out',
                  '@keyframes pulseSuccess': {
                    '0%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.4)' },
                    '70%': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)',
                    },
                    '100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' },
                  },
                }}
              >
                <CheckCircleOutline sx={{ color: 'success.main', fontSize: 48 }} />
              </Box>

              <Typography variant='h4' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.025em' }}>
                {t('auth.email.success_heading', 'All set!')}
              </Typography>

              <Typography variant='body1' color='text.secondary' sx={{ mb: 4, lineHeight: 1.6 }}>
                {t(
                  'auth.email.success_description',
                  'Your email address has been successfully updated. You should use your new email address for your next login.',
                )}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant='contained'
                  color='success'
                  size='large'
                  onClick={() => navigate(Path.team)}
                  sx={{ height: 52, borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
                >
                  {t('auth.common.backToDashboard', 'Back to Dashboard')}
                </Button>

                <Button
                  fullWidth
                  variant='outlined'
                  size='large'
                  startIcon={<Logout />}
                  onClick={() => navigate(Path.signin)}
                  sx={{
                    height: 52,
                    borderRadius: '12px',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderColor: 'divider',
                  }}
                >
                  {t('auth.common.logoutRelogin', 'Sign out and Re-login')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Zoom>
      </Container>
    </>
  )
}
