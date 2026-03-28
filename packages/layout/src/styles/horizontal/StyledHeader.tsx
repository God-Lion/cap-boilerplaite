import { styled } from '@cap/theme'
import type { CSSObject } from '@emotion/styled'
import { horizontalLayoutClasses } from '../../utils/layoutClasses'

// themeConfig values inlined to avoid circular import (layoutPadding:24, compactContentWidth:1440)
type StyledHeaderProps = {
  overrideStyles?: CSSObject
  layoutPadding: string
  compactContentWidth: number
}

const StyledHeader = styled('header')<StyledHeaderProps>(({ theme, layoutPadding, compactContentWidth, overrideStyles }) => ({
  boxShadow: (theme as any).customShadows?.sm || theme.shadows[1],
  
  '[data-skin="bordered"] &': {
    boxShadow: 'none',
    borderBlockEnd: `1px solid ${theme.palette.divider}`,
  },

  [`&:not(.${horizontalLayoutClasses.headerBlur})`]: {
    backgroundColor: theme.palette.background.paper,
  },

  [`&.${horizontalLayoutClasses.headerBlur}`]: {
    backdropFilter: 'blur(6px)',
    backgroundColor: `rgba(${theme.palette.background.paperChannel || '255, 255, 255'}, 0.88)`,
  },

  [`&.${horizontalLayoutClasses.headerFixed}`]: {
    position: 'sticky',
    insetBlockStart: 0,
    zIndex: theme.zIndex.appBar,
  },

  [`&.${horizontalLayoutClasses.headerContentCompact} .${horizontalLayoutClasses.navbar}`]: {
    marginInline: 'auto',
    maxInlineSize: `${compactContentWidth}px`,
  },

  [`& .${horizontalLayoutClasses.navbar}`]: {
    position: 'relative',
    minBlockSize: '64px', // Standard height or from theme
    paddingBlock: '8px',
    paddingInline: layoutPadding,
  },

  ...(overrideStyles as any),
}))

export default StyledHeader
