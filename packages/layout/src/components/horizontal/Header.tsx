import { useTheme } from '@mui/material/styles'
import type { CSSObject } from '@emotion/styled'
import type { ChildrenType } from '@cap/platform-core'
import { themeConfig, useSettings } from '@cap/platform-core'
import { horizontalLayoutClasses } from '../../utils/layoutClasses'
import StyledHeader from '../../styles/horizontal/StyledHeader'
import classnames from 'classnames'
import Navbar from './Navbar'
import { useHorizontalNav } from '../../menu/contexts/horizontalNavContext'

type Props = ChildrenType & {
  overrideStyles?: CSSObject
}

const LayoutHeader = (props: Props) => {
  // Props
  const { children, overrideStyles } = props

  // Hooks
  const { settings } = useSettings()
  const theme = useTheme()

  // Vars
  const { navbarContentWidth } = settings

  const headerFixed = themeConfig.navbar.type === 'fixed'
  const headerStatic = themeConfig.navbar.type === 'static'
  const headerBlur = themeConfig.navbar.blur === true
  const headerContentCompact = navbarContentWidth === 'compact'
  const headerContentWide = navbarContentWidth === 'wide' || navbarContentWidth === 'full'

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
// type Props = Partial<ChildrenType> & {
//   overrideStyles?: CSSObject
// }

// const Header: React.FC<Props> = ({
//   dictionary,
// }: {
//   dictionary: Awaited<ReturnType<typeof getDictionary>>
// }) => {
//   const theme = useTheme()
//   const { settings } = useSettings()
//   const { navbarContentWidth } = settings
//   const { isBreakpointReached } = useHorizontalNav()

//   const headerFixed = themeConfig.navbar.type === 'fixed'
//   const headerStatic = themeConfig.navbar.type === 'static'
//   const headerBlur = themeConfig.navbar.blur === true
//   const headerContentCompact = navbarContentWidth === 'compact'
//   const headerContentWide = navbarContentWidth === 'full'

//   return (
//     <StyledHeader
//       theme={theme}
//       overrideStyles={overrideStyles}
//       className={classnames(horizontalLayoutClasses.header, {
//         [horizontalLayoutClasses.headerFixed]: headerFixed,
//         [horizontalLayoutClasses.headerStatic]: headerStatic,
//         [horizontalLayoutClasses.headerBlur]: headerBlur,
//         [horizontalLayoutClasses.headerContentCompact]: headerContentCompact,
//         [horizontalLayoutClasses.headerContentWide]: headerContentWide,
//       })}
//     >
//       {children || (
//         <>
//           <Navbar>
//             <NavbarContent />
//           </Navbar>
//           {!isBreakpointReached && <Navigation dictionary={dictionary} />}
//         </>
//       )}
//       {children ? null : isBreakpointReached && <Navigation dictionary={dictionary} />}
//     </StyledHeader>
//   )
// }

const Header = ({ navigation, navbarContent }: { navigation?: React.ReactNode; navbarContent?: React.ReactNode }) => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav()

  return (
    <>
      <LayoutHeader>
        <Navbar>
          {navbarContent}
        </Navbar>
        {!isBreakpointReached && navigation}
      </LayoutHeader>
      {isBreakpointReached && navigation}
    </>
  )
}

export default Header
