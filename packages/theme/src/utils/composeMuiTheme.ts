import { createTheme, darken, lighten } from '@mui/material/styles';
import type { Direction, Settings, SystemMode } from '@cap/shared-types';
import getComponentOverrides from '../overrides';
import type { TenantThemeConfig } from '../types';
import { DEFAULT_THEME_CONFIG } from '../types';
import darkTheme from '../assets/themes/dark';
import lightTheme from '../assets/themes/light';
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
  const baseTenantTheme = tenantTheme || DEFAULT_THEME_CONFIG;
  const resolvedTenantTheme = {
    ...baseTenantTheme,
    effects: {
      ...(baseTenantTheme.effects || DEFAULT_THEME_CONFIG.effects),
      ...(settings.effect ? { globalType: settings.effect } : {})
    }
  } as TenantThemeConfig;

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
  const errorMain = tokens.colors.error?.value || baseStaticTheme.palette.error.main;
  const successMain = tokens.colors.success?.value || baseStaticTheme.palette.success.main;
  const warningMain = tokens.colors.warning?.value || baseStaticTheme.palette.warning.main;
  const infoMain = tokens.colors.info?.value || baseStaticTheme.palette.info.main;
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
          light: lighten(errorMain, 0.2),
          main: errorMain,
          dark: darken(errorMain, 0.12),
          contrastText: '#FFF',
          lighterOpacity: `${errorMain}14`,
          lightOpacity: `${errorMain}29`,
          mainOpacity: `${errorMain}3D`,
          darkOpacity: `${errorMain}52`,
          darkerOpacity: `${errorMain}61`,
        },
        success: {
          light: lighten(successMain, 0.2),
          main: successMain,
          dark: darken(successMain, 0.12),
          contrastText: '#FFF',
          lighterOpacity: `${successMain}14`,
          lightOpacity: `${successMain}29`,
          mainOpacity: `${successMain}3D`,
          darkOpacity: `${successMain}52`,
          darkerOpacity: `${successMain}61`,
        },
        warning: {
          light: lighten(warningMain, 0.2),
          main: warningMain,
          dark: darken(warningMain, 0.12),
          contrastText: '#FFF',
          lighterOpacity: `${warningMain}14`,
          lightOpacity: `${warningMain}29`,
          mainOpacity: `${warningMain}3D`,
          darkOpacity: `${warningMain}52`,
          darkerOpacity: `${warningMain}61`,
        },
        info: {
          light: lighten(infoMain, 0.2),
          main: infoMain,
          dark: darken(infoMain, 0.12),
          contrastText: '#FFF',
          lighterOpacity: `${infoMain}14`,
          lightOpacity: `${infoMain}29`,
          mainOpacity: `${infoMain}3D`,
          darkOpacity: `${infoMain}52`,
          darkerOpacity: `${infoMain}61`,
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
