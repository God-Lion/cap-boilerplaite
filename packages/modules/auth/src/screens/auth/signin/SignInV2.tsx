import { useState, useCallback, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Snackbar,
  Backdrop,
  CircularProgress,
  Link as MuiLink,
  alpha,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Fingerprint,
  LockPerson,
  ArrowForward,
  Timer,
} from '@mui/icons-material'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, themeConfig, IStatus, Roles, useAppStore } from '@cap/platform-core'
import { startAuthentication } from '@simplewebauthn/browser'
import {
  useSignin,
  usePasskeyLogin,
  usePasskeyGetLoginOptions,
  useMfaLoginVerify,
  useSsoDiscovery,
} from '../../../hooks/useAuthQuery'
import { useInterval } from '../../../hooks/useInterval'
import { usePasskeyAutofill } from '../../../hooks/usePasskeyAutofill'
import { LoginRequest } from '../../../types/api.types'
import authService from '../../../services/auth.service'
import Path from '../../path'

const DEFAULT_FORM_VALUES: LoginRequest = {
  email: 'admin@example.com',
  password: 'password',
  // email: 'mascayiti@gmail.com',
  // password: 'mascayiti',
  rememberMe: false,
}

export default function SignInV2() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { control, handleSubmit, getValues } = useForm<LoginRequest>({
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const [status, setStatus] = useState<IStatus>({
    open: false,
    type: '',
    state: '',
    msg: '',
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [mode, setMode] = useState<'login' | 'mfa' | 'locked'>('login')
  const [pendingMfaUser, setPendingMfaUser] = useState<{ userId?: number; email?: string } | null>(
    null,
  )
  const [mfaCode, setMfaCode] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number>(60)

  // -- SSO Discovery Logic --
  const emailValue = useWatch({ control, name: 'email' })
  const [debouncedEmail, setDebouncedEmail] = useState('')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedEmail(emailValue || '')
    }, 500)
    return () => clearTimeout(handler)
  }, [emailValue])

  const { data: ssoResponse, isLoading: isDiscovering } = useSsoDiscovery(debouncedEmail)
  const ssoData = ssoResponse?.data
  const isSsoProvider = ssoData?.provider === 'saml' || ssoData?.provider === 'oidc'
  const showPasswordField = !ssoData?.provider || ssoData.provider === 'password'

  useInterval(
    () => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    },
    mode === 'mfa' || mode === 'locked' ? 1000 : null,
  )

  const handleCloseStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, open: false }))
  }, [])

  const handleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const loginMutation = useSignin({
    onSuccess: (response) => {
      if (response?.data?.mfa_required) {
        setPendingMfaUser({ userId: response.data.userId, email: getValues('email') })
        setMode('mfa')
        setMfaCode('')
        setTimeLeft(60)
        setStatus({
          open: true,
          type: 'info',
          state: 'info',
          msg: t('auth.login.mfa_required'),
        })
        return
      }

      setStatus({
        open: true,
        type: 'success',
        state: 'success',
        msg: t('auth.login.login_successful'),
      })

      // Determine redirect path based on role
      const userData = response?.data?.user || response?.data
      const userRole = userData?.role as Roles

      let redirectPath = '/auth/account'
      const ADMIN_ROLES = [Roles.ADMIN, Roles.SUPERADMINEMPLOYEE, Roles.SUPERADMIN]

      if (userRole && ADMIN_ROLES.includes(userRole)) {
        redirectPath = Path.admin.users
      } else if (userRole === Roles.PARTICIPANT) {
        redirectPath = '/provider'
      }

      setTimeout(() => navigate(redirectPath), 1500)
    },
    onError: async (error: any) => {
      if (error.response?.status === 423) {
        setMode('locked')
        const retryAfterSeconds = parseInt(error.response.headers?.['retry-after'], 10)
        if (retryAfterSeconds) {
          setTimeLeft(retryAfterSeconds)
        }
        return
      }

      const attemptsRemaining = error.response?.data?.attemptsRemaining
      if (error.response?.status === 401 && attemptsRemaining !== undefined) {
        // Track failed login on 401
        try {
          await authService.trackFailedLogin({ email: getValues('email') })
        } catch {
          // Silent catch for tracking failure
        }

        setStatus({
          open: true,
          type: 'warning',
          state: 'warning',
          msg: `${attemptsRemaining} attempt${attemptsRemaining !== 1 ? 's' : ''} remaining before lockout.`,
        })
        return
      }

      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          t('auth.login.login_failed'),
      })
    },
  })

  const mfaVerifyMutation = useMfaLoginVerify({
    onSuccess: () => {
      setStatus({
        open: true,
        type: 'success',
        state: 'success',
        msg: t('auth.mfa.verification_successful'),
      })
      setMode('login')
      setMfaCode('')
      setPendingMfaUser(null)
      setTimeout(() => {
        const userData = useAppStore.getState().user as any
        const userRole = userData?.role || userData?.user?.role

        let redirectPath = '/auth/account'
        const ADMIN_ROLES = [Roles.ADMIN, Roles.SUPERADMINEMPLOYEE, Roles.SUPERADMIN]

        if (ADMIN_ROLES.includes(userRole as any)) {
          redirectPath = Path.admin.users
        } else if (userRole === Roles.PARTICIPANT) {
          redirectPath = '/provider'
        }

        navigate(redirectPath)
      }, 1200)
    },
    onError: (error: any) => {
      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg:
          error.response?.data?.detail ||
          error.response?.data?.message ||
          t('auth.mfa.invalid_code'),
      })
    },
  })

  const passkeyLoginMutation = usePasskeyLogin({
    onSuccess: () => {
      setStatus({
        open: true,
        type: 'success',
        state: 'success',
        msg: t('auth.login.passkey_login_successful'),
      })
      setTimeout(() => {
        const userData = useAppStore.getState().user as any
        const userRole = (userData?.role || userData?.user?.role) as Roles

        let redirectPath = '/auth/account'
        const ADMIN_ROLES = [Roles.ADMIN, Roles.SUPERADMINEMPLOYEE, Roles.SUPERADMIN]

        if (userRole && ADMIN_ROLES.includes(userRole)) {
          redirectPath = Path.admin.users
        } else if (userRole === Roles.PARTICIPANT) {
          redirectPath = '/provider'
        }

        navigate(redirectPath)
      }, 1500)
    },
    onError: (error: any) => {
      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg: error.response?.data?.message || t('auth.login.passkey_login_failed'),
      })
    },
  })

  const passkeyGetOptionsMutation = usePasskeyGetLoginOptions()

  // -- Passkey Autofill (Conditional UI) --
  const handlePasskeyAutofillSuccess = useCallback(() => {
    setStatus({
      open: true,
      type: 'success',
      state: 'success',
      msg: t('auth.login.passkey_login_successful'),
    })
    setTimeout(() => {
      const userData = useAppStore.getState().user as any
      const userRole = (userData?.role || userData?.user?.role) as Roles

      let redirectPath = '/auth/account'
      const ADMIN_ROLES = [Roles.ADMIN, Roles.SUPERADMINEMPLOYEE, Roles.SUPERADMIN]

      if (userRole && ADMIN_ROLES.includes(userRole)) {
        redirectPath = Path.admin.users
      } else if (userRole === Roles.PARTICIPANT) {
        redirectPath = '/provider'
      }

      navigate(redirectPath)
    }, 1000)
  }, [navigate, t])

  const { isAvailable: isPasskeyAutofillAvailable } = usePasskeyAutofill(
    handlePasskeyAutofillSuccess,
  )

  const handlePasskeyLogin = useCallback(async () => {
    try {
      const email = getValues('email')
      const optionsResponse = await passkeyGetOptionsMutation.mutateAsync(email)
      const options = optionsResponse.data

      const authenticationResponse = await startAuthentication(options)

      passkeyLoginMutation.mutate(authenticationResponse)
    } catch (error: any) {
      if (error.name !== 'NotAllowedError') {
        setStatus({
          open: true,
          type: 'error',
          state: 'error',
          msg: error.message || t('auth.login.login_failed'),
        })
      }
    }
  }, [getValues, passkeyLoginMutation, passkeyGetOptionsMutation, t])

  const handleMfaSubmit = useCallback(() => {
    if (!pendingMfaUser?.userId) {
      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg: t('auth.mfa.user_missing'),
      })
      setMode('login')
      return
    }
    mfaVerifyMutation.mutate({ userId: pendingMfaUser.userId, code: mfaCode })
  }, [mfaCode, mfaVerifyMutation, pendingMfaUser, t])

  const handleResendCode = useCallback(() => {
    setTimeLeft(60)
    setStatus({
      open: true,
      type: 'info',
      state: 'info',
      msg: t('auth.mfa.code_resent'),
    })
  }, [t])

  const handleBackToLogin = useCallback(() => {
    setMode('login')
    setMfaCode('')
    setPendingMfaUser(null)
  }, [])

  const handleSocialLogin = useCallback(
    (provider: string) => {
      const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3333'
      navigate(`${apiUrl}/api/auth/social/${provider}/redirect`)
    },
    [navigate],
  )

  const onSubmit = useCallback(
    (data: LoginRequest) => {
      // If SSO is needed, handle redirection
      if (ssoData && (ssoData.provider === 'saml' || ssoData.provider === 'oidc')) {
        const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3333'
        // Implement redirect logic here to SSO endpoints
        // Example: /api/auth/sso/saml/redirect?orgId=... or /api/auth/sso/oidc/redirect?clientId=...
        if (ssoData.provider === 'saml' && ssoData.organizationId) {
          setTimeout(() => {
            window.location.assign(
              `${apiUrl}/api/auth/sso/saml/redirect?organizationId=${ssoData.organizationId}`,
            )
          }, 0)
        } else if (ssoData.provider === 'oidc' && ssoData.clientId) {
          setTimeout(() => {
            window.location.assign(
              `${apiUrl}/api/auth/sso/oidc/redirect?clientId=${ssoData.clientId}`,
            )
          }, 0)
        }
        return
      }

      loginMutation.mutate({ data })
    },
    [loginMutation, ssoData],
  )

  const isMfaMode = mode === 'mfa'
  const isLockedMode = mode === 'locked'
  const countdownDisplay = new Date(Math.max(timeLeft, 0) * 1000).toISOString().substring(14, 19)

  // MFA input refs for 6-digit boxes
  const mfaInputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))

  const handleMfaKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !mfaCode[index] && index > 0) {
      mfaInputRefs.current[index - 1]?.focus()
    }
  }

  const handleMfaDigitChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    if (!digit && value !== '') return

    const newCode = mfaCode.split('')
    newCode[index] = digit
    const finalCode = newCode.join('')
    setMfaCode(finalCode)

    if (digit && index < 5) {
      mfaInputRefs.current[index + 1]?.focus()
    }
  }

  return (
    <>
      <title>
        {t('auth.login.title_page')} - {themeConfig.templateName}
      </title>
      <meta
        name='keywords'
        content={t('auth.login.keywords', { appName: themeConfig.templateName })}
      />

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
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Background Gradient Decoration */}
        <Box
          sx={{
            position: 'fixed',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            zIndex: -1,
            opacity: 0.4,
            pointerEvents: 'none',
            background: (theme) =>
              `radial-gradient(circle at 15% 50%, ${alpha(theme.palette.primary.main, 0.08)}, transparent 25%), radial-gradient(circle at 85% 30%, ${alpha(theme.palette.primary.main, 0.08)}, transparent 25%)`,
          }}
        />

        <Backdrop
          open={
            loginMutation.isPending || mfaVerifyMutation.isPending || passkeyLoginMutation.isPending
          }
          sx={{ color: 'primary.contrastText', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>

        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={status.open}
          autoHideDuration={6000}
          onClose={handleCloseStatus}
        >
          <MAlert onClose={handleCloseStatus} severity={status.type} sx={{ width: '100%' }}>
            {status.msg}
          </MAlert>
        </Snackbar>

        <Card
          sx={{
            width: '100%',
            maxWidth: '480px',
            borderRadius: { xs: 0, sm: '12px' },
            boxShadow: (theme) => theme.shadows[4],
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            mx: { xs: 0, sm: 2 },
          }}
        >
          <CardContent sx={{ padding: 0 }}>
            {isLockedMode ? (
              <Box
                sx={{
                  px: { xs: 3, sm: 4 },
                  py: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                  textAlign: 'center',
                }}
              >
                <MAlert severity='error' sx={{ textAlign: 'left' }}>
                  Account temporarily locked. Try again in {Math.ceil(timeLeft / 60)} minutes.
                  <br />
                  <Box component='span' sx={{ fontWeight: 600 }}>
                    Countdown: {countdownDisplay}
                  </Box>
                </MAlert>
                <Button variant='text' onClick={handleBackToLogin}>
                  Back to Login
                </Button>
              </Box>
            ) : isMfaMode ? (
              <Box
                sx={{
                  px: { xs: 3, sm: 4 },
                  py: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      display: 'grid',
                      placeItems: 'center',
                      boxShadow: (theme) => `inset 0 2px 4px ${alpha(theme.palette.common.black, theme.palette.mode === 'dark' ? 0.2 : 0.05)}`,
                    }}
                  >
                    <LockPerson sx={{ color: 'primary.main', fontSize: 32 }} />
                  </Box>
                  <Box>
                    <Typography
                      variant='h5'
                      sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 1 }}
                    >
                      {t('auth.mfa.title')}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.6 }}>
                      {t('auth.mfa.prompt', {
                        email: '',
                      })}
                      <br />
                      <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {pendingMfaUser?.email || 'your email'}
                      </Box>
                    </Typography>
                  </Box>
                </Box>

                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: { xs: 1, sm: 1.5 },
                      mb: 2,
                    }}
                  >
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <TextField
                        key={index}
                        inputRef={(el) => (mfaInputRefs.current[index] = el)}
                        id={`mfa-digit-${index}`}
                        value={mfaCode[index] || ''}
                        onChange={(e) => handleMfaDigitChange(e.target.value, index)}
                        onKeyDown={(e) => handleMfaKeyDown(e, index)}
                        placeholder='-'
                        inputProps={{
                          maxLength: 1,
                          inputMode: 'numeric',
                          style: {
                            textAlign: 'center',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            padding: '12px 0',
                          },
                        }}
                        sx={{
                          width: { xs: 48, sm: 56 },
                          '& .MuiOutlinedInput-root': {
                            height: { xs: 56, sm: 64 },
                            borderRadius: '12px',
                            bgcolor: (theme) => alpha(theme.palette.action.hover, 0.05),
                            '& fieldset': {
                              borderColor: 'divider',
                              borderWidth: '2px',
                            },
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: '2px',
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    bgcolor: (theme) => alpha(theme.palette.action.hover, 0.05),
                    py: 1,
                    px: 2,
                    borderRadius: '20px',
                    border: '1px solid',
                    borderColor: 'divider',
                    alignSelf: 'center',
                  }}
                >
                  <Timer sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant='body2' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {t('auth.mfa.expires_in')}{' '}
                    <Box
                      component='span'
                      sx={{ color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}
                    >
                      {countdownDisplay}
                    </Box>
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant='contained'
                  disabled={mfaCode.length !== 6 || mfaVerifyMutation.isPending}
                  onClick={handleMfaSubmit}
                  endIcon={<ArrowForward />}
                  sx={{
                    height: 52,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: (theme) => `0 10px 20px ${alpha(theme.palette.primary.main, 0.2)}`,
                    '&:hover': {
                      boxShadow: (theme) => `0 12px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                    },
                  }}
                >
                  {mfaVerifyMutation.isPending
                    ? t('auth.mfa.verifying')
                    : t('auth.mfa.verify_button')}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1.5 }}>
                    {t('auth.mfa.no_email')}{' '}
                    <Button
                      variant='text'
                      onClick={handleResendCode}
                      disabled={timeLeft > 0 || mfaVerifyMutation.isPending}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        p: 0,
                        minWidth: 0,
                        verticalAlign: 'baseline',
                        '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
                      }}
                    >
                      {t('auth.mfa.resend_code')}
                    </Button>
                  </Typography>
                  <Box sx={{ height: '1px', bgcolor: 'divider', my: 2 }} />
                  <MuiLink
                    component='button'
                    type='button'
                    onClick={handleBackToLogin}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      color: 'text.secondary',
                      fontWeight: 600,
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      mx: 'auto',
                      '&:hover': { color: 'text.primary' },
                    }}
                  >
                    <Box
                      component='span'
                      sx={{ transform: 'rotate(180deg)', display: 'inline-flex' }}
                    >
                      <ArrowForward sx={{ fontSize: 16 }} />
                    </Box>
                    {t('auth.mfa.back_to_login')}
                  </MuiLink>
                </Box>
              </Box>
            ) : (
              <>
                {/* Header Section */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    px: { xs: 3, sm: 4 },
                    pt: 4,
                    pb: 0,
                  }}
                ></Box>

                {/* Form Section */}
                <Box
                  sx={{
                    px: { xs: 3, sm: 4 },
                    pt: 3,
                    pb: 4,
                  }}
                >
                  <Box
                    component='form'
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
                  >
                    {/* Email Field */}
                    <Box>
                      <Typography
                        component='label'
                        sx={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: 'text.primary',
                          mb: 1,
                          fontFamily: 'inherit',
                        }}
                      >
                        {t('auth.login.email_label')}
                      </Typography>
                      <Controller
                        name='email'
                        control={control}
                        rules={{
                          required: t('auth.login.email_required'),
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: t('auth.login.invalid_email'),
                          },
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            type='email'
                            fullWidth
                            autoComplete='username webauthn'
                            placeholder={t('auth.login.email_placeholder_v2')}
                            InputProps={{
                              endAdornment: isPasskeyAutofillAvailable && (
                                <InputAdornment position='end'>
                                  <Fingerprint
                                    sx={{
                                      fontSize: 20,
                                      color: 'primary.main',
                                      opacity: 0.7,
                                    }}
                                  />
                                </InputAdornment>
                              ),
                            }}
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                height: 48,
                                borderRadius: '8px',
                                bgcolor: 'background.paper',
                                '& fieldset': {
                                  borderColor: 'divider',
                                },
                                '&:hover fieldset': {
                                  borderColor: 'primary.main',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: 'primary.main',
                                  borderWidth: '1px',
                                },
                              },
                                '& input::placeholder': {
                                  color: 'text.secondary',
                                  opacity: 0.7,
                                },
                            }}
                          />
                        )}
                      />
                    </Box>

                    {/* Password Field */}
                    {showPasswordField && (
                      <Box>
                        <Typography
                          component='label'
                          sx={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'text.primary',
                            mb: 1,
                            fontFamily: 'inherit',
                          }}
                        >
                          {t('auth.login.password_label')}
                        </Typography>
                        <Controller
                          name='password'
                          control={control}
                          rules={{
                            required: t('auth.login.password_required'),
                          }}
                          render={({ field, fieldState }) => (
                            <TextField
                              {...field}
                              type={showPassword ? 'text' : 'password'}
                              fullWidth
                              autoComplete='current-password'
                              placeholder={t('auth.common.passwordPlaceholder')}
                              error={!!fieldState.error}
                              helperText={fieldState.error?.message}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    <IconButton
                                      onClick={handleShowPassword}
                                      edge='end'
                                      size='small'
                                    >
                                      {showPassword ? (
                                        <Visibility
                                          sx={{ fontSize: 20, color: 'text.secondary' }}
                                        />
                                      ) : (
                                        <VisibilityOff
                                          sx={{ fontSize: 20, color: 'text.secondary' }}
                                        />
                                      )}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  height: 48,
                                  borderRadius: '8px',
                                  bgcolor: 'background.paper',
                                  '& fieldset': {
                                    borderColor: 'divider',
                                  },
                                  '&:hover fieldset': {
                                    borderColor: 'primary.main',
                                  },
                                  '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                    borderWidth: '1px',
                                  },
                                },
                                '& input::placeholder': {
                                  color: 'text.secondary',
                                  opacity: 0.7,
                                },
                              }}
                            />
                          )}
                        />
                      </Box>
                    )}

                    {/* Forgot Password Link - Only show if not SSO */}
                    {showPasswordField && (
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <MuiLink
                          component={Link}
                          to={Path.auth.forgotPassword}
                          sx={{
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontFamily: 'inherit',
                            '&:hover': {
                              color: 'primary.dark',
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {t('auth.login.forgot_password')}
                        </MuiLink>
                      </Box>
                    )}

                    {/* Primary Actions */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        disabled={loginMutation.isPending}
                        sx={{
                          height: 48,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          '&:focus': {
                            boxShadow: (theme) =>
                              `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}`,
                          },
                        }}
                      >
                        {loginMutation.isPending || isDiscovering
                          ? isDiscovering
                            ? t('auth.login.button_loading_sso', 'Checking...')
                            : t('auth.login.button_signing_in')
                          : isSsoProvider
                            ? t('auth.login.button_sso_continue', 'Continue with SSO')
                            : t('auth.login.button_login')}
                      </Button>

                      <Button
                        fullWidth
                        variant='outlined'
                        startIcon={<Fingerprint sx={{ fontSize: 20 }} />}
                        onClick={handlePasskeyLogin}
                        disabled={loginMutation.isPending || passkeyLoginMutation.isPending}
                        sx={{
                          height: 48,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          borderColor: 'divider',
                          color: 'text.primary',
                          fontFamily: 'inherit',
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.action.hover, 0.04),
                            borderColor: 'divider',
                          },
                          '&:focus': {
                            boxShadow: (theme) =>
                              `0 0 0 4px ${alpha(theme.palette.action.hover, 0.05)}`,
                          },
                          '& .MuiButton-startIcon': {
                            color: 'primary.main',
                          },
                        }}
                      >
                        {passkeyLoginMutation.isPending
                          ? t('auth.passkey.authenticating')
                          : t('auth.passkey.sign_in_with_passkey')}
                      </Button>
                    </Box>
                  </Box>

                  {/* Divider */}
                  <Box sx={{ position: 'relative', my: 3 }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          width: '100%',
                          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        position: 'relative',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant='caption'
                        sx={{
                          bgcolor: 'background.paper',
                          px: 1.5,
                          fontSize: '0.75rem',
                          color: 'text.secondary',
                          fontFamily: 'inherit',
                          textTransform: 'uppercase',
                        }}
                      >
                        {t('auth.login.or_continue_with')}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Social Login */}
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 6 }}>
                      <Button
                        fullWidth
                        variant='outlined'
                        startIcon={
                          <Box
                            component='svg'
                            sx={{ height: 20, width: 20 }}
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                              fill='#4285F4'
                            />
                            <path
                              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                              fill='#34A853'
                            />
                            <path
                              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                              fill='#FBBC05'
                            />
                            <path
                              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                              fill='#EA4335'
                            />
                          </Box>
                        }
                        onClick={() => handleSocialLogin('google')}
                        sx={{
                          height: 48,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          borderColor: 'divider',
                          color: 'text.primary',
                          fontFamily: 'inherit',
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.action.hover, 0.04),
                            borderColor: 'divider',
                          },
                        }}
                      >
                        {t('auth.login.google')}
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Button
                        fullWidth
                        variant='outlined'
                        startIcon={
                          <Box
                            component='svg'
                            sx={{ height: 20, width: 20 }}
                            fill='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.05-.015-2.055-3.33.72-4.035-1.605-4.035-1.605-.54-1.38-1.335-1.755-1.335-1.755-1.085-.735.09-.72.09-.72 1.2.09 1.83 1.23 1.83 1.23 1.065 1.815 2.805 1.29 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.28-1.56 3.3-1.245 3.3-1.245.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
                          </Box>
                        }
                        onClick={() => handleSocialLogin('github')}
                        sx={{
                          height: 48,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          borderColor: 'divider',
                          color: 'text.primary',
                          fontFamily: 'inherit',
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette.action.hover, 0.04),
                            borderColor: 'divider',
                          },
                        }}
                      >
                        {t('auth.login.github')}
                      </Button>
                    </Grid>
                  </Grid>

                  {/* Sign Up Link */}
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography
                      variant='body2'
                      component='span'
                      sx={{
                        fontSize: '0.875rem',
                        color: 'text.secondary',
                        fontFamily: 'inherit',
                      }}
                    >
                      {t('auth.login.no_account_prompt')}{' '}
                    </Typography>
                    <MuiLink
                      component={Link}
                      to={Path.auth.signup}
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: 'primary.main',
                        textDecoration: 'none',
                        fontFamily: 'inherit',
                        '&:hover': {
                          color: 'primary.dark',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {t('auth.login.sign_up_link')}
                    </MuiLink>
                  </Box>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
