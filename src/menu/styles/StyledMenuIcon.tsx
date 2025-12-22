// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { RootStylesType } from '../types'

const StyledMenuIcon = styled.span<{ $rootStyles?: RootStylesType['rootStyles'] }>`
  display: flex;
  align-items: center;
  margin-inline-end: 8px;

  ${({ $rootStyles }) => $rootStyles};
`

export default StyledMenuIcon
