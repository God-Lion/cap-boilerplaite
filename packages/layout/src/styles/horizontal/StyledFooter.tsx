import type { Theme } from '@mui/material/styles'
import styled from '@emotion/styled'
import type { CSSObject } from '@emotion/styled'
import { horizontalLayoutClasses } from '../../utils/layoutClasses'
// themeConfig values inlined to avoid circular import (layoutPadding:24, compactContentWidth:1440)
type StyledFooterProps = {
  theme: Theme
  overrideStyles?: CSSObject
  layoutPadding: string
  compactContentWidth: number
}

const StyledFooter = styled.footer<StyledFooterProps>`
  &.${horizontalLayoutClasses.footerFixed} {
    position: sticky;
    inset-block-end: 0;
    z-index: var(--footer-z-index);
    background-color: var(--mui-palette-background-paper);
    ${({ theme }) => `
    box-shadow: 0 3px 12px 0px rgb(var(--mui-mainColorChannels-${theme.palette.mode}Shadow) / 0.14);
        `}

    [data-skin='bordered'] & {
      box-shadow: none;
      border-block-start: 1px solid var(--border-color);
    }
  }

  &.${horizontalLayoutClasses.footerContentCompact}
    .${horizontalLayoutClasses.footerContentWrapper} {
    margin-inline: auto;
    max-inline-size: ${({ compactContentWidth }) => compactContentWidth}px;
  }

  .${horizontalLayoutClasses.footerContentWrapper} {
    padding-block: 16px;
    padding-inline: ${({ layoutPadding }) => layoutPadding};
  }

  ${({ overrideStyles }) => overrideStyles}
`

export default StyledFooter
