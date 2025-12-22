import { apiClient, FetchResponse } from 'src/services/api/api.client'
import { ENDPOINTS } from 'src/services/api/api,config'
/**
 * GDPR Service
 */
export const gdprService = {
    requestDataExport: (format: 'json' | 'csv' = 'json'): Promise<FetchResponse> => {
        return apiClient.get(`${ENDPOINTS.gdpr.dataExport}?format=${format}`)
    },

    downloadExport: (exportId: number | string, format: 'json' | 'csv' = 'json'): Promise<FetchResponse> => {
        return apiClient.get(`${ENDPOINTS.gdpr.downloadExport(exportId)}?format=${format}`)
    },

    requestDataDeletion: (body: { anonymize?: boolean; reason?: string; verification_code?: string }): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.gdpr.dataDeletion, body)
    },

    verifyDeletion: (requestId: number | string, body: { verification_code: string }): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.gdpr.verifyDeletion(requestId), body)
    },

    giveConsent: (body: { consent_type: string; consent_given: boolean; consent_version?: string }): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.gdpr.consent, body)
    },

    updateConsent: (consentId: number, body: { consent_given: boolean }): Promise<FetchResponse> => {
        return apiClient.put(ENDPOINTS.gdpr.updateConsent(consentId), body)
    },

    getConsentStatus: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.gdpr.consentStatus)
    },

    getRetentionReport: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.gdpr.retentionReport)
    },

    getProcessingActivities: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.gdpr.processingActivities)
    },
}