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
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Path from '../path'

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
                theme.palette.info.dark,
                0.15,
              )} 50%, ${theme.palette.background.paper} 100%)`
            : `linear-gradient(135deg, #f6f7f8 0%, ${alpha(
                theme.palette.info.light,
                0.1,
              )} 50%, #ffffff 100%)`,
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.primary',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <Container maxWidth='xs'>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Stack spacing={3} alignItems='center'>
            <Box
              sx={{
                p: 2,
                borderRadius: '16px',
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                border: '1px solid',
                borderColor: (theme) => alpha(theme.palette.info.main, 0.2),
                mb: 1,
                transform: 'rotate(-5deg)',
              }}
            >
              <AdminPanelSettings sx={{ fontSize: 48, color: 'info.main' }} />
            </Box>
            <Box textAlign='center' sx={{ mb: 2 }}>
              <Typography
                variant='h4'
                component='h1'
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.025em',
                  mb: 1,
                  color: 'text.primary',
                  fontFamily: 'inherit',
                }}
              >
                {t('auth.admin.loginTitle', 'Admin Console')}
              </Typography>
              <Typography
                variant='body2'
                sx={{ color: 'text.secondary', opacity: 0.8, fontFamily: 'inherit' }}
              >
                {t('auth.admin.loginDesc', 'Authorized personnel access only')}
              </Typography>
            </Box>

            <Paper
              elevation={0}
              sx={{
                p: 4,
                width: '100%',
                borderRadius: '20px',
                bgcolor: 'background.paper',
                backdropFilter: 'blur(25px)',
                border: '1px solid',
                borderColor: 'divider',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: (theme) =>
                  `0 25px 50px -12px ${alpha(theme.palette.common.black, 0.25)}`,
              }}
            >
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

              <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label={t('auth.common.email', 'Email Address')}
                  autoComplete="email"
                  autoFocus
                  {...register('email', { required: true })}
                  error={!!errors.email}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'info.main' },
                      '&.Mui-focused fieldset': { borderColor: 'info.main' },
                    },
                    '& .MuiInputLabel-root': { fontFamily: 'inherit' },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label={t('auth.common.password', 'Master Password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  {...register('password', { required: true })}
                  error={!!errors.password}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: 'text.secondary', opacity: 0.5 }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '& fieldset': { borderColor: 'divider' },
                      '&:hover fieldset': { borderColor: 'info.main' },
                      '&.Mui-focused fieldset': { borderColor: 'info.main' },
                    },
                    '& .MuiInputLabel-root': { fontFamily: 'inherit' },
                  }}
                />
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  color='info'
                  disabled={isSubmitting}
                  sx={{
                    py: 1.8,
                    mb: 2,
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 700,
                    boxShadow: (theme) =>
                      `0 4px 14px 0 ${alpha(theme.palette.info.main, 0.35)}`,
                    fontFamily: 'inherit',
                    '&:hover': {
                      bgcolor: 'info.dark',
                      boxShadow: (theme) =>
                        `0 6px 20px 0 ${alpha(theme.palette.info.main, 0.45)}`,
                    },
                  }}
                >
                  {t('auth.admin.signin', 'Elevate Access')}
                </Button>
                <Button
                  fullWidth
                  variant='text'
                  size='small'
                  color='secondary'
                  onClick={() => navigate(Path.signin)}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    color: 'text.secondary',
                    fontFamily: 'inherit',
                    '&:hover': { color: 'info.main', bgcolor: 'transparent' },
                  }}
                >
                  {t('auth.admin.backToUser', 'Standard User Login?')}
                </Button>
              </Box>
            </Paper>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.6 }}>
              <Security sx={{ fontSize: 16, color: 'info.main' }} />
              <Typography variant='caption' sx={{ fontFamily: 'inherit', fontWeight: 500 }}>
                {t('auth.admin.secureSession', 'Identity encrypted session active')}
              </Typography>
            </Box>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  )
}

export default AdminLoginScreen
