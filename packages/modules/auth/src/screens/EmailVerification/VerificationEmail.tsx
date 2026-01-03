import React from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  Container,
  CircularProgress,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Link as MuiLink,
} from '@mui/material'
import { useTheme, alpha } from '@mui/material/styles'
import { CheckCircle, ErrorOutline } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import {
  FetchResponse,
  HttpError,
  authService,
  AdaptiveLogo,
  themeConfig,
} from '@cap/platform-core'

const SUPPORT_EMAIL = 'support@example.com'

export default function VerificationEmail() {
  const { t } = useTranslation()
  const theme = useTheme()
  const navigate = useNavigate()
  const { email } = useParams()

  const [searchParams] = useSearchParams()
  const signature = searchParams.get('signature')

  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<HttpError>()
  const [success, setSuccess] = React.useState<boolean>(false)

  React.useEffect(() => {
    async function fetchData() {
      if (!email || !signature) return
      try {
        setLoading(true)
        const response: FetchResponse = await authService.verifyEmail(email, signature)
        if (response.status === 200) {
          setSuccess(true)
          setTimeout(() => {
            navigate('/auth/login')
          }, 3000)
        }
      } catch (error) {
        setError(error as HttpError)
        console.log('error ', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [email, navigate, signature])

  return (
    <React.Fragment>
      <title>
        {t('auth.verification.title_page')} - {themeConfig.templateName}
      </title>
      <meta name='description' content={t('auth.verification.meta_desc')} />
      <meta name='keywords' content={`email verification, ${themeConfig.templateName}`} />

      <Container
        component='main'
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
        }}
      >
        <Card sx={{ maxWidth: 450, width: '100%', borderRadius: 2 }}>
          <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <AdaptiveLogo width={60} height={60} />
            </Box>

            {loading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
                <CircularProgress
                  size={48}
                  thickness={4}
                  sx={{ mb: 3, color: theme.palette.primary.main }}
                />
                <Typography variant='h6' color='text.secondary'>
                  Verifying your email...
                </Typography>
              </Box>
            )}

            {!loading && success && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  py: 2,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />
                </Box>
                <Typography variant='h4' fontWeight={700} gutterBottom>
                  {t('auth.verification.success_title')}
                </Typography>
                <Typography variant='body1' color='text.secondary' sx={{ mb: 4, maxWidth: '90%' }}>
                  {t('auth.verification.success_desc')}
                </Typography>
                <Button
                  component={Link}
                  to='/auth/sign-in'
                  fullWidth
                  variant='contained'
                  size='large'
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {t('auth.verification.button_back_to_login')}
                </Button>
              </Box>
            )}

            {!loading && error && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  py: 2,
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <ErrorOutline sx={{ fontSize: 48, color: 'error.main' }} />
                </Box>

                <Typography variant='h5' fontWeight={700} gutterBottom color='error.main'>
                  {t('auth.verification.invalid_link_title')}
                </Typography>

                {error?.code === 'ERR_NETWORK' ? (
                  <Typography variant='body1' color='text.secondary' paragraph>
                    {error.message}
                  </Typography>
                ) : (
                  <>
                    <Typography variant='body1' color='text.secondary' paragraph>
                      {t('auth.verification.invalid_link_desc1')}
                    </Typography>
                    <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                      {t('auth.verification.invalid_link_desc2')}
                    </Typography>
                  </>
                )}

                <Box
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.background.default, 0.5),
                    p: 2,
                    borderRadius: 2,
                    mb: 3,
                    width: '100%',
                  }}
                >
                  <Typography variant='body2' color='text.secondary'>
                    {t('auth.verification.support_text', {
                      defaultValue:
                        'If you continue to experience issues, please contact our support team at',
                    })}{' '}
                    <MuiLink
                      component={Link}
                      to={`mailto:${SUPPORT_EMAIL}`}
                      sx={{ fontWeight: 600, color: 'primary.main' }}
                    >
                      {SUPPORT_EMAIL}
                    </MuiLink>
                  </Typography>
                </Box>

                <Button
                  component={Link}
                  to='/auth/forgot-password'
                  fullWidth
                  variant='outlined'
                  size='large'
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                  }}
                >
                  {t('auth.verification.button_resend', { defaultValue: 'Request New Link' })}
                </Button>

                <Button
                  component={Link}
                  to='/auth/sign-in'
                  sx={{ mt: 2, textTransform: 'none' }}
                  color='inherit'
                >
                  {t('auth.verification.button_back_to_login')}
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </React.Fragment>
  )
}
