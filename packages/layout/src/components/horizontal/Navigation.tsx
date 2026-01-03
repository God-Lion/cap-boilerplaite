import styled from '@emotion/styled'
import classnames from 'classnames'
import { themeConfig, useSettings } from '@cap/platform-core'
import { useHorizontalNav } from '../../menu/contexts/horizontalNavContext'
import { horizontalLayoutClasses } from '../../utils/layoutClasses'

type StyledDivProps = {
  isContentCompact: boolean
  isBreakpointReached?: boolean
}

const StyledDiv = styled.div<StyledDivProps>`
  ${({ isContentCompact, isBreakpointReached }) =>
    !isBreakpointReached &&
    `
    padding: ${themeConfig.layoutPadding}px;

    ${
      isContentCompact &&
      `
      margin-inline: auto;
      max-inline-size: ${themeConfig.compactContentWidth}px;
    `
    }
  `}
`

const Navigation = ({ menu }: { menu: React.ReactNode }) => {
  const { isBreakpointReached } = useHorizontalNav()
  const { settings } = useSettings()
  const headerContentCompact = settings.navbarContentWidth === 'compact'

  return (
    <div
      {...(!isBreakpointReached && {
        className: classnames(horizontalLayoutClasses.navigation, 'relative flex border-bs'),
      })}
    >
      <StyledDiv
        isContentCompact={headerContentCompact}
        isBreakpointReached={isBreakpointReached}
        {...(!isBreakpointReached && {
          className: classnames(
            horizontalLayoutClasses.navigationContentWrapper,
            'flex items-center is-full plb-2',
          ),
        })}
      >
        {menu}
      </StyledDiv>
    </div>
  )
}

export default Navigation
