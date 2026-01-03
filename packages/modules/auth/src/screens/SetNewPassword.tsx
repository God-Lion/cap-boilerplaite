import React, { useState } from 'react'
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
  Card,
  CardContent,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig, AdaptiveLogo } from '@cap/platform-core'
import { Controller, useForm } from 'react-hook-form'

interface SetNewPasswordFormData {
  password: ''
  confirmPassword: ''
}

const SetNewPassword = () => {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword(!showPassword)
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword)

  const controlForm = useForm<SetNewPasswordFormData>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: SetNewPasswordFormData) => {
    console.log('Form Submitted', data)
  }

  return (
    <React.Fragment>
      <title>
        {t('auth.set_new_password.title_page')} - {themeConfig.templateName}
      </title>

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

            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography component='h1' variant='h4' sx={{ fontWeight: 'bold', mb: 1 }}>
                {t('auth.set_new_password.title')}
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                {t('auth.set_new_password.desc')}
              </Typography>
            </Box>
            <Box
              component='form'
              onSubmit={controlForm.handleSubmit(onSubmit)}
              noValidate
              autoComplete='off'
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
              }}
            >
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name='password'
                    control={controlForm.control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={t('auth.set_new_password.password_label')}
                        variant='outlined'
                        fullWidth
                        autoComplete='new-password'
                        type={showPassword ? 'text' : 'password'}
                        value={value}
                        onChange={onChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={handleClickShowPassword} edge='end'>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
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
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        label={t('auth.set_new_password.confirm_password_label')}
                        variant='outlined'
                        fullWidth
                        autoComplete='new-password'
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={value}
                        onChange={onChange}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton onClick={handleClickShowConfirmPassword} edge='end'>
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Box sx={{ my: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <LinearProgress
                    variant='determinate'
                    value={100}
                    sx={{
                      flexGrow: 1,
                      height: 8,
                      borderRadius: 4,
                      mr: 2,
                      backgroundColor: 'divider',
                    }}
                    color='success'
                  />
                  <Typography variant='body2' color='success.main' sx={{ fontWeight: '600' }}>
                    {t('auth.set_new_password.strength_strong')}
                  </Typography>
                </Box>
                <Grid container spacing={1}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked disabled size='small' color='success' />}
                      label={
                        <Typography variant='body2' color='text.secondary'>
                          {t('auth.set_new_password.char_limit')}
                        </Typography>
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked disabled size='small' color='success' />}
                      label={
                        <Typography variant='body2' color='text.secondary'>
                          {t('auth.set_new_password.uppercase')}
                        </Typography>
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked disabled size='small' color='success' />}
                      label={
                        <Typography variant='body2' color='text.secondary'>
                          {t('auth.set_new_password.number')}
                        </Typography>
                      }
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControlLabel
                      control={<Checkbox defaultChecked disabled size='small' color='success' />}
                      label={
                        <Typography variant='body2' color='text.secondary'>
                          {t('auth.set_new_password.special_char')}
                        </Typography>
                      }
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button
                type='submit'
                fullWidth
                variant='contained'
                size='large'
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}
              >
                {t('auth.set_new_password.button_update')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </React.Fragment>
  )
}

export default SetNewPassword
