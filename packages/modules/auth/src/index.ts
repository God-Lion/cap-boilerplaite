import { CAPModule } from '@cap/platform-core'
import { authRouteConfig, authRoutes } from './routes/routes'
import en from './data/dictionaries/en.json'
import ar from './data/dictionaries/ar.json'
import fr from './data/dictionaries/fr.json'

export * from './hooks'
export * from './types'
export * from './services'
export * from './screens'

export const AuthModule: CAPModule = {
  id: 'auth-module',
  version: '1.0.0',
  routes: authRoutes,
  authRouteConfig,
  i18n: { en, ar, fr },
}
