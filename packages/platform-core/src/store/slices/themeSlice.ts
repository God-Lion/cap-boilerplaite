import type { StateCreator } from 'zustand'
import type { AppStore } from '../index'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeSlice {
  mode: ThemeMode
  toggleColorMode: () => void
  setMode: (mode: ThemeMode) => void
}

export const createThemeSlice: StateCreator<
  AppStore,
  [['zustand/immer', never]],
  [],
  ThemeSlice
> = (set) => ({
  mode: 'light',

  toggleColorMode: () => {
    set((state) => ({
      mode: state.mode === 'light' ? 'dark' : 'light',
    }))
  },

  setMode: (mode: ThemeMode) => {
    set({ mode })
  },
})
