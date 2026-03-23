import React from 'react'
import { AuthRouteConfig } from '@cap/platform-core/src/assembly'
import Path from '@cap/module-auth/routes/path'
import { createAdminRoute, createAuthRoute } from '../../../routes/routeHelpers'

// ---------------------------------------------------------------------------
// User profile screens
// ---------------------------------------------------------------------------
const ProfileView             = React.lazy(() =>
  import('../screens').then((m) => ({ default: m.ProfileView })),
)
const EditProfile             = React.lazy(() =>
  import('../screens').then((m) => ({ default: m.EditProfile })),
)
const LinkedAccountsDashboard = React.lazy(() =>
  import('../screens').then((m) => ({ default: m.LinkedAccountsDashboard })),
)
const ChangeEmail             = React.lazy(() =>
  import('../screens').then((m) => ({ default: m.ChangeEmail })),
)
const DeleteAccount           = React.lazy(() =>
  import('../screens').then((m) => ({ default: m.DeleteAccount })),
)
const DeactivateAccount       = React.lazy(() =>
  import('../screens').then((m) => ({ default: m.DeactivateAccount })),
)

// ---------------------------------------------------------------------------
// Admin – users
// ---------------------------------------------------------------------------
const UserList        = React.lazy(() => import('../screens/admin/users/UserList'))
const BanManagement   = React.lazy(() => import('../screens/admin/users/BanManagement'))
const ImpersonationLogs = React.lazy(() => import('../screens/admin/users/ImpersonationLogs'))
const AdminUserProfile  = React.lazy(() => import('../screens/admin/users/AdminUserProfile'))

// ---------------------------------------------------------------------------
// Admin – organisations
// ---------------------------------------------------------------------------
const OrganizationListDashboard       = React.lazy(() => import('../screens/admin/organizations/OrganizationListDashboard'))
const OrganizationProfile             = React.lazy(() => import('../screens/admin/organizations/OrganizationProfile'))
const OrganizationInvitationDashboard = React.lazy(() => import('../screens/admin/organizations/OrganizationInvitationDashboard'))

// ---------------------------------------------------------------------------
// Route config
// ---------------------------------------------------------------------------
export const userDirectoryRouteConfig: AuthRouteConfig[] = [
  // --- User profile (verified auth) ---
  createAuthRoute(Path.user.view,           <ProfileView />,             { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.user.edit,           <EditProfile />,             { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.user.changeEmail,    <ChangeEmail />,             { requiresVerification: true }),
  createAuthRoute(Path.user.linkedAccounts, <LinkedAccountsDashboard />, { requiresVerification: true }),
  createAuthRoute(Path.user.delete,         <DeleteAccount />,           { requiresVerification: true }),
  createAuthRoute(Path.user.deactivate,     <DeactivateAccount />,       { requiresVerification: true }),
  createAuthRoute(Path.user.emailChangeStatus,    <ChangeEmail />,       { requiresVerification: true }),
  createAuthRoute(Path.user.initiateEmailChange,  <ChangeEmail />,       { requiresVerification: true, layout: 'noLayout' }),

  // --- Admin users ---
  createAdminRoute(Path.admin.users,             <UserList />),
  createAdminRoute(Path.admin.userProfile,       <AdminUserProfile />),
  createAdminRoute(Path.admin.banManagement,     <BanManagement />),
  createAdminRoute(Path.admin.impersonationLogs, <ImpersonationLogs />),

  // --- Admin organisations ---
  createAdminRoute(Path.admin.organizations,       <OrganizationListDashboard />),
  createAdminRoute(Path.admin.organizationProfile, <OrganizationProfile />),
  createAdminRoute(Path.admin.invitations,         <OrganizationInvitationDashboard />),
]

