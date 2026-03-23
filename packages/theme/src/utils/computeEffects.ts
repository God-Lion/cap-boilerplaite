import type { NeumorphismConfig, ComputedNeumorphismShadow } from '../types';

export const computeNeumorphismShadows = (
  config: NeumorphismConfig
): ComputedNeumorphismShadow => {
  const { intensity, distance, altitude } = config;
  
  const angleRad = ((360 - altitude + 90) * Math.PI) / 180;
  
  const x = Math.round(Math.cos(angleRad) * distance);
  const y = Math.round(Math.sin(angleRad) * distance);
  const blur = distance * 2;
  
  const lightShadow = `${x}px ${-y}px ${blur}px rgba(255, 255, 255, ${intensity})`;
  const darkShadow = `${-x}px ${y}px ${blur}px rgba(0, 0, 0, ${intensity * 0.4})`;
  
  return { lightShadow, darkShadow };
};

export const computeNeumorphismBoxShadow = (
  config: NeumorphismConfig,
  isPressed = false
): string => {
  if (!config.enabled) {
    return '0 2px 8px rgba(0, 0, 0, 0.1)';
  }
  
  const { lightShadow, darkShadow } = computeNeumorphismShadows(config);
  
  if (isPressed) {
    return `inset ${lightShadow}, inset ${darkShadow}`;
  }
  
  return `${lightShadow}, ${darkShadow}`;
};

export const getGlassmorphismStyles = (config: {
  blur?: string;
  background?: string;
  borderColor?: string;
  borderWidth?: string;
  opacity?: number;
}) => {
  const {
    blur = '16px',
    background = 'rgba(255, 255, 255, 0.1)',
    borderColor = 'rgba(255, 255, 255, 0.2)',
    borderWidth = '1px',
    opacity = 0.8,
  } = config;
  
  return {
    background: background,
    backdropFilter: `blur(${blur})`,
    WebkitBackdropFilter: `blur(${blur})`,
    border: `${borderWidth} solid ${borderColor}`,
    opacity: opacity,
  };
};

export const interpolateColor = (color1: string, color2: string, factor: number): string => {
  const hex1 = color1.replace('#', '');
  const hex2 = color2.replace('#', '');
  
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

export const lightenColor = (hex: string, percent: number): string => {
  const factor = percent / 100;
  const white = '#ffffff';
  return interpolateColor(hex, white, factor);
};

export const darkenColor = (hex: string, percent: number): string => {
  const factor = percent / 100;
  const black = '#000000';
  return interpolateColor(hex, black, factor);
};
