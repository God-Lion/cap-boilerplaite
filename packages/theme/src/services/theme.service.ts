import { apiClient } from '@cap/platform-core'
import type { TenantThemeConfig } from '../types'

export const themeService = {
  /**
   * Fetches the styles (theme configuration) for a given organization.
   */
  getTheme: async (orgId: string): Promise<TenantThemeConfig> => {
    const response = await apiClient.get<TenantThemeConfig>(`/api/admin/organizations/${orgId}/styles`)
    if (!response.data) throw new Error('Failed to fetch tenant theme')
    return response.data
  },

  /**
   * Saves or updates the theme configuration for an organization.
   */
  saveTheme: async (theme: TenantThemeConfig): Promise<void> => {
    const response = await apiClient.post(`/api/admin/organizations/${theme.organizationId}/styles`, theme)
    // Check if the request was successful
    if (response.status >= 300) {
      throw new Error('Failed to save tenant theme')
    }
  }
}

export default themeService;
