export interface ISession {
  id: string
  userId: string
  device: string
  browser: string
  ip: string
  location: string
  lastActive: string
  current?: boolean
}

import IRole from './IRole'

export interface IUserResponse {
  id: number
  email: string
  role: number
  firstName: string
  lastName: string
  fullName?: string
  status?: string
  emailVerified?: boolean
  isVerified?: boolean
  phone?: string | null
  mfaEnabled: boolean
  isEnabledProfile?: boolean
  isEnabledMiniPlayer?: boolean
  isEnabledAutoplayNext?: boolean
  isEnabledMentions?: boolean
  lastLoginAt?: string | null
  createdAt: string
  updatedAt: string
  avatar?: string | null
  sessions?: Array<ISession>
  permissions?: string[]
  roleName?: string | null
  roleObject?: IRole
}

export interface IAuth extends IUserResponse {
  user: IUserResponse | null
  tokens: {
    accessToken: string
    refreshToken: string
  } | null
  permissions: string[]
  roleName: string | null
  email: string
  rememberMe?: boolean
  isAdmin?: boolean
  roleObject?: IRole
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
  role: number
  roleName: string
  permissions?: string[]
  roleObject?: IRole
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
