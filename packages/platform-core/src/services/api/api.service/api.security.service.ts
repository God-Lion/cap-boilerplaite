import { apiClient, FetchResponse } from '../api.client'
import { ENDPOINTS } from '../api.config'

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
