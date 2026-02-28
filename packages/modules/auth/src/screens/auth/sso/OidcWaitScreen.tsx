import { Box, Container, Typography, alpha, LinearProgress } from '@mui/material'
import { Security } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'

export default function OidcWaitScreen() {
  const { t } = useTranslation()

  return (
    <>
      <title>
        {t('auth.sso.oidc_wait_title', 'SSO Authentication')} - {themeConfig.templateName}
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
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '16px',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              animation: 'pulse 2s infinite ease-in-out',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)', opacity: 1 },
                '50%': { transform: 'scale(1.1)', opacity: 0.8 },
                '100%': { transform: 'scale(1)', opacity: 1 },
              },
            }}
          >
            <Security sx={{ color: 'primary.main', fontSize: 32 }} />
          </Box>

          <Typography variant='h5' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.02em' }}>
            {t('auth.sso.redirecting_title', 'Authenticating with SSO')}
          </Typography>

          <Typography variant='body2' color='text.secondary' sx={{ mb: 4, lineHeight: 1.6 }}>
            {t(
              'auth.sso.redirecting_description',
              'Please wait while we securely redirect you to your identity provider. This will only take a moment.',
            )}
          </Typography>

          <Box sx={{ width: '100%', mb: 2 }}>
            <LinearProgress
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                },
              }}
            />
          </Box>

          <Typography variant='caption' color='text.disabled' sx={{ mt: 2, fontWeight: 500 }}>
            {t('auth.sso.secure_connection', 'Secure end-to-end encrypted connection')}
          </Typography>
        </Box>
      </Container>
    </>
  )
}
