import type {
  CAPPlugin,
  PluginRegistry as IPluginRegistry,
  PluginLifecycleState,
  PluginInstallContext,
  PluginUninstallContext,
  RouteRegistration,
  ComponentType,
  ComponentPlugin,
  RoutePlugin,
  ServicePlugin,
  I18nPlugin,
  HybridPlugin,
  PluginMetadata
} from '@cap/shared-types'

/**
 * Plugin output ownership tracking
 */
interface PluginOutputs {
  components: string[]
  routes: string[]  // route paths
  services: string[]
  dictionaries: string[] // locale keys
}

/**
 * Track which plugins own each output (for proper cleanup)
 */
interface OutputOwnership {
  components: Map<string, Set<string>> // component name -> set of plugin IDs
  services: Map<string, Set<string>>   // service name -> set of plugin IDs
}

/**
 * Plugin Registry Implementation
 * 
 * Manages the lifecycle of plugins including registration, installation,
 * and uninstallation. Provides methods to access registered components,
 * routes, services, and dictionaries.
 */
class PluginRegistryImpl implements IPluginRegistry {
  private plugins: Map<string, CAPPlugin> = new Map()
  private pluginStates: Map<string, PluginLifecycleState> = new Map()
  private pluginOutputs: Map<string, PluginOutputs> = new Map()
  private components: Map<string, ComponentType> = new Map()
  private routes: RouteRegistration[] = []
  private services: Map<string, unknown> = new Map()
  private dictionaries: Map<string, Record<string, Record<string, string>>> = new Map()
  
  // Track which plugins own each output for proper cleanup
  private outputOwnership: OutputOwnership = {
    components: new Map(),
    services: new Map()
  }

