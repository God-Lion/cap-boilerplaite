import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  alpha,
  IconButton,
} from '@mui/material'
import { LockOutlined, Home, ArrowBack } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'
import Path from '../path'

export default function Page401Unauthorized() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <title>
        401 {t('auth.system.unauthorized_title', 'Unauthorized')} - {themeConfig.templateName}
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
            maxWidth: '500px',
            borderRadius: '24px',
            boxShadow: (theme) => `0 32px 64px ${alpha(theme.palette.common.black, 0.1)}`,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            textAlign: 'center',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              height: 160,
              bgcolor: 'action.hover',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '24px',
                bgcolor: 'background.paper',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.05)',
              }}
            >
              <LockOutlined sx={{ fontSize: 40, color: 'text.secondary' }} />
            </Box>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'background.paper', opacity: 0.8 },
              }}
            >
              <ArrowBack />
            </IconButton>
          </Box>

          <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
            <Typography
              variant='overline'
              sx={{
                fontWeight: 800,
                color: 'primary.main',
                letterSpacing: '0.1em',
                mb: 1,
                display: 'block',
              }}
            >
              401 {t('auth.system.error', 'Error')}
            </Typography>

            <Typography variant='h4' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.025em' }}>
              {t('auth.system.unauthorized_heading', 'Access denied')}
            </Typography>

            <Typography variant='body1' color='text.secondary' sx={{ mb: 5, lineHeight: 1.6 }}>
              {t(
                'auth.system.unauthorized_description',
                "You don't have permission to access this page. Please make sure you're logged in with the correct account.",
              )}
            </Typography>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant='outlined'
                size='large'
                fullWidth
                onClick={() => navigate('/')}
                startIcon={<Home />}
                sx={{ height: 52, borderRadius: '12px', fontWeight: 600, textTransform: 'none' }}
              >
                {t('auth.system.back_home', 'Back Home')}
              </Button>
              <Button
                variant='contained'
                size='large'
                fullWidth
                onClick={() => navigate(Path.signin)}
                sx={{ height: 52, borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
              >
                {t('auth.common.loginButton', 'Log In')}
              </Button>
            </Box>
          </CardContent>
        </Card>

        <Typography variant='caption' sx={{ mt: 4, color: 'text.disabled', fontWeight: 500 }}>
          {t('auth.system.incident_id', 'Incident ID')}:{' '}
          <Box component='span' sx={{ fontFamily: 'monospace' }}>
            UNAUTH-{new Date().getFullYear()}-REF-4829
          </Box>
        </Typography>
      </Container>
    </>
  )
}

