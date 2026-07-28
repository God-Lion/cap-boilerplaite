import React from 'react';
import { AuthRouteConfig } from '@cap/platform-core';
import { Roles } from '@cap/platform-core';
import AdminRoute from '../modules/authorization-engine/middlewares/AdminRoute';
import AuthRoute from '../modules/authentication-core/middlewares/AuthRoute';
import GuestRoute from '../modules/authentication-core/middlewares/GuestRoute';

// ---------------------------------------------------------------------------
// Route factory helpers
// ---------------------------------------------------------------------------

export const createAdminRoute = (
  path: string,
  element: React.ReactNode,
): AuthRouteConfig => ({
  path,
  // Use a getter so Roles is resolved lazily at render time, not at module evaluation time.
  // This prevents the "Cannot read properties of undefined" error caused by circular imports.
  get element() {
    return <AdminRoute element={element} minimumRole={Roles.ADMIN} layout='admin' />
  },
})

export const createAuthRoute = (
  path: string,
  element: React.ReactNode,
  options: { requiresVerification?: boolean; layout?: any } = {},
): AuthRouteConfig => ({
  path,
  element: (
    <AuthRoute
      element={element}
      requiresVerification={options.requiresVerification}
      layout={options.layout}
    />
  ),
})

// Re-export LayoutRouteWrapper from layout package
export { LayoutRouteWrapper } from '@cap/layout'

