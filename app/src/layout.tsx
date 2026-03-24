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
// import { Avatar as CustomAvatar } from '@cap/theme'
// import Customizer from 'src/core/components/customizer'
import Button from '@mui/material/Button'
import ArrowUpward from '@mui/icons-material/ArrowUpward'
import { 
  VerticalNavbar as Navbar, 
  HorizontalNavbarContent,
  ScrollToTop 
} from '@cap/theme'
import {
  PublicNavbar,
  GuestNavbar,
  VerticalMenu,
  AdminMenu,
  HorizontalMenu
} from './menu'
import { useAppStore, Locale, getMode, getSystemMode, type AppStore, useAuth } from '@cap/platform-core'
import { useTranslation } from 'react-i18next'
import { useLang, getDictionary } from './utils/getDictionary'

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

  // Reactive admin state directly from the store
  const { isAdmin } = useAuth()

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
              <VerticalNavigation key={isAdmin ? 'admin' : 'vertical'} mode={mode} systemMode={systemMode}>
                {(scrollMenu: any) =>
                  isAdmin
                    ? <AdminMenu dictionary={dictionary} scrollMenu={scrollMenu} />
                    : <VerticalMenu dictionary={dictionary} scrollMenu={scrollMenu} />
                }
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
                navbarContent={<HorizontalNavbarContent />}
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
            borderRadius: '9999px',
            padding: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
