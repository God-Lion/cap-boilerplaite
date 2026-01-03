// cspell:ignore stylis
import React, { useMemo } from 'react'
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
import { themeConfig, useSettings } from '@cap/platform-core'
import { defaultCoreTheme } from '@cap/platform-core'
import { deepmerge } from '@mui/utils'

const ThemeProvider: React.FC<
  ChildrenType & {
    direction: Direction
    systemMode: SystemMode
  }
> = ({ children, direction, systemMode }) => {
  const { settings } = useSettings()
  const isDark = useMedia('(prefers-color-scheme: dark)', false)
  const isServer = typeof window === 'undefined'
  let currentMode: SystemMode

  if (isServer) currentMode = systemMode
  else {
    if (settings.mode === 'system') currentMode = isDark ? 'dark' : 'light'
    else currentMode = settings.mode as SystemMode
  }

  const theme = useMemo(() => {
    const newColorScheme = {
      colorSchemes: {
        light: {
          palette: {
            primary: {
              main: settings.primaryColor,
              light: lighten(settings.primaryColor as string, 0.2),
              dark: darken(settings.primaryColor as string, 0.1),
            },
          },
        },
        dark: {
          palette: {
            primary: {
              main: settings.primaryColor,
              light: lighten(settings.primaryColor as string, 0.2),
              dark: darken(settings.primaryColor as string, 0.1),
            },
          },
        },
      },
    }

    const coreTheme = deepmerge(defaultCoreTheme(settings, currentMode, direction), newColorScheme)

    return extendTheme(coreTheme, { colorSchemeSelector: 'class' })
  }, [settings, currentMode, direction])

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
