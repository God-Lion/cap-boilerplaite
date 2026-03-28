import type { EffectConfig } from '@cap/theme'
import type { CSSObject } from '@emotion/styled'

/**
 * Generates CSS override objects for glassmorphism / neumorphism effects on
 * layout surfaces (navbar, footer, drawer).  
 * Pass the result as the `overrideStyles` prop on any StyledHeader/StyledFooter.
 */
export const buildLayoutSurfaceEffect = (config: EffectConfig): CSSObject => {
  if (config.globalType === 'glass') {
    return {
      backdropFilter: 'var(--glass-backdrop, blur(16px))',
      background: 'var(--glass-bg)',
      borderColor: 'var(--glass-border)',
      borderStyle: 'solid',
      borderWidth: 'var(--glass-border-width, 1px)',
    }
  }

  if (config.globalType === 'neu') {
    return {
      background: 'var(--neu-bg)',
      boxShadow: 'var(--neu-shadow)',
      borderRadius: 'var(--neu-radius)',
    }
  }

  if (config.globalType === 'brutalism') {
    return {
      background: 'var(--brutal-bg)',
      border: 'var(--brutal-border)',
      boxShadow: 'var(--brutal-shadow)',
    }
  }

  if (config.globalType === 'bento') {
    return {
      background: 'var(--bento-bg)',
      borderRadius: 'var(--bento-radius)',
      border: 'var(--bento-border)',
      boxShadow: 'var(--bento-shadow)',
    }
  }

  if (config.globalType === 'organic') {
    return {
      background: 'var(--organic-bg)',
      borderRadius: 'var(--effect-radius, 80px)',
      border: 'var(--organic-border-width) solid var(--organic-border-color)',
    }
  }

  if (config.globalType === 'immersive') {
    return {
      background: 'var(--mui-palette-background-paper)',
      perspective: 'var(--immersive-perspective)',
      boxShadow: 'var(--effect-shadow)',
      transform: 'rotateX(var(--immersive-rotate-x))',
    }
  }

  // standard — no structural override needed
  return {}
}
