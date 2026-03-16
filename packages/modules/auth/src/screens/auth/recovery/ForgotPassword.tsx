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
import { motion, AnimatePresence } from 'framer-motion'
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
        msg: t('auth.forgot_password.reset_link_sent', 'Check your email for the reset link.'),
      })
      setTimeout(() => navigate(Path.auth.checkEmail), 2000)
    },
    onError: (error: any) => {
      setStatus({
        open: true,
        type: 'error',
        state: 'error',
        msg: error.response?.data?.detail || t('auth.forgot_password.request_failed', 'Password reset request failed.'),
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
        {t('auth.forgot_password.title_page', 'Forgot Password')} - {themeConfig.templateName}
      </title>

      <Container
        component="main"
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
          sx={{ color: "info.main", zIndex: (theme) => theme.zIndex.drawer + 1, backdropFilter: 'blur(4px)' }}
        >
          <CircularProgress color="inherit" />
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Card
            sx={{
              width: '100%',
              maxWidth: '480px',
              borderRadius: '16px',
              boxShadow: (theme) => `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
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
                  `linear-gradient(to right, ${alpha(theme.palette.info.main, 0.6)}, ${theme.palette.info.main})`,
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
                  borderRadius: '12px',
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'rotate(-5deg)',
                }}
              >
                <LockReset sx={{ color: 'info.main', fontSize: 32 }} />
              </Box>

              {/* Headlines */}
              <Typography
                variant="h4"
                sx={{
                  color: 'text.primary',
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  mb: 1.5,
                  fontFamily: 'inherit',
                }}
              >
                {t('auth.forgot_password.title', 'Forgot Password')}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  fontSize: '1rem',
                  mb: 4,
                  maxWidth: '340px',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                }}
              >
                {t('auth.forgot_password.subtitle', "Enter your email address and we'll send you a link to reset your password.")}
              </Typography>

              {/* Form */}
              <Box
                component="form"
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
                    component="label"
                    htmlFor="email"
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
                    {t('auth.forgot_password.email_label', 'Email Address')}
                  </Typography>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: t('auth.forgot_password.email_required', 'Email is required.'),
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('auth.forgot_password.invalid_email', 'Invalid email address.'),
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        id="email"
                        type="email"
                        fullWidth
                        autoComplete="email"
                        placeholder={t('auth.forgot_password.email_placeholder', 'name@example.com')}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Mail sx={{ fontSize: 20, color: 'info.main', opacity: 0.7 }} />
                              </InputAdornment>
                            ),
                          },
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            height: 48,
                            borderRadius: '12px',
                            bgcolor: (theme) => alpha(theme.palette.background.default, 0.5),
                            '& fieldset': {
                              borderColor: 'divider',
                            },
                            '&:hover fieldset': {
                              borderColor: 'info.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'info.main',
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
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="info"
                  disabled={forgotPasswordMutation.isPending}
                  sx={{
                    height: 52,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: (theme) => `0 4px 14px 0 ${alpha(theme.palette.info.main, 0.3)}`,
                    fontFamily: 'inherit',
                    '&:hover': {
                      bgcolor: 'info.dark',
                      boxShadow: (theme) =>
                        `0 6px 20px 0 ${alpha(theme.palette.info.main, 0.4)}`,
                    },
                    '&:active': {
                      transform: 'translateY(1px)',
                    },
                  }}
                >
                  {forgotPasswordMutation.isPending
                    ? t('auth.forgot_password.button_sending', 'Sending...')
                    : t('auth.forgot_password.button_send', 'Send Reset Link')}
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
                    fontWeight: 600,
                    color: 'text.secondary',
                    textDecoration: 'none',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'info.main',
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
                  {t('auth.forgot_password.back_to_login', 'Back to Login')}
                </MuiLink>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.875rem',
              color: 'text.disabled',
              fontFamily: 'inherit',
            }}
          >
            © {new Date().getFullYear()} {t('auth.common.appName', 'Godlio')}.{' '}
            {t('auth.common.allRightsReserved', 'All rights reserved.')}
          </Typography>
        </Box>
      </Container>
    </>
  )
}
