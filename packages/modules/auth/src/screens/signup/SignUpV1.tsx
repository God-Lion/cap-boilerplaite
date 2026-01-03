import { useState, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Link as HLink,
  InputAdornment,
  IconButton,
  Snackbar,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Divider,
  Card,
  CardContent,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import {
  Visibility,
  VisibilityOff,
  EmailOutlined,
  Google,
  Facebook,
  Twitter,
  PersonOutline,
  LockOutlined,
  GitHub,
} from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, AdaptiveLogo } from '@cap/platform-core'
import { themeConfig } from '@cap/platform-core'

import { IStatus, Roles, IAuth } from '@cap/platform-core'
import { useRegister, RegisterRequest, ADMIN_ROLES } from '../../index'
import { useAuth } from '@cap/platform-core'

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

interface SignUpFormData {
  firstname: string
  lastname: string
  email: string
  password: string
  confirmPassword: string
  terms: boolean
}

const DEFAULT_FORM_VALUES: SignUpFormData = {
  firstname: 'zico',
  lastname: 'bornelus',
  email: 'borneluszico@gmail.com',
  password: 'mascayiti',
  confirmPassword: 'mascayiti',
  terms: true,
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

export default function SignUpV1() {
  const { t } = useTranslation()
  const theme = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const controlForm = useForm<SignUpFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
  })

  // Watch password for confirm validation and strength (if we add strength meter later)
  const passwordValue = useWatch({ control: controlForm.control, name: 'password' })

  const [status, setStatus] = useState<IStatus>({
    open: location.state?.data?.page === 'close-cashier',
    type: location.state?.data?.type || 'success',
    state: location.state?.data?.state || '',
    msg: location.state?.data?.msg || '',
  })

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const handleCloseStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, open: false }))
  }, [])

  const handleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const handleShowConfirmPassword = useCallback(() => {
    setShowConfirmPassword((prev) => !prev)
  }, [])

  const handleRegisterSuccess = useCallback(
    async (response: any) => {
      // Depending on API, registration might return user/token or just success.
      // If it returns user/token, we can auto-login.
      // If verification is needed, we should tell the user.

      // Assuming similar behavior to existing SignUp or direct login:
      // For now, let's assume we redirect to login or show success.
      // But looking at SignIn logic, `setUser` is used.
      // Let's use the same logic as SignIn if the response provides token, otherwise show message.

      const { user, token, refresh_token } = response.data || {}

      if (user && token) {
        const normalizedRole = normalizeRole(user.role || '')
        const authData: IAuth = {
          ...user,
          user,
          token,
          refreshToken: refresh_token,
        }
        setUser(authData)

        setStatus({
          open: true,
          type: 'success',
          state: 'success',
          msg: t('auth.login.login_successful'),
        })

        await new Promise((resolve) => setTimeout(resolve, 100))
        const navigationPath = getNavigationPath(normalizedRole)
        navigate(navigationPath, { replace: true })
      } else {
        // Just verification sent or success message
        setStatus({
          open: true,
          type: 'success',
          state: 'success',
          msg: t('auth.register.verification_sent_title'), // Or generic success
        })
        // Optionally redirect to sign-in after delay
      }
    },
    [navigate, setUser, t],
  )

  const handleRegisterError = useCallback(
    (error: any) => {
      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg: error.response?.data?.detail || t('auth.login.login_failed'), // Or register specific error
      })
    },
    [t],
  )

  const registerMutation = useRegister({
    onSuccess: handleRegisterSuccess,
    onError: handleRegisterError,
  })

  const onSubmit = useCallback(
    (data: SignUpFormData) => {
      const { firstname, lastname, email, password, confirmPassword, terms } = data

      const registerData: RegisterRequest = {
        email,
        password,
        confirmPassword,
        firstname,
        lastname,
        isTermsSign: terms,
      }
      registerMutation.mutate({ data: registerData })
    },
    [registerMutation],
  )

  return (
    <>
      <title>
        {t('auth.register.title_page')} - {themeConfig.templateName}
      </title>
      <meta
        name='description'
        content={`${t('auth.register.meta_desc')} - ${themeConfig.templateName}`}
      />
      <meta
        name='keywords'
        content={`sign up, register, authentication, ${themeConfig.templateName}`}
      />
      <Container
        component='main'
        maxWidth='sm'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        <Backdrop
          open={registerMutation.isPending}
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
            width: '450px',
          }}
        >
          <CardContent
            sx={{
              padding: { xs: 3, sm: 4 },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mb: 6,
              }}
            >
              <AdaptiveLogo />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                mb: 6,
              }}
            >
              <Typography variant='h4'>Adventure starts here 🚀</Typography>
              <Typography>Make your app management easy and fun!</Typography>
            </Box>
            <Box
              component='form'
              onSubmit={controlForm.handleSubmit(onSubmit)}
              noValidate
              autoComplete='off'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                mt: 10,
              }}
            >
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='firstname'
                    control={controlForm.control}
                    rules={{
                      required: {
                        value: true,
                        message: t('auth.register.firstname_required'),
                      },
                    }}
                    render={({ field, formState }) => (
                      <TextField
                        {...field}
                        required
                        label={t('auth.register.firstname_label')}
                        fullWidth
                        autoComplete='name'
                        placeholder='John Doe'
                        error={!!formState.errors.firstname}
                        helperText={formState.errors.firstname?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <PersonOutline sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='lastname'
                    control={controlForm.control}
                    rules={{
                      required: {
                        value: true,
                        message: t('auth.register.lastname_required'),
                      },
                    }}
                    render={({ field, formState }) => (
                      <TextField
                        {...field}
                        required
                        label={t('auth.register.lastname_label')}
                        fullWidth
                        autoComplete='name'
                        placeholder='John Doe'
                        error={!!formState.errors.lastname}
                        helperText={formState.errors.lastname?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <PersonOutline sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='email'
                    control={controlForm.control}
                    rules={{
                      required: {
                        value: true,
                        message: t('auth.login.email_required'),
                      },
                      pattern: {
                        value: EMAIL_PATTERN,
                        message: t('auth.login.invalid_email'),
                      },
                    }}
                    render={({ field, formState }) => (
                      <TextField
                        {...field}
                        required
                        type='email'
                        label={t('auth.login.email_label')}
                        fullWidth
                        autoComplete='email'
                        placeholder='you@example.com'
                        error={!!formState.errors.email}
                        helperText={formState.errors.email?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <EmailOutlined sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='password'
                    control={controlForm.control}
                    rules={{
                      required: {
                        value: true,
                        message: t('auth.login.password_required'),
                      },
                      minLength: {
                        value: 8,
                        message: t('auth.register.password_min_length'),
                      },
                    }}
                    render={({ field, formState }) => (
                      <TextField
                        {...field}
                        required
                        type={showPassword ? 'text' : 'password'}
                        label={t('auth.login.password_label')}
                        fullWidth
                        autoComplete='new-password'
                        placeholder='••••••••'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <LockOutlined sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                aria-label='toggle password visibility'
                                onClick={handleShowPassword}
                                edge='end'
                              >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={!!formState.errors.password}
                        helperText={formState.errors.password?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='confirmPassword'
                    control={controlForm.control}
                    rules={{
                      required: {
                        value: true,
                        message: t('auth.register.confirm_password_required'),
                      },
                      validate: (value) =>
                        value === passwordValue || t('auth.register.passwords_must_match'),
                    }}
                    render={({ field, formState }) => (
                      <TextField
                        {...field}
                        required
                        type={showConfirmPassword ? 'text' : 'password'}
                        label={t('auth.register.confirm_password_label')}
                        fullWidth
                        autoComplete='new-password'
                        placeholder='••••••••'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <LockOutlined sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                aria-label='toggle confirm password visibility'
                                onClick={handleShowConfirmPassword}
                                edge='end'
                              >
                                {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={!!formState.errors.confirmPassword}
                        helperText={formState.errors.confirmPassword?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='terms'
                    control={controlForm.control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            color='primary'
                            sx={{ pl: 0 }}
                          />
                        }
                        label={
                          <Typography variant='body2' color='text.secondary'>
                            {t('auth.register.agree_to_terms')}{' '}
                            <HLink
                              component={Link}
                              to='/terms'
                              sx={{ fontWeight: 600, textDecoration: 'none' }}
                            >
                              {t('auth.register.terms_of_service')}
                            </HLink>{' '}
                            {t('auth.register.and')}{' '}
                            <HLink
                              component={Link}
                              to='/privacy'
                              sx={{ fontWeight: 600, textDecoration: 'none' }}
                            >
                              {t('auth.register.privacy_policy')}
                            </HLink>
                            .
                          </Typography>
                        }
                        sx={{ ml: 0, alignItems: 'flex-start' }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Button
                type='submit'
                fullWidth
                variant='contained'
                size='large'
                disabled={registerMutation.isPending}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: theme.shadows[2],
                }}
              >
                {registerMutation.isPending
                  ? t('auth.register.button_signing_up')
                  : t('auth.register.button_signup')}
              </Button>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Typography>{t('auth.register.already_have_account').split('?')[0]}? </Typography>
                <Typography color='primary'>
                  <HLink
                    component={Link}
                    to='/auth/sign-in'
                    sx={{
                      fontWeight: 600,
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    {t('auth.register.already_have_account').split('?')[1] || 'Sign In'}
                  </HLink>
                </Typography>
              </Box>
              <Divider sx={{ gap: 2, mt: 2, mb: 2 }}>or</Divider>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5 }}>
                <IconButton sx={{ color: '#1877F2' }}>
                  <Facebook />
                </IconButton>
                <IconButton sx={{ color: '#1DA1F2' }}>
                  <Twitter />
                </IconButton>
                <IconButton sx={{ color: 'text.primary' }}>
                  <GitHub />
                </IconButton>
                <IconButton sx={{ color: '#DB4437' }}>
                  <Google />
                </IconButton>
              </Box>
              {/* <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                {[
                  { icon: <Facebook />, label: 'Facebook', key: 'facebook' },
                  { icon: <Twitter />, label: 'Twitter', key: 'twitter' },
                  { icon: <Google />, label: 'Google', key: 'google' },
                  { icon: <Apple />, label: 'Apple', key: 'apple' },
                  // { icon: <GitHub />, label: 'GitHub', key: 'github' },
                ].map((provider) => (
                  <Grid key={provider.key} size={{ xs: 4 }}>
                    <Button
                      fullWidth
                      variant='outlined'
                      sx={{
                        py: 1,
                        borderColor: theme.palette.divider,
                        // color: theme.palette.text.primary,
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.text.primary, 0.05),
                          borderColor: theme.palette.text.primary,
                        },
                        borderRadius: 2,
                      }}
                    >
                      {provider.icon}
                    </Button>
                  </Grid>
                ))}
              </Box> */}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
