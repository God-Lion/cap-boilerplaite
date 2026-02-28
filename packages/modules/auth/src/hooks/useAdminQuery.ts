// src/Modules/Auth/hooks/useAdminQuery.ts
// ============================================================================
// Admin Query Hooks - TanStack Query hooks for admin operations
// ============================================================================

// ============================================================================
// Query Keys Factory
// ============================================================================

export const adminKeys = {
  all: ['admin'] as const,
  oidc: {
    all: ['admin', 'oidc'] as const,
    clients: () => [...adminKeys.oidc.all, 'clients'] as const,
    client: (id: string | number) => [...adminKeys.oidc.clients(), String(id)] as const,
    branding: (id: string | number) => [...adminKeys.oidc.client(id), 'branding'] as const,
  },
  users: {
    all: ['admin', 'users'] as const,
    list: (params?: any) => [...adminKeys.users.all, params] as const,
    detail: (id: string | number) => [...adminKeys.users.all, String(id)] as const,
    sessions: (id: string | number) => [...adminKeys.users.detail(id), 'sessions'] as const,
  },
  saml: {
    all: ['admin', 'saml'] as const,
    config: () => [...adminKeys.saml.all, 'config'] as const,
    metadata: () => [...adminKeys.saml.all, 'metadata'] as const,
  },
  ssf: {
    all: ['admin', 'ssf'] as const,
    config: () => [...adminKeys.ssf.all, 'config'] as const,
  },
  dashboard: () => ['admin', 'dashboard'] as const,
  auditLogs: (params?: any) => ['admin', 'auditLogs', params] as const,
  impersonationLogs: (params?: any) => ['admin', 'impersonationLogs', params] as const,
  appeals: {
    all: ['admin', 'appeals'] as const,
    list: (params?: any) => [...adminKeys.appeals.all, params] as const,
  },
  webhooks: {
    all: ['admin', 'webhooks'] as const,
    detail: (id: string | number) => [...adminKeys.webhooks.all, String(id)] as const,
  },
  rbac: {
    all: ['admin', 'rbac'] as const,
    permissions: () => [...adminKeys.rbac.all, 'permissions'] as const,
    policies: () => [...adminKeys.rbac.all, 'policies'] as const,
    rolePermissions: (role: string) =>
      [...adminKeys.rbac.all, 'roles', role, 'permissions'] as const,
  },
  organizations: {
    all: ['admin', 'organizations'] as const,
    list: (params?: any) => [...adminKeys.organizations.all, params] as const,
    detail: (id: string | number) => [...adminKeys.organizations.all, String(id)] as const,
  },
  scim: {
    all: ['admin', 'scim'] as const,
    tokens: () => [...adminKeys.scim.all, 'tokens'] as const,
  },
  provisioning: {
    all: ['admin', 'provisioning'] as const,
    connectors: () => [...adminKeys.provisioning.all, 'connectors'] as const,
  },
  statistics: {
    all: ['admin', 'statistics'] as const,
    summary: () => [...adminKeys.statistics.all, 'summary'] as const,
  },
}

// ============================================================================

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query'
import { FetchResponse, HttpError, PaginatedResponse } from '@cap/platform-core'

import { adminService } from '../services/adminService'
import type {
  OIDCClient,
  CreateOIDCClientRequest,
  UpdateOIDCClientRequest,
  AdminUser,
  CreateUserRequest,
  UpdateUserRequest,
  SSFConfig,
  MessageResponse,
  Role,
  Permission,
  AccessPolicy,
  Organization,
  CreateOrganizationRequest,
  OrganizationMember,
  Connector,
  SCIMToken,
  SAMLConfig,
  EmailTemplate,
  EmailTestRequest,
  MFAStats,
  UserStats,
  BulkActionRequest,
  BulkActionResult,
} from '../services/adminService'

// ============================================================================
// OIDC Client Management Hooks
// ============================================================================

/**
 * Get all OIDC clients
 */
