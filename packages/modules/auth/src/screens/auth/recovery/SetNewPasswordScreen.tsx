import { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
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
import { LockReset, Visibility, VisibilityOff, ArrowBack, VerifiedUser } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Alert as MAlert,
  themeConfig,
  IStatus,
  FetchResponse,
  HttpError,
  IUserResponseEmailResetPassword,
} from '@cap/platform-core'
import { ResetPasswordRequest } from '../../../types/api.types'
import { useResetPassword } from '../../../hooks/useAuthQuery'
import authService from '../../../services/auth.service'
import Path from '../path'

interface ResetPasswordFormData {
  token: string
  new_password: string
  confirmPassword: string
}

const SUPPORT_EMAIL = 'support@example.com'

export default function SetNewPasswordScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { email } = useParams()
  const [searchParams] = useSearchParams()
  const signature = searchParams.get('signature')

  const [loading, setLoading] = useState<boolean>(true)
  const [signatureValid, setSignatureValid] = useState<boolean | null>(null)
  const [token, setToken] = useState<string>('')
  const [status, setStatus] = useState<IStatus>({
    open: false,
    type: '',
    state: '',
    msg: '',
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const { control, handleSubmit, setValue } = useForm<ResetPasswordFormData>({
    defaultValues: {
      token: '',
      new_password: '',
      confirmPassword: '',
    },
  })

  const handleCloseStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, open: false }))
  }, [])

  const handleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const resetPasswordMutation = useResetPassword({
    onSuccess: () => {
      setStatus({
        open: true,
        type: 'success',
        state: 'success',
        msg: t('auth.reset_password.success_msg', 'Password has been successfully reset.'),
      })
      setTimeout(() => navigate('/auth/password-reset-success'), 2000)
    },
    onError: (error: any) => {
      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg:
          error.response?.data?.detail ||
          t('auth.reset_password.error_msg', 'Error resetting password.'),
      })
    },
  })

  useEffect(() => {
    async function verifySignature() {
      try {
        setLoading(true)
        const response: FetchResponse<IUserResponseEmailResetPassword> =
          await authService.verifyResetPassword(email || '', signature ?? '')

        if (response.status === 202 && response.data.isSignatureValid) {
          setSignatureValid(true)
          setToken(response.data.token || '')
          setValue('token', response.data.token || '')
        } else {
          setSignatureValid(false)
        }
      } catch (error) {
        setSignatureValid(false)
        console.error('Signature verification error:', error)
      } finally {
        setLoading(false)
      }
    }
    verifySignature()
  }, [email, signature, setValue])

  const onSubmit = useCallback(
    (data: ResetPasswordFormData) => {
      resetPasswordMutation.mutate({
        data: {
          token: data.token,
          email: email || '',
          password: data.new_password,
          confirmPassword: data.confirmPassword,
        },
      })
    },
    [email, resetPasswordMutation],
  )

  if (loading) {
    return (
      <Container sx={{ height: '100dvh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (signatureValid === false) {
    return (
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
          p: 3,
        }}
      >
        <Card
          sx={{ maxWidth: 480, width: '100%', textAlign: 'center', p: 4, borderRadius: '16px' }}
        >
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'error.lighter',
                color: 'error.main',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
              }}
            >
              <LockReset fontSize='large' />
            </Box>
          </Box>
          <Typography variant='h5' fontWeight={700} gutterBottom>
            {t('auth.reset_password.invalid_link_title', 'Invalid or Expired Link')}
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 4 }}>
            {t(
              'auth.reset_password.invalid_link_desc',
              'This password reset link is invalid or has expired. Please request a new one.',
            )}
          </Typography>
          <Button
            component={Link}
            to={Path.forgotPassword}
            variant='contained'
            fullWidth
            sx={{ height: 48, borderRadius: '10px' }}
          >
            {t('auth.reset_password.request_new_link', 'Request New Link')}
          </Button>
          <Box sx={{ mt: 3 }}>
            <MuiLink
              component={Link}
              to={Path.signin}
              sx={{ color: 'text.secondary', fontSize: '0.875rem' }}
            >
              {t('auth.common.backToLogin', 'Back to log in')}
            </MuiLink>
          </Box>
        </Card>
      </Container>
    )
  }

  return (
    <>
      <title>
        {t('auth.reset_password.title_page', 'Set New Password')} - {themeConfig.templateName}
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
              `radial-gradient(circle at 85% 50%, ${alpha(
                theme.palette.primary.main,
                0.08,
              )}, transparent 25%), radial-gradient(circle at 15% 30%, ${alpha(
                theme.palette.primary.main,
                0.08,
              )}, transparent 25%)`,
          }}
        />

        <Backdrop
          open={resetPasswordMutation.isPending}
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
            maxWidth: '500px',
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
            <Box sx={{ px: { xs: 3, sm: 5 }, py: 6 }}>
              <Box sx={{ textAlign: 'center', mb: 5 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '14px',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    display: 'grid',
                    placeItems: 'center',
                    mx: 'auto',
                    mb: 2.5,
                  }}
                >
                  <VerifiedUser sx={{ color: 'primary.main', fontSize: 28 }} />
                </Box>
                <Typography variant='h4' sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.025em' }}>
                  {t('auth.reset_password.title', 'Set new password')}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {t(
                    'auth.reset_password.subtitle',
                    "Please choose a strong password that you haven't used before.",
                  )}
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
                    {t('auth.reset_password.email_label', 'Email Address')}
                  </Typography>
                  <TextField
                    fullWidth
                    value={email || ''}
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        height: 48,
                        bgcolor: 'action.hover',
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    component='label'
                    sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, mb: 1 }}
                  >
                    {t('auth.reset_password.new_password_label', 'New Password')}
                  </Typography>
                  <Controller
                    name='new_password'
                    control={control}
                    rules={{
                      required: t('auth.reset_password.password_required', 'Password is required'),
                      minLength: {
                        value: 8,
                        message: t(
                          'auth.register.password_min_length',
                          'Password must be at least 8 characters',
                        ),
                      },
                    }}
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

                <Box>
                  <Typography
                    component='label'
                    sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, mb: 1 }}
                  >
                    {t('auth.reset_password.confirm_password_label', 'Confirm Password')}
                  </Typography>
                  <Controller
                    name='confirmPassword'
                    control={control}
                    rules={{
                      required: t(
                        'auth.reset_password.confirm_password_required',
                        'Please confirm your password',
                      ),
                      validate: (value, values) =>
                        value === values.new_password ||
                        t('auth.register.passwords_must_match', 'Passwords do not match'),
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
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
                  disabled={resetPasswordMutation.isPending}
                  sx={{
                    height: 52,
                    borderRadius: '12px',
                    fontWeight: 700,
                    textTransform: 'none',
                    mt: 1,
                  }}
                >
                  {resetPasswordMutation.isPending
                    ? t('auth.reset_password.button_resetting', 'Resetting...')
                    : t('auth.reset_password.button_reset', 'Reset password')}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Support Links */}
        <Box sx={{ mt: 6, display: 'flex', gap: 4 }}>
          <MuiLink
            component={Link}
            to={Path.signin}
            sx={{
              fontSize: '0.875rem',
              color: 'text.secondary',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              '&:hover': { color: 'text.primary' },
            }}
          >
            <ArrowBack sx={{ fontSize: 16 }} />
            {t('auth.common.backToLogin', 'Back to log in')}
          </MuiLink>
        </Box>
      </Container>
    </>
  )
}

