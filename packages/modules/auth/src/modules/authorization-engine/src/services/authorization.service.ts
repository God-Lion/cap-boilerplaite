import { adminService, Role, Permission } from "../../services/adminService"
import type {
  IRoleReader,
  IRoleWriter,
  IRolePermissionManager,
  IPermissionReader,
  IPermissionWriter,
  IPermissionChecker,
  IUserRoleManager,
  IAuthorizationFacade,
} from '../ports'
import type {
  RoleDto,
  PermissionDto,
  CheckPermissionRequest,
  CheckPermissionResponse,
} from '../dtos/authorization.dto'
import { ENDPOINTS } from '@cap/module-auth/modules/authentication-core/services/endpoints'

const mapRoleToDto = (role: Role): RoleDto => ({
  id: role.id,
  name: role.name,
  guard_name: role.guard_name,
  description: role.description ?? undefined,
  permissions: role.permissions?.map(mapPermissionToDto) ?? [],
  users_count: role.users_count,
  created_at: role.created_at,
  updated_at: role.updated_at,
})

const mapPermissionToDto = (permission: Permission): PermissionDto => ({
  id: permission.id,
  name: permission.name,
  guard_name: permission.guard_name,
  resource: permission.resource,
  description: permission.description ?? undefined,
  created_at: permission.created_at,
  updated_at: permission.updated_at,
})

export class RoleService implements IRoleReader, IRoleWriter, IRolePermissionManager {
  async listRoles(params?: {
    page?: number
    limit?: number
    search?: string
  }): Promise<{ roles: RoleDto[]; total: number }> {
    const response = await adminService.listRoles(params)
    const data = response.data as unknown as { data: Role[]; total: number }
    return {
      roles: data.data.map(mapRoleToDto),
      total: data.total ?? 0,
    }
  }

  async getRole(roleId: number): Promise<RoleDto> {
    const response = await adminService.getRole(roleId)
    return mapRoleToDto(response.data as Role)
  }

  async createRole(data: {
    name: string
    guard_name?: string
    description?: string
  }): Promise<RoleDto> {
    const response = await adminService.createRole(data)
    return mapRoleToDto(response.data as Role)
  }

  async updateRole(
    roleId: number,
    data: { name?: string; description?: string },
  ): Promise<RoleDto> {
    const response = await adminService.updateRole(roleId, data)
    return mapRoleToDto(response.data as Role)
  }

  async deleteRole(roleId: number): Promise<void> {
    await adminService.deleteRole(roleId)
  }

  async getRolePermissions(roleId: number): Promise<PermissionDto[]> {
    const response = await adminService.getRolePermissions(roleId.toString())
    return (response.data as Permission[]).map(mapPermissionToDto)
  }

  async assignPermissionToRole(data: { role_id: number; permission_id: number }): Promise<void> {
    await adminService.assignPermissionToRole(data)
  }

  async syncRolePermissions(roleId: number, permissionIds: number[]): Promise<RoleDto> {
    const response = await adminService.syncRolePermissions(roleId, permissionIds)
    return mapRoleToDto(response.data as Role)
  }
}

export class PermissionService implements IPermissionReader, IPermissionWriter {
  async listPermissions(): Promise<PermissionDto[]> {
    const response = await adminService.listPermissions()
    return (response.data as Permission[]).map(mapPermissionToDto)
  }

  async getPermission(permissionId: number): Promise<PermissionDto> {
    const response = await adminService.getPermission(permissionId)
    return mapPermissionToDto(response.data as Permission)
  }

  async createPermission(data: {
    name: string
    guard_name?: string
    resource?: string
    description?: string
  }): Promise<PermissionDto> {
    const response = await adminService.createPermission(data)
    return mapPermissionToDto(response.data as Permission)
  }

  async updatePermission(
    permissionId: number,
    data: { name?: string; guard_name?: string; resource?: string; description?: string },
  ): Promise<PermissionDto> {
    const response = await adminService.updatePermission(permissionId, data)
    return mapPermissionToDto(response.data as Permission)
  }

  async deletePermission(permissionId: number): Promise<void> {
    await adminService.deletePermission(permissionId)
  }
}

export class PermissionCheckerService implements IPermissionChecker {
  async checkPermission(request: CheckPermissionRequest): Promise<CheckPermissionResponse> {
    return {
      allowed: true,
    }
  }
}

export class UserRoleService implements IUserRoleManager {
  async assignRoleToUser(data: { user_id: number; role_id: number }): Promise<void> {
    await adminService.assignRoleToUser(data.user_id, data.role_id)
  }

  async removeRoleFromUser(userId: number, _roleId: number): Promise<void> {
    console.warn('removeRoleFromUser not implemented', userId, _roleId)
  }

  async getUserRoles(userId: number): Promise<RoleDto[]> {
    const response = await adminService.getUser(userId)
    const user = response.data as unknown as { role?: Role }
    if (user.role) {
      return [mapRoleToDto(user.role)]
    }
    return []
  }
}

export class AuthorizationService implements IAuthorizationFacade {
  role = new RoleService()
  permission = new PermissionService()
  userRole = new UserRoleService()

  async checkPermission(request: CheckPermissionRequest): Promise<CheckPermissionResponse> {
    const checker = new PermissionCheckerService()
    return checker.checkPermission(request)
  }
}

export const authorizationService = new AuthorizationService()




