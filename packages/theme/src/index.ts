export * from './components/mui';

export * from './types';
export * from './assets/themes/definitions/menuClasses';
export { default as typography } from './assets/themes/definitions/typography';
export * from './utils';
export * from './hooks';
export * from './styled';
export * from './styles';

export * from './assets';

export { TenantThemeProvider, useTenantThemeContext, useTenantThemeState, useTenantThemeStatus, useTenantThemeActions } from './context/TenantThemeContext';
export { DesignSystemProvider } from './context/DesignSystemProvider';
export { ThemeSettingsProvider, useThemeSettings } from './context/ThemeSettingsContext';


// Theme & Style Exports
export * from './assets/themes';
export { default as AppReactApexCharts } from './styles/wrappers/AppReactApexCharts';
export { default as AppReactToastify } from './styles/wrappers/AppReactToastify';
export { default as AppRecharts } from './styles/wrappers/AppRecharts';
export { default as AppReactDropzone } from './styles/wrappers/AppReactDropzone';
export { default as coreOverrides } from './overrides/core-overrides';

// Re-export MUI components from local (theme-related)


// UI Components re-exported from @cap/layout for backward compatibility
// These are now located in @cap/layout for proper separation of concerns
export {
  CustomInputVertical,
  CustomInputHorizontal,
  CustomInputImage,
  OptionMenu,
  DashboardItem,
  DirectionalIcon,
  DropZone,
  Empty,
  ErrorBoundary,
  Icon,
  Loading,
  PhoneInput,
  StyledMenu,
} from '@cap/layout/components/ui';

export * from '@cap/layout/components/ui/common';
export * from '@cap/layout/components/ui/pwa';
export { default as AppReactTable } from '@cap/layout/components/ui/react-table';
export { default as Table } from '@cap/layout/components/ui/table/Table';
export * from '@cap/layout/components/ui/table/types';
export * from '@cap/layout/components/ui/virtualized';
