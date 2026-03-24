import { Theme } from '@mui/material/styles';

export const MuiTableOverrides = (theme: Theme) => ({
  MuiTable: {
    styleOverrides: {
      root: {
        inlineSize: '100%',
        borderCollapse: 'separate' as const,
        fontSize: '0.8125rem',
        whiteSpace: 'nowrap',
        border: `1px solid ${theme.palette.divider}`,
      },
    },
  },
  MuiTableBody: {
    styleOverrides: {
      root: {
        '& .MuiTableRow-root:last-child .MuiTableCell-root': {
          borderBottom: 0,
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: '12px 16px',
        borderBottom: `1px solid ${theme.palette.divider}`,
        borderRight: `1px solid ${theme.palette.divider}`,
        '&:last-child': {
          borderRight: 0,
        },
      },
      head: {
        fontWeight: 600,
        backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      },
    },
  },
});
