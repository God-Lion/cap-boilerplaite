import React, { useMemo } from 'react'
import type { ChildrenType, Direction } from '@cap/platform-core'
import { themeConfig } from '@cap/platform-core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import AppReactToastify from './lib/styles/AppReactToastify'
import ThemeProvider from './components/theme'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { i18n } from '@cap/platform-core'
import { TourProvider } from '@reactour/tour'
import common_us from './data/dictionaries/en.json'
import common_fr from './data/dictionaries/fr.json'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

if (!i18next.isInitialized) {
  i18next.use(LanguageDetector).init({
    interpolation: { escapeValue: false },
    lng: i18n.defaultLocale,
    resources: {
      en: {
        common: common_us,
      },
      FR: {
        common: common_fr,
      },
    },
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

const tourStyles = {
  close: (base: any) => ({
    ...base,
    color: '#FFF',
  }),
  popover: (base: any) => ({
    ...base,
    boxShadow: '0 0 3em rgba(0, 0, 0, 0.5)',
    backgroundColor: 'var(--mui-palette-background-paper)',
    color: 'text.primary',
  }),
}

const Providers: React.FC<
  ChildrenType & {
    direction: Direction
  }
> = ({ children, direction }) => {
  const systemMode = themeConfig.mode === 'system' ? 'dark' : themeConfig.mode

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18next}>
        <ThemeProvider direction={direction} systemMode={systemMode}>
          <TourProvider
            steps={tourConfig}
            defaultOpen={false}
            rtl={false}
            styles={tourStyles}
          >
            {children}
          </TourProvider>
          <AppReactToastify
            position={themeConfig.toastPosition}
            hideProgressBar
          />
          <ReactQueryDevtools initialIsOpen={false} />
        </ThemeProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

export default Providers
