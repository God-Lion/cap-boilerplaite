// cspell:ignore languagedetector reactour Toastify
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { I18nextProvider } from 'react-i18next'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { BrowserRouter } from 'react-router-dom'
import {
  getDemoName,
  getMode,
  getSettingsFromCookie,
  getSystemMode,
  SettingsProvider,
  themeConfig,
  GlobalZIndexStyles,
} from '@cap/platform-core'
import type { ChildrenType, Direction } from '@cap/platform-core'
import { i18n } from '@cap/platform-core'
import { TourProvider } from '@reactour/tour'
import common_us from './data/dictionaries/en.json'
import common_fr from './data/dictionaries/fr.json'
import ThemeProvider from './theme/index'
import AppReactToastify from './lib/styles/AppReactToastify'

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
  close: (base: React.CSSProperties) => ({
    ...base,
    color: '#FFF',
  }),
  popover: (base: React.CSSProperties) => ({
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
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const demoName = getDemoName()
  const systemMode = getSystemMode()

  return (
    <SettingsProvider settingsCookie={settingsCookie} mode={mode} demoName={demoName}>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18next}>
          <ThemeProvider direction={direction} systemMode={systemMode}>
            <GlobalZIndexStyles />
            <BrowserRouter>
              <TourProvider steps={tourConfig} defaultOpen={false} rtl={false} styles={tourStyles}>
                {children}
              </TourProvider>
            </BrowserRouter>
            <AppReactToastify position={themeConfig.toastPosition} hideProgressBar />
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </I18nextProvider>
      </QueryClientProvider>
    </SettingsProvider>
  )
}

export default Providers
