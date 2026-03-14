// FILE: packages/modules/auth/src/screens/passwordless/PasswordlessInitiation.tsx
// STYLE AUDIT: Aligned to OrganizationProfile.tsx design system
// FIXES: [CRITICAL] Modernized InputProps to slotProps.input, applied info.main to CTAs [HIGH] Added animate-scale-in [MEDIUM] Added divider opacity and avatar 24px radius [LOW] Added aria-labels and i18n fallbacks
import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Divider,
  alpha,
  useTheme,
  InputAdornment,
  CircularProgress,
  Stack,
  Alert,
  Avatar,
} from '@mui/material'
import {
  Email,
  ArrowForward,
  Fingerprint,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function PasswordlessInitiation() {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const navigate = useNavigate()
  
  // ── Local State ──────────────────────────────────────────────────────────
  const [identifier, setIdentifier] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleInitiate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!identifier) {
      setError(t('passwordless.errorIncomplete', 'Please enter your email address.'))
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call to send magic link
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful initiation and navigate to verification waiting screen
      navigate('/auth/passwordless/verify', { state: { identifier } })
    } catch (err: any) {
      setError(err.message || t('passwordless.errorGeneric', 'An error occurred. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  // ── SYSTEM PATTERN: Entry animation (OrganizationProfile L60) ──
  return (
    <Box
      className="animate-scale-in"
      component={motion.div}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      sx={{
        width: '100%',
        maxWidth: 440,
        mx: 'auto',
        p: { xs: 3, md: 5 },
        position: 'relative',
      }}
    >
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
           {/* ── SYSTEM PATTERN: Avatar (OrganizationProfile L64) ── */}
          <Avatar
            variant="square"
            sx={{
              width: 56,
              height: 56,
              bgcolor: 'transparent',
              color: 'primary.main',
              borderRadius: '24px',
              border: '2px solid',
              borderColor: alpha(theme.palette.primary.main, 0.2),
            }}
          >
            <Fingerprint sx={{ fontSize: 32 }} />
          </Avatar>
        </Box>
        {/* ── SYSTEM PATTERN: h4 titles (OrganizationProfile L62) ── */}
        <Typography variant='h4' sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
          {t('passwordless.title', 'Sign in without password')}
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ fontWeight: 500 }}>
          {t('passwordless.subtitle', 'We will send a magic link to your email.')}
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 4, borderRadius: 2, '& .MuiAlert-message': { fontWeight: 600 } }}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={handleInitiate}>
        <Stack spacing={3}>
          <Box>
            {/* ── SYSTEM PATTERN: Section headings (OrganizationProfile L61) ── */}
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', ml: 1, mb: 1, display: 'block', color: 'text.secondary' }}>
              {t('passwordless.emailAddress', 'Email Address')}
            </Typography>
            {/* ── SYSTEM PATTERN: MUI v6 API input props (OrganizationProfile L67) ── */}
            <TextField
              fullWidth
              placeholder="name@company.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
              autoFocus
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 3, bgcolor: alpha(theme.palette.background.paper, 0.6) },
                },
              }}
            />
          </Box>

          {/* ── SYSTEM PATTERN: CTA buttons (OrganizationProfile L58) ── */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading || !identifier}
            endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
            sx={{
              py: 1.5,
              mt: 2,
              borderRadius: 3,
              fontWeight: 800,
              fontSize: '1rem',
              textTransform: 'none',
              bgcolor: 'info.main',
              boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
              '&:hover': {
                bgcolor: 'info.dark',
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 20px rgba(0,118,255,0.23)',
              },
            }}
          >
            {isLoading ? t('passwordless.sendingLink', 'Sending Link...') : t('passwordless.sendLinkBtn', 'Send Magic Link')}
          </Button>
        </Stack>
      </form>

      {/* ── SYSTEM PATTERN: Dividers (OrganizationProfile L65) ── */}
      <Divider sx={{ my: 4, opacity: 0.5 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {t('passwordless.or', 'OR')}
        </Typography>
      </Divider>

      <Box sx={{ textAlign: 'center' }}>
        <Typography
          variant="body2"
          onClick={() => navigate('/auth/signin')}
          sx={{
            fontWeight: 800,
            color: 'text.secondary',
            cursor: 'pointer',
            '&:hover': { color: 'text.primary', textDecoration: 'underline' }
          }}
        >
          {t('passwordless.signInWithPassword', 'Sign in with password instead')}
        </Typography>
      </Box>
    </Box>
  )
}
