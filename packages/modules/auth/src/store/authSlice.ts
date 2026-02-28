import { StateCreator } from 'zustand'
import { User } from '../types/api.types'
import { StoreState } from './index'

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  mfaRequired: boolean
  mfaMethod: 'totp' | 'backup_code' | 'passkey' | null
  sessionId: string | null
}

export interface AuthActions {
  setUser: (user: User | null) => void
  setAuthenticated: (isAuthenticated: boolean) => void
  setMfaRequired: (required: boolean, method?: AuthState['mfaMethod']) => void
  setLoading: (isLoading: boolean) => void
  setSessionId: (sessionId: string | null) => void
  clearUser: () => void
  clearAuth: () => void
}

export type AuthSlice = AuthState & AuthActions

export const createAuthSlice: StateCreator<
  StoreState,
  [['zustand/immer', never]],
  [],
  AuthSlice
> = (set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  mfaRequired: false,
  mfaMethod: null,
  sessionId: null,

  setUser: (user) =>
    set((state) => {
      state.user = user
    }),
  setAuthenticated: (isAuthenticated) =>
    set((state) => {
      state.isAuthenticated = isAuthenticated
    }),
  setMfaRequired: (required, method = null) =>
    set((state) => {
      state.mfaRequired = required
      state.mfaMethod = method
    }),
  setLoading: (isLoading) =>
    set((state) => {
      state.isLoading = isLoading
    }),
  setSessionId: (sessionId) =>
    set((state) => {
      state.sessionId = sessionId
    }),
  clearUser: () =>
    set((state) => {
      state.user = null
    }),
  clearAuth: () =>
    set((state) => {
      state.user = null
      state.isAuthenticated = false
      state.mfaRequired = false
      state.mfaMethod = null
      state.sessionId = null
    }),
})
