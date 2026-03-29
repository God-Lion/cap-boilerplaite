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
