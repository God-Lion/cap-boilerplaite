// src/Modules/Auth/hooks/useAuthQuery.ts - ENHANCED VERSION

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query'
import {
  FetchResponse,
  HttpError,
  Session,
  secureTokenManager,
  API_CONFIG,
  useAppStore,
} from '@cap/platform-core'

import {
  TokenResponse,
  MessageResponse,
  VerifyEmailResponse,
  SessionResponse,
  LoginMutationVars,
  RegisterMutationVars,
  ForgotPasswordMutationVars,
  ResetPasswordMutationVars,
  MfaSetupRequest,
  MfaSetupResponse,
  MfaVerifyResponse,
  SessionsResponse,
  LoginHistoryResponse,
  MfaLoginVerifyRequest,
  MfaVerifyRequest,
  SecurityLogParams,
  SsoDiscoveryResponse,
  TotpEnrollmentResponse,
  TotpConfirmEnrollmentResponse,
} from '../types/api.types'
import { useSSESubscription } from './useSSE'
import { ENDPOINTS } from '../services/endpoints'

import { QUERY_KEYS } from '../services'
import authService from '../services/auth.service'
import { useAuthStore } from '../store'

// ============================================================================
// EXISTING MUTATION HOOKS (POST, PUT, DELETE operations)
// ============================================================================

/**
 * Signup/Register mutation
 */
export function useSignup(
  options?: UseMutationOptions<
    FetchResponse<MessageResponse>,
    HttpError,
    RegisterMutationVars,
    unknown
  >,
) {
  return useMutation({
    mutationFn: ({ data }) => authService.signup(data as any),
    ...options,
  })
}

export const useRegister = useSignup
/**
 * Signin mutation
 */
export function useSignin(
  options?: UseMutationOptions<FetchResponse<TokenResponse>, HttpError, LoginMutationVars, unknown>,
) {
  const queryClient = useQueryClient()

  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  const { setAuthenticated, setUser, setMfaRequired, setSessionId } = useAuthStore()
  const { setAuthStep, setErrorBanner } = useAuthStore()

  return useMutation({
    mutationFn: ({ data }) => authService.signin(data),
    onSuccess: (...args) => {
      const [response] = args

      if (response.data.mfa_required) {
        setMfaRequired(true)
        setAuthStep('mfa')
        if (response.data.userId) {
          // Store userId or sessionId if needed for second factor
        }
      } else if (response.data.token) {
        const expiresIn = response.data.expires_in || 3600
        const expiresAt = Date.now() + expiresIn * 1000

        secureTokenManager.setTokens({
          accessToken: response.data.token,
          expiresAt,
        })

        setUser(response.data.user)
        setAuthenticated(true)
        setAuthStep('complete')
        useAppStore.getState().setUser(response.data.user)

        // sessionId handled if present in response
        if (response.data.userId) {
          setSessionId(response.data.userId.toString())
        }

        try {
          const session = new Session()
          session.write('user', response.data.user)
        } catch (err) {
          // Session write failure is non-critical during login flow
          console.error('Failed to write session data:', err)
        }
      }

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session })
      customOnSuccess?.(...args)
    },
    onError: (error, ...rest) => {
      setErrorBanner(error.message || 'Login failed')
      customOnError?.(error, ...rest)
    },
    ...restOptions,
  })
}
/**
 * Logout mutation
 */
export function useSignout(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, void, unknown>,
) {
  const queryClient = useQueryClient()
  const { clearAuth } = useAuthStore()
  const { setAuthStep } = useAuthStore()

  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: () => authService.signout(),
    onSuccess: (...args) => {
      secureTokenManager.clearTokens()

      // Reset Zustand auth store
      clearAuth()
      setAuthStep('credentials')
      useAppStore.getState().signOut()

      queryClient.clear()

      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}
/**
 * Refresh token mutation
 */
export function useRefreshToken(
  options?: UseMutationOptions<
    FetchResponse<TokenResponse>,
    HttpError,
    { refreshToken?: string },
    unknown
  >,
) {
  const queryClient = useQueryClient()

  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: () => authService.refreshToken(),
    onSuccess: (...args) => {
      const [response] = args
      if (response.data.token) {
        const expiresIn = response.data.expires_in || 3600
        const expiresAt = Date.now() + expiresIn * 1000

        secureTokenManager.setTokens({
          accessToken: response.data.token,
          // refresh_token is handled via HttpOnly cookie
          expiresAt,
        })
      }

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session })

      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}
