import { apiClient, FetchResponse } from 'src/services/api/api.client'
import { ENDPOINTS } from 'src/services/api/api,config'

/**
 * Security Service
 */
export const securityService = {
    reportCSPViolation: (body: any): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.security.cspReport, body)
    },

    testHeaders: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.security.headersTest)
    },
}
