// src/Modules/Auth/services/user.service.ts
// ============================================================================
// User Service - User Profile & Account Management
// ============================================================================

import { apiClient, FetchResponse } from '@cap/platform-core'

import {
  UpdateNamesRequest,
  UpdateEmailRequest,
  UpdatePhotoRequest,
  ChangePasswordRequest,
  UpdatePreferencesRequest,
} from '../types/api.types'
import { ENDPOINTS } from './endpoints'

const userService = {
  getMe: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.user.me)
  },
  updateMe: (data: UpdateNamesRequest): Promise<FetchResponse> => {
    return apiClient.patch(ENDPOINTS.user.update, data)
  },
  getProfileSettings: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.user.me)
  },

  getProfile: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.user.me)
  },

  update: (data: UpdateNamesRequest): Promise<FetchResponse> => {
    return apiClient.patch(ENDPOINTS.user.update, data)
  },
  updateNames: (data: UpdateNamesRequest): Promise<FetchResponse> => {
    return apiClient.patch(ENDPOINTS.user.update, data)
  },

  updatePhoto: (data: UpdatePhotoRequest): Promise<FetchResponse> => {
    return apiClient.uploadFormData(ENDPOINTS.user.update, { photo: data.photo }, 'patch')
  },

  updateEmail: (data: UpdateEmailRequest): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.user.changeEmail, data)
  },

  changeEmail: (data: UpdateEmailRequest): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.user.changeEmail, data)
  },

  changePassword: (data: ChangePasswordRequest): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.user.changePassword, data)
  },

  delete: (): Promise<FetchResponse> => {
    return apiClient.delete(ENDPOINTS.user.destroy)
  },

  verifyEmailChange: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.user.verifyEmailChange)
  },
  activate: (id: string | number): Promise<FetchResponse> => {
    return apiClient.patch(ENDPOINTS.user.activate(id))
  },
  deactivate: (id: string | number): Promise<FetchResponse> => {
    return apiClient.patch(ENDPOINTS.user.deactivate(id))
  },
  suspend: (id: string | number): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.user.suspend(id))
  },
  unsuspend: (id: string | number): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.user.unsuspend(id))
  },

  preferences: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.user.preferences)
  },

  updatePreferences: (data: UpdatePreferencesRequest): Promise<FetchResponse> => {
    return apiClient.patch(ENDPOINTS.user.preferences, data)
  },

  mfa: {
    getMethods: (): Promise<FetchResponse> => {
      return apiClient.get(ENDPOINTS.user.mfa.methods)
    },
  },

  passkeys: {
    list: (): Promise<FetchResponse> => {
      return apiClient.get(ENDPOINTS.user.passkeys.index)
    },

    update: (id: string | number, data: { name: string }): Promise<FetchResponse> => {
      return apiClient.patch(ENDPOINTS.user.passkeys.update(id), data)
    },

    delete: (id: string | number): Promise<FetchResponse> => {
      return apiClient.delete(ENDPOINTS.user.passkeys.destroy(id))
    },
  },
  linkAccount: (data: {
    provider: string
    providerId: string
    email?: string
    metadata?: any
  }): Promise<FetchResponse> => {
    return apiClient.post(ENDPOINTS.user.linkAccount, data)
  },

  getLinkedAccounts: (): Promise<FetchResponse> => {
    return apiClient.get(ENDPOINTS.user.linkedAccounts)
  },

  unlinkAccount: (id: string | number): Promise<FetchResponse> => {
    return apiClient.delete(ENDPOINTS.user.unlinkAccount(id))
  },

  tokens: {
    list: (): Promise<FetchResponse> => {
      return apiClient.get(ENDPOINTS.user.tokens.index)
    },

    create: (data: {
      name: string
      expiresIn?: string
      abilities?: string[]
      ipRestrictions?: string[]
    }): Promise<FetchResponse> => {
      return apiClient.post(ENDPOINTS.user.tokens.store, data)
    },

    revoke: (id: string | number): Promise<FetchResponse> => {
      return apiClient.delete(ENDPOINTS.user.tokens.destroy(id))
    },
  },

  compliance: {
    export: (): Promise<FetchResponse> => {
      return apiClient.get(ENDPOINTS.user.compliance.export)
    },
  },
}

export default userService
