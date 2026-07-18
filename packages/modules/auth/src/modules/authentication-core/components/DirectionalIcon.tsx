import { useTheme } from '@mui/material/styles'
import classnames from 'classnames'

import { HTMLAttributes } from 'react'

type Props = HTMLAttributes<HTMLElement> & {
  ltrIconClass: string
  rtlIconClass: string
  className?: string
}

const DirectionalIcon = (props: Props) => {
  const { ltrIconClass, rtlIconClass, className, ...rest } = props
  const theme = useTheme()

  return (
    <i
      className={classnames(
        {
          [ltrIconClass]: theme.direction === 'ltr',
          [rtlIconClass]: theme.direction === 'rtl',
        },
        className,
      )}
      {...rest}
    />
  )
}

export default DirectionalIcon
