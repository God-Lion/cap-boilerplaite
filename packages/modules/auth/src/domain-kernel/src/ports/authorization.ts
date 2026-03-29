import type {
  Permission,
  Role,
  AuthAccessPolicy,
  PermissionCheckResult,
  MemberOverride,
} from '../types/authorization'
import type { UserId, RoleId, PermissionId, OrganizationId } from '../types/identifiers'

export interface IPermissionChecker {
  canAccess(
    userId: UserId,
    resource: string,
    action: string,
    organizationId?: OrganizationId,
  ): Promise<PermissionCheckResult>

  hasPermission(
    userId: UserId,
    permissionId: PermissionId,
    organizationId?: OrganizationId,
  ): Promise<boolean>

  getUserPermissions(userId: UserId, organizationId?: OrganizationId): Promise<Permission[]>
}

export interface IRoleManager {
  listRoles(organizationId?: OrganizationId): Promise<Role[]>

  getRole(roleId: RoleId): Promise<Role>

  createRole(data: {
    name: string
    slug?: string
    description?: string
    organizationId?: OrganizationId
  }): Promise<Role>

  updateRole(roleId: RoleId, data: { name?: string; description?: string }): Promise<Role>

  deleteRole(roleId: RoleId): Promise<void>

  assignPermissionToRole(roleId: RoleId, permissionId: PermissionId): Promise<void>

  removePermissionFromRole(roleId: RoleId, permissionId: PermissionId): Promise<void>

  syncRolePermissions(roleId: RoleId, permissionIds: PermissionId[]): Promise<Role>
}

export interface IPermissionManager {
  listPermissions(): Promise<Permission[]>

  getPermission(permissionId: PermissionId): Promise<Permission>

  createPermission(data: {
    name: string
    slug: string
    resource?: string
    description?: string
  }): Promise<Permission>

  updatePermission(
    permissionId: PermissionId,
    data: { name?: string; description?: string; resource?: string },
  ): Promise<Permission>

  deletePermission(permissionId: PermissionId): Promise<void>
}

export interface IPolicyEngine {
  listPolicies(organizationId: OrganizationId): Promise<AuthAccessPolicy[]>

  createPolicy(
    organizationId: OrganizationId,
    policy: Omit<AuthAccessPolicy, 'id'>,
  ): Promise<AuthAccessPolicy>

  updatePolicy(policyId: string, policy: Partial<AuthAccessPolicy>): Promise<AuthAccessPolicy>

  deletePolicy(policyId: string): Promise<void>

  evaluatePolicies(
    subject: string,
    resource: string,
    action: string,
    context?: Record<string, unknown>,
  ): Promise<PermissionCheckResult>
}

export interface IMemberOverrideManager {
  getMemberOverrides(userId: UserId, organizationId: OrganizationId): Promise<MemberOverride[]>

  addMemberOverride(
    userId: UserId,
    organizationId: OrganizationId,
    override: Omit<MemberOverride, 'userId'>,
  ): Promise<void>

  removeMemberOverride(
    userId: UserId,
    organizationId: OrganizationId,
    permissionId: PermissionId,
  ): Promise<void>
}
