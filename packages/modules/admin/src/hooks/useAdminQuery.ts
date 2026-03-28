import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query'
import { FetchResponse, HttpError, apiClient } from '@cap/platform-core'
import type {
  User,
  OIDCClient,
  AuditLog,
  Scope,
  CreateOIDCClientRequest,
  UpdateOIDCClientRequest,
  AdminOrganization,
  ActivityTimelineResponse,
  ExportParams,
  ProvisioningConnector,
  ProvisioningConnectorLog,
  OrganizationInvitation,
  BanAppeal,
  MemberOverride,
  UserMfa,
  DataExport,
  DataExportRequest,
  CreateUserRequest,
  UpdateUserRequest,
  CreateProvisioningConnectorRequest,
  UpdateProvisioningConnectorRequest,
} from '@cap/shared-types'
import { ENDPOINTS } from '../services/endpoints'
import { QUERY_KEYS } from '../services/query'

import type {
  SAMLConfig,
  SCIMConfig,
  JWKSKey,
  SSFConfig,
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  Permission,
  CreatePermissionRequest,
  AccessPolicy,
  CreateAccessPolicyRequest,
  RolePermissionsResponse,
} from '../types/api.types'

// Re-export or alias if needed
export type AdminUser = User
export type {
  OIDCClient,
  AuditLog,
  Scope,
  ActivityTimelineResponse,
  SAMLConfig,
  SCIMConfig,
  JWKSKey,
  ProvisioningConnector,
  ProvisioningConnectorLog,
  OrganizationInvitation,
  BanAppeal,
  MemberOverride,
  UserMfa,
  DataExport,
  DataExportRequest,
  CreateUserRequest,
  UpdateUserRequest,
  CreateProvisioningConnectorRequest,
  UpdateProvisioningConnectorRequest,
  SSFConfig,
  Role,
  CreateRoleRequest,
  UpdateRoleRequest,
  Permission,
  CreatePermissionRequest,
  AccessPolicy,
  CreateAccessPolicyRequest,
  RolePermissionsResponse,
}

export const adminKeys = QUERY_KEYS.admin

export function useAdminDashboard(
  options?: Omit<UseQueryOptions<FetchResponse, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.admin.dashboard,
    queryFn: () => apiClient.get(ENDPOINTS.admin.dashboard),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useUsers(
  params?: { page?: number; limit?: number; search?: string; status?: string; role?: string },
  options?: Omit<UseQueryOptions<FetchResponse, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.admin.users.index, params],
    queryFn: () => apiClient.get(ENDPOINTS.admin.users.index, { params }),
    staleTime: 1000 * 60 * 2,
    ...options,
  })
}

