import React from 'react'
import { AuthRouteConfig } from '@cap/platform-core'
import { Path } from '../../../routes/path'

const Dashboard = React.lazy(() => import('./components/Dashboard'))

export const dashboardRouteConfig: AuthRouteConfig[] = [
  {
    path: Path.Admin,
    element: <Dashboard />,
    layout: 'admin',
  },
]
