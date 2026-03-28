import { createTheme, darken, lighten } from '@mui/material/styles';
import type { Direction, Settings, SystemMode } from '@cap/shared-types';
import getComponentOverrides from '../overrides';
import type { TenantThemeConfig } from '../types';
import { DEFAULT_THEME_CONFIG } from '../types';
import { darkTheme, lightTheme } from '../assets/themes';
import { createBaseMuiTheme } from './createBaseMuiTheme';

interface ComposeMuiThemeOptions {
  currentMode: SystemMode;
  direction?: Direction;
  settings: Settings;
  tenantTheme?: TenantThemeConfig | null;
}

const toNumber = (value: string | number | undefined, fallback: number) => {
  if (typeof value === 'number') return value;

  const parsed = Number.parseInt(value || '', 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const composeMuiTheme = ({
  currentMode,
  direction = 'ltr',
  settings,
  tenantTheme,
}: ComposeMuiThemeOptions) => {
  const resolvedTenantTheme = tenantTheme || DEFAULT_THEME_CONFIG;
  const tokens = resolvedTenantTheme.tokens || DEFAULT_THEME_CONFIG.tokens;
  const baseStaticTheme = currentMode === 'dark' ? darkTheme : lightTheme;
  const primaryMain = tokens.colors.primary?.value || settings.primaryColor || baseStaticTheme.palette.primary.main;
  const secondaryMain = tokens.colors.secondary?.value || baseStaticTheme.palette.secondary.main;
  const backgroundDefault =
    tokens.colors.background?.value || baseStaticTheme.palette.background.default;
  const surfaceColor = tokens.colors.surface?.value || baseStaticTheme.palette.background.paper;
  const borderColor = tokens.colors.border?.value || baseStaticTheme.palette.divider;
  const textPrimary = tokens.colors.text?.value || baseStaticTheme.palette.text.primary;
  const textSecondary = tokens.colors.textMuted?.value || baseStaticTheme.palette.text.secondary;
  const updatedSettings = {
    ...settings,
    primaryColor: primaryMain,
  };

  const theme = createTheme(
    baseStaticTheme,
    createBaseMuiTheme(updatedSettings, currentMode, direction),
    {
      direction,
      palette: {
        mode: currentMode,
        primary: {
          light: lighten(primaryMain, 0.2),
          main: primaryMain,
          dark: darken(primaryMain, 0.12),
          // Opacity tokens — consumed by button/tab override variants (not via colorSchemes)
          lighterOpacity: `${primaryMain}14`,
          lightOpacity: `${primaryMain}29`,
          mainOpacity: `${primaryMain}3D`,
          darkOpacity: `${primaryMain}52`,
          darkerOpacity: `${primaryMain}61`,
        },
        secondary: {
          light: lighten(secondaryMain, 0.2),
          main: secondaryMain,
          dark: darken(secondaryMain, 0.12),
          contrastText: '#FFF',
          lighterOpacity: `${secondaryMain}14`,
          lightOpacity: `${secondaryMain}29`,
          mainOpacity: `${secondaryMain}3D`,
          darkOpacity: `${secondaryMain}52`,
          darkerOpacity: `${secondaryMain}61`,
        },
        error: {
          main: tokens.colors.error?.value || baseStaticTheme.palette.error.main,
          light: '#FF7074',
          dark: '#E64449',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(255, 76, 81, 0.08)',
          lightOpacity: 'rgba(255, 76, 81, 0.16)',
          mainOpacity: 'rgba(255, 76, 81, 0.24)',
          darkOpacity: 'rgba(255, 76, 81, 0.32)',
          darkerOpacity: 'rgba(255, 76, 81, 0.38)',
        },
        success: {
          main: tokens.colors.success?.value || baseStaticTheme.palette.success.main,
          light: '#53D28C',
          dark: '#24B364',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(40, 199, 111, 0.08)',
          lightOpacity: 'rgba(40, 199, 111, 0.16)',
          mainOpacity: 'rgba(40, 199, 111, 0.24)',
          darkOpacity: 'rgba(40, 199, 111, 0.32)',
          darkerOpacity: 'rgba(40, 199, 111, 0.38)',
        },
        warning: {
          main: tokens.colors.warning?.value || baseStaticTheme.palette.warning.main,
          light: '#FFB269',
          dark: '#E68F3C',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(255, 159, 67, 0.08)',
          lightOpacity: 'rgba(255, 159, 67, 0.16)',
          mainOpacity: 'rgba(255, 159, 67, 0.24)',
          darkOpacity: 'rgba(255, 159, 67, 0.32)',
          darkerOpacity: 'rgba(255, 159, 67, 0.38)',
        },
        info: {
          main: tokens.colors.info?.value || baseStaticTheme.palette.info.main,
          light: '#33C8DA',
          dark: '#00A7BC',
          contrastText: '#FFF',
          lighterOpacity: 'rgba(0, 186, 209, 0.08)',
          lightOpacity: 'rgba(0, 186, 209, 0.16)',
          mainOpacity: 'rgba(0, 186, 209, 0.24)',
          darkOpacity: 'rgba(0, 186, 209, 0.32)',
          darkerOpacity: 'rgba(0, 186, 209, 0.38)',
        },
        background: {
          default: backgroundDefault,
          paper: surfaceColor,
        },
        text: {
          primary: textPrimary,
          secondary: textSecondary,
        },
        divider: borderColor,
        customColors: {
          bodyBg: backgroundDefault,
          chatBg: backgroundDefault,
          greyLightBg: backgroundDefault,
          inputBorder: borderColor,
          tableHeaderBg: surfaceColor,
          tooltipText: currentMode === 'dark' ? '#2F3349' : '#FFFFFF',
          trackBg: borderColor,
          brandGold: primaryMain,
          brandBrown: secondaryMain,
          brandSlate: textSecondary,
          brandCream: backgroundDefault,
        },
      },
      typography: {
        fontFamily: tokens.typography?.fontFamily?.sans || baseStaticTheme.typography.fontFamily,
        h1: {
          fontSize: tokens.typography?.fontSize?.['4xl'] || '2.25rem',
          fontWeight: tokens.typography?.fontWeight?.bold || 700,
          lineHeight: tokens.typography?.lineHeight?.tight || '1.25',
        },
        h2: {
          fontSize: tokens.typography?.fontSize?.['3xl'] || '1.875rem',
          fontWeight: tokens.typography?.fontWeight?.bold || 700,
          lineHeight: tokens.typography?.lineHeight?.tight || '1.25',
        },
        h3: {
          fontSize: tokens.typography?.fontSize?.['2xl'] || '1.5rem',
          fontWeight: tokens.typography?.fontWeight?.semibold || 600,
          lineHeight: tokens.typography?.lineHeight?.tight || '1.25',
        },
        h4: {
          fontSize: tokens.typography?.fontSize?.xl || '1.25rem',
          fontWeight: tokens.typography?.fontWeight?.semibold || 600,
          lineHeight: tokens.typography?.lineHeight?.tight || '1.25',
        },
        h5: {
          fontSize: tokens.typography?.fontSize?.lg || '1.125rem',
          fontWeight: tokens.typography?.fontWeight?.semibold || 600,
          lineHeight: tokens.typography?.lineHeight?.tight || '1.25',
        },
        h6: {
          fontSize: tokens.typography?.fontSize?.base || '1rem',
          fontWeight: tokens.typography?.fontWeight?.semibold || 600,
          lineHeight: tokens.typography?.lineHeight?.tight || '1.25',
        },
        subtitle1: {
          fontSize: tokens.typography?.fontSize?.lg || '1.125rem',
          fontWeight: tokens.typography?.fontWeight?.medium || 500,
          lineHeight: tokens.typography?.lineHeight?.normal || '1.5',
        },
        subtitle2: {
          fontSize: tokens.typography?.fontSize?.base || '1rem',
          fontWeight: tokens.typography?.fontWeight?.medium || 500,
          lineHeight: tokens.typography?.lineHeight?.normal || '1.5',
        },
        body1: {
          fontSize: tokens.typography?.fontSize?.base || '1rem',
          fontWeight: tokens.typography?.fontWeight?.normal || 400,
          lineHeight: tokens.typography?.lineHeight?.normal || '1.5',
        },
        body2: {
          fontSize: tokens.typography?.fontSize?.sm || '0.875rem',
          fontWeight: tokens.typography?.fontWeight?.normal || 400,
          lineHeight: tokens.typography?.lineHeight?.normal || '1.5',
        },
        caption: {
          fontSize: tokens.typography?.fontSize?.xs || '0.75rem',
          fontWeight: tokens.typography?.fontWeight?.normal || 400,
          lineHeight: tokens.typography?.lineHeight?.normal || '1.5',
        },
        overline: {
          fontSize: tokens.typography?.fontSize?.xs || '0.75rem',
          fontWeight: tokens.typography?.fontWeight?.semibold || 600,
          lineHeight: tokens.typography?.lineHeight?.normal || '1.5',
          textTransform: 'uppercase',
        },
        button: {
          textTransform: 'none',
          fontWeight: tokens.typography?.fontWeight?.medium || 500,
        },
      },
      shape: {
        borderRadius: toNumber(tokens.borderRadius?.md, toNumber(baseStaticTheme.shape.borderRadius, 8)),
        customBorderRadius: {
          xs: toNumber(tokens.borderRadius?.none, 2),
          sm: toNumber(tokens.borderRadius?.sm, 4),
          md: toNumber(tokens.borderRadius?.md, 8),
          lg: toNumber(tokens.borderRadius?.lg, 12),
          xl: toNumber(tokens.borderRadius?.xl, 16),
        },
      },
      tenantTheme: resolvedTenantTheme,
    },
  );

  theme.components = {
    ...theme.components,
    ...(getComponentOverrides(theme, settings.skin as any) as typeof theme.components),
  };

  return theme;
};
