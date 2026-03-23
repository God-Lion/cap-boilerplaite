import React from 'react'
import { AuthRouteConfig } from '@cap/platform-core/src/assembly'
import Path from '../screens/path'
import { createAuthRoute } from '../../../routes/routeHelpers'

// ---------------------------------------------------------------------------
// Passwordless screens
// ---------------------------------------------------------------------------
const PasswordlessInitiation   = React.lazy(() => import('../screens/PasswordlessInitiation'))
const PasswordlessVerification = React.lazy(() => import('../screens/PasswordlessVerification'))

// ---------------------------------------------------------------------------
// Route config
// ---------------------------------------------------------------------------
export const passwordlessServiceRouteConfig: AuthRouteConfig[] = [
  createAuthRoute(Path.setup, <PasswordlessInitiation />),
  { path: Path.verification, element: <PasswordlessVerification /> },
]

