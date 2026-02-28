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

export interface IUserResponse {
  id?: string | number
  _id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string | null
  role: number
  isActive?: boolean
  isActif?: number | boolean
  isAdmin?: boolean
  isEmailVerified?: boolean
  createdAt: string
  updatedAt: string
  avatar?: string | null
  sessions?: Array<ISession>
}

export interface IAuth extends IUserResponse {
  user?: IUserResponse
  token?: string
  refreshToken?: string
  full_name?: string
  role: number
  email: string
  rememberMe?: boolean
  isAdmin?: boolean
}

export interface ILogin {
  email: string
  password: string
  rememberMe?: boolean
}

export interface ISignup {
  firstName?: string
  lastName?: string
  firstname?: string
  lastname?: string
  email: string
  phone?: string
  password: string
  confirmPassword: string
  isTermsSign?: boolean
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
