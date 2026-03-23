import { CAPModule } from '@cap/platform-core'

export * from './domain-kernel/src'
export * from './modules/anomaly-detection/src'

import { registerDictionary, getMergedDictionary } from './modules/anomaly-detection/src/i18n/registry'
import en from './modules/anomaly-detection/src/data/dictionaries/en.json'
import ar from './modules/anomaly-detection/src/data/dictionaries/ar.json'
import fr from './modules/anomaly-detection/src/data/dictionaries/fr.json'

registerDictionary({ en, ar, fr })

const enDict = getMergedDictionary('en')
const arDict = getMergedDictionary('ar')
const frDict = getMergedDictionary('fr')

export const MonitoringAlertsModule: CAPModule = {
  id: 'monitoring-alerts-module',
  version: '1.0.0',
  routes: [],
  authRouteConfig: [],
  i18n: { en: enDict, ar: arDict, fr: frDict },
  plugins: [],
  navItems: [
    {
      id: 'monitoring-section',
      label: 'navigation.monitoring',
      section: 'Monitoring',
      variant: ['vertical'],
      order: 80,
    },
    {
      id: 'monitoring-anomalies',
      label: 'navigation.anomalies',
      icon: 'tabler-chart-line',
      path: '/monitoring/anomalies',
      roles: ['admin', 'superadmin', 'security_analyst'],
      variant: ['vertical'],
      order: 10,
    },
    {
      id: 'monitoring-alerts',
      label: 'navigation.alerts',
      icon: 'tabler-bell',
      path: '/monitoring/alerts',
      roles: ['admin', 'superadmin', 'security_analyst'],
      variant: ['vertical'],
      order: 20,
    },
    {
      id: 'monitoring-security',
      label: 'navigation.securityDashboard',
      icon: 'tabler-shield',
      path: '/monitoring/security',
      roles: ['admin', 'superadmin'],
      variant: ['vertical'],
      order: 30,
    },
    {
      id: 'monitoring-threats',
      label: 'navigation.threatIntel',
      icon: 'tabler-virus',
      path: '/monitoring/threats',
      roles: ['admin', 'superadmin'],
      variant: ['vertical'],
      order: 40,
    },
  ],
  searchItems: [
    {
      id: 'monitoring-anomalies-search',
      name: 'Anomalies',
      url: '/monitoring/anomalies',
      icon: 'tabler-chart-line',
      section: 'Monitoring',
    },
    {
      id: 'monitoring-alerts-search',
      name: 'Alerts',
      url: '/monitoring/alerts',
      icon: 'tabler-bell',
      section: 'Monitoring',
    },
    {
      id: 'monitoring-security-search',
      name: 'Security Dashboard',
      url: '/monitoring/security',
      icon: 'tabler-shield',
      section: 'Monitoring',
    },
  ],
}
