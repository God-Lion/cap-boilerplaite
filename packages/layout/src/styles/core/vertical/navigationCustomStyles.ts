import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import type { VerticalNavState } from '../../../menu/contexts/verticalNavContext'
import { menuClasses, verticalNavClasses } from '../../../menu/utils/menuClasses'

const navigationCustomStyles = (verticalNavOptions: VerticalNavState, theme: Theme) => {
  const { collapsedWidth, isCollapsed, isHovered, transitionDuration } = verticalNavOptions

  const collapsedNotHovered = isCollapsed && !isHovered

  return {
    color: theme.palette.text.primary,
    zIndex: `${theme.zIndex.drawer} !important`,
    [`& .${verticalNavClasses.header}`]: {
      paddingBlock: theme.spacing(5),
      paddingInline: theme.spacing(5.5, 4),

      ...(collapsedNotHovered && {
        paddingInline: theme.spacing(((collapsedWidth as number) - 35) / 8),
        '& a': {
          transform: `translateX(-${22 - ((collapsedWidth as number) - 29) / 2}px)`,
        },
      }),
      '& a': {
        transition: `transform ${transitionDuration}ms ease`,
      },
    },
    [`& .${verticalNavClasses.container}`]: {
      transition: theme.transitions.create(['inline-size', 'inset-inline-start', 'box-shadow'], {
        duration: transitionDuration,
        easing: 'ease-in-out',
      }),
      borderColor: 'transparent',
      boxShadow: (theme as any).customShadows?.sm || theme.shadows[2],
      '[data-skin="bordered"] &': {
        boxShadow: 'none',
        borderColor: theme.palette.divider,
      },
    },
    [`& .${menuClasses.root}`]: {
      paddingBlock: theme.spacing(1),
      paddingInline: theme.spacing(3),
    },
    [`& .${verticalNavClasses.backdrop}`]: {
      backgroundColor: alpha(theme.palette.common.black, 0.5),
    },
  }
}

export default navigationCustomStyles
