import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Divider,
  alpha,
  useTheme,
  Grid,
  Paper,
} from '@mui/material'
import { Google, GitHub, Microsoft, ArrowForward, Lock } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function OIDCLoginPrompt() {
  const { t } = useTranslation()
  const theme = useTheme()

  const providers = [
    { id: 'google', name: 'Google', icon: <Google />, color: '#EA4335' },
    { id: 'github', name: 'GitHub', icon: <GitHub />, color: '#333' },
    { id: 'microsoft', name: 'Microsoft', icon: <Microsoft />, color: '#00A4EF' },
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
        p: 3,
      }}
    >
      <Container maxWidth='sm'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Card
            sx={{
              borderRadius: '28px',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: 140,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.1,
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />
              <Avatar
                src='/app-logo-white.png'
                sx={{
                  width: 80,
                  height: 80,
                  border: '4px solid rgba(255,255,255,0.2)',
                  backgroundColor: 'white',
                }}
              />
            </Box>

            <CardContent sx={{ p: { xs: 4, md: 6 }, mt: -2, position: 'relative' }}>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant='h4' fontWeight={800} gutterBottom>
                  {t('auth.sso.login_title', 'Log in to Nexus')}
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                  {t('auth.sso.login_subtitle', 'Choose your preferred way to continue')}
                </Typography>
              </Box>

              {/* User Identity Highlight */}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  mb: 4,
                  borderRadius: '16px',
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08),
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Avatar sx={{ width: 48, height: 48, backgroundColor: theme.palette.primary.main }}>
                  JD
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant='subtitle1' fontWeight={700}>
                    John Doe
                  </Typography>
                  <Typography variant='caption' color='text.secondary'>
                    john.doe@example.com
                  </Typography>
                </Box>
                <ArrowForward fontSize='small' color='primary' />
              </Paper>

              <Box sx={{ position: 'relative', mb: 4 }}>
                <Divider>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ px: 2, textTransform: 'uppercase', letterSpacing: 1 }}
                  >
                    {t('auth.sso.or_providers', 'Or use a provider')}
                  </Typography>
                </Divider>
              </Box>

              <Grid container spacing={2}>
                {providers.map((provider) => (
                  <Grid key={provider.id} size={{ xs: 12 }}>
                    <Button
                      fullWidth
                      variant='outlined'
                      size='large'
                      startIcon={provider.icon}
                      sx={{
                        height: 56,
                        borderRadius: '14px',
                        textTransform: 'none',
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        borderColor: alpha(theme.palette.divider, 0.2),
                        '&:hover': {
                          borderColor: provider.color,
                          backgroundColor: alpha(provider.color, 0.04),
                        },
                      }}
                    >
                      {t(`auth.sso.continue_with_${provider.id}`, `Continue with ${provider.name}`)}
                    </Button>
                  </Grid>
                ))}
              </Grid>

              <Box
                sx={{
                  mt: 5,
                  pt: 3,
                  borderTop: `1px solid ${theme.palette.divider}`,
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'text.secondary',
                  }}
                >
                  <Lock sx={{ fontSize: 16 }} />
                  <Typography variant='caption' fontWeight={600}>
                    {t('auth.sso.trusted_auth', 'Trusted Authentication Protocol')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  )
}
