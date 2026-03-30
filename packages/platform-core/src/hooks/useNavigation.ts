import { useMemo } from 'react'
import { useAppStore } from '../store'
import { usePermissions } from './usePermissions'
import { NavVariant, NavItemConfig } from '@cap/shared-types/module'

/**
 * Hook to get filtered navigation items based on current user state and variant.
 * This is the high-level reactive engine for the application menu.
 */
export const useNavigationMenu = (variant: NavVariant) => {
  const navItems = useAppStore((state) => state.navItems)
  const user = useAppStore((state) => state.user)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)
  const isAdmin = useAppStore((state) => state.isAdmin)
  const { hasRole, hasPermission } = usePermissions()

  const filteredMenu = useMemo(() => {
    // 1. Filter by variant directly
    const byVariant = navItems.filter(item => 
      !item.variant || item.variant.includes(variant) || item.variant.includes('all')
    )

    // 2. Filter by roles and permissions reactively
    const checkAccess = (item: NavItemConfig): boolean => {
      // Role check
      if (item.roles && item.roles.length > 0) {
        if (!hasRole(item.roles as any)) return false
      }

      // Permission check
      if (item.permissions && item.permissions.length > 0) {
        if (!hasPermission(item.permissions)) return false
      }

      return true
    }

    // Recursively filter children as well
    const filterRecursive = (items: NavItemConfig[]): NavItemConfig[] => {
      return items
        .filter(item => checkAccess(item))
        .map(item => ({
          ...item,
          children: item.children ? filterRecursive(item.children) : undefined
        }))
    }

    return filterRecursive(byVariant).sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [navItems, user, isAuthenticated, isAdmin, variant, hasRole, hasPermission])

  return filteredMenu
}
