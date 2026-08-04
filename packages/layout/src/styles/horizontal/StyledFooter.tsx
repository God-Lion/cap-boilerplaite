import { styled } from '@cap/theme'
import type { CSSObject } from '@emotion/styled'
import { horizontalLayoutClasses } from '../../utils/layoutClasses'

// themeConfig values inlined to avoid circular import (layoutPadding:24, compactContentWidth:1440)
type StyledFooterProps = {
  overrideStyles?: CSSObject
  layoutPadding: string
  compactContentWidth: number
}

const StyledFooter = styled('footer')<StyledFooterProps>(({ theme, layoutPadding, compactContentWidth, overrideStyles }) => ({
  [`&.${horizontalLayoutClasses.footerFixed}`]: {
    position: 'sticky',
    insetBlockEnd: 0,
    zIndex: theme.zIndex.drawer - 100 || 1050,
    backgroundColor: theme.palette.background.paper,
    boxShadow: (theme as any).customShadows?.sm || theme.shadows[2],

    '[data-skin="bordered"] &': {
      boxShadow: 'none',
      borderBlockStart: `1px solid ${theme.palette.divider}`,
    },
  },

  [`&.${horizontalLayoutClasses.footerContentCompact} .${horizontalLayoutClasses.footerContentWrapper}`]: {
    marginInline: 'auto',
    maxInlineSize: `${compactContentWidth}px`,
  },

  [`& .${horizontalLayoutClasses.footerContentWrapper}`]: {
    paddingBlock: '16px',
    paddingInline: layoutPadding,
  },

  ...(overrideStyles as any),
}))

export default StyledFooter
