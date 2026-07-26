import type { Theme } from '@mui/material/styles'
import type {} from '@mui/lab/themeAugmentation'
import '../types/mui.d.ts'

import type { Skin, Settings } from '../types'

// Re-export SystemMode from @cap/theme for convenience
export type { SystemMode } from '@cap/theme'

// Theme Options Imports directly from @cap/theme
import { coreOverrides, themeShadows, themeCustomShadows, zIndexScale } from '@cap/theme'
import type { SystemMode } from '@cap/theme'

const theme = (settings: Settings, mode: SystemMode, direction: Theme['direction']): Theme => {
  return {
    direction,
    components: coreOverrides(settings.skin as Skin),
    spacing: (factor: number) => `${0.25 * factor}rem`,
    shape: {
      borderRadius: 6,
      customBorderRadius: {
        xs: 2,
        sm: 4,
        md: 6,
        lg: 8,
        xl: 10,
      },
    },
    shadows: themeShadows(mode),
    customShadows: themeCustomShadows(mode),
    zIndex: zIndexScale,
    mainColorChannels: {
      light: '47 43 61',
      dark: '225 222 245',
      lightShadow: '47 43 61',
      darkShadow: '19 17 32',
    },
  } as unknown as Theme
}

export default theme
