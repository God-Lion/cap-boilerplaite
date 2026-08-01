import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Providers from './Providers'
import Layout from './layout'
import App from './AppAssembly'
import 'react-perfect-scrollbar/dist/css/styles.css'

const root = createRoot(document.getElementById('root')!)


if (import.meta.env.PROD) {
  // Silence verbose logs in production while retaining warnings and errors for diagnostics
  console.log = () => { }
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
