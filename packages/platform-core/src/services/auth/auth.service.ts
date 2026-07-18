import { apiClient, ENDPOINTS, secureTokenManager } from '@cap/platform-store'
import { UserDto, ApiResponse } from '@cap/shared-types'

export const authService = {
  /**
   * Initiates the IDaaS login flow by redirecting to the backend.
   */
  loginWithIdaas: () => {
    // Redirect to backend endpoint which redirects to IDaaS
    window.location.href = `${apiClient.baseURL}${ENDPOINTS.auth.login}`
  },

  /**
   * helper to handle the callback from IDaaS (usually handled by a Callback component)
   * returning the tokens from URL query params.
   */
  handleCallback: async (urlParams: URLSearchParams): Promise<UserDto> => {
    const accessToken = urlParams.get('accessToken') || urlParams.get('token')
    // const refreshToken = urlParams.get('refresh_token') // Only if backend sends it in query (not Recommended with Cookies)
    const expiresIn = urlParams.get('expires_in')

    if (!accessToken) {
      throw new Error('No access token received')
    }

    // TODO: Migrate sensitive token storage (like refresh tokens) to HttpOnly cookies for enhanced security
    // Store tokens
    secureTokenManager.setTokens({
      accessToken,
      expiresAt: Date.now() + (Number(expiresIn) || 3600) * 1000,
    })

    // Verify session / Get User
    const response = await apiClient.get<ApiResponse<UserDto>>(ENDPOINTS.user.me)
    return response.data.data!
  },

  logout: async () => {
    try {
      await apiClient.post(ENDPOINTS.auth.logout)
    } catch (e) {
      console.error('Logout failed', e)
    } finally {
      secureTokenManager.clearTokens()
      window.location.href = '/login'
    }
  },
}
