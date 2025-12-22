import { apiClient, FetchResponse } from 'src/services/api/api.client'
import { ENDPOINTS } from 'src/services/api/api,config'

export const translationService = {
    getTranslation: async (code: string = 'fr'): Promise<FetchResponse> => {
        return apiClient.getWithFallback(
            ENDPOINTS.translation(code),
            {}
        )
    },
}
