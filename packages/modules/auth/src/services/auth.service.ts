import type { RegistrationResponseJSON, AuthenticationResponseJSON } from '@simplewebauthn/browser'
import {
  apiClient,
  FetchResponse,
  IForgetPassword,
  ILogin,
  IResetPassword,
  ISignup,
} from '@cap/platform-core'

import {
  // New types
  MfaSetupRequest,
  MfaLoginVerifyRequest,
  MfaVerifyRequest,
  SecurityLogParams,
} from '../types/api.types'
import { ENDPOINTS } from './endpoints'

const authService = {
  signup: (body: ISignup): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.signup, body)
  },

  signin: (body: ILogin): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.login, body)
  },

  signout: (): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.logout)
  },

  refreshToken: (): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.refresh)
  },

  forgotPassword: (body: IForgetPassword): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.forgotPassword, body)
  },

  resetPassword: (body: IResetPassword): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.resetPassword, body)
  },

  discoverSso: (email: string): Promise<FetchResponse> => {
    // Pass email as query param: /api/auth/sso/discover?email=user@domain.com
    return apiClient.get(ENDPOINTS.auth.sso.discover, { params: { email } })
  },

  verifyResetPassword: (email: string, signature: string): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.auth.verifyResetPassword(email, signature))
  },

  verifyEmail: (email: string, signature: string): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.auth.verifyEmail(email, signature))
  },

  resendVerification: (email: string): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.resendVerification, { email })
  },

  verifyEmailToken: (email: string, signature: string): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.auth.verifyEmailToken(email, signature))
  },

  verifyEmailChange: (token: string): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.user.verifyEmailChange, { token })
  },

  validateUser: (id: string | number, token: string): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.auth.validateUser(id, token))
  },

  // ========================================================================
  // Session Management
  // ========================================================================
  getSession: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.auth.session)
  },

  getSessions: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.auth.sessions)
  },

  revokeSession: (sessionId: string): Promise<FetchResponse> => {
    return apiClient.delete(ENDPOINTS.auth.revokeSession(sessionId))
  },

  revokeAllSessions: (): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.revokeAllSessions)
  },

  trackFailedLogin: (body: { email: string }): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.auth.trackFailedLogin, body)
  },

  // ========================================================================
  // Login History & Security Logs
  // ========================================================================

  getLoginHistory: (limit: number = 50): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.auth.loginHistory, {
      params: { limit },
    })
  },

  getSecurityLogs: (params?: SecurityLogParams): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.auth.securityLogs, { params })
  },

  mfa: {
    setup: (data?: MfaSetupRequest): Promise<FetchResponse> => {
      return data
        ? apiClient.post(ENDPOINTS.auth.mfa.setup, data)
        : apiClient.post(ENDPOINTS.auth.mfa.setup)
    },

    verify: (data: MfaVerifyRequest): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.mfa.verify, data)
    },

    disable: (): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.mfa.disable)
    },

    recoveryCode: (): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.mfa.recoveryCodes)
    },

    verifyRecovery: (code: string): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.mfa.recoveryVerify, { code })
    },

    verifyLogin: (data: MfaLoginVerifyRequest): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.mfa.verifyLogin, data)
    },

    regenerateBackupCodes: (): Promise<FetchResponse<{ backup_codes: string[] }>> => {
      return apiClient.post(ENDPOINTS.auth.mfa.regenerateBackupCodes)
    },

    totp: {
      enrollStart: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.auth.mfa.totp.enrollStart)
      },

      enrollConfirm: (code: string): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.auth.mfa.totp.enrollConfirm, { code })
      },
    },
  },

  passkeys: {
    getRegistrationOptions: (): Promise<FetchResponse> => {
      return apiClient.get(ENDPOINTS.auth.passkey.registerStart)
    },

    verifyRegistration: (data: RegistrationResponseJSON): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.passkey.registerFinish, data)
    },

    getLoginOptions: (email?: string): Promise<FetchResponse> => {
      return apiClient.get(ENDPOINTS.auth.passkey.loginStart, { params: { email } })
    },

    verifyLogin: (data: AuthenticationResponseJSON): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.passkey.loginFinish, data)
    },
  },

  // ========================================================================
  // Passwordless (Magic Link)
  // ========================================================================
  passwordless: {
    /** Send a magic link to the user's email */
    send: (email: string): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.passwordless.send, { email })
    },

    /** Verify a magic link token */
    verify: (token: string): Promise<FetchResponse> => {
      return apiClient.get(ENDPOINTS.auth.passwordless.verify, { params: { token } })
    },
  },

  // ========================================================================
  // OIDC Device Code
  // ========================================================================
  deviceCode: {
    /** Request a device code */
    authorize: (clientId: string): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.oidcDevice.authorize, { client_id: clientId })
    },
  },

  // ========================================================================
  // OIDC Compliance & SAML SSO
  // ========================================================================
  oidc: {
    userinfo: (): Promise<FetchResponse> => {
      return apiClient.get(ENDPOINTS.auth.oidc.userinfo)
    },
    introspect: (token: string): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.oidc.introspect, { token })
    },
    revoke: (token: string): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.oidc.revoke, { token })
    },
    endSession: (): Promise<FetchResponse> => {
      return apiClient.get(ENDPOINTS.auth.oidc.endSession)
    },
  },

  saml: {
    sso: (data: any): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.saml.sso, data)
    },
  },
}

export default authService
