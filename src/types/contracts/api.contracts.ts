/**
 * API Contract Definitions
 *
 * 🛡️ RULE 3: Strict Types
 *
 * These contracts define the shape of API requests and responses.
 * When the Backend changes ANY field, TypeScript will show errors
 * immediately in the Frontend "LEGO" pieces.
 *
 * @packageDocumentation
 */

/**
 * Base API Response wrapper
 * All API responses follow this structure
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  error?: ApiError
  meta?: ApiMeta
}

/**
 * Standard API error structure
 */
export interface ApiError {
  code: string
  message: string
  field?: string
  details?: Record<string, unknown>
}

/**
 * API metadata (pagination, timestamps, etc.)
 */
export interface ApiMeta {
  timestamp: string // ISO 8601
  requestId: string
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}

/**
 * User Role Type
 * Shared between frontend and backend
 */
export type UserRole = 'admin' | 'user' | 'guest' | 'moderator'

/**
 * User Status Type
 */
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'

/**
 * User API Contract
 *
 * Backend endpoint: /api/users
 *
 * @example
 * ```typescript
 * // GET /api/users/:id
 * const request: UserApiContract['GetUserRequest'] = { id: '123' };
 * const response: ApiResponse<UserApiContract['GetUserResponse']> = await api.get(...);
 * ```
 */
export interface UserApiContract {
  // ========== Requests ==========

  /**
   * Get user by ID request
   */
  GetUserRequest: {
    id: string
  }

  /**
   * Create new user request
   */
  CreateUserRequest: {
    email: string
    name: string
    password: string
    role?: UserRole
  }

  /**
   * Update user request
   */
  UpdateUserRequest: {
    id: string
    email?: string
    name?: string
    role?: UserRole
    status?: UserStatus
  }

  /**
   * Delete user request
   */
  DeleteUserRequest: {
    id: string
  }

  /**
   * List users request
   */
  ListUsersRequest: {
    page?: number
    pageSize?: number
    role?: UserRole
    status?: UserStatus
    search?: string
  }

  // ========== Responses ==========

  /**
   * User entity response
   *
   * ⚠️ CRITICAL: Any change to this interface will break
   * all components using user data at compile time
   */
  GetUserResponse: {
    id: string
    email: string
    name: string
    role: UserRole
    status: UserStatus
    avatar?: string
    createdAt: string // ISO 8601
    updatedAt: string // ISO 8601
    lastLoginAt?: string // ISO 8601
    metadata?: {
      preferences?: Record<string, unknown>
      settings?: Record<string, unknown>
    }
  }

  /**
   * Create user response
   */
  CreateUserResponse: UserApiContract['GetUserResponse']

  /**
   * Update user response
   */
  UpdateUserResponse: UserApiContract['GetUserResponse']

  /**
   * Delete user response
   */
  DeleteUserResponse: {
    id: string
    deleted: boolean
  }

  /**
   * List users response
   */
  ListUsersResponse: {
    users: UserApiContract['GetUserResponse'][]
    total: number
  }

  // ========== Errors ==========

  /**
   * User-specific error codes
   */
  UserApiError:
    | { code: 'USER_NOT_FOUND'; message: string; field?: 'id' }
    | { code: 'USER_ALREADY_EXISTS'; message: string; field?: 'email' }
    | { code: 'INVALID_EMAIL'; message: string; field: 'email' }
    | { code: 'INVALID_PASSWORD'; message: string; field: 'password' }
    | { code: 'INVALID_ROLE'; message: string; field: 'role' }
    | { code: 'UNAUTHORIZED'; message: string }
    | { code: 'FORBIDDEN'; message: string }
}

/**
 * Authentication API Contract
 *
 * Backend endpoint: /api/auth
 */
export interface AuthApiContract {
  // ========== Requests ==========

  /**
   * Login request
   */
  LoginRequest: {
    email: string
    password: string
    remember?: boolean
  }

  /**
   * Logout request
   */
  LogoutRequest: {
    refreshToken?: string
  }

  /**
   * Refresh token request
   */
  RefreshTokenRequest: {
    refreshToken: string
  }

  /**
   * Reset password request
   */
  ResetPasswordRequest: {
    email: string
  }

  /**
   * Confirm password reset request
   */
  ConfirmResetPasswordRequest: {
    token: string
    newPassword: string
  }

  // ========== Responses ==========

  /**
   * Login response with tokens
   */
  LoginResponse: {
    accessToken: string
    refreshToken: string
    expiresIn: number // seconds
    user: UserApiContract['GetUserResponse']
  }

  /**
   * Logout response
   */
  LogoutResponse: {
    success: boolean
  }

  /**
   * Refresh token response
   */
  RefreshTokenResponse: {
    accessToken: string
    expiresIn: number
  }

  /**
   * Reset password response
   */
  ResetPasswordResponse: {
    success: boolean
    message: string
  }

  /**
   * Confirm reset password response
   */
  ConfirmResetPasswordResponse: {
    success: boolean
    message: string
  }

  // ========== Errors ==========

  /**
   * Auth-specific error codes
   */
  AuthApiError:
    | { code: 'INVALID_CREDENTIALS'; message: string }
    | { code: 'TOKEN_EXPIRED'; message: string }
    | { code: 'TOKEN_INVALID'; message: string }
    | { code: 'TOKEN_REVOKED'; message: string }
    | { code: 'USER_SUSPENDED'; message: string }
    | { code: 'RESET_TOKEN_EXPIRED'; message: string }
    | { code: 'RESET_TOKEN_INVALID'; message: string }
}

/**
 * Type guards for runtime validation
 */
export const isApiResponse = <T>(value: unknown): value is ApiResponse<T> => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'success' in value &&
    typeof (value as ApiResponse<T>).success === 'boolean'
  )
}

export const isApiError = (value: unknown): value is ApiError => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    typeof (value as ApiError).code === 'string' &&
    typeof (value as ApiError).message === 'string'
  )
}
