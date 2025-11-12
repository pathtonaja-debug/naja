import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show sign up form', async ({ page }) => {
    await page.goto('/auth');
    await expect(page.getByText('Create Account')).toBeVisible();
  });

  test('should toggle between sign in and sign up', async ({ page }) => {
    await page.goto('/auth');
    await page.getByText("Don't have an account? Sign up").click();
    await expect(page.getByText('Create Account')).toBeVisible();
    
    await page.getByText('Already have an account? Sign in').click();
    await expect(page.getByText('Welcome Back')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/auth');
    await page.getByPlaceholder('your@email.com').fill('invalid-email');
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Browser validation should prevent submission
    const emailInput = page.getByPlaceholder('your@email.com');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('should require password minimum length', async ({ page }) => {
    await page.goto('/auth');
    await page.getByPlaceholder('your@email.com').fill('test@example.com');
    await page.getByPlaceholder('••••••••').fill('123');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    const passwordInput = page.getByPlaceholder('••••••••');
    await expect(passwordInput).toHaveAttribute('minlength', '6');
  });
});