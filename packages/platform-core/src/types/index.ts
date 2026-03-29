// Re-export all types from a single location
export * from './IAuth'
export * from './auth-plugin.types'
export * from './Response'
export type { default as IPermission } from './IPermission'
export type { default as IRole } from './IRole'
// Re-export core types for convenience
export type {
  Layout,
  Skin,
  Mode,
  SystemMode,
  Direction,
  LayoutComponentWidth,
  LayoutComponentPosition,
  ChildrenType,
  ThemeColor,
  Dictionary,
} from '@cap/shared-types'
export type { Settings } from '@cap/shared-types'

// Platform-core specific types
export type { DemoName } from './core-types'

export * from './app-types'
export * from './tenant'
