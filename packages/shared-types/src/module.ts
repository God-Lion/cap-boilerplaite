import type { CAPPlugin } from './contracts/plugin.contracts'

export type NavVariant = 'vertical' | 'admin' | 'horizontal' | 'all'

export type ModuleRouteLayout = 'public' | 'vertical' | 'horizontal' | 'noLayout' | 'admin' | 'none'

export interface ModuleRouteConfig {
  path: string
  element: any
  layout?: ModuleRouteLayout
}

export interface NavItemConfig {
  id: string                        // unique key for React
  label: string                     // i18n key or fallback string
  path?: string                     // route path (undefined = section header only)
  icon?: string                     // tabler icon class e.g. 'tabler-users'
  section?: string                  // if set, wraps the item in a <MenuSection>
  roles?: string[]                  // RoleGuard roles
  permissions?: string[]            // PermissionGuard permissions
  children?: NavItemConfig[]        // nested SubMenu
  variant?: NavVariant[]            // which menus this item appears in (default: all)
  order?: number                    // sort order within its section/group
}

export interface SearchItemConfig {
  id: string
  name: string
  url: string
  icon?: string
  section?: string
  shortcut?: string[]
  subtitle?: string
}

export interface CAPModule {
  id: string
  version: string
  name?: string
  description?: string
  routes?: ModuleRouteConfig[]
  /** Optional fallback for legacy route configs */
  authRouteConfig?: ModuleRouteConfig[]
  storeReducers?: Record<string, any>
  i18n?: Record<string, any>
  plugins?: CAPPlugin[]
  /** @deprecated use navItems */
  navigation?: any
  navItems?: NavItemConfig[]
  searchItems?: SearchItemConfig[]
}

