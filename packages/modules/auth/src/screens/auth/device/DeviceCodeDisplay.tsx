import React, { useState } from 'react'
import { Box, Typography, Container, Paper, TextField, Button, Alert, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Devices } from '@mui/icons-material'

const DeviceCodeDisplay = () => {
  const { t } = useTranslation('auth')
  const [success, setSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ code: string }>()

  const onSubmit = async (data: { code: string }) => {
    // TODO: Implement actual device code verification logic here
    console.log('Verifying code:', data.code)
    await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API call
    setSuccess(true)
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      <Container maxWidth='sm'>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            textAlign: 'center',
          }}
        >
          <Stack spacing={3} alignItems='center'>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(0, 122, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
              }}
            >
              <Devices sx={{ fontSize: 32, color: '#007aff' }} />
            </Box>

            <Box>
              <Typography variant='h4' component='h1' gutterBottom sx={{ fontWeight: 700 }}>
                {t('auth.device.title', 'Connect a Device')}
              </Typography>
              <Typography variant='body1' sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {t('auth.device.desc', 'Enter the 8-character code shown on your device.')}
              </Typography>
            </Box>

            {success ? (
              <Alert
                severity='success'
                variant='filled'
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  background: 'rgba(76, 175, 80, 0.2)',
                  color: '#81c784',
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                }}
              >
                {t('auth.device.success', 'Device successfully authorized!')}
              </Alert>
            ) : (
              <Box
                component='form'
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                sx={{ width: '100%' }}
              >
                <TextField
                  fullWidth
                  placeholder='XXXX-XXXX'
                  variant='outlined'
                  autoFocus
                  {...register('code', {
                    required: t('auth.device.code_required', 'Device code is required'),
                    pattern: {
                      value: /^[A-Z0-9]{4}-[A-Z0-9]{4}$/i,
                      message: t('auth.device.invalid_format', 'Format: XXXX-XXXX'),
                    },
                  })}
                  error={!!errors.code}
                  helperText={errors.code?.message}
                  sx={{
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      color: 'white',
                      fontSize: '1.5rem',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
                      '&.Mui-focused fieldset': { borderColor: '#007aff' },
                    },
                    '& .MuiInputBase-input': {
                      textAlign: 'center',
                      letterSpacing: '0.3em',
                      textTransform: 'uppercase',
                      py: 2,
                    },
                  }}
                />
                <Button
                  type='submit'
                  fullWidth
                  variant='contained'
                  size='large'
                  disabled={isSubmitting}
                  sx={{
                    py: 1.8,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #007aff 30%, #00d2ff 90%)',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                  }}
                >
                  {isSubmitting
                    ? t('common.verifying', 'Verifying...')
                    : t('common.authorize', 'Authorize Device')}
                </Button>
              </Box>
            )}

            <Typography variant='caption' sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
              {t('auth.device.security_tip', 'Only authorize devices you physically possess.')}
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}

export default DeviceCodeDisplay
