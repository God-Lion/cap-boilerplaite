/**
 * Temporary mock service for MFA until @cap/module-mfa is available.
 * This satisfies imports in mfa-orchestrator screens and hooks.
 */
export const mfaService = {
  passkeys: {
    getRegistrationOptions: async (_email?: string) => ({ data: {} as any }),
    verifyRegistration: async (_data: any) => ({ data: {} as any }),
    getLoginOptions: async (_email?: string) => ({ data: {} as any }),
    verifyLogin: async (_data: any) => ({
      data: {
        user: {} as any,
        token: '',
        expires_in: 3600,
        userId: ''
      } as any
    }),
  },
  verifyMfaCode: async (_userId: number, _code: string) => ({ data: { success: true } }),
}
