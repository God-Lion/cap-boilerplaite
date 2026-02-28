import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, Typography, Card, CardContent, Divider } from '@mui/material'
import { CheckCircle, AppShortcut } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'

interface RegistrationSuccessProps {
  userName?: string
  redirectPath?: string
}

export default function RegistrationSuccess({
  userName,
  redirectPath = '/dashboard',
}: RegistrationSuccessProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleGoToDashboard = useCallback(() => {
    navigate(redirectPath)
  }, [navigate, redirectPath])

  const handleCompleteLater = useCallback(() => {
    navigate('/profile/settings')
  }, [navigate])

  return (
    <>
      <title>
        {t('auth.success.registration_title')} - {themeConfig.templateName}
      </title>

      <Container
        component='main'
        maxWidth={false}
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          bgcolor: '#f6f7f8',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Header */}
        <Box
          component='header'
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e5e7eb',
            bgcolor: '#ffffff',
            px: 5,
            py: 2,
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            zIndex: 10,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#137fec',
              }}
            >
              <AppShortcut sx={{ fontSize: 24 }} />
            </Box>
            <Typography
              variant='h6'
              sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#111418' }}
            >
              {themeConfig.templateName || 'App Name'}
            </Typography>
          </Box>
          <Box>
            <Button
              variant='text'
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#637588',
                textTransform: 'none',
                '&:hover': {
                  color: '#137fec',
                  bgcolor: 'transparent',
                },
              }}
            >
              Help
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            py: 6,
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '448px' }}>
            <Card
              sx={{
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                animation: 'fadeInUp 0.6s ease-out',
                '@keyframes fadeInUp': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(20px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              <CardContent
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  p: 4,
                }}
              >
                {/* Success Icon */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '50%',
                    bgcolor: 'rgba(19, 127, 236, 0.1)',
                    p: 3,
                  }}
                >
                  <CheckCircle
                    sx={{
                      color: '#137fec',
                      fontSize: 60,
                    }}
                  />
                </Box>

                {/* Text Content */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    variant='h4'
                    sx={{
                      color: '#111418',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      letterSpacing: '-0.015em',
                    }}
                  >
                    {t('auth.success.registration_heading')}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{
                      color: '#637588',
                      fontSize: '0.875rem',
                      maxWidth: '320px',
                      lineHeight: 1.6,
                    }}
                  >
                    {userName
                      ? t('auth.success.welcome_message', { name: userName })
                      : t('auth.success.generic_success_message')}
                  </Typography>
                </Box>

                {/* Divider */}
                <Divider
                  sx={{
                    width: '100%',
                    my: 1,
                    borderColor: '#f0f2f4',
                  }}
                />

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1.5,
                    width: '100%',
                  }}
                >
                  <Button
                    fullWidth
                    variant='contained'
                    onClick={handleGoToDashboard}
                    sx={{
                      height: 48,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1rem',
                      bgcolor: '#137fec',
                      color: '#ffffff',
                      boxShadow: '0 4px 6px -1px rgba(19, 127, 236, 0.3)',
                      fontFamily: 'inherit',
                      '&:hover': {
                        bgcolor: '#1068c1',
                        boxShadow: '0 6px 8px -1px rgba(19, 127, 236, 0.4)',
                      },
                    }}
                  >
                    {t('auth.success.go_to_dashboard')}
                  </Button>
                  <Button
                    fullWidth
                    variant='outlined'
                    onClick={handleCompleteLater}
                    sx={{
                      height: 48,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                      borderColor: 'transparent',
                      color: '#111418',
                      fontFamily: 'inherit',
                      '&:hover': {
                        bgcolor: '#f0f2f4',
                        borderColor: '#d1d5db',
                      },
                    }}
                  >
                    {t('auth.success.complete_profile_later')}
                  </Button>
                </Box>

                {/* Footer Note */}
                <Typography
                  variant='caption'
                  sx={{
                    mt: 2,
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    textAlign: 'center',
                  }}
                >
                  {t('auth.success.footer_note')}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </>
  )
}
