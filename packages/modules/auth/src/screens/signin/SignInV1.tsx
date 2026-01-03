// cspell:ignore Didn
import { useState, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Link as HLink,
  Snackbar,
  TextField,
  Typography,
  Divider,
  Card,
  CardContent,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Fingerprint, Lock, TimerOutlined, ArrowForward, ArrowBack } from '@mui/icons-material'
import { useTheme, alpha } from '@mui/material/styles'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert } from '@cap/platform-core'
import { themeConfig } from '@cap/platform-core'

import { IStatus, Roles, IAuth } from '@cap/platform-core'
import { useLogin, useMfaLoginVerify, LoginRequest, ADMIN_ROLES } from '../../index'
import { useAuth } from '@cap/platform-core'

type LoginStep = 'LOGIN' | 'MFA'

const DEFAULT_FORM_VALUES: LoginRequest = {
  email: 'user@example.com',
  password: 'password123',
  remember_me: false,
}

// Utility functions
const normalizeRole = (role: string | number): string => {
  return typeof role === 'string' ? role.toUpperCase() : String(role)
}

const isUserRole = (role: string): boolean => {
  return role === String(Roles.USER) || role === 'USER'
}

const isAdminRole = (role: string): boolean => {
  return ADMIN_ROLES.includes(role as any)
}

const getNavigationPath = (role: string): string => {
  if (isUserRole(role)) return '/'
  if (isAdminRole(role)) return '/admin/dashboard'
  return '/dashboard'
}

