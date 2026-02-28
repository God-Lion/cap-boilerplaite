import { useState, useCallback, useEffect } from 'react'
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
  Divider,
} from '@mui/material'
import {
  Visibility,
  VisibilityOff,
  Fingerprint,
  LockPerson,
  ArrowForward,
  Timer,
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, themeConfig, IStatus } from '@cap/platform-core'
import { startAuthentication } from '@simplewebauthn/browser'
import {
  useSignin,
  usePasskeyLogin,
  usePasskeyGetLoginOptions,
  useMfaLoginVerify,
} from '../../../hooks/useAuthQuery'
import { LoginRequest } from '../../../types/api.types'
import Path from '../path'

const DEFAULT_FORM_VALUES: LoginRequest = {
  email: '',
  password: '',
  rememberMe: false,
}

export default function LoginScreen() {
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
  const [mode, setMode] = useState<'login' | 'mfa'>('login')
  const [pendingMfaUser, setPendingMfaUser] = useState<{ userId?: number; email?: string } | null>(
    null,
  )
  const [mfaCode, setMfaCode] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number>(60)

  useEffect(() => {
    if (mode !== 'mfa') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [mode])

  const handleCloseStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, open: false }))
  }, [])

  const handleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const loginMutation = useSignin({
    onSuccess: (response) => {
      if (response.data.mfa_required) {
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
      setTimeout(() => navigate('/dashboard'), 1500)
    },
    onError: (error: any) => {
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
      setTimeout(() => navigate('/dashboard'), 1200)
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
      setTimeout(() => navigate('/dashboard'), 1500)
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

  const handleSocialLogin = useCallback((provider: string) => {
    const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3333'
    window.location.href = `${apiUrl}/api/auth/social/${provider}/redirect`
  }, [])

  const onSubmit = useCallback(
    (data: LoginRequest) => {
      loginMutation.mutate({ data })
    },
    [loginMutation],
  )

  const isMfaMode = mode === 'mfa'
  const countdownDisplay = new Date(Math.max(timeLeft, 0) * 1000).toISOString().substring(14, 19)

  const handleMfaDigitChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    if (!digit && value !== '') return

    const newCode = mfaCode.split('')
    newCode[index] = digit
    const finalCode = newCode.join('')
    setMfaCode(finalCode)

    if (digit && index < 5) {
      const next = document.getElementById(`mfa-digit-${index + 1}`)
      next?.focus()
    }
  }

  const handleMfaKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !mfaCode[index] && index > 0) {
      const prev = document.getElementById(`mfa-digit-${index - 1}`)
      prev?.focus()
    }
  }

  return (
    <>
      <title>
        {t('auth.login.title_page', 'Login')} - {themeConfig.templateName}
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
          py: { xs: 4, sm: 8 },
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Background Decoration */}
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
              `radial-gradient(circle at 15% 50%, ${alpha(
                theme.palette.primary.main,
                0.08,
              )}, transparent 25%), radial-gradient(circle at 85% 30%, ${alpha(
                theme.palette.primary.main,
                0.08,
              )}, transparent 25%)`,
          }}
        />

        <Backdrop
          open={
            loginMutation.isPending || mfaVerifyMutation.isPending || passkeyLoginMutation.isPending
          }
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
            borderRadius: { xs: 0, sm: '16px' },
            boxShadow: (theme) => `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            mx: { xs: 0, sm: 2 },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {isMfaMode ? (
              <Box
                sx={{
                  px: { xs: 3, sm: 5 },
                  py: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: '16px',
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      display: 'grid',
                      placeItems: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <LockPerson sx={{ color: 'primary.main', fontSize: 32 }} />
                  </Box>
                  <Typography
                    variant='h5'
                    sx={{ fontWeight: 800, mb: 1.5, letterSpacing: '-0.02em' }}
                  >
                    {t('auth.mfa.title')}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' sx={{ lineHeight: 1.6 }}>
                    {t('auth.mfa.verify_subtitle')}
                    <br />
                    <Box component='span' sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {pendingMfaUser?.email}
                    </Box>
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <TextField
                      key={index}
                      id={`mfa-digit-${index}`}
                      value={mfaCode[index] || ''}
                      onChange={(e) => handleMfaDigitChange(e.target.value, index)}
                      onKeyDown={(e) => handleMfaKeyDown(e, index)}
                      inputProps={{
                        maxLength: 1,
                        style: {
                          textAlign: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 700,
                          padding: '12px 0',
                        },
                      }}
                      sx={{
                        width: 52,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: (theme) => alpha(theme.palette.action.hover, 0.05),
                          '& fieldset': { borderColor: 'divider' },
                        },
                      }}
                    />
                  ))}
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
                    alignSelf: 'center',
                  }}
                >
                  <Timer sx={{ fontSize: 18, color: 'text.secondary' }} />
                  <Typography variant='caption' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    {t('auth.mfa.expires_in', { time: countdownDisplay })}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant='contained'
                  size='large'
                  onClick={handleMfaSubmit}
                  disabled={mfaCode.length !== 6 || mfaVerifyMutation.isPending}
                  sx={{ height: 52, borderRadius: '12px', fontWeight: 700, textTransform: 'none' }}
                >
                  {mfaVerifyMutation.isPending
                    ? t('auth.mfa.verifying')
                    : t('auth.mfa.button_verify')}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Button
                    variant='text'
                    onClick={handleResendCode}
                    disabled={timeLeft > 0}
                    sx={{ textTransform: 'none', fontWeight: 700 }}
                  >
                    {t('auth.mfa.resend_code')}
                  </Button>
                  <Divider sx={{ my: 3 }} />
                  <MuiLink
                    component='button'
                    onClick={handleBackToLogin}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      color: 'text.secondary',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    <ArrowForward sx={{ fontSize: 16, transform: 'rotate(180deg)' }} />
                    {t('auth.mfa.back_to_login')}
                  </MuiLink>
                </Box>
              </Box>
            ) : (
              <Box sx={{ px: { xs: 3, sm: 5 }, py: 6 }}>
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                  <Typography
                    variant='h4'
                    sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.025em' }}
                  >
                    {t('auth.login.title_welcome')}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {t('auth.login.subtitle_v2')}
                  </Typography>
                </Box>

                <Box
                  component='form'
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                >
                  <Box>
                    <Typography
                      component='label'
                      sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, mb: 1 }}
                    >
                      {t('auth.login.email_label')}
                    </Typography>
                    <Controller
                      name='email'
                      control={control}
                      rules={{ required: t('auth.login.email_required') }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder={t('auth.login.email_placeholder_v2')}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', height: 48 } }}
                        />
                      )}
                    />
                  </Box>

                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography component='label' sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {t('auth.login.password_label')}
                      </Typography>
                      <MuiLink
                        component={Link}
                        to={Path.forgotPassword}
                        sx={{ fontSize: '0.825rem', fontWeight: 700, textDecoration: 'none' }}
                      >
                        {t('auth.login.forgot_password')}
                      </MuiLink>
                    </Box>
                    <Controller
                      name='password'
                      control={control}
                      rules={{ required: t('auth.login.password_required') }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type={showPassword ? 'text' : 'password'}
                          placeholder='••••••••'
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton onClick={handleShowPassword} edge='end' size='small'>
                                  {showPassword ? (
                                    <Visibility sx={{ fontSize: 20 }} />
                                  ) : (
                                    <VisibilityOff sx={{ fontSize: 20 }} />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', height: 48 } }}
                        />
                      )}
                    />
                  </Box>

                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    size='large'
                    disabled={loginMutation.isPending}
                    sx={{
                      height: 52,
                      borderRadius: '12px',
                      fontWeight: 700,
                      textTransform: 'none',
                      mt: 1,
                    }}
                  >
                    {loginMutation.isPending
                      ? t('auth.login.button_signing_in')
                      : t('auth.login.button_login')}
                  </Button>

                  <Button
                    fullWidth
                    variant='outlined'
                    size='large'
                    startIcon={<Fingerprint />}
                    onClick={handlePasskeyLogin}
                    disabled={passkeyLoginMutation.isPending}
                    sx={{
                      height: 52,
                      borderRadius: '12px',
                      fontWeight: 700,
                      textTransform: 'none',
                      borderColor: 'divider',
                      color: 'text.primary',
                    }}
                  >
                    {t('auth.passkey.sign_in_with_passkey')}
                  </Button>
                </Box>

                <Box sx={{ my: 4 }}>
                  <Divider>
                    <Typography
                      variant='caption'
                      sx={{
                        px: 2,
                        color: 'text.disabled',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      {t('auth.login.or_continue_with')}
                    </Typography>
                  </Divider>
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      fullWidth
                      variant='outlined'
                      onClick={() => handleSocialLogin('google')}
                      startIcon={
                        <Box
                          component='img'
                          src='https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png'
                          sx={{ width: 20 }}
                        />
                      }
                      sx={{
                        height: 48,
                        borderRadius: '10px',
                        textTransform: 'none',
                        fontWeight: 600,
                        borderColor: 'divider',
                        color: 'text.primary',
                      }}
                    >
                      {t('auth.login.google')}
                    </Button>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 5, textAlign: 'center' }}>
                  <Typography variant='body2' color='text.secondary'>
                    {t('auth.login.no_account_prompt')}{' '}
                    <MuiLink
                      component={Link}
                      to={Path.signup}
                      sx={{ fontWeight: 700, textDecoration: 'none' }}
                    >
                      {t('auth.login.sign_up_link')}
                    </MuiLink>
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Support Links */}
        <Box sx={{ mt: 6, display: 'flex', gap: 4 }}>
          <MuiLink
            href='#'
            sx={{
              fontSize: '0.875rem',
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { color: 'text.primary' },
            }}
          >
            {t('auth.common.help_center')}
          </MuiLink>
          <MuiLink
            href='#'
            sx={{
              fontSize: '0.875rem',
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { color: 'text.primary' },
            }}
          >
            {t('auth.common.privacy_policy')}
          </MuiLink>
        </Box>
      </Container>
    </>
  )
}
