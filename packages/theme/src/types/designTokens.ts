export interface ColorToken {
  value: string;
  hsl?: { h: number; s: number; l: number };
  description?: string;
}


export interface PrimitiveTokens {
  colors: {
    primary: ColorToken;
    secondary: ColorToken;
    background: ColorToken;
    surface: ColorToken;
    text: ColorToken;
    textMuted: ColorToken;
    border: ColorToken;
    success: ColorToken;
    warning: ColorToken;
    error: ColorToken;
    info: ColorToken;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  typography: {
    fontFamily: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, string>;
  };
}

export interface SemanticTokens {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export const DEFAULT_PRIMITIVE_TOKENS: PrimitiveTokens = {
  colors: {
    primary: { value: '#6366f1', description: 'Primary brand color' },
    secondary: { value: '#8b5cf6', description: 'Secondary brand color' },
    background: { value: '#f8fafc', description: 'Page background' },
    surface: { value: '#ffffff', description: 'Card/surface background' },
    text: { value: '#0f172a', description: 'Primary text color' },
    textMuted: { value: '#64748b', description: 'Muted text color' },
    border: { value: '#e2e8f0', description: 'Border color' },
    success: { value: '#22c55e', description: 'Success state color' },
    warning: { value: '#f59e0b', description: 'Warning state color' },
    error: { value: '#ef4444', description: 'Error state color' },
    info: { value: '#3b82f6', description: 'Info state color' },
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
};
