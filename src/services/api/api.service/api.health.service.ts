import { apiClient, FetchResponse } from 'src/services/api/api.client'
import { ENDPOINTS } from 'src/services/api/api,config'

/**
 * Health & Metrics Service
 */
export const healthService = {
    getBasicHealth: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.health.basic)
    },

    getLiveness: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.health.live)
    },

    getReadiness: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.health.ready)
    },

    getDetailedHealth: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.health.detailed)
    },

    getStartup: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.health.startup)
    },
}