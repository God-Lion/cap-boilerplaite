import React from 'react'
import { Routes, Route, RoutesProps } from 'react-router-dom'
import { AuthRouteConfig } from '@cap/platform-core/src/assembly'
import { Roles, useAppStore } from '@cap/platform-core'

// Middleware
import { AdminRoute, GuestRoute, AuthRoute } from '../middlewares'
import {
  Path,
  AccountOverview,
  ProfileView,
  EditProfile,
  ChangeEmail,
  ChangePassword,
  DeleteAccount,
  DeactivateAccount,
  MFASetupInitiation,
  MFAVerificationTest,
  MFABackupCodes,
  MFAVerificationSuccess,
  MFAManagement,
  MFADashboard,
  MFABackupCodeEntry,
  AddMFAMethod,
  SecurityKeyManagement,
  PasskeyRegistrationPrompt,
  PasskeyManagement,
  PasskeyRecoveryOptions,
  PasskeyUsageStats,
  PasskeyCreationOptions,
  PasskeyLoginOption,
  PasskeyNamingConfig,
  PlatformAuthLogin,
  PlatformAuthRegister,
  PasswordlessVerification,
  RegistrationSuccess,
  VerificationEmail,
  EmailVerification,
  ResetPassword,
  PasswordResetSuccess,
  SignIn,
  ForgotPassword,
  SignInV2,
  LoginScreen,
  RegistrationScreen,
  CheckEmailConfirmation,
  EmailVerificationScreen,
  VerificationLinkExpired,
  SetNewPasswordScreen,
  OidcWaitScreen,
  SamlWaitScreen,
  Page401Unauthorized,
  MaintenanceScreen,
  Page429TooManyRequests,
  CsrfErrorScreen,
  AdminSystemHealthDashboard,
  APITokensDashboard,
  CreateAPITokenBasicInfo,
  CreateAPITokenIPRestrictions,
  APITokenDetails,
  APITokenDisplayUsage,
  APITokenActions,
  APITokenSecurityWarning,
  UserSecurityStatus,
  InitiateEmailChange,
  RequestEmailChange,
  LinkedAccountsDashboard,
  ActiveSessionsManagement,
  EmailChangeStatusDashboard,
  UserActivityTimeline,
  DeviceVerification,
  EmailChangeVerificationPending,
  EmailChangeVerification,
  EmailChangeSuccess,
  EmailChangeFailed,
  EmailVerifiedSuccess,
  MFAVerificationScreen,
  ExportVerification,
  AdminEmailTestingDashboard,
  AdminEmailTemplatePreview,
  UserList,
  BanManagement,
  ImpersonationLogs,
  AdminUserProfile,
  AdminAuthEventsMonitor,
  ExportAuditTrail,
  AdminMFAUsageAnalytics,
  OrganizationListDashboard,
  OrganizationProfile,
  RoleList,
  RoleDetailView,
  PermissionRegistry,
  PermissionConsentScreen,
  OIDCLoginPrompt,
  SAMLMetadataDisplay,
  SAMLMetadataBrowser,
  OIDCConfigBrowser,
  OIDCClientCreate,
  OIDCClientEdit,
  SAMLConfigDashboard,
  SSFConfiguration,
  JWKSManagement,
  SSOProviderSelection,
  AuthWaitScreen,
  DeviceCodeDisplay,
  BrowserNotSupported,
  Page403Forbidden,
  AdminLoginScreen,
  SAMLSSOInitiation,
  OrganizationInvitationDashboard,
  AccessPolicyBuilder,
  ApplicationDashboard,
  ApplicationDetailView,
  ScopesRegistry,
  APIExplorerDashboard,
  DirectorySyncDashboard,
  SCIMConfiguration,
  SyncLogsView,
  ConnectorDetailView,
  JoinOrganization,
  WebhookManagement,
} from '../screens'

import SignUp from '../screens/auth/signup/SignUp'
import SignUpV2 from '../screens/auth/signup/SignUpV2'

