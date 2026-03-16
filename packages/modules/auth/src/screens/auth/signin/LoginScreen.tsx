// FILE: packages/modules/auth/src/screens/auth/signin/LoginScreen.tsx
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
  IconButton,
  CircularProgress,
  Stack,
  Alert,
  Avatar,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowForward,
  VpnKey,
  Google,
  GitHub,
  Microsoft,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function LoginScreen() {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  
  // ── Local State ──────────────────────────────────────────────────────────
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Extract redirect url if available
  const redirectUrl = new URLSearchParams(location.search).get('redirect') || '/admin/dashboard'

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!identifier || !password) {
      setError(t('login.errorIncomplete', 'Please enter both email and password.'))
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful login
      navigate(redirectUrl)
    } catch (err: any) {
      setError(err.message || t('login.errorGeneric', 'An error occurred during sign in. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    // Initiate SSO / Social login
    console.log(`Initiating social login for ${provider}`)
    navigate(`/auth/sso/initiate?provider=${provider}`)
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
            <VpnKey sx={{ fontSize: 32 }} />
          </Avatar>
        </Box>
        {/* ── SYSTEM PATTERN: h4 titles (OrganizationProfile L62) ── */}
        <Typography variant='h4' sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
          {t('login.welcomeBack', 'Welcome back')}
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ fontWeight: 500 }}>
          {t('login.signIntoAccount', 'Sign in to your Antigravity OS account')}
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

      <form onSubmit={handleLogin}>
        <Stack spacing={3}>
          <Box>
            {/* ── SYSTEM PATTERN: Section headings (OrganizationProfile L61) ── */}
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', ml: 1, mb: 1, display: 'block', color: 'text.secondary' }}>
              {t('login.emailAddress', 'Email Address')}
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

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, px: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', color: 'text.secondary' }}>
                {t('login.password', 'Password')}
              </Typography>
              <Typography
                variant="caption"
                onClick={() => navigate('/auth/recovery')}
                sx={{
                  fontWeight: 700,
                  color: 'info.main',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                {t('login.forgotPassword', 'Forgot password?')}
              </Typography>
            </Box>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                      </IconButton>
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
            disabled={isLoading || !identifier || !password}
            endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
            sx={{
              py: 1.5,
              mt: 2,
              borderRadius: 3,
              fontWeight: 800,
              fontSize: '1rem',
              textTransform: 'none',
              bgcolor: 'info.main',
              boxShadow: (theme) => `0 4px 14px ${alpha(theme.palette.info.main, 0.4)}`,
              '&:hover': {
                bgcolor: 'info.dark',
                transform: 'translateY(-1px)',
                boxShadow: (theme) => `0 6px 20px ${alpha(theme.palette.info.main, 0.23)}`,
              },
            }}
          >
            {isLoading ? t('login.signingIn', 'Signing In...') : t('login.signInAccount', 'Sign In')}
          </Button>
        </Stack>
      </form>

      {/* ── SYSTEM PATTERN: Dividers (OrganizationProfile L65) ── */}
      <Divider sx={{ my: 4, opacity: 0.5 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {t('login.orContinueWith', 'OR CONTINUE WITH')}
        </Typography>
      </Divider>

      <Stack spacing={2}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Google sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#DB4437' }} />}
          onClick={() => handleSocialLogin('google')}
          disabled={isLoading}
          sx={{
            py: 1.2,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: 'none',
            color: 'text.primary',
            borderColor: alpha(theme.palette.divider, 0.8),
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: alpha(theme.palette.action.hover, 0.5),
            }
          }}
        >
          Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Microsoft sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#00A4EF' }} />}
          onClick={() => handleSocialLogin('microsoft')}
          disabled={isLoading}
          sx={{
            py: 1.2,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: 'none',
            color: 'text.primary',
            borderColor: alpha(theme.palette.divider, 0.8),
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: alpha(theme.palette.action.hover, 0.5),
            }
          }}
        >
          Microsoft
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GitHub sx={{ color: theme.palette.mode === 'dark' ? '#fff' : '#333' }} />}
          onClick={() => handleSocialLogin('github')}
          disabled={isLoading}
          sx={{
            py: 1.2,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: 'none',
            color: 'text.primary',
            borderColor: alpha(theme.palette.divider, 0.8),
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: alpha(theme.palette.action.hover, 0.5),
            }
          }}
        >
          GitHub
        </Button>
      </Stack>

      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {t('login.dontHaveAccount', "Don't have an account?")}{' '}
          <Typography
            component="span"
            variant="body2"
            onClick={() => navigate('/auth/signup')}
            sx={{
              fontWeight: 800,
              color: 'info.main',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {t('login.signUpNow', 'Sign up now')}
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}
