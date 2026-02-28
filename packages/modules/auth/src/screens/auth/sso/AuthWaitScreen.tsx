import {
  Box,
  Container,
  Typography,
  CircularProgress,
  alpha,
  useTheme,
  LinearProgress,
} from '@mui/material'
import { Security, Lock } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export default function AuthWaitScreen() {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic Background Elements */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.03,
          backgroundImage: `radial-gradient(${theme.palette.primary.main} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <Container maxWidth='xs' sx={{ position: 'relative', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 6, position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant='indeterminate'
              size={120}
              thickness={2}
              sx={{
                color: theme.palette.primary.main,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: theme.palette.primary.main,
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Security sx={{ fontSize: 48 }} />
              </motion.div>
            </Box>
          </Box>

          <Typography variant='h5' fontWeight={800} gutterBottom sx={{ letterSpacing: -0.5 }}>
            {t('auth.sso.authenticating', 'Authenticating Securely')}
          </Typography>
          <Typography variant='body1' color='text.secondary' sx={{ mb: 6 }}>
            {t(
              'auth.sso.wait_description',
              'Building a secure connection with your identity provider. This will only take a moment.',
            )}
          </Typography>

          <Box sx={{ px: 4 }}>
            <LinearProgress
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
                <Lock sx={{ fontSize: 14 }} />
                <Typography variant='caption' fontWeight={700}>
                  SSL SECURE
                </Typography>
              </Box>
              <Typography
                variant='caption'
                color='primary'
                fontWeight={800}
                sx={{ letterSpacing: 1 }}
              >
                PROTOCOL: OIDC/SAML
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>

      {/* Footer Branding */}
      <Box sx={{ position: 'absolute', bottom: 40, width: '100%', textAlign: 'center' }}>
        <Typography
          variant='caption'
          color='text.secondary'
          sx={{ opacity: 0.5, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}
        >
          Nexus Protocol Engine v2.4
        </Typography>
      </Box>
    </Box>
  )
}
