import styled from '@emotion/styled';
import type { CSSProperties, ReactNode } from 'react';

export interface GlassButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  blur?: string;
  background?: string;
  borderColor?: string;
  borderRadius?: string;
  padding?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  style?: CSSProperties;
  className?: string;
}

const getVariantStyles = (variant: string = 'primary') => {
  switch (variant) {
    case 'primary':
      return `
        background: var(--glass-bg, rgba(255, 255, 255, 0.1));
        border-color: var(--glass-border, rgba(255, 255, 255, 0.2));
        color: var(--color-text, #ffffff);
        &:hover {
          background: var(--glass-bg-hover, rgba(255, 255, 255, 0.15));
          border-color: var(--glass-border-hover, rgba(255, 255, 255, 0.3));
        }
      `;
    case 'secondary':
      return `
        background: rgba(255, 255, 255, 0.05);
        border-color: rgba(255, 255, 255, 0.1);
        color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--color-text, #ffffff);
        }
      `;
    case 'outline':
      return `
        background: transparent;
        border-color: var(--glass-border, rgba(255, 255, 255, 0.2));
        color: var(--color-text, #ffffff);
        &:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: var(--glass-border-hover, rgba(255, 255, 255, 0.3));
        }
      `;
    case 'ghost':
      return `
        background: transparent;
        border-color: transparent;
        color: var(--color-text-muted, rgba(255, 255, 255, 0.7));
        &:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-text, #ffffff);
        }
      `;
    default:
      return '';
  }
};

const StyledGlassButton = styled.button<Omit<GlassButtonProps, 'children'>>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: var(--font-sans, inherit);
  font-weight: 500;
  font-size: 0.875rem;
  backdrop-filter: blur(${({ blur }) => blur || 'var(--glass-blur, 16px)'});
  -webkit-backdrop-filter: blur(${({ blur }) => blur || 'var(--glass-blur, 16px)'});
  border: 1px solid;
  border-radius: ${({ borderRadius }) => borderRadius || 'var(--radius-md, 8px)'};
  padding: ${({ padding }) => padding || '0.5rem 1rem'};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  
  ${({ variant }) => getVariantStyles(variant)}

  /* Custom component style injection */
  ${({ style }) => (style as any)?.['--comp-button-style'] || 'var(--comp-button-style, "")'};

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  ...props
}) => {
  return (
    <StyledGlassButton {...props}>
      {children}
    </StyledGlassButton>
  );
};

export default GlassButton;
