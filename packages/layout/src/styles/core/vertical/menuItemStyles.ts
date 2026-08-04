// MUI Imports
import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'

// Type Imports
import type { MenuItemStyles, MenuItemStylesParams } from '../../../menu/types'
import type { Settings } from '@cap/platform-core'
import type { VerticalNavState } from '../../../menu/contexts/verticalNavContext'

// Util Imports
import { menuClasses } from '../../../menu/utils/menuClasses'

const menuItemStyles = (
  verticalNavOptions: VerticalNavState,
  theme: Theme,
  settings: Settings,
): MenuItemStyles => {
  // Vars
  const { isCollapsed, isHovered, isPopoutWhenCollapsed, transitionDuration } = verticalNavOptions

  const popoutCollapsed = isPopoutWhenCollapsed && isCollapsed
  const popoutExpanded = isPopoutWhenCollapsed && !isCollapsed
  const collapsedNotHovered = isCollapsed && !isHovered

  return {
    root: ({ level }: MenuItemStylesParams) => ({
      ...(!isPopoutWhenCollapsed || popoutExpanded || (popoutCollapsed && level === 0)
        ? {
            marginBlockStart: theme.spacing(1.5),
          }
        : {
            marginBlockStart: 0,
          }),
      [`&.${menuClasses.subMenuRoot}.${menuClasses.open} > .${menuClasses.button}, &.${menuClasses.subMenuRoot} > .${menuClasses.button}.${menuClasses.active}`]:
        {
          backgroundColor: `${theme.palette.action.selected} !important`,
        },
      [`&.${menuClasses.disabled} > .${menuClasses.button}`]: {
        color: theme.palette.text.disabled,
      },
      [`&:not(.${menuClasses.subMenuRoot}) > .${menuClasses.button}.${menuClasses.active}`]: {
        ...(popoutCollapsed && level > 0
          ? {
              backgroundColor: alpha(theme.palette.primary.main, 0.16),
              color: theme.palette.primary.main,
              [`& .${menuClasses.icon}`]: {
                color: theme.palette.primary.main,
              },
            }
          : {
              color: theme.palette.primary.contrastText,
              background:
                theme.direction === 'ltr'
                  ? `linear-gradient(270deg,
                    ${alpha(theme.palette.primary.main, 0.7)} 0%,
                    ${theme.palette.primary.main} 100%) !important`
                  : `linear-gradient(270deg,
                     ${theme.palette.primary.main} 100%,
                     ${alpha(theme.palette.primary.main, 0.7)} 100%) !important`,
              boxShadow: (theme as any).customShadows?.primary?.sm || theme.shadows[2],
              [`& .${menuClasses.icon}`]: {
                color: 'inherit',
              },
            }),
      },
    }),
    button: ({ level, active }: MenuItemStylesParams) => ({
      paddingBlock: '8px',
      paddingInline: '12px',
      borderRadius: theme.shape.borderRadius,
      ...(!(isCollapsed && !isHovered) && {
        '&:has(.MuiChip-root)': {
          paddingBlock: theme.spacing(1.75),
        },
      }),

      ...((!isPopoutWhenCollapsed || popoutExpanded || (popoutCollapsed && level === 0)) && {
        borderRadius: theme.shape.borderRadius,
        transition: `padding-inline-start ${transitionDuration}ms ease-in-out`,
      }),
      ...(!active && {
        '&:hover, &:focus-visible': {
          backgroundColor: theme.palette.action.hover,
        },
        '&[aria-expanded="true"]': {
          backgroundColor: theme.palette.action.selected,
        },
      }),
    }),
    icon: ({ level }: MenuItemStylesParams) => ({
      transition: `margin-inline-end ${transitionDuration}ms ease-in-out`,
      ...(level === 0 && {
        fontSize: '1.375rem',
      }),
      ...(level > 0 && {
        fontSize: '0.75rem',
        color: theme.palette.text.secondary,
      }),
      ...(level === 0 && {
        marginInlineEnd: theme.spacing(2),
      }),
      ...(level > 0 && {
        marginInlineEnd: theme.spacing(3.5),
      }),
      ...(level === 1 &&
        !popoutCollapsed && {
          marginInlineStart: theme.spacing(1.5),
        }),
      ...(level > 1 && {
        marginInlineStart: theme.spacing((popoutCollapsed ? 0 : 1.5) + 2.5 * (level - 1)),
      }),
      ...(collapsedNotHovered && {
        marginInlineEnd: 0,
      }),
      ...(popoutCollapsed &&
        level > 0 && {
          marginInlineEnd: theme.spacing(2),
        }),
      '& > i, & > svg': {
        fontSize: 'inherit',
      },
    }),
    prefix: {
      marginInlineEnd: theme.spacing(2),
    },
    label: ({ level }: MenuItemStylesParams) => ({
      ...((!isPopoutWhenCollapsed || popoutExpanded || (popoutCollapsed && level === 0)) && {
        transition: `opacity ${transitionDuration}ms ease-in-out`,
        ...(collapsedNotHovered && {
          opacity: 0,
        }),
      }),
    }),
    suffix: {
      marginInlineStart: theme.spacing(2),
    },
    subMenuExpandIcon: {
      fontSize: '1.25rem',
      marginInlineStart: theme.spacing(2),
      '& i, & svg': {
        fontSize: 'inherit',
      },
    },
    subMenuContent: ({ level }: MenuItemStylesParams) => ({
      zIndex: theme.zIndex.drawer + 1,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      ...(popoutCollapsed && {
        '& > ul, & > div > ul': {
          [`& > li:not(:last-child), & > li > .${menuClasses.button}:not(:last-child)`]: {
            marginBlockEnd: `${theme.spacing(0.5)} !important`,
          },
        },
        ...(level === 0 && {
          ...(settings.skin === 'bordered'
            ? {
                boxShadow: 'none',
                border: `1px solid ${theme.palette.divider}`,
              }
            : {
                boxShadow: (theme as any).customShadows?.sm || theme.shadows[2],
              }),
          [`& .${menuClasses.button}`]: {
            paddingInline: theme.spacing(4),
          },
          padding: theme.spacing(2),
        }),
      }),
    }),
  }
}

export default menuItemStyles
