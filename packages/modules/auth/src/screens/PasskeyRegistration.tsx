import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material'
import { Fingerprint, Security, CheckCircle } from '@mui/icons-material'
import { startRegistration } from '@simplewebauthn/browser'

import { useNavigate } from 'react-router-dom'
import { usePasskeyRegistration } from '../hooks/useAuthQuery'
import { authService } from '../services/auth.service'

export default function PasskeyRegistration() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const registrationMutation = usePasskeyRegistration({
    onSuccess: () => {
      setSuccess(true)
      setLoading(false)
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Registration failed')
      setLoading(false)
    },
  })

  const handleRegister = async () => {
    setLoading(true)
    setError(null)
    try {
      const optionsRes = await authService.getPasskeyRegistrationOptions()
      const options = optionsRes.data

      const regResp = await startRegistration(options)
      registrationMutation.mutate(regResp)
    } catch (err: any) {
      setError(err.message || 'Passkey registration cancelled or failed')
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Container maxWidth='sm' sx={{ mt: 10 }}>
        <Card sx={{ borderRadius: 4, textAlign: 'center', p: 5 }}>
          <CheckCircle color='success' sx={{ fontSize: 80, mb: 3 }} />
          <Typography variant='h4' fontWeight='600' gutterBottom>
            Passkey Ready
          </Typography>
          <Typography color='text.secondary' mb={4}>
            You can now use your device to sign in securely.
          </Typography>
          <Button variant='contained' fullWidth size='large' onClick={() => navigate('/')}>
            Go to Dashboard
          </Button>
        </Card>
      </Container>
    )
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 10 }}>
      <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
        {loading && <LinearProgress />}
        <CardContent sx={{ p: 5, textAlign: 'center' }}>
          <Security color='primary' sx={{ fontSize: 60, mb: 3 }} />
          <Typography variant='h5' fontWeight='600' gutterBottom>
            Add a Passkey
          </Typography>
          <Typography color='text.secondary' mb={4}>
            Passkeys are a safer and easier way to sign in. You can use your fingerprint, face, or
            screen lock.
          </Typography>

          {error && (
            <Typography color='error' variant='body2' mb={3}>
              {error}
            </Typography>
          )}

          <Button
            variant='contained'
            fullWidth
            size='large'
            startIcon={<Fingerprint />}
            onClick={handleRegister}
            disabled={loading}
            sx={{ py: 1.5, borderRadius: 2 }}
          >
            Create Passkey
          </Button>
          <Button variant='text' fullWidth onClick={() => navigate('/')} sx={{ mt: 2 }}>
            Maybe later
          </Button>
        </CardContent>
      </Card>
    </Container>
  )
}
