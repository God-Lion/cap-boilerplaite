import { useTheme } from '@mui/material/styles'
import type { ChildrenType } from '@cap/platform-core'
import { themeConfig, useSettings } from '@cap/platform-core'
import { horizontalLayoutClasses } from '../../utils/layoutClasses'
import StyledFooter from '../../styles/horizontal/StyledFooter'
import classnames from 'classnames'

import type { CSSObject } from '@emotion/styled'
type Props = ChildrenType & {
  overrideStyles?: CSSObject
}

const Footer = (props: Props) => {
  const theme = useTheme()
  const { children, overrideStyles } = props
  const { settings } = useSettings()
  const { footerContentWidth } = settings
  const footerStatic = themeConfig.footer.type === 'static'
  const footerFixed = themeConfig.footer.type === 'fixed'
  const footerContentCompact = footerContentWidth === 'compact'
  const footerContentWide = footerContentWidth === 'full'

  return (
    <StyledFooter
      theme={theme}
      overrideStyles={overrideStyles}
      className={classnames(horizontalLayoutClasses.footer, {
        [horizontalLayoutClasses.footerStatic]: footerStatic,
        [horizontalLayoutClasses.footerFixed]: footerFixed,
        [horizontalLayoutClasses.footerContentCompact]: footerContentCompact,
        [horizontalLayoutClasses.footerContentWide]: footerContentWide,
      })}
    >
      <div className={horizontalLayoutClasses.footerContentWrapper}>
        {children}
      </div>
    </StyledFooter>
  )
}

export default Footer
