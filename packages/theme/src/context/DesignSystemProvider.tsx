import React, { useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { TenantThemeProvider } from './TenantThemeContext';
import GlobalStyles from '../styles/GlobalStyles';
import type { TenantThemeConfig } from '../types';
import { colors } from '../tokens/colors';
import { typography } from '../tokens/typography';
import getComponentOverrides from '../overrides';

interface DesignSystemProviderProps {
  children: React.ReactNode;
  organizationId?: string;
  initialTheme?: TenantThemeConfig | null;
}

export const DesignSystemProvider: React.FC<DesignSystemProviderProps> = ({
  children,
  organizationId,
  initialTheme,
}) => {
  // Base MUI theme that incorporates our tokens
  const theme = useMemo(() => {
    const baseTheme = createTheme({
      palette: {
        primary: colors.primary,
        secondary: colors.secondary,
        error: colors.error,
        success: colors.success,
        warning: colors.warning,
        info: colors.info,
        // Add channel support for glassmorphism
        //@ts-ignore
        primaryChannel: '212 175 55', // Based on #D4AF37
      },
      typography: {
        fontFamily: typography.fontFamily.sans,
        button: {
          textTransform: 'none',
        },
      },
      shape: {
        borderRadius: 8,
      },
    });

    baseTheme.components = {
      ...baseTheme.components,
      ...(getComponentOverrides(baseTheme) as typeof baseTheme.components),
    };

    return baseTheme;
  }, []);

  return (
    <StyledEngineProvider injectFirst>
      <TenantThemeProvider theme={initialTheme}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          <GlobalStyles />
          {children}
        </MuiThemeProvider>
      </TenantThemeProvider>
    </StyledEngineProvider>
  );
};

export default DesignSystemProvider;
