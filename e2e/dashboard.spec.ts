import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test('should display dashboard elements', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check for main elements
    await expect(page.getByText('Assalamu Alaikum')).toBeVisible();
    await expect(page.getByText(/Dhikr/i)).toBeVisible();
  });

  test('should increment dhikr counter', async ({ page }) => {
    await page.goto('/dashboard');
    
    const tapButton = page.getByRole('button', { name: /tap/i });
    await expect(tapButton).toBeVisible();
    
    // Click tap button
    await tapButton.click();
    await expect(page.getByText('1')).toBeVisible();
    
    await tapButton.click();
    await expect(page.getByText('2')).toBeVisible();
  });

  test('should reset dhikr counter', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Increment counter
    const tapButton = page.getByRole('button', { name: /tap/i });
    await tapButton.click();
    await expect(page.getByText('1')).toBeVisible();
    
    // Reset
    const resetButton = page.getByRole('button', { name: /reset/i });
    await resetButton.click();
    await expect(page.getByText('0')).toBeVisible();
  });

  test('should navigate between tabs', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Navigate to Journal
    await page.getByRole('link', { name: /journal/i }).click();
    await expect(page).toHaveURL(/\/journal/);
    
    // Navigate to Habits
    await page.getByRole('link', { name: /habits/i }).click();
    await expect(page).toHaveURL(/\/habits/);
    
    // Navigate to Duas
    await page.getByRole('link', { name: /duas/i }).click();
    await expect(page).toHaveURL(/\/duas/);
    
    // Navigate to Profile
    await page.getByRole('link', { name: /profile/i }).click();
    await expect(page).toHaveURL(/\/profile/);
    
    // Back to Dashboard
    await page.getByRole('link', { name: /dashboard|home/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
  });
});