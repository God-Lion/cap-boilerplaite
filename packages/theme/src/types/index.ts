import type { PrimitiveTokens, SemanticTokens } from './designTokens';
import type { EffectConfig, ComputedNeumorphismShadow } from './effects';
import type { ComponentStyles } from './componentStyles';
import type { ThemePresetId } from './presets';

export * from './designTokens';
export * from './effects';
export * from './componentStyles';
export * from './presets';

export interface TenantThemeConfig {
  id?: string;
  organizationId: string;
  name: string;
  preset?: ThemePresetId;
  tokens: PrimitiveTokens;
  effects: EffectConfig;
  components: ComponentStyles;
  version: string;
  metadata?: {
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    preset?: string;
  };
}

export interface TenantThemeContextValue {
  theme: TenantThemeConfig | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateTheme: (updates: Partial<TenantThemeConfig>) => Promise<void>;
  saveTheme: (theme: TenantThemeConfig) => Promise<void>;
}

export interface TenantThemeProviderProps {
  children: React.ReactNode;
  organizationId?: string;
  initialTheme?: TenantThemeConfig | null;
  apiEndpoint?: string;
}

export interface CSSVariableMap {
  [key: string]: string | number;
}

export interface AppliedThemeVariables {
  colors: CSSVariableMap;
  spacing: CSSVariableMap;
  borderRadius: CSSVariableMap;
  effects: CSSVariableMap;
  components: CSSVariableMap;
}

export const DEFAULT_TENANT_THEME: TenantThemeConfig = {
  organizationId: 'default',
  name: 'Default Theme',
  tokens: {
    colors: {
      primary: { value: '#6366f1' },
      secondary: { value: '#8b5cf6' },
      background: { value: '#f8fafc' },
      surface: { value: '#ffffff' },
      text: { value: '#0f172a' },
      textMuted: { value: '#64748b' },
      border: { value: '#e2e8f0' },
      success: { value: '#22c55e' },
      warning: { value: '#f59e0b' },
      error: { value: '#ef4444' },
      info: { value: '#3b82f6' },
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
      '2xl': '3rem',
    },
    borderRadius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
    typography: {
      fontFamily: {
        sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        mono: "'JetBrains Mono', Consolas, monospace",
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: '1.25',
        normal: '1.5',
        relaxed: '1.75',
      },
    },
  },
  effects: {
    globalType: 'standard',
    glassmorphism: {
      enabled: false,
      blur: '16px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: '1px',
      opacity: 0.8,
    },
    neumorphism: {
      enabled: false,
      backgroundColor: '#e0e5ec',
      intensity: 0.15,
      distance: 5,
      altitude: 10,
      borderRadius: '12px',
    },
  },
  components: {
    button: { style: 'global' },
    card: { style: 'global' },
    input: { style: 'global' },
    navbar: { style: 'global' },
    footer: { style: 'global' },
    modal: { style: 'global' },
    drawer: { style: 'global' },
  },
  version: '1.0.0',
};
