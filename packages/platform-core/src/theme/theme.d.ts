import '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Theme {
    colorSchemes: Record<string, unknown>
  }
  interface ThemeOptions {
    colorSchemes?: Record<string, unknown>
  }
}
