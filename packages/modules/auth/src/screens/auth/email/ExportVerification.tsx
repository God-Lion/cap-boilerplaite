import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  alpha,
  TextField,
  LinearProgress,
} from '@mui/material'
import { CloudDownload, VerifiedUser, LockOutlined } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'

export default function ExportVerification() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState<'request' | 'verifying' | 'ready'>('request')
  const [code, setCode] = useState('')

  const handleRequest = () => setStep('verifying')
  const handleVerify = useCallback(() => {
    if (code.length < 4) {
      return
    }
    setStep('ready')
  }, [code])

  return (
    <>
      <title>
        {t('auth.export.title', 'Export Data')} - {themeConfig.templateName}
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
        <Card
          sx={{
            width: '100%',
            maxWidth: '520px',
            borderRadius: '20px',
            boxShadow: (theme) => `0 24px 48px ${alpha(theme.palette.common.black, 0.12)}`,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            mx: 2,
            overflow: 'hidden',
          }}
        >
          {step === 'verifying' && <LinearProgress sx={{ height: 4 }} />}
          <CardContent sx={{ p: { xs: 4, sm: 6 }, textAlign: 'center' }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '20px',
                bgcolor: (theme) => alpha(theme.palette.primary.main, step === 'ready' ? 0.9 : 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
                transition: 'all 0.3s ease',
              }}
            >
              {step === 'request' && <CloudDownload sx={{ color: 'primary.main', fontSize: 36 }} />}
              {step === 'verifying' && (
                <LockOutlined sx={{ color: 'primary.main', fontSize: 36 }} />
              )}
              {step === 'ready' && <VerifiedUser sx={{ color: 'white', fontSize: 36 }} />}
            </Box>

            <Typography variant='h4' sx={{ fontWeight: 900, mb: 2, letterSpacing: '-0.03em' }}>
              {step === 'request' && t('auth.export.request_heading', 'Secure Export')}
              {step === 'verifying' && t('auth.export.verifying_heading', 'Verify Identity')}
              {step === 'ready' && t('auth.export.ready_heading', 'Export Ready')}
            </Typography>

            <Typography variant='body1' color='text.secondary' sx={{ mb: 4, lineHeight: 1.6 }}>
              {step === 'request' &&
                t(
                  'auth.export.request_desc',
                  'Your account data summary is ready for export. For your protection, we require one-time verification.',
                )}
              {step === 'verifying' &&
                t(
                  'auth.export.verifying_desc',
                  "We've sent a 6-digit verification code to your registered email address.",
                )}
              {step === 'ready' &&
                t(
                  'auth.export.ready_desc',
                  'Verification successful. Your secure download link is now active and will remain valid for 1 hour.',
                )}
            </Typography>

            {step === 'verifying' && (
              <Box sx={{ mb: 4 }}>
                <TextField
                  fullWidth
                  placeholder='000000'
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  inputProps={{
                    style: { textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' },
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {step === 'request' && (
                <Button
                  variant='contained'
                  size='large'
                  onClick={handleRequest}
                  sx={{ height: 56, borderRadius: '14px', fontWeight: 800, textTransform: 'none' }}
                >
                  {t('auth.export.send_code', 'Send Verification Code')}
                </Button>
              )}
              {step === 'verifying' && (
                <Button
                  variant='contained'
                  size='large'
                  onClick={handleVerify}
                  disabled={code.length < 6}
                  sx={{
                    height: 56,
                    borderRadius: '14px',
                    fontWeight: 800,
                    textTransform: 'none',
                  }}
                >
                  {t('auth.export.verify_button', 'Verify & Unlock')}
                </Button>
              )}
              {step === 'ready' && (
                <Button
                  variant='contained'
                  color='success'
                  size='large'
                  startIcon={<CloudDownload />}
                  sx={{ height: 60, borderRadius: '14px', fontWeight: 800, textTransform: 'none' }}
                >
                  {t('auth.export.download_now', 'Download Data (.zip)')}
                </Button>
              )}

              <Button
                variant='text'
                onClick={() => navigate(-1)}
                sx={{ textTransform: 'none', fontWeight: 600, color: 'text.secondary' }}
              >
                {t('auth.common.cancel', 'Cancel')}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}
