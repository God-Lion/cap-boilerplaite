import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, Typography, Card, alpha, Link as MuiLink } from '@mui/material'

import { SecurityUpdateWarning, HelpOutline, Refresh } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig, apiClient } from '@cap/platform-core'
import { ENDPOINTS } from '../../../services/endpoints'

export default function CsrfErrorScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <title>
        {t('auth.system.csrf_error_title', 'Security Validation Error')} -{' '}
        {themeConfig.templateName}
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
        <Card
          sx={{
            width: '100%',
            maxWidth: '540px',
            borderRadius: '28px',
            boxShadow: (theme) => `0 40px 80px ${alpha(theme.palette.common.black, 0.12)}`,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              p: { xs: 4, sm: 8 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '24px',
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4,
                transform: 'rotate(10deg)',
              }}
            >
              <SecurityUpdateWarning sx={{ color: 'error.main', fontSize: 36 }} />
            </Box>

            <Typography variant='h4' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.025em' }}>
              {t('auth.system.csrf_error_heading', 'Security session mismatch')}
            </Typography>

            <Typography variant='body1' color='text.secondary' sx={{ mb: 6, lineHeight: 1.6 }}>
              {t(
                'auth.system.csrf_error_description',
                "We couldn't verify your request because of a mismatch in your security tokens. This usually happens when multiple tabs are open or if your session has timed out.",
              )}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
              <Button
                variant='contained'
                size='large'
                fullWidth
                onClick={async () => {
                  try {
                    await apiClient.get(ENDPOINTS.auth.csrfToken)
                  } catch (e) {
                    console.error('Failed to refresh CSRF token', e)
                  } finally {
                    window.location.reload()
                  }
                }}
                startIcon={<Refresh />}
                sx={{
                  height: 60,
                  borderRadius: '16px',
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  boxShadow: (theme) => `0 12px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                {t('auth.system.refresh_button', 'Refresh and try again')}
              </Button>

              <Button
                variant='text'
                size='large'
                fullWidth
                onClick={() => navigate('/')}
                sx={{
                  height: 48,
                  borderRadius: '14px',
                  fontWeight: 600,
                  color: 'text.secondary',
                  textTransform: 'none',
                }}
              >
                {t('auth.system.back_home', 'Return to Home')}
              </Button>
            </Box>
          </Box>
        </Card>

        <Box
          sx={{
            mt: 5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 2,
            borderRadius: '12px',
            bgcolor: 'action.hover',
          }}
        >
          <HelpOutline sx={{ color: 'text.disabled', fontSize: 18 }} />
          <Typography variant='caption' sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {t('auth.system.why_this_happening', 'Why am I seeing this?')}{' '}
            <MuiLink
              href='#'
              sx={{ color: 'primary.main', fontWeight: 700, textDecoration: 'none' }}
            >
              {t('auth.common.learnMore', 'Learn more')}
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </>
  )
}

