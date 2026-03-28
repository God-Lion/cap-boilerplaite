import React from 'react'
import { AuthRouteConfig } from '@cap/platform-core/src/assembly'
import { Path } from '../../../routes/path'

const Page401Unauthorized    = React.lazy(() => import('../screens/system/Page401Unauthorized'))
const MaintenanceScreen      = React.lazy(() => import('../screens/system/MaintenanceScreen'))
const Page429TooManyRequests = React.lazy(() => import('../screens/system/Page429TooManyRequests'))
const CsrfErrorScreen        = React.lazy(() => import('../screens/system/CsrfErrorScreen'))
const BrowserNotSupported    = React.lazy(() => import('../screens/system/BrowserNotSupported'))
const Page403Forbidden       = React.lazy(() => import('../screens/system/Page403Forbidden'))

export const platformClusterRouteConfig: AuthRouteConfig[] = [
  // --- System pages (public, noLayout) ---
  { path: Path.auth.unauthorized401,     element: <Page401Unauthorized />,    layout: 'noLayout' },
  { path: Path.auth.maintenance,         element: <MaintenanceScreen />,      layout: 'noLayout' },
  { path: Path.auth.tooManyRequests429,  element: <Page429TooManyRequests />, layout: 'noLayout' },
  { path: Path.auth.csrfError,           element: <CsrfErrorScreen />,        layout: 'noLayout' },
  { path: Path.auth.browserNotSupported, element: <BrowserNotSupported />,    layout: 'noLayout' },
  { path: Path.auth.forbidden403,        element: <Page403Forbidden />,       layout: 'noLayout' },
]
