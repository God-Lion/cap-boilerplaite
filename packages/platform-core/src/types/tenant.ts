export interface TenantTheme {
  mode: 'light' | 'dark' | 'system'
  skin: 'default' | 'bordered'
  semiDark: boolean
  primaryColor: string
  secondaryColor: string
  colors: {
    primary: {
      main: string
      light: string
      dark: string
      contrastText: string
    }
    secondary: {
      main: string
      light: string
      dark: string
      contrastText: string
    }
    error: {
      main: string
      light: string
      dark: string
      contrastText: string
    }
    success: {
      main: string
      light: string
      dark: string
      contrastText: string
    }
    warning: {
      main: string
      light: string
      dark: string
      contrastText: string
    }
    info: {
      main: string
      light: string
      dark: string
      contrastText: string
    }
    brandGold: string
    brandBrown: string
    brandSlate: string
    brandCream: string
  }
  shape: {
    borderRadius: number
    customBorderRadius: {
      xs: number
      sm: number
      md: number
      lg: number
      xl: number
    }
  }
  typography: {
    fontFamily: string
    h1: { fontWeight: number }
    h2: { fontWeight: number }
    h3: { fontWeight: number }
    h4: { fontWeight: number }
    h5: { fontWeight: number }
    h6: { fontWeight: number }
  }
}

export interface TenantLayout {
  layout: 'vertical' | 'horizontal' | 'collapsed'
  layoutPadding: number
  compactContentWidth: number
  navbar: {
    type: 'fixed' | 'static'
    contentWidth: 'compact' | 'wide'
    floating: boolean
    detached: boolean
    blur: boolean
  }
  footer: {
    type: 'fixed' | 'static'
    contentWidth: 'compact' | 'wide'
    detached: boolean
  }
  contentWidth: 'compact' | 'wide'
  disableRipple: boolean
  toastPosition: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left'
}

export interface TenantBranding {
  logo?: string
  favicon?: string
  appName: string
  companyName: string
  welcomeText?: string
}

export interface TenantConfig {
  id: string
  slug: string
  domain: string
  name: string
  theme: TenantTheme
  layout: TenantLayout
  branding: TenantBranding
  features: {
    darkMode: boolean
    rtl: boolean
    notifications: boolean
    chat: boolean
  }
  version: number
}

export interface TenantContextValue {
  tenant: TenantConfig | null
  isLoading: boolean
  error: string | null
  userPreferences: UserPreferences
  updateUserPreferences: (prefs: Partial<UserPreferences>) => void
  refetchTenant: () => Promise<void>
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system'
  language?: string
  sidebarCollapsed?: boolean
  dashboardLayout?: string
  notifications?: boolean
}

export const DEFAULT_TENANT_THEME: TenantTheme = {
  mode: 'light',
  skin: 'default',
  semiDark: false,
  primaryColor: '#D4AF37',
  secondaryColor: '#8B4513',
  colors: {
    primary: {
      main: '#D4AF37',
      light: '#E0C55B',
      dark: '#B8982F',
      contrastText: '#1A1A1A',
    },
    secondary: {
      main: '#8B4513',
      light: '#A0522D',
      dark: '#6B3410',
      contrastText: '#FDFDFD',
    },
    error: {
      main: '#DC3545',
      light: '#E35D6A',
      dark: '#C82333',
      contrastText: '#FFF',
    },
    success: {
      main: '#28A745',
      light: '#48B461',
      dark: '#1E7E34',
      contrastText: '#FFF',
    },
    warning: {
      main: '#FF9F43',
      light: '#FFB269',
      dark: '#E68F3C',
      contrastText: '#1A1A1A',
    },
    info: {
      main: '#2F4F4F',
      light: '#4A6A6A',
      dark: '#1F3333',
      contrastText: '#FFF',
    },
    brandGold: '#D4AF37',
    brandBrown: '#8B4513',
    brandSlate: '#2F4F4F',
    brandCream: '#F5F5DC',
  },
  shape: {
    borderRadius: 6,
    customBorderRadius: {
      xs: 2,
      sm: 4,
      md: 6,
      lg: 8,
      xl: 10,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
}

export const DEFAULT_TENANT_LAYOUT: TenantLayout = {
  layout: 'vertical',
  layoutPadding: 24,
  compactContentWidth: 1440,
  navbar: {
    type: 'fixed',
    contentWidth: 'compact',
    floating: true,
    detached: true,
    blur: true,
  },
  footer: {
    type: 'static',
    contentWidth: 'compact',
    detached: true,
  },
  contentWidth: 'compact',
  disableRipple: false,
  toastPosition: 'top-right',
}

export const DEFAULT_TENANT_CONFIG: TenantConfig = {
  id: 'default',
  slug: 'default',
  domain: 'localhost',
  name: 'Default Tenant',
  theme: DEFAULT_TENANT_THEME,
  layout: DEFAULT_TENANT_LAYOUT,
  branding: {
    appName: 'My App',
    companyName: 'My Company',
  },
  features: {
    darkMode: true,
    rtl: false,
    notifications: true,
    chat: true,
  },
  version: 1,
}
