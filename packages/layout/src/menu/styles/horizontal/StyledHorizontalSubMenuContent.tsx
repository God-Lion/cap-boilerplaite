import styled from '@emotion/styled'
import type { SubMenuContentProps } from '../../components/horizontal-menu/SubMenuContent'

const StyledHorizontalSubMenuContent = styled.div<SubMenuContentProps>`
  inline-size: 260px;
  border-radius: ${({ theme }: any) => `${theme?.shape?.borderRadius || 4}px`};
  box-shadow: ${({ theme }: any) => theme?.customShadows?.lg || theme?.shadows?.[4] || '0 6px 16px rgba(0, 0, 0, 0.12)'};
  outline: none;
  box-sizing: border-box;
  background-color: ${({ theme }: any) => theme?.palette?.background?.paper || '#ffffff'};
  overflow: hidden;

  ${({ browserScroll, top }) =>
    browserScroll && `overflow-y: auto; max-block-size: calc(100dvh - ${top}px);`}
  ${({ $rootStyles }) => $rootStyles};
`

export default StyledHorizontalSubMenuContent
