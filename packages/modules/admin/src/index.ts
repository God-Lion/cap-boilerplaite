import type { CAPModule } from '@cap/shared-types'
import { adminRouteConfig, adminRoutes } from './routes/routes'
import { registerDictionary } from './domain-kernel/src/i18n/registry'
import { Path as AdminPath } from './routes/path'
import { AdminDashboardPlugin } from './plugins/AdminDashboardPlugin'
import { ENDPOINTS } from './services/endpoints'
import { QUERY_KEYS } from './services/query'

export { ENDPOINTS, QUERY_KEYS }

import enAdmin from './domain-kernel/src/data/dictionaries/en.json'
import arAdmin from './domain-kernel/src/data/dictionaries/ar.json'
import frAdmin from './domain-kernel/src/data/dictionaries/fr.json'

registerDictionary({ en: enAdmin, ar: arAdmin, fr: frAdmin })

import { getMergedDictionary } from './domain-kernel/src/i18n/registry'

const en = getMergedDictionary('en')
const ar = getMergedDictionary('ar')
const fr = getMergedDictionary('fr')

export * from './modules/dashboard/src'
export * from './modules/theme-customizer/src'
export * from './plugins/AdminDashboardPlugin'

// User Management screens
export {
  UserList,
  AdminUserProfile,
  BanManagement,
  ImpersonationLogs,
  CreateUserDialog,
  DataExport,
  IssueBanDialog,
  ResetPasswordDialog,
  OrganizationListDashboard,
  OrganizationProfile,
  OrganizationInvitationDashboard,
  DomainVerification,
} from './modules/user-management/screens/admin'

// Authorization screens
export {
  RoleList,
  RoleDetailView,
  PermissionRegistry,
  AccessPolicyBuilder,
  MachineIdentityManagement,
} from './modules/authorization/screens'

// Developer console screens
export {
  ApplicationDashboard,
  ApplicationDetailView,
  ScopesRegistry,
  APIExplorerDashboard,
  WebhookManagement,
} from './modules/developer-console/screens/developer'

// SSO screens
export {
  SAMLMetadataDisplay,
  SAMLMetadataBrowser,
  OIDCConfigBrowser,
  OIDCClientCreate,
  OIDCClientEdit,
  SAMLConfigDashboard,
  SSFConfiguration,
  JWKSManagement,
  AuthWaitScreen,
  OIDCLoginPrompt,
  OidcWaitScreen,
  PermissionConsentScreen,
  SAMLSSOInitiation,
  SamlWaitScreen,
  SSOProviderSelection,
} from './modules/sso/screens/sso'

// Provisioning screens
export {
  DirectorySyncDashboard,
  SCIMConfiguration,
  SyncLogsView,
  ConnectorDetailView,
} from './modules/sso/screens/provisioning'

// Monitoring screens
export {
  AdminOverviewDashboard,
  AuthEventsMonitor,
  SystemHealthDashboard,
  ExportAuditTrail,
  EmailTestingDashboard,
  EmailTemplatePreview,
  MFAUsageAnalytics,
} from './modules/monitoring/screens/monitoring'


// Dialog Components
export * from './components/dialogs'

// No longer importing Path from @cap/module-auth for navigation

