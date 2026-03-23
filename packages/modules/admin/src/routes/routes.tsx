import React from 'react'
import { Route } from 'react-router-dom'
import { AuthRouteConfig } from '@cap/platform-core'
import { authRouteConfig } from '@cap/module-auth'
import { dashboardRouteConfig } from '../modules/dashboard/src/routes'
import { themeCustomizerRouteConfig } from '../modules/theme-customizer/src/routes'

// Filter AuthModule routes for those that use the admin layout or belong to admin-specific paths
const adminAuthRoutes = authRouteConfig.filter(
  (route) => route.layout === 'admin' || route.path?.startsWith('/admin') || route.path?.startsWith('/monitoring'),
)

export const adminRouteConfig: AuthRouteConfig[] = [
  ...dashboardRouteConfig,
  ...themeCustomizerRouteConfig,
  ...adminAuthRoutes,
]

// Returns Route elements only - assembleApp wraps in <Routes> for proper React Router matching
export const adminRoutes: React.FC = () => (
  <>
    {adminRouteConfig.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </>
)
