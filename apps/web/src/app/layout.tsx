// cspell:ignore Customizer Navbars tabler
import React from 'react'
import type { ChildrenType } from '@cap/platform-core'
import {
  LayoutWrapper,
  PublicLayout,
  VerticalLayout,
  HorizontalLayout,
  VerticalNavigation,
  HorizontalNavigation,
  Header,
  VerticalFooter,
  HorizontalFooter,
  Footer as PublicFooter,
} from '@cap/layout'
// import Customizer from 'src/core/components/customizer'
import ScrollToTop from '../core/components/scroll-to-top'
import Button from '@mui/material/Button'
import { ArrowUpward } from '@mui/icons-material'
import PublicNavbar from './Menu/Navbars/Navbar'
import GuestNavbar from './Menu/Navbars/GuestNavbar'
import { useAppStore, Locale, getMode, getSystemMode, type AppStore } from '@cap/platform-core'
import { useTranslation } from 'react-i18next'
import { useLang, getDictionary } from './utils/getDictionary'
import VerticalMenu from './Menu/vertical/VerticalMenu'
import HorizontalMenu from './Menu/HorizontalMenu'
import Navbar from './Menu/vertical/Navbar'

const NavbarWrapper = React.memo(function NavbarWrapper() {
  const isAuthenticated = useAppStore((state: AppStore) => state.isAuthenticated)

  return isAuthenticated ? <PublicNavbar /> : <GuestNavbar />
})

const Layout: React.FC<ChildrenType> = ({ children }) => {
  const { i18n: i18nInstance } = useTranslation()
  const dictionary = useLang(i18nInstance.language as Locale) as Awaited<
    ReturnType<typeof getDictionary>
  >
  const mode = getMode()
  const systemMode = getSystemMode()

  return (
    <React.Fragment>
      <LayoutWrapper
        systemMode={systemMode}
        publicLayout={
          <PublicLayout header={<NavbarWrapper />} footer={<PublicFooter />}>
            {children}
          </PublicLayout>
        }
        verticalLayout={
          <VerticalLayout
            navigation={
              <VerticalNavigation mode={mode} systemMode={systemMode}>
                {(scrollMenu) => <VerticalMenu dictionary={dictionary} scrollMenu={scrollMenu} />}
              </VerticalNavigation>
            }
            navbar={<Navbar />}
            footer={<VerticalFooter />}
          >
            {children}
          </VerticalLayout>
        }
        horizontalLayout={
          <HorizontalLayout
            header={
              <Header
                navigation={
                  <HorizontalNavigation menu={<HorizontalMenu dictionary={dictionary} />} />
                }
              />
            }
            footer={<HorizontalFooter />}
          >
            {children}
          </HorizontalLayout>
        }
        noLayout={<React.Fragment>{children}</React.Fragment>}
      />
      <ScrollToTop className='mui-fixed'>
        <Button
          variant='contained'
          sx={{
            minInlineSize: '2.5rem',
            blockSize: '2.5rem',
            // borderRadius: '100%',
            borderRadius: '9999px',
            padding: '0px',
            // minInlineSize: 'opx',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // inlineSize: '2.5rem', // Equivalent to .is-10
            // Equivalent to .items-center
          }}
        >
          <ArrowUpward />
        </Button>
      </ScrollToTop>
      {/* <Customizer dir={direction} /> */}
    </React.Fragment>
  )
}

export default Layout
