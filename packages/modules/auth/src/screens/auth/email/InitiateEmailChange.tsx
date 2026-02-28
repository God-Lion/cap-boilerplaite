import { useNavigate } from 'react-router-dom'
import { Box, Button, Container, Typography, Card, CardContent, alpha } from '@mui/material'
import { Security, ArrowBack, ForwardToInbox } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'
import Path from '../path'

export default function InitiateEmailChange() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <title>
        {t('auth.email.initiate_change_title', 'Confirm Email Change')} - {themeConfig.templateName}
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
            boxShadow: (theme) => `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
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
                bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
              }}
            >
              <Security sx={{ color: 'warning.main', fontSize: 32 }} />
            </Box>

            <Typography variant='h4' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.025em' }}>
              {t('auth.email.confirm_current_heading', 'Confirm Current Email')}
            </Typography>

            <Typography variant='body1' color='text.secondary' sx={{ mb: 4, lineHeight: 1.6 }}>
              {t(
                'auth.email.confirm_current_description',
                "For your security, we've sent a confirmation link to your **current** email address. Please click the link to authorize this change.",
              )}
            </Typography>

            <Box
              sx={{
                p: 3,
                bgcolor: 'action.hover',
                borderRadius: '12px',
                mb: 4,
                textAlign: 'left',
                display: 'flex',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <ForwardToInbox color='primary' />
              <Box>
                <Typography variant='subtitle2' sx={{ fontWeight: 700 }}>
                  {t('auth.email.check_inbox', 'Check your inbox')}
                </Typography>
                <Typography variant='caption' color='text.secondary'>
                  {t('auth.email.authorization_required', 'Authorization is required to proceed.')}
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant='contained'
              size='large'
              onClick={() => navigate(Path.team)}
              sx={{
                height: 52,
                borderRadius: '12px',
                fontWeight: 700,
                textTransform: 'none',
                mb: 3,
              }}
            >
              {t('auth.common.back_to_dashboard', 'Back to Dashboard')}
            </Button>

            <Button
              variant='text'
              onClick={() => navigate(-1)}
              startIcon={<ArrowBack />}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                color: 'text.secondary',
              }}
            >
              {t('auth.common.back', 'Back')}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
