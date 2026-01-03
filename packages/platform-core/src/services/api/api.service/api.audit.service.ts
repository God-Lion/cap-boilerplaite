import { apiClient, FetchResponse } from '../api.client'
import { ENDPOINTS } from '../api.config'
/**
 * Audit Service
 */
export const auditService = {
  getLogs: (params?: any): Promise<FetchResponse> => {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return apiClient.get(`${ENDPOINTS.audit.logs}${query}`)
  },

  exportLogs: (params?: any): Promise<FetchResponse> => {
    const query = params ? `?${new URLSearchParams(params)}` : ''
    return apiClient.get(`${ENDPOINTS.audit.export}${query}`)
  },

  getStatistics: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.audit.statistics)
  },

  getCompliance: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.audit.compliance)
  },
}
