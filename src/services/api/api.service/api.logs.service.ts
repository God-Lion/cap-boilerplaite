import { apiClient, FetchResponse } from 'src/services/api/api.client'
import { ENDPOINTS } from 'src/services/api/api,config'
/**
 * Logs Service
 */
export const logsService = {
    getAllLogs: (query: string = ''): Promise<FetchResponse> => {
        return apiClient.get(`${ENDPOINTS.logs}${query}`)
    },
}