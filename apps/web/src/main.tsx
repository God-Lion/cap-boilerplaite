import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Providers from './app/Providers'
import Layout from './app/layout'
import App from './AppAssembly'
import { i18n } from '@cap/platform-core'
import 'react-perfect-scrollbar/dist/css/styles.css'
import './app/styles/premium-ui.css'

const root = createRoot(document.getElementById('root')!)
const direction = i18n.langDirection[i18n.defaultLocale]

if (import.meta.env.PROD) {
  // Disable console in production
  console.log = () => {}
  console.warn = () => {}
  console.error = () => {}
}

root.render(
  <StrictMode>
    <Providers direction={direction}>
      <Layout>
        <App />
      </Layout>
    </Providers>
  </StrictMode>,
)
