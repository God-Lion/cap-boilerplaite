import { apiClient, FetchResponse, PaginatedResponse } from '@cap/platform-core'
import { ENDPOINTS } from './endpoints'

// ============================================================================
// Type Definitions
// ============================================================================

// ── RBAC ──────────────────────────────────────────────────────────────────
export interface Role {
  id: number
  name: string
  guard_name: string
  description: string | null
  permissions: Permission[]
  users_count?: number
  created_at: string
  updated_at: string
}

export interface Permission {
  id: number
  name: string
  guard_name: string
  resource?: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface RolePermissionSyncRequest {
  permission_ids: number[]
}

export interface MemberOverride {
  permission_id: number
  effect: 'allow' | 'deny'
}

export interface AccessPolicy {
  id?: number
  resource: string
  actions: string[]
  effect: 'allow' | 'deny'
  priority?: number
  conditions?: Record<string, unknown>
}

// ── Organizations ──────────────────────────────────────────────────────────
export interface Organization {
  id: number
  name: string
  slug: string
  status?: string
  domain: string | null
  logo_url: string | null
  members_count: number
  created_at: string
  updated_at: string
  primaryColor?: string
  secondaryColor?: string
  enforceMfa?: boolean
  ssoOnly?: boolean
  allowPublicSignup?: boolean
}

export interface OrganizationMember {
  id: number
  user_id: number
  organization_id: number
  role: string
  user: {
    id: number
    email: string
    full_name: string
    avatar_url: string | null
  }
  joined_at: string
}

export interface OrganizationInvitation {
  id: number
  email: string
  role: string
  status: 'pending' | 'accepted' | 'expired'
  expires_at: string
  created_at: string
}

export interface CreateOrganizationRequest {
  name: string
  slug: string
  domain?: string
}

export interface InviteToOrganizationRequest {
  email: string
  role: string
  message?: string
}

// ── Provisioning ───────────────────────────────────────────────────────────
export interface Connector {
  id: number
  name: string
  type: 'scim' | 'ldap' | 'azure_ad' | 'okta' | 'google'
  status: 'active' | 'inactive' | 'error'
  last_sync_at: string | null
  sync_count: number
  error_message: string | null
  config: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ConnectorLog {
  id: number
  connector_id: number
  action: string
  status: 'success' | 'error' | 'warning'
  details: string
  records_processed: number
  created_at: string
}

export interface SCIMToken {
  id: number
  name: string
  description: string | null
  last_used_at: string | null
  created_at: string
  // token only present on creation
  token?: string
}

// ── Email ──────────────────────────────────────────────────────────────────
export interface EmailTemplate {
  id: string
  name: string
  subject: string
  preview_text: string
  category: string
  last_modified: string
}

export interface EmailTestRequest {
  template_id: string
  recipient: string
  variables?: Record<string, string>
}

// ── Statistics ─────────────────────────────────────────────────────────────
export interface MFAStats {
  total_enabled: number
  totp_count: number
  passkey_count: number
  adoption_rate: number
  daily_challenges: Array<{ date: string; count: number }>
}

export interface UserStats {
  total: number
  active: number
  inactive: number
  banned: number
  new_today: number
  new_this_week: number
}

// ── Bulk Actions ───────────────────────────────────────────────────────────
export type BulkActionType = 'activate' | 'deactivate' | 'delete' | 'assign_role' | 'ban'

export interface BulkActionRequest {
  ids: number[]
  action: BulkActionType
  payload?: { role_id?: number; reason?: string }
}

export interface BulkActionResult {
  succeeded: number[]
  failed: Array<{ id: number; reason: string }>
}

export interface OIDCClient {
  id: string | number
  client_id: string
  client_name: string
  client_secret?: string
  type: string
  description: string | null
  status: string
  scopes: string[]
  redirect_uris: string[]
  grant_types: string[]
  response_types: string[]
  token_endpoint_auth_method: string
  is_fapi_compliant: boolean
  created_at: string
  updated_at: string
}

export interface CreateOIDCClientRequest {
  client_name: string
  redirect_uris: string[]
  grant_types?: string[]
  response_types?: string[]
  scope?: string
  token_endpoint_auth_method?: string
  is_fapi_compliant?: boolean
}

export interface UpdateOIDCClientRequest {
  client_name?: string
  redirect_uris?: string[]
  grant_types?: string[]
  response_types?: string[]
  scope?: string
  token_endpoint_auth_method?: string
  is_fapi_compliant?: boolean
}

export interface AdminUser {
  id: number
  email: string
  firstName: string
  lastName: string
  role: number
  phone: string | null
  sexe: string | null
  avatarUrl: string | null
  isActif: boolean
  emailVerified: boolean | string | null
  emailVerifiedAt: string | null
  isTermsSign: boolean
  mfaEnabled: boolean
  mfaEnrolledAt: string | null
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED' | string
  suspendedReason?: string | null
  isAdmin: boolean
  apiAccessEnabled: boolean
  maintenanceModeBypass: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  email: string
  password: string
  firstname: string
  lastname: string
  role_id?: number
}

export interface UpdateUserRequest {
  email?: string
  firstname?: string
  lastname?: string
  role_id?: number
  is_active?: boolean
  apiAccessEnabled?: boolean
  maintenanceModeBypass?: boolean
}

export interface SAMLConfig {
  entity_id: string
  sso_url: string
  slo_url?: string
  certificate: string
  name_id_format: string
  want_assertions_signed: boolean
  want_response_signed: boolean
}

export interface SSFConfig {
  issuer: string
  audience: string
  delivery_method: string
  events_supported: string[]
  events_delivered: string[]
}

export interface MessageResponse {
  message: string
}

// ============================================================================
// Admin Service Class
// ============================================================================

class AdminService {
  // ==========================================================================
  // OIDC Client Management
  // ==========================================================================

