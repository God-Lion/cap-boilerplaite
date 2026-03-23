import React from 'react';
import { Box, Card, CardContent, Typography, Stack, Chip } from '@mui/material';
import type { IdentityPathType } from '../../../domain-kernel/src/types/KycProfile';
import { PATH_LABELS, PATH_DESCRIPTIONS } from '../services/path-detection.service';

interface PathSelectorProps {
  selectedPath: IdentityPathType | null;
  onSelect: (path: IdentityPathType) => void;
  availablePaths?: IdentityPathType[];
}

const PATH_COLORS: Record<IdentityPathType, 'success' | 'primary' | 'info' | 'warning' | 'secondary'> = {
  SSN_CITIZEN: 'success',
  DIGITAL_ID_HOLDER: 'success',
  FOREIGN_NATIONAL: 'primary',
  REFUGEE: 'info',
  ASYLUM_SEEKER: 'warning',
  STATELESS_PERSON: 'warning',
  UNDOCUMENTED: 'secondary',
  MINOR_GUARDIAN: 'primary',
  CORPORATE_ENTITY: 'primary',
};

const PATH_ICONS: Record<IdentityPathType, React.ReactNode> = {
  SSN_CITIZEN: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
    </svg>
  ),
  DIGITAL_ID_HOLDER: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
    </svg>
  ),
  FOREIGN_NATIONAL: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
    </svg>
  ),
  REFUGEE: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    </svg>
  ),
  ASYLUM_SEEKER: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
    </svg>
  ),
  STATELESS_PERSON: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
    </svg>
  ),
  UNDOCUMENTED: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C11.45 12.9 11 13.5 11 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
    </svg>
  ),
  MINOR_GUARDIAN: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z"/>
    </svg>
  ),
  CORPORATE_ENTITY: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/>
    </svg>
  ),
};

const ALL_PATHS: IdentityPathType[] = [
  'SSN_CITIZEN',
  'DIGITAL_ID_HOLDER',
  'FOREIGN_NATIONAL',
  'REFUGEE',
  'ASYLUM_SEEKER',
  'RESIDENCE_PERMIT' as IdentityPathType,
  'STATELESS_PERSON',
  'UNDOCUMENTED',
];

export const PathSelector: React.FC<PathSelectorProps> = ({
  selectedPath,
  onSelect,
  availablePaths = ALL_PATHS,
}) => {
  return (
    <Box>
      <Stack spacing={2}>
        {availablePaths.map((path) => (
          <Card
            key={path}
            onClick={() => onSelect(path)}
            sx={{
              cursor: 'pointer',
              border: 2,
              borderColor: selectedPath === path ? `${PATH_COLORS[path]}.main` : 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: `${PATH_COLORS[path]}.main`,
                transform: 'translateY(-2px)',
                boxShadow: 4,
              },
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ color: `${PATH_COLORS[path]}.main` }}>
                  {PATH_ICONS[path]}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {PATH_LABELS[path]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {PATH_DESCRIPTIONS[path]}
                  </Typography>
                </Box>
                {selectedPath === path && (
                  <Chip label="Selected" color="success" size="small" />
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default PathSelector;
