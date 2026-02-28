import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Card,
  CardContent,
  CssBaseline,
  Alert,
} from '@mui/material'
import {
  Lock,
  Visibility,
  VisibilityOff,
  VpnKey,
  LockReset,
  Mail,
  AlternateEmail,
  Info,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'
import { Controller, useForm } from 'react-hook-form'
import Path from './path'

interface ChangeEmailRequestFormData {
  CurrentEmail: string
  newEmail: string
  password: string
}

function ChangeEmail() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  // const theme = useTheme()
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  const controlForm = useForm<ChangeEmailRequestFormData>({
    defaultValues: {
      CurrentEmail: '',
      newEmail: '',
      password: '',
    },
  })

  // Password Logic
  const onSubmit = (data: ChangeEmailRequestFormData) => {
    console.log('Form Submitted', data)
  }

  return (
    <>
      <title>
        {t('auth.account.change_email_title')} - {themeConfig.templateName}
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
          py: { xs: 8, sm: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CssBaseline />
        {/* Abstract Background Pattern */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: (theme) =>
              `radial-gradient(${theme.palette.divider} 0.5px, transparent 0.5px)`,
            backgroundSize: '24px 24px',
            maskImage: 'linear-gradient(180deg, white, rgba(255, 255, 255, 0))',
            opacity: 0.2,
            pointerEvents: 'none',
          }}
        />

        <Card
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '480px',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '12px',
            boxShadow: (theme) => theme.shadows[4],
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            mx: { xs: 2, sm: 4 },
            zIndex: 1,
          }}
        >
          <CardContent
            sx={{
              padding: { xs: '32px 24px', sm: '32px 40px' },
              '&:last-child': { pb: { xs: '32px', sm: '40px' } },
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Header Icon */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'primary.lighter',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 3,
                }}
              >
                <LockReset sx={{ color: 'primary.main', fontSize: 32 }} />
              </Box>

              <Typography
                variant='h4'
                fontWeight='700'
                textAlign='center'
                sx={{
                  fontSize: '1.5rem',
                  lineHeight: 1.2,
                  color: 'text.primary',
                  fontFamily: 'inherit',
                  mb: 1,
                }}
              >
                {t('auth.account.change_email_title')}
              </Typography>
              <Typography
                variant='body1'
                color='text.secondary'
                textAlign='center'
                sx={{ fontSize: '0.875rem', fontFamily: 'inherit', lineHeight: 1.5, mb: 4 }}
              >
                {t('auth.account.change_email_description')}
              </Typography>

              <Box
                component='form'
                onSubmit={controlForm.handleSubmit(onSubmit)}
                noValidate
                sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}
              >
                {/* New Password Field */}
                <Box>
                  <Typography
                    component='label'
                    htmlFor='password'
                    sx={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    {t('auth.account.current_email')}
                  </Typography>

                  <Controller
                    name='CurrentEmail'
                    control={controlForm.control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id='password'
                        fullWidth
                        placeholder={t('auth.account.email_placeholder')}
                        type='email'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <Mail sx={{ fontSize: 20, color: 'text.disabled' }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position='end'>
                              <Lock sx={{ fontSize: 18, color: 'text.disabled' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: 48,
                            bgcolor: 'background.paper',
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: '1px',
                            },
                          },
                          '& .MuiInputBase-input': { fontSize: '1rem' },
                          '& .MuiInputBase-input.Mui-disabled': {
                            WebkitTextFillColor: 'text.secondary',
                            cursor: 'not-allowed',
                          },
                        }}
                      />
                    )}
                  />
                </Box>

                <Box>
                  <Typography
                    component='label'
                    htmlFor='password'
                    sx={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    {t('auth.account.new_email_label')}
                  </Typography>

                  <Controller
                    name='newEmail'
                    control={controlForm.control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id='newEmail'
                        fullWidth
                        label={t('auth.account.new_email')}
                        placeholder={t('auth.account.new_email_placeholder')}
                        type='email'
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <AlternateEmail sx={{ fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: 48,
                            bgcolor: 'background.paper',
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: '1px',
                            },
                          },
                          '& .MuiInputBase-input': { fontSize: '1rem' },
                        }}
                      />
                    )}
                  />
                </Box>

                {/* Confirm Password Field */}
                <Box>
                  <Typography
                    component='label'
                    htmlFor='confirmPassword'
                    sx={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'text.primary',
                      mb: 1,
                    }}
                  >
                    {t('auth.account.confirm_password_label')}
                  </Typography>
                  <Controller
                    name='password'
                    control={controlForm.control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        id='password'
                        fullWidth
                        type={showConfirmPassword ? 'text' : 'password'}
                        label={t('auth.account.current_password')}
                        placeholder={t('auth.account.current_password_placeholder')}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position='start'>
                              <VpnKey sx={{ fontSize: 20 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={handleClickShowConfirmPassword} edge='end'>
                                {showConfirmPassword ? (
                                  <VisibilityOff sx={{ fontSize: 20 }} />
                                ) : (
                                  <Visibility sx={{ fontSize: 20 }} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            height: 48,
                            bgcolor: 'background.paper',
                            '& fieldset': { borderColor: 'divider' },
                            '&:hover fieldset': { borderColor: 'primary.main' },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                              borderWidth: '1px',
                            },
                          },
                          '& .MuiInputBase-input': { fontSize: '1rem' },
                        }}
                      />
                    )}
                  />
                </Box>

                <Alert
                  severity='info'
                  icon={<Info sx={{ fontSize: 20 }} />}
                  sx={{
                    mt: 1,
                    borderRadius: 2,
                    bgcolor: 'primary.lighter',
                    border: 1,
                    borderColor: 'primary.light',
                    '& .MuiAlert-icon': {
                      color: 'primary.main',
                    },
                  }}
                >
                  <Typography variant='subtitle2' sx={{ fontWeight: 600, mb: 0.5 }}>
                    {t('auth.account.verification_required')}
                  </Typography>
                  <Typography variant='body2' sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}>
                    {t('auth.account.verification_required_desc')}
                  </Typography>
                </Alert>

                <Button
                  type='submit'
                  variant='contained'
                  fullWidth
                  size='large'
                  // disabled={isUpdating}
                  sx={{
                    height: 52,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 700,
                  }}
                >
                  {t('auth.account.update_email')}
                </Button>

                {/* Back Link */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    variant='text'
                    fullWidth
                    onClick={() => navigate(Path.security)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      color: 'text.secondary',
                    }}
                  >
                    {t('auth.account.cancel')}
                  </Button>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Footer */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>
            © {new Date().getFullYear()} {t('auth.common.app_name')}.{' '}
            {t('auth.common.all_rights_reserved')}
          </Typography>
        </Box>
      </Container>
    </>
  )
}

export default ChangeEmail
