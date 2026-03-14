// FILE: packages/modules/auth/src/screens/auth/signup/RegistrationScreen.tsx
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
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowForward,
  PersonAdd,
  Person,
  Google,
  Microsoft,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function RegistrationScreen() {
  const { t } = useTranslation('auth')
  const theme = useTheme()
  const navigate = useNavigate()
  
  // ── Local State ──────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!email || !password || !firstName || !lastName) {
      setError(t('signup.errorIncomplete', 'Please fill in all fields.'))
      return
    }

    if (!acceptTerms) {
      setError(t('signup.errorTerms', 'You must accept the terms of service.'))
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful registration
      navigate('/auth/verify-email', { state: { email } })
    } catch (err: any) {
      setError(err.message || t('signup.errorGeneric', 'An error occurred during registration. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialRegister = (provider: string) => {
    console.log(`Initiating social registration for ${provider}`)
    navigate(`/auth/sso/initiate?provider=${provider}&action=register`)
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
            <PersonAdd sx={{ fontSize: 32 }} />
          </Avatar>
        </Box>
        {/* ── SYSTEM PATTERN: h4 titles (OrganizationProfile L62) ── */}
        <Typography variant='h4' sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.027em' }}>
          {t('signup.createAccount', 'Create an account')}
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ fontWeight: 500 }}>
          {t('signup.joinAntigravity', 'Join Antigravity OS today')}
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

      <form onSubmit={handleRegister}>
        <Stack spacing={3}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <Box>
              {/* ── SYSTEM PATTERN: Section headings (OrganizationProfile L61) ── */}
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', ml: 1, mb: 1, display: 'block', color: 'text.secondary' }}>
                {t('signup.firstName', 'First Name')}
              </Typography>
              {/* ── SYSTEM PATTERN: MUI v6 API input props (OrganizationProfile L67) ── */}
              <TextField
                fullWidth
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={isLoading}
                autoComplete="given-name"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: alpha(theme.palette.background.paper, 0.6) },
                  },
                }}
              />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', ml: 1, mb: 1, display: 'block', color: 'text.secondary' }}>
                {t('signup.lastName', 'Last Name')}
              </Typography>
              <TextField
                fullWidth
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={isLoading}
                autoComplete="family-name"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 3, bgcolor: alpha(theme.palette.background.paper, 0.6) },
                  },
                }}
              />
            </Box>
          </Box>

          <Box>
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', ml: 1, mb: 1, display: 'block', color: 'text.secondary' }}>
              {t('signup.emailAddress', 'Email Address')}
            </Typography>
            <TextField
              fullWidth
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoComplete="email"
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
            <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', ml: 1, mb: 1, display: 'block', color: 'text.secondary' }}>
              {t('signup.password', 'Password')}
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="new-password"
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

          <FormControlLabel
            control={
              <Checkbox
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={isLoading}
                color="info"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {t('signup.iAgreeTo', 'I agree to the')}{' '}
                <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: 'text.primary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                  {t('signup.termsOfService', 'Terms of Service')}
                </Typography>
                {' '}{t('signup.and', 'and')}{' '}
                <Typography component="span" variant="body2" sx={{ fontWeight: 700, color: 'text.primary', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                  {t('signup.privacyPolicy', 'Privacy Policy')}
                </Typography>
              </Typography>
            }
            sx={{ mx: 0 }}
          />

          {/* ── SYSTEM PATTERN: CTA buttons (OrganizationProfile L58) ── */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isLoading || !email || !password || !firstName || !lastName || !acceptTerms}
            endIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ArrowForward />}
            sx={{
              py: 1.5,
              mt: 1,
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
            {isLoading ? t('signup.creatingAccount', 'Creating Account...') : t('signup.createAccountBtn', 'Create Account')}
          </Button>
        </Stack>
      </form>

      {/* ── SYSTEM PATTERN: Dividers (OrganizationProfile L65) ── */}
      <Divider sx={{ my: 4, opacity: 0.5 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {t('signup.orRegisterWith', 'OR REGISTER WITH')}
        </Typography>
      </Divider>

      <Stack spacing={2}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<Google sx={{ color: '#DB4437' }} />}
          onClick={() => handleSocialRegister('google')}
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
          startIcon={<Microsoft sx={{ color: '#00A4EF' }} />}
          onClick={() => handleSocialRegister('microsoft')}
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
      </Stack>

      <Box sx={{ mt: 5, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
          {t('signup.alreadyHaveAccount', 'Already have an account?')}{' '}
          <Typography
            component="span"
            variant="body2"
            onClick={() => navigate('/auth/signin')}
            sx={{
              fontWeight: 800,
              color: 'info.main',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            {t('signup.signInHere', 'Sign in here')}
          </Typography>
        </Typography>
      </Box>
    </Box>
  )
}
