import '@mui/material/styles'

declare module '@mui/lab/TimelineDot' {
  interface TimelineDotPropsVariantOverrides {
    outlined: true
    filled: true
  }
}

declare module '@mui/material/Pagination' {
  interface PaginationPropsVariantOverrides {
    text: true
  }
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
    mainColorChannels?: {
      light?: string
      dark?: string
      lightShadow?: string
      darkShadow?: string
    }
  }
}

export {}
