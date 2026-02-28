import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Typography, Card, CardContent, CircularProgress } from '@mui/material'
import { Lock, LinkOff } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'

type VerificationState = 'loading' | 'expired'

const PasswordlessVerification = () => {
  const { t } = useTranslation()
  const theme = useTheme()
  const [state, setState] = useState<VerificationState>('loading')
  const [progress, setProgress] = useState(0)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setState('expired'), 500)
          return 100
        }
        return prev + 5
      })
    }, 100)

    return () => clearInterval(timer)
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        // bgcolor: theme.palette.mode === 'dark' ? '#101922' : '#f6f7f8',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: { xs: 'center', lg: 'flex-start' },
          justifyContent: 'center',
          gap: 6,
          py: { xs: 5, lg: 10 },
          px: 2,
        }}
      >
        {state === 'loading' && (
          <Card
            sx={{
              width: '100%',
              maxWidth: 420,
              borderRadius: '12px',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 10px 25px rgba(0,0,0,0.2)'
                  : '0 10px 25px rgba(0,0,0,0.05)',
              // border: '1px solid',
              // borderColor: theme.palette.mode === 'dark' ? '#2d3b4a' : '#e5e7eb',
              // bgcolor: theme.palette.mode === 'dark' ? '#16202a' : '#ffffff',
            }}
          >
            <CardContent
              sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <Box sx={{ position: 'relative', width: 80, height: 80, mb: 3 }}>
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '6px solid',
                    // borderColor: theme.palette.mode === 'dark' ? '#2d3b4a' : '#f1f5f9',
                  }}
                />
                <CircularProgress
                  size={80}
                  thickness={6}
                  sx={{
                    position: 'absolute',
                    color: 'primary.main',
                    '& .MuiCircularProgress-circle': {
                      strokeLinecap: 'round',
                    },
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Lock sx={{ fontSize: 30, color: 'primary.main' }} />
                </Box>
              </Box>

              <Typography
                sx={{
                  fontSize: '24px',
                  fontWeight: 700,
                  color: 'text.primary',
                  textAlign: 'center',
                  mb: 1,
                }}
              >
                {t('auth.passwordless.verifying_title')}
              </Typography>

              <Typography
                sx={{
                  fontSize: '16px',
                  color: 'text.secondary',
                  textAlign: 'center',
                  mb: 4,
                  lineHeight: 1.6,
                }}
              >
                {t('auth.passwordless.verifying_desc')}
              </Typography>

              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography
                    sx={{
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: 'text.secondary',
                    }}
                  >
                    {t('auth.passwordless.securing_session')}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', fontWeight: 700, color: 'primary.main' }}>
                    {progress}%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    height: 8,
                    bgcolor: 'text.secondary',
                    borderRadius: '999px',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      width: `${progress}%`,
                      bgcolor: 'primary.main',
                      borderRadius: '999px',
                      transition: 'width 0.2s ease',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        animation: 'shimmer 1.5s infinite',
                      },
                      '@keyframes shimmer': {
                        '0%': { transform: 'translateX(-100%)' },
                        '100%': { transform: 'translateX(100%)' },
                      },
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {state === 'expired' && (
          <Card
            sx={{
              width: '100%',
              maxWidth: 420,
              borderRadius: '12px',
              boxShadow:
                theme.palette.mode === 'dark'
                  ? '0 10px 25px rgba(0,0,0,0.2)'
                  : '0 10px 25px rgba(0,0,0,0.05)',
              // border: '1px solid',
              // borderColor: theme.palette.mode === 'dark' ? '#2d3b4a' : '#e5e7eb',
              // bgcolor: theme.palette.mode === 'dark' ? '#16202a' : '#ffffff',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: 128,
                // bgcolor: theme.palette.mode === 'dark' ? 'rgba(51, 65, 85, 0.5)' : '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0.1,
                  backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  width: 64,
                  height: 64,
                  // bgcolor: theme.palette.mode === 'dark' ? '#16202a' : '#ffffff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  border: '1px solid',
                  // borderColor: theme.palette.mode === 'dark' ? '#334155' : '#f1f5f9',
                }}
              >
                <LinkOff sx={{ fontSize: 32, color: 'error.main' }} />
              </Box>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography
                  sx={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: 'text.primary',
                    mb: 1,
                  }}
                >
                  {t('auth.passwordless.link_expired')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: 'text.primary',
                    // color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                    lineHeight: 1.6,
                  }}
                >
                  {t('auth.passwordless.link_expired_desc')}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  fullWidth
                  // variant='contained'
                  sx={{
                    height: 44,
                    // bgcolor: 'primary.main',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    boxShadow: '0 1px 2px rgba(19, 127, 236, 0.2)',
                    '&:hover': {
                      bgcolor: 'primary.main',
                    },
                  }}
                >
                  {t('auth.passwordless.resend_link')}
                </Button>
                <Button
                  fullWidth
                  onAbort={() => navigate(-1)}
                  sx={{
                    mx: '10px',
                    height: 44,
                    borderColor: 'transparent',
                    textTransform: 'none',
                    fontSize: '14px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    color: 'text.primary',
                    // '&:hover': {
                    //   bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#f8fafc',
                    //   borderColor: theme.palette.mode === 'dark' ? '#334155' : '#e2e8f0',
                    // },
                  }}
                >
                  {t('auth.common.back_to_login')}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  )
}

export default PasswordlessVerification
