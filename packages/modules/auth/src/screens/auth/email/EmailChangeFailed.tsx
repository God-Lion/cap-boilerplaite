import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, Typography, Card, CardContent, alpha } from '@mui/material'
import { ErrorOutline, History, ContactSupport } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'
import Path from '../path'

export default function EmailChangeFailed() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <title>
        {t('auth.email.change_failed_title', 'Update Failed')} - {themeConfig.templateName}
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
        <Card
          sx={{
            width: '100%',
            maxWidth: '480px',
            borderRadius: '16px',
            boxShadow: (theme) => `0 20px 40px ${alpha(theme.palette.error.main, 0.1)}`,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            mx: 2,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 6 }, textAlign: 'center' }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '16px',
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
              }}
            >
              <ErrorOutline sx={{ color: 'error.main', fontSize: 32 }} />
            </Box>

            <Typography variant='h4' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.025em' }}>
              {t('auth.email.expired_heading', 'Link Expired')}
            </Typography>

            <Typography variant='body1' color='text.secondary' sx={{ mb: 4, lineHeight: 1.6 }}>
              {t(
                'auth.email.expired_description',
                'The email change verification link has expired or is invalid. For your security, these links are only active for a short period.',
              )}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Button
                variant='contained'
                size='large'
                fullWidth
                onClick={() => navigate(Path.requestEmailChange)}
                startIcon={<History />}
                sx={{ height: 52, borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
              >
                {t('auth.email.request_new_link', 'Request New Link')}
              </Button>

              <Button
                variant='outlined'
                size='large'
                fullWidth
                startIcon={<ContactSupport />}
                sx={{ height: 52, borderRadius: '12px', fontWeight: 600, textTransform: 'none' }}
              >
                {t('auth.common.contact_support', 'Contact Support')}
              </Button>
            </Box>

            <Box sx={{ mt: 5, textAlign: 'center' }}>
              <Button
                onClick={() => navigate(Path.team)}
                sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
              >
                {t('auth.common.back_to_dashboard', 'Back to Dashboard')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
