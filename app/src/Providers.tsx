// cspell:ignore languagedetector reactour Toastify
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { BrowserRouter } from 'react-router-dom'
import {
  TenantProvider,
  themeConfig,
  i18n,
  onForbiddenError,
  useNetworkSync,
  getModules,
  useTenant,
  useSettings,
} from '@cap/platform-core'
import type { ChildrenType } from '@cap/platform-core'
import { TourProvider } from '@reactour/tour'
import { toast } from 'react-toastify'
import common_us from './data/dictionaries/en.json'
import common_fr from './data/dictionaries/fr.json'
import common_ar from './data/dictionaries/ar.json'
import { DesignSystemProvider, AppReactToastify, GlobalZIndexStyles } from '@cap/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

if (!i18next.isInitialized) {
  const initialResources: any = {
    en: { common: { ...common_us } },
    fr: { common: { ...common_fr } },
    ar: { common: { ...common_ar } },
  }

  // Dynamically merge i18n from all registered modules
  const modules = getModules()

  modules.forEach((module: any) => {
    if (module.i18n) {
      Object.entries(module.i18n).forEach(([lang, namespaces]: [string, any]) => {
        if (initialResources[lang]) {
          Object.entries(namespaces).forEach(([ns, data]: [string, any]) => {
            // 1. Keep in its own namespace
            initialResources[lang][ns] = {
              ...(initialResources[lang][ns] || {}),
              ...data
            }

            // 2. Flatten into 'common' so keys work globally (e.g. t('auth.login'))
            initialResources[lang].common = {
              ...initialResources[lang].common,
              ...data
            }
          })
        }
      })
    }
  })

  i18next.use(LanguageDetector).init({
    interpolation: { escapeValue: false },
    lng: i18n.defaultLocale,
    fallbackLng: i18n.defaultLocale,
    defaultNS: 'common',
    fallbackNS: 'common',
    resources: initialResources,
  })
}

const tourConfig = [
  {
    selector: '[data-tut="reactour__logo"]',
    content: `And this is our cool bus...`,
  },
  {
    selector: '[data-tut="reactour__iso"]',
    content: `Ok, let's start with the name of the Tour that is about to begin.`,
  },
]


const ForbiddenListener = () => {
  React.useEffect(() => {
    const unregister = onForbiddenError(() => {
      toast.error('Access Denied: You do not have permission to perform this action.', {
        toastId: 'forbidden-error',
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'custom-toast',
      })
    })
    return () => {
      unregister()
    }
  }, [])

  return null
}

const NetworkSync = () => {
  useNetworkSync()
  return null
}

import { useTheme } from '@mui/material/styles'

const ThemedTourProvider: React.FC<ChildrenType> = ({ children }) => {
  const theme = useTheme()

  const tourStyles = {
    close: (base: React.CSSProperties) => ({
      ...base,
      color: theme.palette.text.primary,
    }),
    popover: (base: React.CSSProperties) => ({
      ...base,
      boxShadow: '0 0 3em rgba(0, 0, 0, 0.5)',
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    }),
  }

  return (
    <TourProvider steps={tourConfig} defaultOpen={false} rtl={theme.direction === 'rtl'} styles={tourStyles}>
      {children}
    </TourProvider>
  )
}

const TenantAwareDesignSystemProvider: React.FC<
  ChildrenType
> = ({ children }) => {
  const { 
    theme, 
    isLoadingTheme, 
    errorTheme, 
    refetchTheme, 
    updateTheme, 
    saveTheme 
  } = useTenant()
  const { settings } = useSettings()

  return (
    <DesignSystemProvider
      theme={theme}
      isLoading={isLoadingTheme}
      error={errorTheme}
      refetch={refetchTheme}
      updateTheme={async (updates) => {
        if (theme) {
          await updateTheme({ ...theme, ...updates })
        } else {
          await updateTheme(updates as any)
        }
      }}
      saveTheme={async (updatedConfig) => {
        if (theme) {
          await saveTheme({ ...theme, ...updatedConfig })
        } else {
          await saveTheme(updatedConfig as any)
        }
      }}
      settings={settings}
    >
      <GlobalZIndexStyles />
      <BrowserRouter>
        <ForbiddenListener />
        <NetworkSync />
        <ThemedTourProvider>{children}</ThemedTourProvider>
      </BrowserRouter>
      <AppReactToastify position={themeConfig.toastPosition} hideProgressBar />
      <ReactQueryDevtools initialIsOpen={false} />
    </DesignSystemProvider>
  )
}

const Providers: React.FC<ChildrenType> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18next}>
        <TenantProvider>
          <TenantAwareDesignSystemProvider>
            {children}
          </TenantAwareDesignSystemProvider>
        </TenantProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default Providers
