import React from 'react'
import { Route, type RoutesProps } from 'react-router-dom'
import { AuthRouteConfig } from '@cap/platform-core'
import { Path } from '../../../routes/path'
import { createAdminRoute, AdminRoute } from '@cap/module-auth'

const ThemeCustomizer = React.lazy(() => import('./components/ThemeCustomizer'))
const ThemeBuilder = React.lazy(() => import('./screens/ThemeBuilder'))

export const themeCustomizerRouteConfig: AuthRouteConfig[] = [
  createAdminRoute(Path.ThemeEditor, <ThemeCustomizer />),
  {
    path: Path.themeBuilder,
    element: <ThemeBuilder />,
    layout: 'noLayout',
  }
]

