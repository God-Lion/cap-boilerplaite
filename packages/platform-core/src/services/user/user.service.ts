import { apiClient, ENDPOINTS } from '@cap/platform-store'
import { UserDto, ApiResponse } from '@cap/shared-types'

export const userService = {
  getMe: async () => {
    const response = await apiClient.get<ApiResponse<UserDto>>(ENDPOINTS.user.me)
    return response.data.data
  },

  updateProfile: async (data: Partial<UserDto>) => {
    const response = await apiClient.put<ApiResponse<UserDto>>(ENDPOINTS.user.update, data)
    return response.data.data
  },
}
