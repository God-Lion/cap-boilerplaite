export type UserRole = 
  | 'user' 
  | 'admin' 
  | 'super_admin';

export type ApplicationRole =
  | 'participant'
  | 'judge'
  | 'provider_employee'
  | 'provider_admin'
  | 'super_admin_employee'
  | 'moderator';

export type AnyRole = UserRole | ApplicationRole;
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface UserSessionDto {
  id: string;
  userId: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  current?: boolean;
}

export interface UserDto {
  // Core Identity
  id: string | number;
  email: string;
  
  // Name fields (normalized - prefer fullName, firstName, lastName over name)
  name: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  
  // Auth & Security
  role?: AnyRole;
  status?: UserStatus;
  permissions: string[];
  emailVerified?: boolean;
  mfaEnabled?: boolean;
  /** @deprecated Use lastLoginAt */
  lastLogin?: string;
  lastLoginAt?: string | null;
  lastActivity?: string;
  sessions?: UserSessionDto[];
  roleObject?: IRole;
  
  // Contact & Profile
  phone?: string | null;
  /** @deprecated Use avatarUrl */
  avatar?: string;
  avatarUrl?: string;
  /** @deprecated Use lastName */
  sexe?: string;
  
  // Auth Tokens (usually only populated during login)
  token?: string;
  refreshToken?: string;
  rememberMe?: boolean;
  
  // Timestamps
  createdAt?: string;
  updatedAt?: string;
  
  // Metadata
  metadata?: {
    preferences?: Record<string, unknown>;
    settings?: Record<string, unknown>;
    [key: string]: unknown;
  };
  
  // Legacy fields (deprecated, for backward compatibility)
  roleId?: number;
  roleName?: string;
  
  // Admin-specific fields (application domain knowledge)
  orgName?: string;
  isActif?: boolean;
  apiAccessEnabled?: boolean;
  maintenanceModeBypass?: boolean;
}

export interface LoginResponseDto {
  user: UserDto;
  accessToken: string;
  expires_in?: number;
}

export interface RefreshResponseDto {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface TokenInternalData {
  accessToken: string;
  expiresAt: number;
}

export interface IPermission {
  id: number;
  name: string;
  slug?: string | null;
  description?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IRole {
  id: number;
  slug?: string | null;
  organizationId?: number | null;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  permissions?: Array<IPermission>;
  permissionNames?: string[];
  usersCount?: number;
  permissionsCount?: number;
}

export interface IAuth extends UserDto {
  user: UserDto | null
  tokens: {
    accessToken: string
    refreshToken: string
  } | null
  rememberMe?: boolean
  isAdmin?: boolean
}

export interface ILogin {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ISignup {
  firstName: string
  lastName: string
  sexe?: string
  phone?: string | null
  email: string
  role: AnyRole | number
  roleName: string
  permissions?: string[]
  roleObject?: UserDto['roleObject']
}

export interface IForgetPassword {
  email: string
}

export interface IResetPassword {
  token: string
  email?: string
  password: string
  confirmPassword: string
}

export interface IUserResponseForgetPassword {
  message: string
  success: boolean
}

export interface IUserResponseEmailResetPassword {
  message: string
  success: boolean
  token?: string
  isSignatureValid?: boolean
}

export interface IProfileSettingsResponse {
  message: string
  success: boolean
  user?: UserDto
  sessions?: Array<UserSessionDto>
}

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
