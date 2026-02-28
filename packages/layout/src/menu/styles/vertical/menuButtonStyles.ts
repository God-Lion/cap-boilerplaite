import { css } from '@emotion/react'
import type { ChildrenType } from '../../types'
import { menuClasses } from '../../utils/menuClasses'

type MenuButtonStylesProps = Partial<ChildrenType> & {
  level: number
  active?: boolean
  disabled?: boolean
  isCollapsed?: boolean
  isPopoutWhenCollapsed?: boolean
}

export const menuButtonStyles = (props: MenuButtonStylesProps) => {
  // Props
  const { level, disabled, children, isCollapsed, isPopoutWhenCollapsed } = props

  return css({
    display: 'flex',
    alignItems: 'center',
    minBlockSize: '30px',
    textDecoration: 'none',
    color: 'inherit',
    boxSizing: 'border-box',
    cursor: 'pointer',
    paddingInlineEnd: '20px',
    paddingInlineStart: `${
      level === 0 ? 20 : (isPopoutWhenCollapsed && isCollapsed ? level : level + 1) * 20
    }px`,

    '&:hover, &[aria-expanded="true"]': {
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
      ...(!children && { color: 'white' }),
      backgroundColor: children
        ? 'var(--mui-palette-action-hover)'
        : 'var(--mui-palette-primary-main)',
    },
  })
}
