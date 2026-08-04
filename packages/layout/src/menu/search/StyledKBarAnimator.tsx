import type { Settings } from '@cap/shared-types'
import { styled } from '@mui/material/styles'
import { KBarAnimator } from 'kbar'
import { SurfaceEffectFactory } from '../../utils/buildLayoutSurfaceEffect'

type StyledKBarAnimatorProps = {
  skin: Settings['skin']
  isSmallScreen: boolean
}

const StyledKBarAnimator = styled(KBarAnimator)<StyledKBarAnimatorProps>(({ theme, skin, isSmallScreen }: any) => {
  const surfaceEffect = SurfaceEffectFactory.create(theme.effects || theme.effectConfig || { globalType: 'glass' }, theme)

  return {
    '& > div': {
      inlineSize: '600px',
      maxInlineSize: '90dvw',
      blockSize: '580px',
      maxBlockSize: '90dvh',
      borderRadius: `${theme.shape.borderRadius * 2}px`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      ...surfaceEffect,

      ...(isSmallScreen && {
        minBlockSize: '100dvh',
        maxBlockSize: '100dvh',
        minInlineSize: '100dvw',
        maxInlineSize: '100dvw',
        borderRadius: 0,
      }),

      ...(skin === 'bordered' && {
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
      }),
    },

    '& #kbar-listbox': {
      paddingInline: '0.5rem',

      '& [id^="kbar-listbox-item"]': {
        insetInlineStart: '8px !important',
        inlineSize: 'calc(100% - 16px) !important',
      },
    },
  }
})

export default StyledKBarAnimator
