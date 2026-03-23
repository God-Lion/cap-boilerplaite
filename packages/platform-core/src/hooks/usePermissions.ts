import { useAppStore } from '../store'
import { Roles } from '../types/app-types'

export const usePermissions = () => {
  const { user, isAuthenticated } = useAppStore()

  /**
   * Check if the currently authenticated user has ALL of the specified roles
   * @param roles Single role enum or array of role enums
   * @param logic 'AND' (default) requires all roles, 'OR' requires at least one
   */
  const hasRole = (roles: Roles | Roles[] | string | string[], logic: 'AND' | 'OR' = 'OR'): boolean => {
    if (!isAuthenticated || !user) return false

    // Safely extract the role from user or user.user (depending on hydration state)
    const userData = (user as any).user || user
    const userRole = userData.role as Roles

    if (!userRole) return false

    const rolesArray = Array.isArray(roles) ? roles : [roles]

    // SuperAdmin / Admin override (optional, but standard for RBAC)
    if (userRole === Roles.SUPERADMIN || userRole === Roles.SUPERADMINEMPLOYEE) {
      return true
    }

    if (logic === 'OR') {
      return rolesArray.map(String).includes(String(userRole))
    }

    // Since a user currently only has ONE role (userRole is a number),
    // AND logic with multiple different roles will always be false unless the array has length 1
    return rolesArray.every((role) => String(userRole) === String(role))
  }

  /**
   * Check if the currently authenticated user has specific string-based permissions
   * @param permissions Single permission string or array of permission strings
   * @param logic 'AND' (default) requires all permissions, 'OR' requires at least one
   */
  const hasPermission = (permissions: string | string[], logic: 'AND' | 'OR' = 'AND'): boolean => {
    if (!isAuthenticated || !user) return false

    const userData = (user as any).user || user

    // Fallback array if permissions are missing (e.g. for basic users)
    const userPermissions: string[] = Array.isArray(userData.permissions)
      ? userData.permissions
      : []

    if (userPermissions.length === 0) {
      // Allow super-admins implicit access even if their permission array is somehow empty
      if (userData.role === Roles.SUPERADMIN || userData.role === Roles.SUPERADMINEMPLOYEE)
        return true
      return false
    }

    const permsArray = Array.isArray(permissions) ? permissions : [permissions]

    if (logic === 'OR') {
      return permsArray.some((perm) => userPermissions.includes(perm))
    }

    return permsArray.every((perm) => userPermissions.includes(perm))
  }

  return { hasRole, hasPermission }
}
