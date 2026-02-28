/**
 * Settings Context - Backward Compatibility Layer
 *
 * This file now re-exports Zustand hooks for backward compatibility.
 * All new code should import directly from '../store'
 *
 * @deprecated Use `import { useSettings } from '../store'` instead
 */

import React from 'react'
import type { Mode, Skin, Layout, LayoutComponentWidth } from '../types'
import { useSettings as useZustandSettings } from '../store'
import themeConfig from '../configs/themeConfig'
import primaryColorConfig from '../configs/primaryColorConfig'
import { useObjectCookie } from '../services/hooks'
import demoConfigs from '../configs/demoConfigs'
import { DemoName } from '../types/core-types'

export type Settings = {
  mode?: Mode
  skin?: Skin
  semiDark?: boolean
  layout?: Layout
  navbarContentWidth?: LayoutComponentWidth
  contentWidth?: LayoutComponentWidth
  footerContentWidth?: LayoutComponentWidth
  primaryColor?: string
}

// UpdateSettingsOptions type
type UpdateSettingsOptions = {
  updateCookie?: boolean
}

// SettingsContextProps type
type SettingsContextProps = {
  settings: Settings
  updateSettings: (settings: Partial<Settings>, options?: UpdateSettingsOptions) => void
  isSettingsChanged: boolean
  resetSettings: () => void
  updatePageSettings: (settings: Partial<Settings>) => () => void
}

// Initial Settings Context (kept for backward compatibility)
// eslint-disable-next-line react-refresh/only-export-components
export const SettingsContext = React.createContext<SettingsContextProps | null>(null)

export const SettingsProvider: React.FC<{
  children: React.ReactNode
  settingsCookie: Settings | null
  mode?: Mode
  demoName?: DemoName
}> = (props) => {
  const demoName = props.demoName || null
  const demoConfigurations = React.useMemo(() => {
    return demoName ? demoConfigs[demoName] : {}
  }, [demoName])
  const initialSettings: Settings = React.useMemo(
    () => ({
      mode: themeConfig.mode,
      skin: themeConfig.skin,
      semiDark: themeConfig.semiDark,
      layout: themeConfig.layout,
      navbarContentWidth: themeConfig.navbar.contentWidth,
      contentWidth: themeConfig.contentWidth,
      footerContentWidth: themeConfig.footer.contentWidth,
      primaryColor: primaryColorConfig[0].main,
      ...(demoName && demoConfigurations),
    }),
    [demoName, demoConfigurations],
  )

  const updatedInitialSettings = React.useMemo(
    () => ({
      ...initialSettings,
      mode: props.mode || (demoName && demoConfigurations.mode) || themeConfig.mode,
    }),
    [initialSettings, props.mode, demoName, demoConfigurations],
  )

  // Cookies
  const [settingsCookie, updateSettingsCookie] = useObjectCookie<Settings>(
    demoName
      ? themeConfig.settingsCookieName.replace('demo-1', demoName)
      : themeConfig.settingsCookieName,
    JSON.stringify(props.settingsCookie) !== '{}' ? props.settingsCookie : updatedInitialSettings,
  )

  // State
  const [_settingsState, _updateSettingsState] = React.useState<Settings>(
    JSON.stringify(settingsCookie) !== '{}' ? settingsCookie : updatedInitialSettings,
  )

  const updateSettings = (settings: Partial<Settings>, options?: UpdateSettingsOptions) => {
    const { updateCookie = true } = options || {}
    _updateSettingsState((prev) => {
      const newSettings = { ...prev, ...settings }
      // Update cookie if needed
      if (updateCookie) updateSettingsCookie(newSettings)
      return newSettings
    })
  }

  /**
   * Updates the settings for page with the provided settings object.
   * Updated settings won't be saved to cookie hence will be reverted once navigating away from the page.
   *
   * @param settings - The partial settings object containing the properties to update.
   * @returns A function to reset the page settings.
   *
   * @example
   * useEffect(() => {
   *     return updatePageSettings({ theme: 'dark' });
   * }, []);
   */
  const updatePageSettings = (settings: Partial<Settings>): (() => void) => {
    updateSettings(settings, { updateCookie: false })

    // Returns a function to reset the page settings
    return () => updateSettings(settingsCookie, { updateCookie: false })
  }

  const resetSettings = () => {
    updateSettings(initialSettings)
  }

  const isSettingsChanged = React.useMemo(
    () => JSON.stringify(initialSettings) !== JSON.stringify(_settingsState),
    [initialSettings, _settingsState],
  )

  return (
    <SettingsContext.Provider
      value={{
        settings: _settingsState,
        updateSettings,
        isSettingsChanged,
        resetSettings,
        updatePageSettings,
      }}
    >
      {props.children}
    </SettingsContext.Provider>
  )
}

/**
 * @deprecated Use `import { useSettings } from '../store'` instead
 *
 * This hook now uses Zustand internally for backward compatibility
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
  // Use Zustand store directly
  const zustandSettings = useZustandSettings()

  // Wrap updateSettings to handle the updateCookie option (ignored in Zustand)
  const updateSettings = (settings: Partial<Settings>) => {
    zustandSettings.updateSettings(settings as any)
  }

  return {
    settings: zustandSettings.settings,
    updateSettings,
    isSettingsChanged: zustandSettings.isSettingsChanged,
    resetSettings: zustandSettings.resetSettings,
    updatePageSettings: zustandSettings.updatePageSettings,
  }
}

export default SettingsProvider
