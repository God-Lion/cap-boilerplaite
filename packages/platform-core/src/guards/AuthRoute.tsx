import React, { Suspense, type ReactNode } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Backdrop, CircularProgress, Alert, Box, Button } from '@mui/material'
import { useAppStore, type LayoutOverride, Roles, ADMIN_ROLES } from '../types/app-types'
import { useSessionGuard } from '../hooks/useSessionGuard'
import { normalizeAuthUser } from '../utils/normalizeAuthUser'

export interface AuthRouteProps {
  element: ReactNode
  allowedRoles?: Roles[]
  requiresVerification?: boolean
  layout?: LayoutOverride
  signInPath?: string
}

export const AuthRoute = ({
  element,
  allowedRoles,
  requiresVerification = false,
  layout = 'none',
  signInPath = '/auth/signin',
}: AuthRouteProps) => {
  const { isLoading, sessionError, isAuthenticated, user } = useSessionGuard()
  const location = useLocation()
  const updateLayoutOverride = useAppStore((state) => state.updateLayoutOverride)
  const navigate = useNavigate()

  const userData = normalizeAuthUser(user)
  const userRole = (userData?.role as Roles) || Roles.USER

  React.useEffect(() => {
    const isAdminSession = ADMIN_ROLES.includes(userRole)
    const finalLayout = isAdminSession && layout === 'none' ? 'admin' : layout

    if (finalLayout !== 'none') {
      updateLayoutOverride(finalLayout)
      return () => {
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
        <Button variant='contained' onClick={() => navigate(signInPath)}>
          Go to Login
        </Button>
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={signInPath} replace state={{ from: location }} />
  }

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
            You don't have permission to access this page.
          </Alert>
          <Button variant='contained' onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </Box>
      )
    }
  }

  if (requiresVerification) {
    const isAdmin = ADMIN_ROLES.includes(userRole)

    if (!isAdmin) {
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
              Please verify your email address to access this feature.
            </Alert>
            <Button variant='contained' onClick={() => navigate('/auth/email-verification')}>
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
