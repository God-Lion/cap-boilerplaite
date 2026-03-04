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
  Snackbar,
  Backdrop,
  CircularProgress,
  Link as MuiLink,
  InputAdornment,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { LockReset, Mail, ArrowBack } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, themeConfig, IStatus } from '@cap/platform-core'
import { useForgotPassword } from '../../../hooks/useAuthQuery'
import { Path } from '../../../screens'

interface ForgotPasswordForm {
  email: string
}

export default function ForgotPassword() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { control, handleSubmit } = useForm<ForgotPasswordForm>({
    defaultValues: { email: '' },
  })

  const [status, setStatus] = useState<IStatus>({
    open: false,
    type: '',
    state: '',
    msg: '',
  })

  const handleCloseStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, open: false }))
  }, [])

  const forgotPasswordMutation = useForgotPassword({
    onSuccess: () => {
      setStatus({
        open: true,
        type: 'success',
        state: 'success',
        msg: t('auth.forgot_password.reset_link_sent'),
      })
      setTimeout(() => navigate(Path.auth.checkEmail), 2000)
    },
    onError: (error: any) => {
      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg: error.response?.data?.detail || t('auth.forgot_password.request_failed'),
      })
    },
  })

  const onSubmit = useCallback(
    (formData: ForgotPasswordForm) => {
      forgotPasswordMutation.mutate({ data: formData })
    },
    [forgotPasswordMutation],
  )

  return (
    <>
      <title>
        {t('auth.forgot_password.title_page')} - {themeConfig.templateName}
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
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <Backdrop
          open={forgotPasswordMutation.isPending}
          sx={{ color: 'primary.contrastText', zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
            maxWidth: '480px',
            borderRadius: '12px',
            boxShadow: (theme) => theme.shadows[4],
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            position: 'relative',
            mx: 2,
            bgcolor: 'background.paper',
          }}
        >
          {/* Top Accent Bar */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: 4,
              background: (theme) =>
                `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.6)}, ${theme.palette.primary.main})`,
            }}
          />

          <CardContent
            sx={{
              px: { xs: 3, sm: 4 },
              py: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Security Icon */}
            <Box
              sx={{
                mb: 3,
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockReset sx={{ color: 'primary.main', fontSize: 32 }} />
            </Box>

            {/* Headlines */}
            <Typography
              variant='h4'
              sx={{
                color: 'text.primary',
                fontSize: '1.75rem',
                fontWeight: 700,
                letterSpacing: '-0.025em',
                mb: 1.5,
                fontFamily: 'inherit',
              }}
            >
              {t('auth.forgot_password.title')}
            </Typography>

            <Typography
              variant='body1'
              sx={{
                color: 'text.secondary',
                fontSize: '1rem',
                mb: 4,
                maxWidth: '340px',
                fontFamily: 'inherit',
              }}
            >
              {t('auth.forgot_password.subtitle')}
            </Typography>

            {/* Form */}
            <Box
              component='form'
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                textAlign: 'left',
              }}
            >
              {/* Email Input */}
              <Box>
                <Typography
                  component='label'
                  htmlFor='email'
                  sx={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 1,
                    ml: 0.5,
                    fontFamily: 'inherit',
                  }}
                >
                  {t('auth.forgot_password.email_label')}
                </Typography>
                <Controller
                  name='email'
                  control={control}
                  rules={{
                    required: t('auth.forgot_password.email_required'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('auth.forgot_password.invalid_email'),
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      id='email'
                      type='email'
                      fullWidth
                      autoComplete='email'
                      placeholder={t('auth.forgot_password.email_placeholder')}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Mail sx={{ fontSize: 20, color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          height: 48,
                          borderRadius: '8px',
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
                          color: 'text.secondary',
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
                disabled={forgotPasswordMutation.isPending}
                sx={{
                  height: 48,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  boxShadow: (theme) => `0 1px 2px 0 ${alpha(theme.palette.primary.main, 0.2)}`,
                  fontFamily: 'inherit',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    boxShadow: (theme) =>
                      `0 4px 6px -1px ${alpha(theme.palette.primary.main, 0.3)}`,
                  },
                  '&:active': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                {forgotPasswordMutation.isPending
                  ? t('auth.forgot_password.button_sending')
                  : t('auth.forgot_password.button_send')}
              </Button>
            </Box>

            {/* Back to Login Link */}
            <Box
              sx={{
                mt: 4,
                pt: 3,
                borderTop: '1px solid',
                borderColor: 'divider',
                width: '100%',
              }}
            >
              <MuiLink
                component={Link}
                to={Path.auth.signin}
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  '&:hover': {
                    color: 'primary.main',
                    '& .MuiSvgIcon-root': {
                      transform: 'translateX(-4px)',
                    },
                  },
                  '& .MuiSvgIcon-root': {
                    fontSize: 18,
                    transition: 'transform 0.2s',
                  },
                }}
              >
                <ArrowBack />
                {t('auth.forgot_password.back_to_login')}
              </MuiLink>
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
    </>
  )
}

