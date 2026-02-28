import React from 'react'
import {
  Box,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Stack,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { AdminPanelSettings, Visibility, VisibilityOff, Security } from '@mui/icons-material'
import Path from '../path'
import { useNavigate } from 'react-router-dom'

const AdminLoginScreen = () => {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = React.useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => {
    // TODO: Implement admin login logic
    console.log('Admin login:', data)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    navigate('/')
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <Container maxWidth='xs'>
        <Stack spacing={3} alignItems='center'>
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              background: 'rgba(156, 39, 176, 0.15)',
              border: '1px solid rgba(156, 39, 176, 0.2)',
              mb: 1,
            }}
          >
            <AdminPanelSettings sx={{ fontSize: 48, color: '#e040fb' }} />
          </Box>
          <Box textAlign='center' sx={{ mb: 2 }}>
            <Typography
              variant='h4'
              component='h1'
              sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 1 }}
            >
              {t('auth.admin.login_title', 'Admin Console')}
            </Typography>
            <Typography variant='body2' sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {t('auth.admin.login_desc', 'Authorized personnel access only')}
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.04)',
              backdropFilter: 'blur(25px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            }}
          >
            <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField
                margin='normal'
                required
                fullWidth
                id='email'
                label={t('auth.common.email', 'Admin Email')}
                autoComplete='email'
                autoFocus
                {...register('email', { required: true })}
                error={!!errors.email}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
                }}
              />
              <TextField
                margin='normal'
                required
                fullWidth
                label={t('auth.common.password', 'Master Password')}
                type={showPassword ? 'text' : 'password'}
                id='password'
                autoComplete='current-password'
                {...register('password', { required: true })}
                error={!!errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        aria-label='toggle password visibility'
                        onClick={() => setShowPassword(!showPassword)}
                        edge='end'
                        sx={{ color: 'rgba(255, 255, 255, 0.3)' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.5)' },
                }}
              />
              <Button
                type='submit'
                fullWidth
                variant='contained'
                disabled={isSubmitting}
                sx={{
                  py: 1.8,
                  mb: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #9c27b0 30%, #e040fb 90%)',
                  boxShadow: '0 4px 14px 0 rgba(156, 39, 176, 0.39)',
                  fontWeight: 600,
                }}
              >
                {t('auth.admin.signin', 'Elevate Access')}
              </Button>
              <Button
                fullWidth
                variant='text'
                size='small'
                onClick={() => navigate(Path.signin)}
                sx={{ color: 'rgba(255, 255, 255, 0.4)', '&:hover': { color: 'white' } }}
              >
                {t('auth.admin.back_to_user', 'Standard User Login?')}
              </Button>
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.4 }}>
            <Security sx={{ fontSize: 16 }} />
            <Typography variant='caption'>
              {t('auth.admin.secure_session', 'Identity encrypted session active')}
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default AdminLoginScreen
