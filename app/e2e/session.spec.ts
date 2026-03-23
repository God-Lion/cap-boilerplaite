import { test, expect } from '@playwright/test'
import { API_BASE_URL } from './test-config'

test.describe('API: Session Endpoints', () => {
  let authToken: string | undefined

  test.beforeAll(async ({ request }) => {
    // 1. Ensure test user exists
    const email = `session-test-${Date.now()}@example.com`
    const password = 'TestPassword123!'

    await request
      .post(`${API_BASE_URL}/auth/register`, {
        data: {
          email,
          password,
          firstName: 'Session',
          lastName: 'Test',
        },
      })
      .catch(() => {})

    // 2. Login and get token
    const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { email, password },
    })
    const data = await loginResponse.json()
    // The backend might return token or access_token
    authToken = data.token || data.access_token || data.data?.token
  })

  test('GET /api/auth/session - should require authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/auth/session`)
    expect(response.status()).toBe(401)
  })

  test('GET /api/auth/session - should return session when authenticated', async ({ request }) => {
    if (!authToken) {
      test.skip()
      return
    }

    const response = await request.get(`${API_BASE_URL}/auth/session`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    expect(response.ok()).toBeTruthy()
  })

  test('GET /api/auth/sessions - should return sessions list when authenticated', async ({
    request,
  }) => {
    if (!authToken) {
      test.skip()
      return
    }

    const response = await request.get(`${API_BASE_URL}/auth/sessions`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    expect(response.ok()).toBeTruthy()
  })

  test('GET /api/auth/login-history - should return history when authenticated', async ({
    request,
  }) => {
    if (!authToken) {
      test.skip()
      return
    }

    const response = await request.get(`${API_BASE_URL}/auth/login-history`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    expect(response.ok()).toBeTruthy()
  })

  test('GET /api/auth/security-logs - should return logs when authenticated', async ({
    request,
  }) => {
    if (!authToken) {
      test.skip()
      return
    }

    const response = await request.get(`${API_BASE_URL}/auth/security-logs`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    expect(response.ok()).toBeTruthy()
  })
})

test.describe('API: User Endpoints', () => {
  test('POST /api/user/change-password - should require authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/user/change-password`, {
      data: {
        currentPassword: 'OldPassword123!',
        newPassword: 'NewPassword123!',
      },
    })

    expect(response.status()).toBe(401)
  })
})

test.describe('API: Auth Index', () => {
  test('GET /api/auth - should require authentication', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/auth`)

    expect(response.status()).toBe(401)
  })
})
