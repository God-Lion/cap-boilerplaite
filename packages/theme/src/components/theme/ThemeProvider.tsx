// cspell:ignore stylis
import React, { useMemo, useState, useEffect } from 'react'
import {
  ThemeProvider as CssVarsProvider,
  darken,
  extendTheme,
  lighten,
} from '@mui/material/styles'
import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import CssBaseline from '@mui/material/CssBaseline'
import type {} from '@mui/lab/themeAugmentation'
import { useMedia } from 'react-use'
import stylisRTLPlugin from 'stylis-plugin-rtl'

import type { ChildrenType, Direction, SystemMode } from '@cap/platform-core'
import ModeChanger from './ModeChanger'
import { themeConfig, useSettings, TenantService, defaultCoreTheme } from '@cap/platform-core'
import { deepmerge } from '@mui/utils'
import type { TenantConfig } from '@cap/platform-core'

const ThemeProvider: React.FC<
  ChildrenType & {
    direction: Direction
    systemMode: SystemMode
  }
> = ({ children, direction, systemMode }) => {
  const { settings } = useSettings()
  const isDark = useMedia('(prefers-color-scheme: dark)', false)
  const isServer = typeof window === 'undefined'
  const [tenant, setTenant] = useState<TenantConfig | null>(null)

  useEffect(() => {
    const loadTenant = async () => {
      try {
        const config = await TenantService.fetchTenant()
        setTenant(config)
      } catch (err) {
        console.warn('[ThemeProvider] Failed to load tenant config:', err)
      }
    }
    loadTenant()
  }, [])

  const userPreferences = useMemo(() => TenantService.getUserPreferences(), [tenant])

  let currentMode: SystemMode

  const effectivePrimaryColor = tenant?.theme?.primaryColor || settings.primaryColor
  const tenantMode = userPreferences.theme || tenant?.theme?.mode || settings.mode

  if (isServer) currentMode = systemMode
  else {
    if (tenantMode === 'system') currentMode = isDark ? 'dark' : 'light'
    else currentMode = tenantMode as SystemMode
  }

  const theme = useMemo(() => {
    const newColorScheme = {
      colorSchemes: {
        light: {
          palette: {
            primary: {
              main: effectivePrimaryColor,
              light: lighten(effectivePrimaryColor as string, 0.2),
              dark: darken(effectivePrimaryColor as string, 0.1),
            },
          },
        },
        dark: {
          palette: {
            primary: {
              main: effectivePrimaryColor,
              light: lighten(effectivePrimaryColor as string, 0.2),
              dark: darken(effectivePrimaryColor as string, 0.1),
            },
          },
        },
      },
    }

    const updatedSettings = {
      ...settings,
      primaryColor: effectivePrimaryColor,
      mode: tenantMode,
    }

    const coreTheme = deepmerge(defaultCoreTheme(updatedSettings, currentMode, direction), newColorScheme)

    return extendTheme(coreTheme, { colorSchemeSelector: 'class' })
  }, [settings, currentMode, direction, effectivePrimaryColor, tenantMode])

  const cache = useMemo(
    () =>
      createCache({
        key: direction === 'rtl' ? 'rtl' : 'css',
        prepend: true,
        ...(direction === 'rtl' && {
          stylisPlugins: [stylisRTLPlugin],
        }),
      }),
    [direction],
  )

  return (
    <CacheProvider value={cache}>
      <CssVarsProvider
        theme={theme}
        defaultMode={systemMode}
        modeStorageKey={`${themeConfig.templateName.toLowerCase().split(' ').join('-')}-mui-template-mode`}
      >
        <>
          <ModeChanger />
          <CssBaseline />
          {children}
        </>
      </CssVarsProvider>
    </CacheProvider>
  )
}

export default ThemeProvider
