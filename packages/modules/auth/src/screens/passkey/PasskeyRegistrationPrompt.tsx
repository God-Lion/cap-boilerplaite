import { useState } from 'react'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Avatar,
} from '@mui/material'
import {
  Fingerprint,
  Bolt,
  VerifiedUser,
  Devices,
  CheckCircle,
  OpenInNew,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { startRegistration } from '@simplewebauthn/browser'
import authService from '../../services/auth.service'

export default function PasskeyRegistrationPrompt() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCreatePasskey = async () => {
    setLoading(true)
    setError(null)

    try {
      // Get registration options from server
      const optionsRes = await authService.passkeys.getRegistrationOptions()
      const options = optionsRes.data

      // Start WebAuthn registration
      const regResp = await startRegistration(options)

      // Verify registration with server
      await authService.passkeys.verifyRegistration(regResp)

      // Navigate to success or dashboard
      navigate('/dashboard')
    } catch (err: any) {
      console.error('Passkey registration error:', err)
      setError(err.message || 'Passkey registration cancelled or failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    navigate(-1)
  }

  const benefits = [
    {
      icon: <Bolt />,
      title: t('auth.passkey.benefit_instant_title'),
      description: t('auth.passkey.benefit_instant_desc'),
    },
    {
      icon: <VerifiedUser />,
      title: t('auth.passkey.benefit_safety_title'),
      description: t('auth.passkey.benefit_safety_desc'),
    },
    {
      icon: <Devices />,
      title: t('auth.passkey.benefit_sync_title'),
      description: t('auth.passkey.benefit_sync_desc'),
    },
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Container
        maxWidth='sm'
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: { xs: 5, sm: 10 },
        }}
      >
        <Card
          sx={{
            width: '100%',
            maxWidth: 480,
            borderRadius: 1,
            boxShadow: 4,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            {/* Card Header with Illustration */}
            <Box sx={{ textAlign: 'center', pt: 5, pb: 3, px: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  mx: 'auto',
                  mb: 3,
                }}
              >
                <Fingerprint sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant='h5' fontWeight={700} gutterBottom>
                {t('auth.passkey.registration_title')}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ maxWidth: 360, mx: 'auto' }}>
                {t('auth.passkey.registration_desc')}
              </Typography>
            </Box>

            {/* Benefits List */}
            <Box sx={{ px: 4, pb: 4 }}>
              <List disablePadding>
                {benefits.map((benefit, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 1.5,
                      py: 1.5,
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                      {benefit.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={benefit.title}
                      secondary={benefit.description}
                      primaryTypographyProps={{
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                      secondaryTypographyProps={{
                        fontSize: 14,
                      }}
                    />
                  </ListItem>
                ))}
              </List>

              {/* Compatibility Badge */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  // bgcolor: 'action.hover',
                  borderRadius: 1,
                  py: 1,
                  px: 2,
                  my: 3,
                }}
              >
                <CheckCircle color='primary' sx={{ fontSize: 16 }} />
                <Typography variant='caption' color='text.secondary' fontWeight={500}>
                  {t('auth.passkey.supported_on')}
                </Typography>
              </Box>

              {/* Error Display */}
              {error && (
                <Typography variant='body2' color='error' sx={{ mb: 2, textAlign: 'center' }}>
                  {error}
                </Typography>
              )}

              {/* Actions */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  fullWidth
                  variant='contained'
                  size='large'
                  onClick={handleCreatePasskey}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    borderRadius: 1,
                    boxShadow: 2,
                    '&:hover': {
                      boxShadow: 4,
                    },
                  }}
                >
                  {t('auth.passkey.create_button')}
                </Button>
                <Button
                  fullWidth
                  variant='text'
                  onClick={handleSkip}
                  disabled={loading}
                  sx={{
                    py: 1.25,
                    fontWeight: 500,
                    background: 'none',
                    '&:hover': {
                      background: 'none',
                    },
                  }}
                >
                  {t('auth.mfa.skip_now')}
                </Button>
              </Box>

              {/* Learn More Link */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Link
                  href='https://webauthn.guide'
                  target='_blank'
                  rel='noopener noreferrer'
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.5,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {t('auth.passkey.what_is_passkey')}
                  <OpenInNew sx={{ fontSize: 12 }} />
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}
