import { Button, Stack } from '@mui/material'
import { Link } from 'react-router-dom'

const AuthButtons = () => {
  return (
    <Stack direction='row' spacing={2}>
      <Button component={Link} to='/auth/sign-in' variant='text' color='primary'>
        Sign In
      </Button>
      <Button component={Link} to='/auth/sign-up' variant='contained' color='primary'>
        Sign Up
      </Button>
    </Stack>
  )
}

export default AuthButtons