  /**
   * Get all OIDC clients
   */
  async listOIDCClients(): Promise<FetchResponse<OIDCClient[]>> {
    return apiClient.get<OIDCClient[]>('/api/admin/clients')
  }

  /**
   * Get a specific OIDC client by ID
   */
  async getOIDCClient(id: string | number): Promise<FetchResponse<OIDCClient>> {
    return apiClient.get<OIDCClient>(`/api/admin/clients/${id}`)
  }

  /**
   * Create a new OIDC client
   */
  async createOIDCClient(data: CreateOIDCClientRequest): Promise<FetchResponse<OIDCClient>> {
    return apiClient.post<OIDCClient>('/api/admin/clients', data)
  }

  /**
   * Update an existing OIDC client
   */
  async updateOIDCClient(
    id: string | number,
    data: UpdateOIDCClientRequest,
  ): Promise<FetchResponse<OIDCClient>> {
    return apiClient.patch<OIDCClient>(`/api/admin/clients/${id}`, data)
  }

  /**
   * Delete an OIDC client
   */
  async deleteOIDCClient(id: string | number): Promise<FetchResponse<MessageResponse>> {
    return apiClient.delete<MessageResponse>(`/api/admin/clients/${id}`)
  }

  /**
   * Rotate client secret
   */
  async rotateClientSecret(id: string | number): Promise<FetchResponse<{ client_secret: string }>> {
    return apiClient.post<{ client_secret: string }>(`/api/admin/clients/${id}/rotate-secret`)
  }

  /**
   * Get client branding
   */
  async getClientBranding(id: string | number): Promise<FetchResponse<any>> {
    return apiClient.get(`/api/admin/clients/${id}/branding`)
  }

  /**
   * Update client branding
   */
  async updateClientBranding(id: string | number, data: any): Promise<FetchResponse<any>> {
    return apiClient.patch(`/api/admin/clients/${id}/branding`, data)
  }

  // ==========================================================================
  // User Management
  // ==========================================================================

  /**
   * Get all users with optional filters
   */
  async listUsers(params?: {
    page?: number
    limit?: number
    search?: string
    role?: string
    status?: string
  }): Promise<FetchResponse<PaginatedResponse<AdminUser>>> {
    return apiClient.get('/api/admin/users', { params })
  }

  /**
   * Get a specific user by ID
   */
  async getUser(id: string | number): Promise<FetchResponse<AdminUser>> {
    return apiClient.get<AdminUser>(`/api/admin/users/${id}`)
  }

  /**
   * Create a new user
   */
  async createUser(data: CreateUserRequest): Promise<FetchResponse<AdminUser>> {
    return apiClient.post<AdminUser>('/api/admin/users', data)
  }

