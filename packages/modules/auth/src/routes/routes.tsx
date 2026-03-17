import React from 'react'
import { Routes, Route, RoutesProps } from 'react-router-dom'
import { AuthRouteConfig } from '@cap/platform-core/src/assembly'
import { Roles, useAppStore } from '@cap/platform-core'

// Middleware
import { AdminRoute, GuestRoute, AuthRoute } from '../middlewares'
import { AuthLoadingScreen } from '../components'
import { Path } from '../screens'

// Account Screens
const AccountOverview = React.lazy(() => import('../screens/account/security/AccountOverview'))
const ProfileView = React.lazy(() => import('../screens/account/profile/ProfileView'))
const EditProfile = React.lazy(() => import('../screens/account/profile/EditProfile'))
const LinkedAccountsDashboard = React.lazy(() => import('../screens/account/profile/LinkedAccountsDashboard'))
const ChangeEmail = React.lazy(() => import('../screens/account/settings/ChangeEmail'))
const ChangePassword = React.lazy(() => import('../screens/account/security/ChangePassword'))
const DeleteAccount = React.lazy(() => import('../screens/account/settings/DeleteAccount'))
const DeactivateAccount = React.lazy(() => import('../screens/account/settings/DeactivateAccount'))
const ActiveSessionsManagement = React.lazy(() => import('../screens/account/security/ActiveSessionsManagement'))
const UserActivityTimeline = React.lazy(() => import('../screens/account/security/UserActivityTimeline'))

// MFA Screens
const MFASetupInitiation = React.lazy(() => import('../screens/mfa/setup/MFASetupInitiation'))
const MFAVerificationTest = React.lazy(() => import('../screens/mfa/verification/MFAVerificationTest'))
const MFABackupCodes = React.lazy(() => import('../screens/mfa/setup/MFABackupCodes'))
const MFAVerificationSuccess = React.lazy(() => import('../screens/mfa/verification/MFAVerificationSuccess'))
const MFAManagement = React.lazy(() => import('../screens/mfa/management/MFAManagement'))
const MFADashboard = React.lazy(() => import('../screens/mfa/management/MFADashboard'))
const MFABackupCodeEntry = React.lazy(() => import('../screens/mfa/verification/MFABackupCodeEntry'))
const AddMFAMethod = React.lazy(() => import('../screens/mfa/setup/AddMFAMethod'))
const SecurityKeyManagement = React.lazy(() => import('../screens/mfa/management/SecurityKeyManagement'))

// Passkey Screens
const PasskeyRegistrationPrompt = React.lazy(() => import('../screens/passkey/PasskeyRegistrationPrompt'))
const PasskeyManagement = React.lazy(() => import('../screens/passkey/PasskeyManagement'))
const PasskeyRecoveryOptions = React.lazy(() => import('../screens/passkey/PasskeyRecoveryOptions'))
const PasskeyUsageStats = React.lazy(() => import('../screens/passkey/PasskeyUsageStats'))
const PasskeyCreationOptions = React.lazy(() => import('../screens/passkey/PasskeyCreationOptions'))
const PasskeyLoginOption = React.lazy(() => import('../screens/passkey/PasskeyLoginOption'))
const PasskeyNamingConfig = React.lazy(() => import('../screens/passkey/PasskeyNamingConfig'))
const PlatformAuthLogin = React.lazy(() => import('../screens/passkey/PlatformAuthLogin'))
const PlatformAuthRegister = React.lazy(() => import('../screens/passkey/PlatformAuthRegister'))