export function useUserById(
  id: number,
  options?: Omit<UseQueryOptions<FetchResponse<AdminUser>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.admin.users.byId(id),
    queryFn: () => apiClient.get(ENDPOINTS.admin.users.byId(id)),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useCreateUser(
  options?: UseMutationOptions<FetchResponse, HttpError, CreateUserRequest, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => apiClient.post(ENDPOINTS.admin.users.store, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useUpdateUser(
  options?: UseMutationOptions<FetchResponse, HttpError, { id: number; data: UpdateUserRequest }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(ENDPOINTS.admin.users.byId(id), data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useDeleteUser(
  options?: UseMutationOptions<FetchResponse, HttpError, number, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => apiClient.delete(ENDPOINTS.admin.users.byId(id)),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useBanUser(
  options?: UseMutationOptions<FetchResponse, HttpError, { id: number; reason?: string }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, reason }) => apiClient.post(ENDPOINTS.admin.users.ban(id), { reason }),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useUnbanUser(
  options?: UseMutationOptions<FetchResponse, HttpError, number, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => apiClient.post(ENDPOINTS.admin.users.unban(id)),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useResetUserPassword(
  options?: UseMutationOptions<FetchResponse, HttpError, number, unknown>,
) {
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => apiClient.post(ENDPOINTS.admin.users.resetPassword(id)),
    onSuccess: customOnSuccess,
    ...restOptions,
  })
}

export function useImpersonateUser(
  options?: UseMutationOptions<FetchResponse, HttpError, number, unknown>,
) {
  return useMutation({
    mutationFn: (id) => apiClient.post(ENDPOINTS.admin.users.impersonate(id)),
    ...options,
  })
}

export function useOrganizations(
  params?: { page?: number; limit?: number; search?: string },
  options?: Omit<UseQueryOptions<FetchResponse, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.admin.organizations.index, params],
    queryFn: () => apiClient.get(ENDPOINTS.admin.organizations.index, { params }),
    staleTime: 1000 * 60 * 2,
    ...options,
  })
}

export function useCreateOrganization(
  options?: UseMutationOptions<FetchResponse, HttpError, { name: string; slug: string; domain?: string }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => apiClient.post(ENDPOINTS.admin.organizations.store, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.organizations.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useOrganization(
  id?: number | string,
  options?: Omit<UseQueryOptions<FetchResponse<AdminOrganization>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useOrganizationById(Number(id), options)
}

export function useOrganizationById(
  id: number,
  options?: Omit<UseQueryOptions<FetchResponse<AdminOrganization>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.admin.organizations.byId(id),
    queryFn: () => apiClient.get(ENDPOINTS.admin.organizations.byId(id)),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useDeleteOrganization(
  options?: UseMutationOptions<FetchResponse, HttpError, number, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => apiClient.delete(ENDPOINTS.admin.organizations.byId(id)),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.organizations.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useImpersonateOrganization(
  options?: UseMutationOptions<FetchResponse, HttpError, number, unknown>,
) {
  return useMutation({
    mutationFn: (id) => apiClient.post(ENDPOINTS.admin.organizations.impersonate(id)),
    ...options,
  })
}

export function useUploadOrganizationLogo(
  options?: UseMutationOptions<FetchResponse, HttpError, { id: number; logo: File }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, logo }) =>
      apiClient.uploadFormData(ENDPOINTS.admin.organizations.logo(id), { logo }, 'post'),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.organizations.index }),
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useInviteOrganizationMember(
  options?: UseMutationOptions<FetchResponse, HttpError, { orgId: number; email: string; role: string }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ orgId, email, role }) =>
      apiClient.post(ENDPOINTS.admin.organizations.invite(orgId), { email, role }),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.organizations.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useRevokeOrganizationInvitation(
  options?: UseMutationOptions<FetchResponse, HttpError, { orgId: number; invitationId: number | string }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ orgId, invitationId }) =>
      apiClient.post(ENDPOINTS.admin.organizations.revokeInvitation(orgId, invitationId)),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.organizations.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useAuditLogs(
  params?: { page?: number; limit?: number; user_id?: number; action?: string; userId?: number },
  options?: Omit<UseQueryOptions<FetchResponse<ActivityTimelineResponse>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.admin.auditLogs.index, params],
    queryFn: () => apiClient.get(ENDPOINTS.admin.auditLogs.index, { params }),
    staleTime: 1000 * 60 * 1,
    ...options,
  })
}

export function useExportAuditLogs(
  options?: UseMutationOptions<FetchResponse, HttpError, ExportParams, unknown>,
) {
  return useMutation({
    mutationFn: (params) => apiClient.post(ENDPOINTS.admin.auditLogs.export, params),
    ...options,
  })
}

export function useImpersonationLogs(
  params?: { page?: number; limit?: number },
  options?: Omit<UseQueryOptions<FetchResponse, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.admin.impersonationLogs, params],
    queryFn: () => apiClient.get(ENDPOINTS.admin.impersonationLogs, { params }),
    staleTime: 1000 * 60 * 2,
    ...options,
  })
}

export function useAppeals(
  options?: Omit<UseQueryOptions<FetchResponse, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.admin.appeals.index,
    queryFn: () => apiClient.get(ENDPOINTS.admin.appeals.index),
    staleTime: 1000 * 60 * 2,
    ...options,
  })
}

