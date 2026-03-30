import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Backdrop, CircularProgress } from '@mui/material'
import { isObjectEmpty, Roles, normalizeRole } from '../types/app-types'
import { useAuth } from '../hooks/useAuth'
import type { UserDto as IUserResponse } from '@cap/shared-types'

const access = (pathname: string, user: IUserResponse) => {
  if (!isObjectEmpty(user)) {
    const roleId = user.role
    const normalizedRole = normalizeRole(roleId)
    const all = [`/settings`, '/account', '/profile']
    const routesSuperAdminAccess = ['/admin/', ...all]

    const normalizedPath = pathname.replace(/^\/auth/, '') || '/'

    if (!normalizedRole) return false

    switch (normalizedRole) {
      case Roles.USER:
      case Roles.PROVIDERADMIN:
      case Roles.ADMIN:
      case Roles.SUPERADMIN:
      case Roles.JUDGE:
      case Roles.PROVIDEREMPLOYEE:
      case Roles.SUPERADMINEMPLOYEE:
        return routesSuperAdminAccess.some((value) =>
          value === pathname || value === normalizedPath || pathname.startsWith(value)
        )
      default:
        return false
    }
  }
  return false
}

export interface PrivateRouteProps {
  element: React.ReactNode
  adminLandingPath?: string
  guestLandingPath?: string
}

export const PrivateRoute = ({
  element,
  adminLandingPath = '/admin/',
  guestLandingPath = '/',
}: PrivateRouteProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const { user } = useAuth()

  const normalizedRole = user?.role ? normalizeRole(user.role) : undefined

  React.useEffect(() => {
    if (!user || typeof user === 'string' || isObjectEmpty(user)) {
      navigate(guestLandingPath)
      return
    }

    if (!access(pathname, user)) {
      if (normalizedRole) {
        const adminLandingRoles: Roles[] = [
          Roles.JUDGE,
          Roles.PROVIDEREMPLOYEE,
          Roles.PROVIDERADMIN,
          Roles.ADMIN,
          Roles.SUPERADMINEMPLOYEE,
          Roles.SUPERADMIN,
        ]

        if (adminLandingRoles.includes(normalizedRole)) {
          navigate(adminLandingPath)
        } else {
          navigate(guestLandingPath)
        }
      } else {
        navigate(guestLandingPath)
      }
    }
  }, [pathname, user, navigate, normalizedRole, adminLandingPath, guestLandingPath])

  if (!user || typeof user === 'string' || isObjectEmpty(user)) {
    return (
      <Backdrop open style={{ background: '#fff' }}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  }

  return (
    <React.Suspense
      fallback={
        <Backdrop open style={{ background: '#fff' }}>
          <CircularProgress color='inherit' />
        </Backdrop>
      }
    >
      {element}
    </React.Suspense>
  )
}
