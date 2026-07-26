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
  SecurityLogParams,
} from "../types/api.types"
import { ENDPOINTS } from "./endpoints"
import TenantService from "@cap/platform-core/services/tenantService"

const authService = {
  /**
   * Backend tenant feature verification guard.
   * Independently verifies that a tenant has a specific auth feature/plugin enabled.
   */
  verifyTenantAuthFeature: (pluginId: string, domain?: string): boolean => {
    return TenantService.verifyTenantAuthFeature(domain, pluginId)
  },

  assertTenantAuthFeatureEnabled: (pluginId: string, domain?: string): void => {
    if (!TenantService.verifyTenantAuthFeature(domain, pluginId)) {
      throw new Error(
        `[TenantAuthGating] Authentication plugin "${pluginId}" is not enabled for this tenant.`
      )
    }
  },
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

  discoverSso: (identifier: string): Promise<FetchResponse> => {
    const isEmail = identifier.includes('@')
    const params = isEmail ? { email: identifier } : { domain: identifier }
    return apiClient.get(ENDPOINTS.auth.sso.discover, { params })
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

  // MFA and Passkey logic moved to @cap/module-mfa



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
    /** Verify a device code entered by the user */
    verify: (userCode: string): Promise<FetchResponse<{ success: boolean; redirectUrl: string }>> => {
      return apiClient.post(ENDPOINTS.auth.oidcDevice.verifyAction, { userCode })
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

  oidcInteraction: {
    get: (uid: string): Promise<FetchResponse> => {
      return apiClient.get(ENDPOINTS.auth.oidcInteraction.get(uid))
    },
    confirm: (uid: string): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.auth.oidcInteraction.confirm(uid))
    },
    abort: (uid: string): Promise<FetchResponse> => {
      return apiClient.get(ENDPOINTS.auth.oidcInteraction.abort(uid))
    },
  },
}

export default authService
