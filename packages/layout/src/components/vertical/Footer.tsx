import React from 'react'
import { useTheme } from '@mui/material/styles'
import type { ChildrenType } from '@cap/platform-core'
import { themeConfig, useSettings } from '@cap/platform-core'
import { verticalLayoutClasses } from '../../utils/layoutClasses'
import StyledFooter from '../../styles/vertical/StyledFooter'
import classnames from 'classnames'
import type { CSSObject } from '@emotion/styled'
import Box from '@mui/material/Box'
import FooterContent from './FooterContent'

const Footer: React.FC<
  Partial<ChildrenType> & {
    overrideStyles?: CSSObject
  }
> = ({ children, overrideStyles }) => {
  const theme = useTheme()
  const { settings } = useSettings()
  const { footerContentWidth } = settings

  const footerDetached = themeConfig.footer.detached === true
  const footerAttached = themeConfig.footer.detached === false
  const footerStatic = themeConfig.footer.type === 'static'
  const footerFixed = themeConfig.footer.type === 'fixed'
  const footerContentCompact = footerContentWidth === 'compact'
  const footerContentWide = footerContentWidth === 'full'

  return (
    <StyledFooter
      theme={theme}
      overrideStyles={overrideStyles}
      className={classnames(
        verticalLayoutClasses.footer,
        // 'is-full',
        {
          [verticalLayoutClasses.footerDetached]: footerDetached,
          [verticalLayoutClasses.footerAttached]: footerAttached,
          [verticalLayoutClasses.footerStatic]: footerStatic,
          [verticalLayoutClasses.footerFixed]: footerFixed,
          [verticalLayoutClasses.footerContentCompact]: footerContentCompact,
          [verticalLayoutClasses.footerContentWide]: footerContentWide,
        },
      )}
      style={{
        inlineSize: '100%',
      }}
    >
      <Box className={verticalLayoutClasses.footerContentWrapper}>
        {children || <FooterContent />}
      </Box>
    </StyledFooter>
  )
}

export default Footer
