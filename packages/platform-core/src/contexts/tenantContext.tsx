import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react'
import TenantService from '../services/tenantService'
import { themeService } from '../services/theme/theme.service'
import { useSettings } from '../store'
import type { TenantConfig, UserPreferences, TenantContextValue, TenantThemeBase } from '../types/tenant'
import type { TenantThemeConfig } from '@cap/theme'
import { normalizeTenantConfig } from '../types/tenant'

declare global {
  interface Window {
    __TENANT_CONFIG__?: TenantConfig | null
  }
}

const TenantContext = createContext<TenantContextValue | null>(null)

interface TenantProviderProps {
  children: React.ReactNode
}

const defaultUserPreferences: UserPreferences = {}

export const TenantProvider: React.FC<TenantProviderProps> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantConfig | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingTheme, setIsLoadingTheme] = useState<boolean>(false)
  const [errorTheme, setErrorTheme] = useState<string | null>(null)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultUserPreferences)

  const { updateSettings } = useSettings()

  const applyTenantConfig = useCallback((config: TenantConfig | null) => {
    if (!config) return
    
    const normalized = normalizeTenantConfig(config)
    setTenant(normalized)
    updateSettings({
      primaryColor: normalized.theme?.primaryColor,
      layout: normalized.layout?.layout as any,
      mode: normalized.theme?.mode,
      skin: normalized.theme?.skin,
      semiDark: normalized.theme?.semiDark
    })
  }, [updateSettings])

  const loadTenant = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const inlineConfig = (window as any).__TENANT_CONFIG__
      if (inlineConfig) {
        applyTenantConfig(inlineConfig)
        setIsLoading(false)
        return
      }
      
      const config = await TenantService.fetchTenant()
      applyTenantConfig(config)
    } catch (err) {
      console.error('[TenantProvider] Failed to load tenant:', err)
      setError(err instanceof Error ? err.message : 'Failed to load tenant configuration')
    } finally {
      setIsLoading(false)
    }
  }, [applyTenantConfig])

  useEffect(() => {
    const prefs = TenantService.getUserPreferences()
    setUserPreferences(prefs)
    loadTenant()
  }, [loadTenant])

  useEffect(() => {
    if (!tenant || isLoading) return

    const refreshTenant = async () => {
      if (document.visibilityState === 'visible') {
        const hasUpdate = await TenantService.checkForUpdates()
        if (hasUpdate) {
          await loadTenant()
        }
      }
    }

    document.addEventListener('visibilitychange', refreshTenant)
    return () => document.removeEventListener('visibilitychange', refreshTenant)
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

  const updateTheme = useCallback(async (updates: Partial<TenantThemeBase>) => {
    if (!tenant) return

    setTenant(prev => {
      if (!prev) return null
      return {
        ...prev,
        theme: {
          ...prev.theme,
          ...updates
        }
      }
    })

    // Sync with settings store if relevant
    if (updates.mode || updates.primaryColor || updates.skin || updates.semiDark) {
      updateSettings({
        mode: updates.mode,
        primaryColor: updates.primaryColor,
        skin: updates.skin,
        semiDark: updates.semiDark
      })
    }
  }, [tenant, updateSettings])

  const saveTheme = useCallback(async (themeToSave: TenantThemeConfig) => {
    setIsLoadingTheme(true)
    setErrorTheme(null)
    try {
      await themeService.saveTheme(themeToSave)
      // Update local state to reflect the saved theme
      setTenant(prev => {
        if (!prev) return null
        return {
          ...prev,
          theme: {
            mode: themeToSave.tokens?.primary?.main || 'light',
            skin: 'default',
            semiDark: false,
            primaryColor: themeToSave.tokens?.primary?.main || '#1976d2',
            secondaryColor: themeToSave.tokens?.secondary?.main || '#dc0046'
          }
        }
      })
    } catch (err) {
      console.error('[TenantProvider] Failed to save theme:', err)
      setErrorTheme(err instanceof Error ? err.message : 'Failed to save theme')
      throw err
    } finally {
      setIsLoadingTheme(false)
    }
  }, [])

  const refetchTheme = useCallback(async () => {
    await refetchTenant()
  }, [refetchTenant])

  const value = useMemo<TenantContextValue>(() => ({
    tenant,
    theme: tenant?.theme || null,
    isLoading,
    error,
    isLoadingTheme,
    errorTheme,
    userPreferences,
    updateUserPreferences,
    refetchTenant,
    refetchTheme,
    updateTheme,
    saveTheme,
  }), [tenant, isLoading, error, isLoadingTheme, errorTheme, userPreferences, updateUserPreferences, refetchTenant, refetchTheme, updateTheme, saveTheme])

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
