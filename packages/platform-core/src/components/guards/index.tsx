import React from 'react'
import { usePermissions } from '../../hooks/usePermissions'
import { Roles } from '../../types/app-types'

export interface PermissionGuardProps {
  /** The specific permission(s) required to render children */
  require: string | string[]
  /** Logic 'AND' requires all, 'OR' requires at least one. Defaults to 'AND' */
  logic?: 'AND' | 'OR'
  /** Optional fallback UI to show when unauthorized */
  fallback?: React.ReactNode
  children: React.ReactNode
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  require,
  logic = 'AND',
  fallback = null,
  children,
}) => {
  const { hasPermission } = usePermissions()

  if (!hasPermission(require, logic)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export interface RoleGuardProps {
  /** The specific role(s) required to render children */
  require: Roles | Roles[]
  /** Logic 'AND' requires all, 'OR' requires at least one. Defaults to 'OR' */
  logic?: 'AND' | 'OR'
  /** Optional fallback UI to show when unauthorized */
  fallback?: React.ReactNode
  children: React.ReactNode
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  require,
  logic = 'OR',
  fallback = null,
  children,
}) => {
  const { hasRole } = usePermissions()

  if (!hasRole(require, logic)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
