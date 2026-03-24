import React, { createContext, useContext, useMemo, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { TenantThemeConfig, TenantThemeContextValue } from '../types';
import { DEFAULT_THEME_CONFIG } from '../types';
import { applyThemeVariables, resetAllThemeVariables } from '../utils/applyThemeVariables';
import themeService from '../services/theme.service';

const TenantThemeContext = createContext<TenantThemeContextValue | null>(null);

interface TenantThemeProviderProps {
  children: ReactNode;
  theme?: TenantThemeConfig | null;
  onThemeChange?: (theme: TenantThemeConfig) => void;
  autoApply?: boolean;
}

export const TenantThemeProvider: React.FC<TenantThemeProviderProps> = ({
  children,
  theme,
  onThemeChange,
  autoApply = true,
}) => {
  const [currentTheme, setCurrentTheme] = useState<TenantThemeConfig | null>(
    theme || DEFAULT_THEME_CONFIG
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    if (theme) {
      setCurrentTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    if (autoApply && currentTheme) {
      try {
        applyThemeVariables(currentTheme);
        setIsApplied(true);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to apply theme');
        setIsApplied(false);
      }
    }
  }, [currentTheme, autoApply]);

  useEffect(() => {
    return () => {
      if (isApplied) {
        resetAllThemeVariables();
      }
    };
  }, [isApplied]);

  const fetchTheme = useCallback(async (orgId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await themeService.getTheme(orgId);
      setCurrentTheme(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch theme');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveTheme = useCallback(async (themeToSave: TenantThemeConfig) => {
    if (!themeToSave.organizationId) return;
    
    setIsLoading(true);
    setError(null);
    try {
      await themeService.saveTheme(themeToSave);
      setCurrentTheme(themeToSave);
      onThemeChange?.(themeToSave);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save theme');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [onThemeChange]);

  const updateTheme = useCallback(async (updates: Partial<TenantThemeConfig>) => {
    const deepMerge = (target: any, source: any): any => {
      const output = { ...target };
      if (source && typeof source === 'object') {
        Object.keys(source).forEach(key => {
          if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && target && key in target) {
            output[key] = deepMerge(target[key], source[key]);
          } else {
            output[key] = source[key];
          }
        });
      }
      return output;
    };

    const updated = deepMerge(currentTheme!, updates);
    updated.metadata = {
      ...currentTheme!.metadata,
      ...updates.metadata,
      updatedAt: new Date().toISOString(),
    };
    
    setCurrentTheme(updated);
    
    if (autoApply) {
      try {
        applyThemeVariables(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to apply theme');
      }
    }
  }, [currentTheme, autoApply]);

  const value = useMemo((): TenantThemeContextValue => ({
    theme: currentTheme,
    isLoading,
    error,
    refetch: () => currentTheme?.organizationId ? fetchTheme(currentTheme.organizationId) : Promise.resolve(),
    updateTheme,
    saveTheme,
  }), [currentTheme, isLoading, error, fetchTheme, updateTheme, saveTheme]);

  return (
    <TenantThemeContext.Provider value={value}>
      {children}
    </TenantThemeContext.Provider>
  );
};

export const useTenantThemeContext = (): TenantThemeContextValue => {
  const context = useContext(TenantThemeContext);
  
  if (!context) {
    return {
      theme: DEFAULT_THEME_CONFIG,
      isLoading: false,
      error: null,
      refetch: async () => {},
      updateTheme: async () => {},
      saveTheme: async () => {},
    };
  }
  
  return context;
};

export default TenantThemeProvider;
