export interface GlassmorphismConfig {
  enabled: boolean;
  blur: string;
  background: string;
  borderColor: string;
  borderWidth: string;
  opacity: number;
}

export interface NeumorphismConfig {
  enabled: boolean;
  backgroundColor: string;
  intensity: number;
  distance: number;
  altitude: number;
  borderRadius: string;
}

export interface ComputedNeumorphismShadow {
  lightShadow: string;
  darkShadow: string;
}

export type EffectType = 'standard' | 'glass' | 'neu';

export interface EffectConfig {
  globalType: EffectType;
  glassmorphism: GlassmorphismConfig;
  neumorphism: NeumorphismConfig;
}

export const DEFAULT_GLASSMORPHISM: GlassmorphismConfig = {
  enabled: false,
  blur: '16px',
  background: 'rgba(255, 255, 255, 0.1)',
  borderColor: 'rgba(255, 255, 255, 0.2)',
  borderWidth: '1px',
  opacity: 0.8,
};

export const DEFAULT_NEUMORPHISM: NeumorphismConfig = {
  enabled: false,
  backgroundColor: '#e0e5ec',
  intensity: 0.15,
  distance: 5,
  altitude: 10,
  borderRadius: '12px',
};

export const DEFAULT_EFFECT_CONFIG: EffectConfig = {
  globalType: 'standard',
  glassmorphism: DEFAULT_GLASSMORPHISM,
  neumorphism: DEFAULT_NEUMORPHISM,
};
