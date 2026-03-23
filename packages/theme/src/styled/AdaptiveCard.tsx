import React from 'react';
import { GlassCard } from './GlassCard';
import { NeuCard } from './NeuCard';
import type { ComponentEffectStyle, ComponentStyleConfig } from '../types';
import type { EffectType } from '../types';

export interface AdaptiveCardProps {
  children: React.ReactNode;
  effectStyle?: ComponentEffectStyle;
  globalEffectType?: EffectType;
  glassConfig?: React.ComponentProps<typeof GlassCard>;
  neuConfig?: React.ComponentProps<typeof NeuCard>;
  className?: string;
  style?: React.CSSProperties;
}

const StandardCard = styled.div<{ className?: string; style?: React.CSSProperties }>`
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: var(--radius-lg, 12px);
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

import styled from '@emotion/styled';

export const AdaptiveCard: React.FC<AdaptiveCardProps> = ({
  children,
  effectStyle = 'global',
  globalEffectType = 'standard',
  glassConfig,
  neuConfig,
  className,
  style,
}) => {
  const getActiveStyle = (): ComponentEffectStyle => {
    if (effectStyle === 'global') {
      return globalEffectType;
    }
    return effectStyle as EffectType;
  };

  const activeStyle = getActiveStyle();

  switch (activeStyle) {
    case 'glass':
      return (
        <GlassCard
          {...glassConfig}
          className={className}
          style={style}
        >
          {children}
        </GlassCard>
      );
    case 'neu':
      return (
        <NeuCard
          {...neuConfig}
          className={className}
          style={style}
        >
          {children}
        </NeuCard>
      );
    default:
      return (
        <StandardCard className={className} style={style}>
          {children}
        </StandardCard>
      );
  }
};

export default AdaptiveCard;
