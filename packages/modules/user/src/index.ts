import type { CAPModule } from '@cap/shared-types'
import { userRouteConfig, UserRoutes } from './routes/routes'
import Path from './routes/path'
import { registerDictionary, getMergedDictionary } from './domain-kernel/src/i18n/registry'

import en from './domain-kernel/src/data/dictionaries/en.json'

// Register translations
registerDictionary({ en, ar: en, fr: en }) // Fallback to en for now

const mergedEn = getMergedDictionary('en')
const mergedAr = getMergedDictionary('ar')
const mergedFr = getMergedDictionary('fr')

export { userRouteConfig, UserRoutes, Path as UserPath }

export const UserModule: CAPModule = {
  id: 'user-module',
  version: '1.0.0',
  routes: UserRoutes as any,
  authRouteConfig: userRouteConfig as any,
  i18n: { 
    en: mergedEn, 
    ar: mergedAr, 
    fr: mergedFr 
  },
  navItems: [
    {
      id: 'admin-nfc-section',
      label: 'NFC Management',
      section: 'NFC Management',
      variant: ['admin'],
      order: 300,
    },
    {
      id: 'admin-nfc-readers',
      label: 'Access Points',
      icon: 'tabler-sensors',
      path: Path.nfc.accessPoints,
      variant: ['admin'],
      order: 310,
    },
    {
      id: 'admin-nfc-logs',
      label: 'Access Logs',
      icon: 'tabler-history',
      path: Path.nfc.logs,
      variant: ['admin'],
      order: 320,
    },
    {
      id: 'admin-nfc-cards',
      label: 'NFC Setup',
      icon: 'tabler-key',
      path: Path.nfc.cards,
      variant: ['admin'],
      order: 330,
    },
  ],
}

export default UserModule
