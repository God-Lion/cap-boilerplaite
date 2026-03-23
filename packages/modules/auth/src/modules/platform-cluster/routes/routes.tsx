import React from 'react'
import { AuthRouteConfig } from '@cap/platform-core/src/assembly'
import { createAdminRoute } from '../../../routes/routeHelpers'

// ---------------------------------------------------------------------------
// System error/status pages  (no auth required — public fallback pages)
// Using canonical paths from the root path registry to avoid drift.
// ---------------------------------------------------------------------------
import { Path } from '../../../routes/path'

const Page401Unauthorized    = React.lazy(() => import('../screens/system/Page401Unauthorized'))
const MaintenanceScreen      = React.lazy(() => import('../screens/system/MaintenanceScreen'))
const Page429TooManyRequests = React.lazy(() => import('../screens/system/Page429TooManyRequests'))
const CsrfErrorScreen        = React.lazy(() => import('../screens/system/CsrfErrorScreen'))
const BrowserNotSupported    = React.lazy(() => import('../screens/system/BrowserNotSupported'))
const Page403Forbidden       = React.lazy(() => import('../screens/system/Page403Forbidden'))

// ---------------------------------------------------------------------------
// Monitoring – admin
// ---------------------------------------------------------------------------
const AdminOverviewDashboard = React.lazy(() => import('../screens/monitoring/AdminOverviewDashboard'))
const SystemHealthDashboard  = React.lazy(() => import('../screens/monitoring/SystemHealthDashboard'))
const EmailTestingDashboard  = React.lazy(() => import('../screens/monitoring/EmailTestingDashboard'))
const EmailTemplatePreview   = React.lazy(() => import('../screens/monitoring/EmailTemplatePreview'))
const AuthEventsMonitor      = React.lazy(() => import('../screens/monitoring/AuthEventsMonitor'))
const MFAUsageAnalytics      = React.lazy(() => import('../screens/monitoring/MFAUsageAnalytics'))
const ExportAuditTrail       = React.lazy(() => import('../screens/monitoring/ExportAuditTrail'))

// ---------------------------------------------------------------------------
// Developer tools – admin
// ---------------------------------------------------------------------------
const ApplicationDashboard  = React.lazy(() => import('../screens/developer/ApplicationDashboard'))
const ApplicationDetailView = React.lazy(() => import('../screens/developer/ApplicationDetailView'))
const ScopesRegistry        = React.lazy(() => import('../screens/developer/ScopesRegistry'))
const APIExplorerDashboard  = React.lazy(() => import('../screens/developer/APIExplorerDashboard'))
const WebhookManagement     = React.lazy(() => import('../screens/developer/WebhookManagement'))

// ---------------------------------------------------------------------------
// Route config
// ---------------------------------------------------------------------------
export const platformClusterRouteConfig: AuthRouteConfig[] = [
  // --- System pages (public, noLayout) ---
  { path: Path.auth.unauthorized401,     element: <Page401Unauthorized />,    layout: 'noLayout' },
  { path: Path.auth.maintenance,         element: <MaintenanceScreen />,      layout: 'noLayout' },
  { path: Path.auth.tooManyRequests429,  element: <Page429TooManyRequests />, layout: 'noLayout' },
  { path: Path.auth.csrfError,           element: <CsrfErrorScreen />,        layout: 'noLayout' },
  { path: Path.auth.browserNotSupported, element: <BrowserNotSupported />,    layout: 'noLayout' },
  { path: Path.auth.forbidden403,        element: <Page403Forbidden />,       layout: 'noLayout' },

  // --- Monitoring (admin) ---
  createAdminRoute(Path.admin.overview,       <AdminOverviewDashboard />),
  createAdminRoute(Path.admin.events,              <AuthEventsMonitor />),
  createAdminRoute(Path.admin.health,              <SystemHealthDashboard />),
  createAdminRoute(Path.admin.exportAudit,         <ExportAuditTrail />),
  createAdminRoute(Path.monitoring.emailTesting,         <EmailTestingDashboard />),
  createAdminRoute(Path.monitoring.emailTemplatePreview, <EmailTemplatePreview />),
  createAdminRoute(Path.monitoring.mfa_analytics,        <MFAUsageAnalytics />),

  // --- Developer tools (admin) ---
  createAdminRoute(Path.admin.applications, <ApplicationDashboard />),
  createAdminRoute(Path.admin.appDetail,    <ApplicationDetailView />),
  createAdminRoute(Path.admin.scopes,       <ScopesRegistry />),
  createAdminRoute(Path.admin.apiExplorer,  <APIExplorerDashboard />),
  createAdminRoute(Path.admin.webhooks,     <WebhookManagement />),
]
