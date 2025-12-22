import { createTheme, alpha } from '@mui/material/styles'

// Premium Color Palette
const palette = {
  primary: {
    main: '#D4AF37', // Gold
    light: '#F3E5AB',
    dark: '#AA8C2C',
    contrastText: '#000000',
  },
  secondary: {
    main: '#1A1A1A', // Dark Grey/Black
    light: '#2C2C2C',
    dark: '#000000',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#0A0A0A', // Very dark grey for premium feel
    paper: '#141414',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
  },
  success: {
    main: '#4CAF50',
  },
  error: {
    main: '#F44336',
  },
  warning: {
    main: '#FF9800',
  },
  info: {
    main: '#2196F3',
  },
}

const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontWeight: 700,
    fontSize: '3.5rem',
    letterSpacing: '-0.02em',
  },
  h2: {
    fontWeight: 700,
    fontSize: '2.5rem',
    letterSpacing: '-0.01em',
  },
  h3: {
    fontWeight: 600,
    fontSize: '2rem',
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.5rem',
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.25rem',
  },
  h6: {
    fontWeight: 600,
    fontSize: '1rem',
  },
  button: {
    fontWeight: 600,
    textTransform: 'none' as const,
  },
}

const components = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 24px',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: '0 4px 12px rgba(212, 175, 55, 0.2)',
        },
      },
      containedPrimary: {
        background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
        '&:hover': {
          background: `linear-gradient(135deg, ${palette.primary.light} 0%, ${palette.primary.main} 100%)`,
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        backgroundImage: 'none',
        backgroundColor: palette.background.paper,
        border: '1px solid rgba(255, 255, 255, 0.05)',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
          borderColor: alpha(palette.primary.main, 0.3),
        },
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundImage: 'none',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
      },
      filled: {
        backgroundColor: alpha(palette.primary.main, 0.1),
        color: palette.primary.main,
        border: `1px solid ${alpha(palette.primary.main, 0.2)}`,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          backgroundColor: alpha(palette.secondary.light, 0.3),
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.2)',
          },
          '&.Mui-focused fieldset': {
            borderColor: palette.primary.main,
          },
        },
      },
    },
  },
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    ...palette,
  },
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
})

export default theme