export default function SignIn() {
  const { t } = useTranslation()
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const controlForm = useForm<LoginRequest>({
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const [status, setStatus] = useState<IStatus>({
    open: location.state?.data?.page === 'close-cashier',
    type: location.state?.data?.type || '',
    state: location.state?.data?.state || '',
    msg: location.state?.data?.msg || '',
  })

  const [step, setStep] = useState<LoginStep>('LOGIN')
  const [mfaUserId, setMfaUserId] = useState<number | null>(null)
  const [mfaCode, setMfaCode] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleCloseStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, open: false }))
  }, [])

  // const handleShowPassword = useCallback(() => {
  //   setShowPassword((prev) => !prev)
  // }, [])

  const handleLoginSuccess = useCallback(
    async (response: any) => {
      if (response.data.mfa_required) {
        setMfaUserId(response.data.userId)
        setStep('MFA')
        return
      }

      const { user, token, refresh_token } = response.data
      const normalizedRole = normalizeRole(user.role || '')

      // Update Zustand store with auth data
      const authData: IAuth = {
        ...user,
        user,
        token,
        refreshToken: refresh_token,
      }

      // Update the store with user data
      setUser(authData)

      // Show success message
      setStatus({
        open: true,
        type: 'success',
        state: 'success',
        msg: t('auth.login.login_successful'),
      })

      // Small delay for smooth transition
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Navigate based on role
      const navigationPath = getNavigationPath(normalizedRole)
      navigate(navigationPath, { replace: true })
    },
    [navigate, setUser, t],
  )

  const handleLoginError = useCallback(
    (error: any) => {
      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg: error.response?.data?.detail || t('auth.login.login_failed'),
      })
    },
    [t],
  )

  const loginMutation = useLogin({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  })

  const mfaVerifyMutation = useMfaLoginVerify({
    onSuccess: handleLoginSuccess,
    onError: handleLoginError,
  })

  const handleMfaVerify = useCallback(() => {
    if (mfaUserId && mfaCode.length === 6) {
      mfaVerifyMutation.mutate({ userId: mfaUserId, code: mfaCode })
    }
  }, [mfaUserId, mfaCode, mfaVerifyMutation])

  const onSubmit = useCallback(
    (data: LoginRequest) => {
      loginMutation.mutate({ data })
    },
    [loginMutation],
  )

  return (
    <>
      <title>
        {t('auth.login.title_page')} - {themeConfig.templateName}
      </title>
      <meta
        name='description'
        content={`${t('auth.login.meta_desc')} - ${themeConfig.templateName}`}
      />
      <meta
        name='keywords'
        content={`sign in, login, authentication, ${themeConfig.templateName}`}
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
          // bgcolor: '#f6f6f8',
          py: { xs: 6, sm: 12 },
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        {/* Subtle grid background pattern placeholder */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            // backgroundImage: 'radial-gradient(#dbdfe6 0.5px, transparent 0.5px)',
            backgroundSize: '24px 24px',
            maskImage: 'linear-gradient(180deg, white, rgba(255, 255, 255, 0))',
            opacity: 0.2,
            pointerEvents: 'none',
          }}
        />

        <Backdrop
          open={loginMutation.isPending}
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <CircularProgress color='inherit' />
        </Backdrop>

        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
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
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '480px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: 0, sm: '12px' },
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            border: '1px solid',
            borderColor: '#f1f1f1',
            // bgcolor: '#ffffff',
            mx: { xs: 0, sm: 4 },
            ...(step === 'MFA' && {
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                // bgcolor: '#135bec',
                zIndex: 1,
              },
            }),
          }}
        >
          <CardContent
            sx={{
              padding: { xs: '40px 24px', sm: '40px' },
            }}
          >
            {step === 'LOGIN' ? (
              <>
                {/* Header Section */}
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    mb: 4,
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'rgba(19, 91, 236, 0.1)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    <Lock sx={{ color: '#135bec', fontSize: 30 }} />
                  </Box>
                  <Typography
                    variant='h4'
                    fontWeight='700'
                    textAlign='center'
                    sx={{
                      fontSize: '1.5rem',
                      lineHeight: '2.25rem',
                      color: '#111318',
                      fontFamily: 'inherit',
                      letterSpacing: '-0.025em',
                    }}
                  >
                    Welcome back
                  </Typography>
                  <Typography
                    variant='body1'
                    color='#616f89'
                    textAlign='center'
                    sx={{ mt: 1, fontSize: '1rem', fontFamily: 'inherit', lineHeight: '1.5rem' }}
                  >
                    Please enter your details to sign in.
                  </Typography>
                </Box>

                {/* Passkey Button */}
                <Box sx={{ mb: 4 }}>
                  <Button
                    fullWidth
                    variant='contained'
                    startIcon={<Fingerprint sx={{ fontSize: 24 }} />}
                    sx={{
                      // bgcolor: '#f0f2f4',
                      color: '#111318',
                      boxShadow: 'none',
                      textTransform: 'none',
                      fontWeight: 700,
                      height: 48,
                      borderRadius: '8px',
                      fontSize: '1rem',
                      fontFamily: 'inherit',
                      gap: 1,
                      '&:hover': {
                        // bgcolor: '#e1e4e8',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    Sign in with Passkey
                  </Button>
                </Box>

                {/* Divider */}
                <Box sx={{ position: 'relative', mb: 4 }}>
                  <Divider
                    sx={{
                      '&::before, &::after': {
                        // borderColor: '#e5e7eb',
                      },
                    }}
                  >
                    <Typography
                      variant='body2'
                      sx={{
                        color: '#616f89',
                        px: 2,
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        // bgcolor: '#ffffff',
                      }}
                    >
                      Or continue with
                    </Typography>
                  </Divider>
                </Box>

                {/* Login Form */}
                <Box
                  component='form'
                  onSubmit={controlForm.handleSubmit(onSubmit)}
                  noValidate
                  autoComplete='off'
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography
                      variant='body2'
                      fontWeight='500'
                      sx={{
                        mb: 1,
                        color: '#111318',
                        display: 'block',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                      }}
                    >
                      Email
                    </Typography>
                    <Controller
                      name='email'
                      control={controlForm.control}
                      rules={{
                        required: {
                          value: true,
                          message: t('auth.login.email_required'),
                        },
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t('auth.login.invalid_email'),
                        },
                      }}
                      render={({ field, formState }) => (
                        <TextField
                          {...field}
                          required
                          type='email'
                          fullWidth
                          autoComplete='email'
                          placeholder='Enter your email address'
                          error={formState?.errors?.email !== undefined}
                          helperText={formState?.errors?.email?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              height: 56,
                              bgcolor: '#ffffff',
                              '& fieldset': {
                                borderColor: '#dbdfe6',
                              },
                              '&:hover fieldset': {
                                borderColor: '#135bec',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#135bec',
                                borderWidth: '2px',
                              },
                              '& input::placeholder': {
                                color: '#616f89',
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant='body2'
                      fontWeight='500'
                      sx={{
                        mb: 1,
                        color: '#111318',
                        display: 'block',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                      }}
                    >
                      Password
                    </Typography>
                    <Controller
                      name='password'
                      control={controlForm.control}
                      rules={{
                        required: {
                          value: true,
                          message: t('auth.login.password_required'),
                        },
                      }}
                      render={({ field, formState }) => (
                        <TextField
                          {...field}
                          required
                          type={showPassword ? 'text' : 'password'}
                          fullWidth
                          autoComplete='current-password'
                          placeholder='••••••••'
                          error={formState?.errors?.password !== undefined}
                          helperText={formState?.errors?.password?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              height: 56,
                              bgcolor: '#ffffff',
                              '& fieldset': {
                                borderColor: '#dbdfe6',
                              },
                              '&:hover fieldset': {
                                borderColor: '#135bec',
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: '#135bec',
                                borderWidth: '2px',
                              },
                              '& input::placeholder': {
                                color: '#616f89',
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      )}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <HLink
                        component={Link}
                        to='/auth/forgot-password'
                        sx={{
                          textDecoration: 'none',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: '#135bec',
                          fontFamily: 'inherit',
                          '&:hover': {
                            color: '#2563eb',
                            textDecoration: 'none',
                          },
                        }}
                      >
                        Forgot password?
                      </HLink>
                    </Box>
                  </Box>

                  <Button
                    type='submit'
                    fullWidth
                    variant='contained'
                    size='large'
                    disabled={loginMutation.isPending}
                    sx={{
                      height: 48,
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 700,
                      fontSize: '1rem',
                      bgcolor: '#135bec',
                      color: '#ffffff',
                      boxShadow: '0 4px 6px -1px rgba(19, 91, 236, 0.2)',
                      fontFamily: 'inherit',
                      '&:hover': {
                        bgcolor: '#1d4ed8',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {loginMutation.isPending ? 'Sign In...' : 'Sign In'}
                  </Button>

                  {/* Social Login Buttons */}
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid size={{ xs: 6 }}>
                      <Button
                        fullWidth
                        variant='outlined'
                        startIcon={
                          <svg height='20' viewBox='0 0 24 24' width='20' fill='currentColor'>
                            <path d='M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z' />
                          </svg>
                        }
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 700,
                          height: 48,
                          borderColor: '#dbdfe6',
                          color: '#111318',
                          py: 1.5,
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          '&:hover': {
                            bgcolor: '#f9fafb',
                            borderColor: '#dbdfe6',
                          },
                        }}
                      >
                        Google
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Button
                        fullWidth
                        variant='outlined'
                        startIcon={
                          <svg height='20' viewBox='0 0 24 24' width='20' fill='currentColor'>
                            <path
                              d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                              fillRule='evenodd'
                            />
                          </svg>
                        }
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 700,
                          height: 48,
                          borderColor: '#dbdfe6',
                          color: '#111318',
                          py: 1.5,
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          '&:hover': {
                            bgcolor: '#f9fafb',
                            borderColor: '#dbdfe6',
                          },
                        }}
                      >
                        GitHub
                      </Button>
                    </Grid>
                  </Grid>

                  {/* Signup Link */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 1,
                      mt: 3,
                    }}
                  >
                    <Typography
                      variant='body2'
                      sx={{ color: '#616f89', fontSize: '0.875rem', fontFamily: 'inherit' }}
                    >
                      Don&apos;t have an account?
                    </Typography>
                    <HLink
                      component={Link}
                      to='/auth/sign-up'
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        textDecoration: 'none',
                        color: '#135bec',
                        fontFamily: 'inherit',
                        '&:hover': {
                          color: '#2563eb',
                        },
                      }}
                    >
                      Sign up
                    </HLink>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    bgcolor: '#eef2ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <Lock sx={{ color: '#135bec', fontSize: 30 }} />
                </Box>
                <Typography
                  variant='h4'
                  fontWeight='700'
                  textAlign='center'
                  gutterBottom
                  sx={{ fontSize: '1.5rem', color: '#111318', fontFamily: 'inherit' }}
                >
                  Two-Step Verification
                </Typography>
                <Typography
                  variant='body1'
                  sx={{
                    // color: '#616f89',
                    fontSize: '1rem',
                    fontFamily: 'inherit',
                  }}
                  textAlign='center'
                  mb={4}
                  maxWidth={300}
                >
                  Enter the 6-digit code we sent to{' '}
                  <Box
                    component='span'
                    fontWeight='700'
                    sx={{ color: '#111318', fontFamily: 'inherit' }}
                  >
                    us**@example.com
                  </Box>
                </Typography>

                <Box sx={{ display: 'flex', gap: 1.5, mb: 4 }}>
                  {[...Array(6)].map((_, i) => (
                    <TextField
                      key={i}
                      variant='outlined'
                      sx={{
                        width: 50,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          '& fieldset': {
                            // borderColor: '#dbdfe6',
                          },
                          '&:hover fieldset': {
                            // borderColor: '#135bec',
                          },
                          '&.Mui-focused fieldset': {
                            // borderColor: '#135bec',
                            borderWidth: '2px',
                          },
                          '& input': {
                            textAlign: 'center',
                            p: 1.5,
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            fontFamily: 'inherit',
                          },
                        },
                      }}
                      value={mfaCode[i] || ''}
                      onChange={(e) => {
                        const val = e.target.value.slice(-1)
                        if (/^\d?$/.test(val)) {
                          const newCode = mfaCode.split('')
                          newCode[i] = val
                          setMfaCode(newCode.join(''))
                          if (val && i < 5) {
                            const next = e.target
                              .closest('.MuiBox-root')
                              ?.querySelectorAll('input')[i + 1]
                            ;(next as HTMLInputElement)?.focus()
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !mfaCode[i] && i > 0) {
                          const prev = (e.target as HTMLInputElement)
                            .closest('.MuiBox-root')
                            ?.querySelectorAll('input')[i - 1]
                          ;(prev as HTMLInputElement)?.focus()
                        }
                      }}
                      inputProps={{ maxLength: 1 }}
                    />
                  ))}
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 3,
                    py: 1,
                    bgcolor: '#eef2ff',
                    borderRadius: 10,
                    mb: 4,
                  }}
                >
                  <TimerOutlined sx={{ fontSize: 18,
                  //  color: '#135bec'

                   }} />
                  <Typography
                    variant='body2'
                    fontWeight='700'
                    // color='#135bec'
                    sx={{ fontFamily: 'inherit' }}
                  >
                    Code expires in 04:59
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant='contained'
                  size='large'
                  onClick={handleMfaVerify}
                  disabled={mfaVerifyMutation.isPending || mfaCode.length < 6}
                  endIcon={<ArrowForward />}
                  sx={{
                    height: 48,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    // bgcolor: '#135bec',
                    // color: '#ffffff',
                    boxShadow: '0 4px 6px -1px rgba(19, 91, 236, 0.2)',
                    fontFamily: 'inherit',
                    '&:hover': {
                      // bgcolor: '#1d4ed8',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {mfaVerifyMutation.isPending ? 'Verifying...' : 'Verify'}
                </Button>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2.5,
                    mt: 4,
                  }}
                >
                  <Typography
                    variant='body2'
                    sx={{ 
                      // color: '#616f89', 
                      fontSize: '0.875rem', fontFamily: 'inherit' }}
                  >
                    Didn&apos;t receive the email?{' '}
                    <HLink
                      component='button'
                      sx={{
                        fontWeight: 700,
                        textDecoration: 'none',
                        // color: '#135bec',
                        border: 'none',
                        bgcolor: 'transparent',
                        p: 0,
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                      }}
                    >
                      Resend Code
                    </HLink>
                  </Typography>

                  <Button
                    variant='text'
                    startIcon={<ArrowBack />}
                    onClick={() => {
                      setStep('LOGIN')
                      setMfaCode('')
                    }}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 700,
                      color: '#616f89',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: '#111318',
                      },
                    }}
                  >
                    Back to Login
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Footer Note */}
        <Box sx={{ mt: 8, textAlign: 'center', px: 4 }}>
          <Typography
            variant='caption'
            sx={{ color: '#9ca3af', fontSize: '0.75rem', fontFamily: 'inherit' }}
          >
            © 2024 SecureApp Inc. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </>
  )
}
