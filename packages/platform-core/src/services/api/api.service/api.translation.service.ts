import { apiClient, FetchResponse } from '../api.client'
import { ENDPOINTS } from '../api.config'

export const translationService = {
  getTranslation: async (code: string = 'fr'): Promise<FetchResponse> => {
    return apiClient.getWithFallback(ENDPOINTS.translation(code), {})
  },
}