/**
 * Forgot password mutation
 */
export function useForgotPassword(
  options?: UseMutationOptions<
    FetchResponse<MessageResponse>,
    HttpError,
    ForgotPasswordMutationVars,
    unknown
  >,
) {
  return useMutation({
    mutationFn: ({ data }) => authService.forgotPassword(data),
    ...options,
  })
}

/**
 * Reset password mutation
 */
export function useResetPassword(
  options?: UseMutationOptions<
    FetchResponse<MessageResponse>,
    HttpError,
    ResetPasswordMutationVars,
    unknown
  >,
) {
  return useMutation({
    mutationFn: ({ data }) => authService.resetPassword(data),
    ...options,
  })
}

/**
 * Verify reset password token
 */
export function useVerifyResetPassword(
  email: string,
  signature: string,
  options?: Omit<UseQueryOptions<FetchResponse<any>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['auth', 'verify-reset-password', email, signature],
    queryFn: () => authService.verifyResetPassword(email, signature),
    enabled: !!email && !!signature,
    retry: false,
    ...options,
  })
}
/**
 * Verify email mutation
 */
export function useVerifyEmail(
  options?: UseMutationOptions<
    FetchResponse<VerifyEmailResponse>,
    HttpError,
    { email: string; signature: string },
    unknown
  >,
) {
  return useMutation({
    mutationFn: ({ email, signature }) => authService.verifyEmail(email, signature),
    ...options,
  })
}

export function useResendVerification(
  options?: UseMutationOptions<
    FetchResponse<MessageResponse>,
    HttpError,
    { email: string },
    unknown
  >,
) {
  return useMutation({
    mutationFn: ({ email }) => authService.resendVerification(email),
    ...options,
  })
}

export function useVerifyEmailToken(
  email: string,
  signature: string,
  options?: Omit<UseQueryOptions<FetchResponse<any>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['auth', 'verify-email-token', email, signature],
    queryFn: () => authService.verifyEmailToken(email, signature),
    enabled: !!email && !!signature,
    retry: false,
    ...options,
  })
}

export function useValidateUser(
  email: string,
  token: string,
  options?: Omit<UseQueryOptions<FetchResponse<any>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['auth', 'validate-user', email, token],
    queryFn: () => authService.validateUser(email, token),
    enabled: !!email && !!token,
    retry: false,
    ...options,
  })
}

/**
 * Get current session
 */
export function useSession(
  options?: Omit<
    UseQueryOptions<FetchResponse<SessionResponse>, HttpError>,
    'queryKey' | 'queryFn'
  >,
) {
  const { setUser, setAuthenticated } = useAuthStore()

  return useQuery({
    queryKey: QUERY_KEYS.auth.session,
    queryFn: async () => {
      const response = await authService.getSession()
      if (response.data?.user) {
        setUser(response.data.user)
        setAuthenticated(true)
      } else {
        setUser(null)
        setAuthenticated(false)
      }
      return response
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false, // Don't retry if unauthorized
    ...options,
  })
}
/**
 * Get All Sessions
 */
export function useSessions(
  options?: Omit<
    UseQueryOptions<FetchResponse<SessionsResponse>, HttpError>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: () => authService.getSessions(),
    staleTime: 1000 * 60 * 1, // 1 minute
    ...options,
  })
}

/**
 * Revoke All Sessions
 */
export function useRevokeAllSessions(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, void, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: () => authService.revokeAllSessions(),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

// ============================================================================
// NEW HOOKS - Login History
// ============================================================================

/**
 * Get Login History
 */
export function useLoginHistory(
  limit: number = 50,
  options?: Omit<
    UseQueryOptions<FetchResponse<LoginHistoryResponse>, HttpError>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: ['auth', 'login-history', limit],
    queryFn: () => authService.getLoginHistory(limit),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })
}

/**
 * Get Security Logs
 */
