import { styled } from '@cap/theme'

// themeConfig defaults inlined here to avoid circular import with @cap/platform-core.
// (themeConfig would be undefined at module evaluation time due to the circular dep chain)
// layoutPadding: 24, compactContentWidth: 1440 — from platform-core/src/configs/themeConfig.ts
type StyledMainProps = {
  isContentCompact: boolean;
  layoutPadding: string;
  compactContentWidth: number;
}

const StyledMain = styled('main', {
  shouldForwardProp: (prop) => !['isContentCompact', 'layoutPadding', 'compactContentWidth'].includes(prop as string),
})<StyledMainProps>(({ theme, isContentCompact, layoutPadding, compactContentWidth }: any) => ({
  flexGrow: 1,
  padding: layoutPadding,
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
  transition: theme.transitions.create(['padding', 'max-width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(isContentCompact && {
    marginInline: 'auto',
    maxInlineSize: `${compactContentWidth}px`,
  }),
}))

export default StyledMain
