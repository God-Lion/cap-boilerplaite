import { css } from '@emotion/react'
import type { Theme } from '@mui/material/styles'
import type { ChildrenType } from '../../types'
import { menuClasses } from '../../utils/menuClasses'

type MenuButtonStylesProps = Partial<ChildrenType> & {
  level: number
  disabled?: boolean
  theme?: Theme
}

export const menuButtonStyles = (props: MenuButtonStylesProps) => {
  const { level, disabled, children, theme } = props

  const hoverBg = theme?.palette?.action?.hover || 'rgba(0, 0, 0, 0.04)'
  const disabledColor = theme?.palette?.text?.disabled || 'rgba(0, 0, 0, 0.38)'
  const primaryMain = theme?.palette?.primary?.main || '#1976d2'
  const primaryOpacity = (theme as any)?.palette?.primary?.mainOpacity || 'rgba(25, 118, 210, 0.16)'

  return css({
    display: 'flex',
    alignItems: 'center',
    minBlockSize: '30px',
    textDecoration: 'none',
    color: 'inherit',
    boxSizing: 'border-box',
    cursor: 'pointer',
    paddingInline: '20px',

    '&:hover': {
      backgroundColor: hoverBg,
    },

    '&:focus-visible': {
      outline: 'none',
      backgroundColor: hoverBg,
    },

    ...(disabled && {
      pointerEvents: 'none',
      cursor: 'default',
      color: disabledColor,
    }),

    // All the active styles are applied to the button including menu items or submenu
    [`&.${menuClasses.active}`]: {
      ...(level === 0
        ? {
            color: 'white',
            backgroundColor: primaryMain,
          }
        : {
            ...(children
              ? { backgroundColor: hoverBg }
              : {
                  color: primaryMain,
                  backgroundColor: primaryOpacity,
                }),
          }),
    },
  })
}