// Auth & SSO Screens
const ForgotPassword = React.lazy(() => import('../screens/auth/recovery/ForgotPassword'))
const SignInV2 = React.lazy(() => import('../screens/auth/signin/SignInV2'))
const LoginScreen = React.lazy(() => import('../screens/auth/signin/LoginScreen'))
const RegistrationScreen = React.lazy(() => import('../screens/auth/signup/RegistrationScreen'))
const CheckEmailConfirmation = React.lazy(() => import('../screens/auth/signup/CheckEmailConfirmation'))
const EmailVerificationScreen = React.lazy(() => import('../screens/auth/signup/EmailVerificationScreen'))
const VerificationLinkExpired = React.lazy(() => import('../screens/auth/signup/VerificationLinkExpired'))
const SetNewPasswordScreen = React.lazy(() => import('../screens/auth/recovery/SetNewPasswordScreen'))
const RegistrationSuccess = React.lazy(() => import('../screens/auth/signup/RegistrationSuccess'))
const VerificationEmail = React.lazy(() => import('../screens/auth/email/VerificationEmail'))
const ResetPassword = React.lazy(() => import('../screens/auth/recovery/ResetPassword'))
const PasswordResetSuccess = React.lazy(() => import('../screens/auth/recovery/PasswordResetSuccess'))
const OidcWaitScreen = React.lazy(() => import('../screens/auth/sso/OidcWaitScreen'))
const SamlWaitScreen = React.lazy(() => import('../screens/auth/sso/SamlWaitScreen'))
const AuthWaitScreen = React.lazy(() => import('../screens/auth/sso/AuthWaitScreen'))
const DeviceCodeDisplay = React.lazy(() => import('../screens/auth/device/DeviceCodeDisplay'))
const AdminLoginScreen = React.lazy(() => import('../screens/auth/signin/AdminLoginScreen'))

// System Screens
const Page401Unauthorized = React.lazy(() => import('../screens/auth/system/Page401Unauthorized'))
const MaintenanceScreen = React.lazy(() => import('../screens/auth/system/MaintenanceScreen'))
const Page429TooManyRequests = React.lazy(() => import('../screens/auth/system/Page429TooManyRequests'))
const CsrfErrorScreen = React.lazy(() => import('../screens/auth/system/CsrfErrorScreen'))
const BrowserNotSupported = React.lazy(() => import('../screens/auth/system/BrowserNotSupported'))
const Page403Forbidden = React.lazy(() => import('../screens/auth/system/Page403Forbidden'))

// Admin Screens
const UserList = React.lazy(() => import('../screens/admin/users/UserList'))
const BanManagement = React.lazy(() => import('../screens/admin/users/BanManagement'))
const ImpersonationLogs = React.lazy(() => import('../screens/admin/users/ImpersonationLogs'))
const AdminUserProfile = React.lazy(() => import('../screens/admin/users/AdminUserProfile'))
const OrganizationListDashboard = React.lazy(() => import('../screens/admin/organizations/OrganizationListDashboard'))
const OrganizationProfile = React.lazy(() => import('../screens/admin/organizations/OrganizationProfile'))
const OrganizationInvitationDashboard = React.lazy(() => import('../screens/admin/organizations/OrganizationInvitationDashboard'))
const RoleList = React.lazy(() => import('../screens/admin/roles/RoleList'))
const RoleDetailView = React.lazy(() => import('../screens/admin/roles/RoleDetailView'))
const PermissionRegistry = React.lazy(() => import('../screens/admin/roles/PermissionRegistry'))
const PermissionConsentScreen = React.lazy(() => import('../screens/auth/sso/PermissionConsentScreen'))
const OIDCLoginPrompt = React.lazy(() => import('../screens/auth/sso/OIDCLoginPrompt'))
const SAMLMetadataDisplay = React.lazy(() => import('../screens/auth/sso/SAMLMetadataDisplay'))
const SAMLMetadataBrowser = React.lazy(() => import('../screens/auth/sso/SAMLMetadataBrowser'))
const OIDCConfigBrowser = React.lazy(() => import('../screens/auth/sso/OIDCConfigBrowser'))
const OIDCClientCreate = React.lazy(() => import('../screens/auth/sso/OIDCClientCreate'))
const OIDCClientEdit = React.lazy(() => import('../screens/auth/sso/OIDCClientEdit'))
const SAMLConfigDashboard = React.lazy(() => import('../screens/auth/sso/SAMLConfigDashboard'))
const SSFConfiguration = React.lazy(() => import('../screens/auth/sso/SSFConfiguration'))
const JWKSManagement = React.lazy(() => import('../screens/auth/sso/JWKSManagement'))
const SSOProviderSelection = React.lazy(() => import('../screens/auth/sso/SSOProviderSelection'))
const SAMLSSOInitiation = React.lazy(() => import('../screens/auth/sso/SAMLSSOInitiation'))
const AccessPolicyBuilder = React.lazy(() => import('../screens/admin/roles/AccessPolicyBuilder'))
const ApplicationDashboard = React.lazy(() => import('../screens/admin/developer/ApplicationDashboard'))
const ApplicationDetailView = React.lazy(() => import('../screens/admin/developer/ApplicationDetailView'))
const ScopesRegistry = React.lazy(() => import('../screens/admin/developer/ScopesRegistry'))
const APIExplorerDashboard = React.lazy(() => import('../screens/admin/developer/APIExplorerDashboard'))
const WebhookManagement = React.lazy(() => import('../screens/admin/developer/WebhookManagement'))
const DirectorySyncDashboard = React.lazy(() => import('../screens/admin/provisioning/DirectorySyncDashboard'))
const SCIMConfiguration = React.lazy(() => import('../screens/admin/provisioning/SCIMConfiguration'))
const SyncLogsView = React.lazy(() => import('../screens/admin/provisioning/SyncLogsView'))
const ConnectorDetailView = React.lazy(() => import('../screens/admin/provisioning/ConnectorDetailView'))

