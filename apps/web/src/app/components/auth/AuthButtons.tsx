import React from 'react'
import { Button, Stack } from '@mui/material'
import { useNavigate } from 'react-router-dom'

/**
 * Placeholder component for authentication buttons (Login/Register)
 * TODO: Implement full Auth buttons when Auth module is ready
 */
const AuthButtons: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Stack direction='row' spacing={1}>
      <Button
        variant='outlined'
        size='small'
        onClick={() => navigate('/auth/signin')}
      >
        Login
      </Button>
      <Button
        variant='contained'
        size='small'
        onClick={() => navigate('/auth/signup')}
      >
        Register
      </Button>
    </Stack>
  )
}

export default AuthButtons
