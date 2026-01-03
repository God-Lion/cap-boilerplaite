import type { RoutesProps } from 'react-router-dom'
import { AuthRouteConfig } from '../assembly'

export interface CAPModule {
  id: string
  version: string
  // routes?: Array<RouteObject>;
  routes?: React.FC<RoutesProps>
  store?: any // To be typed strictly later
  services?: Record<string, unknown>
  permissions?: Array<string>
  navigation?: Array<any>
  i18n?: Record<string, any>
  hooks?: any
  authRouteConfig?: Array<AuthRouteConfig>
}
