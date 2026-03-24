import { GlobalStyles as MuiGlobalStyles } from '@mui/material';
import type { Theme } from '@mui/material/styles';

const GlobalStyles = () => {
  return (
    <MuiGlobalStyles
      styles={(theme: Theme) => ({
        ':root': {
          '--glass-bg': theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.02)',
          '--glass-border': theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.08)',
          '--premium-shadow': theme.palette.mode === 'light' ? '0 8px 32px 0 rgba(31, 38, 135, 0.15)' : '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
          '--premium-gradient': 'linear-gradient(135deg, hsla(240, 100%, 70%, 0.1) 0%, hsla(280, 100%, 70%, 0.1) 100%)',
        },
        '.glass-effect': {
          backdropFilter: 'blur(24px) saturate(200%) !important',
          WebkitBackdropFilter: 'blur(24px) saturate(200%) !important',
          backgroundColor: 'var(--glass-bg) !important',
          backgroundImage: 'none !important',
          border: '1px solid var(--glass-border) !important',
          boxShadow: 'var(--premium-shadow) !important',
        },
        '@keyframes scaleIn': {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        '@keyframes slideInRight': {
          '0%': { transform: 'translateX(-10px)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        '.animate-scale-in': {
          animation: 'scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.animate-slide-in': {
          animation: 'slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        '.premium-menu-item': {
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important',
          '&:hover': {
            background: 'var(--premium-gradient) !important',
            transform: 'translateX(4px)',
            '& .tabler-icon, & i': {
              transform: 'scale(1.1)',
              color: theme.palette.primary.main + ' !important',
            },
          },
        },
        '.premium-auth-container': {
          '& .MuiButton-contained': {
            backdropFilter: 'blur(12px) saturate(150%) !important',
            WebkitBackdropFilter: 'blur(12px) saturate(150%) !important',
            boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.08) !important',
            border: '1px solid var(--glass-border) !important',
            transition: 'all 0.2s ease-in-out !important',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.15) !important',
            },
          },
          '& .MuiButton-containedPrimary': {
            //@ts-ignore
            background: `rgba(${theme.palette.primary.mainChannel || '212 175 55'} / 0.15) !important`,
            color: theme.palette.primary.main + ' !important',
            '&:hover': {
              //@ts-ignore
              background: `rgba(${theme.palette.primary.mainChannel || '212 175 55'} / 0.25) !important`,
            },
          },
          '& .MuiButton-containedInfo': {
            //@ts-ignore
            background: `rgba(${theme.palette.info.mainChannel || '47 79 79'} / 0.15) !important`,
            color: theme.palette.info.main + ' !important',
            '&:hover': {
              //@ts-ignore
              background: `rgba(${theme.palette.info.mainChannel || '47 79 79'} / 0.25) !important`,
            },
          },
          '& .MuiButton-containedError': {
            //@ts-ignore
            background: `rgba(${theme.palette.error.mainChannel || '220 53 69'} / 0.15) !important`,
            color: theme.palette.error.main + ' !important',
            '&:hover': {
              //@ts-ignore
              background: `rgba(${theme.palette.error.mainChannel || '220 53 69'} / 0.25) !important`,
            },
          },
          '& .MuiButton-containedSuccess': {
            //@ts-ignore
            background: `rgba(${theme.palette.success.mainChannel || '40 167 69'} / 0.15) !important`,
            color: theme.palette.success.main + ' !important',
            '&:hover': {
              //@ts-ignore
              background: `rgba(${theme.palette.success.mainChannel || '40 167 69'} / 0.25) !important`,
            },
          },
        },
      })}
    />
  );
};

export default GlobalStyles;