// Monitoring Screens
const AdminSystemHealthDashboard = React.lazy(() => import('../screens/admin/monitoring/SystemHealthDashboard'))
const AdminEmailTestingDashboard = React.lazy(() => import('../screens/admin/monitoring/EmailTestingDashboard'))
const AdminEmailTemplatePreview = React.lazy(() => import('../screens/admin/monitoring/EmailTemplatePreview'))
const AdminAuthEventsMonitor = React.lazy(() => import('../screens/admin/monitoring/AuthEventsMonitor'))
const AdminMFAUsageAnalytics = React.lazy(() => import('../screens/admin/monitoring/MFAUsageAnalytics'))
const ExportAuditTrail = React.lazy(() => import('../screens/admin/monitoring/ExportAuditTrail'))

// API Token Screens
const APITokensDashboard = React.lazy(() => import('../screens/api-tokens/APITokensDashboard'))
const CreateAPITokenBasicInfo = React.lazy(() => import('../screens/api-tokens/CreateAPITokenBasicInfo'))
const CreateAPITokenIPRestrictions = React.lazy(() => import('../screens/api-tokens/CreateAPITokenIPRestrictions'))
const APITokenDetails = React.lazy(() => import('../screens/api-tokens/APITokenDetails'))
const APITokenDisplayUsage = React.lazy(() => import('../screens/api-tokens/APITokenDisplayUsage'))
const APITokenActions = React.lazy(() => import('../screens/api-tokens/APITokenActions'))
const APITokenSecurityWarning = React.lazy(() => import('../screens/api-tokens/APITokenSecurityWarning'))

// Other flow-related screens
const InitiateEmailChange = React.lazy(() => import('../screens/auth/email/InitiateEmailChange'))
const EmailChangeStatusDashboard = React.lazy(() => import('../screens/auth/email/EmailChangeStatus'))
const EmailChangeVerificationPending = React.lazy(() => import('../screens/auth/email/EmailChangeVerificationPending'))
const EmailChangeVerification = React.lazy(() => import('../screens/auth/email/EmailChangeVerification'))
const EmailChangeSuccess = React.lazy(() => import('../screens/auth/email/EmailChangeSuccess'))
const EmailChangeFailed = React.lazy(() => import('../screens/auth/email/EmailChangeFailed'))
const EmailVerifiedSuccess = React.lazy(() => import('../screens/auth/signup/EmailVerifiedSuccess'))
const MFAVerificationScreen = React.lazy(() => import('../screens/auth/email/MFAVerificationScreen'))
const ExportVerification = React.lazy(() => import('../screens/auth/email/ExportVerification'))
const PasswordlessVerification = React.lazy(() => import('../screens/auth/email/PasswordlessVerification'))
const JoinOrganization = React.lazy(() => import('../screens/auth/organization/JoinOrganization'))

const SignUp = React.lazy(() => import('../screens/auth/signup/SignUp'))
const SignUpV2 = React.lazy(() => import('../screens/auth/signup/SignUpV2'))

// Route Config Helpers
const createAdminRoute = (path: string, element: React.ReactNode): AuthRouteConfig => ({
  path,
  element: <AdminRoute element={element} minimumRole={Roles.ADMIN} layout="admin" />,
})

