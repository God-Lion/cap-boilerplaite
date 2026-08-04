import styled from '@emotion/styled'
import { alpha } from '@mui/material/styles'
// themeConfig values inlined to avoid circular import (layoutPadding:24, compactContentWidth:1440)
import { verticalLayoutClasses } from '../../utils/layoutClasses'
import type { Theme } from '@mui/material/styles'
import type { CSSObject } from '@emotion/styled'

type StyledHeaderProps = {
  theme: Theme
  overrideStyles?: CSSObject
  layoutPadding: string
  compactContentWidth: number
}

const StyledHeader = styled.header<StyledHeaderProps>`
  min-block-size: 64px;

  &.${verticalLayoutClasses.headerContentCompact} {
    &.${verticalLayoutClasses.headerFloating}
      .${verticalLayoutClasses.navbar},
      &.${verticalLayoutClasses.headerDetached}
      .${verticalLayoutClasses.navbar},
      &.${verticalLayoutClasses.headerAttached}
      .${verticalLayoutClasses.navbar} {
      margin-inline: auto;
    }

    &.${verticalLayoutClasses.headerFloating}
      .${verticalLayoutClasses.navbar},
      &.${verticalLayoutClasses.headerFixed}.${verticalLayoutClasses.headerDetached}
      .${verticalLayoutClasses.navbar} {
      max-inline-size: calc(
        ${({ compactContentWidth }) => compactContentWidth}px - ${({ layoutPadding }) => `calc(${layoutPadding} * 2)`}
      );
    }

    .${verticalLayoutClasses.navbar} {
      max-inline-size: ${({ compactContentWidth }) => compactContentWidth}px;
    }

    .${verticalLayoutClasses.navbar} {
      max-inline-size: ${({ compactContentWidth }) => compactContentWidth}px;
    }
  }

  &.${verticalLayoutClasses.headerFixed} {
    position: sticky;
    inset-block-start: 0;
    z-index: ${({ theme }) => theme.zIndex.appBar};

    &:not(.${verticalLayoutClasses.headerBlur}).scrolled.${verticalLayoutClasses.headerAttached},
      &:not(.${verticalLayoutClasses.headerBlur}).scrolled.${verticalLayoutClasses.headerDetached}
      .${verticalLayoutClasses.navbar} {
      background-color: ${({ theme }) => theme.palette.background.paper};
    }

    &.${verticalLayoutClasses.headerDetached} .${verticalLayoutClasses.navbar} {
      box-shadow: ${({ theme }) => (theme as any).customShadows?.sm || theme.shadows[1]};

      [data-skin='bordered'] & {
        box-shadow: none;
        border-inline: 1px solid ${({ theme }) => theme.palette.divider};
        border-block-end: 1px solid ${({ theme }) => theme.palette.divider};
      }
    }
    &.${verticalLayoutClasses.headerDetached} .${verticalLayoutClasses.navbar} {
      border-end-start-radius: ${({ theme }) => `${theme.shape.borderRadius}px`};
      border-end-end-radius: ${({ theme }) => `${theme.shape.borderRadius}px`};
    }

    &.${verticalLayoutClasses.headerDetached}, &.${verticalLayoutClasses.headerFloating} {
      pointer-events: none;

      & .${verticalLayoutClasses.navbar} {
        pointer-events: auto;
      }
    }

    &.${verticalLayoutClasses.headerBlur} {
      &.${verticalLayoutClasses.headerAttached},
        &.${verticalLayoutClasses.headerDetached}
        .${verticalLayoutClasses.navbar},
        &.${verticalLayoutClasses.headerFloating}
        .${verticalLayoutClasses.navbar} {
        backdrop-filter: blur(6px);
        background-color: ${({ theme }) => alpha(theme.palette.background.paper, 0.88)};
      }

      &.${verticalLayoutClasses.headerFloating} {
        &:before {
          content: '';
          position: absolute;
          z-index: -1;
          inset-block-start: 0;
          inset-inline: 0;
          block-size: 100%;
          background: ${({ theme }) => `linear-gradient(
            180deg,
            ${alpha(theme.palette.background.default, 0.7)} 44%,
            ${alpha(theme.palette.background.default, 0.43)} 73%,
            ${alpha(theme.palette.background.default, 0)}
          )`};
          backdrop-filter: blur(10px);
          mask: ${({ theme }) => `linear-gradient(
            ${theme.palette.background.default},
            ${theme.palette.background.default} 18%,
            transparent 100%
          )`};
        }
      }
    }

    &.${verticalLayoutClasses.headerAttached}.scrolled {
      box-shadow: ${({ theme }) => (theme as any).customShadows?.sm || theme.shadows[1]};

      [data-skin='bordered'] & {
        box-shadow: none;
        border-block-end: 1px solid ${({ theme }) => theme.palette.divider};
      }
    }

    &.${verticalLayoutClasses.headerFloating}
      .${verticalLayoutClasses.navbar},
      &:not(.${verticalLayoutClasses.headerFloating}).${verticalLayoutClasses.headerAttached},
      &:not(.${verticalLayoutClasses.headerFloating}).${verticalLayoutClasses.headerDetached}
      .${verticalLayoutClasses.navbar} {
      ${({ theme }) =>
        `transition: ${theme.transitions.create([
          'box-shadow',
          'border-width',
          'padding-inline',
          'backdrop-filter',
        ])}`};
    }
    &:not(.${verticalLayoutClasses.headerFloating}).${verticalLayoutClasses.headerAttached}
      .${verticalLayoutClasses.navbar},
      &:not(
        .${verticalLayoutClasses.headerFloating}
      ).${verticalLayoutClasses.headerDetached}.scrolled
      .${verticalLayoutClasses.navbar} {
      padding-inline: 16px;
    }
  }

  &.${verticalLayoutClasses.headerFloating} {
    padding-block-start: 16px;

    .${verticalLayoutClasses.navbar} {
      background-color: ${({ theme }) => theme.palette.background.paper};
      border-radius: ${({ theme }) => `${theme.shape.borderRadius}px`};
      padding-inline: 16px;
      box-shadow: ${({ theme }) => (theme as any).customShadows?.sm || theme.shadows[1]};

      [data-skin='bordered'] & {
        box-shadow: none;
        border: 1px solid ${({ theme }) => theme.palette.divider};
      }
    }
  }

  &.${verticalLayoutClasses.headerFloating}
    .${verticalLayoutClasses.navbar},
    &.${verticalLayoutClasses.headerFixed}.${verticalLayoutClasses.headerDetached}
    .${verticalLayoutClasses.navbar} {
    inline-size: calc(100% - ${({ layoutPadding }) => `calc(${layoutPadding} * 2)`});
  }

  &:not(.${verticalLayoutClasses.headerFloating}).${verticalLayoutClasses.headerStatic}
    .${verticalLayoutClasses.navbar} {
    padding-inline: 16px;
  }

  .${verticalLayoutClasses.navbar} {
    position: relative;
    padding-block: 8px;
    padding-inline: 16px;
    inline-size: 100%;
  }

  ${({ overrideStyles }) => overrideStyles}
`

export default StyledHeader
