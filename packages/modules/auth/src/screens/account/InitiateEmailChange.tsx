import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  TextField,
  Alert,
  AlertTitle,
  Container,
  IconButton,
  Stack,
} from '@mui/material'
import {
  Mail,
  Security,
  Warning,
  ArrowForward,
  Lock,
  CalendarToday,
  ArrowBack,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Path from './path'

const InitiateEmailChange = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const userStatus = {
    email: 'user@example.com',
    memberSince: 'Nov 2021',
  }

  return (
    <Container maxWidth='md' sx={{ py: 6 }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant='h4' fontWeight='bold'>
          {t('auth.account.initiate_email_change_title', 'Initiate Email Change')}
        </Typography>
      </Box>

      <Typography variant='body1' color='text.secondary' sx={{ mb: 4 }}>
        {t(
          'auth.account.initiate_email_change_desc',
          'Update your primary contact email for login and notifications. This action requires immediate re-verification.',
        )}
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={3}>
            <Card variant='outlined' sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant='subtitle1' fontWeight='bold' sx={{ mb: 3 }}>
                  {t('auth.account.current_account_status', 'Current Account Status')}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.lighter', mr: 2 }}>
                    <Mail sx={{ color: 'primary.main' }} />
                  </Avatar>
                  <Box>
                    <Typography variant='subtitle2' fontWeight='bold'>
                      {userStatus.email}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <CalendarToday sx={{ fontSize: 14, mr: 0.5 }} />
                      <Typography variant='caption'>
                        Member since {userStatus.memberSince}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card variant='outlined' sx={{ borderRadius: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant='subtitle1'
                  fontWeight='bold'
                  sx={{ mb: 3, display: 'flex', alignItems: 'center' }}
                >
                  <Security sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                  {t('auth.account.security_verification', 'Security Verification')}
                </Typography>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                  To proceed, please enter your current password to confirm your identity.
                </Typography>
                <TextField
                  fullWidth
                  type='password'
                  label={t('auth.account.current_password', 'Current Password')}
                  placeholder={t(
                    'auth.account.current_password_placeholder',
                    'Enter your password',
                  )}
                  InputProps={{
                    startAdornment: <Lock sx={{ color: 'text.disabled', mr: 1, fontSize: 20 }} />,
                  }}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant='text'
                  size='small'
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                  {t('auth.account.trouble_mfa', 'Trouble with MFA?')}
                </Button>
              </CardContent>
            </Card>

            <Button
              variant='contained'
              fullWidth
              size='large'
              endIcon={<ArrowForward />}
              onClick={() => navigate(Path.requestEmailChange)}
              sx={{
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              {t('auth.account.continue', 'Continue')}
            </Button>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={3}>
            <Alert
              severity='warning'
              icon={<Warning fontSize='inherit' />}
              sx={{
                borderRadius: 3,
                bgcolor: 'warning.lighter',
                border: '1px solid',
                borderColor: 'warning.light',
              }}
            >
              <AlertTitle sx={{ fontWeight: 'bold' }}>
                {t('auth.account.session_termination_warning', 'Session Termination Warning')}
              </AlertTitle>
              <Typography variant='body2'>
                {t(
                  'auth.account.session_termination_desc',
                  'Changing your email address will sign you out of all devices, including this one. You will need to verify your new email address before logging back in.',
                )}
              </Typography>
            </Alert>

            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant='caption' color='text.disabled'>
                Protected by reCAPTCHA and subject to the Google{' '}
                <Box component='span' sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                  Privacy Policy
                </Box>{' '}
                and{' '}
                <Box component='span' sx={{ textDecoration: 'underline', cursor: 'pointer' }}>
                  Terms of Service
                </Box>{' '}
                apply.
              </Typography>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}

export default InitiateEmailChange
