import React from 'react';
import { GlassButton } from './GlassButton';
import { NeuButton } from './NeuButton';
import type { ComponentEffectStyle } from '../types';
import type { EffectType } from '../types';

export interface AdaptiveButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  effectStyle?: ComponentEffectStyle;
  globalEffectType?: EffectType;
  glassConfig?: React.ComponentProps<typeof GlassButton>;
  neuConfig?: React.ComponentProps<typeof NeuButton>;
  variant?: 'primary' | 'secondary' | 'outline' | 'flat';
}

const StandardButton = styled.button<{
  variant?: string;
  className?: string;
  style?: React.CSSProperties;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: var(--color-primary, #6366f1);
          color: white;
          border: none;
          box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);

          &:hover:not(:disabled) {
            background: var(--color-primary, #4f46e5);
            transform: translateY(-1px);
          }
        `;
      case 'secondary':
        return `
          background: var(--color-secondary, #8b5cf6);
          color: white;
          border: none;
          box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);

          &:hover:not(:disabled) {
            background: var(--color-secondary, #7c3aed);
            transform: translateY(-1px);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: var(--color-primary, #6366f1);
          border: 1px solid var(--color-primary, #6366f1);

          &:hover:not(:disabled) {
            background: rgba(99, 102, 241, 0.1);
          }
        `;
      default:
        return `
          background: var(--color-surface, #ffffff);
          color: var(--color-text, #0f172a);
          border: 1px solid var(--color-border, #e2e8f0);

          &:hover:not(:disabled) {
            background: var(--color-background, #f8fafc);
            border-color: var(--color-primary, #6366f1);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:focus-visible {
    outline: 2px solid var(--color-primary, #6366f1);
    outline-offset: 2px;
  }
`;

import styled from '@emotion/styled';

export const AdaptiveButton: React.FC<AdaptiveButtonProps> = ({
  children,
  effectStyle = 'global',
  globalEffectType = 'standard',
  glassConfig,
  neuConfig,
  variant = 'primary',
  className,
  style,
  ...props
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
        <GlassButton
          variant={variant as 'primary' | 'secondary' | 'outline'}
          {...glassConfig}
          className={className}
          style={style}
          {...props}
        >
          {children}
        </GlassButton>
      );
    case 'neu':
      return (
        <NeuButton
          variant={variant as 'primary' | 'secondary' | 'flat'}
          {...neuConfig}
          className={className}
          style={style}
          {...props}
        >
          {children}
        </NeuButton>
      );
    default:
      return (
        <StandardButton
          variant={variant}
          className={className}
          style={style}
          {...props}
        >
          {children}
        </StandardButton>
      );
  }
};

export default AdaptiveButton;
