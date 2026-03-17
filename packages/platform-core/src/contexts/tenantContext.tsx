import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import TenantService from '../services/tenantService'
import { useSettings } from '../store'
import type { TenantConfig, UserPreferences, TenantContextValue } from '../types/tenant'

const TenantContext = createContext<TenantContextValue | null>(null)

interface TenantProviderProps {
  children: React.ReactNode
}

const defaultUserPreferences: UserPreferences = {}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantConfig | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultUserPreferences)

  const { updateSettings } = useSettings()

  const loadTenant = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const config = await TenantService.fetchTenant()
      setTenant(config)
      
      if (config) {
        // Correctly map TenantConfig to Settings expected by useSettings
        updateSettings({
          primaryColor: config.theme?.primaryColor,
          layout: config.layout?.layout as any,
          mode: config.theme?.mode,
          skin: config.theme?.skin,
          semiDark: config.theme?.semiDark
        })
      }
    } catch (err) {
      console.error('[TenantProvider] Failed to load tenant:', err)
      setError(err instanceof Error ? err.message : 'Failed to load tenant configuration')
    } finally {
      setIsLoading(false)
    }
  }, [updateSettings])

  useEffect(() => {
    const prefs = TenantService.getUserPreferences()
    setUserPreferences(prefs)
    loadTenant()
  }, [loadTenant])

  useEffect(() => {
    if (!tenant || isLoading) return

    const checkForUpdates = async () => {
      const hasUpdate = await TenantService.checkForUpdates()
      if (hasUpdate) {
        await loadTenant()
      }
    }

    const interval = setInterval(checkForUpdates, 60000)

    return () => clearInterval(interval)
  }, [tenant, isLoading, loadTenant])

  const updateUserPreferences = useCallback((prefs: Partial<UserPreferences>) => {
    const updated = { ...userPreferences, ...prefs }
    TenantService.setUserPreferences(updated)
    setUserPreferences(updated)
  }, [userPreferences])

  const refetchTenant = useCallback(async () => {
    TenantService.clearCache()
    await loadTenant()
  }, [loadTenant])

  const value = useMemo<TenantContextValue>(() => ({
    tenant,
    isLoading,
    error,
    userPreferences,
    updateUserPreferences,
    refetchTenant,
  }), [tenant, isLoading, error, userPreferences, updateUserPreferences, refetchTenant])

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>
}

export const useTenant = (): TenantContextValue => {
  const context = useContext(TenantContext)
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

export default TenantContext
