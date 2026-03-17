/**
 * Centralized exports for all Auth screens
 */

export { default as Path } from './path'
// Account Screens
export * from './account'

// Auth Screens
export { default as SignIn } from './auth/signin/SignInV2'
export { default as SignInV2 } from './auth/signin/SignInV2'
export { default as LoginScreen } from './auth/signin/LoginScreen'
export { default as AdminLoginScreen } from './auth/signin/AdminLoginScreen'
export { default as SignUp } from './auth/signup/SignUp'
export { default as SignUpV2 } from './auth/signup/SignUpV2'
export { default as RegistrationScreen } from './auth/signup/RegistrationScreen'
export { default as RegistrationSuccess } from './auth/signup/RegistrationSuccess'
export { default as CheckEmailConfirmation } from './auth/signup/CheckEmailConfirmation'
export { default as EmailVerificationScreen } from './auth/signup/EmailVerificationScreen'
export { default as VerificationLinkExpired } from './auth/signup/VerificationLinkExpired'
export { default as ForgotPassword } from './auth/recovery/ForgotPassword'
export { default as ResetPassword } from './auth/recovery/ResetPassword'
export { default as SetNewPasswordScreen } from './auth/recovery/SetNewPasswordScreen'
export { default as PasswordResetSuccess } from './auth/recovery/PasswordResetSuccess'
export { default as OidcWaitScreen } from './auth/sso/OidcWaitScreen'
export { default as SamlWaitScreen } from './auth/sso/SamlWaitScreen'
export { default as Page401Unauthorized } from './auth/system/Page401Unauthorized'
export { default as Page403Forbidden } from './auth/system/Page403Forbidden'
export { default as BrowserNotSupported } from './auth/system/BrowserNotSupported'
export { default as MaintenanceScreen } from './auth/system/MaintenanceScreen'
export { default as Page429TooManyRequests } from './auth/system/Page429TooManyRequests'
export { default as CsrfErrorScreen } from './auth/system/CsrfErrorScreen'

// Organization Invitation
export { default as JoinOrganization } from './auth/organization/JoinOrganization'

// Email & Verification Flow
export { default as InitiateEmailChange } from './auth/email/InitiateEmailChange'
export { default as EmailChangeVerificationPending } from './auth/email/EmailChangeVerificationPending'
export { default as EmailChangeVerification } from './auth/email/EmailChangeVerification'
export { default as EmailChangeSuccess } from './auth/email/EmailChangeSuccess'
export { default as EmailChangeFailed } from './auth/email/EmailChangeFailed'
export { default as EmailChangeStatusDashboard } from './auth/email/EmailChangeStatus'
export { default as EmailVerifiedSuccess } from './auth/signup/EmailVerifiedSuccess'
export { default as MFAVerificationScreen } from './auth/email/MFAVerificationScreen'
export { default as ExportVerification } from './auth/email/ExportVerification'
export { default as PasswordlessVerification } from './auth/email/PasswordlessVerification'
export { default as PasswordlessInitiation } from './passwordless/PasswordlessInitiation'
export { default as ResendEmailVerification } from './auth/email/ResendEmailVerification'
export { default as VerificationEmail } from './auth/email/VerificationEmail'

// Passkey Screens
export { default as PasskeyRegistrationPrompt } from './passkey/PasskeyRegistrationPrompt'
export { default as PasskeySetup } from './passkey/PasskeySetup'
export { default as PasskeySetupAuto } from './passkey/PasskeySetupAuto'
export { default as PasskeyManagement } from './passkey/PasskeyManagement'
export { default as PasskeyRecoveryOptions } from './passkey/PasskeyRecoveryOptions'
export { default as PasskeyUsageStats } from './passkey/PasskeyUsageStats'
export { default as PasskeyCreationOptions } from './passkey/PasskeyCreationOptions'
export { default as PasskeyLoginOption } from './passkey/PasskeyLoginOption'
export { default as PasskeyNamingConfig } from './passkey/PasskeyNamingConfig'
export { default as EditPasskeyModal } from './passkey/EditPasskeyModal'
export { default as PlatformAuthLogin } from './passkey/PlatformAuthLogin'
export { default as PlatformAuthRegister } from './passkey/PlatformAuthRegister'
export { default as DeviceCodeDisplay } from './auth/device/DeviceCodeDisplay'

// Monitoring and Administration
export * from './mfa'
export * from './admin'
export {
  SystemHealthDashboard as AdminSystemHealthDashboard,
  EmailTestingDashboard as AdminEmailTestingDashboard,
  EmailTemplatePreview as AdminEmailTemplatePreview,
  AuthEventsMonitor as AdminAuthEventsMonitor,
  MFAUsageAnalytics as AdminMFAUsageAnalytics,
} from './admin/monitoring'

// Component Aliases
export { default as EmailVerification } from './auth/signup/EmailVerificationScreen'

// SSO & Protocol Screens
export { default as PermissionConsentScreen } from './auth/sso/PermissionConsentScreen'
export { default as OIDCLoginPrompt } from './auth/sso/OIDCLoginPrompt'
export { default as SAMLMetadataDisplay } from './auth/sso/SAMLMetadataDisplay'
export { default as SAMLMetadataBrowser } from './auth/sso/SAMLMetadataBrowser'
export { default as OIDCConfigBrowser } from './auth/sso/OIDCConfigBrowser'
export { default as OIDCClientCreate } from './auth/sso/OIDCClientCreate'
export { default as OIDCClientEdit } from './auth/sso/OIDCClientEdit'
export { default as SAMLConfigDashboard } from './auth/sso/SAMLConfigDashboard'
export { default as SSFConfiguration } from './auth/sso/SSFConfiguration'
export { default as JWKSManagement } from './auth/sso/JWKSManagement'
export { default as SSOProviderSelection } from './auth/sso/SSOProviderSelection'
export { default as AuthWaitScreen } from './auth/sso/AuthWaitScreen'
export { default as SAMLSSOInitiation } from './auth/sso/SAMLSSOInitiation'

// API Token Screens
export * from './api-tokens'
