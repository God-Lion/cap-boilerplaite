import styled from '@emotion/styled'
import type { RootStylesType } from '../types'

type StyledMenuSuffixProps = {
  $rootStyles?: RootStylesType['rootStyles']
  $firstLevel?: boolean
  $isCollapsed?: boolean
  $isHovered?: boolean
}

const StyledMenuSuffix = styled.span<StyledMenuSuffixProps>`
  display: flex;
  margin-inline-start: 8px;

  ${({ $firstLevel, $isCollapsed, $isHovered }) =>
    $firstLevel && $isCollapsed && !$isHovered && 'display: none;'};
  ${({ $rootStyles }) => $rootStyles};
`

export default StyledMenuSuffix
