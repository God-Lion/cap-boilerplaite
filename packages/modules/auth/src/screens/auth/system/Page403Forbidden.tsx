import { Box, Typography, Button, Container, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LockOutlined } from '@mui/icons-material'
import Path from '../path'

const Page403Forbidden = () => {
  const navigate = useNavigate()
  const { t } = useTranslation('auth')

  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth='sm'>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: 'center',
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(244, 67, 54, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
            }}
          >
            <LockOutlined sx={{ fontSize: 48, color: '#f44336' }} />
          </Box>
          <Typography
            variant='h1'
            sx={{
              fontWeight: 800,
              fontSize: { xs: '4rem', md: '6rem' },
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1,
              mb: 1,
            }}
          >
            403
          </Typography>
          <Typography
            variant='h4'
            component='h2'
            sx={{ color: 'rgba(255, 255, 255, 0.95)', fontWeight: 600 }}
          >
            {t('auth.errors.forbidden_title', 'Access Forbidden')}
          </Typography>
          <Typography variant='body1' sx={{ color: 'rgba(255, 255, 255, 0.6)', mb: 3 }}>
            {t(
              'auth.errors.forbidden_desc',
              "You don't have permission to access this resource. Please contact your administrator if you believe this is an error.",
            )}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center' }}>
            <Button
              variant='outlined'
              onClick={() => navigate(-1)}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                color: 'white',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                '&:hover': {
                  borderColor: 'white',
                  background: 'rgba(255, 255, 255, 0.05)',
                },
              }}
            >
              {t('common.go_back', 'Go Back')}
            </Button>
            <Button
              variant='contained'
              onClick={() => navigate(Path.signin)}
              sx={{
                borderRadius: 2,
                px: 4,
                py: 1,
                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                background: 'linear-gradient(45deg, #007aff 30%, #00d2ff 90%)',
              }}
            >
              {t('auth.signin.title', 'Sign In')}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default Page403Forbidden
