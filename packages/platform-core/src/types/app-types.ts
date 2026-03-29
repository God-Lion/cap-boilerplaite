import type { UserRole, ApplicationRole } from '@cap/shared-types'
import { IUserResponse, ILogin } from './IAuth'

export const Roles = {
  USER: 'user',
  PARTICIPANT: 'participant',
  JUDGE: 'judge',
  PROVIDEREMPLOYEE: 'provider_employee',
  PROVIDERADMIN: 'provider_admin',
  ADMIN: 'admin',
  SUPERADMINEMPLOYEE: 'super_admin_employee',
  SUPERADMIN: 'super_admin',
  MODERATOR: 'moderator',
} as const

export type Roles = UserRole | ApplicationRole

const ROLE_VALUES = new Set<Roles>(Object.values(Roles))

const ROLE_ALIASES: Record<string, Roles> = {
  user: Roles.USER,
  participant: Roles.PARTICIPANT,
  judge: Roles.JUDGE,
  provider_employee: Roles.PROVIDEREMPLOYEE,
  provideremployee: Roles.PROVIDEREMPLOYEE,
  'provider employee': Roles.PROVIDEREMPLOYEE,
  provider_admin: Roles.PROVIDERADMIN,
  provideradmin: Roles.PROVIDERADMIN,
  'provider admin': Roles.PROVIDERADMIN,
  admin: Roles.ADMIN,
  super_admin_employee: Roles.SUPERADMINEMPLOYEE,
  superadminemployee: Roles.SUPERADMINEMPLOYEE,
  'super admin employee': Roles.SUPERADMINEMPLOYEE,
  super_admin: Roles.SUPERADMIN,
  superadmin: Roles.SUPERADMIN,
  'super admin': Roles.SUPERADMIN,
  moderator: Roles.MODERATOR,
}

export const normalizeRole = (role: unknown): Roles | undefined => {
  if (!role) return undefined

  if (typeof role === 'string') {
    const normalized = role.trim().toLowerCase().replace(/[\s-]+/g, '_')
    return ROLE_VALUES.has(normalized as Roles)
      ? (normalized as Roles)
      : ROLE_ALIASES[role.trim().toLowerCase()] || ROLE_ALIASES[normalized]
  }

  if (typeof role === 'object') {
    const roleLike = role as Record<string, unknown>
    return (
      normalizeRole(roleLike.slug) ||
      normalizeRole(roleLike.name) ||
      normalizeRole(roleLike.role) ||
      normalizeRole(roleLike.roleName) ||
      normalizeRole(roleLike.value) ||
      normalizeRole(roleLike.code)
    )
  }

  return undefined
}

export const ADMIN_ROLES: Roles[] = [Roles.ADMIN, Roles.SUPERADMIN, Roles.SUPERADMINEMPLOYEE]

export const hasAdminRole = (role: unknown): boolean => {
  const normalized = normalizeRole(role)
  return normalized ? ADMIN_ROLES.includes(normalized) : false
}

export const RoleWeights: Roles[] = [
  Roles.USER,
  Roles.PARTICIPANT,
  Roles.JUDGE,
  Roles.PROVIDEREMPLOYEE,
  Roles.PROVIDERADMIN,
  Roles.MODERATOR,
  Roles.ADMIN,
  Roles.SUPERADMINEMPLOYEE,
  Roles.SUPERADMIN,
]
export interface ITab {
  key: string
  label: string
  icon?: React.JSX.Element
  component: React.JSX.Element
}

export interface ISubMenu {
  name: string
  icon: React.JSX.Element
  link: string
}

export interface IMenu {
  name: string
  icon: React.JSX.Element
  link: string
  menu?: Array<ISubMenu>
}

export interface IStatus {
  open: boolean
  type: string
  state: string
  msg: string
}

export interface ICustomizedLabel {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  name: string
  index: number
}

export interface Member {
  id?: string
  email: string
}

export interface IUpdateNames {
  lastName?: string
  firstName?: string
}
