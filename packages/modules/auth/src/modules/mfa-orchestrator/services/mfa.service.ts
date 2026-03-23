/**
 * Temporary mock service for MFA until @cap/module-mfa is available.
 * This satisfies imports in mfa-orchestrator screens and hooks.
 */
export const mfaService = {
  passkeys: {
    getRegistrationOptions: async (email?: string) => ({ data: {} as any }),
    verifyRegistration: async (data: any) => ({ data: {} as any }),
    getLoginOptions: async (email?: string) => ({ data: {} as any }),
    verifyLogin: async (data: any) => ({
      data: {
        user: {} as any,
        token: '',
        expires_in: 3600,
        userId: ''
      } as any
    }),
  },
  verifyMfaCode: async (userId: number, code: string) => ({ data: { success: true } }),
}
