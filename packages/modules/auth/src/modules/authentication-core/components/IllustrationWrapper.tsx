import { Box } from '@mui/material'
import { styled } from '@mui/material/styles'

export const IllustrationWrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(6),
  // backgroundColor: theme.palette.background.default,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}))
