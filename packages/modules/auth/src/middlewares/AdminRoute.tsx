import React, { Suspense, type ReactNode } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Backdrop, CircularProgress, Alert, Box, Button } from '@mui/material'
import { IAuth } from '@cap/platform-core'
import { isObjectEmpty, Roles, useAppStore, type LayoutOverride } from '@cap/platform-core'
import { useSessionGuard } from './useSessionGuard'
import { Page403Forbidden } from '../screens'

interface AdminRouteProps {
  element: ReactNode
  minimumRole?: Roles
  layout?: LayoutOverride
}

const ADMIN_ROLES: Roles[] = [Roles.ADMIN, Roles.SUPERADMINEMPLOYEE, Roles.SUPERADMIN]

const AdminRoute = ({ element, minimumRole = Roles.ADMIN, layout = 'none' }: AdminRouteProps) => {
  const { isLoading, sessionError, isAuthenticated, user } = useSessionGuard()
  const location = useLocation()
  const navigate = useNavigate()
  const updateLayoutOverride = useAppStore((state) => state.updateLayoutOverride)

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

  const isUserAuthenticated =
    isAuthenticated && user && typeof user !== 'string' && !isObjectEmpty(user)

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

  if (!isUserAuthenticated) {
    return <Navigate to='/auth/signin' replace state={{ from: location }} />
  }

  // Securely resolve user data and role
  const userData = (user as IAuth).user || (user as IAuth)
  const userRole = userData.role as Roles

  // Strict role check using Roles enum values
  const isAdmin = ADMIN_ROLES.includes(userRole)

  if (!isAdmin) {
    return <Page403Forbidden />
  }

  if (userRole < minimumRole) {
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
          textAlign: 'center',
        }}
      >
        <Alert severity='error' sx={{ maxWidth: 500 }}>
          <strong>Insufficient Permissions</strong>
          <br />
          This admin feature requires higher privileges.
        </Alert>
        <Button variant='contained' onClick={() => navigate('/admin')}>
          Go to Admin Dashboard
        </Button>
      </Box>
    )
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

export default AdminRoute
