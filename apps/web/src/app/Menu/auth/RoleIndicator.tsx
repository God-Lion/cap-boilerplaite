import React from 'react'
import { Chip } from '@mui/material'
import { useAuth } from '@cap/platform-core'

interface RoleIndicatorProps {
  showLabel?: boolean
  size?: 'small' | 'medium'
}

/**
 * Component for displaying user role
 */
export const RoleIndicator: React.FC<RoleIndicatorProps> = ({
  showLabel = true,
  size = 'small',
}) => {
  const { user } = useAuth()

  // Show role from user data when available
  if (!user || !user.role) {
    return null
  }

  const roleStr = String(user.role)

  return (
    <Chip
      label={showLabel ? roleStr : roleStr.charAt(0).toUpperCase()}
      size={size}
      color='primary'
      variant='outlined'
    />
  )
}

export default RoleIndicator
