import type { IRole } from '@cap/shared-types'
import type { SAMLConfig, JWKSKey } from '@cap/module-auth'
export type { SAMLConfig, JWKSKey }

export type {
  AdminOrganization,
  BanAppeal,
  DataExport,
  DataExportRequest,
  AuditLog,
  ActivityTimelineResponse,
  ExportParams,
  User,
  UserQueryParams,
  UserMfa,
  MemberOverride,
  CreateUserRequest,
  UpdateUserRequest,
} from '@cap/shared-types'

export interface OIDCClient {
  id: string | number
  name: string
  client_name?: string
  type?: string
  description?: string
  client_id: string
  client_secret?: string
  redirect_uris: string[]
  post_logout_redirect_uris?: string[]
  grant_types: string[]
  response_types: string[]
  scope: string
  status?: string
  is_fapi_compliant?: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateOIDCClientRequest {
  name: string
  redirectUris: string[]
  grantTypes?: string[]
  responseTypes?: string[]
  branding?: unknown
}

export interface UpdateOIDCClientRequest {
  name?: string
  description?: string
  redirectUris?: string[]
  grantTypes?: string[]
  responseTypes?: string[]
  is_active?: boolean
  is_fapi_compliant?: boolean
  branding?: unknown
}

export interface Scope {
  id: number
  name: string
  description?: string
  isDefault?: boolean
}

export interface SCIMConfig {
  id: number
  endpoint: string
  token: string
  isActive: boolean
}

export interface ProvisioningConnector {
  id: number
  name: string
  type: string
  status: string
  lastSync?: string
}

export interface ProvisioningConnectorLog {
  id: number
  connectorId: number
  status: string
  message: string
  timestamp: string
}

export interface OrganizationInvitation {
  id: number
  email: string
  role: string
  status: string
  expiresAt: string
}

export interface ProvisioningConnectorConfig {
  baseUrl?: string
  token?: string
  syncInterval?: number
  attributeMapping?: Record<string, string>
}

export interface CreateProvisioningConnectorRequest {
  name: string
  type: string
  config?: ProvisioningConnectorConfig
}

export interface UpdateProvisioningConnectorRequest {
  name?: string
  status?: string
  config?: Partial<ProvisioningConnectorConfig>
}

export interface SSFConfig {
  id?: number
  iss?: string
  aud?: string
  deliveryMethods?: string[]
  streamStatus?: 'active' | 'inactive' | 'error'
  lastEventAt?: string
}

export interface Role {
  id: number
  name: string
  description?: string
  isSystem?: boolean
  userCount?: number
  permissions?: Permission[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateRoleRequest {
  name: string
  description?: string
  permissions?: string[]
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
}

export interface Permission {
  id: number
  name: string
  resource: string
  action: string
  description?: string
}

export interface CreatePermissionRequest {
  name: string
  resource: string
  action: string
  description?: string
}

export interface AccessPolicy {
  id: number
  name: string
  description?: string
  rules: AccessPolicyRule[]
  createdAt?: string
  updatedAt?: string
}

export interface AccessPolicyRule {
  resource: string
  action: string
  effect: 'allow' | 'deny'
  conditions?: Record<string, unknown>
}

export interface CreateAccessPolicyRequest {
  name: string
  description?: string
  rules: AccessPolicyRule[]
}

export interface RolePermissionsResponse {
  role: string
  permissions: string[]
}
