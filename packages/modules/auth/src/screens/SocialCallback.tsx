import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@cap/platform-core'
import { CircularProgress, Box, Typography } from '@mui/material'

const SocialCallback: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { setUser } = useAuth()

  useEffect(() => {
    const token = searchParams.get('token')
    const userId = searchParams.get('userId')
    const error = searchParams.get('error')

    if (error) {
      console.error('Social Login Error:', error)
      navigate('/auth/sign-in?error=' + error)
      return
    }

    if (token) {
      // In a real app we might fetch the user profile here using the token
      // For now constructing a minimal user object
      const authData = {
        token: token,
        refreshToken: '',
        id: userId ? parseInt(userId) : 0,
        role: 'USER',
        email: '',
        firstname: 'User',
        lastname: '',
        avatar: '',
      }

      setUser(authData as any)

      // Redirect to dashboard
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    } else {
      navigate('/auth/sign-in')
    }
  }, [searchParams, navigate, setUser])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress />
      <Typography sx={{ mt: 2 }}>Completing login...</Typography>
    </Box>
  )
}

export default SocialCallback
