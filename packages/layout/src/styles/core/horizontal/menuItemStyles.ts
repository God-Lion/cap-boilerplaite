import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import type { MenuItemStyles, MenuItemStylesParams } from '../../../menu/types'
import type { Settings } from '@cap/platform-core'
import { menuClasses } from '../../../menu/utils/menuClasses'

const menuItemStyles = (settings: Settings, theme: Theme): MenuItemStyles => ({
  root: ({ level }: MenuItemStylesParams) => ({
    ...(level === 0 && {
      borderRadius: 6,
    }),
    [`&.${menuClasses.open} > .${menuClasses.button}`]: {
      backgroundColor: `${theme.palette.action.selected} !important`,
    },
    ...(level === 0
      ? {
          [`& .${menuClasses.button}.${menuClasses.active}`]: {
            color: `${theme.palette.primary.contrastText} !important`,
            background:
              theme.direction === 'ltr'
                ? `linear-gradient(270deg,
                  ${alpha(theme.palette.primary.main, 0.7)} 0%,
                  ${theme.palette.primary.main} 100%) !important`
                : `linear-gradient(270deg,
                  ${theme.palette.primary.main} 100%,
                  ${alpha(theme.palette.primary.main, 0.7)} 100%) !important`,
          },
        }
      : {
          [`&:not([aria-expanded]) > .${menuClasses.button}.${menuClasses.active}`]: {
            backgroundColor: alpha(theme.palette.primary.main, 0.16),
            color: theme.palette.primary.main,
          },
          [`&[aria-expanded] > .${menuClasses.button}.${menuClasses.active}`]: {
            backgroundColor: `${theme.palette.action.selected} !important`,
          },
        }),
    [`&.${menuClasses.disabled} > .${menuClasses.button}`]: {
      color: theme.palette.text.disabled,
      '& *': {
        color: 'inherit',
      },
    },
  }),
  button: {
    borderRadius: theme.shape.borderRadius,
    paddingInline: theme.spacing(4),
    '&:not(:has(.MuiChip-root))': {
      paddingBlock: theme.spacing(2),
    },
    '&:has(.MuiChip-root)': {
      paddingBlock: theme.spacing(1.75),
    },
    [`&:not(.${menuClasses.active}):hover, &:not(.${menuClasses.active}):focus-visible, &:not(.${menuClasses.active})[aria-expanded="true"]`]:
      {
        backgroundColor: theme.palette.action.hover,
      },
  },
  icon: ({ level }: MenuItemStylesParams) => ({
    marginInlineEnd: theme.spacing(2),
    ...(level < 2
      ? { fontSize: '1.375rem' }
      : { fontSize: '0.75rem', color: theme.palette.text.secondary }),
    '& > i, & > svg': {
      fontSize: 'inherit',
    },
    '& .tabler-circle': {
      fontSize: '0.75rem',
      color: theme.palette.text.secondary,
      [`.${menuClasses.active} &`]: {
        color: theme.palette.primary.main,
      },
    },
  }),
  prefix: {
    marginInlineEnd: theme.spacing(2),
  },
  suffix: {
    marginInlineStart: theme.spacing(2),
  },
  subMenuStyles: {
    zIndex: theme.zIndex.appBar + 1,
  },
  subMenuExpandIcon: {
    fontSize: '1.25rem',
    marginInlineStart: theme.spacing(2),
    '& i, & svg': {
      fontSize: 'inherit',
    },
  },
  subMenuContent: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.background.paper,
    ...(settings.skin === 'bordered'
      ? {
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
        }
      : {
          boxShadow: (theme as any).customShadows?.lg || theme.shadows[8],
        }),
    '& > ul, & > div > ul': {
      padding: theme.spacing(2),
      '& > li:not(:last-child)': {
        marginBlockEnd: theme.spacing(0.5),
      },
    },
  },
})

export default menuItemStyles
