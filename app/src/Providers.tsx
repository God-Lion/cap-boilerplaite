// cspell:ignore languagedetector reactour Toastify
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { BrowserRouter } from 'react-router-dom';
import { TenantProvider, themeConfig, i18n, onForbiddenError, useNetworkSync, getModules } from '@cap/platform-core';
import type { ChildrenType } from '@cap/platform-core';
import { TourProvider } from '@reactour/tour';
import { toast } from 'react-toastify';
import common_us from './data/dictionaries/en.json';
import common_fr from './data/dictionaries/fr.json';
import common_ar from './data/dictionaries/ar.json';
import { ThemeBridge, AppReactToastify } from '@cap/layout';
import { GlobalZIndexStyles } from '@cap/theme';

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

  // Dynamically merge i18n from all registered modules isolated by module name/id
  const modules = getModules()

  modules.forEach((module: any) => {
    const moduleNs = module.id || module.name || 'common'
    if (module.i18n) {
      Object.entries(module.i18n).forEach(([lang, resources]: [string, any]) => {
        if (initialResources[lang]) {
          initialResources[lang][moduleNs] = {
            ...(initialResources[lang][moduleNs] || {}),
            ...resources
          }
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

const Providers: React.FC<ChildrenType> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18next}>
        <TenantProvider>
          <ThemeBridge>
            <GlobalZIndexStyles />
            <BrowserRouter>
              <ForbiddenListener />
              <NetworkSync />
              <ThemedTourProvider>{children}</ThemedTourProvider>
            </BrowserRouter>
            <AppReactToastify position={themeConfig.toastPosition} hideProgressBar />
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeBridge>
        </TenantProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default Providers
