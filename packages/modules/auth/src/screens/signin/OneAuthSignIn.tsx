import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Fade,
  LinearProgress,
} from '@mui/material'
import {
  EmailOutlined,
  ArrowForward,
  Fingerprint,
  ChevronLeft,
  Visibility,
  VisibilityOff,
  Lock,
} from '@mui/icons-material'
import { AdaptiveLogo } from '@cap/platform-core'
import { startAuthentication } from '@simplewebauthn/browser'
import { useLogin, usePasskeyLogin, useMfaLoginVerify } from '../../hooks/useAuthQuery'
import { authService } from '../../services/auth.service'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@cap/platform-core'

type LoginStep = 'EMAIL' | 'PASSWORD_OR_PASSKEY' | 'MFA'

export default function OneAuthSignIn() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [step, setStep] = useState<LoginStep>('EMAIL')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mfaCode, setMfaCode] = useState('')
  const [mfaUserId, setMfaUserId] = useState<number | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginMutation = useLogin({
    onSuccess: (response) => {
      if (response.data.mfa_required) {
        setMfaUserId(response.data.userId!)
        setStep('MFA')
        setLoading(false)
        return
      }
      setUser(response.data as any)
      navigate('/')
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Login failed')
      setLoading(false)
    },
  })

  const passkeyLoginMutation = usePasskeyLogin({
    onSuccess: (response) => {
      if (response.data.mfa_required) {
        setMfaUserId(response.data.userId!)
        setStep('MFA')
        setLoading(false)
        return
      }
      setUser(response.data as any)
      navigate('/')
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Passkey authentication failed')
      setLoading(false)
    },
  })

  const mfaVerifyMutation = useMfaLoginVerify({
    onSuccess: (response) => {
      setUser(response.data.user as any)
      navigate('/')
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'MFA verification failed')
      setLoading(false)
    },
  })

  const handleNext = async () => {
    if (step === 'EMAIL') {
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address')
        return
      }
      setError(null)
      setStep('PASSWORD_OR_PASSKEY')
    }
  }

  const handlePasswordLogin = () => {
    setLoading(true)
    loginMutation.mutate({ data: { email, password } } as any)
  }

  const handleMfaVerify = () => {
    if (!mfaUserId) return
    setLoading(true)
    mfaVerifyMutation.mutate({ userId: mfaUserId, code: mfaCode })
  }

  const handlePasskeyLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      const optionsRes = await authService.getPasskeyLoginOptions(email)
      const options = optionsRes.data

      const authResp = await startAuthentication(options)
      passkeyLoginMutation.mutate(authResp)
    } catch (err: any) {
      setError(err.message || 'Passkey login failed')
      setLoading(false)
    }
  }

  return (
    <Container
      maxWidth='sm'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 450, borderRadius: 4, boxShadow: 3 }}>
        {loading && <LinearProgress />}
        <CardContent sx={{ p: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <AdaptiveLogo />
          </Box>

          <Box sx={{ minHeight: 300 }}>
            {step === 'EMAIL' && (
              <Fade in={step === 'EMAIL'}>
                <Box>
                  <Typography variant='h5' fontWeight='600' textAlign='center' gutterBottom>
                    Sign in
                  </Typography>
                  <Typography variant='body2' color='text.secondary' textAlign='center' mb={4}>
                    Use your OneAuth Account
                  </Typography>

                  <TextField
                    fullWidth
                    label='Email or phone'
                    variant='outlined'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!error}
                    helperText={error}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <EmailOutlined />
                        </InputAdornment>
                      ),
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                    sx={{ mb: 4 }}
                  />

                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <Button variant='text' onClick={() => navigate('/auth/sign-up')}>
                      Create account
                    </Button>
                    <Button
                      variant='contained'
                      size='large'
                      onClick={handleNext}
                      endIcon={<ArrowForward />}
                    >
                      Next
                    </Button>
                  </Box>
                </Box>
              </Fade>
            )}

            {step === 'PASSWORD_OR_PASSKEY' && (
              <Fade in={step === 'PASSWORD_OR_PASSKEY'}>
                <Box>
                  <IconButton
                    onClick={() => {
                      setStep('EMAIL')
                      setError(null)
                    }}
                    sx={{ mb: 2, ml: -1 }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <Typography variant='h5' fontWeight='600' textAlign='center' gutterBottom>
                    Welcome
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      mb: 4,
                      p: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 10,
                    }}
                  >
                    <Typography variant='body2'>{email}</Typography>
                  </Box>

                  <TextField
                    fullWidth
                    type={showPassword ? 'text' : 'password'}
                    label='Enter your password'
                    variant='outlined'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position='end'>
                          <IconButton onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  {error && (
                    <Typography color='error' variant='caption' sx={{ display: 'block', mb: 2 }}>
                      {error}
                    </Typography>
                  )}

                  <Box sx={{ mb: 2, textAlign: 'left' }}>
                    <Button
                      variant='text'
                      size='small'
                      onClick={() => navigate('/auth/forgot-password')}
                      sx={{ textTransform: 'none', p: 0 }}
                    >
                      Forgot password?
                    </Button>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button
                      fullWidth
                      variant='contained'
                      size='large'
                      onClick={handlePasswordLogin}
                      disabled={loading || !password}
                    >
                      Sign in
                    </Button>

                    <Divider>or</Divider>

                    <Button
                      fullWidth
                      variant='outlined'
                      size='large'
                      startIcon={<Fingerprint />}
                      onClick={handlePasskeyLogin}
                      disabled={loading}
                    >
                      Sign in with Passkey
                    </Button>
                  </Box>
                </Box>
              </Fade>
            )}

            {step === 'MFA' && (
              <Fade in={step === 'MFA'}>
                <Box>
                  <IconButton
                    onClick={() => {
                      setStep('PASSWORD_OR_PASSKEY')
                      setError(null)
                    }}
                    sx={{ mb: 2, ml: -1 }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <Typography variant='h5' fontWeight='600' textAlign='center' gutterBottom>
                    2-Step Verification
                  </Typography>
                  <Typography variant='body2' color='text.secondary' textAlign='center' mb={4}>
                    Enter the code from your authenticator app
                  </Typography>

                  <TextField
                    fullWidth
                    label='Verification code'
                    variant='outlined'
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleMfaVerify()}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <Lock />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 4 }}
                  />

                  {error && (
                    <Typography color='error' variant='caption' sx={{ display: 'block', mb: 2 }}>
                      {error}
                    </Typography>
                  )}

                  <Button
                    fullWidth
                    variant='contained'
                    size='large'
                    onClick={handleMfaVerify}
                    disabled={loading || mfaCode.length < 6}
                  >
                    Verify
                  </Button>
                </Box>
              </Fade>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  )
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', my: 1 }}>
      <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'divider' }} />
      <Typography variant='caption' sx={{ px: 2, color: 'text.secondary' }}>
        {children}
      </Typography>
      <Box sx={{ flexGrow: 1, height: '1px', bgcolor: 'divider' }} />
    </Box>
  )
}
