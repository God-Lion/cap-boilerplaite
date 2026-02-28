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

  interface UserWithRole {
    role: string
    isVerified?: boolean
    emailVerified?: boolean
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (user as unknown as UserWithRole).role
    const hasAccess = allowedRoles.includes(userRole as unknown as Roles)

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

  if (requiresVerification) {
    const u = user as unknown as UserWithRole
    const isVerified = u.isVerified || u.emailVerified

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