export function useOIDCClients(
  options?: Omit<UseQueryOptions<FetchResponse<OIDCClient[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.oidc.clients(),
    queryFn: () => adminService.listOIDCClients(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

/**
 * Get a specific OIDC client by ID
 */
export function useOIDCClient(
  id: string | number | null | undefined,
  options?: Omit<UseQueryOptions<FetchResponse<OIDCClient>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.oidc.client(id!),
    queryFn: () => adminService.getOIDCClient(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

/**
 * Create a new OIDC client
 */
export function useCreateOIDCClient(
  options?: UseMutationOptions<
    FetchResponse<OIDCClient>,
    HttpError,
    CreateOIDCClientRequest,
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => adminService.createOIDCClient(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.oidc.clients() })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Update an OIDC client
 */
export function useUpdateOIDCClient(
  options?: UseMutationOptions<
    FetchResponse<OIDCClient>,
    HttpError,
    { id: string | number; data: UpdateOIDCClientRequest },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, data }) => adminService.updateOIDCClient(id, data),
    onSuccess: (...args) => {
      const [, variables] = args
      queryClient.invalidateQueries({ queryKey: adminKeys.oidc.clients() })
      queryClient.invalidateQueries({ queryKey: adminKeys.oidc.client(variables.id) })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Delete an OIDC client
 */
export function useDeleteOIDCClient(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, string | number, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => adminService.deleteOIDCClient(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.oidc.clients() })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Rotate client secret
 */
export function useRotateClientSecret(
  options?: UseMutationOptions<
    FetchResponse<{ client_secret: string }>,
    HttpError,
    string | number,
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => adminService.rotateClientSecret(id),
    onSuccess: (...args) => {
      const [, clientId] = args
      queryClient.invalidateQueries({ queryKey: adminKeys.oidc.client(clientId) })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Get client branding
 */
export function useClientBranding(
  id: string | number | null | undefined,
  options?: Omit<UseQueryOptions<FetchResponse<any>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.oidc.branding(id!),
    queryFn: () => adminService.getClientBranding(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

/**
 * Update client branding
 */
export function useUpdateClientBranding(
  options?: UseMutationOptions<
    FetchResponse<any>,
    HttpError,
    { id: string | number; data: any },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, data }) => adminService.updateClientBranding(id, data),
    onSuccess: (...args) => {
      const [, variables] = args
      queryClient.invalidateQueries({
        queryKey: adminKeys.oidc.branding(variables.id),
      })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

// ============================================================================
// User Management Hooks
// ============================================================================

/**
 * Get all users with pagination and filters
 */
export function useUsers(
  params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
  },
  options?: Omit<
    UseQueryOptions<FetchResponse<PaginatedResponse<AdminUser>>, HttpError>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: adminKeys.users.list(params),
    queryFn: () => adminService.listUsers(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  })
}

/**
 * Get a specific user by ID
 */
export function useUser(
  id: string | number | null | undefined,
  options?: Omit<UseQueryOptions<FetchResponse<AdminUser>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.users.detail(id!),
    queryFn: () => adminService.getUser(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

/**
 * Create a new user
 */
export function useCreateUser(
  options?: UseMutationOptions<FetchResponse<AdminUser>, HttpError, CreateUserRequest, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => adminService.createUser(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Update an existing user
 */
export function useUpdateUser(
  options?: UseMutationOptions<
    FetchResponse<AdminUser>,
    HttpError,
    { id: string | number; data: UpdateUserRequest },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, data }) => adminService.updateUser(id, data),
    onSuccess: (...args) => {
      const [, variables] = args
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all })
      queryClient.invalidateQueries({ queryKey: adminKeys.users.detail(variables.id) })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Delete a user
 */
export function useDeleteUser(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, string | number, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => adminService.deleteUser(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Ban a user
 */
export function useBanUser(
  options?: UseMutationOptions<
    FetchResponse<MessageResponse>,
    HttpError,
    { id: string | number; reason?: string },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, reason }) => adminService.banUser(id, reason),
    onSuccess: (...args) => {
      const [, variables] = args
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all })
      queryClient.invalidateQueries({ queryKey: adminKeys.users.detail(variables.id) })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Unban a user
 */
export function useUnbanUser(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, string | number, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => adminService.unbanUser(id),
    onSuccess: (...args) => {
      const [, id] = args
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all })
      queryClient.invalidateQueries({ queryKey: adminKeys.users.detail(id!) })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Reset user password
 */
export function useResetUserPassword(
  options?: UseMutationOptions<
    FetchResponse<MessageResponse>,
    HttpError,
    { id: string | number; newPassword: string },
    unknown
  >,
) {
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, newPassword }) => adminService.resetUserPassword(id, newPassword),
    onSuccess: (...args) => {
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Reset user MFA
 */
export function useResetUserMfa(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, string | number, unknown>,
) {
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => adminService.resetUserMfa(id),
    onSuccess: (...args) => {
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Impersonate a user
 */
export function useImpersonateUser(
  options?: UseMutationOptions<
    FetchResponse<{ token: string }>,
    HttpError,
    string | number,
    unknown
  >,
) {
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => adminService.impersonateUser(id),
    onSuccess: (...args) => {
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

// ============================================================================
// Appeals Management Hooks
// ============================================================================

/**
 * Get appeals
 */
export function useAppeals(
  params?: { page?: number; limit?: number; status?: string },
  options?: Omit<
    UseQueryOptions<FetchResponse<PaginatedResponse<any>>, HttpError>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: adminKeys.appeals.list(params),
    queryFn: () => adminService.getAppeals(params),
    ...options,
  })
}

/**
 * Resolve an appeal
 */
export function useResolveAppeal(
  options?: UseMutationOptions<
    FetchResponse<MessageResponse>,
    HttpError,
    { id: number; data: { status: 'APPROVED' | 'DENIED'; reviewNotes?: string } },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, data }) => adminService.resolveAppeal(id, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.appeals.all })
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

// ============================================================================
// SAML Configuration Hooks
// ============================================================================

/**
 * Get SAML configuration
 */
export function useSAMLConfig(
  options?: Omit<UseQueryOptions<FetchResponse<SAMLConfig>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.saml.config(),
    queryFn: () => adminService.getSAMLConfig(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options,
  })
}

/**
 * Update SAML configuration
 */
export function useUpdateSAMLConfig(
  options?: UseMutationOptions<FetchResponse<SAMLConfig>, HttpError, Partial<SAMLConfig>, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => adminService.updateSAMLConfig(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.saml.config() })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Get SAML metadata
 */
export function useSAMLMetadata(
  options?: Omit<UseQueryOptions<FetchResponse<string>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.saml.metadata(),
    queryFn: () => adminService.getSAMLMetadata(),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

/**
 * Upload SAML metadata
 */
export function useUploadSAMLMetadata(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, File, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (file) => adminService.uploadSAMLMetadata(file),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.saml.config() })
      queryClient.invalidateQueries({ queryKey: adminKeys.saml.metadata() })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

// ============================================================================
// SSF Configuration Hooks
// ============================================================================

/**
 * Get SSF configuration
 */
export function useSSFConfig(
  options?: Omit<UseQueryOptions<FetchResponse<SSFConfig>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.ssf.config(),
    queryFn: () => adminService.getSSFConfig(),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

/**
 * Update SSF configuration
 */
export function useUpdateSSFConfig(
  options?: UseMutationOptions<FetchResponse<SSFConfig>, HttpError, Partial<SSFConfig>, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => adminService.updateSSFConfig(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.ssf.config() })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Test SSF stream
 */
export function useTestSSFStream(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, void, unknown>,
) {
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: () => adminService.testSSFStream(),
    onSuccess: (...args) => {
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Broadcast SSF event
 */
export function useBroadcastSSFEvent(
  options?: UseMutationOptions<
    FetchResponse<MessageResponse>,
    HttpError,
    { event_type: string; subject: string; payload: any },
    unknown
  >,
) {
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => adminService.broadcastSSFEvent(data),
    onSuccess: (...args) => {
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

// ============================================================================
// Domain Verification Hooks
// ============================================================================

/**
 * Verify a domain
 */
export function useVerifyDomain(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, string, unknown>,
) {
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (domain) => adminService.verifyDomain(domain),
    onSuccess: (...args) => {
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Check domain verification status
 */
export function useCheckDomain(
  options?: UseMutationOptions<FetchResponse<{ verified: boolean }>, HttpError, string, unknown>,
) {
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (domain) => adminService.checkDomain(domain),
    onSuccess: (...args) => {
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

// ============================================================================
// Dashboard Hooks
// ============================================================================

/**
 * Get admin dashboard stats
 */
export function useAdminDashboard(
  options?: Omit<
    UseQueryOptions<
      FetchResponse<{
        totalUsers: number
        activeUsers: number
        newSignups: number
        failedLogins: number
        activeSessions: number
        mfaAdoption: string
        totalBanned: number
        newBans: number
        pendingAppeals: number
        systemHealth: string
      }>,
      HttpError
    >,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: () => adminService.getDashboard(),
    staleTime: 1000 * 60 * 2,
    ...options,
  })
}

// ============================================================================
// Audit Logs Hooks
// ============================================================================

/**
 * Get audit logs with filters
 */
export function useAuditLogs(
  params?: {
    page?: number
    limit?: number
    user_id?: number
    action?: string
    start_date?: string
    end_date?: string
  },
  options?: Omit<
    UseQueryOptions<FetchResponse<{ logs: any[]; total: number; data?: any[] }>, HttpError>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: adminKeys.auditLogs(params),
    queryFn: () => adminService.getAuditLogs(params),
    staleTime: 1000 * 60 * 2,
    ...options,
  })
}

/**
 * Get impersonation audit logs
 */
export function useImpersonationLogs(
  params?: { page?: number; limit?: number },
  options?: Omit<UseQueryOptions<FetchResponse<any>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.impersonationLogs(params),
    queryFn: () => adminService.getImpersonationLogs(params),
    staleTime: 1000 * 60 * 2,
    ...options,
  })
}

// ============================================================================
// Webhook Management Hooks
// ============================================================================

/**
 * List all webhooks
 */
export function useWebhooks(
  options?: Omit<UseQueryOptions<FetchResponse<any[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.webhooks.all,
    queryFn: () => adminService.listWebhooks(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

/**
 * Get a specific webhook
 */
export function useWebhook(
  id: string | number | null | undefined,
  options?: Omit<UseQueryOptions<FetchResponse<any>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.webhooks.detail(id!),
    queryFn: () => adminService.getWebhook(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

/**
 * Create a webhook
 */
export function useCreateWebhook(
  options?: UseMutationOptions<
    FetchResponse<any>,
    HttpError,
    { url: string; events: string[]; secret?: string },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => adminService.createWebhook(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.webhooks.all })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Update a webhook
 */
export function useUpdateWebhook(
  options?: UseMutationOptions<
    FetchResponse<any>,
    HttpError,
    { id: string | number; data: any },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, data }) => adminService.updateWebhook(id, data),
    onSuccess: (...args) => {
      const [, variables] = args
      queryClient.invalidateQueries({ queryKey: adminKeys.webhooks.all })
      queryClient.invalidateQueries({ queryKey: adminKeys.webhooks.detail(variables.id) })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Delete a webhook
 */
export function useDeleteWebhook(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, string | number, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => adminService.deleteWebhook(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.webhooks.all })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Test a webhook
 */
export function useTestWebhook(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, string | number, unknown>,
) {
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => adminService.testWebhook(id),
    onSuccess: (...args) => {
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

// ============================================================================
// ── ROLES ────────────────────────────────────────────────────────────────

export function useRoles(
  options?: Omit<UseQueryOptions<FetchResponse<Role[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.rbac.all,
    queryFn: () => adminService.listRoles(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useRolePermissions(
  role: string,
  options?: Omit<UseQueryOptions<FetchResponse<Permission[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.rbac.rolePermissions(role),
    queryFn: () => adminService.getRolePermissions(role),
    enabled: !!role,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useSyncRolePermissions(
  options?: UseMutationOptions<
    FetchResponse<Role>,
    HttpError,
    { roleId: number; permissionIds: number[] },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ roleId, permissionIds }) =>
      adminService.syncRolePermissions(roleId, permissionIds),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.rbac.all })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}

// ── PERMISSIONS ──────────────────────────────────────────────────────────

export function usePermissions(
  options?: Omit<UseQueryOptions<FetchResponse<Permission[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.rbac.permissions(),
    queryFn: () => adminService.listPermissions(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useGrantPermission(
  options?: UseMutationOptions<
    FetchResponse<MessageResponse>,
    HttpError,
    { user_id: number; permission_id: number },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => adminService.grantPermission(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.rbac.all })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export function useRevokePermission(
  options?: UseMutationOptions<
    FetchResponse<MessageResponse>,
    HttpError,
    { user_id: number; permission_id: number },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => adminService.revokePermission(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.rbac.all })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}

// ── POLICIES ─────────────────────────────────────────────────────────────

export function useAccessPolicies(
  options?: Omit<UseQueryOptions<FetchResponse<AccessPolicy[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.rbac.policies(),
    queryFn: () => adminService.getAccessPolicies(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

// ============================================================================
// ── ORGANIZATIONS ────────────────────────────────────────────────────────

export function useOrganizations(
  params?: { page?: number; limit?: number; search?: string },
  options?: Omit<
    UseQueryOptions<FetchResponse<PaginatedResponse<Organization>>, HttpError>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: adminKeys.organizations.list(params),
    queryFn: () => adminService.listOrganizations(params),
    staleTime: 1000 * 60 * 2,
    ...options,
  })
}

export function useOrganization(
  id: number | null | undefined,
  options?: Omit<UseQueryOptions<FetchResponse<Organization>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.organizations.detail(id!),
    queryFn: () => adminService.getOrganization(id as number),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useCreateOrganization(
  options?: UseMutationOptions<
    FetchResponse<Organization>,
    HttpError,
    CreateOrganizationRequest,
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => adminService.createOrganization(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.organizations.all })
      onSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useUpdateOrganization(
  options?: UseMutationOptions<
    FetchResponse<Organization>,
    HttpError,
    { id: number; data: Partial<Organization> },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, data }) => adminService.updateOrganization(id, data),
    onSuccess: (...args) => {
      const [, variables] = args
      queryClient.invalidateQueries({ queryKey: adminKeys.organizations.all })
      queryClient.invalidateQueries({ queryKey: adminKeys.organizations.detail(variables.id) })
      onSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useImpersonateOrganization(
  options?: UseMutationOptions<
    FetchResponse<{ token: string; user: any }>,
    HttpError,
    number,
    unknown
  >,
) {
  return useMutation({
    mutationFn: (id) => adminService.impersonateOrganization(id),
    ...options,
  })
}

export function useDeleteOrganization(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, number, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => adminService.deleteOrganization(id),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.organizations.all })
      onSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useAddOrganizationMember(
  options?: UseMutationOptions<
    FetchResponse<OrganizationMember>,
    HttpError,
    { orgId: number; data: { user_id: number; role: string } },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ orgId, data }) => adminService.addOrganizationMember(orgId, data),
    onSuccess: (...args) => {
      const [, variables] = args
      queryClient.invalidateQueries({ queryKey: adminKeys.organizations.detail(variables.orgId) })
      onSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useRemoveOrganizationMember(
  options?: UseMutationOptions<
    FetchResponse<MessageResponse>,
    HttpError,
    { orgId: number; userId: number },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ orgId, userId }) => adminService.removeOrganizationMember(orgId, userId),
    onSuccess: (...args) => {
      const [, variables] = args
      queryClient.invalidateQueries({ queryKey: adminKeys.organizations.detail(variables.orgId) })
      onSuccess?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Get organization policies
 */
export function useOrganizationPolicies(
  orgId: number | null | undefined,
  options?: Omit<UseQueryOptions<FetchResponse<any>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [...adminKeys.organizations.detail(orgId!), 'policies'],
    queryFn: () => adminService.getOrganizationPolicies(orgId!),
    enabled: !!orgId,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

/**
 * Update organization policies
 */
export function useUpdateOrganizationPolicies(
  options?: UseMutationOptions<
    FetchResponse<any>,
    HttpError,
    { orgId: number; data: any },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orgId, data }) => adminService.updateOrganizationPolicies(orgId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...adminKeys.organizations.detail(variables.orgId), 'policies'],
      })
    },
    ...options,
  })
}

// ============================================================================
// ── PROVISIONING & SCIM ──────────────────────────────────────────────────

export function useSCIMTokens(
  options?: Omit<UseQueryOptions<FetchResponse<SCIMToken[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.scim.tokens(),
    queryFn: () => adminService.listSCIMTokens(),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

export function useCreateSCIMToken(
  options?: UseMutationOptions<
    FetchResponse<SCIMToken>,
    HttpError,
    { name: string; description?: string },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => adminService.createSCIMToken(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.scim.tokens() })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export function useRevokeSCIMToken(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, number, unknown>,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => adminService.revokeSCIMToken(id as number),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.scim.tokens() })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export function useProvisioningConnectors(
  options?: Omit<UseQueryOptions<FetchResponse<Connector[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.provisioning.connectors(),
    queryFn: () => adminService.listConnectors(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useSyncProvisioningConnector(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, number, unknown>,
) {
  return useMutation({
    mutationFn: (id) => adminService.syncConnector(id),
    ...options,
  })
}

// ============================================================================
// Admin User Action Hooks
// ============================================================================

export function useUnlockUser(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, number, unknown>,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id) => adminService.unlockUser(id as number),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}

export function useAssignRole(
  options?: UseMutationOptions<
    FetchResponse<MessageResponse>,
    HttpError,
    { id: number; roleId: number },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, roleId }) => adminService.assignRoleToUser(id as number, roleId as number),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all })
      options?.onSuccess?.(...args)
    },
    ...options,
  })
}

/**
 * Handle mass user actions
 */
export function useBulkUserAction(
  options?: UseMutationOptions<
    FetchResponse<BulkActionResult>,
    HttpError,
    BulkActionRequest,
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => adminService.bulkAction(data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users.all })
      onSuccess?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Get active sessions for a specific user
 */
export function useUserSessions(
  userId: number | string | null | undefined,
  options?: Omit<UseQueryOptions<FetchResponse<any[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: adminKeys.users.sessions(userId!),
    queryFn: () => adminService.getUserSessions(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

// ============================================================================
// ── STATISTICS & EMAILS ──────────────────────────────────────────────────

export function useMFAStats(
  options?: Omit<UseQueryOptions<FetchResponse<MFAStats>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [...adminKeys.statistics.all, 'mfa'],
    queryFn: () => adminService.getMFAStats(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useUserStats(
  options?: Omit<UseQueryOptions<FetchResponse<UserStats>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [...adminKeys.statistics.all, 'users'],
    queryFn: () => adminService.getUserStats(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useEmailTemplates(
  options?: Omit<
    UseQueryOptions<FetchResponse<EmailTemplate[]>, HttpError>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: ['admin', 'email', 'templates'],
    queryFn: () => adminService.getEmailTemplates(),
    staleTime: 1000 * 60 * 10,
    ...options,
  })
}

export function useSendTestEmail(
  options?: UseMutationOptions<
    FetchResponse<MessageResponse>,
    HttpError,
    EmailTestRequest,
    unknown
  >,
) {
  return useMutation({
    mutationFn: (data) => adminService.sendTestEmail(data),
    ...options,
  })
}

export function useExportAuditLogs(
  options?: UseMutationOptions<
    FetchResponse<Blob>,
    HttpError,
    | { start_date?: string; end_date?: string; format?: 'csv' | 'json'; user_id?: number }
    | undefined,
    unknown
  >,
) {
  return useMutation({
    mutationFn: (params) => adminService.exportAuditLogs(params),
    ...options,
  })
}
