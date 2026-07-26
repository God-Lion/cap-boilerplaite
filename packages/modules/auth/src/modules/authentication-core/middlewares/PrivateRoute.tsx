// cspell:ignore drawingcontest juges PROVIDERADMIN PROVIDEREMPLOYEE SUPERADMINEMPLOYEE SUPERADMIN
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Backdrop, CircularProgress } from '@mui/material'
import { isObjectEmpty, useAuth, Roles } from '@cap/platform-core'
import type { IResponse } from '@cap/platform-core'
import Path from '../../../routes/path'

const access = (pathname: string, user: any) => {
  if (!isObjectEmpty(user)) {
    const roleId = user.role
    const all = [`/settings`, '/drawingcontest', '/account', '/profile']
    const routesSuperAdminAccess = ['/admin/', Path.admin.events, Path.admin.users, ...all]

    // Normalize pathname to handle potential /auth/ prefix or others
    const normalizedPath = pathname.replace(/^\/auth/, '') || '/'

    switch (roleId) {
      case Roles.USER:
      case Roles.PROVIDERADMIN:
      case Roles.ADMIN:
      case Roles.SUPERADMIN:
      case Roles.JUDGE:
      case Roles.PROVIDEREMPLOYEE:
      case Roles.SUPERADMINEMPLOYEE:
        return routesSuperAdminAccess.some((value) => {
          if (value === pathname || value === normalizedPath) return true
          const prefix = value.endsWith('/') ? value : `${value}/`
          return pathname.startsWith(prefix) || normalizedPath.startsWith(prefix)
        })
      default:
        return false
    }
  }
  return false
}

export default function PrivateRoute({ element }: { element: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const pathname = location.pathname
  const { user } = useAuth()

  React.useEffect(() => {
    if (!user || typeof user === 'string' || isObjectEmpty(user)) {
      navigate('/')
      return
    }

    if (!access(pathname, user)) {
      const roleId = user.role
      const adminLandingRoles: Roles[] = [
        Roles.JUDGE,
        Roles.PROVIDEREMPLOYEE,
        Roles.PROVIDERADMIN,
        Roles.ADMIN,
        Roles.SUPERADMINEMPLOYEE,
        Roles.SUPERADMIN,
      ]

      if (
        roleId && adminLandingRoles.includes(roleId as Roles)
      ) {
        navigate('/admin/')
      } else {
        navigate('/')
      }
    }
  }, [pathname, user, navigate])

  // Early return if user is invalid, but AFTER useEffect
  if (!user || typeof user === 'string' || isObjectEmpty(user)) {
    return null
  }

  return (
    <React.Suspense
      fallback={
        <Backdrop open style={{ background: '#fff' }}>
          <CircularProgress color='inherit' />
        </Backdrop>
      }
    >
      {/* <Await
        resolve={element}
        errorElement={<div>Could not load reviews 😬</div>}
        children={element}
      /> */}
      {element}
    </React.Suspense>
  )
}
