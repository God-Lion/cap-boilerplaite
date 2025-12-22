import { apiClient, FetchResponse } from 'src/services/api/api.client'
import { ENDPOINTS } from 'src/services/api/api,config'
/**
 * User Service
 */
export const userService = {
    getSettings: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.user.settings)
    },

    getAllUsers: (query: string = ''): Promise<FetchResponse> => {
        return apiClient.get(`${ENDPOINTS.user.list}${query}`)
    },

    getUserById: (id: number, query: string = ''): Promise<FetchResponse> => {
        return apiClient.get(`${ENDPOINTS.user.byId(id)}${query}`)
    },

    getUsersByUserType: (userTypeId: number): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.user.byUserType(userTypeId))
    },

    updateNames: (body: { firstname?: string; lastname?: string }): Promise<FetchResponse> => {
        return apiClient.put(ENDPOINTS.user.updateNames, body)
    },

    updateEmail: (body: { email?: string; password: string }): Promise<FetchResponse> => {
        return apiClient.put(ENDPOINTS.user.updateEmail, body)
    },

    updatePhotoProfile: (data: { id: number; file: File;[key: string]: any }): Promise<FetchResponse> => {
        return apiClient.uploadFormData(ENDPOINTS.user.updatePhoto(data.id), data, 'patch')
    },
}