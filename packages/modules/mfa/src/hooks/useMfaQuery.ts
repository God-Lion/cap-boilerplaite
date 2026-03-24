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
  secureTokenManager,
  useAppStore,
} from '@cap/platform-core'
import { useAuthStore } from '@cap/module-auth'

import {
  MfaSetupRequest,
  MfaSetupResponse,
  MfaVerifyResponse,
  MfaLoginVerifyRequest,
  MfaVerifyRequest,
  TotpEnrollmentResponse,
  TotpConfirmEnrollmentResponse,
} from '../types/mfa.types'
import mfaService from '../services/mfa.service'

/**
 * Passkey Registration Hook
 */
export function usePasskeyRegistration(
  options?: UseMutationOptions<FetchResponse<any>, HttpError, any, unknown>,
) {
  return useMutation({
    mutationFn: (data) => mfaService.passkeys.verifyRegistration(data),
    ...options,
  })
}

/**
 * Passkey Login Hook
 */
export function usePasskeyLogin(
  options?: UseMutationOptions<FetchResponse<any>, HttpError, any, unknown>,
) {
  const queryClient = useQueryClient()
  const { setAuthenticated, setUser } = useAuthStore()
  const { setAuthStep } = useAuthStore()
  const { onSuccess: customOnSuccess, ...restOptions } = options || {}

  return useMutation({
    mutationFn: (data) => mfaService.passkeys.verifyLogin(data),
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

      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })
      customOnSuccess?.(...args)
    },
    ...restOptions,
  })
}

/**
 * Get Passkey Login Options (for authentication)
 */
export function usePasskeyGetLoginOptions(
  options?: UseMutationOptions<FetchResponse<any>, HttpError, string | undefined, unknown>,
) {
  return useMutation({
    mutationFn: (email?: string) => mfaService.passkeys.getLoginOptions(email),
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
    mutationFn: (data) => mfaService.setup(data),
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
    mutationFn: (data) => mfaService.verify(data),
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

      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })
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
  options?: UseMutationOptions<FetchResponse, HttpError, void, unknown>,
) {
  const queryClient = useQueryClient()
  const { onSuccess: customOnSuccess, onError: customOnError, ...restOptions } = options || {}

  return useMutation({
    mutationFn: () => mfaService.disable(),
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
    queryFn: () => mfaService.recoveryCode(),
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
    mutationFn: (code) => mfaService.verifyRecovery(code),
    onSuccess: (...args) => {
      const [response] = args
      const { token, expires_in } = response.data

      secureTokenManager.setTokens({
        accessToken: token,
        expiresAt: Date.now() + expires_in * 1000,
      })

      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })
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
    mutationFn: (data) => mfaService.verifyLogin(data),
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

      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })

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
    mutationFn: () => mfaService.regenerateBackupCodes(),
    ...options,
  })
}

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
    queryFn: () => mfaService.totp.enrollStart(),
    staleTime: 0,
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
    mutationFn: ({ code }) => mfaService.totp.enrollConfirm(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'mfa', 'status'] })
      queryClient.invalidateQueries({ queryKey: ['auth', 'session'] })
    },
    ...options,
  })
}
