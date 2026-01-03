import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Snackbar,
  Link as MuiLink,
  CardContent,
  Card,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, AdaptiveLogo, themeConfig } from '@cap/platform-core'

import { useForgotPassword, ForgotPasswordRequest } from '../index'

// Constants
const EMAIL_PATTERN = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

const DEFAULT_FORM_VALUES = {
  email: '',
} as const

const SUPPORT_EMAIL = 'support@example.com'

export default function ForgetPassword() {
  const { t } = useTranslation()
  const [open, setOpen] = useState<boolean>(false)
  const [alertType, setAlertType] = useState<'error' | 'success'>('success')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handleCloseAlert = useCallback(() => setOpen(false), [])

  const controlForm = useForm<ForgotPasswordRequest>({
    defaultValues: DEFAULT_FORM_VALUES,
  })

  const handleForgotPasswordSuccess = useCallback(() => {
    setAlertType('success')
    setOpen(true)
    controlForm.reset()
  }, [controlForm])

  const handleForgotPasswordError = useCallback(
    (error: any) => {
      setAlertType('error')
      setErrorMessage(
        error.response?.data?.detail || error.message || t('auth.forgot_password.error_title'),
      )
      setOpen(true)
    },
    [t],
  )

  const forgotPasswordMutation = useForgotPassword({
    onSuccess: handleForgotPasswordSuccess,
    onError: handleForgotPasswordError,
  })

  const onSubmit = useCallback(
    (data: ForgotPasswordRequest) => {
      forgotPasswordMutation.mutate({ data })
    },
    [forgotPasswordMutation],
  )

  return (
    <>
      <title>
        {t('auth.forgot_password.title_page')} - {themeConfig.templateName}
      </title>
      <meta
        name='description'
        content={`${t('auth.forgot_password.meta_desc')} - ${themeConfig.templateName}`}
      />
      <meta
        name='keywords'
        content={`forgot password, reset password, ${themeConfig.templateName}`}
      />

      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
        }}
      >
        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: 450,
            borderRadius: 2,
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
            <Box sx={{ mb: 6 }}>
              <AdaptiveLogo />
            </Box>

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                textAlign: 'center',
                mb: 6,
              }}
            >
              <Typography
                component='h1'
                sx={{
                  fontSize: '1.875rem',
                  fontWeight: 900,
                  letterSpacing: '-0.025em',
                }}
              >
                {t('auth.forgot_password.title')}
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '1rem',
                }}
              >
                {t('auth.forgot_password.subtitle')}
              </Typography>
            </Box>

            <Box
              component='form'
              onSubmit={controlForm.handleSubmit(onSubmit)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                width: '100%',
              }}
            >
              {/* Email Field */}
              <Box>
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
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id='email'
                      type='email'
                      label={t('auth.forgot_password.email_label')}
                      placeholder={t('auth.forgot_password.email_placeholder')}
                      fullWidth
                      error={controlForm.formState?.errors?.email !== undefined}
                      helperText={controlForm.formState?.errors?.email?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
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
                size='large'
                disabled={forgotPasswordMutation.isPending}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  mt: 1,
                }}
              >
                {forgotPasswordMutation.isPending
                  ? t('auth.forgot_password.button_sending')
                  : t('auth.forgot_password.button_send')}
              </Button>
            </Box>
            <Typography
              sx={{
                mt: 4,
                textAlign: 'center',
                fontSize: '0.875rem',
                color: 'text.secondary',
              }}
            >
              {t('auth.forgot_password.remember_password')}{' '}
              <MuiLink
                component={Link}
                to='/auth/sign-in'
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {t('auth.forgot_password.back_to_login')}
              </MuiLink>
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#FFFFFF', zIndex: (theme) => theme.zIndex.drawer + 10 }}
        open={forgotPasswordMutation.isPending}
      >
        <CircularProgress color='inherit' />
      </Backdrop>

      {/* Alert Snackbar */}
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
              <Typography
                component='div'
                sx={{
                  pt: 1,
                  bgcolor: 'transparent',
                }}
              >
                {t('auth.forgot_password.success_title')}
              </Typography>
              <Typography
                component='div'
                sx={{
                  pt: 1,
                  bgcolor: 'transparent',
                }}
              >
                {t('auth.forgot_password.success_desc1')}
              </Typography>
              <Typography
                component='div'
                sx={{
                  pt: 1,
                  bgcolor: 'transparent',
                }}
              >
                {t('auth.forgot_password.success_desc2')}
              </Typography>
              <Typography
                component='div'
                sx={{
                  pt: 1,
                  bgcolor: 'transparent',
                }}
              >
                {t('auth.forgot_password.support_text')}{' '}
                <MuiLink
                  component={Link}
                  to={`mailto:${SUPPORT_EMAIL}`}
                  sx={{
                    //color: '#FFF',
                    textDecoration: 'underline',
                  }}
                >
                  {SUPPORT_EMAIL}
                </MuiLink>
                .
              </Typography>
              <Typography
                component='div'
                sx={{
                  pt: 1,
                  bgcolor: 'transparent',
                  //color: '#FFF'
                }}
              >
                {t('auth.forgot_password.thanks')}
              </Typography>
            </Box>
          )}
          {alertType === 'error' && (
            <Box>
              <Typography
                component='div'
                sx={{
                  pt: 1,
                  bgcolor: 'transparent',
                  //color: '#FFF'
                }}
              >
                {t('auth.forgot_password.error_title')}
              </Typography>
              <Typography
                component='div'
                sx={{
                  pt: 1,
                  bgcolor: 'transparent',
                  //color: '#FFF'
                }}
              >
                {errorMessage}
              </Typography>
              <Typography
                component='div'
                sx={{
                  pt: 1,
                  bgcolor: 'transparent',
                  //color: '#FFF'
                }}
              >
                {t('auth.forgot_password.error_desc1')}
              </Typography>
              <Typography
                component='div'
                sx={{
                  pt: 1,
                  bgcolor: 'transparent',
                  // color: '#FFF'
                }}
              >
                {t('auth.forgot_password.error_desc2')}{' '}
                <MuiLink
                  component={Link}
                  to={`mailto:${SUPPORT_EMAIL}`}
                  sx={{
                    //color: '#FFF',
                    textDecoration: 'underline',
                  }}
                >
                  {SUPPORT_EMAIL}
                </MuiLink>
                .
              </Typography>
              <Typography
                component='div'
                sx={{
                  pt: 1,
                  bgcolor: 'transparent',
                  //color: '#FFF'
                }}
              >
                {t('auth.forgot_password.apology')}
              </Typography>
            </Box>
          )}
        </MAlert>
      </Snackbar>
    </>
  )
}
