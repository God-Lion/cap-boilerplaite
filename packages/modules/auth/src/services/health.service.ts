// src/Modules/Auth/services/user.service.ts
// ============================================================================
// User Service - User Profile & Account Management
// ============================================================================

import { apiClient, FetchResponse } from '@cap/platform-core'

import {} from '../types/api.types'
import { ENDPOINTS } from './endpoints'

const healthService = {
  getBasic: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.health.basic)
  },
  getLive: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.health.live)
  },
  getReady: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.health.ready)
  },
  getDetailed: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.health.detailed)
  },
  getStartup: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.health.startup)
  },
}

export default healthService
