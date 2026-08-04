import type { Settings } from '@cap/shared-types'
import { styled } from '@mui/material/styles'
import { KBarAnimator } from 'kbar'

type StyledKBarAnimatorProps = {
  skin: Settings['skin']
  isSmallScreen: boolean
}

const StyledKBarAnimator = styled(KBarAnimator)<StyledKBarAnimatorProps>`
  & > div {
    inline-size: 600px;
    max-inline-size: 90dvw;
    block-size: 580px;
    max-block-size: 90dvh;
    background: ${({ theme }) => theme.palette.background.paper};
    border-radius: var(--radius-md, ${({ theme }) => theme.shape.borderRadius}px);
    display: flex;
    flex-direction: column;
    overflow: hidden;

    ${({ isSmallScreen }) =>
      isSmallScreen &&
      `
      min-block-size: 100dvh;
      max-block-size: 100dvh;
      min-inline-size: 100dvw;
      max-inline-size: 100dvw;
      border-radius: 0;
    `}

    ${({ skin, theme }) =>
      skin === 'bordered'
        ? `border: 1px solid ${theme.palette.divider};`
        : `box-shadow: ${theme.customShadows.lg};`}
  }

  & #kbar-listbox {
    padding-inline: 0.5rem;

    & [id^='kbar-listbox-item'] {
      inset-inline-start: 8px !important;
      inline-size: calc(100% - 16px) !important;
    }
  }
`

export default StyledKBarAnimator
