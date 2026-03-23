import type { EffectType } from './effects';

export type ComponentEffectStyle = 'global' | EffectType;

export interface ComponentStyleOverrides {
  borderRadius?: string;
  padding?: string;
  margin?: string;
  shadow?: string;
  background?: string;
  borderColor?: string;
}

export interface ComponentStyleConfig {
  style: ComponentEffectStyle;
  customProperties?: ComponentStyleOverrides;
}

export interface ComponentStyles {
  button: ComponentStyleConfig;
  card: ComponentStyleConfig;
  input: ComponentStyleConfig;
  navbar: ComponentStyleConfig;
  footer: ComponentStyleConfig;
  modal: ComponentStyleConfig;
  drawer: ComponentStyleConfig;
}

export const DEFAULT_COMPONENT_STYLES: ComponentStyles = {
  button: { style: 'global' },
  card: { style: 'global' },
  input: { style: 'global' },
  navbar: { style: 'global' },
  footer: { style: 'global' },
  modal: { style: 'global' },
  drawer: { style: 'global' },
};
