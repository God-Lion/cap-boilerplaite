// src/Modules/Auth/hooks/index.ts

/**
 * Centralized exports for all Auth hooks
 */

// Auth Query Hooks (User-facing)
export * from './useAuthQuery'

export * from './useUserQuery'

// Auth Store
export * from '../store'

// Admin Query Hooks
export {
  // OIDC Client Management
  useOIDCClients,
  useOIDCClient,
  useCreateOIDCClient,
  useUpdateOIDCClient,
  useDeleteOIDCClient,
  useRotateClientSecret,
  useClientBranding,
  useUpdateClientBranding,

  // User Management
  useUsers,
  useUser,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
  useBanUser,
  useUnbanUser,
  useResetUserPassword,
  useResetUserMfa,
  useImpersonateUser,

  // SAML Configuration
  useSAMLConfig,
  useUpdateSAMLConfig,
  useSAMLMetadata,
  useUploadSAMLMetadata,
  useFetchRemoteMetadata,
  useRemoteMetadata,
  useRecentSAMLEntities,

  // SSF Configuration
  useSSFConfig,
  useUpdateSSFConfig,
  useTestSSFStream,
  useBroadcastSSFEvent,

  // Domain Verification
  useVerifyDomain,
  useCheckDomain,

  // Dashboard & Health
  useAdminDashboard,
  useSecurityHealth,
  useSystemHealth,
  useSystemMetrics,

  // Audit
  useAuditLogs,

  // Statistics
  useMFAStats,
  useUserStats,

  // RBAC & Roles
  useRoles,
  useRole,
  useUpdateRole,
  useDeleteRole,
  useDuplicateRole,
  useRoleStats,
  usePermissions,
  useRolePermissions,
  useSyncRolePermissions,
  useSyncRoleParents,

  // User Bulk Actions
  useBulkUserAction,

  // Webhooks
  useWebhooks,
  useWebhook,
  useCreateWebhook,
  useUpdateWebhook,
  useDeleteWebhook,
  useTestWebhook,
} from './useAdminQuery'

// Utility Hooks
export * from './useSignOut'
export * from './usePasskey'

// Profile Hooks
export * from './useProfileQuery'

// Notifications Hooks
export * from './useNotificationsQuery'
