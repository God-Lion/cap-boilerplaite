import React, { lazy } from 'react'
import { Route } from 'react-router-dom'
import { AuthRouteConfig } from '@cap/platform-core'
import { createAdminRoute } from '@cap/module-auth'
import Path from './path'

const AccessPointsScreen = lazy(() => import('../domain-kernel/nfc/AccessPointsScreen')) as React.FC<{ orgId: number | string }>
const AccessLogsScreen = lazy(() => import('../domain-kernel/nfc/AccessLogsScreen')) as React.FC<{ orgId: number | string }>
const NfcCardsScreen = lazy(() => import('../domain-kernel/nfc/NfcCardsScreen'))

export const userRouteConfig: AuthRouteConfig[] = [
  createAdminRoute(Path.nfc.accessPoints, <AccessPointsScreen orgId={1} />),
  createAdminRoute(Path.nfc.logs, <AccessLogsScreen orgId={1} />),
  createAdminRoute(Path.nfc.cards, <NfcCardsScreen />),
]

export const UserRoutes: React.FC = () => (
  <>
    {userRouteConfig.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </>
)
