import { apiClient, FetchResponse } from '@cap/platform-core'
import {
  MfaSetupRequest,
  MfaVerifyRequest,
  MfaLoginVerifyRequest,
  TotpConfirmEnrollmentRequest,
  MfaSetupResponse,
  MfaVerifyResponse,
  TotpEnrollmentResponse,
  TotpConfirmEnrollmentResponse,
} from '../types/mfa.types'

// For now, we still use the auth endpoints, but they are encapsulated here.
const ENDPOINTS = {
  mfa: {
    setup: '/api/auth/mfa/setup',
    verify: '/api/auth/mfa/verify',
    disable: '/api/auth/mfa/disable',
    recoveryCodes: '/api/auth/mfa/recovery-codes',
    recoveryVerify: '/api/auth/mfa/recovery-verify',
    verifyLogin: '/api/auth/mfa/verify-login',
    regenerateBackupCodes: '/api/auth/mfa/regenerate-backup-codes',
    totp: {
      enrollStart: '/api/mfa/totp/enroll',
      enrollConfirm: '/api/mfa/totp/enroll',
    },
  },
}

export const mfaService = {
  setup: (data?: MfaSetupRequest): Promise<FetchResponse<MfaSetupResponse>> => {
    return data
      ? apiClient.post(ENDPOINTS.mfa.setup, data)
      : apiClient.post(ENDPOINTS.mfa.setup)
  },

  verify: (data: MfaVerifyRequest): Promise<FetchResponse<MfaVerifyResponse>> => {
    return apiClient.post(ENDPOINTS.mfa.verify, data)
  },

  disable: (): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.mfa.disable)
  },

  recoveryCode: (): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.mfa.recoveryCodes)
  },

  verifyRecovery: (code: string): Promise<FetchResponse<MfaVerifyResponse>> => {
    return apiClient.post(ENDPOINTS.mfa.recoveryVerify, { code })
  },

  verifyLogin: (data: MfaLoginVerifyRequest): Promise<FetchResponse<MfaVerifyResponse>> => {
    return apiClient.post(ENDPOINTS.mfa.verifyLogin, data)
  },

  regenerateBackupCodes: (): Promise<FetchResponse<{ backup_codes: string[] }>> => {
    return apiClient.post(ENDPOINTS.mfa.regenerateBackupCodes)
  },

  totp: {
    enrollStart: (): Promise<FetchResponse<TotpEnrollmentResponse>> => {
      return apiClient.get(ENDPOINTS.mfa.totp.enrollStart)
    },

    enrollConfirm: (code: string): Promise<FetchResponse<TotpConfirmEnrollmentResponse>> => {
      return apiClient.post(ENDPOINTS.mfa.totp.enrollConfirm, { code })
    },
  },
}

export default mfaService
