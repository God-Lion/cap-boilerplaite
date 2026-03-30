/// <reference types="vite/client" />
import './types/pwa.d.ts'
import './types/mui.d.ts'

export * from '@cap/platform-ui'
export * from '@cap/platform-store'

export { default as defaultCoreTheme } from './theme'
export type { Settings } from '@cap/shared-types'
export * from './types'
export * from './services'
export * from './i18n/i18n'
export { default as themeConfig } from '@cap/shared-types/theme'

export * from './utils'
export * from './assembly'
export { default as useObjectCookie } from './hooks/useObjectCookie'
export * from './hooks/usePermissions'
export { TenantProvider, useTenant } from './contexts/tenantContext'
export * from './contexts/tenantContext'
export * from './hooks/useDynamicTheme'
export * from './services/tenantService'
export * from './types/tenant'
export * from './hooks/useNetworkSync'
export * from './hooks/useAuth'
export * from './hooks/useNavigation'
export * from './hooks/useSessionGuard'
export * from './guards'
export * from './components/guards'


export * from './registry/PluginRegistry'
