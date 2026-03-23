import React from 'react'
import { AuthRouteConfig } from '@cap/platform-core/src/assembly'
import { Roles, useAppStore } from '@cap/platform-core'
import AdminRoute from '../modules/authorization-engine/middlewares/AdminRoute'
import AuthRoute from '../modules/authentication-core/middlewares/AuthRoute'

// ---------------------------------------------------------------------------
// Route factory helpers
// ---------------------------------------------------------------------------

export const createAdminRoute = (
  path: string,
  element: React.ReactNode,
): AuthRouteConfig => ({
  path,
  element: <AdminRoute element={element} minimumRole={Roles.ADMIN} layout='admin' />,
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

// ---------------------------------------------------------------------------
// Layout override wrapper
// ---------------------------------------------------------------------------
// Wraps a route element and syncs the layoutOverride Zustand slice based on
// the layout value declared in AuthRouteConfig.
//
// Admin routes do NOT need to set layoutOverride here — AdminRoute.tsx handles
// that directly (it calls updateLayoutOverride('admin') in a useEffect).
// This wrapper only needs to handle the two remaining non-default cases:
//   'noLayout' — suppress all chrome (used for error pages, maintenance, etc.)
//   anything else (undefined / 'vertical' / 'horizontal') — leave override as-is

// eslint-disable-next-line react-refresh/only-export-components
export const LayoutRouteWrapper = ({
  element,
  layout,
}: {
  element: React.ReactNode
  layout?: AuthRouteConfig['layout']
}) => {
  const updateLayoutOverride = useAppStore((state) => state.updateLayoutOverride)

  React.useEffect(() => {
    if (layout === 'noLayout') {
      updateLayoutOverride('noLayout')
      return () => updateLayoutOverride('none')
    }
    // 'admin' override is set by AdminRoute itself — no action needed here
  }, [layout, updateLayoutOverride])

  return (
    <div className='premium-auth-container' style={{ display: 'contents' }}>
      {element}
    </div>
  )
}
