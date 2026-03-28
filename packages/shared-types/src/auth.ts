export type UserRole = 
  | 'user' 
  | 'participant' 
  | 'judge' 
  | 'provider_employee' 
  | 'provider_admin' 
  | 'admin' 
  | 'super_admin_employee' 
  | 'super_admin'
  | 'moderator';
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
  id: string | number; // Supports both GUID (string) and legacy numeric IDs
  email: string;
  name: string; // Standardized from firstName+lastName
  fullName?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  status?: UserStatus;
  roleId?: number; // Legacy compatibility
  roleName?: string;
  permissions: string[];
  phone?: string | null;
  avatar?: string;
  avatarUrl?: string;
  emailVerified?: boolean;
  mfaEnabled?: boolean;
  lastLoginAt?: string | null;
  lastLogin?: string;
  lastActivity?: string;
  sessions?: UserSessionDto[];
  roleObject?: IRole;
  metadata?: {
    preferences?: Record<string, unknown>;
    settings?: Record<string, unknown>;
    [key: string]: unknown;
  };
  token?: string;
  refreshToken?: string;
  rememberMe?: boolean;
  createdAt?: string;
  updatedAt?: string;
  // Admin-specific extended fields
  orgName?: string;
  isActif?: boolean;
  apiAccessEnabled?: boolean;
  maintenanceModeBypass?: boolean;
  sexe?: string;
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
