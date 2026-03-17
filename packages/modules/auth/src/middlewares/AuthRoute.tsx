import React, { Suspense, type ReactNode } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Backdrop, CircularProgress, Alert, Box, Button } from '@mui/material'
import { Roles, useAppStore, type LayoutOverride } from '@cap/platform-core'
import { useSessionGuard } from './useSessionGuard'
import { Path } from '../screens'
import { normalizeAuthUser } from '../utils/normalizeAuthUser'

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

  // Securely resolve user data and role
  const userData: any = normalizeAuthUser(user)
  const userRole = (userData?.role as Roles) || Roles.USER

  React.useEffect(() => {
    const ADMIN_ROLES: Roles[] = [Roles.ADMIN, Roles.SUPERADMINEMPLOYEE, Roles.SUPERADMIN]
    const isAdminSession = ADMIN_ROLES.includes(userRole)

    // Force admin layout for admins if currently set to 'none'
    const finalLayout = isAdminSession && layout === 'none' ? 'admin' : layout

    if (finalLayout !== 'none') {
      updateLayoutOverride(finalLayout)
      return () => {
        // Only reset if we are NOT an admin
        if (!isAdminSession) {
          updateLayoutOverride('none')
        }
      }
    }
  }, [layout, updateLayoutOverride, userRole])

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
        <Button variant='contained' onClick={() => navigate(Path.auth.signin)}>
          Go to Login
        </Button>
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={Path.auth.signin} replace state={{ from: location }} />
  }

  if (!isAuthenticated) {
    return <Navigate to={Path.auth.signin} replace state={{ from: location }} />
  }

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
            <Button variant='contained' onClick={() => navigate(Path.auth.emailVerification)}>
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
