import type {
  CAPPlugin,
  PluginRegistry as IPluginRegistry,
  PluginLifecycleState,
  PluginInstallContext,
  PluginUninstallContext,
  ServicePlugin,
  PluginMetadata
} from '@cap/shared-types'

/**
 * Plugin output tracking for services only
 */
interface PluginOutputs {
  services: string[]
}

/**
 * Track which plugins own each service (for proper cleanup)
 */
interface ServiceOwnership {
  services: Map<string, Set<string>>
}

/**
 * Plugin Registry Implementation
 * 
 * Manages the lifecycle of ServicePlugins including registration, installation,
 * and uninstallation. Provides methods to access registered services.
 * 
 * Note: This registry currently supports ServicePlugin only. Other plugin types
 * (ComponentPlugin, RoutePlugin, I18nPlugin, HybridPlugin) are defined in contracts
 * but not implemented here as they're not currently used.
 */
class PluginRegistryImpl implements IPluginRegistry {
  private plugins: Map<string, CAPPlugin> = new Map()
  private pluginStates: Map<string, PluginLifecycleState> = new Map()
  private pluginOutputs: Map<string, PluginOutputs> = new Map()
  private services: Map<string, unknown> = new Map()
  
  private serviceOwnership: ServiceOwnership = {
    services: new Map()
  }

  /**
   * Register a plugin and install it
   */
  async register(plugin: CAPPlugin): Promise<void> {
    if (this.plugins.has(plugin.id)) {
      const existing = this.plugins.get(plugin.id)
      throw new Error(
        `[PluginRegistry] Plugin "${plugin.id}" is already registered. ` +
        `Plugin IDs must be unique. ` +
        `Already registered: ${existing?.name ?? 'unknown'}`
      )
    }

    if (plugin.dependencies?.length) {
      for (const dep of plugin.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(
            `[PluginRegistry] Plugin "${plugin.id}" requires dependency "${dep}" which is not registered.`
          )
        }
      }
    }

    this.plugins.set(plugin.id, plugin)
    this.pluginStates.set(plugin.id, 'installing')

    try {
      const context: PluginInstallContext = {
        moduleId: 'global',
        registry: this as unknown as IPluginRegistry,
        config: {},
        getPlugin: <T extends CAPPlugin = CAPPlugin>(id: string): T | undefined => this.getPlugin<T>(id)
      }

      await plugin.install(context)

      if (plugin.pluginType === 'service') {
        this.registerServices((plugin as ServicePlugin).services, plugin.id)
      }

      this.pluginStates.set(plugin.id, 'active')
      plugin.onStateChange?.('active')

    } catch (error) {
      this.pluginStates.set(plugin.id, 'error')
      plugin.onStateChange?.('error', error instanceof Error ? error : new Error(String(error)))
      
      this.plugins.delete(plugin.id)
      throw error
    }
  }

  private registerServices(services: Record<string, unknown>, pluginId: string): void {
    const outputs: PluginOutputs = { services: [] }

    for (const [name, service] of Object.entries(services)) {
      if (this.services.has(name)) {
        console.warn(`[PluginRegistry] Service "${name}" is being overwritten`)
      }
      this.services.set(name, service)
      outputs.services.push(name)
      
      if (!this.serviceOwnership.services.has(name)) {
        this.serviceOwnership.services.set(name, new Set())
      }
      this.serviceOwnership.services.get(name)!.add(pluginId)
    }

    this.pluginOutputs.set(pluginId, outputs)
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
      if (plugin.uninstall) {
        const context: PluginUninstallContext = {
          moduleId: 'global',
          registry: this as unknown as IPluginRegistry
        }
        await plugin.uninstall(context)
      }

      this.cleanupPluginOutputs(plugin)

      this.plugins.delete(id)
      this.pluginStates.set(id, 'uninstalled')
      plugin.onStateChange?.('uninstalled')

    } catch (error) {
      console.error(`[PluginRegistry] Error uninstalling plugin "${id}":`, error)
      throw error
    }
  }

  private cleanupPluginOutputs(plugin: CAPPlugin): void {
    const outputs = this.pluginOutputs.get(plugin.id)
    if (!outputs) {
      return
    }

    for (const name of outputs.services) {
      const owners = this.serviceOwnership.services.get(name)
      if (owners) {
        owners.delete(plugin.id)
        if (owners.size === 0) {
          this.services.delete(name)
          this.serviceOwnership.services.delete(name)
        }
      } else {
        this.services.delete(name)
      }
    }

    this.pluginOutputs.delete(plugin.id)
  }

  getPlugin<T extends CAPPlugin = CAPPlugin>(id: string): T | undefined {
    return this.plugins.get(id) as T | undefined
  }

  getAllPlugins(): CAPPlugin[] {
    return Array.from(this.plugins.values())
  }

  getPluginsByType<T extends CAPPlugin['pluginType']>(type: T): Extract<CAPPlugin, { pluginType: T }>[] {
    return Array.from(this.plugins.values())
      .filter(p => p.pluginType === type) as Extract<CAPPlugin, { pluginType: T }>[]
  }

  getPluginsByCategory(category: PluginMetadata['category']): CAPPlugin[] {
    return Array.from(this.plugins.values())
      .filter(p => p.category === category)
  }

  hasPlugin(id: string): boolean {
    return this.plugins.has(id)
  }

  getPluginState(id: string): PluginLifecycleState | undefined {
    return this.pluginStates.get(id)
  }

  getServices(): Record<string, unknown> {
    return Object.fromEntries(this.services.entries())
  }

  getService<T = unknown>(name: string): T | undefined {
    return this.services.get(name) as T | undefined
  }

  clear(): void {
    this.plugins.clear()
    this.pluginStates.clear()
    this.pluginOutputs.clear()
    this.services.clear()
    this.serviceOwnership.services.clear()
  }

  getStats(): {
    totalPlugins: number
    activePlugins: number
    services: number
  } {
    let activePlugins = 0
    for (const state of this.pluginStates.values()) {
      if (state === 'active') activePlugins++
    }

    return {
      totalPlugins: this.plugins.size,
      activePlugins,
      services: this.services.size
    }
  }
}

export const globalPluginRegistry = new PluginRegistryImpl()

export const createPluginRegistry = (): PluginRegistryImpl => {
  return new PluginRegistryImpl()
}

export const isServicePlugin = (plugin: CAPPlugin): plugin is ServicePlugin => 
  plugin.pluginType === 'service'
