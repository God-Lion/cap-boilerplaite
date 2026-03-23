import React from 'react'
import { AuthRouteConfig } from '@cap/platform-core/src/assembly'
import Path from '../screens/path'
import { createAdminRoute, createAuthRoute } from '../../../routes/routeHelpers'

// ---------------------------------------------------------------------------
// Roles & Permissions
// ---------------------------------------------------------------------------
const RoleList            = React.lazy(() => import('../screens/roles/RoleList'))
const RoleDetailView      = React.lazy(() => import('../screens/roles/RoleDetailView'))
const PermissionRegistry  = React.lazy(() => import('../screens/roles/PermissionRegistry'))
const AccessPolicyBuilder = React.lazy(() => import('../screens/roles/AccessPolicyBuilder'))

// ---------------------------------------------------------------------------
// API Tokens
// ---------------------------------------------------------------------------
const APITokensDashboard           = React.lazy(() => import('../screens/api-tokens/APITokensDashboard'))
const CreateAPITokenBasicInfo      = React.lazy(() => import('../screens/api-tokens/CreateAPITokenBasicInfo'))
const CreateAPITokenIPRestrictions = React.lazy(() => import('../screens/api-tokens/CreateAPITokenIPRestrictions'))
const APITokenDetails              = React.lazy(() => import('../screens/api-tokens/APITokenDetails'))
const APITokenDisplayUsage         = React.lazy(() => import('../screens/api-tokens/APITokenDisplayUsage'))
const APITokenActions              = React.lazy(() => import('../screens/api-tokens/APITokenActions'))
const APITokenSecurityWarning      = React.lazy(() => import('../screens/api-tokens/APITokenSecurityWarning'))
const MachineIdentityManagement    = React.lazy(() => import('../screens/api-tokens/MachineIdentityManagement'))
const DomainVerification           = React.lazy(() => import('../../user-directory/screens/admin/organizations/DomainVerification'))

// ---------------------------------------------------------------------------
// Route config
// ---------------------------------------------------------------------------
export const authorizationEngineRouteConfig: AuthRouteConfig[] = [
  // --- Roles & Permissions (admin) ---
  createAdminRoute(Path.roles,       <RoleList />),
  createAdminRoute(Path.roleDetail,  <RoleDetailView />),
  createAdminRoute(Path.permissions, <PermissionRegistry />),
  createAdminRoute(Path.policies,    <AccessPolicyBuilder />),

  // --- API Tokens (verified auth) ---
  createAuthRoute(Path.dashboard,          <APITokensDashboard />,           { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.createBasic,        <CreateAPITokenBasicInfo />,      { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.createRestrictions, <CreateAPITokenIPRestrictions />, { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.details,            <APITokenDetails />,              { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.display,            <APITokenDisplayUsage />,         { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.actions,            <APITokenActions />,              { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.securityWarning,    <APITokenSecurityWarning />,      { requiresVerification: true, layout: 'admin' }),

  createAdminRoute(Path.machineIdentities, <MachineIdentityManagement />),
  createAdminRoute(Path.domainVerification, <DomainVerification />),
]

