import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, Typography, Card, CardContent, Link as HLink } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { CheckCircle, Lock, Timer } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'

export default function PasswordResetSuccess() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  // Auto-redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      navigate('/auth/sign-in')
    }
  }, [countdown, navigate])

  const handleContinue = useCallback(() => {
    navigate('/auth/sign-in')
  }, [navigate])

  const handleContactSupport = useCallback(() => {
    navigate('/support')
  }, [navigate])

  return (
    <>
      <title>
        {t('auth.password_reset.success_title')} - {themeConfig.templateName}
      </title>
      <meta
        name='description'
        content={`${t('auth.password_reset.success_description')} - ${themeConfig.templateName}`}
      />

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
          py: { xs: 4, sm: 10 },
          px: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '480px' }}>
          <Card
            sx={{
              borderRadius: { xs: 0, sm: '16px' },
              boxShadow: (theme) => theme.shadows[4],
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'background.paper',
              animation: 'fadeInUp 0.6s ease-out',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <CardContent sx={{ p: { xs: 4, md: 5 } }}>
              {/* Success Icon */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: (theme) =>
                      alpha(theme.palette.success.main, theme.palette.mode === 'dark' ? 0.2 : 0.1),
                    animation: 'bounceShort 1s ease-in-out 0.2s 1',
                    '@keyframes bounceShort': {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-10px)' },
                    },
                  }}
                >
                  <CheckCircle sx={{ fontSize: 60, color: 'success.main' }} />
                </Box>

                {/* Text Content */}
                <Box sx={{ textAlign: 'center', width: '100%' }}>
                  <Typography
                    variant='h4'
                    fontWeight='700'
                    sx={{
                      fontSize: { xs: '1.5rem', sm: '1.75rem' },
                      color: 'text.primary',
                      letterSpacing: '-0.025em',
                      mb: 1,
                    }}
                  >
                    {t('auth.password_reset.success_heading')}
                  </Typography>

                  <Typography
                    variant='body2'
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      lineHeight: 1.6,
                      maxWidth: '360px',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {t('auth.password_reset.success_message')}
                  </Typography>

                  {/* Countdown Timer */}
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: 999,
                      bgcolor: (theme) => alpha(theme.palette.action.selected, 0.5),
                      border: '1px solid',
                      borderColor: 'divider',
                      mt: 1,
                    }}
                  >
                    <Timer
                      sx={{
                        fontSize: 18,
                        color: 'text.secondary',
                      }}
                    />
                    <Typography
                      variant='caption'
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'text.secondary',
                      }}
                    >
                      {t('auth.password_reset.redirecting')}{' '}
                      <Typography component='span' sx={{ color: 'primary.main', fontWeight: 700 }}>
                        {countdown}s
                      </Typography>
                      ...
                    </Typography>
                  </Box>
                </Box>

                {/* Actions */}
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    fullWidth
                    variant='contained'
                    size='large'
                    onClick={handleContinue}
                    sx={{
                      py: 1.75,
                      borderRadius: '8px',
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1rem',
                      mt: 1,
                      boxShadow: (theme) =>
                        `0 4px 6px -1px ${alpha(theme.palette.primary.main, 0.2)}`,
                      '&:hover': {
                        bgcolor: 'primary.dark',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {t('auth.common.continue')}
                  </Button>

                  <Box
                    sx={{
                      width: '100%',
                      height: 1,
                      bgcolor: 'divider',
                    }}
                  />

                  <Typography
                    variant='caption'
                    sx={{
                      textAlign: 'center',
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                    }}
                  >
                    {t('auth.password_reset.unauthorized_action')}{' '}
                    <HLink
                      component='button'
                      onClick={handleContactSupport}
                      sx={{
                        color: 'primary.main',
                        fontWeight: 500,
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {t('auth.common.contact_support')}
                    </HLink>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Security Badge */}
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              color: 'text.disabled',
            }}
          >
            <Lock sx={{ fontSize: 14 }} />
            <Typography variant='caption' sx={{ fontSize: '0.75rem' }}>
              {t('auth.common.secure_connection')}
            </Typography>
          </Box>
        </Box>
        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography
            variant='caption'
            sx={{
              fontSize: '0.875rem',
              color: 'text.disabled',
              fontFamily: 'inherit',
            }}
          >
            © {new Date().getFullYear()} {t('auth.common.app_name')}.{' '}
            {t('auth.common.all_rights_reserved')}
          </Typography>
        </Box>
      </Container>
    </>
  )
}
