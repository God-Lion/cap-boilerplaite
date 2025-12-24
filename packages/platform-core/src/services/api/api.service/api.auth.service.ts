import { apiClient, FetchResponse } from '../api.client'
import { ENDPOINTS } from '../api.config'
/**
 * Auth Service
 */
export const authService = {
    register: (body: any): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.auth.register, body)
    },

    signup: (body: any): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.auth.signup, body)
    },

    login: (body: any): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.auth.login, body)
    },

    logout: (): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.auth.logout)
    },

    forgotPassword: (body: any): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.auth.forgotPassword, body)
    },

    resetPassword: (body: any): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.auth.resetPassword, body)
    },

    refreshToken: (): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.auth.refresh)
    },

    getSession: (): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.auth.session)
    },

    trackFailedLogin: (body: any): Promise<FetchResponse> => {
        return apiClient.post(ENDPOINTS.auth.trackFailedLogin, body)
    },

    verifyEmail: (email: string, signature: string): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.auth.verifyEmail(email, signature))
    },

    verifyEmailToken: (token: string): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.auth.verifyEmailToken(token))
    },

    validateUser: (id: string | number, token: string): Promise<FetchResponse> => {
        return apiClient.get(ENDPOINTS.auth.validateUser(id, token))
    },

    mfa: {
        setup: (): Promise<FetchResponse> => {
            return apiClient.post(ENDPOINTS.auth.mfa.setup)
        },

        verify: (code: string): Promise<FetchResponse> => {
            return apiClient.post(ENDPOINTS.auth.mfa.verify, { code })
        },

        disable: (): Promise<FetchResponse> => {
            return apiClient.post(ENDPOINTS.auth.mfa.disable)
        },
    },
}
