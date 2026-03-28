import { UserDto, UserRole, UserSessionDto } from '@cap/shared-types'

export type ISession = UserSessionDto
export type IUserResponse = UserDto

export interface IAuth extends IUserResponse {
  user: IUserResponse | null
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
  role: UserRole | number
  roleName: string
  permissions?: string[]
  roleObject?: IUserResponse['roleObject']
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
  user?: IUserResponse
  sessions?: Array<ISession>
}
