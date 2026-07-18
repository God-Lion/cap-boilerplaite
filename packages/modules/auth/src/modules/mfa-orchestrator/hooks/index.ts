export { usePasskey } from './usePasskey'
export { usePasskeyAutofill } from './usePasskeyAutofill'
import { useMutation } from '@tanstack/react-query'
import { mfaService } from '../services/mfa.service'

export const usePasskeyLogin = (options?: any) => {
  return useMutation({
    mutationFn: (data: any) => mfaService.passkeys.verifyLogin(data),
    ...options,
  })
}

export const usePasskeyGetLoginOptions = (options?: any) => {
  return useMutation({
    mutationFn: (email?: string) => mfaService.passkeys.getLoginOptions(email),
    ...options,
  }) as any
}

export const useMfaLoginVerify = (options?: any) => {
  return useMutation({
    mutationFn: (data: { userId: number; code: string }) =>
      mfaService.verifyMfaCode(data.userId, data.code),
    ...options,
  })
}
