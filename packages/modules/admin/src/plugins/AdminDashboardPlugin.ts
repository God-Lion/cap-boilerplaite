import type { 
  ServicePlugin, 
  PluginInstallContext, 
  PluginUninstallContext, 
  PluginLifecycleState 
} from '@cap/platform-core'
import { apiClient } from '@cap/platform-core'

/**
 * Admin Dashboard Plugin
 * 
 * Provides services for the admin dashboard functionality including
 * metrics aggregation and health monitoring.
 */

interface DashboardMetrics {
  totalUsers: number
  activeUsers: number
  mfaEnabled: number
  recentSignIns: number
  failedAttempts: number
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: Date
  services: Record<string, {
    status: 'up' | 'down'
    latency?: number
  }>
}

/**
 * Dashboard metrics service
 * Fetches real metrics from the backend API
 */
class DashboardMetricsService {
  private metrics: DashboardMetrics = {
    totalUsers: 0,
    activeUsers: 0,
    mfaEnabled: 0,
    recentSignIns: 0,
    failedAttempts: 0
  }

  async getMetrics(): Promise<DashboardMetrics> {
    return { ...this.metrics }
  }

  async refreshMetrics(): Promise<void> {
    try {
      const response = await apiClient.get<DashboardMetrics>('/api/admin/dashboard/metrics')
      this.metrics = response.data
    } catch (error) {
      console.error('[DashboardMetricsService] Failed to fetch metrics:', error)
      // Keep existing metrics on error, don't overwrite with mock data
      throw error
    }
  }

  updateMetric(key: keyof DashboardMetrics, value: number): void {
    this.metrics[key] = value
  }
}

/**
 * Health monitoring service
 * Performs real health checks against backend services
 */
class HealthMonitorService {
  async getHealthStatus(): Promise<HealthStatus> {
    try {
      const response = await apiClient.get<HealthStatus>('/api/admin/health')
      return {
        ...response.data,
        timestamp: new Date(response.data.timestamp)
      }
    } catch (error) {
      console.error('[HealthMonitorService] Failed to fetch health status:', error)
      // Return degraded status on error
      return {
        status: 'unhealthy',
        timestamp: new Date(),
        services: {}
      }
    }
  }

  async checkService(name: string): Promise<{ status: 'up' | 'down'; latency?: number }> {
    try {
      const response = await apiClient.get<{ status: 'up' | 'down'; latency?: number }>(
        `/api/admin/health/services/${encodeURIComponent(name)}`
      )
      return response.data
    } catch (error) {
      console.error(`[HealthMonitorService] Failed to check service ${name}:`, error)
      return { status: 'down' }
    }
  }
}

/**
 * Admin Dashboard Plugin Definition
 */
export const AdminDashboardPlugin: ServicePlugin = {
  id: 'admin-dashboard',
  name: 'Admin Dashboard Plugin',
  version: '1.0.0',
  description: 'Provides dashboard metrics and health monitoring services for the admin panel',
  author: 'CAP Platform',
  category: 'service',
  pluginType: 'service',
  initOrder: 10,
  
  services: {
    dashboardMetrics: new DashboardMetricsService(),
    healthMonitor: new HealthMonitorService()
  },
  
  install: async (context: PluginInstallContext) => {
    console.log(`[AdminDashboardPlugin] Installing for module: ${context.moduleId}`)
  },
  
  onStateChange: (state: PluginLifecycleState, error?: Error) => {
    if (state === 'active') {
      console.log('[AdminDashboardPlugin] Plugin active, services registered')
    }
    if (state === 'error' && error) {
      console.error('[AdminDashboardPlugin] Plugin error:', error)
    }
  },
  
  uninstall: async (context) => {
    console.log(`[AdminDashboardPlugin] Uninstalling from module: ${context.moduleId}`)
  }
}

/**
 * Export plugin types for consumers
 */
export type { DashboardMetrics, HealthStatus }
export { DashboardMetricsService, HealthMonitorService }

/**
 * Helper to get admin dashboard services from registry
 */
export const getAdminDashboardServices = (registry: {
  getService: <T>(name: string) => T | undefined
}) => ({
  metrics: registry.getService<DashboardMetricsService>('dashboardMetrics'),
  health: registry.getService<HealthMonitorService>('healthMonitor')
})
