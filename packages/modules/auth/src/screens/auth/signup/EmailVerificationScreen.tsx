import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  alpha,
  Link as MuiLink,
} from '@mui/material'
import { Verified, ErrorOutline, ArrowForward, Help } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { themeConfig, FetchResponse } from '@cap/platform-core'
import authService from '../../../services/auth.service'
import Path from '../path'

export default function EmailVerificationScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { email } = useParams()
  const [searchParams] = useSearchParams()
  const signature = searchParams.get('signature')

  const [verifying, setVerifying] = useState(true)
  const [success, setSuccess] = useState<boolean | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    async function verifyEmail() {
      if (!email || !signature) {
        setVerifying(false)
        setSuccess(false)
        setErrorMsg(t('auth.email.missing_params', 'Invalid verification link.'))
        return
      }

      try {
        setVerifying(true)
        const response: FetchResponse<any> = await authService.verifyEmail(email, signature)

        if (response.status === 200 || response.status === 202) {
          setSuccess(true)
        } else {
          setSuccess(false)
          setErrorMsg(
            t(
              'auth.email.verification_failed',
              'Verification failed. The link may be invalid or expired.',
            ),
          )
        }
      } catch (error: any) {
        setSuccess(false)
        setErrorMsg(
          error.response?.data?.detail ||
            t('auth.email.error_occurred', 'An error occurred during verification.'),
        )

        // If it's a 403 or 410, it might be expired
        if (error.response?.status === 403 || error.response?.status === 410) {
          navigate(`${Path.verificationLinkExpired}?email=${encodeURIComponent(email)}`)
        }
      } finally {
        setVerifying(false)
      }
    }

    verifyEmail()
  }, [email, signature, t, navigate])

  if (verifying) {
    return (
      <Container
        component='main'
        maxWidth={false}
        disableGutters
        sx={{
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress size={48} sx={{ mb: 3 }} />
        <Typography variant='h6' sx={{ fontWeight: 600, color: 'text.secondary' }}>
          {t('auth.email.verifying_title', 'Verifying your email...')}
        </Typography>
      </Container>
    )
  }

  return (
    <>
      <title>
        {success
          ? t('auth.email.verified_title', 'Email Verified')
          : t('auth.email.failed_title', 'Verification Failed')}{' '}
        - {themeConfig.templateName}
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
            boxShadow: (theme) => `0 24px 48px ${alpha(theme.palette.common.black, 0.08)}`,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            mx: 2,
            overflow: 'hidden',
          }}
        >
          <CardContent sx={{ p: { xs: 4, sm: 6 }, textAlign: 'center' }}>
            {success ? (
              <>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '20px',
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 4,
                  }}
                >
                  <Verified sx={{ color: 'success.main', fontSize: 36 }} />
                </Box>

                <Typography variant='h4' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.025em' }}>
                  {t('auth.email.verified_heading', 'Email verified!')}
                </Typography>

                <Typography variant='body1' color='text.secondary' sx={{ mb: 5, lineHeight: 1.6 }}>
                  {t(
                    'auth.email.verified_description',
                    'Your email address has been successfully verified. You can now access all features of your account.',
                  )}
                </Typography>

                <Button
                  variant='contained'
                  size='large'
                  fullWidth
                  onClick={() => navigate(Path.signin)}
                  endIcon={<ArrowForward />}
                  sx={{
                    height: 56,
                    borderRadius: '14px',
                    fontWeight: 700,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                  }}
                >
                  {t('auth.email.continue_to_login', 'Continue to login')}
                </Button>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: '20px',
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 4,
                  }}
                >
                  <ErrorOutline sx={{ color: 'error.main', fontSize: 36 }} />
                </Box>

                <Typography variant='h4' sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.025em' }}>
                  {t('auth.email.failed_heading', 'Verification failed')}
                </Typography>

                <Typography variant='body1' color='text.secondary' sx={{ mb: 5, lineHeight: 1.6 }}>
                  {errorMsg ||
                    t(
                      'auth.email.failed_description',
                      "We couldn't verify your email address. The link might be invalid or has already been used.",
                    )}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button
                    variant='contained'
                    size='large'
                    fullWidth
                    onClick={() => navigate(Path.forgotPassword)}
                    sx={{
                      height: 56,
                      borderRadius: '14px',
                      fontWeight: 700,
                      textTransform: 'none',
                    }}
                  >
                    {t('auth.email.try_again', 'Request a new link')}
                  </Button>

                  <MuiLink
                    component={Link}
                    to={Path.signin}
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      textDecoration: 'none',
                      mt: 1,
                    }}
                  >
                    {t('auth.common.back_to_login', 'Back to log in')}
                  </MuiLink>
                </Box>
              </>
            )}
          </CardContent>
        </Card>

        {/* Support Section */}
        <Box sx={{ mt: 6, display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
          <Help sx={{ fontSize: 18 }} />
          <Typography variant='body2'>
            {t('auth.email.need_help', 'Need help?')}{' '}
            <MuiLink
              href='#'
              sx={{ color: 'text.primary', fontWeight: 700, textDecoration: 'none' }}
            >
              {t('auth.common.contact_support', 'Contact Support')}
            </MuiLink>
          </Typography>
        </Box>
      </Container>
    </>
  )
}
