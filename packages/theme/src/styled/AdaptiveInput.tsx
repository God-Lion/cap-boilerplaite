import React from 'react';
import styled from '@emotion/styled';
import type { ComponentEffectStyle } from '../types';
import type { EffectType } from '../types';

export interface AdaptiveInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  effectStyle?: ComponentEffectStyle;
  globalEffectType?: EffectType;
  label?: string;
  helperText?: string;
  error?: boolean;
}

const GlassInputWrapper = styled.div`
  position: relative;
`;

const GlassInput = styled.input`
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.95);
  transition: all 0.2s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(139, 92, 246, 0.8);
    box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const NeuInputWrapper = styled.div`
  position: relative;
`;

const NeuInput = styled.input`
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  background: #e0e5ec;
  border: none;
  border-radius: 8px;
  color: #374151;
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.1), inset -4px -4px 8px rgba(255, 255, 255, 0.8);
  transition: all 0.2s ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.1), inset -2px -2px 4px rgba(255, 255, 255, 0.8);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StandardInputWrapper = styled.div`
  position: relative;
`;

const StandardInput = styled.input`
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  background: var(--color-surface, #ffffff);
  border: 1px solid var(--color-border, #e2e8f0);
  border-radius: 8px;
  color: var(--color-text, #0f172a);
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--color-text-muted, #64748b);
  }

  &:focus {
    outline: none;
    border-color: var(--color-primary, #6366f1);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--color-background, #f8fafc);
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text, #0f172a);
  margin-bottom: 0.5rem;
`;

const HelperText = styled.span`
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-muted, #64748b);
  margin-top: 0.25rem;
`;

const ErrorText = styled.span`
  display: block;
  font-size: 0.75rem;
  color: var(--color-error, #ef4444);
  margin-top: 0.25rem;
`;

export const AdaptiveInput: React.FC<AdaptiveInputProps> = ({
  children,
  effectStyle = 'global',
  globalEffectType = 'standard',
  label,
  helperText,
  error,
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

  const renderInput = (InputComponent: typeof StandardInput, inputStyle?: React.CSSProperties) => (
    <InputComponent
      className={className}
      style={inputStyle}
      {...props}
    />
  );

  const inputProps = { ...props };

  const renderContent = () => {
    switch (activeStyle) {
      case 'glass':
        return (
          <GlassInputWrapper>
            {label && <Label>{label}</Label>}
            {renderInput(GlassInput, style)}
            {error ? (
              <ErrorText>{helperText}</ErrorText>
            ) : helperText ? (
              <HelperText>{helperText}</HelperText>
            ) : null}
          </GlassInputWrapper>
        );
      case 'neu':
        return (
          <NeuInputWrapper>
            {label && <Label style={{ color: '#374151' }}>{label}</Label>}
            {renderInput(NeuInput, style)}
            {error ? (
              <ErrorText style={{ color: '#ef4444' }}>{helperText}</ErrorText>
            ) : helperText ? (
              <HelperText style={{ color: '#6b7280' }}>{helperText}</HelperText>
            ) : null}
          </NeuInputWrapper>
        );
      default:
        return (
          <StandardInputWrapper>
            {label && <Label>{label}</Label>}
            {renderInput(StandardInput, style)}
            {error ? (
              <ErrorText>{helperText}</ErrorText>
            ) : helperText ? (
              <HelperText>{helperText}</HelperText>
            ) : null}
          </StandardInputWrapper>
        );
    }
  };

  return renderContent();
};

export default AdaptiveInput;
