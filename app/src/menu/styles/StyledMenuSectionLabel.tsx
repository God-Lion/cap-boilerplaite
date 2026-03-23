// Third-party Imports
import styled from '@emotion/styled'

// Type Imports
import type { RootStylesType } from '../types'

type StyledMenuSectionLabelProps = {
  $rootStyles?: RootStylesType['rootStyles']
  $isCollapsed?: boolean
  $isHovered?: boolean
  $textTruncate?: boolean
}

const StyledMenuSectionLabel = styled.span<StyledMenuSectionLabelProps>`
  flex-grow: 1;
  ${({ $textTruncate }) =>
    $textTruncate &&
    `
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `};
  ${({ $isCollapsed }) => $isCollapsed && 'display: none;'};
  ${({ $rootStyles }) => $rootStyles};
`

export default StyledMenuSectionLabel
