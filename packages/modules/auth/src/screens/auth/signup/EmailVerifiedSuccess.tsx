import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, Typography, Card, CardContent, alpha, Fade } from '@mui/material'
import { Celebration } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'
import Path from '../path'

export default function EmailVerifiedSuccess() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <title>
        {t('auth.verify.success_title', 'Email Verified')} - {themeConfig.templateName}
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
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Sparkles Simulation */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            pointerEvents: 'none',
            opacity: 0.5,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '20%',
              left: '10%',
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              animation: 'float 4s infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '70%',
              left: '25%',
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: 'secondary.main',
              animation: 'float 6s infinite',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '30%',
              left: '80%',
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'warning.main',
              animation: 'float 5s infinite',
            }}
          />
          <style>
            {`
               @keyframes float {
                 0%, 100% { transform: translateY(0) scale(1); opacity: 0.2; }
                 50% { transform: translateY(-40px) scale(1.5); opacity: 0.8; }
               }
             `}
          </style>
        </Box>

        <Fade in={true} timeout={800}>
          <Card
            sx={{
              width: '100%',
              maxWidth: '520px',
              borderRadius: '24px',
              boxShadow: (theme) => `0 30px 60px ${alpha(theme.palette.primary.main, 0.1)}`,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              mx: 2,
              overflow: 'hidden',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <CardContent sx={{ p: { xs: 4, sm: 8 }, textAlign: 'center' }}>
              <Box
                sx={{
                  width: 96,
                  height: 96,
                  borderRadius: '32px',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 5,
                  transform: 'rotate(-10deg)',
                  animation: 'pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '@keyframes pop': {
                    '0%': { transform: 'scale(0) rotate(0)' },
                    '100%': { transform: 'scale(1) rotate(-10deg)' },
                  },
                }}
              >
                <Celebration sx={{ color: 'primary.main', fontSize: 48 }} />
              </Box>

              <Typography
                variant='h3'
                sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.03em', lineHeight: 1.1 }}
              >
                {t('auth.verify.verified_heading', "You're Verified!")}
              </Typography>

              <Typography
                variant='body1'
                color='text.secondary'
                sx={{ mb: 5, lineHeight: 1.7, fontSize: '1.1rem' }}
              >
                {t(
                  'auth.verify.verified_description',
                  'Your email has been confirmed. You now have full access to all features and tools.',
                )}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  fullWidth
                  variant='contained'
                  size='large'
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    height: 60,
                    borderRadius: '16px',
                    fontWeight: 800,
                    textTransform: 'none',
                    fontSize: '1rem',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  }}
                >
                  {t('auth.verify.get_started', 'Explore Dashboard')}
                </Button>

                <Button
                  fullWidth
                  variant='text'
                  size='large'
                  onClick={() => navigate(Path.team)}
                  sx={{
                    height: 52,
                    borderRadius: '16px',
                    fontWeight: 700,
                    textTransform: 'none',
                    color: 'text.secondary',
                  }}
                >
                  {t('auth.verify.complete_profile', 'Complete Profile Setup')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </>
  )
}
