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
  alpha,
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
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(
                theme.palette.primary.dark,
                0.2,
              )} 50%, ${theme.palette.background.paper} 100%)`
            : `linear-gradient(135deg, #f6f7f8 0%, ${alpha(
                theme.palette.primary.light,
                0.1,
              )} 50%, #ffffff 100%)`,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.primary',
      }}
    >
      <Container maxWidth='xs'>
        <Stack spacing={3} alignItems='center'>
          <Box
            sx={{
              p: 2,
              borderRadius: '50%',
              bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
              border: '1px solid',
              borderColor: (theme) => alpha(theme.palette.secondary.main, 0.2),
              mb: 1,
            }}
          >
            <AdminPanelSettings sx={{ fontSize: 48, color: 'secondary.main' }} />
          </Box>
          <Box textAlign='center' sx={{ mb: 2 }}>
            <Typography
              variant='h4'
              component='h1'
              sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 1, color: 'text.primary' }}
            >
              {t('auth.admin.loginTitle', 'Admin Console')}
            </Typography>
            <Typography variant='body2' sx={{ color: 'text.secondary' }}>
              {t('auth.admin.loginDesc', 'Authorized personnel access only')}
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: 4,
              width: '100%',
              borderRadius: 4,
              bgcolor: 'background.paper',
              backdropFilter: 'blur(25px)',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? `0 20px 50px ${alpha(theme.palette.common.black, 0.5)}`
                  : `0 20px 50px ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
 Broadway
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
                  background: (theme) =>
                    `linear-gradient(45deg, ${theme.palette.secondary.main} 30%, ${theme.palette.secondary.light} 90%)`,
                  boxShadow: (theme) =>
                    `0 4px 14px 0 ${alpha(theme.palette.secondary.main, 0.39)}`,
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
                sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
              >
                {t('auth.admin.backToUser', 'Standard User Login?')}
              </Button>
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.4 }}>
            <Security sx={{ fontSize: 16 }} />
            <Typography variant='caption'>
              {t('auth.admin.secureSession', 'Identity encrypted session active')}
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default AdminLoginScreen
