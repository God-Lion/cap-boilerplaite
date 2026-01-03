import styled from '@emotion/styled'
import type { RootStylesType } from '../types'

type StyledMenuPrefixProps = {
  $rootStyles?: RootStylesType['rootStyles']
  $firstLevel?: boolean
  $isCollapsed?: boolean
  $isHovered?: boolean
}

const StyledMenuPrefix = styled.span<StyledMenuPrefixProps>`
  display: flex;
  margin-inline-end: 8px;

  ${({ $firstLevel, $isCollapsed, $isHovered }) =>
    $firstLevel && $isCollapsed && !$isHovered && 'display: none;'};
  ${({ $rootStyles }) => $rootStyles};
`

export default StyledMenuPrefix
