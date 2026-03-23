# @cap/module-auth — Component Context

## Purpose
The primary deliverable package. Provides a complete, plug-in authentication and identity
management system. Consumed by the `app/` host shell and can be published to other products.

## Package Location
`packages/modules/auth/`

## Key Entry Points
- `src/index.ts` — public API (re-exports from all 8 sub-modules)
- `src/routes/routes.tsx` — top-level route aggregator for all sub-modules
- `src/registry/AuthRegistry.ts` — module registry for dynamic feature registration
- `src/plugins/MFATOTPPlugin.tsx` — example plugin for TOTP MFA

## Sub-Modules

### `authentication-core`
Core sign-in/sign-up/recovery flows.
- **Key screens**: `LoginScreen`, `SignInV2`, `AdminLoginScreen`, `RegistrationScreen`, `SignUp`,
  `SignUpV2`, `ForgotPassword`, `ResetPassword`, `SetNewPasswordScreen`
- **Email screens**: `EmailVerificationScreen`, `EmailChangeVerification`, `InitiateEmailChange`
- **Key hooks**: `useAuthQuery`, `useSignOut`, `useDeviceAuth`, `usePasskey`, `useSSE`
- **Middlewares**: `AuthRoute.tsx` (requires auth), `GuestRoute.tsx` (requires NOT auth) — both tested
- **Services**: `auth.service.ts`, `admin.service.ts`, `endpoints.ts`
- **Store**: `store/index.ts` (local auth state beyond platform-core)
- **Utils**: `schema.ts` (Zod validation), `normalizeAuthUser.ts`, `logger.ts`

### `authorization-engine`
Role-based access control and API token management.
- **Key screens**: `RoleList`, `RoleDetailView`, `AccessPolicyBuilder`, `PermissionRegistry`,
  `APITokensDashboard`, `APITokenDetails`, `CreateAPITokenBasicInfo`, `CreateAPITokenIPRestrictions`
- **Middleware**: `AdminRoute.tsx` (requires admin role — tested)
- **Types**: `IRole`, `IPermission`, `IAccessToken`, `IOIDCClient`, `IOIDCClientBranding`, `IWebhook`, `UserRole`
- **Domain**: `src/dtos/authorization.dto.ts`, `src/services/authorization.service.ts`, `src/services/rbac.subscriber.ts`

### `identity-broker`
SSO, SAML, OIDC federation, and SCIM provisioning.
- **SSO screens**: `OIDCConfigBrowser`, `OIDCClientCreate/Edit`, `JWKSManagement`,
  `SAMLConfigDashboard`, `SAMLMetadataBrowser`, `SAMLSSOInitiation`, `SSOProviderSelection`,
  `PermissionConsentScreen`, `SSFConfiguration`, `OIDCLoginPrompt`, `AuthWaitScreen`
- **Provisioning screens**: `DirectorySyncDashboard`, `ConnectorDetailView`,
  `SCIMConfiguration`, `SyncLogsView`
- **Key hook**: `useOidcCompliance` (with test)
- **Types**: `IDomainVerification`, `provisioning.types`

### `mfa-orchestrator`
Multi-factor authentication — TOTP, passkeys (WebAuthn), and MFA verification.
- **Key screens**: `MFAVerificationScreen`, `PasskeySetup`, `PasskeyManagement`,
  `PasskeyCreationOptions`, `PasskeyRegistrationPrompt`, `PasskeyNamingConfig`,
  `PlatformAuthLogin`, `PlatformAuthRegister`, `EditPasskeyModal`, `PasskeyUsageStats`
- **Key hooks**: `usePasskey`, `usePasskeyAutofill` (both tested)
- **Service**: `mfa.service.ts`
- **Dep**: `@simplewebauthn/browser` (only in this sub-module's node_modules)

### `passwordless-service`
Magic link / passwordless authentication.
- **Screens**: `PasswordlessInitiation`, `PasswordlessVerification`

### `platform-cluster`
Admin monitoring, observability, and developer tools.
- **Developer screens**: `APIExplorerDashboard`, `ApplicationDashboard`, `ApplicationDetailView`,
  `WebhookManagement`, `ScopesRegistry`
- **Monitoring screens**: `AdminOverviewDashboard`, `AuthEventsMonitor`, `ExportAuditTrail`,
  `EmailTestingDashboard`, `MFAUsageAnalytics`, `SystemHealthDashboard`, `SecurityHealthCheck`
- **System screens**: `MaintenanceScreen`, `CsrfErrorScreen`, `Page401`, `Page403`, `Page429`
- **Types**: `IAuditLog`, `AuditAction`, `IEmailHistory`, `developer.types`, `governance.types`

### `session-manager`
Active session tracking and session guard.
- **Key screens**: `ActiveSessionsManagement`, `AccountOverview`, `ChangePassword`, `UserActivityTimeline`
- **Middleware**: `useSessionGuard` (tested) — redirects on expired session
- **Component**: `ActiveSessions.tsx`
- **Note**: Has its own `node_modules/@mui/lab` due to version mismatch

### `user-directory`
User profiles, org management, NFC access control, account settings.
- **Profile screens**: `ProfileView`, `EditProfile`, `LinkedAccountsDashboard`
- **Settings screens**: `ChangeEmail`, `DeactivateAccount`, `DeleteAccount`, `InitiateEmailChange`
- **Admin screens**: `screens/admin/organizations/`, `screens/admin/users/`
- **NFC screens**: `AccessLogsScreen`, `AccessPointsScreen`, `NfcCardsScreen`
- **Key hooks**: `useProfileQuery`, `useUserQuery`
- **Services**: `user.service.ts`, `api.profile.service.ts`
- **Types**: `IUser`, `IProfile`, `IOrganization`, `IOrganizationMember`, `ILinkedAccount`, `IUserCredential`

## Dependencies (key)
```json
{
  "@cap/platform-core": "workspace:*",
  "@cap/shared-types": "workspace:*",
  "@mui/material": "^5.x",
  "@tanstack/react-query": "^5.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "zustand": "^4.x",
  "i18next": "^23.x",
  "framer-motion": "^11.x",
  "notistack": "^3.x"
}
```
