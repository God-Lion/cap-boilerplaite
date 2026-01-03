/**
 * Service Contract Definitions
 *
 * 🛡️ RULE 3: Strict Types
 *
 * Service contracts define the interface for business logic operations.
 * Implementation MUST satisfy these contracts.
 *
 * Benefits:
 * - Type-safe service layer
 * - Easy to mock for testing
 * - Clear API boundaries
 * - Self-documenting code
 *
 * @packageDocumentation
 */

import type { UserApiContract, AuthApiContract, ApiResponse } from './api.contracts'

/**
 * User Service Contract
 *
 * Defines all user-related operations.
 * Implementation must satisfy this interface.
 *
 * @example
 * ```typescript
 * class UserService implements IUserService {
 *   async getUser(request: UserApiContract['GetUserRequest']) {
 *     const response = await api.get(`/users/${request.id}`);
 *     return response.data;
 *   }
 *   // ... implement other methods
 * }
 * ```
 */
export interface IUserService {
  /**
   * Fetch user by ID
   *
   * @param request - User ID
   * @returns User data
   * @throws {UserApiContract['UserApiError']} If user not found
   */
  getUser(
    request: UserApiContract['GetUserRequest'],
  ): Promise<ApiResponse<UserApiContract['GetUserResponse']>>

  /**
   * Create new user
   *
   * @param request - User creation data
   * @returns Created user data
   * @throws {UserApiContract['UserApiError']} If validation fails
   */
  createUser(
    request: UserApiContract['CreateUserRequest'],
  ): Promise<ApiResponse<UserApiContract['CreateUserResponse']>>

  /**
   * Update existing user
   *
   * @param request - User update data
   * @returns Updated user data
   * @throws {UserApiContract['UserApiError']} If user not found
   */
  updateUser(
    request: UserApiContract['UpdateUserRequest'],
  ): Promise<ApiResponse<UserApiContract['UpdateUserResponse']>>

  /**
   * Delete user
   *
   * @param request - User ID
   * @returns Deletion confirmation
   * @throws {UserApiContract['UserApiError']} If user not found
   */
  deleteUser(
    request: UserApiContract['DeleteUserRequest'],
  ): Promise<ApiResponse<UserApiContract['DeleteUserResponse']>>

  /**
   * List users with pagination and filters
   *
   * @param request - List filters and pagination
   * @returns Paginated user list
   */
  listUsers(
    request: UserApiContract['ListUsersRequest'],
  ): Promise<ApiResponse<UserApiContract['ListUsersResponse']>>
}

/**
 * Authentication Service Contract
 *
 * Defines all authentication-related operations.
 */
export interface IAuthService {
  /**
   * Authenticate user with credentials
   *
   * @param request - Login credentials
   * @returns Access and refresh tokens
   * @throws {AuthApiContract['AuthApiError']} If credentials invalid
   */
  login(
    request: AuthApiContract['LoginRequest'],
  ): Promise<ApiResponse<AuthApiContract['LoginResponse']>>

  /**
   * Logout current user
   *
   * @param request - Optional refresh token
   * @returns Logout confirmation
   */
  logout(
    request: AuthApiContract['LogoutRequest'],
  ): Promise<ApiResponse<AuthApiContract['LogoutResponse']>>

  /**
   * Refresh access token
   *
   * @param request - Refresh token
   * @returns New access token
   * @throws {AuthApiContract['AuthApiError']} If token invalid
   */
  refreshToken(
    request: AuthApiContract['RefreshTokenRequest'],
  ): Promise<ApiResponse<AuthApiContract['RefreshTokenResponse']>>

  /**
   * Request password reset email
   *
   * @param request - User email
   * @returns Success confirmation
   */
  resetPassword(
    request: AuthApiContract['ResetPasswordRequest'],
  ): Promise<ApiResponse<AuthApiContract['ResetPasswordResponse']>>

  /**
   * Confirm password reset with token
   *
   * @param request - Reset token and new password
   * @returns Success confirmation
   * @throws {AuthApiContract['AuthApiError']} If token invalid
   */
  confirmResetPassword(
    request: AuthApiContract['ConfirmResetPasswordRequest'],
  ): Promise<ApiResponse<AuthApiContract['ConfirmResetPasswordResponse']>>

  /**
   * Get current authenticated user
   *
   * @returns Current user data
   * @throws {AuthApiContract['AuthApiError']} If not authenticated
   */
  getCurrentUser(): Promise<ApiResponse<UserApiContract['GetUserResponse']>>
}

/**
 * Storage Service Contract
 *
 * Defines local/session storage operations with type safety.
 */
export interface IStorageService {
  /**
   * Get item from storage
   *
   * @param key - Storage key
   * @returns Stored value or null
   */
  get<T>(key: string): T | null

  /**
   * Set item in storage
   *
   * @param key - Storage key
   * @param value - Value to store
   */
  set<T>(key: string, value: T): void

  /**
   * Remove item from storage
   *
   * @param key - Storage key
   */
  remove(key: string): void

  /**
   * Clear all storage
   */
  clear(): void

  /**
   * Check if key exists
   *
   * @param key - Storage key
   * @returns True if key exists
   */
  has(key: string): boolean
}

/**
 * HTTP Client Service Contract
 *
 * Defines HTTP request operations with type safety.
 */
export interface IHttpClient {
  /**
   * GET request
   *
   * @param url - Request URL
   * @param config - Request configuration
   * @returns Response data
   */
  get<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>

  /**
   * POST request
   *
   * @param url - Request URL
   * @param data - Request body
   * @param config - Request configuration
   * @returns Response data
   */
  post<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>

  /**
   * PUT request
   *
   * @param url - Request URL
   * @param data - Request body
   * @param config - Request configuration
   * @returns Response data
   */
  put<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>

  /**
   * PATCH request
   *
   * @param url - Request URL
   * @param data - Request body
   * @param config - Request configuration
   * @returns Response data
   */
  patch<T>(url: string, data?: unknown, config?: RequestConfig): Promise<ApiResponse<T>>

  /**
   * DELETE request
   *
   * @param url - Request URL
   * @param config - Request configuration
   * @returns Response data
   */
  delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>
}

/**
 * HTTP Request Configuration
 */
export interface RequestConfig {
  headers?: Record<string, string>
  params?: Record<string, string | number | boolean>
  timeout?: number
  withCredentials?: boolean
}

/**
 * Example Implementation Signature
 *
 * This shows how to implement a service contract:
 *
 * @example
 * ```typescript
 * import type { IUserService } from '@types/contracts/service.contracts';
 * import type { IHttpClient } from '@types/contracts/service.contracts';
 *
 * export class UserService implements IUserService {
 *   constructor(private http: IHttpClient) {}
 *
 *   async getUser(request: UserApiContract['GetUserRequest']) {
 *     // TypeScript ensures we return the correct shape
 *     return this.http.get<UserApiContract['GetUserResponse']>(
 *       `/users/${request.id}`
 *     );
 *   }
 *
 *   async createUser(request: UserApiContract['CreateUserRequest']) {
 *     // If backend changes email → emailAddress,
 *     // this will fail at compile time ✅
 *     return this.http.post<UserApiContract['CreateUserResponse']>(
 *       '/users',
 *       request
 *     );
 *   }
 *
 *   // ... implement other methods
 * }
 * ```
 */
export type ServiceImplementation<T> = {
  [K in keyof T]: T[K]
}
