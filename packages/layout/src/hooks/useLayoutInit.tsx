import { useEffect, useRef } from 'react'
import { useCookie, useMedia } from 'react-use'
import { useColorScheme } from '@mui/material'
import { SystemMode, useSettings } from '@cap/platform-core'

const useLayoutInit = (colorSchemeFallback: SystemMode) => {
  const { settings } = useSettings()
  const { setMode } = useColorScheme()
  const [, updateCookieColorPref] = useCookie('colorPref')
  const isDark = useMedia('(prefers-color-scheme: dark)', colorSchemeFallback === 'dark')

  // Track mount to skip the initial effect — the color class is already set
  // by the inline script in index.html before React hydrates.
  const isMountedRef = useRef(false)

  useEffect(() => {
    const appMode = isDark ? 'dark' : 'light'

    // Always keep the colorPref cookie in sync (used by getSystemMode())
    updateCookieColorPref(appMode)

    // Only update MUI mode after the first render to avoid double-painting.
    // ModeChanger.tsx owns the authoritative setMode() call; we only need to
    // sync the colorPref cookie here (done above).
    if (!isMountedRef.current) {
      isMountedRef.current = true
      return
    }

    if (settings.mode === 'system') {
      setMode(appMode)
    }
  }, [isDark, setMode, settings.mode, updateCookieColorPref])
}

export default useLayoutInit
