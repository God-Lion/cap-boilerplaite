import React from 'react'
import { Chip } from '@mui/material'
import { useAuth } from '@/store/index'

interface RoleIndicatorProps {
  showLabel?: boolean
  size?: 'small' | 'medium'
}

/**
 * Placeholder component for displaying user role
 * TODO: Implement full role indicator functionality when Auth module is ready
 */
export const RoleIndicator: React.FC<RoleIndicatorProps> = ({
  showLabel = true,
  size = 'small',
}) => {
  const { user } = useAuth()

  // Placeholder: Show role from user data when available
  if (!user?.user?.role) {
    return null
  }

  const roleStr = String(user.user.role)

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
