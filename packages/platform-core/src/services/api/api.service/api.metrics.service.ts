import { apiClient, FetchResponse } from '../api.client'
import { ENDPOINTS } from '../api.config'

export const metricsService = {
  getMetrics: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.metrics.basic)
  },

  getPrometheusMetrics: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.metrics.prometheus)
  },
}
