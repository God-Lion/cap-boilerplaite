import type { ThemeColor } from '@cap/platform-core'
import type { AvatarProps } from '@mui/material/Avatar'
import MuiAvatar from '@mui/material/Avatar'
import { styled } from '@mui/material/styles'

export type CustomAvatarProps = AvatarProps & {
  color?: ThemeColor
  skin?: 'light' | 'filled' | 'light-static'
  size?: number | string
}

const CustomAvatar = styled(MuiAvatar)<CustomAvatarProps>(({ size }) => ({
  ...(size && {
    width: size,
    height: size,
  }),
}))

export default CustomAvatar
