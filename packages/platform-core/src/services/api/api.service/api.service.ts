import { apiClient, FetchResponse } from '../api.client'
import { ENDPOINTS } from '../api.config'

/**
 * Event Service (Long Polling)
 */
export const eventService = {
  getEventData: (query: string = ''): Promise<FetchResponse> => {
    return apiClient.get(`${ENDPOINTS.event}${query}`)
  },
}
