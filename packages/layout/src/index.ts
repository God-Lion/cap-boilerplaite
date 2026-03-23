export { default as VerticalLayout } from './VerticalLayout'
export { default as HorizontalLayout } from './HorizontalLayout'
export { default as PublicLayout } from './PublicLayout'
export { default as BlankLayout } from './BlankLayout'
export { default as LayoutWrapper } from './LayoutWrapper'

// Components
export { default as VerticalNavigation } from './components/vertical/Navigation'
export { default as HorizontalNavigation } from './components/horizontal/Navigation'
export { default as Navigation } from './components/vertical/Navigation'
// export { default as Navbar } from './components/vertical/Navbar'
export { default as VerticalNavToggle } from './components/vertical/NavToggle'
export { default as HorizontalNavToggle } from './components/horizontal/NavToggle'
export { default as VerticalFooter } from './components/vertical/Footer'
export { default as Header } from './components/horizontal/Header'
export { default as HorizontalFooter } from './components/horizontal/Footer'
export { default as Footer } from './Footer'
// export { default as PublicNavbar } from './Navbars/Navbar'
// export { default as GuestNavbar } from './Navbars/GuestNavbar'

// Context Types
export type {
  VerticalMenuContextProps,
  OpenSubmenu,
  MenuSectionStyles,
} from './menu/components/vertical-menu/Menu'

// Re-export utils
export * from './utils/layoutClasses'

// Types
export * from './types'

// Menu Components
export { default as VerticalNav } from './menu/vertical-menu'
export { default as HorizontalNav } from './menu/horizontal-menu'
export {
  Menu,
  MenuItem,
  SubMenu,
  MenuSection,
  NavHeader,
  NavCollapseIcons,
} from './menu/vertical-menu'

export {
  Menu as HorizontalMenu,
  MenuItem as HorizontalMenuItem,
  SubMenu as HorizontalSubMenu,
} from './menu/horizontal-menu'

// Hooks
export { useVerticalNav, useVerticalMenu } from './menu/contexts/verticalNavContext'
export { useHorizontalNav, useHorizontalMenu } from './menu/contexts/horizontalNavContext'

// Styles
export { default as verticalMenuItemStyles } from './styles/core/vertical/menuItemStyles'
export { default as verticalMenuSectionStyles } from './styles/core/vertical/menuSectionStyles'
export { default as verticalNavigationCustomStyles } from './styles/core/vertical/navigationCustomStyles'
export { default as horizontalMenuItemStyles } from './styles/core/horizontal/menuItemStyles'
export { default as horizontalMenuRootStyles } from './styles/core/horizontal/menuRootStyles'

// Styled Components
export { default as StyledVerticalNavExpandIcon } from './menu/styles/vertical/StyledVerticalNavExpandIcon'
export { default as StyledHorizontalNavExpandIcon } from './menu/styles/horizontal/StyledHorizontalNavExpandIcon'

// Internal layout components
export { default as VerticalNavContent } from './components/horizontal/VerticalNavContent'

// Shared Components (still imported by apps/web components)
export { default as UserMenu } from './components/UserMenu'
export { default as Logo } from './assets/svg/Logo'
