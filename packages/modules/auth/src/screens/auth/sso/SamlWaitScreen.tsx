import { Box, Container, Typography, alpha, LinearProgress } from '@mui/material'
import { CorporateFare } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'

export default function SamlWaitScreen() {
  const { t } = useTranslation()

  return (
    <>
      <title>
        {t('auth.sso.saml_wait_title', 'Enterprise Login')} - {themeConfig.templateName}
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
            maxWidth: '420px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '20px',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              border: '1px solid',
              borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
            }}
          >
            <CorporateFare sx={{ color: 'primary.main', fontSize: 36 }} />
          </Box>

          <Typography
            variant='h5'
            sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '-0.02em', color: 'text.primary' }}
          >
            {t('auth.sso.saml_redirect_title', 'Enterprise single sign-on')}
          </Typography>

          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mb: 5, lineHeight: 1.6, maxWidth: '340px' }}
          >
            {t(
              'auth.sso.saml_redirect_description',
              "Connecting to your organization's identity provider. Please do not close this window.",
            )}
          </Typography>

          <Box sx={{ width: '80%', mb: 3 }}>
            <LinearProgress
              sx={{
                height: 4,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.6 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'success.main',
                animation: 'blink 1.5s infinite',
              }}
            />
            <Typography
              variant='caption'
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {t('auth.sso.connecting', 'Connecting...')}
            </Typography>
          </Box>

          <style>
            {`
              @keyframes blink {
                0% { opacity: 0.2; }
                50% { opacity: 1; }
                100% { opacity: 0.2; }
              }
            `}
          </style>
        </Box>
      </Container>
    </>
  )
}
