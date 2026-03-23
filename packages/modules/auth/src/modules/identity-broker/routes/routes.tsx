import React from 'react'
import { AuthRouteConfig } from '@cap/platform-core/src/assembly'
import Path from '../screens/path'
import { createAdminRoute } from '../../../routes/routeHelpers'

// ---------------------------------------------------------------------------
// SSO – public / wait screens
// ---------------------------------------------------------------------------
const OidcWaitScreen          = React.lazy(() => import('../screens/sso/OidcWaitScreen'))
const SamlWaitScreen          = React.lazy(() => import('../screens/sso/SamlWaitScreen'))
const AuthWaitScreen          = React.lazy(() => import('../screens/sso/AuthWaitScreen'))
const PermissionConsentScreen = React.lazy(() => import('../screens/sso/PermissionConsentScreen'))
const OIDCLoginPrompt         = React.lazy(() => import('../screens/sso/OIDCLoginPrompt'))
const SSOProviderSelection    = React.lazy(() => import('../screens/sso/SSOProviderSelection'))
const SAMLSSOInitiation       = React.lazy(() => import('../screens/sso/SAMLSSOInitiation'))

// ---------------------------------------------------------------------------
// SSO – admin config
// ---------------------------------------------------------------------------
const SAMLMetadataDisplay  = React.lazy(() => import('../screens/sso/SAMLMetadataDisplay'))
const SAMLMetadataBrowser  = React.lazy(() => import('../screens/sso/SAMLMetadataBrowser'))
const OIDCConfigBrowser    = React.lazy(() => import('../screens/sso/OIDCConfigBrowser'))
const OIDCClientCreate     = React.lazy(() => import('../screens/sso/OIDCClientCreate'))
const OIDCClientEdit       = React.lazy(() => import('../screens/sso/OIDCClientEdit'))
const SAMLConfigDashboard  = React.lazy(() => import('../screens/sso/SAMLConfigDashboard'))
const SSFConfiguration     = React.lazy(() => import('../screens/sso/SSFConfiguration'))
const JWKSManagement       = React.lazy(() => import('../screens/sso/JWKSManagement'))

// ---------------------------------------------------------------------------
// Provisioning – admin
// ---------------------------------------------------------------------------
const DirectorySyncDashboard = React.lazy(() => import('../screens/provisioning/DirectorySyncDashboard'))
const SCIMConfiguration      = React.lazy(() => import('../screens/provisioning/SCIMConfiguration'))
const SyncLogsView           = React.lazy(() => import('../screens/provisioning/SyncLogsView'))
const ConnectorDetailView    = React.lazy(() => import('../screens/provisioning/ConnectorDetailView'))

// ---------------------------------------------------------------------------
// Route config
// ---------------------------------------------------------------------------
export const identityBrokerRouteConfig: AuthRouteConfig[] = [
  // --- SSO public flows ---
  { path: Path.permissionConsent, element: <PermissionConsentScreen />, layout: 'noLayout' },
  { path: Path.oidcLoginPrompt,   element: <OIDCLoginPrompt />,         layout: 'noLayout' },
  { path: Path.providerSelection, element: <SSOProviderSelection />,    layout: 'noLayout' },
  { path: Path.authWait,          element: <AuthWaitScreen />,          layout: 'noLayout' },
  { path: Path.oidcWait,          element: <OidcWaitScreen />,          layout: 'noLayout' },
  { path: Path.samlWait,          element: <SamlWaitScreen />,          layout: 'noLayout' },
  { path: Path.samlSSOInitiation, element: <SAMLSSOInitiation />,       layout: 'noLayout' },

  // --- SSO admin config ---
  createAdminRoute(Path.samlMetadataDisplay, <SAMLMetadataDisplay />),
  createAdminRoute(Path.samlMetadataBrowser, <SAMLMetadataBrowser />),
  createAdminRoute(Path.oidcConfigBrowser,   <OIDCConfigBrowser />),
  createAdminRoute(Path.oidcClientCreate,    <OIDCClientCreate />),
  createAdminRoute(Path.oidcClientEdit,      <OIDCClientEdit />),
  createAdminRoute(Path.samlConfigDashboard, <SAMLConfigDashboard />),
  createAdminRoute(Path.ssfConfiguration,    <SSFConfiguration />),
  createAdminRoute(Path.jwksManagement,      <JWKSManagement />),

  // --- Provisioning admin ---
  createAdminRoute(Path.provisioning,    <DirectorySyncDashboard />),
  createAdminRoute(Path.scim,            <SCIMConfiguration />),
  createAdminRoute(Path.syncLogs,        <SyncLogsView />),
  createAdminRoute(Path.connectorDetail, <ConnectorDetailView />),
]

