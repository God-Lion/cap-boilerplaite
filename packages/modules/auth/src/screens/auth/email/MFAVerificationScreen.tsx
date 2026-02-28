import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Shield, Timer, LockReset } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, themeConfig, IStatus } from '@cap/platform-core'
import Path from '../path'

export default function MFAVerificationScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [code, setCode] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<number>(600) // 10 minutes

  const [status, setStatus] = useState<IStatus>({
    open: false,
    type: '',
    state: '',
    msg: '',
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleCloseStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, open: false }))
  }, [])

  const handleSubmit = useCallback(() => {
    if (code.length !== 6) return

    // Simulated verification
    setStatus({
      open: true,
      type: 'success',
      state: 'success',
      msg: t('auth.mfa.setup_verified', 'MFA method successfully verified!'),
    })

    setTimeout(() => navigate('/profile/security'), 2000)
  }, [code, navigate, t])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <>
      <title>
        {t('auth.mfa.verification_title', 'Secure Setup')} - {themeConfig.templateName}
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
          <CardContent sx={{ p: { xs: 4, sm: 6 }, textAlign: 'center' }}>
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
                mb: 4,
              }}
            >
              <Shield sx={{ color: 'primary.main', fontSize: 32 }} />
            </Box>

            <Typography variant='h4' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.025em' }}>
              {t('auth.mfa.verify_setup_heading', 'Verify MFA Setup')}
            </Typography>

            <Typography variant='body1' color='text.secondary' sx={{ mb: 4, lineHeight: 1.6 }}>
              {t(
                'auth.mfa.verify_setup_description',
                "We've sent a verification code to your email. Enter it below to complete the setup of your security method.",
              )}
            </Typography>

            <Box sx={{ mb: 4 }}>
              <TextField
                fullWidth
                variant='outlined'
                placeholder='000 000'
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                inputProps={{
                  style: {
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    letterSpacing: '8px',
                    fontWeight: 700,
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                mb: 4,
              }}
            >
              <Timer sx={{ fontSize: 18, color: 'text.secondary' }} />
              <Typography variant='caption' sx={{ fontWeight: 600, color: 'text.secondary' }}>
                {t('auth.mfa.code_expires', 'Code expires in')}{' '}
                <Box component='span' sx={{ color: 'primary.main' }}>
                  {formatTime(timeLeft)}
                </Box>
              </Typography>
            </Box>

            <Button
              fullWidth
              variant='contained'
              size='large'
              disabled={code.length !== 6}
              onClick={handleSubmit}
              sx={{
                height: 52,
                borderRadius: '12px',
                fontWeight: 700,
                textTransform: 'none',
                mb: 3,
              }}
            >
              {t('auth.mfa.verify_setup_button', 'Verify & Finish Setup')}
            </Button>

            <Button
              variant='text'
              startIcon={<LockReset />}
              sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
            >
              {t('auth.mfa.resend_code', 'Resend Code')}
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