const adminRouteConfig: Array<AuthRouteConfig> = [
  {
    path: Path.admin.users,
    element: <AdminRoute element={<UserList />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: Path.admin.userProfile,
    element: <AdminRoute element={<AdminUserProfile />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: Path.admin.banManagement,
    element: <AdminRoute element={<BanManagement />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: Path.admin.impersonationLogs,
    element: (
      <AdminRoute element={<ImpersonationLogs />} minimumRole={Roles.ADMIN} layout='admin' />
    ),
  },
  {
    path: Path.admin.organizations,
    element: (
      <AdminRoute
        element={<OrganizationListDashboard />}
        minimumRole={Roles.ADMIN}
        layout='admin'
      />
    ),
  },
  {
    path: Path.admin.organizationProfile,
    element: (
      <AdminRoute element={<OrganizationProfile />} minimumRole={Roles.ADMIN} layout='admin' />
    ),
  },

  {
    path: Path.admin.invitations,
    element: (
      <AdminRoute
        element={<OrganizationInvitationDashboard />}
        minimumRole={Roles.ADMIN}
        layout='admin'
      />
    ),
  },

  {
    path: Path.admin.roles,
    element: <AdminRoute element={<RoleList />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: Path.admin.roleDetail,
    element: <AdminRoute element={<RoleDetailView />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: Path.admin.permissions,
    element: (
      <AdminRoute element={<PermissionRegistry />} minimumRole={Roles.ADMIN} layout='admin' />
    ),
  },

  {
    path: Path.admin.policies,
    element: (
      <AdminRoute element={<AccessPolicyBuilder />} minimumRole={Roles.ADMIN} layout='admin' />
    ),
  },
  {
    path: Path.admin.applications,
    element: (
      <AdminRoute element={<ApplicationDashboard />} minimumRole={Roles.ADMIN} layout='admin' />
    ),
  },
  {
    path: Path.admin.appDetail,
    element: (
      <AdminRoute element={<ApplicationDetailView />} minimumRole={Roles.ADMIN} layout='admin' />
    ),
  },
  {
    path: Path.admin.scopes,
    element: <AdminRoute element={<ScopesRegistry />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: Path.admin.apiExplorer,
    element: (
      <AdminRoute element={<APIExplorerDashboard />} minimumRole={Roles.ADMIN} layout='admin' />
    ),
  },
  {
    path: Path.admin.webhooks,
    element: (
      <AdminRoute element={<WebhookManagement />} minimumRole={Roles.ADMIN} layout='admin' />
    ),
  },
  {
    path: Path.admin.provisioning,
    element: (
      <AdminRoute element={<DirectorySyncDashboard />} minimumRole={Roles.ADMIN} layout='admin' />
    ),
  },
  {
    path: Path.admin.scim,
    element: (
      <AdminRoute element={<SCIMConfiguration />} minimumRole={Roles.ADMIN} layout='admin' />
    ),
  },
  {
    path: Path.admin.syncLogs,
    element: <AdminRoute element={<SyncLogsView />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: Path.admin.connectorDetail,
    element: (
      <AdminRoute element={<ConnectorDetailView />} minimumRole={Roles.ADMIN} layout='admin' />
    ),
  },
]

const apiTokenRouteConfig: Array<AuthRouteConfig> = [
  {
    path: Path.apiTokens.dashboard,
    element: <AuthRoute element={<APITokensDashboard />} requiresVerification layout='admin' />,
  },
  {
    path: Path.apiTokens.createBasic,
    element: (
      <AuthRoute element={<CreateAPITokenBasicInfo />} requiresVerification layout='admin' />
    ),
  },
  {
    path: Path.apiTokens.createRestrictions,
    element: (
      <AuthRoute element={<CreateAPITokenIPRestrictions />} requiresVerification layout='admin' />
    ),
  },
  {
    path: Path.apiTokens.details,
    element: <AuthRoute element={<APITokenDetails />} requiresVerification layout='admin' />,
  },
  {
    path: Path.apiTokens.display,
    element: <AuthRoute element={<APITokenDisplayUsage />} requiresVerification layout='admin' />,
  },
  {
    path: Path.apiTokens.actions,
    element: <AuthRoute element={<APITokenActions />} requiresVerification layout='admin' />,
  },
  {
    path: Path.apiTokens.securityWarning,
    element: (
      <AuthRoute element={<APITokenSecurityWarning />} requiresVerification layout='admin' />
    ),
  },
]

const ssoRouteConfig: Array<AuthRouteConfig> = [
  // SSO & Protocols
  {
    path: Path.auth.permissionConsent,
    element: <PermissionConsentScreen />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.oidcLoginPrompt,
    element: <OIDCLoginPrompt />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.providerSelection,
    element: <SSOProviderSelection />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.authWait,
    element: <AuthWaitScreen />,
    layout: 'noLayout',
  },

  // SSO Administrative (Protected - usually Admin only)
  {
    path: Path.auth.samlMetadataDisplay,
    element: <AdminRoute element={<SAMLMetadataDisplay />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: Path.auth.samlMetadataBrowser,
    element: <AdminRoute element={<SAMLMetadataBrowser />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: Path.auth.oidcConfigBrowser,
    element: <AdminRoute element={<OIDCConfigBrowser />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: (Path.auth as any).oidcClientCreate, // Cast due to type inference lag
    element: <AdminRoute element={<OIDCClientCreate />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: (Path.auth as any).oidcClientEdit,
    element: <AdminRoute element={<OIDCClientEdit />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: Path.auth.samlConfigDashboard,
    element: <AdminRoute element={<SAMLConfigDashboard />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: Path.auth.ssfConfiguration,
    element: <AdminRoute element={<SSFConfiguration />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
  {
    path: (Path.auth as any).jwksManagement,
    element: <AdminRoute element={<JWKSManagement />} minimumRole={Roles.ADMIN} layout='admin' />,
  },
]

const accountRouteConfig: Array<AuthRouteConfig> = [
  {
    path: Path.account.overview,
    element: <AuthRoute element={<AccountOverview />} requiresVerification layout='admin' />,
  },
  {
    path: Path.account.view,
    element: <AuthRoute element={<ProfileView />} requiresVerification layout='admin' />,
  },
  {
    path: Path.account.edit,
    element: <AuthRoute element={<EditProfile />} requiresVerification layout='admin' />,
  },
  {
    path: Path.account.changeEmail,
    element: <AuthRoute element={<ChangeEmail />} requiresVerification layout='admin' />,
  },
  {
    path: Path.account.changePassword,
    element: <AuthRoute element={<ChangePassword />} />,
  },
  {
    path: Path.account.delete,
    element: <AuthRoute element={<DeleteAccount />} requiresVerification />,
  },
  {
    path: Path.account.deactivate,
    element: <AuthRoute element={<DeactivateAccount />} requiresVerification />,
  },
  {
    path: Path.account.linkedAccounts,
    element: <AuthRoute element={<LinkedAccountsDashboard />} requiresVerification />,
  },
  {
    path: Path.account.activeSessions,
    element: <AuthRoute element={<ActiveSessionsManagement />} requiresVerification />,
  },
  {
    path: Path.account.emailChangeStatus,
    element: <AuthRoute element={<EmailChangeStatusDashboard />} requiresVerification />,
  },
  {
    path: Path.account.activityTimeline,
    element: <AuthRoute element={<UserActivityTimeline />} requiresVerification />,
  },
  {
    path: Path.account.deviceVerification,
    element: <AuthRoute element={<DeviceVerification />} requiresVerification />,
  },
  {
    path: Path.account.securityStatus,
    element: <AuthRoute element={<UserSecurityStatus />} requiresVerification layout='admin' />,
  },
  {
    path: Path.account.initiateEmailChange,
    element: <AuthRoute element={<InitiateEmailChange />} requiresVerification />,
  },
  {
    path: Path.account.requestEmailChange,
    element: <AuthRoute element={<RequestEmailChange />} requiresVerification />,
  },
]

const emailVerificationRouteConfig: Array<AuthRouteConfig> = [
  {
    path: Path.auth.emailChangeVerificationPending,
    element: <AuthRoute element={<EmailChangeVerificationPending />} layout='noLayout' />,
  },
  {
    path: Path.auth.emailChangeVerification,
    element: <EmailChangeVerification />,
  },
  {
    path: Path.auth.emailChangeSuccess,
    element: <EmailChangeSuccess />,
  },
  {
    path: Path.auth.emailChangeFailed,
    element: <EmailChangeFailed />,
  },
  {
    path: Path.auth.emailVerifiedSuccess,
    element: <EmailVerifiedSuccess />,
  },
  {
    path: Path.auth.mfaVerification,
    element: <AuthRoute element={<MFAVerificationScreen />} layout='noLayout' />,
  },
  {
    path: Path.auth.exportVerification,
    element: <AuthRoute element={<ExportVerification />} layout='noLayout' />,
  },
]

const mfaRouteConfig: Array<AuthRouteConfig> = [
  {
    path: Path.mfa.setup,
    element: <AuthRoute element={<MFASetupInitiation />} layout='noLayout' />,
  },
  { path: Path.mfa.verification, element: <MFAVerificationTest /> },
  {
    path: Path.mfa.backup_codes,
    element: <AuthRoute element={<MFABackupCodes />} />,
    // layout: 'noLayout',
  },
  {
    path: Path.mfa.verification_success,
    element: <AuthRoute element={<MFAVerificationSuccess />} />,
    // layout: 'noLayout',
  },
  //
  {
    path: Path.mfa.management,
    element: <AuthRoute element={<MFAManagement />} />,
  },
  {
    path: Path.mfa.dashboard,
    element: <AuthRoute element={<MFADashboard />} />,
  },
  {
    path: Path.mfa.backup_entry,
    element: <MFABackupCodeEntry />,
    layout: 'noLayout',
  },
  {
    path: Path.mfa.add_method,
    element: <AuthRoute element={<AddMFAMethod />} />,
  },
  {
    path: Path.mfa.security_keys,
    element: <AuthRoute element={<SecurityKeyManagement />} />,
  },
]

const passkeyRouteConfig: Array<AuthRouteConfig> = [
  // Passkeys
  {
    path: Path.passkey.setup,
    element: <AuthRoute element={<PasskeyRegistrationPrompt />} />,
  },
  {
    path: Path.passkey.management,
    element: <AuthRoute element={<PasskeyManagement />} />,
  },
  {
    path: Path.passkey.recovery,
    element: <AuthRoute element={<PasskeyRecoveryOptions />} />,
  },
  {
    path: Path.passkey.usage_stats,
    element: <AdminRoute element={<PasskeyUsageStats />} minimumRole={Roles.ADMIN} />,
  },
  {
    path: Path.passkey.creation_options,
    element: <AuthRoute element={<PasskeyCreationOptions />} />,
  },
  {
    path: Path.passkey.login,
    element: <PasskeyLoginOption />,
    layout: 'noLayout',
  },
  {
    path: Path.passkey.naming_config,
    element: <AuthRoute element={<PasskeyNamingConfig />} />,
  },
  {
    path: Path.passkey.platform_login,
    element: <PlatformAuthLogin />,
    layout: 'noLayout',
  },
  {
    path: Path.passkey.platform_register,
    element: <AuthRoute element={<PlatformAuthRegister />} />,
  },
]

const passwordlessRouteConfig: Array<AuthRouteConfig> = [
  // Passwordless
  {
    path: Path.passwordless.setup,
    element: <AuthRoute element={<PasswordlessVerification />} />,
    //  layout: 'noLayout'
  },
  {
    path: Path.passwordless.verification,
    element: <PasswordlessVerification />,
  },
]

const monitoringRouteConfig: Array<AuthRouteConfig> = [
  {
    path: Path.admin.events,
    element: <AdminRoute element={<AdminAuthEventsMonitor />} minimumRole={Roles.ADMIN} />,
  },
  {
    path: Path.admin.health,
    element: <AdminRoute element={<AdminSystemHealthDashboard />} minimumRole={Roles.ADMIN} />,
  },
  {
    path: Path.monitoring.emailTesting,
    element: <AdminRoute element={<AdminEmailTestingDashboard />} minimumRole={Roles.ADMIN} />,
  },
  {
    path: Path.monitoring.emailTemplatePreview,
    element: <AdminRoute element={<AdminEmailTemplatePreview />} minimumRole={Roles.ADMIN} />,
  },
  {
    path: Path.monitoring.mfa_analytics,
    element: <AdminRoute element={<AdminMFAUsageAnalytics />} minimumRole={Roles.ADMIN} />,
  },
  {
    path: Path.admin.exportAudit,
    element: <AdminRoute element={<ExportAuditTrail />} minimumRole={Roles.ADMIN} />,
  },
]

export const authRouteConfig: Array<AuthRouteConfig> = [
  ...adminRouteConfig,
  ...apiTokenRouteConfig,
  ...ssoRouteConfig,
  ...monitoringRouteConfig,
  ...accountRouteConfig,
  ...mfaRouteConfig,
  ...passkeyRouteConfig,
  ...passwordlessRouteConfig,
  ...emailVerificationRouteConfig,

  // Sign In
  {
    path: Path.auth.signin,
    element: <SignIn />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.signinV2,
    element: <GuestRoute element={<SignInV2 />} />,
    layout: 'noLayout',
  },
  { path: Path.auth.registrationSuccess, element: <RegistrationSuccess />, layout: 'noLayout' },

  // Sign Up
  {
    path: Path.auth.signup,
    element: <GuestRoute element={<SignUp />} />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.signupV2,
    element: <GuestRoute element={<SignUpV2 />} />,
    layout: 'noLayout',
  },
  { path: Path.auth.emailVerification, element: <EmailVerification />, layout: 'noLayout' },
  { path: Path.auth.verifyEmail, element: <VerificationEmail />, layout: 'noLayout' },

  {
    path: Path.auth.forgotPassword,
    element: <GuestRoute element={<ForgotPassword />} />,
    layout: 'noLayout',
  },
  { path: Path.auth.resetPassword, element: <GuestRoute element={<ResetPassword />} /> },
  { path: Path.auth.passwordResetSuccess, element: <PasswordResetSuccess /> },

  // New Auth Flow Screens
  {
    path: Path.auth.login,
    element: <GuestRoute element={<LoginScreen />} />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.registration,
    element: <GuestRoute element={<RegistrationScreen />} />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.checkEmail,
    element: <CheckEmailConfirmation />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.verifyEmail,
    element: <EmailVerificationScreen />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.verificationLinkExpired,
    element: <VerificationLinkExpired />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.setNewPassword,
    element: <SetNewPasswordScreen />,
    layout: 'noLayout',
  },

  // SSO
  {
    path: Path.auth.oidcWait,
    element: <OidcWaitScreen />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.samlWait,
    element: <SamlWaitScreen />,
    layout: 'noLayout',
  },

  // System
  {
    path: Path.auth.unauthorized401,
    element: <Page401Unauthorized />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.maintenance,
    element: <MaintenanceScreen />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.tooManyRequests429,
    element: <Page429TooManyRequests />,
    layout: 'noLayout',
  },
  {
    path: Path.auth.csrfError,
    element: <CsrfErrorScreen />,
    layout: 'noLayout',
  },

  // Device
  { path: Path.auth.deviceCode, element: <DeviceCodeDisplay />, layout: 'noLayout' },

  // System
  { path: Path.auth.browserNotSupported, element: <BrowserNotSupported />, layout: 'noLayout' },
  { path: Path.auth.forbidden403, element: <Page403Forbidden />, layout: 'noLayout' },

  // Admin
  { path: Path.auth.adminLogin, element: <AdminLoginScreen />, layout: 'noLayout' },
  { path: Path.auth.samlSSOInitiation, element: <SAMLSSOInitiation />, layout: 'noLayout' },

  // Organization Invitation
  { path: Path.auth.joinOrganization, element: <JoinOrganization />, layout: 'noLayout' },
]

// eslint-disable-next-line react-refresh/only-export-components
const LayoutRouteWrapper = ({
  element,
  layout,
}: {
  element: React.ReactNode
  layout?: AuthRouteConfig['layout']
}) => {
  const updateLayoutOverride = useAppStore((state) => state.updateLayoutOverride)

  React.useEffect(() => {
    // Only 'noLayout' is currently used/supported as an override in auth module
    if (layout === 'noLayout') {
      updateLayoutOverride('noLayout')
      return () => updateLayoutOverride('none')
    }
  }, [layout, updateLayoutOverride])

  return <div className="premium-auth-container" style={{ display: 'contents' }}>{element}</div>
}

export const authRoutes: React.FC<RoutesProps> = ({ location }) => {
  return (
    <Routes location={location}>
      {authRouteConfig.map(({ path, element, layout }) => (
        <Route
          key={path}
          path={path}
          element={<LayoutRouteWrapper element={element} layout={layout} />}
        />
      ))}
    </Routes>
  )
}