const createAuthRoute = (
  path: string,
  element: React.ReactNode,
  options: { requiresVerification?: boolean; layout?: any } = {}
): AuthRouteConfig => ({
  path,
  element: (
    <AuthRoute
      element={element}
      requiresVerification={options.requiresVerification}
      layout={options.layout}
    />
  ),
  // We don't set layout here because it's handled by AuthRoute/AdminRoute components
  // and AuthRouteConfig only supports a subset of layout strings.
})

const adminRouteConfig: Array<AuthRouteConfig> = [
  createAdminRoute(Path.admin.users, <UserList />),
  createAdminRoute(Path.admin.userProfile, <AdminUserProfile />),
  createAdminRoute(Path.admin.banManagement, <BanManagement />),
  createAdminRoute(Path.admin.impersonationLogs, <ImpersonationLogs />),
  createAdminRoute(Path.admin.organizations, <OrganizationListDashboard />),
  createAdminRoute(Path.admin.organizationProfile, <OrganizationProfile />),
  createAdminRoute(Path.admin.invitations, <OrganizationInvitationDashboard />),
  createAdminRoute(Path.admin.roles, <RoleList />),
  createAdminRoute(Path.admin.roleDetail, <RoleDetailView />),
  createAdminRoute(Path.admin.permissions, <PermissionRegistry />),
  createAdminRoute(Path.admin.policies, <AccessPolicyBuilder />),
  createAdminRoute(Path.admin.applications, <ApplicationDashboard />),
  createAdminRoute(Path.admin.appDetail, <ApplicationDetailView />),
  createAdminRoute(Path.admin.scopes, <ScopesRegistry />),
  createAdminRoute(Path.admin.apiExplorer, <APIExplorerDashboard />),
  createAdminRoute(Path.admin.webhooks, <WebhookManagement />),
  createAdminRoute(Path.admin.provisioning, <DirectorySyncDashboard />),
  createAdminRoute(Path.admin.scim, <SCIMConfiguration />),
  createAdminRoute(Path.admin.syncLogs, <SyncLogsView />),
  createAdminRoute(Path.admin.connectorDetail, <ConnectorDetailView />),
]

