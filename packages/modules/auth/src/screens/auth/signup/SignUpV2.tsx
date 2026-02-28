import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Link as MuiLink,
  TextField,
  Typography,
  Divider,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Snackbar,
  Backdrop,
  CircularProgress,
  alpha,
} from '@mui/material'
import { LockPerson, Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, themeConfig, IStatus } from '@cap/platform-core'
import AuthHeader from '../../../components/AuthHeader'
import { RegisterRequest } from '../../../types/api.types'
import { useRegister } from '../../../hooks/useAuthQuery'

const DEFAULT_FORM_VALUES: RegisterRequest = {
  email: '',
  password: '',
  confirmPassword: '',
  firstname: '',
  lastname: '',
  isTermsSign: true,
}

export default function SignUpV2() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { control, handleSubmit } = useForm<RegisterRequest>({
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const [status, setStatus] = useState<IStatus>({
    open: false,
    type: '',
    state: '',
    msg: '',
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

  const registerMutation = useRegister({
    onSuccess: () => {
      setStatus({
        open: true,
        type: 'success',
        state: 'success',
        msg: t('auth.register.registration_successful'),
      })
      setTimeout(() => navigate('/auth/sign-in'), 2000)
    },
    onError: (error: any) => {
      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg: error.response?.data?.detail || t('auth.register.registration_failed'),
      })
    },
  })

  const onSubmit = useCallback(
    (data: RegisterRequest) => {
      if (data.password !== data.confirmPassword) {
        setStatus({
          open: true,
          type: 'error',
          state: 'error',
          msg: t('auth.register.passwords_must_match'),
        })
        return
      }

      registerMutation.mutate({ data })
    },
    [registerMutation, t],
  )

  const password = useWatch({ control, name: 'password' })

  return (
    <>
      <title>
        {t('auth.register.title_page')} - {themeConfig.templateName}
      </title>
      <meta
        name='description'
        content={`${t('auth.register.meta_desc')} - ${themeConfig.templateName}`}
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
        <AuthHeader />

        {/* Background gradient decoration */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: (theme) =>
              `radial-gradient(circle at 15% 50%, ${alpha(
                theme.palette.primary.main,
                0.08,
              )}, transparent 25%), radial-gradient(circle at 85% 30%, ${alpha(
                theme.palette.primary.main,
                0.08,
              )}, transparent 25%)`,
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        />

        <Backdrop
          open={registerMutation.isPending}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '480px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: { xs: 0, sm: '16px' },
            boxShadow: (theme) => theme.shadows[4],
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            mx: { xs: 0, sm: 4 },
          }}
        >
          <CardContent sx={{ padding: 0 }}>
            {/* Header Section */}
            <Box
              sx={{
                px: { xs: 3, sm: 4 },
                pt: 5,
                pb: 3,
                textAlign: 'center',
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                }}
              >
                <LockPerson sx={{ color: 'primary.main', fontSize: 28 }} />
              </Box>
              <Typography
                variant='h4'
                fontWeight='700'
                sx={{
                  fontSize: '1.5rem',
                  lineHeight: 1.2,
                  color: 'text.primary',
                  fontFamily: 'inherit',
                  letterSpacing: '-0.025em',
                  mb: 1,
                }}
              >
                {t('auth.register.create_an_account')}
              </Typography>
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                }}
              >
                {t('auth.register.subtitle_v2')}
              </Typography>
            </Box>

            {/* Form Section */}
            <Box sx={{ px: { xs: 3, sm: 4 }, pb: 5 }}>
              {/* Google Sign Up Button */}
              <Button
                fullWidth
                variant='outlined'
                startIcon={
                  <Box
                    component='img'
                    src='https://lh3.googleusercontent.com/aida-public/AB6AXuDJ0Br-RZteHqyvVUpr4JjJoDpFKwOeSXrKIvw2vDLEANKSFtY-jjjKaewaDXs7ppA1M2KluyLUQC78guxSfcwJjQZkqiHm24a2N6rXBSM9mToIbTze4RtJkddOpF_4Em7h55p96NNK5h_MVlKu0JuPReTeIJfaNsjgR88Vw5zyyGlCYHiMyiHvJiDdDQefZXms3SHQRKS-d2YLdxyDynsU3idoyzRYUjfCK73Sq-e16ikmQbKgG4v9TcHvz0ZNH8C4Uj83bnA3KfM'
                    alt='Google'
                    sx={{ width: 20, height: 20 }}
                  />
                }
                sx={{
                  height: 48,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  fontFamily: 'inherit',
                  borderColor: 'divider',
                  color: 'text.primary',
                  mb: 3,
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.action.hover, 0.04),
                    borderColor: 'divider',
                  },
                }}
              >
                {t('auth.register.sign_up_google')}
              </Button>

              {/* Divider */}
              <Box sx={{ position: 'relative', mb: 3 }}>
                <Divider
                  sx={{
                    '&::before, &::after': {
                      borderColor: 'divider',
                    },
                  }}
                >
                  <Typography
                    variant='caption'
                    color='text.secondary'
                    sx={{
                      px: 2,
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      fontFamily: 'inherit',
                      textTransform: 'uppercase',
                    }}
                  >
                    {t('auth.register.or_with_email')}
                  </Typography>
                </Divider>
              </Box>

              {/* Registration Form */}
              <Box
                component='form'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                {/* Name Fields */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant='body2'
                      fontWeight='500'
                      sx={{
                        mb: 0.75,
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        color: 'text.primary',
                      }}
                    >
                      {t('auth.register.firstname_label')}
                    </Typography>
                    <Controller
                      name='firstname'
                      control={control}
                      rules={{
                        required: t('auth.register.firstname_required'),
                      }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder={t('auth.register.firstname_placeholder')}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              height: 48,
                              bgcolor: 'background.paper',
                              '& fieldset': { borderColor: 'divider' },
                              '&:hover fieldset': { borderColor: 'primary.main' },
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                                borderWidth: '2px',
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant='body2'
                      fontWeight='500'
                      sx={{
                        mb: 0.75,
                        fontSize: '0.875rem',
                        fontFamily: 'inherit',
                        color: 'text.primary',
                      }}
                    >
                      {t('auth.register.lastname_label')}
                    </Typography>
                    <Controller
                      name='lastname'
                      control={control}
                      rules={{
                        required: t('auth.register.lastname_required'),
                      }}
                      render={({ field, fieldState }) => (
                        <TextField
                          {...field}
                          fullWidth
                          placeholder={t('auth.register.lastname_placeholder')}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              height: 48,
                              bgcolor: 'background.paper',
                              '& fieldset': { borderColor: 'divider' },
                              '&:hover fieldset': { borderColor: 'primary.main' },
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main',
                                borderWidth: '2px',
                              },
                            },
                          }}
                        />
                      )}
                    />
                  </Box>
                </Box>

                {/* Email Field */}
                <Box>
                  <Typography
                    variant='body2'
                    fontWeight='500'
                    sx={{
                      mb: 0.75,
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                      color: 'text.primary',
                    }}
                  >
                    {t('auth.register.email_label')}
                  </Typography>
                  <Controller
                    name='email'
                    control={control}
                    rules={{
                      required: t('auth.register.email_required'),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('auth.register.invalid_email'),
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type='email'
                        fullWidth
                        autoComplete='email'
                        placeholder={t('auth.register.email_placeholder')}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: 48,
                            bgcolor: 'background.paper',
                            '& fieldset': {
                              borderColor: 'divider',
                            },
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: '2px',
                            },
                          },
                          '& input::placeholder': {
                            opacity: 0.5,
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Password Field */}
                <Box>
                  <Typography
                    variant='body2'
                    fontWeight='500'
                    sx={{
                      mb: 0.75,
                      color: 'text.primary',
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    {t('auth.register.password_label')}
                  </Typography>
                  <Controller
                    name='password'
                    control={control}
                    rules={{
                      required: t('auth.register.password_required'),
                      minLength: {
                        value: 8,
                        message: t('auth.register.password_min_length'),
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <TextField
                          {...field}
                          type={showPassword ? 'text' : 'password'}
                          fullWidth
                          autoComplete='new-password'
                          placeholder={t('auth.register.password_placeholder_create')}
                          error={!!fieldState.error}
                          helperText={fieldState.error?.message}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position='end'>
                                <IconButton onClick={handleShowPassword} edge='end'>
                                  {showPassword ? (
                                    <Visibility sx={{ fontSize: 20 }} />
                                  ) : (
                                    <VisibilityOff sx={{ fontSize: 20 }} />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: '8px',
                              height: 48,
                              bgcolor: 'background.paper', // Replaced hardcoded color
                              '& fieldset': {
                                borderColor: 'divider', // Replaced hardcoded color
                              },
                              '&:hover fieldset': {
                                borderColor: 'primary.main', // Replaced hardcoded color
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: 'primary.main', // Replaced hardcoded color
                                borderWidth: '2px',
                              },
                            },
                            '& input::placeholder': {
                              color: 'text.secondary', // Replaced hardcoded color
                              opacity: 1,
                            },
                          }}
                        />
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{
                            mt: 0.5,
                            fontSize: '0.75rem',
                            fontFamily: 'inherit',
                            display: 'block',
                          }}
                        >
                          {t('auth.register.password_hint')}
                        </Typography>
                      </>
                    )}
                  />
                </Box>

                {/* Confirm Password Field */}
                <Box>
                  <Typography
                    variant='body2'
                    fontWeight='500'
                    sx={{
                      mb: 0.75,
                      fontSize: '0.875rem',
                      fontFamily: 'inherit',
                    }}
                  >
                    {t('auth.register.confirm_password_label')}
                  </Typography>
                  <Controller
                    name='confirmPassword'
                    control={control}
                    rules={{
                      required: t('auth.register.confirm_password_required'),
                      validate: (value) =>
                        value === password || t('auth.register.passwords_must_match'),
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        fullWidth
                        autoComplete='new-password'
                        placeholder={t('auth.register.confirm_password_placeholder')}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={handleShowConfirmPassword} edge='end'>
                                {showConfirmPassword ? (
                                  <Visibility sx={{ fontSize: 20 }} />
                                ) : (
                                  <VisibilityOff sx={{ fontSize: 20 }} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: 48,
                            bgcolor: 'background.paper',
                            '& fieldset': {
                              borderColor: 'divider',
                            },
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: '2px',
                            },
                          },
                          '& input::placeholder': {
                            opacity: 0.5,
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Submit Button */}
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  disabled={registerMutation.isPending}
                  sx={{
                    mt: 2,
                    height: 48,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: (theme) =>
                      `0 4px 6px -1px ${alpha(theme.palette.primary.main, 0.2)}`,
                    fontFamily: 'inherit',
                    '&:hover': {
                      boxShadow: 'none',
                    },
                  }}
                >
                  {registerMutation.isPending
                    ? t('auth.register.button_signing_up')
                    : t('auth.register.button_signup')}
                </Button>

                {/* Terms Text */}
                <Typography
                  variant='caption'
                  sx={{
                    mt: 1,
                    textAlign: 'center',
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    fontFamily: 'inherit',
                    lineHeight: 1.6,
                  }}
                >
                  {t('auth.register.terms_agreement', {
                    tos: t('auth.register.terms_of_service'),
                    privacy: t('auth.register.privacy_policy'),
                  })}
                </Typography>
              </Box>
            </Box>

            {/* Footer Section */}
            <Box
              sx={{
                bgcolor: (theme) => alpha(theme.palette.action.hover, 0.02),
                borderTop: '1px solid',
                borderColor: 'divider',
                px: { xs: 3, sm: 4 },
                py: 2,
                textAlign: 'center',
              }}
            >
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ fontSize: '0.875rem', fontFamily: 'inherit' }}
              >
                {t('auth.register.already_have_account_v2')}{' '}
                <MuiLink
                  component={Link}
                  to='/auth/sign-in'
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    textDecoration: 'none',
                    ml: 0.5,
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'primary.dark',
                    },
                  }}
                >
                  {t('auth.register.log_in_link')}
                </MuiLink>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Help Links */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            gap: 3,
            fontSize: '0.875rem',
            color: 'text.secondary',
          }}
        >
          <MuiLink
            href='#'
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': { color: 'text.primary' },
            }}
          >
            {t('auth.common.help_center')}
          </MuiLink>
          <MuiLink
            href='#'
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              '&:hover': { color: 'text.primary' },
            }}
          >
            {t('auth.common.contact_support')}
          </MuiLink>
        </Box>
        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography
            variant='caption'
            sx={{
              fontSize: '0.875rem',
              color: 'text.disabled',
              fontFamily: 'inherit',
            }}
          >
            © 2024 {t('auth.common.app_name')}. {t('auth.common.all_rights_reserved')}
          </Typography>
        </Box>
      </Container>
    </>
  )
}
