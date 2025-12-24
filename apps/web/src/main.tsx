import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './AppAssembly'
import Providers from './app/Providers'

const root = createRoot(document.getElementById('root')!)
const direction = 'ltr'

if (import.meta.env.PROD) {
  // Disable console in production
  console.log = () => { }
  console.warn = () => { }
  console.error = () => { }
}

root.render(
  <StrictMode>
    <Providers direction={direction}>
      <App />
    </Providers>
  </StrictMode>,
)
