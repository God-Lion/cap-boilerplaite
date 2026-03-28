import { UserDto, UserRole, UserStatus } from '../auth'
import { ApiResponse, ApiError, ApiMeta } from '../common'

export type { ApiResponse, ApiError, ApiMeta, UserRole, UserStatus }

/**
 * User API Contract
 */
export interface UserApiContract {
  // Requests
  GetUserRequest: { id: string }
  CreateUserRequest: { email: string; name: string; password: string; role?: UserRole }
  UpdateUserRequest: { id: string; email?: string; name?: string; role?: UserRole; status?: UserStatus }
  DeleteUserRequest: { id: string }
  ListUsersRequest: { page?: number; pageSize?: number; role?: UserRole; status?: UserStatus; search?: string }

  // Responses
  GetUserResponse: UserDto
  CreateUserResponse: UserApiContract['GetUserResponse']
  UpdateUserResponse: UserApiContract['GetUserResponse']
  DeleteUserResponse: { id: string; deleted: boolean }
  ListUsersResponse: { users: UserApiContract['GetUserResponse'][]; total: number }

  // Errors
  UserApiError:
    | { code: 'USER_NOT_FOUND'; message: string; field?: 'id' }
    | { code: 'USER_ALREADY_EXISTS'; message: string; field?: 'email' }
}

/**
 * Authentication API Contract
 */
export interface AuthApiContract {
  // OAuth / IDaaS Redirect Flow
  LoginWithIdaasRequest: void
  
  // Standard Credentials Flow (Optional/Fallback)
  LoginRequest: { email: string; password: string; remember?: boolean }
  
  LoginResponse: {
    accessToken: string
    refreshToken?: string
    expiresIn: number
    user: UserApiContract['GetUserResponse']
  }
  LogoutRequest: { refreshToken?: string }
  LogoutResponse: { success: boolean }
  RefreshTokenRequest: { refreshToken: string }
  RefreshTokenResponse: {
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
  ResetPasswordRequest: { email: string }
  ResetPasswordResponse: { success: boolean; message: string }
  ConfirmResetPasswordRequest: { token: string; password?: string }
  ConfirmResetPasswordResponse: { success: boolean; message: string }
}
