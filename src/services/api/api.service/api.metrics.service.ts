import { apiClient, FetchResponse } from 'src/services/api/api.client'
import { ENDPOINTS } from 'src/services/api/api,config'

export const metricsService = {
    getMetrics: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.metrics.basic)
    },

    getPrometheusMetrics: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.metrics.prometheus)
    },
}
