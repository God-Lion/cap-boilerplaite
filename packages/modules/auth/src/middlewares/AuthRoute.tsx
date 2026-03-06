import React, { Suspense, type ReactNode } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Backdrop, CircularProgress, Alert, Box, Button } from '@mui/material'
import { Roles, useAppStore, type LayoutOverride } from '@cap/platform-core'
import { useSessionGuard } from './useSessionGuard'

interface AuthRouteProps {
  element: ReactNode
  allowedRoles?: Roles[]
  requiresVerification?: boolean
  layout?: LayoutOverride
}

const AuthRoute = ({
  element,
  allowedRoles,
  requiresVerification = false,
  layout = 'none',
}: AuthRouteProps) => {
  const { isLoading, sessionError, isAuthenticated, user } = useSessionGuard()
  const location = useLocation()
  const updateLayoutOverride = useAppStore((state) => state.updateLayoutOverride)
  const navigate = useNavigate()

  React.useEffect(() => {
    if (layout !== 'none') {
      updateLayoutOverride(layout)
      return () => updateLayoutOverride('none')
    }
  }, [layout, updateLayoutOverride])

  if (isLoading) {
    return (
      <Backdrop open style={{ background: '#FFF', zIndex: 1400 }}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  }

  if (sessionError) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          p: 3,
        }}
      >
        <Alert severity='warning' sx={{ maxWidth: 500 }}>
          {sessionError}
        </Alert>
        <Button variant='contained' onClick={() => navigate('/auth/signin')}>
          Go to Login
        </Button>
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to='/auth/sign-in' replace state={{ from: location }} />
  }

  // Securely resolve user data and role
  // Handle cases where user might be the auth object itself or wrapped in a tuple like [userData, isLoading]
  const rawUser = user as any
  const userData: any = Array.isArray(rawUser)
    ? rawUser[0]?.user || rawUser[0]
    : rawUser?.user || rawUser

  const userRole = (userData?.role as Roles) || Roles.USER

  // Check role access
  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.includes(userRole)

    if (!hasAccess) {
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: 2,
            p: 3,
          }}
        >
          <Alert severity='error' sx={{ maxWidth: 500 }}>
            You don&rsquo;t have permission to access this page.
          </Alert>
          <Button variant='contained' onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </Box>
      )
    }
  }

  // Handle email verification check
  if (requiresVerification) {
    const ADMIN_ROLES: Roles[] = [Roles.ADMIN, Roles.SUPERADMINEMPLOYEE, Roles.SUPERADMIN]
    const isAdmin = ADMIN_ROLES.includes(userRole)

    // Admins bypass verification check
    if (!isAdmin) {
      // Logic for verification: check emailVerified (serialized from backend)
      const isVerified = userData?.emailVerified === true

      if (!isVerified) {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              gap: 2,
              p: 3,
            }}
          >
            <Alert severity='warning' sx={{ maxWidth: 500 }}>
              Please verify your email address to access this feature. Check your inbox for a
              verification email.
            </Alert>
            <Button variant='contained' onClick={() => navigate('/auth/verification/email')}>
              Resend Verification Email
            </Button>
          </Box>
        )
      }
    }
  }

  return (
    <Suspense
      fallback={
        <Backdrop open style={{ background: '#FFF', zIndex: 1400 }}>
          <CircularProgress color='inherit' />
        </Backdrop>
      }
    >
      {element}
    </Suspense>
  )
}

export default AuthRoute
