import { Box, Container, Typography, alpha, Paper } from '@mui/material'
import { Engineering, Construction, Info } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'

export default function MaintenanceScreen() {
  const { t } = useTranslation()

  return (
    <>
      <title>
        {t('auth.system.maintenance_title', 'Maintenance')} - {themeConfig.templateName}
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
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Patterns */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.03),
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
            zIndex: 0,
          }}
        />

        <Box sx={{ width: '100%', maxWidth: '600px', textAlign: 'center', zIndex: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 6,
              position: 'relative',
            }}
          >
            <Engineering
              sx={{ fontSize: 120, color: (theme) => alpha(theme.palette.primary.main, 0.1) }}
            />
            <Construction
              sx={{
                fontSize: 64,
                color: 'primary.main',
                position: 'absolute',
                animation: 'hammer 2s infinite ease-in-out',
                '@keyframes hammer': {
                  '0%': { transform: 'rotate(0deg)' },
                  '50%': { transform: 'rotate(-20deg)' },
                  '100%': { transform: 'rotate(0deg)' },
                },
              }}
            />
          </Box>

          <Typography
            variant='h3'
            sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.04em', color: 'text.primary' }}
          >
            {t('auth.system.maintenance_heading', 'Scheduled Maintenance')}
          </Typography>

          <Typography
            variant='h6'
            sx={{
              mb: 6,
              color: 'text.secondary',
              fontWeight: 500,
              lineHeight: 1.6,
              maxWidth: '500px',
              mx: 'auto',
            }}
          >
            {t(
              'auth.system.maintenance_description',
              "We're performing a planned update to improve our services. We'll be back online shortly.",
            )}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: '20px',
              bgcolor: (theme) => alpha(theme.palette.info.main, 0.05),
              border: '1px solid',
              borderColor: (theme) => alpha(theme.palette.info.main, 0.1),
              display: 'flex',
              alignItems: 'flex-start',
              gap: 2,
              textAlign: 'left',
              mx: 'auto',
              maxWidth: '440px',
            }}
          >
            <Info sx={{ color: 'info.main', flexShrink: 0, mt: 0.5 }} />
            <Box>
              <Typography variant='subtitle2' sx={{ fontWeight: 700, mb: 0.5 }}>
                {t('auth.system.maintenance_expected_title', 'Expected downtime')}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {t(
                  'auth.system.maintenance_expected_desc',
                  'The maintenance is scheduled to conclude in approximately 45 minutes. Thank you for your patience.',
                )}
              </Typography>
            </Box>
          </Paper>

          <Box sx={{ mt: 8 }}>
            <Typography
              variant='caption'
              sx={{
                color: 'text.disabled',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {themeConfig.templateName} Status Page:{' '}
              <Box
                component='span'
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                status.example.com
              </Box>
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  )
}
