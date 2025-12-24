import { apiClient, FetchResponse } from '../api.client'
import { ENDPOINTS } from '../api.config'
/**
 * Backup Service
 */
export const backupService = {
    createBackup: (body?: { backup_type?: string; verify_after_creation?: boolean }): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.backup.create, body)
    },

    listBackups: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.backup.list)
    },

    getBackupById: (id: number | string): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.backup.byId(id))
    },

    verifyBackup: (id: number | string): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.backup.verify(id))
    },

    restoreBackup: (body: { backup_id: string; verify_before_restore?: boolean; create_backup_before_restore?: boolean }): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.backup.restore, body)
    },

    pointInTimeRestore: (body: { target_timestamp: string; verify_before_restore?: boolean }): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.backup.pitr, body)
    },

    testRestore: (id: number | string): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.backup.testRestore(id))
    },

    getRPOStatus: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.backup.rpoStatus)
    },
}