  /**
   * Register a plugin and install it
   */
  async register(plugin: CAPPlugin): Promise<void> {
    // Check for duplicate
    if (this.plugins.has(plugin.id)) {
      const existing = this.plugins.get(plugin.id)
      throw new Error(
        `[PluginRegistry] Plugin "${plugin.id}" is already registered. ` +
        `Plugin IDs must be unique. ` +
        `Already registered: ${existing?.name ?? 'unknown'}`
      )
    }

    // Check dependencies
    if (plugin.dependencies?.length) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(
            `[PluginRegistry] Plugin "${plugin.id}" requires dependency "${dep}" which is not registered.`
          )
        }
      }
    }

    // Set state to installing
    this.plugins.set(plugin.id, plugin)
    this.pluginStates.set(plugin.id, 'installing')

    try {
      // Install the plugin
      const context: PluginInstallContext = {
        moduleId: 'global', // Could be made configurable
        registry: this as unknown as IPluginRegistry,
        config: {},
        getPlugin: <T extends CAPPlugin = CAPPlugin>(id: string): T | undefined => this.getPlugin<T>(id)
      }

      await plugin.install(context)

      // Register plugin outputs based on type
      this.registerPluginOutputs(plugin)

      // Set state to active
      this.pluginStates.set(plugin.id, 'active')
      plugin.onStateChange?.('active')

    } catch (error) {
      this.pluginStates.set(plugin.id, 'error')
      plugin.onStateChange?.('error', error instanceof Error ? error : new Error(String(error)))
      
      // Clean up on error
      this.plugins.delete(plugin.id)
      throw error
    }
  }

  /**
   * Register outputs (components, routes, services, dictionaries) from a plugin
   */
  private registerPluginOutputs(plugin: CAPPlugin): void {
    const outputs: PluginOutputs = {
      components: [],
      routes: [],
      services: [],
      dictionaries: []
    }

    switch (plugin.pluginType) {
      case 'component':
        this.registerComponents((plugin as ComponentPlugin).components, outputs, plugin.id)
        break
      case 'route':
        this.registerRoutes((plugin as RoutePlugin).routes, (plugin as RoutePlugin).routePrefix, outputs)
        break
      case 'service':
        this.registerServices((plugin as ServicePlugin).services, outputs, plugin.id)
        break
      case 'i18n':
        this.registerDictionaries((plugin as I18nPlugin).dictionaries, outputs)
        break
      case 'hybrid':
        const hybrid = plugin as HybridPlugin
        if (hybrid.components) this.registerComponents(hybrid.components, outputs, plugin.id)
        if (hybrid.routes) this.registerRoutes(hybrid.routes, undefined, outputs)
        if (hybrid.services) this.registerServices(hybrid.services, outputs, plugin.id)
        if (hybrid.dictionaries) this.registerDictionaries(hybrid.dictionaries, outputs)
        break
    }

    this.pluginOutputs.set(plugin.id, outputs)
  }

  /**
   * Register components from a component plugin
   */
  private registerComponents(components: Record<string, ComponentType>, outputs?: PluginOutputs, pluginId?: string): void {
    for (const [name, component] of Object.entries(components)) {
      if (this.components.has(name)) {
        console.warn(`[PluginRegistry] Component "${name}" is being overwritten`)
      }
      this.components.set(name, component)
      outputs?.components.push(name)
      
      // Track ownership
      if (pluginId) {
        if (!this.outputOwnership.components.has(name)) {
          this.outputOwnership.components.set(name, new Set())
        }
        this.outputOwnership.components.get(name)!.add(pluginId)
      }
    }
  }

  /**
   * Register routes from a route plugin
   */
  private registerRoutes(routes: RouteRegistration[], routePrefix?: string, outputs?: PluginOutputs): void {
    for (const route of routes) {
      const prefixedPath = routePrefix 
        ? `${routePrefix}${route.path}` 
        : route.path
      
      this.routes.push({
        ...route,
        path: prefixedPath
      })
      outputs?.routes.push(prefixedPath)
    }
  }

  /**
   * Register services from a service plugin
   */
  private registerServices(services: Record<string, unknown>, outputs?: PluginOutputs, pluginId?: string): void {
    for (const [name, service] of Object.entries(services)) {
      if (this.services.has(name)) {
        console.warn(`[PluginRegistry] Service "${name}" is being overwritten`)
      }
      this.services.set(name, service)
      outputs?.services.push(name)
      
      // Track ownership
      if (pluginId) {
        if (!this.outputOwnership.services.has(name)) {
          this.outputOwnership.services.set(name, new Set())
        }
        this.outputOwnership.services.get(name)!.add(pluginId)
      }
    }
  }

  /**
   * Register dictionaries from an i18n plugin
   */
  private registerDictionaries(dictionaries: Record<string, Record<string, string>>, outputs?: PluginOutputs): void {
    for (const [key, value] of Object.entries(dictionaries)) {
      // If the key looks like a locale (2 chars), treat as locale
      if (key.length === 2 || key.includes('-')) {
        if (!this.dictionaries.has(key)) {
          this.dictionaries.set(key, {})
        }
        const localeDicts = this.dictionaries.get(key)!
        Object.assign(localeDicts, { [key]: value })
        outputs?.dictionaries.push(key)
      } else {
        // Assume it's a dictionary name under 'global'
        if (!this.dictionaries.has('global')) {
          this.dictionaries.set('global', {})
        }
        const globalDicts = this.dictionaries.get('global')!
        Object.assign(globalDicts, { [key]: value })
        outputs?.dictionaries.push('global')
      }
    }
  }

  /**
   * Unregister a plugin
   */
  async unregister(id: string): Promise<void> {
    const plugin = this.plugins.get(id)
    if (!plugin) {
      return
    }

    const state = this.pluginStates.get(id)
    if (state === 'installing') {
      throw new Error(`[PluginRegistry] Cannot uninstall plugin "${id}" while installing`)
    }

    try {
      // Call plugin uninstall hook
      if (plugin.uninstall) {
        const context: PluginUninstallContext = {
          moduleId: 'global',
          registry: this as unknown as IPluginRegistry
        }
        await plugin.uninstall(context)
      }

      // Clean up registered outputs
      this.cleanupPluginOutputs(plugin)

      // Remove plugin
      this.plugins.delete(id)
      this.pluginStates.set(id, 'uninstalled')
      plugin.onStateChange?.('uninstalled')

    } catch (error) {
      console.error(`[PluginRegistry] Error uninstalling plugin "${id}":`, error)
      throw error
    }
  }

  /**
   * Clean up outputs registered by a plugin.
   * Only removes outputs if no other plugin owns them.
   */
  private cleanupPluginOutputs(plugin: CAPPlugin): void {
    const outputs = this.pluginOutputs.get(plugin.id)
    if (!outputs) {
      return
    }

    // Remove components (only if no other plugin owns them)
    for (const name of outputs.components) {
      const owners = this.outputOwnership.components.get(name)
      if (owners) {
        owners.delete(plugin.id)
        if (owners.size === 0) {
          this.components.delete(name)
          this.outputOwnership.components.delete(name)
        }
      } else {
        // Fallback: no ownership tracking, just remove
        this.components.delete(name)
      }
    }

    // Remove routes (routes don't have multi-plugin ownership in current impl)
    for (const path of outputs.routes) {
      const index = this.routes.findIndex(r => r.path === path)
      if (index !== -1) {
        this.routes.splice(index, 1)
      }
    }

    // Remove services (only if no other plugin owns them)
    for (const name of outputs.services) {
      const owners = this.outputOwnership.services.get(name)
      if (owners) {
        owners.delete(plugin.id)
        if (owners.size === 0) {
          this.services.delete(name)
          this.outputOwnership.services.delete(name)
        }
      } else {
        // Fallback: no ownership tracking, just remove
        this.services.delete(name)
      }
    }

    // Note: We don't remove dictionaries as they're merged globally
    // and determining which entries belong to this plugin is complex

    // Remove output tracking
    this.pluginOutputs.delete(plugin.id)
  }

  /**
   * Get a plugin by ID
   */
  getPlugin<T extends CAPPlugin = CAPPlugin>(id: string): T | undefined {
    return this.plugins.get(id) as T | undefined
  }

  /**
   * Get all registered plugins
   */
  getAllPlugins(): CAPPlugin[] {
    return Array.from(this.plugins.values())
  }

  /**
   * Get plugins by type
   */
  getPluginsByType<T extends CAPPlugin['pluginType']>(type: T): Extract<CAPPlugin, { pluginType: T }>[] {
    return Array.from(this.plugins.values())
      .filter(p => p.pluginType === type) as Extract<CAPPlugin, { pluginType: T }>[]
  }

  /**
   * Get plugins by category
   */
  getPluginsByCategory(category: PluginMetadata['category']): CAPPlugin[] {
    return Array.from(this.plugins.values())
      .filter(p => p.category === category)
  }

  /**
   * Check if a plugin is registered
   */
  hasPlugin(id: string): boolean {
    return this.plugins.has(id)
  }

  /**
   * Get the state of a plugin
   */
  getPluginState(id: string): PluginLifecycleState | undefined {
    return this.pluginStates.get(id)
  }

  /**
   * Get all registered components
   */
  getComponents(): Record<string, ComponentType> {
    return Object.fromEntries(this.components.entries())
  }

  /**
   * Get a specific component by name
   */
  getComponent(name: string): ComponentType | undefined {
    return this.components.get(name)
  }

  /**
   * Get all registered routes
   */
  getRoutes(): RouteRegistration[] {
    return [...this.routes]
  }

  /**
   * Get all registered services
   */
  getServices(): Record<string, unknown> {
    return Object.fromEntries(this.services.entries())
  }

  /**
   * Get a specific service by name
   */
  getService<T = unknown>(name: string): T | undefined {
    return this.services.get(name) as T | undefined
  }

  /**
   * Get all registered dictionaries
   */
  getDictionaries(): Record<string, Record<string, Record<string, string>>> {
    return Object.fromEntries(
      Array.from(this.dictionaries.entries()).map(([locale, dicts]) => [locale, dicts])
    )
  }

  /**
   * Clear all plugins (mainly for testing)
   */
  clear(): void {
    this.plugins.clear()
    this.pluginStates.clear()
    this.pluginOutputs.clear()
    this.components.clear()
    this.routes = []
    this.services.clear()
    this.dictionaries.clear()
    this.outputOwnership.components.clear()
    this.outputOwnership.services.clear()
  }

  /**
   * Get registry statistics
   */
  getStats(): {
    totalPlugins: number
    activePlugins: number
    components: number
    routes: number
    services: number
  } {
    let activePlugins = 0
    for (const state of this.pluginStates.values()) {
      if (state === 'active') activePlugins++
    }

    return {
      totalPlugins: this.plugins.size,
      activePlugins,
      components: this.components.size,
      routes: this.routes.length,
      services: this.services.size
    }
  }
}

/**
 * Global plugin registry singleton
 */
export const globalPluginRegistry = new PluginRegistryImpl()

/**
 * Create a new isolated plugin registry (for testing or module isolation)
 */
export const createPluginRegistry = (): PluginRegistryImpl => {
  return new PluginRegistryImpl()
}

/**
 * Type guard for plugin types
 */
export const isComponentPlugin = (plugin: CAPPlugin): plugin is ComponentPlugin => 
  plugin.pluginType === 'component'

export const isRoutePlugin = (plugin: CAPPlugin): plugin is RoutePlugin => 
  plugin.pluginType === 'route'

export const isServicePlugin = (plugin: CAPPlugin): plugin is ServicePlugin => 
  plugin.pluginType === 'service'

export const isI18nPlugin = (plugin: CAPPlugin): plugin is I18nPlugin => 
  plugin.pluginType === 'i18n'

export const isHybridPlugin = (plugin: CAPPlugin): plugin is HybridPlugin => 
  plugin.pluginType === 'hybrid'
