/**
 * Governance Types for Auth Module
 * Defines RBAC and ABAC entities
 */

export type PermissionAction = 'read' | 'write' | 'delete' | 'manage' | '*'

export interface Permission {
  id: string
  resource: string // e.g., 'user', 'org', 'role'
  action: PermissionAction
  description?: string
  effect: 'allow' | 'deny'
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  inheritedRoleIds?: string[]
  memberCount: number
  scope: 'system' | 'organization'
  orgId?: string // Null for system-wide roles
  createdAt: string
  updatedAt: string
}

export type AccessPolicyRuleType =
  | 'network_cidr'
  | 'mfa_required'
  | 'device_compliance'
  | 'geo_location'

export interface AccessPolicyRule {
  id: string
  type: AccessPolicyRuleType
  config: Record<string, any>
  effect: 'allow' | 'deny'
}

export interface AccessPolicy {
  id: string
  name: string
  description?: string
  type: 'conditional_access' | 'login_policy'
  rules: AccessPolicyRule[]
  status: 'active' | 'inactive'
  priority: number // Execution order
}

export interface ImpersonationSession {
  id: string | number
  startedAt: string
  actorAvatar?: string
  actorName: string
  actorEmail: string
  targetAvatar?: string
  targetName: string
  targetEmail: string
  reason?: string
  status: 'active' | 'completed' | 'revoked'
}
