import { IAuthPlugin, IAuthRegistry } from '@cap/platform-core'

class AuthRegistry implements IAuthRegistry {
  private plugins: Map<string, IAuthPlugin> = new Map()

  register(plugin: IAuthPlugin) {
    if (this.plugins.has(plugin.id)) {
      const existing = this.plugins.get(plugin.id)
      throw new Error(
        `[AuthRegistry] Duplicate module id "${plugin.id}". ` +
        `Module IDs must be globally unique. ` +
        `Already registered by: ${existing?.type ?? 'unknown'}`
      )
    }
    this.plugins.set(plugin.id, plugin)
  }

  getPlugin(id: string) {
    return this.plugins.get(id)
  }

  getPluginsByType(type: IAuthPlugin['type']) {
    return Array.from(this.plugins.values()).filter(p => p.type === type)
  }

  get activePlugins() {
    return Array.from(this.plugins.values())
  }
}

export const authRegistry = new AuthRegistry()
