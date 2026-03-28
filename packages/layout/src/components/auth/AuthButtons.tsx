import React from 'react'
import { Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@cap/platform-core'

/**
 * Shared component for authentication buttons (Login/Register)
 */
const AuthButtons: React.FC = () => {
  const navigate = useNavigate()
  // We'll avoid importing Path from @cap/module-auth to break circularity.
  // We can hardcode the paths or move Path to platform-core later.
  const authPaths = {
    signin: '/login',
    signup: '/register'
  }

  return (
    <Stack direction='row' spacing={1}>
      <Button variant='outlined' size='small' onClick={() => navigate(authPaths.signin)}>
        Login
      </Button>
      <Button variant='contained' size='small' onClick={() => navigate(authPaths.signup)}>
        Register
      </Button>
    </Stack>
  )
}

export default AuthButtons
