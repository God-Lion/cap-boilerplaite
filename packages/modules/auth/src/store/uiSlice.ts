import { StateCreator } from 'zustand'
import { StoreState } from './index'

export interface UiState {
  authStep: 'credentials' | 'mfa' | 'passkey' | 'complete'
  redirectAfterLogin: string | null
  errorBanner: string | null
}

export interface UiActions {
  setAuthStep: (step: UiState['authStep']) => void
  setRedirect: (path: string | null) => void
  setErrorBanner: (message: string | null) => void
  clearError: () => void
}

export type UiSlice = UiState & UiActions

export const createUiSlice: StateCreator<StoreState, [['zustand/immer', never]], [], UiSlice> = (
  set,
) => ({
  authStep: 'credentials',
  redirectAfterLogin: null,
  errorBanner: null,

  setAuthStep: (step) =>
    set((state) => {
      state.authStep = step
    }),
  setRedirect: (path) =>
    set((state) => {
      state.redirectAfterLogin = path
    }),
  setErrorBanner: (message) =>
    set((state) => {
      state.errorBanner = message
    }),
  clearError: () =>
    set((state) => {
      state.errorBanner = null
    }),
})
