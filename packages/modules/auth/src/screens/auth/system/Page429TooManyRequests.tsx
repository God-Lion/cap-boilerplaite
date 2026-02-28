import { Box, Button, Container, Typography, Card, alpha, LinearProgress } from '@mui/material'
import { Speed, Refresh, SupportAgent } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'

export default function Page429TooManyRequests() {
  const { t } = useTranslation()

  return (
    <>
      <title>
        429 {t('auth.system.rate_limit_title', 'Too Many Requests')} - {themeConfig.templateName}
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
            maxWidth: '520px',
            borderRadius: '24px',
            boxShadow: (theme) => `0 32px 64px ${alpha(theme.palette.common.black, 0.1)}`,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 4,
              }}
            >
              <Speed sx={{ color: 'warning.main', fontSize: 40 }} />
            </Box>

            <Typography
              variant='overline'
              sx={{
                fontWeight: 800,
                color: 'warning.main',
                letterSpacing: '0.1em',
                mb: 1,
                display: 'block',
              }}
            >
              429 {t('auth.system.limit_reached', 'Rate Limit Reached')}
            </Typography>

            <Typography variant='h4' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.025em' }}>
              {t('auth.system.rate_limit_heading', 'Please slow down')}
            </Typography>

            <Typography variant='body1' color='text.secondary' sx={{ mb: 5, lineHeight: 1.6 }}>
              {t(
                'auth.system.rate_limit_description',
                "We've detected a high number of requests from your connection. Please wait a few moments before trying again.",
              )}
            </Typography>

            <Box sx={{ width: '100%', mb: 5 }}>
              <LinearProgress
                variant='indeterminate'
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    bgcolor: 'warning.main',
                  },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
              <Button
                variant='outlined'
                size='large'
                fullWidth
                onClick={() => window.location.reload()}
                startIcon={<Refresh />}
                sx={{
                  height: 56,
                  borderRadius: '16px',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderColor: 'divider',
                  color: 'text.primary',
                }}
              >
                {t('auth.system.retry_now', 'Try again')}
              </Button>
              <Button
                variant='contained'
                size='large'
                fullWidth
                startIcon={<SupportAgent />}
                sx={{
                  height: 56,
                  borderRadius: '16px',
                  fontWeight: 700,
                  textTransform: 'none',
                  bgcolor: 'text.primary',
                  color: 'background.paper',
                  '&:hover': { bgcolor: 'text.secondary' },
                }}
              >
                {t('auth.common.contact_support', 'Get Help')}
              </Button>
            </Box>
          </Box>
        </Card>

        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Typography variant='caption' color='text.disabled' sx={{ fontWeight: 500 }}>
            {t('auth.system.your_ip', 'Your IP address')}:{' '}
            <Box component='span' sx={{ fontFamily: 'monospace' }}>
              192.168.1.1
            </Box>
          </Typography>
        </Box>
      </Container>
    </>
  )
}
