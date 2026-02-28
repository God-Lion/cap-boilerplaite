import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createAuthSlice, AuthSlice } from './authSlice'
import { createUiSlice, UiSlice } from './uiSlice'

export type StoreState = AuthSlice & UiSlice

export const useAuthStore = create<StoreState>()(
  devtools(
    persist(
      immer((...a) => ({
        ...createAuthSlice(...a),
        ...createUiSlice(...a),
      })),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({ sessionId: state.sessionId }),
      },
    ),
    {
      name: 'AuthStore',
      enabled: import.meta.env.DEV,
    },
  ),
)

// Selectors
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useCurrentUser = () => useAuthStore((state) => state.user)
export const useMfaRequired = () => useAuthStore((state) => state.mfaRequired)
export const useAuthStep = () => useAuthStore((state) => state.authStep)
export const useErrorBanner = () => useAuthStore((state) => state.errorBanner)

// Export types and actions
export * from './authSlice'
export * from './uiSlice'
