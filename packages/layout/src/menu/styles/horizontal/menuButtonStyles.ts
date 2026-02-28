import { css } from '@emotion/react'
import type { ChildrenType } from '../../types'
import { menuClasses } from '../../utils/menuClasses'

type MenuButtonStylesProps = Partial<ChildrenType> & {
  level: number
  disabled?: boolean
}

export const menuButtonStyles = (props: MenuButtonStylesProps) => {
  const { level, disabled, children } = props

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
      backgroundColor: 'var(--mui-palette-action-hover)',
    },

    '&:focus-visible': {
      outline: 'none',
      backgroundColor: 'var(--mui-palette-action-hover)',
    },

    ...(disabled && {
      pointerEvents: 'none',
      cursor: 'default',
      color: 'var(--mui-palette-text-disabled)',
    }),

    // All the active styles are applied to the button including menu items or submenu
    [`&.${menuClasses.active}`]: {
      ...(level === 0
        ? {
            color: 'white',
            backgroundColor: 'var(--mui-palette-primary-main)',
          }
        : {
            ...(children
              ? { backgroundColor: 'var(--mui-palette-action-hover)' }
              : {
                  color: 'var(--mui-palette-primary-main)',
                  backgroundColor: 'var(--mui-palette-primary-mainOpacity)',
                }),
          }),
    },
  })
}
