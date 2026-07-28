import React, { useMemo } from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { useTenant, useSettings } from '@cap/platform-core';
import { composeMuiTheme, TenantThemeProvider, ThemeSettingsProvider } from '@cap/theme';
import type { TenantThemeConfig } from '@cap/theme';
import type { Settings } from '@cap/shared-types';

/**
 * Generator function that compiles the MUI theme based on tenant overrides
 */
export const generateTheme = (
  tenantConfig: TenantThemeConfig | null,
  settings: Settings,
  isDark: boolean
) => {
  return composeMuiTheme({
    currentMode: isDark ? 'dark' : 'light',
    settings,
    tenantTheme: tenantConfig,
  });
};

/**
 * ThemeBridge injects CSS custom properties and provides the dynamic MUI Theme
 * based on the current tenant's context.
 */
export const ThemeBridge = ({ children }: { children: React.ReactNode }) => {
  const { 
    theme: tenantConfig, 
    isLoadingTheme, 
    errorTheme, 
    refetchTheme, 
    updateTheme, 
    saveTheme 
  } = useTenant();
  
  const { settings } = useSettings();
  
  const isDark = settings.mode === 'dark'; // Or logic matching system pref

  const theme = useMemo(() => {
    return generateTheme(tenantConfig as any, settings, isDark);
  }, [tenantConfig, settings, isDark]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeSettingsProvider settings={settings}>
        <TenantThemeProvider 
          theme={tenantConfig as any} 
          isLoading={isLoadingTheme} 
          error={errorTheme} 
          refetch={refetchTheme} 
          updateTheme={async (updates) => {
            if (tenantConfig) {
              await updateTheme({ ...(tenantConfig as any), ...updates });
            } else {
              await updateTheme(updates as any);
            }
          }}
          saveTheme={async (updatedConfig) => {
            if (tenantConfig) {
              await saveTheme({ ...(tenantConfig as any), ...updatedConfig });
            } else {
              await saveTheme(updatedConfig as any);
            }
          }}
        >
          <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <GlobalStyles
              styles={{
                ':root': {
                  // Core Layout Variables
                  '--border-color': 'var(--color-border)',
                  '--border-radius': 'var(--radius-md)',

                  // Derived Background Variables
                  '--background-color-rgb': 'var(--color-background-h) var(--color-background-s) var(--color-background-l)',
                  '--backdrop-color': 'hsl(var(--color-background-h) var(--color-background-s) var(--color-background-l) / 0.6)',

                  // Z-Index Layers (Source of Truth)
                  '--header-z-index': 'var(--z-index-app-bar, 1100)',
                  '--drawer-z-index': 'var(--z-index-drawer, 1200)',
                  '--footer-z-index': '1050',
                  '--z-behind': '-1',

                  // Layout Constants
                  '--header-height': '64px',
                },
              }}
            />
            {children}
          </MuiThemeProvider>
        </TenantThemeProvider>
      </ThemeSettingsProvider>
    </StyledEngineProvider>
  );
};

export default ThemeBridge;
