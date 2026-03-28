import type { ToastPosition } from 'react-toastify'

import type { Mode, Skin, Layout, LayoutComponentPosition, LayoutComponentWidth } from '../types'

type Navbar = {
  type: LayoutComponentPosition
  contentWidth: LayoutComponentWidth
  floating: boolean
  detached: boolean
  blur: boolean
}

type Footer = {
  type: LayoutComponentPosition
  contentWidth: LayoutComponentWidth
  detached: boolean
}

type ColorPalette = {
  main: string
  light: string
  dark: string
  contrastText: string
}

type ThemeColors = {
  primary: ColorPalette
  secondary: ColorPalette
  error: ColorPalette
  success: ColorPalette
  warning: ColorPalette
  info: ColorPalette
  brandGold: string
  brandBrown: string
  brandSlate: string
  brandCream: string
}

type ShapeConfig = {
  borderRadius: number
  customBorderRadius: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }
}

import { colors } from '@cap/theme';

export type Config = {
  templateName: string
  settingsCookieName: string
  mode: Mode
  skin: Skin
  semiDark: boolean
  layout: Layout
  layoutPadding: number
  navbar: Navbar
  contentWidth: LayoutComponentWidth
  compactContentWidth: number
  footer: Footer
  disableRipple: boolean
  toastPosition: ToastPosition
  colors: ThemeColors
  shape: ShapeConfig
}

const themeConfig: Config = {
  templateName: 'CapPlatform',
  settingsCookieName: 'cap-platform-settings',
  mode: 'light',
  skin: 'default',
  semiDark: false,
  layout: 'vertical',
  layoutPadding: 24,
  compactContentWidth: 1440,
  navbar: {
    type: 'fixed',
    contentWidth: 'compact',
    floating: true,
    detached: true,
    blur: true,
  },
  contentWidth: 'compact',
  footer: {
    type: 'static',
    contentWidth: 'compact',
    detached: true,
  },
  disableRipple: false,
  toastPosition: 'top-right',
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    success: colors.success,
    warning: colors.warning,
    info: colors.info,
    brandGold: colors.brand.gold,
    brandBrown: colors.brand.brown,
    brandSlate: colors.brand.slate,
    brandCream: colors.brand.cream,
  },
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
}

// const themeConfig: Config = {
//   templateName: 'GLDeveloper',
//   settingsCookieName: 'GLDeveloper-1',
//   mode: 'system', // 'system', 'light', 'dark'
//   skin: 'default', // 'default', 'bordered'
//   semiDark: false, // true, false
//   layout: 'vertical', // 'vertical', 'collapsed', 'horizontal'
//   layoutPadding: 24, // Common padding for header, content, footer layout components (in px)
//   compactContentWidth: 1440, // in px
//   navbar: {
//     type: 'fixed', // 'fixed', 'static'
//     contentWidth: 'compact', // 'compact', 'wide'
//     floating: true, //! true, false (This will not work in the Horizontal Layout)
//     detached: true, //! true, false (This will not work in the Horizontal Layout or floating navbar is enabled)
//     blur: true, // true, false
//   },
//   contentWidth: 'compact', // 'compact', 'wide'
//   footer: {
//     type: 'static', // 'fixed', 'static'
//     contentWidth: 'compact', // 'compact', 'wide'
//     detached: true, //! true, false (This will not work in the Horizontal Layout)
//   },
//   disableRipple: false, // true, false
//   toastPosition: 'top-right', // 'top-right', 'top-center', 'top-left', 'bottom-right', 'bottom-center', 'bottom-left'
// }

export default themeConfig
