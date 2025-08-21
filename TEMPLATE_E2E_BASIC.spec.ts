import { test, expect } from '@playwright/test';

/**
 * Template Basic E2E Tests
 * Copy this to e2e/basic.spec.ts in your project
 */

test.describe('Basic App Tests', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    
    // Update this selector based on your actual homepage
    await expect(page.locator('h1')).toBeVisible();
    
    // Check for common elements (adjust selectors)
    await expect(page.locator('body')).toBeVisible();
  });

  test('has correct page title', async ({ page }) => {
    await page.goto('/');
    
    // Update expected title for your app
    await expect(page).toHaveTitle(/Your App Name/); // Change this
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Update navigation tests based on your app structure
    // Example for typical nav links:
    // const navLinks = page.locator('nav a');
    // await expect(navLinks).toHaveCount(4); // Adjust count
    
    // Test specific navigation if you have it
    // await page.click('text=About');
    // await expect(page).toHaveURL(/.*about/);
  });

  test('404 page works', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Check for 404 content (adjust based on your 404 page)
    await expect(page.locator('body')).toContainText('404');
  });
});