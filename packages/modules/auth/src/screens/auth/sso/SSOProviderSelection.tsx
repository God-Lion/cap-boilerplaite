import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  alpha,
  useTheme,
  Grid,
  TextField,
  InputAdornment,
  Paper,
  Divider,
} from '@mui/material'
import { Business, Email, ArrowForward, InfoOutlined } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

export default function SSOProviderSelection() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [email, setEmail] = useState('')

  const detectedProvider = useMemo(() => {
    const domain = email.split('@')[1]
    if (domain === 'google.com') {
      return { name: 'Google Workspace', type: 'OIDC' }
    } else if (domain === 'microsoft.com') {
      return { name: 'Azure AD', type: 'SAML' }
    }
    return null
  }, [email])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `radial-gradient(circle at 0% 0%, ${alpha(theme.palette.primary.main, 0.08)} 0%, transparent 50%), 
                     radial-gradient(circle at 100% 100%, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 50%)`,
        p: 3,
      }}
    >
      <Container maxWidth='sm'>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Avatar
              src='/app-logo.png'
              sx={{
                width: 64,
                height: 64,
                mx: 'auto',
                mb: 2,
                boxShadow: theme.shadows[4],
              }}
            />
            <Typography variant='h4' fontWeight={800} gutterBottom>
              {t('auth.sso.enterprise_login', 'Enterprise Sign-In')}
            </Typography>
            <Typography variant='body1' color='text.secondary'>
              {t('auth.sso.hrd_subtitle', 'Enter your work email to continue to your provider')}
            </Typography>
          </Box>

          <Card
            sx={{
              borderRadius: '24px',
              p: 1,
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
              overflow: 'visible',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <TextField
                fullWidth
                label={t('common.work_email', 'Work Email Address')}
                placeholder='name@company.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Email color='primary' />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '16px', height: 64, fontSize: '1.1rem' },
                }}
                sx={{ mb: 3 }}
              />

              <AnimatePresence mode='wait'>
                {detectedProvider ? (
                  <motion.div
                    key='detected'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: '20px',
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            backgroundColor: 'white',
                            color: 'primary.main',
                            width: 48,
                            height: 48,
                            boxShadow: theme.shadows[1],
                          }}
                        >
                          <Business />
                        </Avatar>
                        <Box>
                          <Typography variant='subtitle1' fontWeight={700}>
                            {detectedProvider.name}
                          </Typography>
                          <Typography
                            variant='caption'
                            color='text.secondary'
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                          >
                            {t('auth.sso.detected_protocol', 'Detected')} {detectedProvider.type}{' '}
                            {t('auth.sso.authentication', 'Authentication')}
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        variant='contained'
                        endIcon={<ArrowForward />}
                        sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700 }}
                      >
                        {t('common.continue', 'Continue')}
                      </Button>
                    </Paper>
                  </motion.div>
                ) : (
                  <motion.div key='not-detected' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <Button
                      fullWidth
                      variant='contained'
                      disabled={!email}
                      sx={{
                        height: 60,
                        borderRadius: '16px',
                        fontSize: '1rem',
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.2)}`,
                      }}
                    >
                      {t('auth.sso.find_provider', 'Find My Provider')}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <Box sx={{ mt: 4 }}>
                <Divider>
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{ px: 2, textTransform: 'uppercase', letterSpacing: 1 }}
                  >
                    {t('auth.sso.or_select_manually', 'Or select manually')}
                  </Typography>
                </Divider>
              </Box>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                {[
                  { id: 'okta', name: 'Okta' },
                  { id: 'onelogin', name: 'OneLogin' },
                  { id: 'ping', name: 'Ping Identity' },
                ].map((p) => (
                  <Grid key={p.id} size={{ xs: 4 }}>
                    <Button
                      fullWidth
                      variant='outlined'
                      sx={{
                        height: 64,
                        borderRadius: '12px',
                        borderColor: alpha(theme.palette.divider, 0.1),
                        '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.05) },
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                      }}
                    >
                      <Business fontSize='small' color='disabled' />
                      <Typography variant='caption' fontWeight={700} color='text.secondary'>
                        {p.name}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: 'text.secondary',
                cursor: 'pointer',
              }}
            >
              <InfoOutlined fontSize='small' />
              <Typography variant='caption' fontWeight={600}>
                {t('auth.sso.what_is_sso', 'What is Enterprise Single Sign-On?')}
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