export function useSecurityLogs(
  params?: SecurityLogParams,
  options?: Omit<UseQueryOptions<FetchResponse<any>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['auth', 'security-logs', params],
    queryFn: () => authService.getSecurityLogs(params),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

/**
 * Setup MFA
 */
export function useSetupMfa(
  options?: UseMutationOptions<
    FetchResponse<MfaSetupResponse>,
    HttpError,
    MfaSetupRequest,
    unknown
  >,
) {
  return useMutation({
    mutationFn: (data) => authService.mfa.setup(data),
    ...options,
  })
}

/**
 * Verify MFA
 */
export function useVerifyMfa(
  options?: UseMutationOptions<FetchResponse<MfaVerifyResponse>, HttpError, MfaVerifyRequest>,
) {
  const queryClient = useQueryClient()
  const { setAuthenticated, setUser, setMfaRequired } = useAuthStore()
  const { setAuthStep } = useAuthStore()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => authService.mfa.verify(data),
    onSuccess: (...args) => {
      const [response] = args
      const { token, expires_in, user } = response.data

      secureTokenManager.setTokens({
        accessToken: token,
        expiresAt: Date.now() + expires_in * 1000,
      })

      // Update Zustand auth store
      setUser(user)
      setAuthenticated(true)
      setMfaRequired(false)
      setAuthStep('complete')
      useAppStore.getState().setUser(user)

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session })
      queryClient.invalidateQueries({ queryKey: ['auth', 'mfa', 'status'] })

      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Get MFA Status
 */
export function useMfaStatus() {
  const user = useAuthStore((state) => state.user)
  return {
    data: {
      enabled: user?.mfaEnabled || false,
    },
    isLoading: false,
    isError: false,
  }
}

/**
 * Disable MFA
 */
export function useDisableMfa(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, void, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: () => authService.mfa.disable(),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'mfa', 'status'] })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

export function useRecoveryCode(
  options?: Omit<UseQueryOptions<FetchResponse<any>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['auth', 'mfa', 'recovery-code'],
    queryFn: () => authService.mfa.recoveryCode(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useVerifyRecoveryMfa(
  options?: UseMutationOptions<FetchResponse<MfaVerifyResponse>, HttpError, string>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (code) => authService.mfa.verifyRecovery(code),
    onSuccess: (...args) => {
      const [response] = args
      const { token, expires_in } = response.data

      secureTokenManager.setTokens({
        accessToken: token,
        // refresh_token is handled via HttpOnly cookie
        expiresAt: Date.now() + expires_in * 1000,
      })

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session })
      queryClient.invalidateQueries({ queryKey: ['auth', 'mfa', 'recovery-code'] })

      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Verify MFA during Login
 */
export function useMfaLoginVerify(
  options?: UseMutationOptions<
    FetchResponse<MfaVerifyResponse>,
    HttpError,
    MfaLoginVerifyRequest,
    unknown
  >,
) {
  const queryClient = useQueryClient()
  const { setAuthenticated, setUser, setMfaRequired } = useAuthStore()
  const { setAuthStep } = useAuthStore()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => authService.mfa.verifyLogin(data),
    onSuccess: (...args) => {
      const [response] = args
      const { token, expires_in, user } = response.data

      secureTokenManager.setTokens({
        accessToken: token,
        expiresAt: Date.now() + expires_in * 1000,
      })

      // Update Zustand auth store
      setUser(user)
      setAuthenticated(true)
      setMfaRequired(false)
      setAuthStep('complete')
      useAppStore.getState().setUser(user)

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session })

      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Regenerate Backup Codes
 */
export function useRegenerateBackupCodes(
  options?: UseMutationOptions<FetchResponse<{ backup_codes: string[] }>, HttpError, void, unknown>,
) {
  return useMutation({
    mutationFn: () => authService.mfa.regenerateBackupCodes(),
    ...options,
  })
}

// ============================================================================
// NEW HOOKS - TOTP 2-Step Enrollment
// ============================================================================

/**
 * Get TOTP Enrollment Options (Step 1)
 */
export function useTotpEnrollmentOptions(
  options?: Omit<
    UseQueryOptions<FetchResponse<TotpEnrollmentResponse>, HttpError>,
    'queryKey' | 'queryFn'
  >,
) {
  return useQuery({
    queryKey: ['auth', 'mfa', 'totp', 'enroll'],
    queryFn: () => authService.mfa.totp.enrollStart(),
    staleTime: 0, // Should always fetch fresh QR
    ...options,
  })
}

/**
 * Confirm TOTP Enrollment (Step 2)
 */
export function useTotpConfirmEnrollment(
  options?: UseMutationOptions<
    FetchResponse<TotpConfirmEnrollmentResponse>,
    HttpError,
    { code: string }
  >,
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ code }) => authService.mfa.totp.enrollConfirm(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'mfa', 'status'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session })
    },
    ...options,
  })
}

// ============================================================================
// NEW HOOKS - Passkeys (WebAuthn)
// ============================================================================

