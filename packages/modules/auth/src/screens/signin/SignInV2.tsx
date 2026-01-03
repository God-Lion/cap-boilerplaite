import { useState, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
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
import {
  Visibility,
  VisibilityOff,
  Google,
  Facebook,
  Twitter,
  GitHub,
  Lock,
} from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Alert as MAlert,
  AdaptiveLogo,
  themeConfig,
  IStatus,
  Roles,
  IAuth,
  useAuth,
} from '@cap/platform-core'
import {
  useLogin,
  //  useMfaLoginVerify,
  LoginRequest,
  ADMIN_ROLES,
} from '../../index'
import { IllustrationWrapper } from '../../components/IllustrationWrapper'

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

type LoginStep = 'LOGIN' | 'MFA'

export default function SignInV2() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const controlForm = useForm<LoginRequest>({
    defaultValues: DEFAULT_FORM_VALUES,
  })

  // State
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

  // Handlers
  const handleCloseStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, open: false }))
  }, [])

  const handleShowPassword = useCallback(() => {
    setShowPassword((prev) => !prev)
  }, [])

  const handleLoginSuccess = useCallback(
    async (response: any) => {
      if (response.data.mfa_required) {
        setMfaUserId(response.data.userId)
        setStep('MFA')
        return
      }

      const { user, token, refresh_token } = response.data
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

  // const mfaVerifyMutation = useMfaLoginVerify({
  //   onSuccess: handleLoginSuccess,
  //   onError: handleLoginError,
  // })

  // const handleMfaVerify = useCallback(() => {
  //   if (mfaUserId && mfaCode.length === 6) {
  //     mfaVerifyMutation.mutate({ userId: mfaUserId, code: mfaCode })
  //   }
  // }, [mfaUserId, mfaCode, mfaVerifyMutation])

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

      <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
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

        <IllustrationWrapper>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              maxWidth: 600,
              height: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              sx={{
                // bgcolor: alpha(theme.palette.primary.main, 0.1),
                borderRadius: '50%',
                p: 6,
                mb: 4,
              }}
            >
              <AdaptiveLogo width={120} height={120} />
            </Box>
            <Typography variant='h3' fontWeight='bold' textAlign='center' color='primary.main'>
              {themeConfig.templateName}
            </Typography>
            <Typography variant='h6' textAlign='center' color='text.secondary'>
              Your gateway to seamless management
            </Typography>
          </Box>
        </IllustrationWrapper>

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
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              mt: '5.6rem',
            }}
          >
            {step === 'LOGIN' ? (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant='h4' fontWeight='bold' gutterBottom>
                    {t('auth.login.welcome_user', { templateName: themeConfig.templateName })}
                  </Typography>
                  <Typography color='text.secondary'>{t('auth.login.signin_prompt')}</Typography>
                </Box>

                <Box
                  component='form'
                  noValidate
                  onSubmit={controlForm.handleSubmit(onSubmit)}
                  sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                >
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
                        autoFocus
                        fullWidth
                        label={t('auth.login.email_label')}
                        placeholder='Enter your email'
                        error={formState?.errors?.email !== undefined}
                        helperText={formState?.errors?.email?.message}
                      />
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
                    }}
                    render={({ field, formState }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label={t('auth.login.password_label')}
                        type={showPassword ? 'text' : 'password'}
                        placeholder='••••••••••••'
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                aria-label='toggle password visibility'
                                onClick={handleShowPassword}
                                edge='end'
                                onMouseDown={(e) => e.preventDefault()}
                              >
                                {showPassword ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        error={formState?.errors?.password !== undefined}
                        helperText={formState?.errors?.password?.message}
                      />
                    )}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    <Controller
                      name='remember_me'
                      control={controlForm.control}
                      render={({ field }) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!!field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                          }
                          label={t('auth.login.remember_me')}
                        />
                      )}
                    />
                    <HLink
                      component={Link}
                      to='/auth/forgot-password'
                      sx={{ textDecoration: 'none', color: 'primary.main' }}
                    >
                      {t('auth.login.forgot_password')}
                    </HLink>
                  </Box>

                  <Button
                    fullWidth
                    variant='contained'
                    type='submit'
                    size='large'
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending
                      ? t('auth.login.button_signing_in')
                      : t('auth.login.button_login')}
                  </Button>

                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}
                  >
                    <Typography color='text.secondary'>New on our platform?</Typography>
                    <HLink
                      component={Link}
                      to='/auth/sign-up'
                      sx={{ textDecoration: 'none', color: 'primary.main' }}
                    >
                      Create an account
                    </HLink>
                  </Box>

                  <Divider sx={{ color: 'text.secondary' }}>or</Divider>

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
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant='h4' fontWeight='bold' gutterBottom textAlign='center'>
                  2-Step Verification
                </Typography>
                <Typography color='text.secondary' textAlign='center' mb={4}>
                  Enter the code from your authenticator app
                </Typography>

                <TextField
                  fullWidth
                  label='Verification code'
                  variant='outlined'
                  value={mfaCode}
                  // onChange={(e) => setMfaCode(e.target.value)}
                  // onKeyPress={(e) => e.key === 'Enter' && handleMfaVerify()}
                  autoFocus
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Lock />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 4 }}
                />

                <Button
                  fullWidth
                  variant='contained'
                  size='large'
                  // onClick={handleMfaVerify}
                  // disabled={mfaVerifyMutation.isPending || mfaCode.length < 6}
                >
                  Verify
                  {/* {mfaVerifyMutation.isPending ? 'Verifying...' : 'Verify'} */}
                </Button>

                <Button
                  fullWidth
                  variant='text'
                  onClick={() => {
                    setStep('LOGIN')
                    setMfaCode('')
                  }}
                  sx={{ mt: 2, textTransform: 'none' }}
                >
                  Back to Login
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            // bgcolor: 'background.paper',
          }}
        >
          <FormWrapper>
            <Box sx={{ position: 'absolute', top: 20, left: 20, display: { md: 'none' } }}>
              <AdaptiveLogo />
            </Box>

            <Box
              sx={{
                width: '100%',
                maxWidth: 400,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
              }}
            ></Box>
          </FormWrapper>
        </Box> */}
      </Box>
    </>
  )
}
