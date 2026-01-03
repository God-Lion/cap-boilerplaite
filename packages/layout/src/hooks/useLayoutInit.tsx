import { useEffect } from 'react'
import { useCookie, useMedia } from 'react-use'
import { useColorScheme } from '@mui/material'
import { SystemMode, useSettings } from '@cap/platform-core'

const useLayoutInit = (colorSchemeFallback: SystemMode) => {
  const { settings } = useSettings()
  const { setMode } = useColorScheme()
  const [, updateCookieColorPref] = useCookie('colorPref')
  const isDark = useMedia('(prefers-color-scheme: dark)', colorSchemeFallback === 'dark')

  useEffect(() => {
    const appMode = isDark ? 'dark' : 'light'

    updateCookieColorPref(appMode)

    if (settings.mode === 'system') {
      setMode(appMode)
    }
  }, [isDark, setMode, settings.mode, updateCookieColorPref])
}

export default useLayoutInit
