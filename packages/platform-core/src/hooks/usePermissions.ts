import { useAppStore } from '../store'
import { hasAdminRole, normalizeRole, Roles } from '../types/app-types'

export const usePermissions = () => {
  const { user, isAuthenticated } = useAppStore()

  /**
   * Check if the currently authenticated user has ALL of the specified roles
   * @param roles Single role enum or array of role enums
   * @param logic 'AND' (default) requires all roles, 'OR' requires at least one
   */
  const hasRole = (roles: Roles | Roles[] | string | string[], logic: 'AND' | 'OR' = 'OR'): boolean => {
    if (!isAuthenticated || !user) return false

    const userData = (user as any).user || user
    const userRole = normalizeRole(userData.role) || normalizeRole(userData.roleObject) || normalizeRole(userData.roleName)

    if (!userRole) return false

    const rolesArray = (Array.isArray(roles) ? roles : [roles])
      .map((role) => normalizeRole(role))
      .filter(Boolean) as Roles[]

    if (hasAdminRole(userRole)) {
      return true
    }

    if (logic === 'OR') {
      return rolesArray.includes(userRole)
    }

    return rolesArray.every((role) => userRole === role)
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
      if (hasAdminRole(userData.role) || hasAdminRole(userData.roleObject) || hasAdminRole(userData.roleName))
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
