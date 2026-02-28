import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Link as MuiLink,
  CircularProgress,
  alpha,
} from '@mui/material'
import { Key, ArrowForward, PhonelinkLock, Lock } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

export default function MFABackupCodeEntry() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [backupCode, setBackupCode] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = useCallback(() => {
    if (backupCode.length < 8) return
    setIsVerifying(true)
    setError(null)
    // TODO: integrate with actual backup code verification API
    setTimeout(() => {
      setIsVerifying(false)
    }, 1500)
  }, [backupCode])

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)
    setBackupCode(value)
    setError(null)
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: (theme) => alpha(theme.palette.primary.main, 0.05),
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-20%',
          left: '-10%',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: (theme) => alpha(theme.palette.primary.main, 0.05),
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Header */}
      <Box
        sx={{
          bgcolor: (theme) => alpha(theme.palette.background.paper, 0.8),
          backdropFilter: 'blur(12px)',
          borderBottom: 1,
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <Container
          maxWidth='lg'
          sx={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Lock sx={{ fontSize: 20, color: 'primary.main' }} />
            </Box>
            <Typography variant='subtitle1' fontWeight={700} letterSpacing='-0.015em'>
              SecureApp
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 2, sm: 3 },
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 460,
            bgcolor: 'background.paper',
            borderRadius: 4,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
            border: 1,
            borderColor: 'divider',
            overflow: 'hidden',
          }}
        >
          {/* Progress Bar */}
          <Box sx={{ height: 4, width: '100%', bgcolor: 'action.hover' }}>
            <Box
              sx={{
                height: '100%',
                width: '50%',
                bgcolor: 'primary.main',
                borderRadius: '0 9999px 9999px 0',
              }}
            />
          </Box>

          <Box
            sx={{
              px: { xs: 4, sm: 5 },
              py: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                mb: 3,
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
              }}
            >
              <Key sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>

            {/* Title & Description */}
            <Typography variant='h5' fontWeight={700} letterSpacing='-0.02em' sx={{ mb: 1 }}>
              {t('auth.mfa.backup_code_entry_title', 'Enter Backup Code')}
            </Typography>
            <Typography variant='body1' color='text.secondary' sx={{ mb: 4, lineHeight: 1.6 }}>
              {t(
                'auth.mfa.backup_code_entry_description',
                'Please enter one of your 8-character recovery codes to verify your identity.',
              )}
            </Typography>

            {/* Backup Code Input */}
            <TextField
              fullWidth
              value={backupCode}
              onChange={handleCodeChange}
              placeholder='XXXX-XXXX'
              error={!!error}
              helperText={error}
              autoFocus
              inputProps={{
                maxLength: 8,
                style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  fontFamily: 'monospace',
                },
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'action.hover',
                  '&.Mui-focused': {
                    bgcolor: 'background.paper',
                  },
                },
              }}
            />

            {/* Verify Button */}
            <Button
              fullWidth
              variant='contained'
              size='large'
              onClick={handleVerify}
              disabled={backupCode.length < 8 || isVerifying}
              endIcon={
                isVerifying ? <CircularProgress size={18} color='inherit' /> : <ArrowForward />
              }
              sx={{
                mb: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                boxShadow:
                  backupCode.length >= 8
                    ? (theme) => `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`
                    : 'none',
              }}
            >
              {isVerifying
                ? t('auth.mfa.verifying', 'Verifying...')
                : t('auth.mfa.verify_sign_in', 'Verify & Sign In')}
            </Button>

            {/* Alternate Actions */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width: '100%' }}>
              <MuiLink
                component='button'
                variant='body2'
                onClick={() => navigate(-1)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  color: 'primary.main',
                  fontWeight: 500,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                <PhonelinkLock sx={{ fontSize: 16 }} />
                {t('auth.mfa.use_authenticator_instead', 'Use authenticator app instead')}
              </MuiLink>
              <MuiLink
                component='button'
                variant='body2'
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline', color: 'text.primary' },
                }}
              >
                {t('auth.mfa.lost_backup_codes', 'I lost my backup codes')}
              </MuiLink>
            </Box>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              px: 4,
              py: 2,
              borderTop: 1,
              borderColor: 'divider',
              textAlign: 'center',
              bgcolor: 'action.hover',
            }}
          >
            <Typography
              variant='caption'
              color='text.secondary'
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}
            >
              <Lock sx={{ fontSize: 12 }} />
              {t('auth.mfa.secure_connection', 'Secure Connection • 256-bit Encryption')}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
