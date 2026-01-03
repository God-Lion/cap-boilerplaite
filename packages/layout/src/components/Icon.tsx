import React from 'react'
import * as MuiIcons from '@mui/icons-material'
import { SvgIconProps } from '@mui/material'

interface IconProps extends SvgIconProps {
  icon: string
}

const Icon: React.FC<IconProps> = ({ icon, ...props }) => {
  const IconComponent = (MuiIcons as unknown as Record<string, React.ComponentType<SvgIconProps>>)[
    icon
  ]

  if (!IconComponent) {
    return null
  }

  return <IconComponent {...props} />
}

export default Icon
