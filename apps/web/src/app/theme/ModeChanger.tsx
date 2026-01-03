import React from 'react'
import { useMedia } from 'react-use'
import { useColorScheme } from '@mui/material/styles'
import { useSettings } from '@cap/platform-core'

const ModeChanger = () => {
  const { settings } = useSettings()
  const { setMode } = useColorScheme()
  const isDark = useMedia('(prefers-color-scheme: dark)', false)

  React.useEffect(() => {
    if (settings.mode) {
      // Update MUI internal mode
      setMode(settings.mode as 'light' | 'dark' | 'system')

      const mode: 'light' | 'dark' =
        settings.mode === 'system'
          ? isDark
            ? 'dark'
            : 'light'
          : (settings.mode as 'light' | 'dark')

      // Remove old color scheme classes
      document.documentElement.classList.remove('light', 'dark')

      // Add new color scheme class
      document.documentElement.classList.add(mode)

      // Update body color-scheme for better browser defaults
      document.body.style.colorScheme = mode
    }
  }, [settings.mode, isDark, setMode])

  return null
}

export default ModeChanger
