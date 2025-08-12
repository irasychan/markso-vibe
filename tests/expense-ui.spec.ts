import { test, expect } from '@playwright/test';

// Minimal smoke: verifies app loads and a basic expense can be added.
// Detailed behavioral / formatting / validation coverage lives in Gherkin @ui scenarios.
// Add new assertions here ONLY if they are not representable as a user-facing scenario.
test.describe('Expense Entry UI (smoke)', () => {
  test('smoke: submit a valid expense creates one row', async ({ page }) => {
    await page.goto('/');
    await page.fill('[data-test="summary"]', 'Coffee');
    await page.fill('[data-test="amount"]', '3.50');
    await page.fill('[data-test="category"]', 'Food');
    await page.click('[data-test="submit-expense"]');
    const rows = page.locator('[data-test="expense-row"]');
    await expect(rows).toHaveCount(1);
    await expect(rows.first()).toContainText('Coffee'); // minimal assertion
  });
});
