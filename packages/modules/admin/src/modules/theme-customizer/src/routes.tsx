import React from 'react'
import { AuthRouteConfig } from '@cap/platform-core'
import { Path } from '../../../routes/path'

const ThemeCustomizer = React.lazy(() => import('./components/ThemeCustomizer'))

export const themeCustomizerRouteConfig: AuthRouteConfig[] = [
  {
    path: Path.ThemeEditor,
    element: <ThemeCustomizer />,
    layout: 'admin',
  },
]
