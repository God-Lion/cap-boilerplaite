import { apiClient, FetchResponse } from '../api.client'
import { ENDPOINTS } from '../api.config'
import { ISignup, ILogin, IForgetPassword, IResetPassword } from '../../../types'
/**
 * Auth Service
 */
export const authService = {
  register: (body: ISignup): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.register, body)
  },

  signup: (body: ISignup): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.signup, body)
  },

  login: (body: ILogin): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.login, body)
  },

  logout: (): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.logout)
  },

  forgotPassword: (body: IForgetPassword): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.forgotPassword, body)
  },

  resetPassword: (body: IResetPassword): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.resetPassword, body)
  },

  refreshToken: (): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.refresh)
  },

  getSession: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.auth.session)
  },

  trackFailedLogin: (body: { email: string }): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.trackFailedLogin, body)
  },

  verifyEmail: (email: string, signature: string): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.auth.verifyEmail(email, signature))
  },
  verifyResetPassword: (email: string, signature: string): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.auth.verifyResetPassword(email, signature))
  },

  resendVerification: (email: string): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.resendVerification, { email })
  },

  verifyEmailToken: (token: string): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.auth.verifyEmailToken(token))
  },

  validateUser: (id: string | number, token: string): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.auth.validateUser(id, token))
  },

  mfa: {
    setup: (): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.mfa.setup)
    },

    verify: (code: string): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.mfa.verify, { code })
    },

    disable: (): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.mfa.disable)
    },
  },
}
