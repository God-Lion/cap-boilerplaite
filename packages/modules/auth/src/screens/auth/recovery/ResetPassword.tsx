import React from 'react'
import { themeConfig } from '@cap/platform-core'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Visibility, VisibilityOff, LockOutlined } from '@mui/icons-material'
import {
  Container,
  Backdrop,
  CircularProgress,
  Snackbar,
  Typography,
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Avatar,
  Link as MuiLink,
  Card,
  CardContent,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useResetPassword } from '../../../hooks/useAuthQuery'
import { ResetPasswordRequest } from '../../../types/api.types'
import {
  FetchResponse,
  HttpError,
  IUserResponseEmailResetPassword,
  Alert as MAlert,
} from '@cap/platform-core'
import authService from '../../../services/auth.service'

interface ResetPasswordFormData {
  token: string
  new_password: string
  confirmPassword: string
}

const SUPPORT_EMAIL = 'support@example.com'

export default function ResetPassword() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { email } = useParams()
  const [searchParams] = useSearchParams()
  const signature = searchParams.get('signature')

  const [loading, setLoading] = React.useState<boolean>(false)
  const [open, setOpen] = React.useState<boolean>(false)
  const [error, setError] = React.useState<HttpError>()
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  const handleCloseAlert = () => setOpen(false)

  const [userResponseEmailResetPassword, setUserResponseEmailResetPassword] =
    React.useState<IUserResponseEmailResetPassword>()

  const resetPasswordMutation = useResetPassword({
    onSuccess: () => {
      navigate('/auth/sign-in')
    },
    onError: (error: any) => {
      setErrorMessage(
        error.response?.data?.detail ||
          error.message ||
          t('auth.reset_password.error_resetting_title'),
      )
      setOpen(true)
    },
  })

  const controlForm = useForm<ResetPasswordFormData>({
    defaultValues: {
      token: '',
      new_password: '',
      confirmPassword: '',
    },
  })

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response: FetchResponse<IUserResponseEmailResetPassword> =
          await authService.verifyResetPassword(email || '', signature ?? '')
        if (response.status === 202) {
          setUserResponseEmailResetPassword(response.data)
          controlForm.setValue('token', response.data.token || '')
        }
      } catch (error) {
        setError(error as HttpError)
        console.log('error ', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [controlForm, email, signature])

  const [showPassword, setShowPassword] = React.useState<boolean>(false)
  const handleShowPassword = () => setShowPassword(!showPassword)

  const onSubmit = async (data: ResetPasswordFormData) => {
    const resetData: ResetPasswordRequest = {
      token: data.token,
      email: email || '',
      password: data.new_password,
      confirmPassword: data.confirmPassword,
    }
    resetPasswordMutation.mutate({ data: resetData })
  }

  if (userResponseEmailResetPassword?.isSignatureValid === false) {
    return (
      <React.Fragment>
        <title>
          {t('auth.reset_password.title_page')} - {themeConfig.templateName}
        </title>
        <meta
          name='description'
          content={`${t('auth.reset_password.meta_desc')} - ${themeConfig.templateName}`}
        />
        <meta
          name='keywords'
          content={`reset password, new password, ${themeConfig.templateName}`}
        />

        <Container
          component='main'
          sx={{
            minHeight: '100dvh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            bgcolor: 'background.default',
          }}
        >
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Backdrop
                sx={{
                  zIndex: (theme) => theme.zIndex.drawer + 10,
                  color: 'primary.contrastText',
                }}
                open={loading}
              >
                <CircularProgress color='inherit' />
              </Backdrop>
              <MAlert severity='error' sx={{ width: '100%' }}>
                <Box>
                  {error?.code === 'ERR_NETWORK' && (
                    <Typography
                      variant='body1'
                      sx={{
                        pt: 1,
                      }}
                    >
                      {error.message}
                    </Typography>
                  )}
                  <Typography
                    sx={{
                      pt: 1,
                      fontWeight: 'bold',
                    }}
                  >
                    {t('auth.reset_password.invalid_link_title')}
                  </Typography>
                  <Typography
                    sx={{
                      pt: 1,
                    }}
                  >
                    {t('auth.reset_password.invalid_link_desc1')}
                  </Typography>
                  <Typography
                    sx={{
                      pt: 1,
                    }}
                  >
                    {t('auth.reset_password.invalid_link_desc2')}
                  </Typography>
                  <Typography
                    sx={{
                      pt: 1,
                    }}
                  >
                    {t('auth.reset_password.support_text')}{' '}
                    <MuiLink
                      component={Link}
                      to={`mailto:${SUPPORT_EMAIL}`}
                      sx={{
                        textDecoration: 'underline',
                        color: 'primary.main',
                      }}
                    >
                      {SUPPORT_EMAIL}
                    </MuiLink>
                  </Typography>
                  <Typography
                    sx={{
                      pt: 1,
                    }}
                  >
                    {t('auth.reset_password.apology')}
                  </Typography>
                </Box>
              </MAlert>
              <Button
                component={Link}
                to='/auth/forgot-password'
                sx={{ mt: 3 }}
                variant='contained'
                size='small'
                fullWidth
              >
                {t('auth.reset_password.button_forgot_password')}
              </Button>
            </CardContent>
          </Card>
        </Container>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <title>
        {t('auth.reset_password.title_page')} - {themeConfig.templateName}
      </title>
      <meta
        name='description'
        content={`${t('auth.reset_password.meta_desc')} - ${themeConfig.templateName}`}
      />
      <meta name='keywords' content={`reset password, new password, ${themeConfig.templateName}`} />

      <Container
        component='main'
        maxWidth='xs'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          justifyContent: 'center',
          alignItems: 'center',
          py: 8,
          bgcolor: 'background.default',
        }}
      >
        <Backdrop
          sx={{ color: 'primary.contrastText', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading || resetPasswordMutation.isPending}
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
          <MAlert onClose={handleCloseAlert} severity='error' sx={{ width: '100%' }}>
            <Box>
              <Typography
                sx={{
                  pt: 1,
                  fontWeight: 'bold',
                }}
              >
                {t('auth.reset_password.error_resetting_title')}
              </Typography>
              <Typography
                sx={{
                  pt: 1,
                }}
              >
                {errorMessage}
              </Typography>
              <Typography
                sx={{
                  pt: 1,
                }}
              >
                {t('auth.reset_password.error_resetting_desc1')}
              </Typography>
              <Typography
                sx={{
                  pt: 1,
                }}
              >
                {t('auth.reset_password.error_resetting_desc2')}{' '}
                <MuiLink
                  component={Link}
                  to={`mailto:${SUPPORT_EMAIL}`}
                  sx={{
                    textDecoration: 'underline',
                    color: 'primary.main',
                  }}
                >
                  {SUPPORT_EMAIL}
                </MuiLink>
              </Typography>
              <Typography
                sx={{
                  pt: 1,
                }}
              >
                {t('auth.reset_password.apology_patience')}
              </Typography>
            </Box>
          </MAlert>
        </Snackbar>

        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 450,
            boxShadow: (theme) => theme.shadows[4],
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <CardContent
            sx={{
              padding: { xs: 3, sm: 4 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              sx={{
                m: 1,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main',
              }}
            >
              <LockOutlined />
            </Avatar>
            <Typography component='h1' variant='h5' sx={{ color: 'text.primary', fontWeight: 700 }}>
              {t('auth.reset_password.title')}
            </Typography>
            <Box
              component='form'
              noValidate
              onSubmit={controlForm.handleSubmit(onSubmit)}
              sx={{ mt: 3, width: '100%' }}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label={t('auth.reset_password.email_label')}
                    value={email || ''}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='new_password'
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
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                        message: t('auth.register.password_complexity'),
                      },
                    }}
                    render={({ field, formState }) => (
                      <TextField
                        {...field}
                        required
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        label={t('auth.reset_password.password_label')}
                        autoComplete='new-password'
                        slotProps={{
                          input: {
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
                          },
                        }}
                        error={formState?.errors?.new_password !== undefined}
                        helperText={formState?.errors?.new_password?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'background.paper',
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
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
                        value === controlForm.getValues('new_password') ||
                        t('auth.register.passwords_must_match'),
                    }}
                    render={({ field, formState }) => (
                      <TextField
                        {...field}
                        required
                        type={showPassword ? 'text' : 'password'}
                        label={t('auth.reset_password.confirm_password_label')}
                        fullWidth
                        autoComplete='new-password'
                        error={formState?.errors?.confirmPassword !== undefined}
                        helperText={formState?.errors?.confirmPassword?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            bgcolor: 'background.paper',
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' },
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{
                  mt: 3,
                  mb: 2,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  boxShadow: (theme) => `0 4px 6px -1px ${alpha(theme.palette.primary.main, 0.2)}`,
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    boxShadow: (theme) =>
                      `0 6px 8px -1px ${alpha(theme.palette.primary.main, 0.3)}`,
                  },
                }}
                disabled={resetPasswordMutation.isPending}
              >
                {resetPasswordMutation.isPending
                  ? t('auth.reset_password.button_resetting')
                  : t('auth.reset_password.button_reset')}
              </Button>
            </Box>
          </CardContent>
        </Card>
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
            © {new Date().getFullYear()} {t('auth.common.appName')}.{' '}
            {t('auth.common.allRightsReserved')}
          </Typography>
        </Box>
      </Container>
    </React.Fragment>
  )
}

