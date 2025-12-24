import { apiClient, FetchResponse } from '../api.client'
import { ENDPOINTS } from '../api.config'
/**
 * Logs Service
 */
export const logsService = {
    getAllLogs: (query: string = ''): Promise<FetchResponse> => {
        return apiClient.get(`${ENDPOINTS.logs}${query}`)
    },
}