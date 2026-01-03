// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { RootStylesType } from '../../types'

const StyledHorizontalSubMenuContentWrapper = styled.div<{
  $rootStyles?: RootStylesType['rootStyles']
}>`
  z-index: 10;

  ${({ $rootStyles }) => $rootStyles};
`

export default StyledHorizontalSubMenuContentWrapper
