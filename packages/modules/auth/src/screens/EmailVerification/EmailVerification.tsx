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
import { EmailOutlined, MailOutline } from '@mui/icons-material'
import { Link as RouterLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
        setSuccessMessage(response.data.message || t('auth.verification.resend_success'))
      } else {
        setErrorMessage(response.data.message || t('auth.verification.resend_error'))
      }
    } catch (error: any) {
      console.error(error)
      setErrorMessage(error.message || t('auth.verification.resend_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <React.Fragment>
      <title>
        {t('auth.verification.title_page')} - {themeConfig.templateName}
      </title>
      <meta name='description' content={t('auth.verification.meta_desc')} />

      <Container
        component='main'
        maxWidth='sm'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          py: 4,
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
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: 'primary.light',
                opacity: 0.1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <MailOutline sx={{ fontSize: 40, color: 'primary.main' }} />
            </Box>

            <Typography
              component='h1'
              variant='h4'
              sx={{ mb: 1, fontWeight: 'bold', textAlign: 'center' }}
            >
              {t('auth.verification.title')}
            </Typography>
            <Typography variant='body1' color='text.secondary' align='center' sx={{ mb: 4 }}>
              {t('auth.verification.desc')}
            </Typography>

            {successMessage && (
              <Alert severity='success' sx={{ mb: 3, width: '100%' }}>
                {successMessage}
              </Alert>
            )}

            {errorMessage && (
              <Alert severity='error' sx={{ mb: 3, width: '100%' }}>
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
              }}
            >
              <Controller
                name='email'
                control={control}
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
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    type='email'
                    label={t('auth.verification.email_label')}
                    fullWidth
                    autoComplete='email'
                    placeholder={t('auth.login.email_placeholder')}
                    error={Boolean(formState.errors.email)}
                    helperText={formState.errors.email?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <EmailOutlined sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      mb: 4,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />
                )}
              />
              <Button
                type='submit'
                variant='contained'
                fullWidth
                size='large'
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  mb: 4,
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color='inherit' />
                ) : (
                  t('auth.verification.button_resend')
                )}
              </Button>

              <Typography variant='body2' color='text.secondary' align='center'>
                {t('auth.verification.resend_help')}{' '}
                <MuiLink
                  component={RouterLink}
                  to='#'
                  sx={{
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: 'primary.main',
                  }}
                >
                  {t('auth.verification.contact_support')}
                </MuiLink>
                .
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default EmailVerification
