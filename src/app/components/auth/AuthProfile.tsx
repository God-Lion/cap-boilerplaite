import React from 'react'
import { Avatar, Box, Typography } from '@mui/material'
import { useAuth } from '@/store/index'

/**
 * Placeholder component for displaying authenticated user profile
 * TODO: Implement full Auth profile component when Auth module is ready
 */
export const AuthProfile: React.FC = () => {
  const { user } = useAuth()

  if (!user?.user) {
    return null
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar
        alt={user.user.firstName || ''}
        src={user.user.avatar || ''}
        sx={{ width: 32, height: 32 }}
      />
      <Typography variant='body2' noWrap>
        {user.user.firstName || user.user.email}
      </Typography>
    </Box>
  )
}

export default AuthProfile
