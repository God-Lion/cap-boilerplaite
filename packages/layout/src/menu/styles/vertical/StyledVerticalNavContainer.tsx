import { styled } from '@cap/theme'
import type { VerticalNavProps } from '../../components/vertical-menu/VerticalNav'
import { verticalNavClasses } from '../../utils/menuClasses'

type StyledVerticalNavContainerProps = Pick<VerticalNavProps, 'width' | 'transitionDuration'>

const StyledVerticalNavContainer = styled('div')<StyledVerticalNavContainerProps>`
  position: relative;
  block-size: 100%;
  inline-size: 100%;
  border-inline-end: 1px solid var(--mui-palette-divider);
  .${verticalNavClasses.hovered} &,
  .${verticalNavClasses.expanding} & {
    inline-size: ${({ width }: StyledVerticalNavContainerProps) => `${width}px`};
    min-inline-size: ${({ width }: StyledVerticalNavContainerProps) => `${width}px`};
  }

  /* Transition */
  transition-property: inline-size, min-inline-size;
  transition-duration: ${({ transitionDuration }: StyledVerticalNavContainerProps) => `${transitionDuration}ms`};
  transition-timing-function: ease-in-out;
`

export default StyledVerticalNavContainer
