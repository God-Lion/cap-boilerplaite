import { useState, useEffect, useCallback, useMemo } from 'react';
import type { TenantThemeConfig } from '../types';
import { DEFAULT_TENANT_THEME } from '../types';
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

    return DEFAULT_TENANT_THEME;
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
    if (!apiEndpoint) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiEndpoint}/themes/${organizationId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch theme: ${response.status}`);
      }

      const data = await response.json();
      const fetchedTheme = data as TenantThemeConfig;
      
      setTheme(fetchedTheme);
      saveToStorage(fetchedTheme);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch theme');
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
      ...DEFAULT_TENANT_THEME,
      organizationId,
    });
    saveToStorage({
      ...DEFAULT_TENANT_THEME,
      organizationId,
    });
  }, [organizationId, saveToStorage]);

  const saveTheme = useCallback(async () => {
    if (!apiEndpoint) {
      setError('No API endpoint configured');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`${apiEndpoint}/themes/${organizationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(theme),
      });

      if (!response.ok) {
        throw new Error(`Failed to save theme: ${response.status}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save theme');
    } finally {
      setIsSaving(false);
    }
  }, [apiEndpoint, organizationId, theme]);

  useEffect(() => {
    if (apiEndpoint && !initialTheme) {
      fetchTheme();
    }
  }, [apiEndpoint, organizationId, fetchTheme, initialTheme]);

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
