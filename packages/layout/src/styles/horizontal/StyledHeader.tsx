import { styled } from '@cap/theme'
import { alpha } from '@mui/material/styles'
import type { CSSObject } from '@emotion/styled'
import { horizontalLayoutClasses } from '../../utils/layoutClasses'
import { SurfaceEffectFactory } from '../../utils/buildLayoutSurfaceEffect'

// themeConfig values inlined to avoid circular import (layoutPadding:24, compactContentWidth:1440)
type StyledHeaderProps = {
  overrideStyles?: CSSObject
  layoutPadding: string
  compactContentWidth: number
}

const StyledHeader = styled('header')<StyledHeaderProps>(({ theme, layoutPadding, compactContentWidth, overrideStyles }) => {
  const surfaceEffect = SurfaceEffectFactory.create((theme as any).effects || (theme as any).effectConfig || { globalType: 'glass' }, theme)

  return {
    boxShadow: (theme as any).customShadows?.sm || theme.shadows[1],
    ...surfaceEffect,
    
    '[data-skin="bordered"] &': {
      boxShadow: 'none',
      borderBlockEnd: `1px solid ${theme.palette.divider}`,
    },

    [`&:not(.${horizontalLayoutClasses.headerBlur})`]: {
      backgroundColor: theme.palette.background.paper,
    },

    [`&.${horizontalLayoutClasses.headerBlur}`]: {
      backdropFilter: 'blur(6px)',
      backgroundColor: alpha(theme.palette.background.paper, 0.88),
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
  }
})

export default StyledHeader