  /**
   * Update an existing user
   */
  async updateUser(
    id: string | number,
    data: UpdateUserRequest,
  ): Promise<FetchResponse<AdminUser>> {
    return apiClient.put<AdminUser>(`/api/admin/users/${id}`, data)
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string | number): Promise<FetchResponse<MessageResponse>> {
    return apiClient.delete<MessageResponse>(`/api/admin/users/${id}`)
  }

  /**
   * Ban a user
   */
  async banUser(id: string | number, reason?: string): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.admin.users.suspend(id as number), { reason })
  }

  /**
   * Unban a user
   */
  async unbanUser(id: string | number, _reason?: string): Promise<FetchResponse<MessageResponse>> {
    return apiClient.patch<MessageResponse>(ENDPOINTS.admin.users.unsuspend(id as number))
  }

  /**
   * Reset user password
   */
  async resetUserPassword(
    id: string | number,
    newPassword?: string,
  ): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.admin.users.resetPassword(id as number), {
      password: newPassword,
    })
  }

  /**
   * Reset user MFA
   */
  async resetUserMfa(id: string | number): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.admin.users.resetMfa(id as number))
  }

  /**
   * Impersonate a user
   */
  async impersonateUser(id: string | number): Promise<FetchResponse<{ token: string }>> {
    return apiClient.post<{ token: string }>(`/api/admin/users/${id}/impersonate`)
  }

  /**
   * Unlock a user account
   */
  async unlockUser(id: number): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.admin.users.unlock(id))
  }

  /**
   * Assign a role to a user
   */
  async assignRoleToUser(userId: number, roleId: number): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.admin.users.assignRole(userId), {
      role_id: roleId,
    })
  }

  /**
   * Handle mass user actions
   */
  async bulkAction(data: BulkActionRequest): Promise<FetchResponse<BulkActionResult>> {
    return apiClient.post<BulkActionResult>(ENDPOINTS.admin.users.bulkAction, data)
  }

  /**
   * Get active sessions for a specific user
   */
  async getUserSessions(id: number | string): Promise<FetchResponse<any[]>> {
    return apiClient.get<any[]>(ENDPOINTS.admin.users.sessions(id as number))
  }

  // ==========================================================================
  // SAML Configuration
  // ==========================================================================

  /**
   * Get SAML configuration
   */
  async getSAMLConfig(): Promise<FetchResponse<SAMLConfig>> {
    return apiClient.get<SAMLConfig>('/api/admin/saml/config')
  }

  /**
   * Update SAML configuration
   */
  async updateSAMLConfig(data: Partial<SAMLConfig>): Promise<FetchResponse<SAMLConfig>> {
    return apiClient.put<SAMLConfig>('/api/admin/saml/config', data)
  }

  /**
   * Get SAML metadata
   */
  async getSAMLMetadata(): Promise<FetchResponse<string>> {
    return apiClient.get<string>('/api/admin/saml/metadata')
  }

  /**
   * Upload IdP metadata
   */
  async uploadSAMLMetadata(file: File): Promise<FetchResponse<MessageResponse>> {
    return apiClient.uploadFormData<MessageResponse>(
      '/api/admin/saml/metadata/upload',
      { metadata: file },
      'post',
    )
  }

  // ==========================================================================
  // SSF Configuration
  // ==========================================================================

  /**
   * Get SSF configuration
   */
  async getSSFConfig(): Promise<FetchResponse<SSFConfig>> {
    return apiClient.get<SSFConfig>('/api/admin/ssf/config')
  }

  /**
   * Update SSF configuration
   */
  async updateSSFConfig(data: Partial<SSFConfig>): Promise<FetchResponse<SSFConfig>> {
    return apiClient.put<SSFConfig>('/api/admin/ssf/config', data)
  }

  /**
   * Test SSF stream
   */
  async testSSFStream(): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>('/api/admin/ssf/test')
  }

  /**
   * Broadcast SSF event
   */
  async broadcastSSFEvent(data: {
    event_type: string
    subject: string
    payload: any
  }): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>('/api/admin/ssf/broadcast', data)
  }

  // ==========================================================================
  // Domain Verification
  // ==========================================================================

  /**
   * Verify a domain
   */
  async verifyDomain(domain: string): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>('/api/admin/domains/verify', { domain })
  }

  /**
   * Check domain verification status
   */
  async checkDomain(domain: string): Promise<FetchResponse<{ verified: boolean }>> {
    return apiClient.post<{ verified: boolean }>('/api/admin/domains/check', { domain })
  }

  // ==========================================================================
  // Audit Logs
  // ==========================================================================

  /**
   * Get admin dashboard stats
   */
  async getDashboard(): Promise<
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
    }>
  > {
    return apiClient.get('/api/admin/dashboard')
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(params?: {
    page?: number
    limit?: number
    user_id?: number
    action?: string
    start_date?: string
    end_date?: string
  }): Promise<FetchResponse<any>> {
    return apiClient.get('/api/admin/audit-logs', { params })
  }

  /**
   * Get impersonation audit logs
   */
  async getImpersonationLogs(params?: {
    page?: number
    limit?: number
  }): Promise<FetchResponse<any>> {
    return apiClient.get('/api/admin/audit-logs', {
      params: { ...params, action: 'USER_IMPERSONATION_START' },
    })
  }

  /**
   * Export audit logs
   */

  /**
   * Get system statistics summary
   */
  async getStatisticsSummary(): Promise<FetchResponse<any>> {
    return apiClient.get('/api/admin/statistics/summary')
  }

  // ==========================================================================
  // Webhooks
  // ==========================================================================

  /**
   * List all webhooks
   */
  async listWebhooks(): Promise<FetchResponse<any[]>> {
    return apiClient.get('/api/admin/webhooks')
  }

  /**
   * Get webhook details
   */
  async getWebhook(id: string | number): Promise<FetchResponse<any>> {
    return apiClient.get(`/api/admin/webhooks/${id}`)
  }

  /**
   * Create a webhook
   */
  async createWebhook(data: {
    url: string
    events: string[]
    secret?: string
  }): Promise<FetchResponse<any>> {
    return apiClient.post('/api/admin/webhooks', data)
  }

  /**
   * Update a webhook
   */
  async updateWebhook(id: string | number, data: any): Promise<FetchResponse<any>> {
    return apiClient.patch(`/api/admin/webhooks/${id}`, data)
  }

  /**
   * Delete a webhook
   */
  async deleteWebhook(id: string | number): Promise<FetchResponse<MessageResponse>> {
    return apiClient.delete<MessageResponse>(`/api/admin/webhooks/${id}`)
  }

  /**
   * Test a webhook
   */
  async testWebhook(id: string | number): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(`/api/admin/webhooks/${id}/test`)
  }

  // ==========================================================================
  // Ban Appeals
  // ==========================================================================

  async getAppeals(params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<FetchResponse<PaginatedResponse<any>>> {
    return apiClient.get(ENDPOINTS.admin.appeals.index, { params })
  }

  async resolveAppeal(
    id: number,
    data: { status: 'APPROVED' | 'DENIED'; reviewNotes?: string },
  ): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.admin.appeals.resolve(id), data)
  }

  // ==========================================================================
  // RBAC — Roles
  // ==========================================================================

  /** List all roles */
  async listRoles(): Promise<FetchResponse<Role[]>> {
    return apiClient.get<Role[]>(ENDPOINTS.rbac.roles.list)
  }

  /** Create a new role */
  async createRole(data: {
    name: string
    guard_name?: string
    description?: string
  }): Promise<FetchResponse<Role>> {
    return apiClient.post<Role>(ENDPOINTS.rbac.roles.store, data)
  }

  /** Update a role */
  async updateRole(
    id: number,
    data: { name?: string; description?: string },
  ): Promise<FetchResponse<Role>> {
    return apiClient.patch<Role>(ENDPOINTS.rbac.roles.update(id), data)
  }

  /** Delete a role */
  async deleteRole(id: number): Promise<FetchResponse<MessageResponse>> {
    return apiClient.delete<MessageResponse>(ENDPOINTS.rbac.roles.destroy(id))
  }

  /** Get all permissions assigned to a role */
  async getRolePermissions(role: string): Promise<FetchResponse<Permission[]>> {
    return apiClient.get<Permission[]>(ENDPOINTS.rbac.roles.permissions(role))
  }

  /** Assign one permission to a role */
  async assignPermissionToRole(data: {
    role_id: number
    permission_id: number
  }): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.rbac.roles.assignPermission, data)
  }

  /** Replace all permissions on a role atomically */
  async syncRolePermissions(roleId: number, permissionIds: number[]): Promise<FetchResponse<Role>> {
    return apiClient.put<Role>(ENDPOINTS.rbac.roles.syncPermissions(roleId), {
      permission_ids: permissionIds,
    })
  }

  // ==========================================================================
  // RBAC — Permissions
  // ==========================================================================

  async listPermissions(): Promise<FetchResponse<Permission[]>> {
    return apiClient.get<Permission[]>(ENDPOINTS.rbac.permissions.list)
  }

  async getPermission(id: number): Promise<FetchResponse<Permission>> {
    return apiClient.get<Permission>(ENDPOINTS.rbac.permissions.byId(id))
  }

  async createPermission(data: {
    name: string
    guard_name?: string
    description?: string
  }): Promise<FetchResponse<Permission>> {
    return apiClient.post<Permission>(ENDPOINTS.rbac.permissions.store, data)
  }

  async grantPermission(data: {
    user_id: number
    permission_id: number
  }): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.rbac.permissions.grant, data)
  }

  async revokePermission(data: {
    user_id: number
    permission_id: number
  }): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.rbac.permissions.revoke, data)
  }

  // ==========================================================================
  // RBAC — Access Policies & Overrides
  // ==========================================================================

  /**
   * Get access policies
   */
  async getAccessPolicies(): Promise<FetchResponse<AccessPolicy[]>> {
    return apiClient.get<AccessPolicy[]>(ENDPOINTS.rbac.accessPolicies)
  }

  /**
   * Save access policies
   */
  async saveAccessPolicies(policies: AccessPolicy[]): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.rbac.accessPolicies, { policies })
  }

  async addMemberOverride(
    memberId: number,
    override: MemberOverride,
  ): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.rbac.members.addOverride(memberId), override)
  }

  async removeMemberOverride(
    memberId: number,
    permissionId: number,
  ): Promise<FetchResponse<MessageResponse>> {
    return apiClient.delete<MessageResponse>(
      ENDPOINTS.rbac.members.removeOverride(memberId, permissionId),
    )
  }

  // ==========================================================================
  // Organizations
  // ==========================================================================

  async listOrganizations(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<FetchResponse<PaginatedResponse<Organization>>> {
    return apiClient.get(ENDPOINTS.admin.organizations.index, { params })
  }

  /**
   * Get organization policies
   */
  async getOrganizationPolicies(id: number | string): Promise<FetchResponse<any>> {
    return apiClient.get(ENDPOINTS.admin.organizations.policies(id as number))
  }

  /**
   * Update organization policies
   */
  async updateOrganizationPolicies(id: number | string, data: any): Promise<FetchResponse<any>> {
    return apiClient.patch(ENDPOINTS.admin.organizations.policies(id as number), data)
  }

  async createOrganization(data: CreateOrganizationRequest): Promise<FetchResponse<Organization>> {
    return apiClient.post<Organization>(ENDPOINTS.admin.organizations.store, data)
  }

  async updateOrganization(
    id: number,
    data: Partial<Organization>,
  ): Promise<FetchResponse<Organization>> {
    return apiClient.put<Organization>(ENDPOINTS.admin.organizations.byId(id), data)
  }

  async impersonateOrganization(id: number): Promise<FetchResponse<{ token: string; user: any }>> {
    return apiClient.post<{ token: string; user: any }>(
      `/api/admin/organizations/${id}/impersonate`,
    )
  }

  async getOrganization(id: number): Promise<FetchResponse<Organization>> {
    return apiClient.get<Organization>(ENDPOINTS.admin.organizations.byId(id))
  }

  async deleteOrganization(id: number): Promise<FetchResponse<MessageResponse>> {
    return apiClient.delete<MessageResponse>(ENDPOINTS.admin.organizations.destroy(id))
  }

  async addOrganizationMember(
    orgId: number,
    data: { user_id: number; role: string },
  ): Promise<FetchResponse<OrganizationMember>> {
    return apiClient.post<OrganizationMember>(ENDPOINTS.admin.organizations.addMember(orgId), data)
  }

  async removeOrganizationMember(
    orgId: number,
    userId: number,
  ): Promise<FetchResponse<MessageResponse>> {
    return apiClient.delete<MessageResponse>(
      ENDPOINTS.admin.organizations.removeMember(orgId, userId),
    )
  }

  async inviteToOrganization(
    orgId: number,
    data: InviteToOrganizationRequest,
  ): Promise<FetchResponse<OrganizationInvitation>> {
    return apiClient.post<OrganizationInvitation>(ENDPOINTS.admin.organizations.invite(orgId), data)
  }

  async getOrganizationInvitations(
    orgId: number,
  ): Promise<FetchResponse<OrganizationInvitation[]>> {
    return apiClient.get<OrganizationInvitation[]>(ENDPOINTS.admin.organizations.invitations(orgId))
  }

  // ==========================================================================
  // Provisioning & Directory Sync
  // ==========================================================================

  async listConnectors(): Promise<FetchResponse<Connector[]>> {
    return apiClient.get<Connector[]>(ENDPOINTS.admin.provisioning.connectors)
  }

  async createConnector(data: {
    name: string
    type: Connector['type']
    config: Record<string, unknown>
  }): Promise<FetchResponse<Connector>> {
    return apiClient.post<Connector>(ENDPOINTS.admin.provisioning.store, data)
  }

  async syncConnector(id: number): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.admin.provisioning.syncConnector(id))
  }

  async getConnectorLogs(
    id: number,
    params?: { page?: number; limit?: number },
  ): Promise<FetchResponse<PaginatedResponse<ConnectorLog>>> {
    return apiClient.get(ENDPOINTS.admin.provisioning.connectorLogs(id), { params })
  }

  // ==========================================================================
  // SCIM Token Management
  // ==========================================================================

  /**
   * List all SCIM provisioning tokens
   */
  async listSCIMTokens(): Promise<FetchResponse<SCIMToken[]>> {
    return apiClient.get<SCIMToken[]>(ENDPOINTS.admin.scimTokens.index)
  }

  /**
   * Create a new SCIM token
   */
  async createSCIMToken(data: {
    name: string
    description?: string
  }): Promise<FetchResponse<SCIMToken>> {
    return apiClient.post<SCIMToken>(ENDPOINTS.admin.scimTokens.store, data)
  }

  /**
   * Revoke a SCIM token
   */
  async revokeSCIMToken(id: number): Promise<FetchResponse<MessageResponse>> {
    return apiClient.delete<MessageResponse>(ENDPOINTS.admin.scimTokens.destroy(id))
  }

  // ==========================================================================
  // Audit Export
  // ==========================================================================

  async exportAuditLogs(params?: {
    start_date?: string
    end_date?: string
    format?: 'csv' | 'json'
    user_id?: number
  }): Promise<FetchResponse<Blob>> {
    return apiClient.get(ENDPOINTS.audit.export, {
      params,
      responseType: 'blob',
    })
  }

  // ==========================================================================
  // Statistics — MFA
  // ==========================================================================

  async getMFAStats(): Promise<FetchResponse<MFAStats>> {
    return apiClient.get<MFAStats>(ENDPOINTS.admin.statistics.mfa)
  }

  async getUserStats(): Promise<FetchResponse<UserStats>> {
    return apiClient.get<UserStats>(ENDPOINTS.admin.statistics.users)
  }

  // ==========================================================================
  // Email Templates & Testing
  // ==========================================================================

  async getEmailTemplates(): Promise<FetchResponse<EmailTemplate[]>> {
    return apiClient.get<EmailTemplate[]>(ENDPOINTS.admin.email.templates)
  }

  async getEmailTemplate(id: string): Promise<FetchResponse<EmailTemplate>> {
    return apiClient.get<EmailTemplate>(ENDPOINTS.admin.email.templateById(id))
  }

  async previewEmailTemplate(
    id: string,
    variables?: Record<string, string>,
  ): Promise<FetchResponse<{ html: string; text: string }>> {
    return apiClient.post(ENDPOINTS.admin.email.preview, { template_id: id, variables })
  }

  async sendTestEmail(data: EmailTestRequest): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.admin.email.test, data)
  }
}

export const adminService = new AdminService()
