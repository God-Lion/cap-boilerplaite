import type { PrimitiveTokens } from './designTokens';
import type { EffectConfig } from './effects';
import type { ComponentStyles } from './componentStyles';

export type ThemePresetId = 
  | 'modern-glass'
  | 'soft-neumorphism'
  | 'minimal-dark'
  | 'corporate-blue'
  | 'vibrant-gradient'
  | 'godlio-obsidian'
  | 'vibrant-premium'
  | 'default';


export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  description: string;
  preview: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
  };
  tokens: Partial<PrimitiveTokens>;
  effects: Partial<EffectConfig>;
  components: Partial<ComponentStyles>;
}

export const THEME_PRESETS: Record<ThemePresetId, ThemePreset> = {
  default: {
    id: 'default',
    name: 'Default',
    description: 'Clean, minimal design with subtle shadows',
    preview: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      backgroundColor: '#f8fafc',
    },
    tokens: {},
    effects: {
      globalType: 'standard',
    },
    components: {},
  },
  'modern-glass': {
    id: 'modern-glass',
    name: 'Modern Glass',
    description: 'Elegant glassmorphism with blur effects and transparency',
    preview: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#6366f1',
      backgroundColor: '#0f172a',
    },
    tokens: {
      colors: {
        primary: { value: '#8b5cf6', description: 'Purple primary' },
        secondary: { value: '#6366f1', description: 'Indigo secondary' },
        background: { value: '#0f172a', description: 'Dark slate background' },
        surface: { value: 'rgba(30, 41, 59, 0.8)', description: 'Glass surface' },
        text: { value: '#f8fafc', description: 'Light text' },
        textMuted: { value: '#94a3b8', description: 'Muted text' },
        border: { value: 'rgba(255, 255, 255, 0.1)', description: 'Subtle border' },
        success: { value: '#22c55e', description: 'Success color' },
        warning: { value: '#f59e0b', description: 'Warning color' },
        error: { value: '#ef4444', description: 'Error color' },
        info: { value: '#3b82f6', description: 'Info color' },
      },
    },
    effects: {
      globalType: 'glass',
      glassmorphism: {
        enabled: true,
        blur: '16px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: '1px',
        opacity: 0.9,
      },
    },
    components: {},
  },
  'soft-neumorphism': {
    id: 'soft-neumorphism',
    name: 'Soft Neumorphism',
    description: 'Subtle 3D effect with soft shadows and gentle gradients',
    preview: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      backgroundColor: '#e0e5ec',
    },
    tokens: {
      colors: {
        primary: { value: '#6366f1', description: 'Soft purple primary' },
        secondary: { value: '#8b5cf6', description: 'Soft indigo secondary' },
        background: { value: '#e0e5ec', description: 'Soft gray background' },
        surface: { value: '#e0e5ec', description: 'Same as background' },
        text: { value: '#374151', description: 'Dark gray text' },
        textMuted: { value: '#6b7280', description: 'Muted text' },
        border: { value: '#d1d5db', description: 'Subtle border' },
        success: { value: '#22c55e', description: 'Success color' },
        warning: { value: '#f59e0b', description: 'Warning color' },
        error: { value: '#ef4444', description: 'Error color' },
        info: { value: '#3b82f6', description: 'Info color' },
      },
    },
    effects: {
      globalType: 'neu',
      neumorphism: {
        enabled: true,
        backgroundColor: '#e0e5ec',
        intensity: 0.15,
        distance: 5,
        altitude: 10,
        borderRadius: '12px',
      },
    },
    components: {},
  },
  'minimal-dark': {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    description: 'High contrast dark theme with neon accents',
    preview: {
      primaryColor: '#22d3ee',
      secondaryColor: '#a855f7',
      backgroundColor: '#09090b',
    },
    tokens: {
      colors: {
        primary: { value: '#22d3ee', description: 'Cyan neon accent' },
        secondary: { value: '#a855f7', description: 'Purple neon accent' },
        background: { value: '#09090b', description: 'Near black background' },
        surface: { value: '#18181b', description: 'Elevated surface' },
        text: { value: '#fafafa', description: 'Bright white text' },
        textMuted: { value: '#71717a', description: 'Muted gray text' },
        border: { value: '#27272a', description: 'Subtle border' },
        success: { value: '#22c55e', description: 'Success color' },
        warning: { value: '#f59e0b', description: 'Warning color' },
        error: { value: '#ef4444', description: 'Error color' },
        info: { value: '#3b82f6', description: 'Info color' },
      },
    },
    effects: {
      globalType: 'standard',
    },
    components: {},
  },
  'corporate-blue': {
    id: 'corporate-blue',
    name: 'Corporate Blue',
    description: 'Professional navy and white theme for enterprise applications',
    preview: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      backgroundColor: '#f1f5f9',
    },
    tokens: {
      colors: {
        primary: { value: '#1e40af', description: 'Deep navy blue' },
        secondary: { value: '#3b82f6', description: 'Bright blue' },
        background: { value: '#f1f5f9', description: 'Light gray background' },
        surface: { value: '#ffffff', description: 'White surface' },
        text: { value: '#0f172a', description: 'Dark text' },
        textMuted: { value: '#64748b', description: 'Muted text' },
        border: { value: '#cbd5e1', description: 'Light border' },
        success: { value: '#22c55e', description: 'Success color' },
        warning: { value: '#f59e0b', description: 'Warning color' },
        error: { value: '#ef4444', description: 'Error color' },
        info: { value: '#3b82f6', description: 'Info color' },
      },
    },
    effects: {
      globalType: 'standard',
    },
    components: {},
  },
  'vibrant-gradient': {
    id: 'vibrant-gradient',
    name: 'Vibrant Gradient',
    description: 'Bold colors with gradient accents for creative applications',
    preview: {
      primaryColor: '#ec4899',
      secondaryColor: '#8b5cf6',
      backgroundColor: '#fdf4ff',
    },
    tokens: {
      colors: {
        primary: { value: '#ec4899', description: 'Pink primary' },
        secondary: { value: '#8b5cf6', description: 'Purple secondary' },
        background: { value: '#fdf4ff', description: 'Light pink background' },
        surface: { value: '#ffffff', description: 'White surface' },
        text: { value: '#581c87', description: 'Deep purple text' },
        textMuted: { value: '#a855f7', description: 'Light purple muted' },
        border: { value: '#e9d5ff', description: 'Light purple border' },
        success: { value: '#22c55e', description: 'Success color' },
        warning: { value: '#f59e0b', description: 'Warning color' },
        error: { value: '#ef4444', description: 'Error color' },
        info: { value: '#3b82f6', description: 'Info color' },
      },
    },
    effects: {
      globalType: 'standard',
    },
    components: {},
  },
  'godlio-obsidian': {
    id: 'godlio-obsidian',
    name: 'Godlio Obsidian',
    description: 'Ultra-premium dark theme with deep obsidian tones and glassmorphism',
    preview: {
      primaryColor: '#635bff',
      secondaryColor: '#00d4ff',
      backgroundColor: '#050505',
    },
    tokens: {
      colors: {
        primary: { value: '#635bff', description: 'Vibrant indigo accent' },
        secondary: { value: '#00d4ff', description: 'Electric cyan accent' },
        background: { value: '#050505', description: 'Obsidian black' },
        surface: { value: 'rgba(15, 15, 15, 0.7)', description: 'Translucent obsidian' },
        text: { value: '#ffffff', description: 'Pure white' },
        textMuted: { value: 'rgba(255, 255, 255, 0.6)', description: 'Subtle light' },
        border: { value: 'rgba(255, 255, 255, 0.08)', description: 'Razor thin border' },
        success: { value: '#00ffa3', description: 'Electric green' },
        warning: { value: '#ffb800', description: 'Gold warning' },
        error: { value: '#ff4d4d', description: 'Vivid error' },
        info: { value: '#00d4ff', description: 'Info cyan' },
      },
    },
    effects: {
      globalType: 'glass',
      glassmorphism: {
        enabled: true,
        blur: '24px',
        background: 'rgba(10, 10, 10, 0.6)',
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: '1px',
        opacity: 0.95,
      },
    },
    components: {},
  },
  'vibrant-premium': {
    id: 'vibrant-premium',
    name: 'Vibrant Premium',
    description: 'Dynamic and energetic theme with rich gradients and micro-interactions',
    preview: {
      primaryColor: '#ff0080',
      secondaryColor: '#7928ca',
      backgroundColor: '#ffffff',
    },
    tokens: {
      colors: {
        primary: { value: '#ff0080', description: 'Vibrant pink' },
        secondary: { value: '#7928ca', description: 'Deep purple' },
        background: { value: '#ffffff', description: 'Clean white' },
        surface: { value: '#f9fafb', description: 'Subtle surface' },
        text: { value: '#111827', description: 'Rich dark text' },
        textMuted: { value: '#6b7280', description: 'Muted gray' },
        border: { value: '#e5e7eb', description: 'Light border' },
        success: { value: '#10b981', description: 'Emerald success' },
        warning: { value: '#f59e0b', description: 'Amber warning' },
        error: { value: '#ef4444', description: 'Red error' },
        info: { value: '#3b82f6', description: 'Blue info' },
      },
    },
    effects: {
      globalType: 'standard',
    },
    components: {},
  },
};


export const PRESET_LIST = Object.values(THEME_PRESETS);
