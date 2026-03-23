import styled from '@emotion/styled';
import type { CSSProperties, ReactNode } from 'react';

export interface GlassCardProps {
  children: ReactNode;
  blur?: string;
  background?: string;
  borderColor?: string;
  borderWidth?: string;
  opacity?: number;
  borderRadius?: string;
  padding?: string;
  style?: CSSProperties;
  className?: string;
}

const StyledGlassCard = styled.div<Omit<GlassCardProps, 'children'>>`
  background: ${({ background }) => background || 'var(--glass-bg, rgba(255, 255, 255, 0.05))'};
  backdrop-filter: blur(${({ blur }) => blur || 'var(--glass-blur, 16px)'});
  -webkit-backdrop-filter: blur(${({ blur }) => blur || 'var(--glass-blur, 16px)'});
  border: ${({ borderWidth, borderColor }) =>
    `${borderWidth || 'var(--glass-border-width, 1px)'} solid ${borderColor || 'var(--glass-border, rgba(255, 255, 255, 0.1))'}`};
  border-radius: ${({ borderRadius }) => borderRadius || 'var(--radius-lg, 12px)'};
  padding: ${({ padding }) => padding || '1.5rem'};
  opacity: ${({ opacity }) => opacity ?? 'var(--glass-opacity, 1)'};
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  position: relative;
  overflow: hidden;

  /* Custom component style injection */
  ${({ style }) => (style as any)?.['--comp-card-style'] || 'var(--comp-card-style, "")'};

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    opacity: 0.1;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 48px 0 rgba(0, 0, 0, 0.5);
    border-color: var(--glass-border-hover, rgba(255, 255, 255, 0.2));
  }
`;


export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  ...props
}) => {
  return (
    <StyledGlassCard {...props}>
      {children}
    </StyledGlassCard>
  );
};

export default GlassCard;
