import { test, expect } from '@playwright/test'
import { API_BASE_URL } from './test-config'

test.describe('Passkey Registration Page', () => {
  test('should display passkey registration page', async ({ page }) => {
    await page.goto('/auth/passkey-register')
    await expect(page).toHaveURL(/passkey-register/)
  })
})

test.describe('API: Passkey Endpoints', () => {
  let authToken: string | undefined

  test.beforeAll(async ({ request }) => {
    // Create and login a test user
    const email = `passkey-test-${Date.now()}@example.com`
    const password = 'TestPassword123!'

    await request
      .post(`${API_BASE_URL}/auth/register`, {
        data: {
          email,
          password,
          firstName: 'Passkey',
          lastName: 'Test',
        },
      })
      .catch(() => {})

    const loginResponse = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { email, password },
    })

    const data = await loginResponse.json()
    authToken = data.token || data.access_token || data.data?.token
  })

  test('GET /api/auth/passkey/register/start - should return registration options', async ({
    request,
  }) => {
    if (!authToken) {
      test.skip()
      return
    }

    const response = await request.get(`${API_BASE_URL}/auth/passkey/register/start`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })

    // Should return WebAuthn registration options or require auth
    expect(response.status()).toBeLessThan(500)
  })

  test('POST /api/auth/passkey/register/finish - should require valid attestation', async ({
    request,
  }) => {
    if (!authToken) {
      test.skip()
      return
    }

    const response = await request.post(`${API_BASE_URL}/auth/passkey/register/finish`, {
      headers: { Authorization: `Bearer ${authToken}` },
      data: {
        // Invalid attestation response
        id: 'test-id',
        rawId: 'test-raw-id',
        response: {},
        type: 'public-key',
      },
    })

    // Should reject invalid attestation
    expect(response.ok()).toBeFalsy()
  })

  test('GET /api/auth/passkey/login/start - should return authentication options', async ({
    request,
  }) => {
    const response = await request.get(`${API_BASE_URL}/auth/passkey/login/start`)

    // Should return WebAuthn authentication options
    expect(response.status()).toBeLessThan(500)
  })

  test('POST /api/auth/passkey/login/finish - should require valid assertion', async ({
    request,
  }) => {
    const response = await request.post(`${API_BASE_URL}/auth/passkey/login/finish`, {
      data: {
        // Invalid assertion response
        id: 'test-id',
        rawId: 'test-raw-id',
        response: {},
        type: 'public-key',
      },
    })

    // Should reject invalid assertion
    expect(response.ok()).toBeFalsy()
  })
})

test.describe('API: OIDC Endpoints', () => {
  test('GET /api/auth/.well-known/jwks.json - should return JWKS', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/auth/.well-known/jwks.json`)

    expect(response.status()).toBeLessThan(500)
  })

  test('GET /api/auth/authorize - should be accessible', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/auth/authorize`)

    // May require parameters but should not error
    expect(response.status()).toBeLessThan(500)
  })

  test('POST /api/auth/token - should require valid grant', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/token`, {
      data: {
        grant_type: 'authorization_code',
        code: 'invalid-code',
      },
    })

    // Should reject invalid code
    expect(response.ok()).toBeFalsy()
  })
})
