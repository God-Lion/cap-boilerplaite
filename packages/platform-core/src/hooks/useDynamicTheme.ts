import { useMemo } from 'react'
import { useTenant } from '../contexts/tenantContext'
import type { TenantTheme, TenantLayout } from '../types/tenant'

export interface DynamicThemeConfig {
  theme: TenantTheme
  layout: TenantLayout
  userTheme?: 'light' | 'dark' | 'system'
}

export const useDynamicTheme = (): DynamicThemeConfig | null => {
  const { tenant, userPreferences } = useTenant()
  
  return useMemo(() => {
    if (!tenant) return null
    
    const effectiveTheme = {
      ...tenant.theme,
      mode: userPreferences.theme || tenant.theme.mode,
    }
    
    return {
      theme: effectiveTheme,
      layout: tenant.layout,
      userTheme: userPreferences.theme,
    }
  }, [tenant, userPreferences.theme])
}

export const getThemeColors = (theme: TenantTheme) => {
  return {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    error: theme.colors.error,
    success: theme.colors.success,
    warning: theme.colors.warning,
    info: theme.colors.info,
    brandGold: theme.colors.brandGold,
    brandBrown: theme.colors.brandBrown,
    brandSlate: theme.colors.brandSlate,
    brandCream: theme.colors.brandCream,
  }
}

export const getLayoutConfig = (layout: TenantLayout) => {
  return {
    layout: layout.layout,
    layoutPadding: layout.layoutPadding,
    compactContentWidth: layout.compactContentWidth,
    navbar: layout.navbar,
    footer: layout.footer,
    contentWidth: layout.contentWidth,
    disableRipple: layout.disableRipple,
    toastPosition: layout.toastPosition,
  }
}

export const getTypographyConfig = (theme: TenantTheme) => {
  return theme.typography
}

export const getShapeConfig = (theme: TenantTheme) => {
  return theme.shape
}
