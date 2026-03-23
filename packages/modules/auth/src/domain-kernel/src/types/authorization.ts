import type { UserId, RoleId, PermissionId, OrganizationId } from './identifiers'

export type Action = 'create' | 'read' | 'update' | 'delete' | 'admin' | 'execute'

export interface PermissionSet {
  resource: string
  actions: Action[]
}

export interface Permission {
  id: PermissionId
  name: string
  slug: string
  resource?: string
  description?: string
  category?: string
}

export interface Role {
  id: RoleId
  name: string
  slug?: string
  description?: string
  organizationId?: OrganizationId
  permissions: Permission[]
  usersCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface UserRole {
  userId: UserId
  roleId: RoleId
  organizationId?: OrganizationId
  assignedAt: string
  assignedBy?: UserId
}

export interface AccessPolicy {
  id: string
  name: string
  effect: 'allow' | 'deny'
  priority: number
  subjects: string[]
  resources: string[]
  actions: Action[]
  conditions?: Record<string, unknown>
}

export interface MemberOverride {
  userId: UserId
  permissionId: PermissionId
  effect: 'allow' | 'deny'
}

export interface PermissionCheckResult {
  allowed: boolean
  reason?: string
  evaluatedAt: Date
}
