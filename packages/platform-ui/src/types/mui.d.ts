import '@mui/material/styles'
import type {} from '@mui/lab/themeAugmentation'

interface ShadowSize {
  sm: string
  md: string
  lg: string
}

declare module '@mui/material/styles' {
  interface ZIndex {
    base: number
    content: number
    elevated: number
    local: {
      behind: number
      base: number
      above: number
      highlight: number
      overlay: number
    }
    appBar: number
    drawer: number
    dropdown: number
    modal: number
    snackbar: number
    tooltip: number
    loadingBackdrop: number
    search: number
    layout: {
      header: number
      footer: number
      navigation: number
      backdrop: number
      modal: number
    }
  }

  interface Theme {
    colorSchemes: {
      light: {
        palette: any
      }
      dark: {
        palette: any
      }
    }
    zIndex: ZIndex
    // customShadows has been migrated to @cap/theme
    mainColorChannels: {
      light: string
      dark: string
      lightShadow: string
      darkShadow: string
    }
  }

  interface ThemeOptions {
    colorSchemes?: {
      light?: {
        palette: any
      }
      dark?: {
        palette: any
      }
    }
    zIndex?: Partial<ZIndex>
    // customShadows has been migrated to @cap/theme
    mainColorChannels?: {
      light?: string
      dark?: string
      lightShadow?: string
      darkShadow?: string
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Components<Theme = unknown> {
    MuiTimeline?: any
    MuiTimelineDot?: any
    MuiTimelineConnector?: any
    MuiTimelineContent?: any
    MuiTabPanel?: any
  }
}

declare module '@mui/material/Pagination' {
  interface PaginationPropsVariantOverrides {
    text: true
  }

  interface PaginationItemPropsVariantOverrides {
    text: true
  }
}

declare module '@mui/material/PaginationItem' {
  interface PaginationItemPropsVariantOverrides {
    text: true
  }
}

declare module '@mui/lab/TimelineDot' {
  interface TimelineDotPropsVariantOverrides {
    outlined: true
    filled: true
  }
}
