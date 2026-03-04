import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Avatar,
  Stack,
  Divider,
  alpha,
} from '@mui/material'
import {
  CheckCircle,
  Groups,
  BadgeOutlined,
  TimerOutlined,
  ErrorOutline,
  Close,
  AppShortcut,
} from '@mui/icons-material'
import { themeConfig } from '@cap/platform-core'
import { adminService } from '../../../services/adminService'

interface InvitationDetails {
  id: number
  email: string
  role: string
  status: string
  expiresAt: string
  organization: {
    id: number
    name: string
    slug: string
  }
}

type PageState =
  | 'loading'
  | 'ready'
  | 'accepting'
  | 'declining'
  | 'accepted'
  | 'declined'
  | 'error'
  | 'expired'
  | 'already_used'

// ── Shared layout wrapper (top-level to avoid re-creation) ───────────────
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <title>Join Organization - {themeConfig.templateName}</title>
      <Container
        component='main'
        maxWidth={false}
        disableGutters
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
          bgcolor: '#f6f7f8',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Header */}
        <Box
          component='header'
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e5e7eb',
            bgcolor: '#ffffff',
            px: 5,
            py: 2,
            boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
            zIndex: 10,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#137fec',
              }}
            >
              <AppShortcut sx={{ fontSize: 24 }} />
            </Box>
            <Typography
              variant='h6'
              sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#111418' }}
            >
              {themeConfig.templateName || 'App Name'}
            </Typography>
          </Box>
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 2,
            py: 6,
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '480px' }}>{children}</Box>
        </Box>
      </Container>
    </>
  )
}

