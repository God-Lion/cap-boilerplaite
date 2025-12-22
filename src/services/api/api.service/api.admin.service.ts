import { apiClient, FetchResponse } from 'src/services/api/api.client'
import { ENDPOINTS } from 'src/services/api/api,config'

/**
 * Admin Service
 */
export const adminService = {
    getDashboard: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.admin.dashboard)
    },

    getUsers: (params?: any): Promise<FetchResponse> => {
        const query = params ? `?${new URLSearchParams(params)}` : ''
        return apiClient.get(`${ENDPOINTS.admin.users.list}${query}`)
    },

    getUserById: (id: number): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.admin.users.byId(id))
    },

    updateUser: (id: number, body: any): Promise<FetchResponse> => {
        return apiClient.put(ENDPOINTS.admin.users.update(id), body)
    },

    bulkAction: (body: { user_ids: number[]; action: string; reason?: string }): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.admin.users.bulkAction, body)
    },

    getSecurityLogs: (params?: any): Promise<FetchResponse> => {
        const query = params ? `?${new URLSearchParams(params)}` : ''
        return apiClient.get(`${ENDPOINTS.admin.securityLogs}${query}`)
    },
}