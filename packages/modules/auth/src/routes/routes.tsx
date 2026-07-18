/**
 * Central route aggregator for the auth module.
 *
 * This file is intentionally thin — it only imports and spreads the route
 * configs exported by each sub-module.  All screen lazy-loads, guard logic,
 * and path constants live inside the respective module's routes/routes.tsx.
 */
import React from 'react'
import { Route, RoutesProps } from 'react-router-dom'
import { AuthRouteConfig } from '@cap/platform-core'
import AuthLoadingScreen from '../modules/authentication-core/components/shared/AuthLoadingScreen'
import { LayoutRouteWrapper } from './routeHelpers'

import { authCoreRouteConfig }             from '../modules/authentication-core/routes/routes'
import { authorizationEngineRouteConfig }  from '../modules/authorization-engine/routes/routes'
import { identityBrokerRouteConfig }       from '../modules/identity-broker/routes/routes'
import { mfaOrchestratorRouteConfig }      from '../modules/mfa-orchestrator/routes/routes'
import { passwordlessServiceRouteConfig }  from '../modules/passwordless-service/routes/routes'
import { platformClusterRouteConfig }      from '../modules/platform-cluster/routes/routes'
import { sessionManagerRouteConfig }       from '../modules/session-manager/routes/routes'
import { userDirectoryRouteConfig }        from '../modules/user-directory/routes/routes'

// ---------------------------------------------------------------------------
// Merged route config (consumed by AppAssembly / CAPModule)
// Note: Admin routes are kept here so admin module can reference them
// ---------------------------------------------------------------------------
export const authRouteConfig: AuthRouteConfig[] = [
  ...authCoreRouteConfig,
  ...authorizationEngineRouteConfig,
  ...identityBrokerRouteConfig,
  ...mfaOrchestratorRouteConfig,
  ...passwordlessServiceRouteConfig,
  ...platformClusterRouteConfig,
  ...sessionManagerRouteConfig,
  ...userDirectoryRouteConfig,
]

// ---------------------------------------------------------------------------
// Route component (consumed by assembleApp - returns Route elements, NOT <Routes>)
// assembleApp wraps all module routes in a single <Routes> for proper React Router matching
// ---------------------------------------------------------------------------
export const authRoutes: React.FC<RoutesProps> = () => (
  <React.Suspense fallback={<AuthLoadingScreen />}>
    <>
      {authRouteConfig.map(({ path, element, layout }) => (
        <Route
          key={path}
          path={path}
          element={<LayoutRouteWrapper element={element} layout={layout} />}
        />
      ))}
    </>
  </React.Suspense>
)