const apiTokenRouteConfig: Array<AuthRouteConfig> = [
  createAuthRoute(Path.apiTokens.dashboard, <APITokensDashboard />, { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.apiTokens.createBasic, <CreateAPITokenBasicInfo />, { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.apiTokens.createRestrictions, <CreateAPITokenIPRestrictions />, { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.apiTokens.details, <APITokenDetails />, { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.apiTokens.display, <APITokenDisplayUsage />, { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.apiTokens.actions, <APITokenActions />, { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.apiTokens.securityWarning, <APITokenSecurityWarning />, { requiresVerification: true, layout: 'admin' }),
]

const ssoRouteConfig: Array<AuthRouteConfig> = [
  // SSO & Protocols
  { path: Path.auth.permissionConsent, element: <PermissionConsentScreen />, layout: 'noLayout' },
  { path: Path.auth.oidcLoginPrompt, element: <OIDCLoginPrompt />, layout: 'noLayout' },
  { path: Path.auth.providerSelection, element: <SSOProviderSelection />, layout: 'noLayout' },
  { path: Path.auth.authWait, element: <AuthWaitScreen />, layout: 'noLayout' },

  // SSO Administrative
  createAdminRoute(Path.auth.samlMetadataDisplay, <SAMLMetadataDisplay />),
  createAdminRoute(Path.auth.samlMetadataBrowser, <SAMLMetadataBrowser />),
  createAdminRoute(Path.auth.oidcConfigBrowser, <OIDCConfigBrowser />),
  createAdminRoute((Path.auth as any).oidcClientCreate, <OIDCClientCreate />),
  createAdminRoute((Path.auth as any).oidcClientEdit, <OIDCClientEdit />),
  createAdminRoute(Path.auth.samlConfigDashboard, <SAMLConfigDashboard />),
  createAdminRoute(Path.auth.ssfConfiguration, <SSFConfiguration />),
  createAdminRoute((Path.auth as any).jwksManagement, <JWKSManagement />),
]

const accountRouteConfig: Array<AuthRouteConfig> = [
  createAuthRoute(Path.account.overview, <AccountOverview />, { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.account.view, <ProfileView />, { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.account.edit, <EditProfile />, { requiresVerification: true, layout: 'admin' }),
  createAuthRoute(Path.account.changeEmail, <ChangeEmail />, { requiresVerification: true }),
  createAuthRoute(Path.account.changePassword, <ChangePassword />, { requiresVerification: true }),
  createAuthRoute(Path.account.delete, <DeleteAccount />, { requiresVerification: true }),
  createAuthRoute(Path.account.deactivate, <DeactivateAccount />, { requiresVerification: true }),
  createAuthRoute(Path.account.linkedAccounts, <LinkedAccountsDashboard />, { requiresVerification: true }),
  createAuthRoute(Path.account.activeSessions, <ActiveSessionsManagement />, { requiresVerification: true }),
  createAuthRoute(Path.account.emailChangeStatus, <EmailChangeStatusDashboard />, { requiresVerification: true }),
  createAuthRoute(Path.account.activityTimeline, <UserActivityTimeline />, { requiresVerification: true }),
  createAuthRoute(Path.account.initiateEmailChange, <InitiateEmailChange />, { requiresVerification: true, layout: 'noLayout' }),
]

const emailVerificationRouteConfig: Array<AuthRouteConfig> = [
  createAuthRoute(Path.auth.emailChangeVerificationPending, <EmailChangeVerificationPending />, { layout: 'noLayout' }),
  { path: Path.auth.emailChangeVerification, element: <EmailChangeVerification /> },
  { path: Path.auth.emailChangeSuccess, element: <EmailChangeSuccess /> },
  { path: Path.auth.emailChangeFailed, element: <EmailChangeFailed /> },
  { path: Path.auth.emailVerifiedSuccess, element: <EmailVerifiedSuccess /> },
  createAuthRoute(Path.auth.mfaVerification, <MFAVerificationScreen />, { layout: 'noLayout' }),
  createAuthRoute(Path.auth.exportVerification, <ExportVerification />, { layout: 'noLayout' }),
]

const mfaRouteConfig: Array<AuthRouteConfig> = [
  createAuthRoute(Path.mfa.setup, <MFASetupInitiation />, { layout: 'noLayout' }),
  { path: Path.mfa.verification, element: <MFAVerificationTest /> },
  createAuthRoute(Path.mfa.backup_codes, <MFABackupCodes />),
  createAuthRoute(Path.mfa.verification_success, <MFAVerificationSuccess />),
  createAuthRoute(Path.mfa.management, <MFAManagement />),
  createAuthRoute(Path.mfa.dashboard, <MFADashboard />),
  { path: Path.mfa.backup_entry, element: <MFABackupCodeEntry />, layout: 'noLayout' },
  createAuthRoute(Path.mfa.add_method, <AddMFAMethod />),
  createAuthRoute(Path.mfa.security_keys, <SecurityKeyManagement />),
]

const passkeyRouteConfig: Array<AuthRouteConfig> = [
  createAuthRoute(Path.passkey.setup, <PasskeyRegistrationPrompt />),
  createAuthRoute(Path.passkey.management, <PasskeyManagement />),
  createAuthRoute(Path.passkey.recovery, <PasskeyRecoveryOptions />),
  createAdminRoute(Path.passkey.usage_stats, <PasskeyUsageStats />),
  createAuthRoute(Path.passkey.creation_options, <PasskeyCreationOptions />),
  { path: Path.passkey.login, element: <PasskeyLoginOption />, layout: 'noLayout' },
  createAuthRoute(Path.passkey.naming_config, <PasskeyNamingConfig />),
  { path: Path.passkey.platform_login, element: <PlatformAuthLogin />, layout: 'noLayout' },
  createAuthRoute(Path.passkey.platform_register, <PlatformAuthRegister />),
]

const passwordlessRouteConfig: Array<AuthRouteConfig> = [
  createAuthRoute(Path.passwordless.setup, <PasswordlessVerification />),
  { path: Path.passwordless.verification, element: <PasswordlessVerification /> },
]

const monitoringRouteConfig: Array<AuthRouteConfig> = [
  createAdminRoute(Path.admin.events, <AdminAuthEventsMonitor />),
  createAdminRoute(Path.admin.health, <AdminSystemHealthDashboard />),
  createAdminRoute(Path.monitoring.emailTesting, <AdminEmailTestingDashboard />),
  createAdminRoute(Path.monitoring.emailTemplatePreview, <AdminEmailTemplatePreview />),
  createAdminRoute(Path.monitoring.mfa_analytics, <AdminMFAUsageAnalytics />),
  createAdminRoute(Path.admin.exportAudit, <ExportAuditTrail />),
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


  // Organization Invitation
  { path: Path.auth.joinOrganization, element: <JoinOrganization />, layout: 'noLayout' },

  // Sign In
  { path: Path.auth.signin, element: <SignInV2 />, layout: 'noLayout' },
  { path: Path.auth.signinV2, element: <GuestRoute element={<SignInV2 />} />, layout: 'noLayout' },
  { path: Path.auth.registrationSuccess, element: <RegistrationSuccess />, layout: 'noLayout' },

  // Sign Up
  { path: Path.auth.signup, element: <GuestRoute element={<SignUp />} />, layout: 'noLayout' },
  { path: Path.auth.signupV2, element: <GuestRoute element={<SignUpV2 />} />, layout: 'noLayout' },
  { path: Path.auth.emailVerification, element: <EmailVerificationScreen />, layout: 'noLayout' },
  { path: Path.auth.verifyEmail, element: <EmailVerificationScreen />, layout: 'noLayout' },

  { path: Path.auth.forgotPassword, element: <GuestRoute element={<ForgotPassword />} />, layout: 'noLayout' },
  { path: Path.auth.resetPassword, element: <GuestRoute element={<ResetPassword />} /> },
  { path: Path.auth.passwordResetSuccess, element: <PasswordResetSuccess /> },

  // New Auth Flow Screens
  { path: Path.auth.login, element: <GuestRoute element={<LoginScreen />} />, layout: 'noLayout' },
  { path: Path.auth.registration, element: <GuestRoute element={<RegistrationScreen />} />, layout: 'noLayout' },
  { path: Path.auth.checkEmail, element: <CheckEmailConfirmation />, layout: 'noLayout' },
  { path: Path.auth.verifyEmail, element: <EmailVerificationScreen />, layout: 'noLayout' },
  { path: Path.auth.verificationLinkExpired, element: <VerificationLinkExpired />, layout: 'noLayout' },
  { path: Path.auth.setNewPassword, element: <SetNewPasswordScreen />, layout: 'noLayout' },

  // SSO
  { path: Path.auth.oidcWait, element: <OidcWaitScreen />, layout: 'noLayout' },
  { path: Path.auth.samlWait, element: <SamlWaitScreen />, layout: 'noLayout' },

  // System & Device
  { path: Path.auth.unauthorized401, element: <Page401Unauthorized />, layout: 'noLayout' },
  { path: Path.auth.maintenance, element: <MaintenanceScreen />, layout: 'noLayout' },
  { path: Path.auth.tooManyRequests429, element: <Page429TooManyRequests />, layout: 'noLayout' },
  { path: Path.auth.csrfError, element: <CsrfErrorScreen />, layout: 'noLayout' },
  { path: Path.auth.deviceCode, element: <DeviceCodeDisplay />, layout: 'noLayout' },
  { path: Path.auth.browserNotSupported, element: <BrowserNotSupported />, layout: 'noLayout' },
  { path: Path.auth.forbidden403, element: <Page403Forbidden />, layout: 'noLayout' },

  // Admin
  { path: Path.auth.adminLogin, element: <AdminLoginScreen />, layout: 'noLayout' },
  { path: Path.auth.samlSSOInitiation, element: <SAMLSSOInitiation />, layout: 'noLayout' },
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
    <React.Suspense fallback={<AuthLoadingScreen />}>
      <Routes location={location}>
        {authRouteConfig.map(({ path, element, layout }) => (
          <Route
            key={path}
            path={path}
            element={<LayoutRouteWrapper element={element} layout={layout} />}
          />
        ))}
        <Route path="*" element={null} />
      </Routes>
    </React.Suspense>
  )
}
