import { test, expect } from '@playwright/test'

test('homepage renders correctly', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Halbon SaaS Template/)
})

test('healthz endpoint works', async ({ page }) => {
  await page.goto('/api/healthz')
  await expect(page.locator('body')).toContainText(`"ok":true`)
})
