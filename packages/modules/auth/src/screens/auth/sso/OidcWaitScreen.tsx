// FILE: packages/modules/auth/src/screens/auth/sso/OidcWaitScreen.tsx
// RULES APPLIED: mui-component-standards.md, react-component-patterns.md
// FIXES: Added header; implemented entry motion; modernized typography to match h4 pulse; standardized color palette; translated all strings
// AUDIT: CRITICAL ✓  HIGH ✓  MEDIUM ✓

import { Box, Container, Typography, alpha, LinearProgress, useTheme } from '@mui/material'
import Security from '@mui/icons-material/Security'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'
import { motion } from 'framer-motion'

export default function OidcWaitScreen() {
  const { t } = useTranslation()
  const theme = useTheme()

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <title>
        {t('auth.sso.oidc_wait_title', 'SSO Authentication')} - {themeConfig.templateName}
      </title>

      {/* Subtle Background Pattern */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.02,
          backgroundImage: `radial-gradient(${theme.palette.primary.main} 1.5px, transparent 1.5px)`,
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth='xs' sx={{ position: 'relative', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '24px',
              bgcolor: alpha(theme.palette.primary.main, 0.08),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
              mx: 'auto',
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1),
              position: 'relative',
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Security sx={{ color: 'primary.main', fontSize: 40 }} aria-hidden='true' />
            </motion.div>
          </Box>

          <Typography
            variant='h4'
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.027em',
              mb: 2,
              color: 'text.primary',
            }}
          >
            {t('auth.sso.redirecting_title', 'Authenticating with SSO')}
          </Typography>

          <Typography
            variant='body1'
            color='text.secondary'
            sx={{ mb: 5, lineHeight: 1.6, px: 2, fontWeight: 500 }}
          >
            {t(
              'auth.sso.redirecting_description',
              'Please wait while we securely redirect you to your identity provider. This will only take a moment.',
            )}
          </Typography>

          <Box sx={{ width: '100%', mb: 4, px: 4 }}>
            <LinearProgress
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.primary.main, 0.06),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 3,
                  boxShadow: `0 0 10px ${alpha(theme.palette.primary.main, 0.4)}`,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              px: 2.5,
              py: 1,
              borderRadius: '50px',
              bgcolor: alpha(theme.palette.success.main, 0.04),
              border: '1px solid',
              borderColor: alpha(theme.palette.success.main, 0.1),
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: 'success.main',
                boxShadow: `0 0 8px ${theme.palette.success.main}`,
              }}
            />
            <Typography
              variant='caption'
              sx={{
                fontWeight: 800,
                color: 'success.dark',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {t('auth.sso.secure_connection', 'Secure end-to-end encrypted connection')}
            </Typography>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
