import type { ComponentsOverrides } from '@mui/material/styles'
import type {
  CustomInputHorizontalProps,
  CustomInputVerticalProps,
  CustomInputImgProps,
} from '@cap/layout/components/ui/custom-inputs/types'
import type { TenantThemeConfig } from '../../../types'

declare module '@mui/material/styles' {
  // Theme
  interface Theme {
    tenantTheme?: TenantThemeConfig
    shape: {
      borderRadius: number
      customBorderRadius: {
        xs: number
        sm: number
        md: number
        lg: number
        xl: number
      }
    }
  }
  interface ThemeOptions {
    tenantTheme?: TenantThemeConfig
    shape?: {
      borderRadius?: number
      customBorderRadius?: {
        xs?: number
        sm?: number
        md?: number
        lg?: number
        xl?: number
      }
    }
  }

  // Palette Color
  interface PaletteColor {
    100?: string
    200?: string
    300?: string
    400?: string
    500?: string
    600?: string
    700?: string
    800?: string
    900?: string
    lighterOpacity?: string
    lightOpacity?: string
    mainOpacity?: string
    darkOpacity?: string
    darkerOpacity?: string
  }
  interface SimplePaletteColorOptions {
    100?: string
    200?: string
    300?: string
    400?: string
    500?: string
    600?: string
    700?: string
    800?: string
    900?: string
    lighterOpacity?: string
    lightOpacity?: string
    mainOpacity?: string
    darkOpacity?: string
    darkerOpacity?: string
  }
  interface TypeBackground {
    default: string
    paper: string
    defaultChannel?: string
    paperChannel?: string
  }

  // Palette
  interface Palette {
    background: TypeBackground
    primaryChannel: string
    secondaryChannel: string
    errorChannel: string
    warningChannel: string
    infoChannel: string
    successChannel: string
    surface: PaletteColor
    surfaceMixed: PaletteColor
    customColors: {
      bodyBg: string
      chatBg: string
      greyLightBg: string
      inputBorder: string
      tableHeaderBg: string
      tooltipText: string
      trackBg: string
      brandGold: string
      brandBrown: string
      brandSlate: string
      brandCream: string
    }
  }
  interface PaletteOptions {
    background?: {
      default?: string
      paper?: string
      defaultChannel?: string
      paperChannel?: string
    }
    primaryChannel?: string
    secondaryChannel?: string
    errorChannel?: string
    warningChannel?: string
    infoChannel?: string
    successChannel?: string
    surface?: SimplePaletteColorOptions
    surfaceMixed?: SimplePaletteColorOptions
    customColors?: {
      bodyBg?: string
      chatBg?: string
      greyLightBg?: string
      inputBorder?: string
      tableHeaderBg?: string
      tooltipText?: string
      trackBg?: string
      brandGold?: string
      brandBrown?: string
      brandSlate?: string
      brandCream?: string
    }
  }
  interface PalettePaperChannel {
    paperChannel?: string
  }
  interface TypeBackground extends PalettePaperChannel {}

  // Components
  interface ComponentNameToClassKey {
    MuiCustomInputHorizontal: 'root' | 'title' | 'meta' | 'content' | 'input'
    MuiCustomInputVertical: 'root' | 'title' | 'content' | 'input'
    MuiCustomImage: 'root' | 'image' | 'input'
  }

  interface ComponentsPropsList {
    MuiCustomInputHorizontal: CustomInputHorizontalProps
    MuiCustomInputVertical: CustomInputVerticalProps
    MuiCustomImage: CustomInputImgProps
  }

  interface Components {
    MuiCustomInputHorizontal?: {
      defaultProps?: ComponentsPropsList['MuiCustomInputHorizontal']
      styleOverrides?: ComponentsOverrides<Theme>['MuiCustomInputHorizontal']
    }
    MuiCustomInputVertical?: {
      defaultProps?: ComponentsPropsList['MuiCustomInputVertical']
      styleOverrides?: ComponentsOverrides<Theme>['MuiCustomInputVertical']
    }
    MuiCustomImage?: {
      defaultProps?: ComponentsPropsList['MuiCustomImage']
      styleOverrides?: ComponentsOverrides<Theme>['MuiCustomImage']
    }
  }
}


declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    tonal: true
  }
}

declare module '@mui/material/ButtonGroup' {
  interface ButtonGroupPropsVariantOverrides {
    tonal: true
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsVariantOverrides {
    tonal: true
  }
}
