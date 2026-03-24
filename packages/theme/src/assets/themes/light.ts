import { createTheme } from '@mui/material'
import BaseTheme from './Base'

const lightTheme = createTheme({
  ...BaseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#82368C', // '#F96156',
    },
    secondary: {
      main: '#07AEB5', // '#004AAD',
    },
  },
})
export default lightTheme
