import { Box, Typography, Container, Paper, Grid, Link, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { WarningAmber, CheckCircleOutline } from '@mui/icons-material'

const BrowserNotSupported = () => {
  const { t } = useTranslation('auth')

  const browsers = [
    { name: 'Google Chrome', url: 'https://www.google.com/chrome/' },
    { name: 'Mozilla Firefox', url: 'https://www.mozilla.org/firefox/' },
    { name: 'Microsoft Edge', url: 'https://www.microsoft.com/edge' },
    { name: 'Apple Safari', url: 'https://www.apple.com/safari/' },
  ]

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #1b1b2f 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth='md'>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
          }}
        >
          <Stack spacing={4} alignItems='center' textAlign='center'>
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: '50%',
                background: 'rgba(255, 193, 7, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WarningAmber sx={{ fontSize: 40, color: '#ffc107' }} />
            </Box>

            <Box>
              <Typography
                variant='h3'
                gutterBottom
                sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                {t('auth.browser.not_supported_title', 'Update Required')}
              </Typography>
              <Typography
                variant='body1'
                sx={{ color: 'rgba(255, 255, 255, 0.65)', maxWidth: 500 }}
              >
                {t(
                  'auth.browser.not_supported_desc',
                  'Your current browser version is not supported. For optimal security and performance, please use a modern browser.',
                )}
              </Typography>
            </Box>

            <Grid container spacing={2} justifyContent='center'>
              {browsers.map((browser) => (
                <Grid key={browser.name} size={{ xs: 6, sm: 3 }}>
                  <Link
                    href={browser.url}
                    target='_blank'
                    rel='noopener'
                    sx={{
                      display: 'block',
                      p: 2,
                      borderRadius: 3,
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textDecoration: 'none',
                      color: 'white',
                      transition: 'all 0.2s',
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-4px)',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <CheckCircleOutline sx={{ fontSize: 20, mb: 1, color: 'primary.light' }} />
                    <Typography variant='body2' sx={{ fontWeight: 500 }}>
                      {browser.name}
                    </Typography>
                  </Link>
                </Grid>
              ))}
            </Grid>

            <Typography variant='caption' sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              {t(
                'auth.browser.security_notice',
                'Security is our priority. Older browsers may lack critical protection.',
              )}
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default BrowserNotSupported
