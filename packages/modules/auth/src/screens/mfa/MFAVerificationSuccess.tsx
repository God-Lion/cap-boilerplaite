import { useEffect, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { CheckCircle } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'

interface MFAVerificationSuccessProps {
  autoRedirect?: boolean
  redirectDelay?: number
  redirectPath?: string
}

export default function MFAVerificationSuccess({
  autoRedirect = true,
  redirectDelay = 3000,
  redirectPath = '/dashboard',
}: MFAVerificationSuccessProps) {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(Math.ceil(redirectDelay / 1000))
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    if (autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)

      return () => clearTimeout(timer)
    }

    if (countdown === 0 && autoRedirect && !isRedirecting) {
      const timer = setTimeout(() => {
        setIsRedirecting(true)
        setTimeout(() => {
          navigate(redirectPath)
        }, 500)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [autoRedirect, countdown, redirectPath, navigate, isRedirecting])

  const handleContinue = useCallback(() => {
    setIsRedirecting(true)
    setTimeout(() => {
      navigate(redirectPath)
    }, 300)
  }, [navigate, redirectPath])

  return (
    <>
      <title>
        {t('auth.mfa.verification_success')} - {themeConfig.templateName}
      </title>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        {/* Background Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -96,
              left: -96,
              width: 384,
              height: 384,
              borderRadius: '40%',
              bgcolor: alpha(theme.palette.success.main, 0.05),
              filter: 'blur(80px)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              right: -96,
              width: 256,
              height: 256,
              borderRadius: '40%',
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              filter: 'blur(80px)',
            }}
          />
        </Box>

        {/* Success Card */}
        <Container maxWidth='sm' sx={{ position: 'relative', zIndex: 1 }}>
          <Card
            sx={{
              borderRadius: '8px',
              boxShadow: theme.shadows[10],
              overflow: 'hidden',
              bgcolor: 'background.paper',
            }}
          >
            <CardContent
              sx={{
                p: { xs: 4, sm: 5 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {/* Success Icon */}
              <Box
                sx={{
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                }}
              >
                <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />
              </Box>

              {/* Heading */}
              <Typography
                variant='h4'
                sx={{
                  mb: 1.5,
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  fontWeight: 700,
                  color: 'text.primary',
                  letterSpacing: '-0.02em',
                }}
              >
                {t('auth.mfa.verification_successful')}
              </Typography>

              {/* Description */}
              <Typography
                variant='body1'
                sx={{
                  mb: 4,
                  fontSize: '1rem',
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  maxWidth: '400px',
                }}
              >
                {t('auth.mfa.identity_verified_redirect')}
              </Typography>

              {/* Loading Indicator */}
              {isRedirecting ? (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <CircularProgress size={24} thickness={4} />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 0.75,
                    mb: 4,
                  }}
                >
                  {[0, 1, 2].map((i) => (
                    <Box
                      key={i}
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: alpha(theme.palette.primary.main, 0.4),
                        animation: 'pulse 1.5s ease-in-out infinite',
                        animationDelay: `${i * 0.2}s`,
                        '@keyframes pulse': {
                          '0%, 100%': {
                            opacity: 0.4,
                            transform: 'scale(1)',
                          },
                          '50%': {
                            opacity: 1,
                            transform: 'scale(1.2)',
                          },
                        },
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* Action Button */}
              <Button
                fullWidth
                variant='contained'
                onClick={handleContinue}
                disabled={isRedirecting}
                sx={{
                  height: 48,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.25)}`,
                  mb: 2,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'action.disabledBackground',
                    color: 'text.disabled',
                  },
                }}
              >
                {t('auth.common.dashboard')}
              </Button>

              {/* Not Redirected Link */}
              <Typography
                variant='body2'
                sx={{
                  fontSize: '0.75rem',
                  color: 'text.secondary',
                }}
              >
                {t('auth.common.notRedirected')}{' '}
                <MuiLink
                  component={Link}
                  to={redirectPath}
                  sx={{
                    color: 'primary.main',
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {t('auth.common.clickHere')}
                </MuiLink>
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  )
}

