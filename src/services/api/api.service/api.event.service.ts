import { apiClient, FetchResponse } from 'src/services/api/api.client'
import { ENDPOINTS } from 'src/services/api/api,config'
/**
 * Event Service (Long Polling)
 */
export const eventService = {
    getEventData: (query: string = ''): Promise<FetchResponse> => {
        return apiClient.get(`${ENDPOINTS.event}${query}`)
    },
}
