import { test, expect } from '@playwright/test'
import { API_BASE_URL } from './test-config'

test.describe('Email Verification Page', () => {
  test('should display email verification sent page', async ({ page }) => {
    await page.goto('/auth/verification/email-sent')
    await expect(page).toHaveURL(/verification\/email-sent/)
  })

  test('should display verify email page with email param', async ({ page }) => {
    await page.goto('/auth/verify/test@example.com')
    await expect(page).toHaveURL(/verify\/test@example.com/)
  })
})

test.describe('API: Email Verification Endpoints', () => {
  test('GET /api/auth/verification/email/:email - should return response', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/auth/verification/email/test@example.com`)

    // Should return some response (may need valid token)
    expect(response.status()).toBeLessThan(500)
  })

  test('POST /api/auth/verification/email/resend - should accept email', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/verification/email/resend`, {
      data: {
        email: 'test@example.com',
      },
    })

    // Should process request (may return success or not found)
    expect(response.status()).toBeLessThan(500)
  })

  test('POST /api/auth/verification/email/resend - should require email', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/verification/email/resend`, {
      data: {},
    })

    expect(response.ok()).toBeFalsy()
  })
})

test.describe('API: User Validation', () => {
  test('GET /api/auth/validate/:id/:token - should require valid params', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/auth/validate/invalid-id/invalid-token`)

    // Should reject invalid token
    expect(response.ok()).toBeFalsy()
  })
})
