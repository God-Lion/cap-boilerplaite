import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Link as HLink,
  TextField,
  Typography,
  Card,
  CardContent,
  Backdrop,
  CircularProgress,
  Snackbar,
  InputAdornment,
  Divider,
} from '@mui/material'
import { LockPerson, Email, ArrowForward, VerifiedUser } from '@mui/icons-material'
import { alpha, useTheme } from '@mui/material/styles'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert } from '@cap/platform-core'
import { themeConfig } from '@cap/platform-core'
import { IStatus } from '@cap/platform-core'

interface PasswordlessForm {
  email: string
}

const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export default function PasswordlessInitiation() {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()

  const controlForm = useForm<PasswordlessForm>({
    defaultValues: {
      email: '',
    },
  })

  const [status, setStatus] = useState<IStatus>({
    open: false,
    type: 'success',
    state: '',
    msg: '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleCloseStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, open: false }))
  }, [])

  const onSubmit = useCallback(
    async (data: PasswordlessForm) => {
      setIsLoading(true)

      try {
        // TODO: Replace with actual API call
        // await passwordlessService.sendMagicLink(data.email)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setStatus({
          open: true,
          type: 'success',
          state: 'success',
          msg: t('auth.passwordless.magic_link_sent'),
        })

        // Navigate to verification screen after short delay
        setTimeout(() => {
          navigate('/auth/passwordless-verification', {
            state: { email: data.email },
          })
        }, 2000)
      } catch (error: any) {
        setStatus({
          open: true,
          type: 'error',
          state: 'error',
          msg: error.response?.data?.detail || t('auth.passwordless.send_failed'),
        })
      } finally {
        setIsLoading(false)
      }
    },
    [navigate, t],
  )

  const handleUsePassword = useCallback(() => {
    navigate('/auth/sign-in')
  }, [navigate])

  return (
    <>
      <title>
        {t('auth.passwordless.title')} - {themeConfig.templateName}
      </title>
      <meta
        name='description'
        content={`${t('auth.passwordless.description')} - ${themeConfig.templateName}`}
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
          py: { xs: 4, sm: 10 },
          px: { xs: 2, sm: 3, lg: 4 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorations */}
        <Box
          sx={{
            position: 'absolute',
            top: '-20%',
            right: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: 1,
            // bgcolor:
            //   theme.palette.mode === 'dark'
            //     ? 'rgba(19, 127, 236, 0.1)'
            //     : 'rgba(19, 127, 236, 0.05)',
            // filter: 'blur(80px)',
            // pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '-20%',
            left: '-10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            // bgcolor:
            //   theme.palette.mode === 'dark'
            //     ? 'rgba(19, 127, 236, 0.1)'
            //     : 'rgba(19, 127, 236, 0.05)',
            // filter: 'blur(80px)',
            // pointerEvents: 'none',
          }}
        />

        <Backdrop open={isLoading} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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

        {/* Main Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '480px',
            zIndex: 1,
          }}
        >
          <Card
            sx={{
              borderRadius: 1,
              // borderRadius: { xs: 0, sm: '16px' },
              boxShadow: theme.shadows[24],
              // border: '1px solid',
              // borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#dbe0e6',
              // bgcolor: theme.palette.mode === 'dark' ? '#1A2633' : '#ffffff',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                pt: 5,
                pb: 1,
                px: 4,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  // theme.palette.mode === 'dark'
                  //   ? 'rgba(19, 127, 236, 0.2)'
                  //   : 'rgba(19, 127, 236, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1,
                }}
              >
                <LockPerson sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
              </Box>
            </Box>

            {/* Text Content */}
            <Box
              sx={{
                px: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Typography
                variant='h4'
                fontWeight='700'
                textAlign='center'
                sx={{
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  lineHeight: 1.3,
                  color: 'text.primary',
                  // color: theme.palette.mode === 'dark' ? '#ffffff' : '#111418',
                  letterSpacing: '-0.025em',
                  pb: 1.5,
                }}
              >
                {t('auth.passwordless.heading')}
              </Typography>
              <Typography
                variant='body1'
                textAlign='center'
                sx={{
                  color: 'text.secondary',
                  // color: theme.palette.mode === 'dark' ? '#9ca3af' : '#617589',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  pb: 3,
                  maxWidth: '360px',
                }}
              >
                {t('auth.passwordless.subheading')}
              </Typography>
            </Box>

            {/* Form */}
            <CardContent
              sx={{
                px: 4,
                pb: 4,
              }}
            >
              <Box
                component='form'
                onSubmit={controlForm.handleSubmit(onSubmit)}
                noValidate
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {/* Email Input */}
                <Box>
                  <Typography
                    variant='body2'
                    fontWeight='500'
                    sx={{
                      mb: 1,
                      color: 'text.secondary',
                      // color: theme.palette.mode === 'dark' ? '#e5e7eb' : '#111418',
                      fontSize: '0.875rem',
                    }}
                  >
                    {t('auth.login.email_label')}
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
                        value: EMAIL_PATTERN,
                        message: t('auth.login.invalid_email'),
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        required
                        type='email'
                        fullWidth
                        autoComplete='email'
                        label={t('auth.login.email_label')}
                        placeholder={t('auth.login.email_placeholder_v2')}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Email
                                sx={{
                                  fontSize: 20,
                                  color: theme.palette.mode === 'dark' ? '#9ca3af' : '#617589',
                                }}
                              />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 48,
                            borderRadius: '8px',
                            // bgcolor: theme.palette.mode === 'dark' ? '#111a22' : '#ffffff',
                            // '& fieldset': {
                            //   borderColor: theme.palette.mode === 'dark' ? '#2d3b4a' : '#dbe0e6',
                            // },
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: '2px',
                            },
                            '& input': {
                              // color: theme.palette.mode === 'dark' ? '#ffffff' : '#111418',
                              fontSize: '1rem',
                            },
                            '& input::placeholder': {
                              // color: theme.palette.mode === 'dark' ? '#6b7280' : '#617589',
                              opacity: 1,
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Primary Button */}
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  size='large'
                  disabled={isLoading}
                  endIcon={<ArrowForward />}
                  sx={{
                    height: 48,
                    px: 2.5,
                    borderRadius: 1,
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    // bgcolor: '#137fec',
                    color: 'primary.main',
                    boxShadow: '0 1px 3px rgba(19, 127, 236, 0.3)',
                    // '&:hover': {
                    //   bgcolor: '#0f66bd',
                    //   boxShadow: '0 4px 6px rgba(19, 127, 236, 0.4)',
                    // },
                  }}
                >
                  {t('auth.passwordless.send_magic_link')}
                </Button>

                {/* Divider */}
                <Divider sx={{ py: 1 }}>
                  <Typography
                    variant='caption'
                    sx={{
                      color: 'text.secondary',
                      // color: theme.palette.mode === 'dark' ? '#6b7280' : '#9ca3af',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      px: 2,
                    }}
                  >
                    {t('auth.common.or')}
                  </Typography>
                </Divider>

                {/* Alternative Action */}
                <Button
                  fullWidth
                  variant='outlined'
                  size='large'
                  onClick={handleUsePassword}
                  sx={{
                    height: 48,
                    px: 2.5,
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '1rem',
                    // borderColor: theme.palette.mode === 'dark' ? '#2d3b4a' : '#dbe0e6',
                    color: 'text.primary',
                    bgcolor: 'transparent',
                    '&:hover': {
                      bgcolor: 'transparent',
                      // borderColor: theme.palette.mode === 'dark' ? '#2d3b4a' : '#dbe0e6',
                    },
                  }}
                >
                  {t('auth.passwordless.use_password_instead')}
                </Button>
              </Box>
            </CardContent>

            {/* Secure Footer */}
            <Box
              sx={{
                // bgcolor: theme.palette.mode === 'dark' ? '#151f29' : '#f9fafb',
                // borderTop: '1px solid',
                // borderTopColor: theme.palette.mode === 'dark' ? '#2d3b4a' : '#dbe0e6',
                py: 2,
                px: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <VerifiedUser
                sx={{
                  fontSize: 16,
                  color: theme.palette.mode === 'dark' ? '#10b981' : '#16a34a',
                }}
              />
              <Typography
                variant='caption'
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: theme.palette.mode === 'dark' ? '#94a3b8' : '#64748b',
                }}
              >
                {t('auth.passwordless.secured_by', {
                  appName: t('auth.common.appName'),
                })}
              </Typography>
            </Box>
          </Card>

          {/* Terms and Privacy */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant='caption' color='text.secondary'>
              {t('auth.passwordless.terms_agreement')}{' '}
              <HLink
                component={Link}
                to='/terms'
                sx={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  textDecorationColor: theme.palette.mode === 'dark' ? '#4b5563' : '#cbd5e1',
                  textUnderlineOffset: '2px',
                  '&:hover': {
                    color: '#137fec',
                    textDecorationColor: '#137fec',
                  },
                }}
              >
                {t('auth.common.termsOfService')}
              </HLink>{' '}
              {t('auth.common.and')}{' '}
              <HLink
                component={Link}
                to='/privacy'
                sx={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  textDecorationColor: theme.palette.mode === 'dark' ? '#4b5563' : '#cbd5e1',
                  textUnderlineOffset: '2px',
                  '&:hover': {
                    color: '#137fec',
                    textDecorationColor: '#137fec',
                  },
                }}
              >
                {t('auth.common.privacyPolicy')}
              </HLink>
              .
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  )
}

