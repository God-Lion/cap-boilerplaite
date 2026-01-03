// src/Modules/Auth/services/auth.service.ts - ENHANCED VERSION
// ============================================================================
// Complete Auth Service with All Missing Features Implemented
// ============================================================================

import { apiClient, FetchResponse, ENDPOINTS } from '@cap/platform-core'

import {
  // Existing types
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  TrackFailedLoginRequest,
  UpdateNamesRequest,
  UpdateEmailRequest,
  UpdatePhotoRequest,
  TokenResponse,
  MessageResponse,
  VerifyEmailResponse,
  SessionResponse,
  TrackFailedLoginResponse,
  ProfileSettingsResponse,
  UpdateResponse,
  // New types
  ChangePasswordRequest,
  MfaSetupRequest,
  MfaSetupResponse,
  MfaVerifyRequest,
  MfaVerifyResponse,
  MfaStatusResponse,
  SessionsResponse,
  DeactivateAccountRequest,
  ReactivateAccountRequest,
  LoginHistoryResponse,
  LinkOAuthRequest,
  LinkedAccountsResponse,
} from '../types/api.types'

// ============================================================================
// Enhanced Auth Service Class
// ============================================================================

class AuthService {
  // ========================================================================
  // EXISTING METHODS (Keep as is)
  // ========================================================================

