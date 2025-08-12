import { Given, When, Then, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { chromium, Browser, Page } from 'playwright';
import assert from 'node:assert';

let browser: Browser; let page: Page;

BeforeAll(async () => {
  browser = await chromium.launch();
});

AfterAll(async () => {
  await browser.close();
});

Given('I open the expense entry page', async () => {
  page = await browser.newPage();
  await page.goto('http://localhost:3000/');
});

When('I fill the summary field with {string}', async (value: string) => {
  await page.fill('[data-test="summary"]', value);
});

When('I fill the amount field with {string}', async (value: string) => {
  await page.fill('[data-test="amount"]', value);
});

When('I fill the category field with {string}', async (value: string) => {
  await page.fill('[data-test="category"]', value);
});

When('I submit the expense form', async () => {
  await page.click('[data-test="submit-expense"]');
});

Then('I should see an expense row with summary {string} amount {string} category {string}', async (summary: string, amount: string, category: string) => {
  const row = await page.locator('[data-test="expense-row"]').filter({ hasText: summary });
  await assertRow(row, amount, category);
});

Then('I should see an inline error {string}', async (message: string) => {
  await page.waitForSelector(`[data-test="error"]:has-text("${message}")`);
});

async function assertRow(row: import('playwright').Locator, amount: string, category: string) {
  await row.waitFor();
  const text = await row.textContent();
  assert(text && text.includes(amount), 'Amount not found in row');
  assert(text && text.includes(category), 'Category not found in row');
}
