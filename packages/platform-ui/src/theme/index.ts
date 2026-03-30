import type { Theme } from '@mui/material/styles'
import type {} from '@mui/lab/themeAugmentation'
import '../types/mui.d.ts'

import type { Skin, Settings } from '@cap/shared-types'

// Re-export SystemMode from @cap/theme for convenience
export type { SystemMode } from '@cap/theme'

// Theme Options Imports
import { coreOverrides } from '@cap/theme'
import spacing from './spacing'
import shadows from './shadows'
import customShadows from './customShadows'
import { zIndexScale } from '@cap/theme'

import type { SystemMode } from '@cap/theme'

const theme = (settings: Settings, mode: SystemMode, direction: Theme['direction']): Theme => {
  return {
    direction,
    components: coreOverrides(settings.skin as Skin),
    ...spacing,
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
    shadows: shadows(mode),
    customShadows: customShadows(mode),
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
