import styled from '@emotion/styled';
import { computeNeumorphismBoxShadow } from '../utils/computeEffects';
import type { NeumorphismConfig } from '../types';
import type { CSSProperties, ReactNode } from 'react';

export interface NeuCardProps {
  children: ReactNode;
  config?: NeumorphismConfig;
  backgroundColor?: string;
  borderRadius?: string;
  padding?: string;
  style?: CSSProperties;
  className?: string;
}

const StyledNeuCard = styled.div<Omit<NeuCardProps, 'children'>>`
  background: ${({ backgroundColor, config }) =>
    config?.backgroundColor || backgroundColor || '#e0e5ec'};
  border-radius: ${({ borderRadius, config }) =>
    config?.borderRadius || borderRadius || '12px'};
  padding: ${({ padding }) => padding || '1.5rem'};
  transition: all 0.3s ease;
  box-shadow: ${({ config }) =>
    computeNeumorphismBoxShadow(config || {
      enabled: true,
      backgroundColor: '#e0e5ec',
      intensity: 0.15,
      distance: 5,
      altitude: 10,
      borderRadius: '12px',
    })};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ config }) =>
      computeNeumorphismBoxShadow({
        ...(config || {
          enabled: true,
          backgroundColor: '#e0e5ec',
          intensity: 0.15,
          distance: 5,
          altitude: 10,
          borderRadius: '12px',
        }),
        distance: ((config?.distance || 5) + 2),
      })};
  }
`;

export const NeuCard: React.FC<NeuCardProps> = ({
  children,
  config,
  ...props
}) => {
  return (
    <StyledNeuCard config={config} {...props}>
      {children}
    </StyledNeuCard>
  );
};

export default NeuCard;
