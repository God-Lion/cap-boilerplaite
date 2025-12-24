import { apiClient, FetchResponse } from '../api.client'
import { ENDPOINTS } from '../api.config'

/**
 * RBAC Service
 */
export const rbacService = {
    getPermissions: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.rbac.permissions.list)
    },

    getPermissionById: (id: number): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.rbac.permissions.byId(id))
    },

    grantPermission: (body: { user_id: number; permission_id: number; reason?: string; expires_at?: string }): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.rbac.permissions.grant, body)
    },

    revokePermission: (body: { user_id: number; permission_id: number; reason?: string }): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.rbac.permissions.revoke, body)
    },

    getRolePermissions: (role: string): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.rbac.roles.permissions(role))
    },

    assignRolePermission: (body: { role: string; permission_id: number }): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.rbac.roles.assignPermission, body)
    },

    assignUserRole: (body: { user_id: number; new_role: string }): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.rbac.users.assignRole, body)
    },
}
