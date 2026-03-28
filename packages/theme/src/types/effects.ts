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

export interface BrutalismConfig {
  enabled: boolean;
  borderWidth: string;
  borderColor: string;
  shadowOffset: string;
  shadowColor: string;
  backgroundColor: string;
}

export interface BentoConfig {
  enabled: boolean;
  borderRadius: string;
  spacing: string;
  background: string;
  borderWidth: string;
  borderColor: string;
  shadow: string;
}

export interface ComputedNeumorphismShadow {
  lightShadow: string;
  darkShadow: string;
}

export interface OrganicConfig {
  enabled: boolean;
  curvature: number; // 0-100
  fluidity: number; // 0-100
  backgroundColor: string;
  borderColor: string;
  borderWidth: string;
}

export interface ImmersiveConfig {
  enabled: boolean;
  layers: number;
  depth: number;
  shadowColor: string;
  perspective: string;
  rotationX: string;
  rotationY: string;
}

export type EffectType = 'standard' | 'glass' | 'neu' | 'brutalism' | 'bento' | 'organic' | 'immersive';

export interface EffectConfig {
  globalType: EffectType;
  glassmorphism: GlassmorphismConfig;
  neumorphism: NeumorphismConfig;
  brutalism?: BrutalismConfig;
  bento?: BentoConfig;
  organic?: OrganicConfig;
  immersive?: ImmersiveConfig;
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

export const DEFAULT_BRUTALISM: BrutalismConfig = {
  enabled: false,
  borderWidth: '2px',
  borderColor: '#000000',
  shadowOffset: '4px',
  shadowColor: '#000000',
  backgroundColor: '#ffffff',
};

export const DEFAULT_BENTO: BentoConfig = {
  enabled: false,
  borderRadius: '24px',
  spacing: '1.5rem',
  background: 'rgba(255, 255, 255, 0.8)',
  borderWidth: '1px',
  borderColor: 'rgba(0, 0, 0, 0.05)',
  shadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
};

export const DEFAULT_ORGANIC: OrganicConfig = {
  enabled: false,
  curvature: 80,
  fluidity: 50,
  backgroundColor: '#ffffff',
  borderColor: 'transparent',
  borderWidth: '0px',
};

export const DEFAULT_IMMERSIVE: ImmersiveConfig = {
  enabled: false,
  layers: 3,
  depth: 20,
  shadowColor: 'rgba(0,0,0,0.2)',
  perspective: '1000px',
  rotationX: '0deg',
  rotationY: '0deg',
};

export const DEFAULT_EFFECT_CONFIG: EffectConfig = {
  globalType: 'standard',
  glassmorphism: DEFAULT_GLASSMORPHISM,
  neumorphism: DEFAULT_NEUMORPHISM,
  brutalism: DEFAULT_BRUTALISM,
  bento: DEFAULT_BENTO,
  organic: DEFAULT_ORGANIC,
  immersive: DEFAULT_IMMERSIVE,
};
