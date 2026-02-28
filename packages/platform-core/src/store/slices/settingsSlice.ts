import type { StateCreator } from 'zustand'
import type { AppStore } from '../index'
import themeConfig from '../../configs/themeConfig'

import type { Mode, Skin, Layout, LayoutComponentWidth } from '../../types'

export interface Settings {
  mode: Mode
  skin: Skin
  semiDark: boolean
  layout: Layout
  navbarContentWidth: LayoutComponentWidth
  contentWidth: LayoutComponentWidth
  footerContentWidth: LayoutComponentWidth
  primaryColor: string
}

export type LayoutOverride = 'public' | 'admin' | 'noLayout' | 'none'

export interface SettingsSlice {
  settings: Settings
  isSettingsChanged: boolean
  layoutOverride: LayoutOverride
  updateSettings: (settings: Partial<Settings>) => void
  resetSettings: () => void
  updatePageSettings: (settings: Partial<Settings>) => () => void
  updateLayoutOverride: (layout: LayoutOverride) => void
}

const defaultSettings: Settings = {
  mode: themeConfig.mode,
  skin: themeConfig.skin,
  semiDark: themeConfig.semiDark,
  layout: themeConfig.layout,
  navbarContentWidth: themeConfig.navbar.contentWidth,
  contentWidth: themeConfig.contentWidth,
  footerContentWidth: themeConfig.footer.contentWidth,
  primaryColor: themeConfig.colors.primary.main,
}

export const createSettingsSlice: StateCreator<
  AppStore,
  [['zustand/immer', never], ['zustand/devtools', never], ['zustand/persist', unknown]],
  [],
  SettingsSlice
> = (set, get) => ({
  settings: defaultSettings,
  isSettingsChanged: false,
  layoutOverride: 'none',

  updateSettings: (newSettings: Partial<Settings>) => {
    set((state) => {
      // Sync root mode if it's being updated in settings
      if (newSettings.mode) {
        state.mode = newSettings.mode
      }

      // Update settings
      state.settings = { ...state.settings, ...newSettings }

      // Update change detection
      state.isSettingsChanged = JSON.stringify(defaultSettings) !== JSON.stringify(state.settings)
    })
  },

  resetSettings: () => {
    set({
      settings: defaultSettings,
      isSettingsChanged: false,
    })
  },

  updatePageSettings: (newSettings: Partial<Settings>) => {
    const currentSettings = get().settings
    get().updateSettings(newSettings)

    return () => {
      set({ settings: currentSettings })
    }
  },

  updateLayoutOverride: (layout: LayoutOverride) => {
    set((state) => {
      state.layoutOverride = layout
    })
  },
})
