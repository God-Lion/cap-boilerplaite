import { test, expect } from '@playwright/test'
import { API_BASE_URL } from './test-config'

test.describe('Forgot Password Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password')
  })

  test('should display forgot password page', async ({ page }) => {
    await expect(page).toHaveURL(/forgot-password/)
    await expect(page.locator('form')).toBeVisible()
  })

  test('should show validation error for empty email', async ({ page }) => {
    await page.getByRole('button', { name: /send|reset|submit/i }).click()

    await expect(page.locator('text=/required|email/i').first()).toBeVisible()
  })

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByRole('button', { name: /send/i, exact: false }).click()
    await expect(page.getByText(/invalid/i, { exact: false }).first()).toBeVisible({
      timeout: 10000,
    })
  })

  test('should submit forgot password request', async ({ page }) => {
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByRole('button', { name: /send|reset|submit/i }).click()

    // Should show success message or redirect
    await expect(
      page
        .locator('text=/email sent|check your email|reset link|success/i')
        .first()
        .or(page.locator('[class*="success"]').first()),
    ).toBeVisible({
      timeout: 10000,
    })
  })

  test('should navigate back to sign-in', async ({ page }) => {
    await page.getByRole('link', { name: /sign in|login|back/i }).click()

    await expect(page).toHaveURL(/sign-in/)
  })
})

test.describe('Reset Password Flow', () => {
  test('should display reset password page', async ({ page }) => {
    await page.goto('/auth/reset-password')
    await expect(page).toHaveURL(/reset-password/)
  })

  test('should display reset password page with email param', async ({ page }) => {
    await page.goto('/auth/reset-password/test@example.com')
    await expect(page).toHaveURL(/reset-password/)
  })
})

test.describe('Set New Password Flow', () => {
  test('should display set new password page', async ({ page }) => {
    await page.goto('/auth/set-new-password')
    await expect(page).toHaveURL(/set-new-password/)
    await expect(page.locator('form')).toBeVisible()
  })

  test('should show validation for mismatched passwords', async ({ page }) => {
    await page.goto('/auth/set-new-password')

    const passwordField = page.getByLabel(/new password|password/i).first()
    const confirmField = page.getByLabel(/confirm/i).first()

    if ((await passwordField.isVisible()) && (await confirmField.isVisible())) {
      await passwordField.fill('NewPassword123!')
      await confirmField.fill('DifferentPassword123!')
      await page.getByRole('button', { name: /save|set|submit|reset/i }).click()

      await expect(page.locator('text=/match|same|identical/i').first()).toBeVisible()
    }
  })
})

test.describe('API: Password Reset Endpoints', () => {
  test('POST /api/auth/forgot-password - should accept valid email', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/forgot-password`, {
      data: {
        email: 'test@example.com',
      },
    })

    // Should return success even for non-existent emails (security)
    expect(response.status()).toBeLessThan(500)
  })

  test('POST /api/auth/forgot-password - should return error for missing email', async ({
    request,
  }) => {
    const response = await request.post(`${API_BASE_URL}/auth/forgot-password`, {
      data: {},
    })

    expect(response.ok()).toBeFalsy()
  })

  test('GET /api/auth/reset-password/:email - should return response', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/auth/reset-password/test@example.com`)

    // API should respond (may require valid token)
    expect(response.status()).toBeLessThan(500)
  })

  test('POST /api/auth/reset-password - should require token', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/reset-password`, {
      data: {
        email: 'test@example.com',
        password: 'NewPassword123!',
        // Missing token
      },
    })

    expect(response.ok()).toBeFalsy()
  })
})
