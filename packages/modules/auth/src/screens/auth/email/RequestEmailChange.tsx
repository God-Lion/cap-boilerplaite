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
  alpha,
  Snackbar,
} from '@mui/material'
import { AlternateEmail, ArrowBack } from '@mui/icons-material'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, themeConfig, IStatus } from '@cap/platform-core'
import Path from '../path'

interface RequestEmailChangeForm {
  currentEmail: string
  newEmail: string
}

export default function RequestEmailChange() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestEmailChangeForm>({
    defaultValues: {
      currentEmail: '', // Usually would be pre-filled from user profile
      newEmail: '',
    },
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

  const onSubmit = useCallback(
    (data: RequestEmailChangeForm) => {
      // Simulated API call
      console.log('Requesting email change:', data)
      setStatus({
        open: true,
        type: 'success',
        state: 'success',
        msg: t(
          'auth.email.change_request_sent',
          'Email change request initiated. Please check your current email for confirmation.',
        ),
      })

      setTimeout(() => {
        navigate(Path.initiateEmailChange)
      }, 2000)
    },
    [navigate, t],
  )

  return (
    <>
      <title>
        {t('auth.email.request_change_title', 'Request Email Change')} - {themeConfig.templateName}
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
            borderRadius: '16px',
            boxShadow: (theme) => `0 20px 40px ${alpha(theme.palette.common.black, 0.1)}`,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            mx: 2,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 6 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <AlternateEmail sx={{ color: 'primary.main', fontSize: 32 }} />
              </Box>
              <Typography variant='h4' sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.025em' }}>
                {t('auth.email.change_heading', 'Change Email')}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {t(
                  'auth.email.change_description',
                  "Update your account email address. For security, we'll send a confirmation link to your current email.",
                )}
              </Typography>
            </Box>

            <Box
              component='form'
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
            >
              <Box>
                <Typography
                  component='label'
                  sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, mb: 1 }}
                >
                  {t('auth.email.current_email_label', 'Current Email')}
                </Typography>
                <Controller
                  name='currentEmail'
                  control={control}
                  rules={{
                    required: t('auth.email.current_email_required', 'Current email is required'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('auth.email.invalid_email', 'Invalid email address'),
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder='name@example.com'
                      error={!!errors.currentEmail}
                      helperText={errors.currentEmail?.message}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                  )}
                />
              </Box>

              <Box>
                <Typography
                  component='label'
                  sx={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, mb: 1 }}
                >
                  {t('auth.email.new_email_label', 'New Email')}
                </Typography>
                <Controller
                  name='newEmail'
                  control={control}
                  rules={{
                    required: t('auth.email.new_email_required', 'New email is required'),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t('auth.email.invalid_email', 'Invalid email address'),
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      placeholder='new-name@example.com'
                      error={!!errors.newEmail}
                      helperText={errors.newEmail?.message}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
                    />
                  )}
                />
              </Box>

              <Button
                type='submit'
                fullWidth
                variant='contained'
                size='large'
                sx={{
                  height: 52,
                  borderRadius: '12px',
                  fontWeight: 700,
                  textTransform: 'none',
                  mt: 1,
                }}
              >
                {t('auth.email.request_change_button', 'Request Email Change')}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  component={Link}
                  to={Path.team}
                  variant='text'
                  startIcon={<ArrowBack />}
                  sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
                >
                  {t('auth.common.cancel', 'Cancel')}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
