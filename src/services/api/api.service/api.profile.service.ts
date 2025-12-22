import { apiClient, FetchResponse } from 'src/services/api/api.client'
import { ENDPOINTS } from 'src/services/api/api,config'

/**
 * Resume Profiles Service
 */
export const profileService = {
    getProfiles: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.profiles.list)
    },

    getProfileById: (id: number): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.profiles.byId(id))
    },

    uploadProfile: (data: { file: File; name: string; description?: string }): Promise<FetchResponse> => {
        return apiClient.uploadFile(ENDPOINTS.profiles.upload, [data.file], 'file', {
            name: data.name,
            description: data.description,
        })
    },

    setActiveProfile: (id: number): Promise<FetchResponse> => {
        return apiClient.put(ENDPOINTS.profiles.setActive(id))
    },

    updateProfile: (id: number, body: any): Promise<FetchResponse> => {
        return apiClient.put(ENDPOINTS.profiles.update(id), body)
    },

    deleteProfile: (id: number): Promise<FetchResponse> => {
        return apiClient.delete(ENDPOINTS.profiles.delete(id))
    },

    getActiveStatus: (id: number): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.profiles.activeStatus(id))
    },
}