export function useResolveAppeal(
  options?: UseMutationOptions<FetchResponse, HttpError, { id: number; action: 'approved' | 'rejected' }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, action }) => apiClient.post(ENDPOINTS.admin.appeals.resolve(id), { action }),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.appeals.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useOIDCClients(
  options?: Omit<UseQueryOptions<FetchResponse<OIDCClient[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.admin.clients.index,
    queryFn: () => apiClient.get(ENDPOINTS.admin.clients.index),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useOIDCClient(
  id?: string,
  options?: Omit<UseQueryOptions<FetchResponse<OIDCClient>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.admin.clients.byId(id!),
    queryFn: () => apiClient.get(ENDPOINTS.admin.clients.byId(id!)),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useCreateOIDCClient(
  options?: UseMutationOptions<FetchResponse, HttpError, CreateOIDCClientRequest, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => apiClient.post(ENDPOINTS.admin.clients.store, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.clients.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useUpdateOIDCClient(
  options?: UseMutationOptions<FetchResponse, HttpError, { id: string | number; data: Partial<OIDCClient> }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(ENDPOINTS.admin.clients.update(String(id)), data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.clients.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useDeleteOIDCClient(
  options?: UseMutationOptions<FetchResponse, HttpError, string, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => apiClient.delete(ENDPOINTS.admin.clients.destroy(id)),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.clients.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useRotateClientSecret(
  options?: UseMutationOptions<FetchResponse, HttpError, string, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => apiClient.post(ENDPOINTS.admin.clients.rotateSecret(id)),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.clients.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useScopes(
  options?: Omit<UseQueryOptions<FetchResponse<Scope[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.admin.scopes.index,
    queryFn: () => apiClient.get(ENDPOINTS.admin.scopes.list),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useCreateScope(
  options?: UseMutationOptions<FetchResponse, HttpError, { name: string; description?: string }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => apiClient.post(ENDPOINTS.admin.scopes.store, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.scopes.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useUpdateScope(
  options?: UseMutationOptions<FetchResponse, HttpError, { id: number; data: Partial<Scope> }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(ENDPOINTS.admin.scopes.update(id), data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.scopes.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useDeleteScope(
  options?: UseMutationOptions<FetchResponse, HttpError, number, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => apiClient.delete(ENDPOINTS.admin.scopes.destroy(id)),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.scopes.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useSAMLConfig(
  options?: Omit<UseQueryOptions<FetchResponse<SAMLConfig>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.admin.saml.config,
    queryFn: () => apiClient.get(ENDPOINTS.admin.saml.config),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useUpdateSAMLConfig(
  options?: UseMutationOptions<FetchResponse, HttpError, SAMLConfig, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => apiClient.post(ENDPOINTS.admin.saml.config, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.saml.config })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useUploadSAMLMetadata(
  options?: UseMutationOptions<FetchResponse, HttpError, File, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (file) =>
      apiClient.uploadFormData(ENDPOINTS.admin.saml.uploadMetadata, { metadata: file }, 'post'),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.saml.config })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useSCIMConfig(
  options?: Omit<UseQueryOptions<FetchResponse<SCIMConfig>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.admin.scim.config,
    queryFn: () => apiClient.get(ENDPOINTS.admin.scim.config),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useUpdateOrganizationScimConfig(
  options?: UseMutationOptions<FetchResponse, HttpError, { orgId: number; config: SCIMConfig }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ orgId, config }) => apiClient.patch(ENDPOINTS.admin.scim.config, { ...config, organizationId: orgId }),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.scim.config })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useTestSCIMConnection(
  options?: UseMutationOptions<FetchResponse, HttpError, SCIMConfig, unknown>,
) {
  return useMutation({
    mutationFn: (config) => apiClient.post(ENDPOINTS.admin.scim.config, { ...config, test: true }),
    ...options,
  })
}

export function useJWKSKeys(
  options?: Omit<UseQueryOptions<FetchResponse<JWKSKey[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.admin.jwks.index,
    queryFn: () => apiClient.get(ENDPOINTS.admin.jwks.index),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useGetJWKSKeyDetail(
  kid: string,
  options?: Omit<UseQueryOptions<FetchResponse<JWKSKey>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.admin.jwks.index, kid],
    queryFn: () => apiClient.get(ENDPOINTS.admin.jwks.show(kid)),
    enabled: !!kid,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useCreateJWKSKey(
  options?: UseMutationOptions<FetchResponse, HttpError, { alg: string; use: string }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => apiClient.post(ENDPOINTS.admin.jwks.store, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.jwks.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useRotateJWKS(
  options?: UseMutationOptions<FetchResponse, HttpError, void, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: () => apiClient.post(ENDPOINTS.admin.jwks.rotate),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.jwks.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useDeleteJWKSKey(
  options?: UseMutationOptions<FetchResponse, HttpError, string, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (kid) => apiClient.delete(ENDPOINTS.admin.jwks.destroy(kid)),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.jwks.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useProvisioningConnectors(
  options?: Omit<UseQueryOptions<FetchResponse<ProvisioningConnector[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.admin.provisioning.connectors,
    queryFn: () => apiClient.get(ENDPOINTS.admin.provisioning.connectors),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useCreateProvisioningConnector(
  options?: UseMutationOptions<FetchResponse, HttpError, CreateProvisioningConnectorRequest, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => apiClient.post(ENDPOINTS.admin.provisioning.store, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.provisioning.connectors })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useUpdateProvisioningConnector(
  options?: UseMutationOptions<FetchResponse, HttpError, { id: number; data: UpdateProvisioningConnectorRequest }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(ENDPOINTS.admin.provisioning.update(id), data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.provisioning.connectors })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useDeleteProvisioningConnector(
  options?: UseMutationOptions<FetchResponse, HttpError, number, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => apiClient.delete(ENDPOINTS.admin.provisioning.destroy(id)),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.provisioning.connectors })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useSyncProvisioningConnector(
  options?: UseMutationOptions<FetchResponse, HttpError, number, unknown>,
) {
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => apiClient.post(ENDPOINTS.admin.provisioning.sync(id)),
    onSuccess: customOnSuccess,
    ...restOptions,
  })
}

export function useProvisioningConnectorLogs(
  connectorId: number,
  options?: Omit<UseQueryOptions<FetchResponse<ProvisioningConnectorLog[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.admin.provisioning.connectors, 'logs', connectorId],
    queryFn: () => apiClient.get(ENDPOINTS.admin.provisioning.connectorLogs(connectorId)),
    enabled: !!connectorId,
    staleTime: 1000 * 60 * 2,
    ...options,
  })
}

export function useSSFConfig(
  options?: Omit<UseQueryOptions<FetchResponse, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.admin.ssf.config,
    queryFn: () => apiClient.get(ENDPOINTS.admin.ssf.config),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useUpdateSSFConfig(
  options?: UseMutationOptions<FetchResponse, HttpError, Partial<SSFConfig>, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => apiClient.post(ENDPOINTS.admin.ssf.updateConfig, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.ssf.config })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useTestSSFStream(
  options?: UseMutationOptions<FetchResponse, HttpError, { message: string }, unknown>,
) {
  return useMutation({
    mutationFn: (data) => apiClient.post(ENDPOINTS.admin.ssf.test, data),
    ...options,
  })
}

export function useSSFHistory(
  options?: Omit<UseQueryOptions<FetchResponse, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.admin.ssf.config, 'history'],
    queryFn: () => apiClient.get(ENDPOINTS.admin.ssf.broadcast),
    staleTime: 1000 * 60 * 2,
    ...options,
  })
}

export function useUser(id?: number | string) {
  return useUserById(Number(id))
}

export function useGetUser(id?: number | string) {
  return useUserById(Number(id))
}

export function useResetUserMfa(
  options?: UseMutationOptions<FetchResponse, HttpError, number | string, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => apiClient.post(ENDPOINTS.admin.users.resetMfa(Number(id))),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useMemberOverrides(
  userId: number,
  orgId: number,
  options?: Omit<UseQueryOptions<FetchResponse<MemberOverride[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.admin.users.byId(userId), 'overrides', orgId],
    queryFn: () => apiClient.get(ENDPOINTS.rbac.members.overrides(userId)),
    enabled: !!userId && !!orgId,
    ...options,
  })
}

export function useAddMemberOverride(
  options?: UseMutationOptions<
    FetchResponse,
    HttpError,
    { userId: number; orgId: number; data: { permissionId: number; grant: boolean } },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ userId, orgId, data }) =>
      apiClient.post(ENDPOINTS.rbac.members.addOverride(userId), data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.admin.users.byId(args[1].userId), 'overrides', args[1].orgId],
      })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useRemoveMemberOverride(
  options?: UseMutationOptions<
    FetchResponse,
    HttpError,
    { userId: number; orgId: number; overrideId: number },
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ userId, orgId, overrideId }) =>
      apiClient.delete(ENDPOINTS.rbac.members.removeOverride(userId, overrideId)),
    onSuccess: (...args) => {
      const variables = args[1]
      queryClient.invalidateQueries({
        queryKey: [...QUERY_KEYS.admin.users.byId(variables.userId), 'overrides', variables.orgId],
      })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useDataExports(
  userId: number,
  options?: Omit<UseQueryOptions<FetchResponse<DataExport[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: [...QUERY_KEYS.admin.users.index, userId, 'data-exports'],
    queryFn: () => apiClient.get(ENDPOINTS.admin.users.dataExports(userId)),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useRequestDataExport(
  options?: UseMutationOptions<FetchResponse, HttpError, number, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (userId) => apiClient.post(ENDPOINTS.admin.users.requestDataExport(userId)),
    onSuccess: (data, userId, ...args) => {
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.admin.users.index, userId, 'data-exports'] })
      customOnSuccess?.(data, userId, ...args)
    },
    ...restOptions,
  })
}

// ==================== RBAC Hooks ====================

export function useRoles(
  options?: Omit<UseQueryOptions<FetchResponse<Role[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.rbac.roles.index,
    queryFn: () => apiClient.get(ENDPOINTS.rbac.roles.list),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useRole(
  id: number,
  options?: Omit<UseQueryOptions<FetchResponse<Role>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.rbac.roles.byId(id),
    queryFn: () => apiClient.get(ENDPOINTS.rbac.roles.byId(id)),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useCreateRole(
  options?: UseMutationOptions<FetchResponse, HttpError, CreateRoleRequest, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => apiClient.post(ENDPOINTS.rbac.roles.store, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rbac.roles.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useUpdateRole(
  options?: UseMutationOptions<FetchResponse, HttpError, { id: number; data: UpdateRoleRequest }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ id, data }) => apiClient.patch(ENDPOINTS.rbac.roles.update(id), data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rbac.roles.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useDeleteRole(
  options?: UseMutationOptions<FetchResponse, HttpError, number, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (id) => apiClient.delete(ENDPOINTS.rbac.roles.destroy(id)),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rbac.roles.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useRolePermissions(
  role: string,
  options?: Omit<UseQueryOptions<FetchResponse<RolePermissionsResponse>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.rbac.roles.permissions(role),
    queryFn: () => apiClient.get(ENDPOINTS.rbac.roles.permissions(role)),
    enabled: !!role,
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useSyncRolePermissions(
  options?: UseMutationOptions<FetchResponse, HttpError, { roleId: number; permissions: string[] }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ roleId, permissions }) =>
      apiClient.put(ENDPOINTS.rbac.roles.syncPermissions(roleId), { permissions }),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rbac.roles.all })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function usePermissions(
  options?: Omit<UseQueryOptions<FetchResponse<Permission[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.rbac.permissions.index,
    queryFn: () => apiClient.get(ENDPOINTS.rbac.permissions.list),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useCreatePermission(
  options?: UseMutationOptions<FetchResponse, HttpError, CreatePermissionRequest, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => apiClient.post(ENDPOINTS.rbac.permissions.store, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rbac.permissions.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useAccessPolicies(
  options?: Omit<UseQueryOptions<FetchResponse<AccessPolicy[]>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: QUERY_KEYS.rbac.accessPolicies,
    queryFn: () => apiClient.get(ENDPOINTS.rbac.accessPolicies),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useCreateAccessPolicy(
  options?: UseMutationOptions<FetchResponse, HttpError, CreateAccessPolicyRequest, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => apiClient.post(ENDPOINTS.rbac.accessPolicies, data),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.rbac.accessPolicies })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

export function useAssignUserRole(
  options?: UseMutationOptions<FetchResponse, HttpError, { userId: number; role: string }, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: ({ userId, role }) =>
      apiClient.post(ENDPOINTS.rbac.users.assignRole, { userId, role }),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.admin.users.index })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}
