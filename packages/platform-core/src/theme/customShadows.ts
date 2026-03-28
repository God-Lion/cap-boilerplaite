import type { Theme } from '@mui/material/styles'
import type { SystemMode } from '../types'

const customShadows = (mode: SystemMode): Theme['customShadows'] => {
  // Static shadow colors — no CSS variables since we are NOT in cssVariables mode.
  // light shadow channel: 47,43,61 | dark shadow channel: 19,17,32
  const shadowOpacity = { xs: mode === 'light' ? 0.1 : 0.16, sm: mode === 'light' ? 0.12 : 0.18, md: mode === 'light' ? 0.14 : 0.2, lg: mode === 'light' ? 0.16 : 0.22, xl: mode === 'light' ? 0.18 : 0.24 }
  const [r, g, b] = mode === 'light' ? [47, 43, 61] : [19, 17, 32]
  return {
    xs: `0px 1px 6px rgba(${r}, ${g}, ${b}, ${shadowOpacity.xs})`,
    sm: `0px 2px 8px rgba(${r}, ${g}, ${b}, ${shadowOpacity.sm})`,
    md: `0px 3px 12px rgba(${r}, ${g}, ${b}, ${shadowOpacity.md})`,
    lg: `0px 4px 18px rgba(${r}, ${g}, ${b}, ${shadowOpacity.lg})`,
    xl: `0px 5px 30px rgba(${r}, ${g}, ${b}, ${shadowOpacity.xl})`,
    primary: {
      sm: 'rgba(115, 103, 240, 0.3) 0px 2px 6px',
      md: 'rgba(115, 103, 240, 0.4) 0px 4px 16px',
      lg: 'rgba(115, 103, 240, 0.5) 0px 6px 20px',
    },
    secondary: {
      sm: 'rgba(128, 131, 144, 0.3) 0px 2px 6px',
      md: 'rgba(128, 131, 144, 0.4) 0px 4px 16px',
      lg: 'rgba(128, 131, 144, 0.5) 0px 6px 20px',
    },
    error: {
      sm: 'rgba(255, 76, 81, 0.3) 0px 2px 6px',
      md: 'rgba(255, 76, 81, 0.4) 0px 4px 16px',
      lg: 'rgba(255, 76, 81, 0.5) 0px 6px 20px',
    },
    warning: {
      sm: 'rgba(255, 159, 67, 0.3) 0px 2px 6px',
      md: 'rgba(255, 159, 67, 0.4) 0px 4px 16px',
      lg: 'rgba(255, 159, 67, 0.5) 0px 6px 20px',
    },
    info: {
      sm: 'rgba(0, 186, 209, 0.3) 0px 2px 6px',
      md: 'rgba(0, 186, 209, 0.4) 0px 4px 16px',
      lg: 'rgba(0, 186, 209, 0.5) 0px 6px 20px',
    },
    success: {
      sm: 'rgba(40, 199, 111, 0.3) 0px 2px 6px',
      md: 'rgba(40, 199, 111, 0.4) 0px 4px 16px',
      lg: 'rgba(40, 199, 111, 0.5) 0px 6px 20px',
    },
  }
}

export default customShadows