export function useGetRegistrationOptions(
  options?: Omit<UseQueryOptions<FetchResponse<any>, HttpError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery({
    queryKey: ['auth', 'passkeys', 'registration-options'],
    queryFn: () => authService.passkeys.getRegistrationOptions(),
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}
/**
 * Passkey Registration Hook
 */
export function usePasskeyRegistration(
  options?: UseMutationOptions<FetchResponse<any>, HttpError, any, unknown>,
) {
  return useMutation({
    mutationFn: (data) => authService.passkeys.verifyRegistration(data),
    ...options,
  })
}

export function usePasskeyGetLoginOptions(
  options?: UseMutationOptions<FetchResponse<any>, HttpError, string | undefined, unknown>,
) {
  return useMutation({
    mutationFn: (email) => authService.passkeys.getLoginOptions(email),
    ...options,
  })
}

/**
 * Passkey Login Hook
 */
export function usePasskeyLogin(
  options?: UseMutationOptions<FetchResponse<TokenResponse>, HttpError, any, unknown>,
) {
  const queryClient = useQueryClient()
  const { setAuthenticated, setUser } = useAuthStore()
  const { setAuthStep } = useAuthStore()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => authService.passkeys.verifyLogin(data),
    onSuccess: (...args) => {
      const [response] = args
      if (response.data.token) {
        const expiresIn = response.data.expires_in || 3600
        const expiresAt = Date.now() + expiresIn * 1000

        secureTokenManager.setTokens({
          accessToken: response.data.token,
          expiresAt,
        })
      }

      // Update Zustand auth store
      setUser(response.data.user)
      setAuthenticated(true)
      setAuthStep('complete')
      useAppStore.getState().setUser(response.data.user)

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.auth.session })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Revoke Session
 */
export function useRevokeSession(
  options?: UseMutationOptions<FetchResponse<MessageResponse>, HttpError, string, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (sessionId) => authService.revokeSession(sessionId),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] })
      customOnSuccess?.(...args)
    },
    onError: (...args) => {
      customOnError?.(...args)
    },
    ...restOptions,
  })
}

// ============================================================================
// UTILITY HOOKS
// ============================================================================

/**
 * Check if user is authenticated (Query-based)
 */
export function useIsAuthenticatedQuery(): boolean {
  const { data: session } = useSession({ retry: false })
  return !!session?.data?.user
}

/**
 * Get current user (Query-based)
 */
export function useCurrentUserQuery() {
  const { data: session, ...rest } = useSession()
  return {
    user: session?.data?.user,
    ...rest,
  }
}

/**
 * Check user role
 */
export function useHasRole(role: string | number): boolean {
  const { user } = useCurrentUserQuery()
  if (!user?.role) return false
  return String(user.role) === String(role)
}

/**
 * Check multiple roles
 */
export function useHasAnyRole(roles: (string | number)[]): boolean {
  const { user } = useCurrentUserQuery()
  if (!user?.role) return false
  const userRoleStr = String(user.role)
  return roles.some((r) => String(r) === userRoleStr)
}

/**
 * SSO Discovery Hook
 */
export function useSsoDiscovery(
  email: string,
  options?: Omit<
    UseQueryOptions<
      FetchResponse<SsoDiscoveryResponse>,
      HttpError,
      FetchResponse<SsoDiscoveryResponse>,
      [string, string]
    >,
    'queryKey'
  >,
) {
  return useQuery({
    queryKey: ['sso_discovery', email],
    queryFn: () => authService.discoverSso(email),
    enabled: Boolean(email) && email.length >= 2,
    retry: false, // Don't retry heavily on discovery failures
    ...options,
  })
}

/**
 * SSE Hooks for progress tracking
 */

export function useScrapingProgress(jobId: string | number) {
  const url = `${API_CONFIG.baseURL}${ENDPOINTS.sse.scrapingProgress(jobId)}`
  return useSSESubscription<{
    progress: number
    status: string
    message: string
    records_processed?: number
  }>(url)
}

export function useAnalysisProgress(analysisId: string | number) {
  const url = `${API_CONFIG.baseURL}${ENDPOINTS.sse.analysisProgress(analysisId)}`
  return useSSESubscription<{
    progress: number
    status: string
    message: string
  }>(url)
}

export function useNotificationsStream() {
  const url = `${API_CONFIG.baseURL}${ENDPOINTS.notifications.sse}`
  return useSSESubscription<{
    type: string
    user_id: number
  }>(url)
}
