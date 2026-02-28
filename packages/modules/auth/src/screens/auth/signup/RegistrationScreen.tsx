import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
import { LockPerson, Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm, Controller, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, themeConfig, IStatus } from '@cap/platform-core'
import { RegisterRequest } from '../../../types/api.types'
import { useRegister } from '../../../hooks/useAuthQuery'
import Path from '../path'

const DEFAULT_FORM_VALUES: RegisterRequest = {
  email: '',
  password: '',
  confirmPassword: '',
  firstname: '',
  lastname: '',
  isTermsSign: true,
}

export default function RegistrationScreen() {
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
      setTimeout(() => navigate(Path.signin), 2000)
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

  const handleSocialSignUp = useCallback((provider: string) => {
    const apiUrl = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3333'
    window.location.href = `${apiUrl}/api/auth/social/${provider}/redirect`
  }, [])

  return (
    <>
      <title>
        {t('auth.register.title_page')} - {themeConfig.templateName}
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
          open={registerMutation.isPending}
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
            maxWidth: '520px',
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
                  <LockPerson sx={{ color: 'primary.main', fontSize: 28 }} />
                </Box>
                <Typography variant='h4' sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.025em' }}>
                  {t('auth.register.create_an_account')}
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  {t('auth.register.subtitle_v2')}
                </Typography>
              </Box>

              <Box
                component='form'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}
              >
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      component='label'
                      sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, mb: 1 }}
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
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', height: 48 } }}
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      component='label'
                      sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, mb: 1 }}
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
                          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px', height: 48 } }}
                        />
                      )}
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography
                    component='label'
                    sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, mb: 1 }}
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
                        fullWidth
                        placeholder={t('auth.register.email_placeholder')}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
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
                        fullWidth
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='••••••••'
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                onClick={handleShowConfirmPassword}
                                edge='end'
                                size='small'
                              >
                                {showConfirmPassword ? (
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
                  disabled={registerMutation.isPending}
                  sx={{
                    height: 52,
                    borderRadius: '12px',
                    fontWeight: 700,
                    textTransform: 'none',
                    mt: 1,
                  }}
                >
                  {registerMutation.isPending
                    ? t('auth.register.button_signing_up')
                    : t('auth.register.button_signup')}
                </Button>

                <Box sx={{ mt: 1, textAlign: 'center' }}>
                  <Typography variant='caption' color='text.secondary' sx={{ lineHeight: 1.6 }}>
                    {t('auth.register.terms_agreement')}
                  </Typography>
                </Box>
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
                    {t('auth.register.or_with_email')}
                  </Typography>
                </Divider>
              </Box>

              <Button
                fullWidth
                variant='outlined'
                size='large'
                onClick={() => handleSocialSignUp('google')}
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

              <Box sx={{ mt: 5, textAlign: 'center' }}>
                <Typography variant='body2' color='text.secondary'>
                  {t('auth.register.already_have_account_v2')}{' '}
                  <MuiLink
                    component={Link}
                    to={Path.signin}
                    sx={{ fontWeight: 700, textDecoration: 'none' }}
                  >
                    {t('auth.register.log_in_link')}
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
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
            {t('auth.common.terms_of_service')}
          </MuiLink>
        </Box>
      </Container>
    </>
  )
}
