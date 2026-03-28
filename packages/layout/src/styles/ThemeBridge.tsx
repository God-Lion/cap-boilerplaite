import React from 'react';
import GlobalStyles from '@mui/material/GlobalStyles';

/**
 * ThemeBridge injects CSS custom properties that bridge the gap between
 * the @cap/theme engine (emits --color-*, --radius-*, etc.) and the
 * @cap/layout package (expects --border-color, --border-radius, etc.).
 */
const ThemeBridge = () => (
  <GlobalStyles
    styles={{
      ':root': {
        // Core Layout Variables
        '--border-color': 'var(--color-border)',
        '--border-radius': 'var(--radius-md)',

        // Derived Background Variables
        '--background-color-rgb': 'var(--color-background-h) var(--color-background-s) var(--color-background-l)',
        '--backdrop-color': 'hsl(var(--color-background-h) var(--color-background-s) var(--color-background-l) / 0.6)',

        // Z-Index Layers (Source of Truth)
        '--header-z-index': 'var(--z-index-app-bar, 1100)',
        '--drawer-z-index': 'var(--z-index-drawer, 1200)',
        '--footer-z-index': '1050',
        '--z-behind': '-1',

        // Layout Constants
        '--header-height': '64px',
      },
    }}
  />
);

export default ThemeBridge;
