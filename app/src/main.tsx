import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Providers from './Providers'
import Layout from './layout'
import App from './AppAssembly'
import 'react-perfect-scrollbar/dist/css/styles.css'

const root = createRoot(document.getElementById('root')!)


if (import.meta.env.PROD) {
  // Disable console in production
  console.log = () => { }
  console.warn = () => { }
  console.error = () => { }
}

root.render(
  <StrictMode>
    <Providers>
      <Layout>
        <App />
      </Layout>
    </Providers>
  </StrictMode>,
)
