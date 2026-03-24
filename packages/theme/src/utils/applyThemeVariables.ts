import type { TenantThemeConfig, CSSVariableMap, AppliedThemeVariables } from '../types';
import type { GlassmorphismConfig, NeumorphismConfig } from '../types';

export const hexToRgba = (hex: string, alpha: number = 1): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(0, 0, 0, ${alpha})`;
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const rgbaToHex = (rgba: string): string => {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return '#000000';
  
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  
  return `#${r}${g}${b}`;
};

export const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};


export const flattenVariables = (
  obj: Record<string, unknown>,
  prefix = ''
): CSSVariableMap => {
  const result: CSSVariableMap = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const varName = prefix ? `${prefix}-${key}` : `--${key}`;
    
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenVariables(value as Record<string, unknown>, varName));
    } else if (value !== undefined && value !== null) {
      result[varName] = String(value);
    }
  }
  
  return result;
};

export const applyThemeVariables = (theme: TenantThemeConfig): AppliedThemeVariables => {
  const root = document.documentElement;
  
  const colors: CSSVariableMap = {};
  const spacing: CSSVariableMap = {};
  const borderRadius: CSSVariableMap = {};
  const effects: CSSVariableMap = {};
  
  for (const [key, token] of Object.entries(theme.tokens.colors)) {
    if (token && typeof token === 'object' && 'value' in token) {
      colors[`--color-${key}`] = token.value;
      
      const hsl = token.hsl || hexToHsl(token.value);
      colors[`--color-${key}-h`] = hsl.h;
      colors[`--color-${key}-s`] = `${hsl.s}%`;
      colors[`--color-${key}-l`] = `${hsl.l}%`;
      colors[`--color-${key}-hsl`] = `${hsl.h} ${hsl.s}% ${hsl.l}%`;
    }
  }

  
  for (const [key, value] of Object.entries(theme.tokens.spacing)) {
    spacing[`--spacing-${key}`] = value;
  }
  
  for (const [key, value] of Object.entries(theme.tokens.borderRadius)) {
    borderRadius[`--radius-${key}`] = value;
  }
  
  if (theme.effects.glassmorphism?.enabled) {
    const glass = theme.effects.glassmorphism;
    effects['--glass-blur'] = glass.blur || '0px';
    effects['--glass-bg'] = glass.background || 'transparent';
    effects['--glass-border'] = glass.borderColor || 'transparent';
    effects['--glass-opacity'] = glass.opacity || 0;
  }
  
  if (theme.effects.neumorphism?.enabled) {
    const neu = theme.effects.neumorphism;
    effects['--neu-bg'] = neu.backgroundColor || 'transparent';
    effects['--neu-intensity'] = neu.intensity || 0;
    effects['--neu-distance'] = neu.distance || 0;
    effects['--neu-altitude'] = neu.altitude || 0;
    effects['--neu-radius'] = neu.borderRadius || '0px';
  }

  const components: CSSVariableMap = {};
  if (theme.components) {
    for (const [compName, config] of Object.entries(theme.components)) {
      if (config.style) {
        components[`--comp-${compName}-style`] = config.style;
      }
      if (config.customProperties) {
        for (const [prop, value] of Object.entries(config.customProperties)) {
          components[`--comp-${compName}-${prop}`] = String(value);
        }
      }
    }
  }
  
  requestAnimationFrame(() => {
    for (const [variable, value] of Object.entries(colors)) {
      root.style.setProperty(variable, String(value));
    }
    for (const [variable, value] of Object.entries(spacing)) {
      root.style.setProperty(variable, String(value));
    }
    for (const [variable, value] of Object.entries(borderRadius)) {
      root.style.setProperty(variable, String(value));
    }
    for (const [variable, value] of Object.entries(effects)) {
      root.style.setProperty(variable, String(value));
    }
    for (const [variable, value] of Object.entries(components)) {
      root.style.setProperty(variable, String(value));
    }
  });
  
  return { colors, spacing, borderRadius, effects, components };
};

export const removeThemeVariables = (...prefixes: string[]) => {
  const root = document.documentElement;
  
  for (const prefix of prefixes) {
    root.style.removeProperty(`--color-${prefix}`);
    root.style.removeProperty(`--spacing-${prefix}`);
    root.style.removeProperty(`--radius-${prefix}`);
    root.style.removeProperty(`--glass-${prefix}`);
    root.style.removeProperty(`--neu-${prefix}`);
  }
};

export const resetAllThemeVariables = () => {
  const root = document.documentElement;
  const styles = root.style;
  
  const propsToRemove: string[] = [];
  
  for (let i = styles.length - 1; i >= 0; i--) {
    const prop = styles[i];
    if (
      prop.startsWith('--color-') ||
      prop.startsWith('--spacing-') ||
      prop.startsWith('--radius-') ||
      prop.startsWith('--glass-') ||
      prop.startsWith('--neu-')
    ) {
      propsToRemove.push(prop);
    }
  }
  
  for (const prop of propsToRemove) {
    root.style.removeProperty(prop);
  }
};

export const getContrastColor = (hexColor: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColor);
  if (!result) return '#000000';
  
  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
};