export const AdminModule: CAPModule = {
  id: 'admin-module',
  version: '1.0.0',
  routes: adminRoutes as any,
  authRouteConfig: adminRouteConfig as any,
  i18n: { en, ar, fr },
  plugins: [AdminDashboardPlugin],
  navItems: [
    // --- OVERVIEW ---
    {
      id: 'admin-overview-section',
      label: 'Overview',
      section: 'Overview',
      variant: ['admin'],
      order: 10,
    },
    {
      id: 'admin-dashboard',
      label: 'Dashboard',
      icon: 'tabler-layout-dashboard',
      path: AdminPath.Dashboard,
      variant: ['admin'],
      order: 20,
    },
    // --- USER MANAGEMENT ---
    {
      id: 'admin-user-mgmt-section',
      label: 'User management',
      section: 'User management',
      variant: ['admin'],
      order: 30,
    },
    {
      id: 'admin-users-all',
      label: 'navigation.userManagement',
      icon: 'tabler-users',
      path: AdminPath.admin.users,
      variant: ['admin'],
      order: 40,
    },
    {
      id: 'admin-bans',
      label: 'Bans & appeals',
      icon: 'tabler-ban',
      path: AdminPath.admin.banManagement,
      variant: ['admin'],
      order: 50,
    },
    {
      id: 'admin-impersonation',
      label: 'Impersonation logs',
      icon: 'tabler-user-search',
      path: AdminPath.admin.impersonationLogs,
      variant: ['admin'],
      order: 60,
    },
    {
      id: 'admin-orgs',
      label: 'navigation.organizations',
      icon: 'tabler-building',
      path: AdminPath.admin.organizations,
      variant: ['admin'],
      order: 70,
    },
    // --- ACCESS CONTROL ---
    {
      id: 'admin-access-section',
      label: 'Access control',
      section: 'Access control',
      variant: ['admin'],
      order: 80,
    },
    {
      id: 'admin-rbac-submenu',
      label: 'navigation.rbac',
      icon: 'tabler-shield-lock',
      variant: ['admin'],
      order: 90,
      children: [
        { id: 'admin-roles', label: 'Roles', path: AdminPath.admin.roles, order: 10 },
        { id: 'admin-permissions', label: 'Permissions', path: AdminPath.admin.permissions, order: 20 },
        { id: 'admin-policies', label: 'Access policies', path: AdminPath.admin.policies, order: 30 },
      ],
    },
    {
      id: 'admin-api-tokens',
      label: 'API tokens',
      icon: 'tabler-key',
      path: AdminPath.admin.apiTokens,
      variant: ['admin'],
      order: 100,
    },
    // --- IDENTITY & SSO ---
    {
      id: 'admin-identity-section',
      label: 'Identity & SSO',
      section: 'Identity & SSO',
      variant: ['admin'],
      order: 110,
    },
    {
      id: 'admin-sso-protocols',
      label: 'SSO protocols',
      icon: 'tabler-topology-star',
      variant: ['admin'],
      order: 120,
      children: [
        { id: 'admin-oidc', label: 'OIDC clients', path: AdminPath.admin.oidcConfigBrowser, order: 10 },
        { id: 'admin-saml', label: 'SAML config', path: AdminPath.admin.samlConfigDashboard, order: 20 },
        { id: 'admin-jwks', label: 'JWKS keys', path: AdminPath.admin.jwksManagement, order: 30 },
        { id: 'admin-ssf', label: 'SSF config', path: AdminPath.admin.ssfConfiguration, order: 40 },
      ],
    },
    {
      id: 'admin-sync-submenu',
      label: 'navigation.provisioning',
      icon: 'tabler-refresh',
      variant: ['admin'],
      order: 130,
      children: [
        { id: 'admin-provisioning', label: 'Connectors', path: AdminPath.admin.provisioning, order: 10 },
        { id: 'admin-scim', label: 'SCIM tokens', path: AdminPath.admin.scim, order: 20 },
        { id: 'admin-sync-logs', label: 'Sync logs', path: AdminPath.admin.syncLogs, order: 30 },
      ],
    },
    // --- DEVELOPER ---
    {
      id: 'admin-dev-section',
      label: 'Developer',
      section: 'Developer',
      variant: ['admin'],
      order: 140,
    },
    {
      id: 'admin-oauth-apps',
      label: 'OAuth apps',
      icon: 'tabler-apps',
      path: AdminPath.admin.applications,
      variant: ['admin'],
      order: 150,
    },
    {
      id: 'admin-scopes',
      label: 'Scopes',
      icon: 'tabler-brackets',
      path: AdminPath.admin.scopes,
      variant: ['admin'],
      order: 160,
    },
    {
      id: 'admin-webhooks',
      label: 'Webhooks',
      icon: 'tabler-webhook',
      path: AdminPath.admin.webhooks,
      variant: ['admin'],
      order: 170,
    },
    {
      id: 'admin-api-explorer',
      label: 'API explorer',
      icon: 'tabler-terminal-2',
      path: AdminPath.admin.apiExplorer,
      variant: ['admin'],
      order: 180,
    },
    // --- MONITORING ---
    {
      id: 'admin-monitor-section',
      label: 'Monitoring',
      section: 'Monitoring',
      variant: ['admin'],
      order: 190,
    },
    {
      id: 'admin-health',
      label: 'navigation.systemHealth',
      icon: 'tabler-heart-rate-monitor',
      path: AdminPath.admin.health,
      variant: ['admin'],
      order: 200,
    },
    {
      id: 'admin-audit',
      label: 'navigation.authEvents',
      icon: 'tabler-activity',
      path: AdminPath.admin.events,
      variant: ['admin'],
      order: 210,
    },
    {
      id: 'admin-mfa-metrics',
      label: 'navigation.mfaAnalytics',
      icon: 'tabler-chart-bar',
      path: AdminPath.monitoring.mfa_analytics,
      variant: ['admin'],
      order: 220,
    },
    {
      id: 'admin-email-testing',
      label: 'Email testing',
      icon: 'tabler-mail-cog',
      path: AdminPath.monitoring.emailTesting,
      variant: ['admin'],
      order: 230,
    },
    {
      id: 'admin-export-audit',
      label: 'Export audit trail',
      icon: 'tabler-file-export',
      path: AdminPath.admin.exportAudit,
      variant: ['admin'],
      order: 240,
    },
  ],
  searchItems: [
    {
      id: 'admin-analytics',
      name: 'Analytics Dashboard',
      url: AdminPath.Dashboard,
      icon: 'tabler-chart-pie',
      section: 'Dashboards',
    },
    {
      id: 'admin-users',
      name: 'User Management',
      url: AdminPath.admin.users,
      icon: 'tabler-users',
      section: 'Administration',
    },
    {
      id: 'admin-roles',
      name: 'Roles & Permissions',
      url: AdminPath.admin.roles,
      icon: 'tabler-lock',
      section: 'Security',
    },
  ],
}
