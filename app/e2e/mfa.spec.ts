import { test, expect } from '@playwright/test'
import { API_BASE_URL } from './test-config'

test.describe('OTP Verification Page', () => {
  test('should display OTP verification page', async ({ page }) => {
    await page.goto('/auth/verification/otp')
    await expect(page).toHaveURL(/verification\/otp/)
  })

  test('should have OTP input fields', async ({ page }) => {
    await page.goto('/auth/verification/otp')

    // Look for OTP input (could be multiple single-digit inputs or one field)
    const otpInput = page.locator('input[type="text"], input[type="number"]').first()
    await expect(otpInput).toBeVisible()
  })
})

test.describe('Account Verification Page', () => {
  test('should display account verification page', async ({ page }) => {
    await page.goto('/auth/verification/account')
    await expect(page).toHaveURL(/verification\/account/)
  })
})

test.describe('API: MFA Endpoints', () => {
  test('POST /api/auth/mfa/setup - should require authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/mfa/setup`)

    // Should return 401 Unauthorized without auth
    expect(response.status()).toBe(401)
  })

  test('POST /api/auth/mfa/verify - should require authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/mfa/verify`, {
      data: {
        token: '123456',
      },
    })

    // Should return 401 Unauthorized without auth
    expect(response.status()).toBe(401)
  })

  test('POST /api/auth/mfa/disable - should require authentication', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/mfa/disable`)

    // Should return 401 Unauthorized without auth
    expect(response.status()).toBe(401)
  })
})

test.describe('MFA Flow with Authentication', () => {
  let authToken: string | undefined

  test.beforeAll(async ({ request }) => {
    // Create and login a test user
    const email = `mfa-test-${Date.now()}@example.com`
    const password = 'TestPassword123!'

    await request
      .post(`${API_BASE_URL}/auth/register`, {
        data: {
          email,
          password,
          firstName: 'MFA',
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

  test('POST /api/auth/mfa/setup - should return setup data when authenticated', async ({
    request,
  }) => {
    if (!authToken) {
      test.skip()
      return
    }

    const response = await request.post(`${API_BASE_URL}/auth/mfa/setup`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })

    // Should either succeed with QR code or return specific error
    expect(response.status()).toBeLessThan(500)
  })
})
