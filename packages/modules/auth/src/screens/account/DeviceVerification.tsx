import React, { useState, useRef } from 'react'
import {
  Box,
  Typography,
  Container,
  Paper,
  Button,
  TextField,
  Stack,
  IconButton,
} from '@mui/material'
import { Devices, Security, Refresh, ArrowBack } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig } from '@cap/platform-core'
import { useNavigate } from 'react-router-dom'

const DeviceVerification = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1)
    }
    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  return (
    <Container maxWidth='sm' sx={{ py: 10 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant='h5' fontWeight='bold'>
          {t('auth.account.device_verification_title', 'Device Verification')}
        </Typography>
      </Box>

      <Paper variant='outlined' sx={{ p: { xs: 3, sm: 6 }, borderRadius: 4, textAlign: 'center' }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            bgcolor: 'primary.lighter',
            color: 'primary.main',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 4,
          }}
        >
          <Devices sx={{ fontSize: 40 }} />
        </Box>

        <Typography variant='h5' fontWeight='700' gutterBottom>
          {t('auth.account.connect_device', 'Connect a Device')}
        </Typography>
        <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
          {t(
            'auth.account.device_verification_desc',
            'Enter the 6-digit verification code displayed on your device screen to continue.',
          )}
        </Typography>

        <Stack direction='row' spacing={2} justifyContent='center' sx={{ mb: 6 }}>
          {code.map((digit, index) => (
            <TextField
              key={index}
              inputRef={(el) => (inputRefs.current[index] = el)}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              variant='outlined'
              inputProps={{
                maxLength: 1,
                style: {
                  textAlign: 'center',
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  padding: '12px 0',
                },
              }}
              sx={{
                width: { xs: 40, sm: 56 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.default',
                },
              }}
            />
          ))}
        </Stack>

        <Button
          variant='contained'
          fullWidth
          size='large'
          sx={{
            py: 1.5,
            borderRadius: 3,
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            mb: 3,
          }}
        >
          {t('auth.account.authorize_device', 'Authorize Device')}
        </Button>

        <Button
          variant='text'
          startIcon={<Refresh />}
          sx={{ textTransform: 'none', fontWeight: 'bold' }}
        >
          {t('auth.account.resend_code', 'Resend Code')}
        </Button>

        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Security sx={{ fontSize: 18, color: 'text.disabled', mr: 1 }} />
          <Typography variant='caption' color='text.disabled'>
            {t(
              'auth.account.authorize_notice',
              'By authorizing, you grant this device access to your account.',
            )}
          </Typography>
        </Box>
      </Paper>
    </Container>
  )
}

export default DeviceVerification
