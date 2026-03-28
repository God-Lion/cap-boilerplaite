import type { Theme } from '@mui/material/styles'
import type {} from '@mui/lab/themeAugmentation'
import '../types/mui.d.ts'

import type { SystemMode, Skin, Settings } from '../types'

// Theme Options Imports
import { coreOverrides } from '@cap/theme'
// colorSchemes removed — not used in static theme mode (MUI v6 processes this
// key by calling alpha() internally for CSS variable generation, which crashes)
import spacing from './spacing'
import shadows from './shadows'
import customShadows from './customShadows'
import { zIndexScale } from '@cap/theme'


const theme = (settings: Settings, mode: SystemMode, direction: Theme['direction']): Theme => {
  return {
    direction,
    components: coreOverrides(settings.skin as Skin),
    // NOTE: colorSchemes intentionally omitted — MUI v6 processes that key by running
    // alpha() on palette entries for CSS variable generation, which crashes in static
    // (non-cssVariables) mode. Palette opacity tokens are added via composeMuiTheme.
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
    // typography: typography(public_sans.style.fontFamily),
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
