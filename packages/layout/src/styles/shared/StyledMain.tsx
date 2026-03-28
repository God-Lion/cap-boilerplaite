import { styled } from '@cap/theme'

// themeConfig defaults inlined here to avoid circular import with @cap/platform-core.
// (themeConfig would be undefined at module evaluation time due to the circular dep chain)
// layoutPadding: 24, compactContentWidth: 1440 — from platform-core/src/configs/themeConfig.ts
type StyledMainProps = {
  isContentCompact: boolean;
  layoutPadding: string;
  compactContentWidth: number;
}

const StyledMain = styled('main')<StyledMainProps>(({ isContentCompact, layoutPadding, compactContentWidth }) => ({
  padding: layoutPadding,
  ...(isContentCompact && {
    marginInline: 'auto',
    maxInlineSize: `${compactContentWidth}px`,
  }),
}))

export default StyledMain