  async register(data: RegisterRequest): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.auth.register, data)
  }

  async login(data: LoginRequest): Promise<FetchResponse<TokenResponse>> {
    return apiClient.post<TokenResponse>(ENDPOINTS.auth.login, data)
  }

  async logout(): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.auth.logout)
  }

  async verifyEmail(token: string): Promise<FetchResponse<VerifyEmailResponse>> {
    return apiClient.get<VerifyEmailResponse>(ENDPOINTS.auth.verifyEmailToken(token))
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.auth.forgotPassword, data)
  }

  async resetPassword(data: ResetPasswordRequest): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.auth.resetPassword, data)
  }

  async refreshToken(refreshToken: string): Promise<FetchResponse<TokenResponse>> {
    return apiClient.post<TokenResponse>(
      ENDPOINTS.auth.refresh,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    )
  }

  async getSession(): Promise<FetchResponse<SessionResponse>> {
    return apiClient.get<SessionResponse>(ENDPOINTS.auth.session)
  }

  async trackFailedLogin(
    data: TrackFailedLoginRequest,
  ): Promise<FetchResponse<TrackFailedLoginResponse>> {
    return apiClient.post<TrackFailedLoginResponse>(ENDPOINTS.auth.trackFailedLogin, data)
  }

  async getProfileSettings(): Promise<FetchResponse<ProfileSettingsResponse>> {
    return apiClient.get<ProfileSettingsResponse>(ENDPOINTS.user.settings)
  }

  async updateNames(data: UpdateNamesRequest): Promise<FetchResponse<UpdateResponse>> {
    return apiClient.put<UpdateResponse>(ENDPOINTS.user.updateNames, data)
  }

  async updateEmail(data: UpdateEmailRequest): Promise<FetchResponse<UpdateResponse>> {
    return apiClient.put<UpdateResponse>(ENDPOINTS.user.updateEmail, data)
  }

  async updatePhoto(data: UpdatePhotoRequest): Promise<FetchResponse<UpdateResponse>> {
    return apiClient.uploadFormData<UpdateResponse>(
      ENDPOINTS.user.updatePhoto(data.id),
      { photo: data.photo },
      'patch',
    )
  }

  // ========================================================================
  // NEW METHODS - Change Password (Critical Missing Feature)
  // ========================================================================

  /**
   * Change user password
   * Requires current password for security
   */
  async changePassword(data: ChangePasswordRequest): Promise<FetchResponse<MessageResponse>> {
    return apiClient.put<MessageResponse>('/api/user/change-password', data)
  }

  // ========================================================================
  // NEW METHODS - Multi-Factor Authentication
  // ========================================================================

  /**
   * Setup MFA for current user
   * Returns QR code and backup codes
   */
  async setupMfa(data: MfaSetupRequest): Promise<FetchResponse<MfaSetupResponse>> {
    return apiClient.post<MfaSetupResponse>(ENDPOINTS.auth.mfa.setup, data)
  }

  /**
   * Verify MFA code and enable MFA
   */
  async verifyMfa(data: MfaVerifyRequest): Promise<FetchResponse<MfaVerifyResponse>> {
    return apiClient.post<MfaVerifyResponse>(ENDPOINTS.auth.mfa.verify, data)
  }

  /**
   * Verify MFA code during login
   */
  async mfaLoginVerify(data: MfaLoginVerifyRequest): Promise<FetchResponse<MfaVerifyResponse>> {
    return apiClient.post<MfaVerifyResponse>('/api/auth/mfa/verify-login', data)
  }

  /**
   * Disable MFA
   */
  async disableMfa(): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>(ENDPOINTS.auth.mfa.disable)
  }

  /**
   * Get MFA status
   */
  async getMfaStatus(): Promise<FetchResponse<MfaStatusResponse>> {
    return apiClient.get<MfaStatusResponse>('/api/auth/mfa/status')
  }

  /**
   * Regenerate backup codes
   */
  async regenerateBackupCodes(): Promise<FetchResponse<{ backup_codes: string[] }>> {
    return apiClient.post('/api/auth/mfa/regenerate-backup-codes')
  }

  // ========================================================================
  // NEW METHODS - Session Management
  // ========================================================================

  /**
   * Get all active sessions for current user
   */
  async getSessions(): Promise<FetchResponse<SessionsResponse>> {
    return apiClient.get<SessionsResponse>('/api/auth/sessions')
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(sessionId: string): Promise<FetchResponse<MessageResponse>> {
    return apiClient.delete<MessageResponse>(`/api/auth/sessions/${sessionId}`)
  }

  /**
   * Revoke all sessions except current
   */
  async revokeAllSessions(): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>('/api/auth/sessions/revoke-all')
  }

  // ========================================================================
  // NEW METHODS - Account Deactivation
  // ========================================================================

  /**
   * Deactivate user account (soft delete)
   */
  async deactivateAccount(data: DeactivateAccountRequest): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>('/api/user/deactivate', data)
  }

  /**
   * Reactivate a deactivated account
   */
  async reactivateAccount(data: ReactivateAccountRequest): Promise<FetchResponse<TokenResponse>> {
    return apiClient.post<TokenResponse>('/api/auth/reactivate', data)
  }

  // ========================================================================
  // NEW METHODS - Login History / Audit Log
  // ========================================================================

  /**
   * Get login history for current user
   */
  async getLoginHistory(limit: number = 50): Promise<FetchResponse<LoginHistoryResponse>> {
    return apiClient.get<LoginHistoryResponse>('/api/auth/login-history', {
      params: { limit },
    })
  }

  /**
   * Get security logs
   */
  async getSecurityLogs(params?: {
    limit?: number
    offset?: number
    event_type?: string
  }): Promise<FetchResponse<{ logs: any[] }>> {
    return apiClient.get('/api/auth/security-logs', { params })
  }

  // ========================================================================
  // NEW METHODS - OAuth / Social Login
  // ========================================================================

  /**
   * Login with OAuth provider
   */
  async oauthLogin(
    provider: 'google' | 'facebook',
    code: string,
  ): Promise<FetchResponse<TokenResponse>> {
    return apiClient.post<TokenResponse>('/api/auth/oauth/login', {
      provider,
      code,
    })
  }

  /**
   * Link OAuth account to existing user
   */
  async linkOAuthProvider(data: LinkOAuthRequest): Promise<FetchResponse<MessageResponse>> {
    return apiClient.post<MessageResponse>('/api/auth/oauth/link', data)
  }

  /**
   * Unlink OAuth account
   */
  async unlinkOAuthProvider(
    provider: 'google' | 'facebook',
  ): Promise<FetchResponse<MessageResponse>> {
    return apiClient.delete<MessageResponse>(`/api/auth/oauth/unlink/${provider}`)
  }

  /**
   * Get linked OAuth accounts
   */
  async getLinkedAccounts(): Promise<FetchResponse<LinkedAccountsResponse>> {
    return apiClient.get<LinkedAccountsResponse>('/api/auth/oauth/linked')
  }

  // ========================================================================
  // NEW METHODS - Email Preferences
  // ========================================================================

  /**
   * Get email preferences
   */
  async getEmailPreferences(): Promise<FetchResponse<any>> {
    return apiClient.get('/api/user/email-preferences')
  }

  /**
   * Update email preferences
   */
  async updateEmailPreferences(
    preferences: Record<string, boolean>,
  ): Promise<FetchResponse<MessageResponse>> {
    return apiClient.put('/api/user/email-preferences', preferences)
  }

  // ========================================================================
  // NEW METHODS - Device Management
  // ========================================================================

  /**
   * Get trusted devices
   */
  async getTrustedDevices(): Promise<FetchResponse<any>> {
    return apiClient.get('/api/auth/trusted-devices')
  }

  /**
   * Remove trusted device
   */
  async removeTrustedDevice(deviceId: string): Promise<FetchResponse<MessageResponse>> {
    return apiClient.delete(`/api/auth/trusted-devices/${deviceId}`)
  }
  // ========================================================================
  // NEW METHODS - Passkeys (WebAuthn)
  // ========================================================================

  async getPasskeyRegistrationOptions(): Promise<FetchResponse<any>> {
    return apiClient.get(ENDPOINTS.auth.passkey.registerStart)
  }

  async verifyPasskeyRegistration(data: any): Promise<FetchResponse<any>> {
    return apiClient.post(ENDPOINTS.auth.passkey.registerFinish, data)
  }

  async getPasskeyLoginOptions(email?: string): Promise<FetchResponse<any>> {
    return apiClient.get(ENDPOINTS.auth.passkey.loginStart, { params: { email } })
  }

  async verifyPasskeyLogin(data: any): Promise<FetchResponse<any>> {
    return apiClient.post(ENDPOINTS.auth.passkey.loginFinish, data)
  }
}

// Export singleton instance
export const authService = new AuthService()
