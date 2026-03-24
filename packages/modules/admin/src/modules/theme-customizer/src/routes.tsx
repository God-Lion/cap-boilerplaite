import React from 'react'
import { AuthRouteConfig } from '@cap/platform-core'
import { Path } from '../../../routes/path'
import { createAdminRoute } from '@cap/module-auth'

const ThemeCustomizer = React.lazy(() => import('./components/ThemeCustomizer'))

export const themeCustomizerRouteConfig: AuthRouteConfig[] = [
  createAdminRoute(Path.ThemeEditor, <ThemeCustomizer />),
]
