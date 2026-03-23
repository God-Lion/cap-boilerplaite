import { Roles } from '@cap/platform-core'

export enum AdminRole {
  ADMIN = 'ADMIN',
  SUPER_ADMIN_EMPLOYEE = 'SUPERADMINEMPLOYEE',
  SUPER_ADMIN = 'SUPERADMIN',
  ADMINISTRATOR = 'ADMINISTRATOR',
}

export const ADMIN_ROLES = [
  String(Roles.ADMIN),
  String(Roles.SUPERADMINEMPLOYEE),
  String(Roles.SUPERADMIN),
  AdminRole.ADMIN,
  AdminRole.SUPER_ADMIN_EMPLOYEE,
  AdminRole.SUPER_ADMIN,
  AdminRole.ADMINISTRATOR,
] as const
