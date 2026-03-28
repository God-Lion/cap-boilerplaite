/**
 * Plugin System Contracts
 * 
 * Defines the base plugin interface and registry pattern that modules
 * can use to register components, routes, or services at runtime.
 */

// Note: We use 'any' for component types to avoid circular dependencies with React.
// Consumers can cast to their specific component types as needed.

/**
 * Plugin lifecycle states
 */
export type PluginLifecycleState = 'pending' | 'installing' | 'active' | 'error' | 'uninstalled'

/**
 * Generic component type placeholder
 * Use React.ComponentType<any> in consumer code
 */
export type ComponentType = any

/**
 * Plugin metadata for identification and discovery
 */
export interface PluginMetadata {
  /** Unique identifier for the plugin (e.g., 'admin-dashboard', 'mfa-totp') */
  id: string
  
  /** Human-readable name */
  name: string
  
  /** Plugin version (semver) */
  version: string
  
  /** Plugin description */
  description?: string
  
  /** Plugin author */
  author?: string
  
  /** Plugin category for organization */
  category?: 'auth' | 'ui' | 'service' | 'integration' | 'analytics' | 'custom'
  
  /** Dependencies on other plugins (plugin IDs) */
  dependencies?: string[]
  
  /** Plugins that this plugin extends (if any) */
  extends?: string[]
}

/**
 * Plugin install context provided to the plugin during installation
 */
export interface PluginInstallContext {
  /** The module ID that owns this plugin */
  moduleId: string
  
  /** Registry instance for registering components/routes/services */
  registry: PluginRegistry
  
  /** Shared configuration passed to the plugin */
  config?: Record<string, unknown>
  
  /** Helper to get other installed plugins */
  // eslint-disable-next-line no-use-before-define
  getPlugin: <T extends CAPPlugin = CAPPlugin>(id: string) => T | undefined
}

/**
 * Plugin uninstall context for cleanup
 */
export interface PluginUninstallContext {
  /** The module ID that owns this plugin */
  moduleId: string
  
  /** Registry for cleanup */
  registry: PluginRegistry
}

/**
 * Base plugin interface - all plugins must implement this
 */
export interface BasePlugin extends PluginMetadata {
  /**
   * Install the plugin. Called when the plugin is registered.
   * Use this to initialize resources, register components, routes, etc.
   */
  install: (context: PluginInstallContext) => void | Promise<void>
  
  /**
   * Uninstall the plugin. Called when the plugin is removed.
   * Use this to cleanup resources.
   */
  uninstall?: (context: PluginUninstallContext) => void | Promise<void>
  
  /**
   * Called when the plugin lifecycle state changes
   */
  onStateChange?: (state: PluginLifecycleState, error?: Error) => void
}

/**
 * Plugin that provides UI components
 */
export interface ComponentPlugin extends BasePlugin {
  pluginType: 'component'
  
  /** Components this plugin provides */
  components: Record<string, ComponentType>
  
  /** Optional component registration hooks */
  onComponentRegister?: (name: string, component: ComponentType) => void
}

/**
 * Plugin that provides routes
 */
export interface RoutePlugin extends BasePlugin {
  pluginType: 'route'
  
  /** Routes this plugin provides */
  routes: RouteRegistration[]
  
  /** Route prefix for this plugin */
  routePrefix?: string
}

/**
 * Route registration object
 */
export interface RouteRegistration {
  /** Route path (e.g., '/dashboard') */
  path: string
  
  /** Component to render (React component or lazy-loaded component) */
  component: ComponentType
  
  /** Route metadata */
  meta?: {
    title?: string
    icon?: string
    roles?: string[]
    permissions?: string[]
    hidden?: boolean
  }
}

/**
 * Plugin that provides services (business logic, API clients, etc.)
 */
export interface ServicePlugin extends BasePlugin {
  pluginType: 'service'
  
  /** Services this plugin provides */
  services: Record<string, unknown>
  
  /** Optional initialization order (lower = earlier) */
  initOrder?: number
}

/**
 * Plugin that provides i18n translations
 */
export interface I18nPlugin extends BasePlugin {
  pluginType: 'i18n'
  
  /** Dictionary entries keyed by locale */
  dictionaries: Record<string, Record<string, string>>
}

/**
 * Generic plugin that can combine multiple types
 */
export interface HybridPlugin extends BasePlugin {
  pluginType: 'hybrid'
  
  /** Optional components */
  components?: Record<string, ComponentType>
  
  /** Optional routes */
  routes?: RouteRegistration[]
  
  /** Optional services */
  services?: Record<string, unknown>
  
  /** Optional dictionaries */
  dictionaries?: Record<string, Record<string, string>>
}

/**
 * Union type of all plugin types
 */
export type CAPPlugin = ComponentPlugin | RoutePlugin | ServicePlugin | I18nPlugin | HybridPlugin

/**
 * Plugin registry interface for managing plugins
 */
export interface PluginRegistry {
  /**
   * Register a plugin
   * @throws Error if plugin with same ID is already registered
   */
  register: (plugin: CAPPlugin) => Promise<void>
  
  /**
   * Unregister a plugin by ID
   */
  unregister: (id: string) => Promise<void>
  
  /**
   * Get a plugin by ID
   */
  getPlugin: <T extends CAPPlugin = CAPPlugin>(id: string) => T | undefined
  
  /**
   * Get all registered plugins
   */
  getAllPlugins: () => CAPPlugin[]
  
  /**
   * Get plugins by type
   */
  getPluginsByType: <T extends CAPPlugin['pluginType']>(type: T) => Extract<CAPPlugin, { pluginType: T }>[]
  
  /**
   * Get plugins by category
   */
  getPluginsByCategory: (category: PluginMetadata['category']) => CAPPlugin[]
  
  /**
   * Check if a plugin is registered
   */
  hasPlugin: (id: string) => boolean
  
  /**
   * Get the state of a plugin
   */
  getPluginState: (id: string) => PluginLifecycleState | undefined
  
  /**
   * Get all registered components
   */
  getComponents: () => Record<string, ComponentType>
  
  /**
   * Get a specific component by name
   */
  getComponent: (name: string) => ComponentType | undefined
  
  /**
   * Get all registered routes
   */
  getRoutes: () => RouteRegistration[]
  
  /**
   * Get all registered services
   */
  getServices: () => Record<string, unknown>
  
  /**
   * Get a specific service by name
   */
  getService: <T = unknown>(name: string) => T | undefined
  
  /**
   * Get all registered dictionaries
   */
  getDictionaries: () => Record<string, Record<string, Record<string, string>>>
}

/**
 * Module plugin configuration for CAPModule
 */
export interface ModulePluginConfig {
  /** Plugins to install */
  plugins: CAPPlugin[]
  
  /** Whether to auto-install plugins on module load */
  autoInstall?: boolean
  
  /** Shared config passed to all plugins */
  sharedConfig?: Record<string, unknown>
}
