import '@mui/material/styles'
import type {} from '@mui/lab/themeAugmentation'

interface ShadowSize {
  sm: string
  md: string
  lg: string
}

declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
      primary: ShadowSize
      secondary: ShadowSize
      info: ShadowSize
      success: ShadowSize
      warning: ShadowSize
      error: ShadowSize
    }
  }

  interface ThemeOptions {
    customShadows?: {
      xs?: string
      sm?: string
      md?: string
      lg?: string
      xl?: string
      primary?: Partial<ShadowSize>
      secondary?: Partial<ShadowSize>
      info?: Partial<ShadowSize>
      success?: Partial<ShadowSize>
      warning?: Partial<ShadowSize>
      error?: Partial<ShadowSize>
    }
  }
}

declare module '@mui/material/Pagination' {
  interface PaginationPropsVariantOverrides {
    tonal: true
  }
}

declare module '@mui/lab/TimelineDot' {
  interface TimelineDotPropsVariantOverrides {
    tonal: true
  }
}
