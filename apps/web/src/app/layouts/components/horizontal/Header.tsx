import React from 'react'
import { useTheme } from '@mui/material/styles'
import type { CSSObject } from '@emotion/styled'
import type { ChildrenType } from '@cap/platform-core'
import { themeConfig, useSettings } from '@cap/platform-core'
import { horizontalLayoutClasses } from '../../utils/layoutClasses'
import StyledHeader from '../../styles/horizontal/StyledHeader'
import classnames from 'classnames'

type Props = ChildrenType & {
  overrideStyles?: CSSObject
}

const Header: React.FC<Props> = ({ children, overrideStyles }) => {
  const theme = useTheme()
  const { settings } = useSettings()
  const { navbarContentWidth } = settings

  const headerFixed = themeConfig.navbar.type === 'fixed'
  const headerStatic = themeConfig.navbar.type === 'static'
  const headerBlur = themeConfig.navbar.blur === true
  const headerContentCompact = navbarContentWidth === 'compact'
  const headerContentWide = navbarContentWidth === 'full'

  return (
    <StyledHeader
      theme={theme}
      overrideStyles={overrideStyles}
      className={classnames(horizontalLayoutClasses.header, {
        [horizontalLayoutClasses.headerFixed]: headerFixed,
        [horizontalLayoutClasses.headerStatic]: headerStatic,
        [horizontalLayoutClasses.headerBlur]: headerBlur,
        [horizontalLayoutClasses.headerContentCompact]: headerContentCompact,
        [horizontalLayoutClasses.headerContentWide]: headerContentWide,
      })}
    >
      {children}
    </StyledHeader>
  )
}

export default Header
