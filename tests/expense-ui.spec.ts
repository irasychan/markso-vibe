import { test, expect } from '@playwright/test';

test.describe('Expense Entry UI (Playwright runner smoke)', () => {
  test('add valid expense', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-test="summary"]', 'Coffee');
    await page.fill('[data-test="amount"]', '3.50');
    await page.fill('[data-test="category"]', 'Food');
    await page.click('[data-test="submit-expense"]');
    const rows = page.locator('[data-test="expense-row"]');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('Coffee');
    await expect(rows.first()).toContainText('3.50');
    await expect(rows.first()).toContainText('food');
  });

  test('reject >2 decimal amount', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-test="summary"]', 'Rounding');
    await page.fill('[data-test="amount"]', '3.567');
    await page.fill('[data-test="category"]', 'Misc');
    await page.click('[data-test="submit-expense"]');
    await expect(page.locator('[data-test="error"]')).toHaveText('Amount must have at most 2 decimals');
  });
});
