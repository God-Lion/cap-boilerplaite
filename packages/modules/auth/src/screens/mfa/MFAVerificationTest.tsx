import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  Link as MuiLink,
  Snackbar,
} from '@mui/material'
import { LockOpen, Lock as LockIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { Alert as MAlert, themeConfig, IStatus } from '@cap/platform-core'

export default function MFAVerificationTest() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [code, setCode] = useState<string[]>(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [status, setStatus] = useState<IStatus>({
    open: false,
    type: '',
    state: '',
    msg: '',
  })

  const handleCloseStatus = useCallback(() => {
    setStatus((prev) => ({ ...prev, open: false }))
  }, [])

  useEffect(() => {
    // Auto-focus first input on mount
    inputRefs.current[0]?.focus()
  }, [])

  const handleVerify = useCallback(
    (codeString: string) => {
      // Simulate verification - replace with actual API call
      if (codeString === '123456') {
        setStatus({
          open: true,
          type: 'success',
          state: 'success',
          msg: t('auth.mfa.verification_successful'),
        })
        setTimeout(() => {
          navigate('/mfa/backup-codes')
        }, 1500)
      } else {
        setStatus({
          open: true,
          type: 'error',
          state: 'error',
          msg: t('auth.mfa.invalid_code'),
        })
        // Reset code inputs
        setCode(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    },
    [navigate, t],
  )

  const handleChange = useCallback(
    (index: number, value: string) => {
      // Only allow numeric input
      if (value && !/^\d$/.test(value)) return

      const newCode = [...code]
      newCode[index] = value

      setCode(newCode)

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus()
      }

      // Auto-submit when all fields are filled
      if (newCode.every((digit) => digit !== '') && index === 5) {
        handleVerify(newCode.join(''))
      }
    },
    [code, handleVerify],
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        if (!code[index] && index > 0) {
          // Move to previous input if current is empty
          inputRefs.current[index - 1]?.focus()
        } else {
          // Clear current input
          const newCode = [...code]
          newCode[index] = ''
          setCode(newCode)
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus()
      } else if (e.key === 'ArrowRight' && index < 5) {
        inputRefs.current[index + 1]?.focus()
      } else if (e.key === 'Enter') {
        if (code.every((digit) => digit !== '')) {
          handleVerify(code.join(''))
        }
      }
    },
    [code, handleVerify],
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)

      if (pastedData.length === 6) {
        const newCode = pastedData.split('')
        setCode(newCode)
        inputRefs.current[5]?.focus()

        // Auto-submit on paste
        setTimeout(() => {
          handleVerify(pastedData)
        }, 100)
      }
    },
    [handleVerify],
  )

  return (
    <>
      <title>
        {t('auth.mfa.verification_test')} - {themeConfig.templateName}
      </title>

      <Container
        component='main'
        maxWidth={false}
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
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

        <Box
          component='main'
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: { xs: 2, sm: 3 },
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '480px',
              // borderRadius: '12px',
              // boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              // border: '1px solid #e2e8f0',
              p: { xs: 4, sm: 5 },
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Icon Hero */}
            <Box
              sx={{
                mb: 3,
                borderRadius: '50%',
                bgcolor: 'rgba(19, 127, 236, 0.1)',
                p: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LockOpen
                sx={{
                  color: '#137fec',
                  fontSize: 40,
                }}
              />
            </Box>

            {/* Headline */}
            <Typography
              variant='h5'
              sx={{
                fontSize: '1.625rem',
                fontWeight: 700,
                color: 'text.primary',
                textAlign: 'center',
                mb: 1,
                fontFamily: 'inherit',
              }}
            >
              {t('auth.mfa.title')}
            </Typography>

            {/* Body Text */}
            <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
              {t('auth.mfa.test_desc', { appName: t('auth.common.appName') })}
            </Typography>

            {/* Code Input Fields */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: { xs: 1, sm: 1.5 },
                mb: 4,
                width: '100%',
              }}
            >
              {code.map((digit, index) => (
                <TextField
                  key={index}
                  inputRef={(el) => {
                    inputRefs.current[index] = el
                  }}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) =>
                    handleKeyDown(index, e as React.KeyboardEvent<HTMLInputElement>)
                  }
                  onPaste={index === 0 ? handlePaste : undefined}
                  inputProps={{
                    maxLength: 1,
                    inputMode: 'numeric',
                    pattern: '[0-9]',
                    style: {
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 500,
                      padding: 0,
                    },
                    'aria-label': `Digit ${index + 1}`,
                  }}
                  sx={{
                    width: { xs: 40, sm: 48 },
                    '& .MuiOutlinedInput-root': {
                      height: { xs: 48, sm: 56 },
                      borderRadius: '8px',
                      // bgcolor: '#f6f7f8',
                      '& fieldset': {
                        borderColor: '#cbd5e1',
                      },
                      '&:hover fieldset': {
                        borderColor: '#94a3b8',
                      },
                      '&.Mui-focused fieldset': {
                        // borderColor: '#137fec',
                        borderWidth: '1px',
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 4px rgba(19, 127, 236, 0.1)',
                      },
                    },
                    '& input::placeholder': {
                      color: '#cbd5e1',
                    },
                  }}
                  placeholder='-'
                />
              ))}
            </Box>

            {/* Verify Button */}
            <Button
              fullWidth
              variant='contained'
              onClick={() => handleVerify(code.join(''))}
              disabled={code.some((digit) => digit === '')}
              sx={{
                height: 48,
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                bgcolor: '#137fec',
                color: 'text.primary',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                mb: 2,
                fontFamily: 'inherit',
                '&:hover': {
                  bgcolor: '#0f6bcc',
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                  bgcolor: '#137fec',
                  color: '#ffffff',
                },
              }}
            >
              {t('auth.mfa.button_verify')}
            </Button>

            {/* Secondary Action */}
            <MuiLink
              href='#'
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                navigate('/mfa/backup-code')
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: '#64748b',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                fontFamily: 'inherit',
                '&:hover': {
                  color: '#137fec',
                },
              }}
            >
              {t('auth.mfa.try_another_method')}
            </MuiLink>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              mt: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: '#94a3b8',
              fontSize: '0.75rem',
            }}
          >
            <LockIcon sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: '0.75rem', fontFamily: 'inherit' }}>
              {t('auth.mfa.secured_by', {
                appName: t('auth.common.appName'),
              })}
            </Typography>
          </Box>
        </Box>
      </Container>
    </>
  )
}
