import React from 'react'
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Link as MuiLink,
  CardContent,
  Card,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { EmailOutlined, MailOutline, ArrowBack } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { themeConfig, AdaptiveLogo } from '@cap/platform-core'
import { useForm, Controller } from 'react-hook-form'
import authService from '../../services/auth.service'

interface FormData {
  email: string
}

const EmailVerification: React.FC = () => {
  const { t } = useTranslation()
  const { control, formState, handleSubmit } = useForm<FormData>({
    defaultValues: {
      email: '',
    },
  })

  const [loading, setLoading] = React.useState(false)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setSuccessMessage(null)
    setErrorMessage(null)
    try {
      const response = await authService.resendVerification(data.email)
      if (response.status === 200) {
        setSuccessMessage(response.data.message || t('auth.verification.resend_success', 'Verification email sent.'))
      } else {
        setErrorMessage(response.data.message || t('auth.verification.resend_error', 'Failed to resend verification email.'))
      }
    } catch (error: any) {
      console.error(error)
      setErrorMessage(error.message || t('auth.verification.resend_error', 'Failed to resend verification email.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
      <title>
        {t('auth.verification.title_page', 'Email Verification')} - {themeConfig.templateName}
      </title>
      <meta name="description" content={t('auth.verification.meta_desc', 'Verify your email address')} />

      <Container
        component='main'
        maxWidth={false}
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100dvh',
          bgcolor: 'background.default',
          py: { xs: 4, sm: 8 },
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
        >
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              maxWidth: 480,
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
              <Box sx={{ mb: 4 }}>
                <AdaptiveLogo />
              </Box>

              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '12px',
                  bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                  transform: 'rotate(-5deg)',
                }}
              >
                <MailOutline sx={{ fontSize: 36, color: 'info.main' }} />
              </Box>

              <Typography
                component="h1"
                variant="h4"
                sx={{
                  mb: 1.5,
                  fontWeight: 800,
                  fontSize: '1.75rem',
                  letterSpacing: '-0.025em',
                  fontFamily: 'inherit',
                  color: 'text.primary',
                }}
              >
                {t('auth.verification.title', 'Verify Email')}
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  mb: 4,
                  maxWidth: '340px',
                  fontFamily: 'inherit',
                  lineHeight: 1.6,
                }}
              >
                {t('auth.verification.desc', "Please verify your email address to continue accessing your account.")}
              </Typography>

              {successMessage && (
                <Alert severity='success' sx={{ mb: 3, width: '100%', borderRadius: '12px' }}>
                  {successMessage}
                </Alert>
              )}

              {errorMessage && (
                <Alert severity='error' sx={{ mb: 3, width: '100%', borderRadius: '12px' }}>
                  {errorMessage}
                </Alert>
              )}

              <Box
                component='form'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                autoComplete='off'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  textAlign: 'left',
                }}
              >
                <Box sx={{ mb: 3 }}>
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
                    {t('auth.verification.email_label', 'Email Address')}
                  </Typography>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: {
                        value: true,
                        message: t('auth.login.email_required', 'Email is required'),
                      },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: t('auth.login.invalid_email', 'Invalid email address'),
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="email"
                        type="email"
                        fullWidth
                        autoComplete="email"
                        placeholder={t('auth.login.email_placeholder', 'name@example.com')}
                        error={Boolean(formState.errors.email)}
                        helperText={formState.errors.email?.message}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailOutlined sx={{ fontSize: 20, color: "info.main", opacity: 0.7 }} />
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

                <Button
                  type='submit'
                  variant='contained'
                  color='info'
                  fullWidth
                  sx={{
                    height: 52,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    mb: 4,
                    boxShadow: (theme) => `0 4px 14px 0 ${alpha(theme.palette.info.main, 0.3)}`,
                    fontFamily: 'inherit',
                    '&:hover': {
                      bgcolor: 'info.dark',
                      boxShadow: (theme) => `0 6px 20px 0 ${alpha(theme.palette.info.main, 0.4)}`,
                    },
                    '&:active': {
                      transform: 'translateY(1px)',
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color='inherit' />
                  ) : (
                    t('auth.verification.button_resend', 'Resend Email')
                  )}
                </Button>

                <Box
                  sx={{
                    pt: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    width: '100%',
                  }}
                >
                  <Typography
                    variant='body2'
                    sx={{
                      color: 'text.secondary',
                      textAlign: 'center',
                      fontFamily: 'inherit',
                      fontSize: '0.875rem',
                    }}
                  >
                    {t('auth.verification.resend_help', "Didn't receive the email?")}{' '}
                    <MuiLink
                      component={RouterLink}
                      to="#"
                      sx={{
                        fontWeight: 600,
                        textDecoration: 'none',
                        color: 'info.main',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {t('auth.verification.contact_support', 'Contact Support')}
                    </MuiLink>
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </React.Fragment>
  )
}

export default EmailVerification
