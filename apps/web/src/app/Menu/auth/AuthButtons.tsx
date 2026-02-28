import { Button, Stack } from '@mui/material'
import { Link } from 'react-router-dom'
import { Path } from '@cap/module-auth'

const AuthButtons = () => {
  return (
    <Stack direction='row' spacing={2}>
      <Button component={Link} to={Path.auth.signin} variant='text' color='primary'>
        Sign In
      </Button>
      <Button component={Link} to={Path.auth.signup} variant='contained' color='primary'>
        Sign Up
      </Button>
    </Stack>
  )
}

export default AuthButtons
