import { useState, useCallback, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Container,
  Link as HLink,
  Snackbar,
  TextField,
  Typography,
  Divider,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GitHub, Google, Visibility, VisibilityOff, CheckCircle, Lock } from '@mui/icons-material'
import { useTheme, alpha } from '@mui/material/styles'
import { themeConfig, Alert as MAlert, AdaptiveLogo } from '@cap/platform-core'

import { useRegister, RegisterRequest } from '../../index'

// Constants
const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

const DEFAULT_FORM_VALUES = {
  fullName: '',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  terms: true,
  newsletter: false,
}

interface SignUpFormData {
  fullName: string
  email: string
  phoneNumber?: string
  password: string
  confirmPassword: string
  terms: boolean
  newsletter: boolean
}

export default function SignUp() {
  const { t } = useTranslation()
  const theme = useTheme()
  const [open, setOpen] = useState<boolean>(false)
  const [alertType, setAlertType] = useState<'error' | 'success'>('success')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleCloseAlert = useCallback(() => setOpen(false), [])
  const handleShowPassword = useCallback(() => setShowPassword((prev) => !prev), [])

  const controlForm = useForm<SignUpFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
  })

  // Basic Password Strength Logic
  const passwordValue = useWatch({ control: controlForm.control, name: 'password' })
  const passwordStrength = useMemo(() => {
    if (!passwordValue) return 0
    let strength = 0
    if (passwordValue.length >= 8) strength += 25
    if (/[A-Z]/.test(passwordValue)) strength += 25
    if (/[0-9]/.test(passwordValue)) strength += 25
    if (/[^A-Za-z0-9]/.test(passwordValue)) strength += 25
    return strength
  }, [passwordValue])

  const getStrengthLabel = (strength: number) => {
    if (strength <= 25) return t('auth.register.strength_weak')
    if (strength <= 75) return t('auth.register.strength_medium')
    return t('auth.register.strength_strong')
  }

  const getStrengthColor = (strength: number) => {
    if (strength <= 25) return 'error'
    if (strength <= 75) return 'warning'
    return 'success'
  }

  const handleRegisterSuccess = useCallback(() => {
    setAlertType('success')
    setOpen(true)
    controlForm.reset()
  }, [controlForm])

  const handleRegisterError = useCallback(
    (error: { response?: { data?: { detail?: string } }; message?: string }) => {
      setAlertType('error')
      setErrorMessage(error.response?.data?.detail || error.message || t('auth.login.login_failed'))
      setOpen(true)
    },
    [t],
  )

  const registerMutation = useRegister({
    onSuccess: handleRegisterSuccess,
    onError: handleRegisterError,
  })

  const onSubmit = useCallback(
    (data: SignUpFormData) => {
      const parts = data.fullName.trim().split(' ')
      const firstName = parts[0]
      const lastName = parts.slice(1).join(' ')
      const registerData: RegisterRequest = {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstname: firstName,
        lastname: lastName,
        isTermsSign: data.terms,
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
        content={`sign up, registration, create account, ${themeConfig.templateName}`}
      />
      <Container
        component='main'
        maxWidth='sm'
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <CssBaseline />
        <Backdrop
          sx={{ color: '#FFFFFF', zIndex: (theme) => theme.zIndex.drawer + 10 }}
          open={registerMutation.isPending}
        >
          <CircularProgress color='inherit' />
        </Backdrop>
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={open}
          autoHideDuration={6000}
          onClose={handleCloseAlert}
        >
          <MAlert onClose={handleCloseAlert} severity={alertType} sx={{ width: '100%' }}>
            {alertType === 'success' && (
              <Box>
                <Typography variant='h6' component='div' pt={1}>
                  {t('auth.register.verification_sent_title')}
                </Typography>
                <Typography variant='body1' component='div' pt={1}>
                  {t('auth.register.verification_sent_desc')}
                </Typography>
              </Box>
            )}
            {alertType === 'error' && (
              <Box>
                <Typography variant='h6' component='div' pt={1}>
                  {t('auth.register.verification_error_title')}
                </Typography>
                <Typography variant='body1' component='div' pt={1}>
                  {errorMessage}
                </Typography>
              </Box>
            )}
          </MAlert>
        </Snackbar>

        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 450,
          }}
        >
          <CardContent
            sx={{
              padding: { xs: 3, sm: 4 },
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <AdaptiveLogo width={50} height={50} />
            </Box>
            <Typography
              component='h1'
              variant='h4'
              sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}
            >
              {t('auth.register.subtitle')}
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{ textAlign: 'center', mb: 3 }}>
              {t('auth.register.subtitle_form')}
            </Typography>

            <Box
              component='form'
              noValidate
              onSubmit={controlForm.handleSubmit(onSubmit)}
              sx={{ width: '100%' }}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='fullName'
                    control={controlForm.control}
                    rules={{
                      required: {
                        value: true,
                        message: t('auth.register.full_name_required'),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        id='fullName'
                        label={t('auth.register.full_name_label')}
                        autoFocus
                        placeholder='e.g. Jane Doe'
                        error={!!controlForm.formState.errors.fullName}
                        helperText={controlForm.formState.errors.fullName?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
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
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        id='email'
                        label={t('auth.register.email_label')}
                        autoComplete='email'
                        placeholder='you@example.com'
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          endAdornment: !fieldState.invalid && field.value && (
                            <InputAdornment position='end'>
                              <CheckCircle color='success' />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='phoneNumber'
                    control={controlForm.control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        id='phoneNumber'
                        label={
                          <Typography variant='body1' component='span'>
                            {t('auth.register.phone_number_label')}{' '}
                            <Typography component='span' variant='body2' color='text.secondary'>
                              {t('auth.register.optional')}
                            </Typography>
                          </Typography>
                        }
                        placeholder='+1 (555) 000-0000'
                        type='tel'
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
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
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label={t('auth.register.password_label')}
                        type={showPassword ? 'text' : 'password'}
                        id='password'
                        autoComplete='new-password'
                        placeholder='Min. 8 characters'
                        error={!!controlForm.formState.errors.password}
                        helperText={controlForm.formState.errors.password?.message}
                        InputProps={{
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
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                        }}
                      />
                    )}
                  />
                  {/* Password Strength Meter */}
                  {passwordValue && (
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5 }}>
                        {[1, 2, 3, 4].map((step) => (
                          <Box
                            key={step}
                            sx={{
                              flex: 1,
                              height: 4,
                              borderRadius: 1,
                              bgcolor:
                                passwordStrength >= step * 25
                                  ? `${getStrengthColor(passwordStrength)}.main`
                                  : theme.palette.action.selected,
                            }}
                          />
                        ))}
                      </Box>
                      <Typography
                        variant='caption'
                        color={`${getStrengthColor(passwordStrength)}.main`}
                        fontWeight={600}
                      >
                        {t('auth.register.password_strength')}: {getStrengthLabel(passwordStrength)}
                      </Typography>
                    </Box>
                  )}
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='confirmPassword'
                    control={controlForm.control}
                    rules={{
                      required: true,
                      validate: (value) => {
                        const password = controlForm.getValues('password')
                        return value === password || t('auth.register.passwords_must_match')
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        label={t('auth.register.confirm_password_label')}
                        type='password'
                        id='confirmPassword'
                        autoComplete='new-password'
                        placeholder='Re-enter password'
                        error={!!controlForm.formState.errors.confirmPassword}
                        helperText={controlForm.formState.errors.confirmPassword?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Controller
                name='terms'
                control={controlForm.control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Box sx={{ mt: 2 }}>
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
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
                    />
                  </Box>
                )}
              />

              <Controller
                name='newsletter'
                control={controlForm.control}
                render={({ field }) => (
                  <Box sx={{ mt: 0 }}>
                    <FormControlLabel
                      control={<Checkbox {...field} checked={field.value} />}
                      label={
                        <Typography variant='body2' color='text.secondary'>
                          {t('auth.register.newsletter_signup')}
                        </Typography>
                      }
                    />
                  </Box>
                )}
              />

              <Button
                type='submit'
                fullWidth
                variant='contained'
                size='large'
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 700,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending
                  ? t('auth.register.button_signing_up')
                  : t('auth.register.button_signup')}
              </Button>

              <Box sx={{ mt: 2, mb: 3 }}>
                <Divider sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  {t('auth.register.or_continue_with')}
                </Divider>
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Button
                    fullWidth
                    variant='outlined'
                    startIcon={<Google />}
                    sx={{
                      py: 1,
                      borderRadius: 2,
                      borderColor: theme.palette.divider,
                      color: 'text.primary',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.text.primary, 0.05),
                        borderColor: theme.palette.text.primary,
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
                    startIcon={<GitHub />}
                    sx={{
                      py: 1,
                      borderRadius: 2,
                      borderColor: theme.palette.divider,
                      color: 'text.primary',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.text.primary, 0.05),
                        borderColor: theme.palette.text.primary,
                      },
                    }}
                  >
                    GitHub
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <Typography variant='body2' color='text.secondary'>
                  {t('auth.register.already_have_account')}{' '}
                  <HLink
                    component={Link}
                    to='/auth/sign-in'
                    sx={{ fontWeight: 600, textDecoration: 'none' }}
                  >
                    {t('auth.register.login')}
                  </HLink>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', gap: 1, opacity: 0.7 }}>
          <Lock sx={{ fontSize: 16 }} color='action' />
          <Typography variant='caption' color='text.secondary'>
            {t('auth.register.secure_ssl')}
          </Typography>
        </Box>
      </Container>
    </>
  )
}
