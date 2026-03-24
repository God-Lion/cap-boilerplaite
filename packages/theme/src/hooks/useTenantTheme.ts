import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiClient } from '@cap/platform-core';
import type { TenantThemeConfig } from '../types';
import { DEFAULT_THEME_CONFIG } from '../types';
import { applyPreset } from '../utils/mergeTheme';
import type { ThemePresetId } from '../types/presets';

interface UseTenantThemeOptions {
  organizationId?: string;
  apiEndpoint?: string;
  storageKey?: string;
  storageType?: 'localStorage' | 'sessionStorage';
  initialTheme?: TenantThemeConfig | null;
}

interface UseTenantThemeReturn {
  theme: TenantThemeConfig;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateTheme: (updates: Partial<TenantThemeConfig>) => void;
  applyPresetById: (presetId: ThemePresetId) => void;
  resetToDefault: () => void;
  saveTheme: () => Promise<void>;
}

const STORAGE_KEY_PREFIX = 'cap-tenant-theme-';

export const useTenantTheme = (
  options: UseTenantThemeOptions = {}
): UseTenantThemeReturn => {
  const {
    organizationId = 'default',
    apiEndpoint,
    storageKey = `${STORAGE_KEY_PREFIX}${organizationId}`,
    storageType = 'localStorage',
    initialTheme,
  } = options;

  const [theme, setTheme] = useState<TenantThemeConfig>(() => {
    if (initialTheme) {
      return initialTheme;
    }

    try {
      const stored = globalThis[storageType]?.getItem(storageKey);
      if (stored) {
        return JSON.parse(stored) as TenantThemeConfig;
      }
    } catch {
      // Ignore storage errors
    }

    return DEFAULT_THEME_CONFIG;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveToStorage = useCallback((themeToSave: TenantThemeConfig) => {
    try {
      globalThis[storageType]?.setItem(storageKey, JSON.stringify(themeToSave));
    } catch {
      // Ignore storage errors
    }
  }, [storageKey, storageType]);

  const fetchTheme = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use provided apiEndpoint or default to relative path
      const url = apiEndpoint ? `${apiEndpoint}/themes/${organizationId}` : `/themes/${organizationId}`;
      const response = await apiClient.get<TenantThemeConfig>(url);
      
      if (response.data) {
        setTheme(response.data);
        saveToStorage(response.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch theme');
    } finally {
      setIsLoading(false);
    }
  }, [apiEndpoint, organizationId, saveToStorage]);

  const refetch = useCallback(async () => {
    await fetchTheme();
  }, [fetchTheme]);

  const updateTheme = useCallback((updates: Partial<TenantThemeConfig>) => {
    setTheme((prev) => {
      const updated = {
        ...prev,
        ...updates,
        metadata: {
          ...prev.metadata,
          updatedAt: new Date().toISOString(),
        },
      };
      
      saveToStorage(updated);
      
      return updated;
    });
  }, [saveToStorage]);

  const applyPresetById = useCallback((presetId: ThemePresetId) => {
    const presetTheme = applyPreset(presetId);
    
    setTheme((prev) => ({
      ...presetTheme,
      organizationId: prev.organizationId,
      metadata: {
        ...prev.metadata,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const resetToDefault = useCallback(() => {
    setTheme({
      ...DEFAULT_THEME_CONFIG,
      organizationId,
    });
    saveToStorage({
      ...DEFAULT_THEME_CONFIG,
      organizationId,
    });
  }, [organizationId, saveToStorage]);

  const saveTheme = useCallback(async () => {
    setIsSaving(true);
    setError(null);

    try {
      const url = apiEndpoint ? `${apiEndpoint}/themes/${organizationId}` : `/themes/${organizationId}`;
      await apiClient.put(url, theme);
    } catch (err: any) {
      setError(err.message || 'Failed to save theme');
    } finally {
      setIsSaving(false);
    }
  }, [apiEndpoint, organizationId, theme]);

  useEffect(() => {
    if (!initialTheme) {
      fetchTheme();
    }
  }, [organizationId, fetchTheme, initialTheme]);

  return useMemo(() => ({
    theme,
    isLoading,
    isSaving,
    error,
    refetch,
    updateTheme,
    applyPresetById,
    resetToDefault,
    saveTheme,
  }), [theme, isLoading, isSaving, error, refetch, updateTheme, applyPresetById, resetToDefault, saveTheme]);
};

export default useTenantTheme;
