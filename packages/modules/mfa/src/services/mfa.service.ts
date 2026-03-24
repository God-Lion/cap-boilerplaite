import { apiClient, FetchResponse } from '@cap/platform-core'
import type { RegistrationResponseJSON, AuthenticationResponseJSON } from '@simplewebauthn/browser'

// We'll import ENDPOINTS from auth-module for now to avoid duplication, 
// or define them here if they are purely MFA.
// For now, let's assume they are shared or we just use the strings.
// Better: import { ENDPOINTS } from '@cap/module-auth' if possible, 
// but auth-module might not export them cleanly yet.

const MFA_ENDPOINTS = {
  setup: '/auth/mfa/setup',
  verify: '/auth/mfa/verify',
  disable: '/auth/mfa/disable',
  recoveryCodes: '/auth/mfa/recovery-codes',
  recoveryVerify: '/auth/mfa/recovery-verify',
  verifyLogin: '/auth/mfa/verify-login',
  regenerateBackupCodes: '/auth/mfa/regenerate-backup-codes',
  totp: {
    enrollStart: '/auth/mfa/totp/enroll-start',
    enrollConfirm: '/auth/mfa/totp/enroll-confirm',
  },
  passkey: {
    registerStart: '/auth/mfa/passkey/register-start',
    registerFinish: '/auth/mfa/passkey/register-finish',
    loginStart: '/auth/mfa/passkey/login-start',
    loginFinish: '/auth/mfa/passkey/login-finish',
  }
}

const mfaService = {
  setup: (data?: any): Promise<FetchResponse> => {
    return data
      ? apiClient.post(MFA_ENDPOINTS.setup, data)
      : apiClient.post(MFA_ENDPOINTS.setup)
  },

  verify: (data: any): Promise<FetchResponse> => {
    return apiClient.post(MFA_ENDPOINTS.verify, data)
  },

  disable: (): Promise<FetchResponse> => {
    return apiClient.post(MFA_ENDPOINTS.disable)
  },

  recoveryCode: (): Promise<FetchResponse> => {
    return apiClient.post(MFA_ENDPOINTS.recoveryCodes)
  },

  verifyRecovery: (code: string): Promise<FetchResponse> => {
    return apiClient.post(MFA_ENDPOINTS.recoveryVerify, { code })
  },

  verifyLogin: (data: any): Promise<FetchResponse> => {
    return apiClient.post(MFA_ENDPOINTS.verifyLogin, data)
  },

  regenerateBackupCodes: (): Promise<FetchResponse<{ backup_codes: string[] }>> => {
    return apiClient.post(MFA_ENDPOINTS.regenerateBackupCodes)
  },

  totp: {
    enrollStart: (): Promise<FetchResponse> => {
      return apiClient.get(MFA_ENDPOINTS.totp.enrollStart)
    },

    enrollConfirm: (code: string): Promise<FetchResponse> => {
      return apiClient.post(MFA_ENDPOINTS.totp.enrollConfirm, { code })
    },
  },

  passkeys: {
    getRegistrationOptions: (): Promise<FetchResponse> => {
      return apiClient.get(MFA_ENDPOINTS.passkey.registerStart)
    },

    verifyRegistration: (data: RegistrationResponseJSON): Promise<FetchResponse> => {
      return apiClient.post(MFA_ENDPOINTS.passkey.registerFinish, data)
    },

    getLoginOptions: (email?: string): Promise<FetchResponse> => {
      return apiClient.get(MFA_ENDPOINTS.passkey.loginStart, { params: { email } })
    },

    verifyLogin: (data: AuthenticationResponseJSON): Promise<FetchResponse> => {
      return apiClient.post(MFA_ENDPOINTS.passkey.loginFinish, data)
    },
  },
}

export default mfaService
