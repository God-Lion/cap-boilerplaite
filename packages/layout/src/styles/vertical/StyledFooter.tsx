import { styled } from '@cap/theme'
import type { CSSObject } from '@emotion/styled'
import { verticalLayoutClasses } from '../../utils/layoutClasses'

type StyledFooterProps = {
  overrideStyles?: CSSObject
  layoutPadding: string
  compactContentWidth: number
}

const StyledFooter = styled('footer')<StyledFooterProps>(({ theme, layoutPadding, compactContentWidth, overrideStyles }) => ({
  [`&.${verticalLayoutClasses.footerContentCompact}`]: {
    [`&.${verticalLayoutClasses.footerDetached}`]: {
      marginInline: 'auto',
      maxInlineSize: `${compactContentWidth}px`,
    },

    [`&.${verticalLayoutClasses.footerAttached} .${verticalLayoutClasses.footerContentWrapper}`]: {
      marginInline: 'auto',
      maxInlineSize: `${compactContentWidth}px`,
    },
  },

  [`&.${verticalLayoutClasses.footerFixed}`]: {
    position: 'sticky',
    insetBlockEnd: 0,
    zIndex: theme.zIndex.drawer - 100 || 1050,

    [`&.${verticalLayoutClasses.footerAttached}, &.${verticalLayoutClasses.footerDetached} .${verticalLayoutClasses.footerContentWrapper}`]: {
      backgroundColor: theme.palette.background.paper,
    },

    [`&.${verticalLayoutClasses.footerDetached}`]: {
      pointerEvents: 'none',
      paddingInline: layoutPadding,

      [`& .${verticalLayoutClasses.footerContentWrapper}`]: {
        pointerEvents: 'auto',
        boxShadow: (theme as any).customShadows?.sm || theme.shadows[2],
        borderStartStartRadius: `${theme.shape.borderRadius}px`,
        borderStartEndRadius: `${theme.shape.borderRadius}px`,

        '[data-skin="bordered"] &': {
          boxShadow: 'none',
          borderInline: `1px solid ${theme.palette.divider}`,
          borderBlockStart: `1px solid ${theme.palette.divider}`,
        },
      },
    },

    [`&.${verticalLayoutClasses.footerAttached}`]: {
      boxShadow: (theme as any).customShadows?.sm || theme.shadows[2],

      '[data-skin="bordered"] &': {
        boxShadow: 'none',
        borderBlockStart: `1px solid ${theme.palette.divider}`,
      },
    },
  },

  [`& .${verticalLayoutClasses.footerContentWrapper}`]: {
    paddingBlock: '16px',
    paddingInline: layoutPadding,
  },

  ...(overrideStyles as any),
}))

export default StyledFooter
