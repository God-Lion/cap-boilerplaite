import React, { lazy } from 'react'
import { Route } from 'react-router-dom'
import { AuthRouteConfig } from '@cap/platform-core'
import { 
  AdminRoute, 
  UserList, AdminUserProfile, BanManagement, ImpersonationLogs,
  OrganizationListDashboard, OrganizationProfile, OrganizationInvitationDashboard,
  RoleList, RoleDetailView, PermissionRegistry, AccessPolicyBuilder,
  MachineIdentityManagement, DomainVerification,
  AdminOverviewDashboard, AuthEventsMonitor, SystemHealthDashboard, ExportAuditTrail,
  EmailTestingDashboard, EmailTemplatePreview, MFAUsageAnalytics,
  ApplicationDashboard, ApplicationDetailView, ScopesRegistry, APIExplorerDashboard, WebhookManagement,
  SAMLMetadataDisplay, SAMLMetadataBrowser, OIDCConfigBrowser, OIDCClientCreate, OIDCClientEdit,
  SAMLConfigDashboard, SSFConfiguration, JWKSManagement, DirectorySyncDashboard,
  SCIMConfiguration, SyncLogsView, ConnectorDetailView
} from '@cap/module-auth'
import { Path } from './path'

const Dashboard = lazy(() => import('../modules/dashboard/src'))
const ThemeEditor = lazy(() => import('../modules/theme-customizer/src'))

// Helper to create admin-guarded routes locally
const admin = (path: string, element: React.ReactNode): AuthRouteConfig => ({
  path,
  element: <AdminRoute element={element} layout="admin" />,
})

export const adminRouteConfig: AuthRouteConfig[] = [
  // Core Admin Screens (Owned by this module)
  {
    path: Path.Dashboard,
    element: <Dashboard />,
  },
  {
    path: Path.ThemeEditor,
    element: <ThemeEditor />,
  },

  // --- Identity & Access Management (Centralized from Auth) ---
  admin(Path.admin.users,             <UserList />),
  admin(Path.admin.userProfile,       <AdminUserProfile />),
  admin(Path.admin.banManagement,     <BanManagement />),
  admin(Path.admin.impersonationLogs, <ImpersonationLogs />),

  admin(Path.admin.organizations,       <OrganizationListDashboard />),
  admin(Path.admin.organizationProfile, <OrganizationProfile />),
  admin(Path.admin.invitations,         <OrganizationInvitationDashboard />),

  admin(Path.admin.roles,       <RoleList />),
  admin(Path.admin.roleDetail,  <RoleDetailView />),
  admin(Path.admin.permissions, <PermissionRegistry />),
  admin(Path.admin.policies,    <AccessPolicyBuilder />),

  admin(Path.admin.applications, <ApplicationDashboard />),
  admin(Path.admin.appDetail,    <ApplicationDetailView />),
  admin(Path.admin.scopes,       <ScopesRegistry />),
  admin(Path.admin.apiExplorer,  <APIExplorerDashboard />),
  admin(Path.admin.webhooks,     <WebhookManagement />),

  // --- Platform & SSO ---
  admin(Path.admin.overview,  <AdminOverviewDashboard />),
  admin(Path.admin.events,    <AuthEventsMonitor />),
  admin(Path.admin.health,    <SystemHealthDashboard />),
  admin(Path.admin.exportAudit, <ExportAuditTrail />),

  admin(Path.admin.provisioning, <DirectorySyncDashboard />),
  admin(Path.admin.scim,         <SCIMConfiguration />),
  admin(Path.admin.syncLogs,     <SyncLogsView />),
  admin(Path.admin.connectorDetail, <ConnectorDetailView />),

  // Monitoring
  admin(Path.monitoring.emailTesting,         <EmailTestingDashboard />),
  admin(Path.monitoring.emailTemplatePreview, <EmailTemplatePreview />),
  admin(Path.monitoring.mfa_analytics,        <MFAUsageAnalytics />),

  // SSO Configuration
  admin(Path.admin.samlMetadataDisplay, <SAMLMetadataDisplay />),
  admin(Path.admin.samlMetadataBrowser, <SAMLMetadataBrowser />),
  admin(Path.admin.oidcConfigBrowser,   <OIDCConfigBrowser />),
  admin(Path.admin.oidcClientCreate,    <OIDCClientCreate />),
  admin(Path.admin.oidcClientEdit,      <OIDCClientEdit />),
  admin(Path.admin.samlConfigDashboard, <SAMLConfigDashboard />),
  admin(Path.admin.ssfConfiguration,    <SSFConfiguration />),
  admin(Path.admin.jwksManagement,      <JWKSManagement />),
]

export const adminRoutes: React.FC = () => (
  <>
    {adminRouteConfig.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}
  </>
)
