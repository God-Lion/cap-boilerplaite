import { Box, Typography, Container, Paper, TextField, Button, Divider, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { Business, Router } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import Path from '../path'

const SAMLSSOInitiation = () => {
  const { t } = useTranslation('auth')
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => {
    // TODO: Implement SSO initiation
    console.log('SSO Init:', data)
    // Simulate redirection
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
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
          <Stack spacing={4} alignItems='center'>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 100,
                height: 100,
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'rgba(0, 122, 255, 0.2)',
                  animation: 'pulse 2s infinite ease-in-out',
                  '@keyframes pulse': {
                    '0%': { transform: 'scale(0.8)', opacity: 0.5 },
                    '50%': { transform: 'scale(1.2)', opacity: 0 },
                    '100%': { transform: 'scale(0.8)', opacity: 0.5 },
                  },
                }}
              />
              <Box
                sx={{
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  zIndex: 1,
                }}
              >
                <Business fontSize='large' />
              </Box>
            </Box>

            <Box>
              <Typography variant='h4' component='h1' gutterBottom sx={{ fontWeight: 700 }}>
                {t('auth.sso.title', 'Enterprise Login')}
              </Typography>
              <Typography variant='body1' sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                {t('auth.sso.desc', 'Enter your organizational domain to continue.')}
              </Typography>
            </Box>

            <Box
              component='form'
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              sx={{ width: '100%' }}
            >
              <TextField
                fullWidth
                label={t('auth.sso.domain_label', 'Organization Identifier')}
                placeholder='e.g. acme-corp'
                variant='outlined'
                {...register('sso_identifier', { required: true })}
                error={!!errors.sso_identifier}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.05)',
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
                size='large'
                disabled={isSubmitting}
                sx={{
                  py: 1.8,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #007aff 30%, #00d2ff 90%)',
                  boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                  fontWeight: 600,
                }}
              >
                {isSubmitting
                  ? t('common.redirecting', 'Redirection...')
                  : t('common.continue', 'Continue to SSO')}
              </Button>
            </Box>

            <Divider sx={{ width: '100%', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
              <Typography variant='caption' sx={{ color: 'rgba(255, 255, 255, 0.3)' }}>
                {t('common.or', 'OR')}
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant='text'
              onClick={() => navigate(Path.signin)}
              sx={{ color: 'rgba(255, 255, 255, 0.5)', '&:hover': { color: 'white' } }}
            >
              {t('auth.signin.back_to_login', 'Standard Login')}
            </Button>
          </Stack>
        </Paper>

        <Stack direction='row' spacing={1} justifyContent='center' sx={{ mt: 4, opacity: 0.5 }}>
          <Router sx={{ fontSize: 16 }} />
          <Typography variant='caption'>
            {t('auth.sso.secure_path', 'Direct link to identity provider active')}
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}

export default SAMLSSOInitiation
