import { Roles } from '@cap/platform-core'

export enum AdminRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN_EMPLOYEE = 'SUPERADMINEMPLOYEE',
  SUPER_ADMIN = 'SUPERADMIN',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

// Roles.ADMIN=6, Roles.SUPERADMINEMPLOYEE=7, Roles.SUPERADMIN=8 (numeric enum from app-types.ts)
// We use literal strings here to avoid evaluating Roles at module-load time, which would fail
// due to circular imports between @cap/module-auth and @cap/platform-core.
export const ADMIN_ROLES = [
  Roles.ADMIN,
  Roles.SUPERADMINEMPLOYEE,
  Roles.SUPERADMIN,
  AdminRole.ADMIN,
  AdminRole.SUPER_ADMIN_EMPLOYEE,
  AdminRole.SUPER_ADMIN,
  AdminRole.ADMINISTRATOR,
] as const

export const getAdminRoles = () => [
  Roles.ADMIN,
  Roles.SUPERADMINEMPLOYEE,
  Roles.SUPERADMIN,
  AdminRole.ADMIN,
  AdminRole.SUPER_ADMIN_EMPLOYEE,
  AdminRole.SUPER_ADMIN,
  AdminRole.ADMINISTRATOR,
]