const fadeInUpSx = {
  animation: 'fadeInUp 0.6s ease-out',
  '@keyframes fadeInUp': {
    '0%': { opacity: 0, transform: 'translateY(20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
}

const cardBaseSx = {
  borderRadius: '16px',
  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  border: '1px solid #e5e7eb',
  overflow: 'hidden',
  ...fadeInUpSx,
}

export default function JoinOrganization() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const hasRequiredParams = useMemo(() => Boolean(token && email), [token, email])

  const [state, setState] = useState<PageState>(() => (hasRequiredParams ? 'loading' : 'error'))
  const [invitation, setInvitation] = useState<InvitationDetails | null>(null)
  const [errorMessage, setErrorMessage] = useState(() =>
    hasRequiredParams ? '' : 'Invalid invitation link. Token and email are required.',
  )

  // Fetch invitation details on mount
  useEffect(() => {
    if (!token || !email) return

    const fetchDetails = async () => {
      try {
        const res = await adminService.getInvitationDetails(token, email)
        if (res.status >= 200 && res.status < 300) {
          setInvitation(res.data)
          setState('ready')
        } else {
          const data = res.data as any
          if (data?.status === 'expired') {
            setState('expired')
          } else if (data?.status === 'accepted' || data?.status === 'revoked') {
            setState('already_used')
            setErrorMessage(data?.message || 'This invitation is no longer valid.')
          } else {
            setState('error')
            setErrorMessage(data?.message || 'Could not load invitation details.')
          }
        }
      } catch (_: unknown) {
        setState('error')
        setErrorMessage('Failed to load invitation. Please try again later.')
      }
    }

    fetchDetails()
  }, [token, email])

  const handleAccept = useCallback(async () => {
    if (!token || !email) return
    setState('accepting')
    try {
      const res = await adminService.acceptInvitation(token, email)
      if (res.status >= 200 && res.status < 300) {
        setState('accepted')
      } else {
        const data = res.data as any
        setState('error')
        setErrorMessage(data?.message || 'Failed to accept invitation.')
      }
    } catch (_: unknown) {
      setState('error')
      setErrorMessage('Failed to accept invitation. Please try again.')
    }
  }, [token, email])

  const handleDecline = useCallback(async () => {
    if (!token || !email) return
    setState('declining')
    try {
      const res = await adminService.declineInvitation(token, email)
      if (res.status >= 200 && res.status < 300) {
        setState('declined')
      } else {
        const data = res.data as any
        setState('error')
        setErrorMessage(data?.message || 'Failed to decline invitation.')
      }
    } catch (_: unknown) {
      setState('error')
      setErrorMessage('Failed to decline invitation. Please try again.')
    }
  }, [token, email])

  // ── Loading State ──────────────────────────────────────────────────────
  if (state === 'loading') {
    return (
      <PageShell>
        <Card
          sx={{
            ...cardBaseSx,
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              p: 5,
            }}
          >
            <CircularProgress size={48} sx={{ color: '#137fec' }} />
            <Typography sx={{ color: '#637588', fontWeight: 500 }}>
              Loading invitation details...
            </Typography>
          </CardContent>
        </Card>
      </PageShell>
    )
  }

  // ── Error State ────────────────────────────────────────────────────────
  if (state === 'error') {
    return (
      <PageShell>
        <Card sx={cardBaseSx}>
          <CardContent
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 5 }}
          >
            <Box sx={{ p: 2.5, borderRadius: '50%', bgcolor: alpha('#ef4444', 0.1) }}>
              <ErrorOutline sx={{ color: '#ef4444', fontSize: 52 }} />
            </Box>
            <Typography
              variant='h5'
              sx={{ fontWeight: 700, color: '#111418', textAlign: 'center' }}
            >
              Something went wrong
            </Typography>
            <Typography
              variant='body2'
              sx={{ color: '#637588', textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}
            >
              {errorMessage}
            </Typography>
            <Button
              fullWidth
              variant='contained'
              onClick={() => navigate('/auth/login')}
              sx={{
                mt: 1,
                height: 48,
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: '#137fec',
                '&:hover': { bgcolor: '#1068c1' },
              }}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    )
  }

  // ── Expired ────────────────────────────────────────────────────────────
  if (state === 'expired') {
    return (
      <PageShell>
        <Card sx={cardBaseSx}>
          <CardContent
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 5 }}
          >
            <Box sx={{ p: 2.5, borderRadius: '50%', bgcolor: alpha('#f59e0b', 0.1) }}>
              <TimerOutlined sx={{ color: '#f59e0b', fontSize: 52 }} />
            </Box>
            <Typography
              variant='h5'
              sx={{ fontWeight: 700, color: '#111418', textAlign: 'center' }}
            >
              Invitation Expired
            </Typography>
            <Typography
              variant='body2'
              sx={{ color: '#637588', textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}
            >
              This invitation has expired. Please contact the organization administrator to receive
              a new invitation.
            </Typography>
            <Button
              fullWidth
              variant='contained'
              onClick={() => navigate('/auth/login')}
              sx={{
                mt: 1,
                height: 48,
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: '#137fec',
                '&:hover': { bgcolor: '#1068c1' },
              }}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    )
  }

  // ── Already Used ───────────────────────────────────────────────────────
  if (state === 'already_used') {
    return (
      <PageShell>
        <Card sx={cardBaseSx}>
          <CardContent
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 5 }}
          >
            <Box sx={{ p: 2.5, borderRadius: '50%', bgcolor: alpha('#6b7280', 0.1) }}>
              <ErrorOutline sx={{ color: '#6b7280', fontSize: 52 }} />
            </Box>
            <Typography
              variant='h5'
              sx={{ fontWeight: 700, color: '#111418', textAlign: 'center' }}
            >
              Invitation No Longer Valid
            </Typography>
            <Typography
              variant='body2'
              sx={{ color: '#637588', textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}
            >
              {errorMessage}
            </Typography>
            <Button
              fullWidth
              variant='contained'
              onClick={() => navigate('/dashboard')}
              sx={{
                mt: 1,
                height: 48,
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: '#137fec',
                '&:hover': { bgcolor: '#1068c1' },
              }}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    )
  }

  // ── Accepted State ─────────────────────────────────────────────────────
  if (state === 'accepted') {
    return (
      <PageShell>
        <Card sx={cardBaseSx}>
          <CardContent
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 5 }}
          >
            <Box
              sx={{
                p: 2.5,
                borderRadius: '50%',
                bgcolor: alpha('#10b981', 0.1),
                animation: 'scaleIn 0.5s ease-out',
                '@keyframes scaleIn': {
                  '0%': { transform: 'scale(0)' },
                  '60%': { transform: 'scale(1.1)' },
                  '100%': { transform: 'scale(1)' },
                },
              }}
            >
              <CheckCircle sx={{ color: '#10b981', fontSize: 52 }} />
            </Box>
            <Typography
              variant='h5'
              sx={{ fontWeight: 700, color: '#111418', textAlign: 'center' }}
            >
              Welcome to {invitation?.organization.name}!
            </Typography>
            <Typography
              variant='body2'
              sx={{ color: '#637588', textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}
            >
              You have successfully joined the organization as a <strong>{invitation?.role}</strong>
              . You can now collaborate with your team.
            </Typography>
            <Button
              fullWidth
              variant='contained'
              onClick={() => navigate('/dashboard')}
              sx={{
                mt: 1,
                height: 48,
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '1rem',
                bgcolor: '#10b981',
                boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  bgcolor: '#059669',
                  boxShadow: '0 6px 8px -1px rgba(16, 185, 129, 0.4)',
                },
              }}
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    )
  }

  // ── Declined State ─────────────────────────────────────────────────────
  if (state === 'declined') {
    return (
      <PageShell>
        <Card sx={cardBaseSx}>
          <CardContent
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, p: 5 }}
          >
            <Box sx={{ p: 2.5, borderRadius: '50%', bgcolor: alpha('#6b7280', 0.1) }}>
              <Close sx={{ color: '#6b7280', fontSize: 52 }} />
            </Box>
            <Typography
              variant='h5'
              sx={{ fontWeight: 700, color: '#111418', textAlign: 'center' }}
            >
              Invitation Declined
            </Typography>
            <Typography
              variant='body2'
              sx={{ color: '#637588', textAlign: 'center', maxWidth: 340, lineHeight: 1.6 }}
            >
              You have declined the invitation to join{' '}
              <strong>{invitation?.organization.name}</strong>. No action was taken on your account.
            </Typography>
            <Button
              fullWidth
              variant='contained'
              onClick={() => navigate('/auth/login')}
              sx={{
                mt: 1,
                height: 48,
                borderRadius: '10px',
                textTransform: 'none',
                fontWeight: 700,
                bgcolor: '#137fec',
                '&:hover': { bgcolor: '#1068c1' },
              }}
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </PageShell>
    )
  }

  // ── Ready State (main invitation card) ─────────────────────────────────
  return (
    <PageShell>
      <Card
        sx={{
          ...cardBaseSx,
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Gradient Banner */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                border: '2px solid rgba(255,255,255,0.3)',
              }}
            >
              <Groups sx={{ fontSize: 32, color: '#fff' }} />
            </Avatar>
            <Typography
              variant='h5'
              sx={{
                fontWeight: 800,
                color: '#fff',
                textAlign: 'center',
                letterSpacing: '-0.02em',
              }}
            >
              {"You're Invited!"}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: 'rgba(255,255,255,0.85)',
                textAlign: 'center',
                maxWidth: 320,
                lineHeight: 1.6,
              }}
            >
              You have been invited to join an organization on {themeConfig.templateName}.
            </Typography>
          </Box>

          {/* Invitation Details */}
          <Box sx={{ p: 4 }}>
            <Stack spacing={2.5}>
              {/* Organization */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: alpha('#667eea', 0.05),
                  border: '1px solid',
                  borderColor: alpha('#667eea', 0.1),
                }}
              >
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: alpha('#667eea', 0.1),
                    color: '#667eea',
                  }}
                >
                  <Groups sx={{ fontSize: 22 }} />
                </Avatar>
                <Box>
                  <Typography
                    variant='caption'
                    sx={{
                      color: '#637588',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.7rem',
                    }}
                  >
                    Organization
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 700, color: '#111418' }}>
                    {invitation?.organization.name}
                  </Typography>
                </Box>
              </Box>

              {/* Role */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: alpha('#10b981', 0.05),
                  border: '1px solid',
                  borderColor: alpha('#10b981', 0.1),
                }}
              >
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: alpha('#10b981', 0.1),
                    color: '#10b981',
                  }}
                >
                  <BadgeOutlined sx={{ fontSize: 22 }} />
                </Avatar>
                <Box>
                  <Typography
                    variant='caption'
                    sx={{
                      color: '#637588',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.7rem',
                    }}
                  >
                    Assigned Role
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant='body1' sx={{ fontWeight: 700, color: '#111418' }}>
                      {invitation?.role}
                    </Typography>
                    <Chip
                      size='small'
                      label={invitation?.role}
                      sx={{
                        height: 22,
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        bgcolor: alpha('#10b981', 0.1),
                        color: '#10b981',
                      }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Email */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: '12px',
                  bgcolor: alpha('#6366f1', 0.05),
                  border: '1px solid',
                  borderColor: alpha('#6366f1', 0.1),
                }}
              >
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: alpha('#6366f1', 0.1),
                    color: '#6366f1',
                  }}
                >
                  @
                </Avatar>
                <Box>
                  <Typography
                    variant='caption'
                    sx={{
                      color: '#637588',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      fontSize: '0.7rem',
                    }}
                  >
                    Invited Email
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 700, color: '#111418' }}>
                    {invitation?.email}
                  </Typography>
                </Box>
              </Box>
            </Stack>

            <Divider sx={{ my: 3, borderColor: '#f0f2f4' }} />

            {/* Action Buttons */}
            <Stack spacing={1.5}>
              <Button
                fullWidth
                variant='contained'
                size='large'
                onClick={handleAccept}
                disabled={state === 'accepting'}
                startIcon={
                  state === 'accepting' ? (
                    <CircularProgress size={18} color='inherit' />
                  ) : (
                    <CheckCircle />
                  )
                }
                sx={{
                  height: 52,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '1rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4192 100%)',
                    boxShadow: '0 6px 18px 0 rgba(102, 126, 234, 0.5)',
                  },
                  '&:disabled': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    opacity: 0.7,
                    color: '#fff',
                  },
                }}
              >
                {state === 'accepting' ? 'Joining...' : 'Accept & Join Organization'}
              </Button>

              <Button
                fullWidth
                variant='text'
                size='large'
                onClick={handleDecline}
                disabled={state === 'declining'}
                sx={{
                  height: 48,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#637588',
                  '&:hover': {
                    bgcolor: '#f0f2f4',
                    color: '#ef4444',
                  },
                }}
              >
                {state === 'declining' ? 'Declining...' : 'Decline Invitation'}
              </Button>
            </Stack>

            {/* Footer Note */}
            <Typography
              variant='caption'
              sx={{
                display: 'block',
                mt: 3,
                fontSize: '0.7rem',
                color: '#9ca3af',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              {"By accepting this invitation, you agree to the organization's policies. "}
              {"If you didn't expect this invitation, you can safely decline."}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </PageShell>
  )
}
