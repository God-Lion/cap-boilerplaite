import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Snackbar,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Link as HLink,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { GitHub, Google, Visibility, VisibilityOff } from '@mui/icons-material'
import { useTheme, alpha } from '@mui/material/styles'
import { themeConfig, Alert as MAlert } from '@cap/platform-core'
import { RegisterRequest } from '../../../types/api.types'
import { useRegister } from '../../../hooks/useAuthQuery'

// Constants
const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

const DEFAULT_FORM_VALUES = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  phoneNumber: '',
  password: 'password',
  confirmPassword: 'password',
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
        content={t('auth.register.keywords', { appName: themeConfig.templateName })}
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
          py: { xs: 6, sm: 8 },
          position: 'relative',
          overflow: 'hidden',
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: (theme) =>
              `radial-gradient(${alpha(theme.palette.divider, 0.5)} 0.5px, transparent 0.5px)`,
            backgroundSize: '24px 24px',
            maskImage: 'linear-gradient(180deg, white, rgba(255, 255, 255, 0))',
            opacity: 0.2,
            pointerEvents: 'none',
          }}
        />

        <Backdrop
          sx={{
            // color: '#FFFFFF',
            zIndex: (theme) => theme.zIndex.drawer + 10,
          }}
          open={registerMutation.isPending}
        >
          <CircularProgress color='inherit' />
        </Backdrop>

        {/* Snackbars omitted for brevity, keeping them in place */}
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
                  {t('auth.register.registration_successful')}
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
            maxWidth: '480px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: 0, sm: '12px' },
            boxShadow: theme.shadows[1],
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            mx: { xs: 0, sm: 4 },
            zIndex: 1,
          }}
        >
          <CardContent
            sx={{
              padding: { xs: '32px 24px', sm: '40px' },
              '&:last-child': { pb: { xs: '32px', sm: '40px' } },
            }}
          >
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {/* Header Section */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 4,
                }}
              >
                <Typography
                  variant='h4'
                  fontWeight='700'
                  textAlign='center'
                  sx={{
                    fontSize: '28px',
                    lineHeight: 'tight',
                    color: 'text.primary',
                    fontFamily: 'inherit',
                    mb: 1,
                  }}
                >
                  {t('auth.register.create_an_account')}
                </Typography>
                <Typography
                  variant='body1'
                  color='text.secondary'
                  textAlign='center'
                  sx={{ fontSize: '1rem', fontFamily: 'inherit', lineHeight: 'normal' }}
                >
                  {t('auth.register.subtitle_form')}
                </Typography>
              </Box>

              {/* Social Registration Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                <Button
                  fullWidth
                  variant='contained'
                  startIcon={<Google />}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.action.hover, 0.05),
                    color: 'text.primary',
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontWeight: 700,
                    height: 48,
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    gap: 1,
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.action.hover, 0.1),
                      boxShadow: 'none',
                    },
                  }}
                >
                  {t('auth.register.signup_google')}
                </Button>
                <Button
                  fullWidth
                  variant='contained'
                  startIcon={<GitHub />}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.action.hover, 0.05),
                    color: 'text.primary',
                    boxShadow: 'none',
                    textTransform: 'none',
                    fontWeight: 700,
                    height: 48,
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontFamily: 'inherit',
                    gap: 1,
                    '&:hover': {
                      bgcolor: (theme) => alpha(theme.palette.action.hover, 0.1),
                      boxShadow: 'none',
                    },
                  }}
                >
                  {t('auth.register.signup_github')}
                </Button>
              </Box>

              {/* Divider */}
              <Box
                sx={{ position: 'relative', display: 'flex', py: 1.5, alignItems: 'center', mb: 1 }}
              >
                <Box
                  sx={{
                    flexGrow: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                />
                <Typography
                  sx={{
                    flexShrink: 0,
                    mx: 2,
                    fontSize: '0.875rem',
                    color: 'text.secondary',
                    fontWeight: 400,
                    fontFamily: 'inherit',
                  }}
                >
                  {t('auth.register.or_continue_email')}
                </Typography>
                <Box
                  sx={{
                    flexGrow: 1,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                />
              </Box>

              <Box
                component='form'
                noValidate
                onSubmit={controlForm.handleSubmit(onSubmit)}
                sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}
              >
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Typography
                        component='label'
                        htmlFor='fullName'
                        sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}
                      >
                        {t('auth.register.full_name_label')}
                      </Typography>
                      <TextField
                        {...field}
                        id='fullName'
                        placeholder={t('auth.register.name_placeholder')}
                        error={!!controlForm.formState.errors.fullName}
                        helperText={controlForm.formState.errors.fullName?.message}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 44,
                            borderRadius: '8px',
                            bgcolor: 'background.paper',
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: '2px',
                            },
                          },
                          '& .MuiInputBase-input': { fontSize: '0.875rem' },
                        }}
                      />
                    </Box>
                  )}
                />

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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Typography
                        component='label'
                        htmlFor='email'
                        sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}
                      >
                        {t('auth.register.email_label')}
                      </Typography>
                      <TextField
                        {...field}
                        id='email'
                        autoComplete='email'
                        placeholder={t('auth.register.email_placeholder_jane')}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 44,
                            borderRadius: '8px',
                            bgcolor: 'background.paper',
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: '2px',
                            },
                          },
                          '& .MuiInputBase-input': { fontSize: '0.875rem' },
                        }}
                      />
                    </Box>
                  )}
                />

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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Typography
                        component='label'
                        htmlFor='password'
                        sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}
                      >
                        {t('auth.register.password_label')}
                      </Typography>
                      <TextField
                        {...field}
                        id='password'
                        autoComplete='new-password'
                        placeholder='••••••••'
                        type={showPassword ? 'text' : 'password'}
                        error={!!controlForm.formState.errors.password}
                        helperText={controlForm.formState.errors.password?.message}
                        fullWidth
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={handleShowPassword} edge='end'>
                                {showPassword ? (
                                  <VisibilityOff sx={{ fontSize: 20 }} />
                                ) : (
                                  <Visibility sx={{ fontSize: 20 }} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 44,
                            borderRadius: '8px',
                            bgcolor: 'background.paper',
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: '2px',
                            },
                          },
                          '& .MuiInputBase-input': { fontSize: '0.875rem' },
                        }}
                      />
                    </Box>
                  )}
                />

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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                      <Typography
                        component='label'
                        htmlFor='confirmPassword'
                        sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}
                      >
                        {t('auth.register.confirm_password_label')}
                      </Typography>
                      <TextField
                        {...field}
                        id='confirmPassword'
                        autoComplete='new-password'
                        placeholder='••••••••'
                        type='password'
                        error={!!controlForm.formState.errors.confirmPassword}
                        helperText={controlForm.formState.errors.confirmPassword?.message}
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 44,
                            borderRadius: '8px',
                            bgcolor: 'background.paper',
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: '2px',
                            },
                          },
                          '& .MuiInputBase-input': { fontSize: '0.875rem' },
                        }}
                      />
                    </Box>
                  )}
                />

                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  sx={(theme) => ({
                    mt: 2,
                    height: 44,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    boxShadow: theme.shadows[2],
                    '&:hover': {
                      boxShadow: theme.shadows[4],
                    },
                  })}
                  disabled={registerMutation.isPending}
                >
                  {t('auth.register.button_signup')}
                </Button>
              </Box>

              {/* Footer */}
              <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ fontSize: '0.875rem', fontFamily: 'inherit' }}
                >
                  {t('auth.register.already_have_account_prompt')}
                  <HLink
                    component={Link}
                    to='/auth/sign-in'
                    sx={{
                      fontWeight: 700,
                      textDecoration: 'none',
                      color: 'primary.main',
                      fontFamily: 'inherit',
                      '&:hover': {
                        textDecoration: 'underline',
                        color: 'primary.dark',
                      },
                    }}
                  >
                    {t('auth.register.sign_in_link')}
                  </HLink>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
