import { Given, When, Then, BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';
import { chromium, type Browser, type Page } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert';

let browser: Browser; let page: Page;
let tracingActive = false;
let currentTracePath: string | null = null;

function slugify(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'scenario';
}

const tracesDir = path.join(process.cwd(), 'test-results', 'traces');

BeforeAll(async () => {
  browser = await chromium.launch();
  await fs.mkdir(tracesDir, { recursive: true });
});

AfterAll(async () => {
  await browser.close();
});

// Start a fresh page + tracing before each @ui scenario
Before({ tags: '@ui' }, async function (scenario) {
  page = await browser.newPage();
  const scenarioName = slugify(scenario.pickle.name);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  currentTracePath = path.join(tracesDir, `${timestamp}-${scenarioName}.zip`);
  tracingActive = true;
  await page.context().tracing.start({ screenshots: true, snapshots: true, title: scenario.pickle.name });
});

// Stop tracing & export after scenario
After({ tags: '@ui' }, async function () {
  if (tracingActive) {
    try {
      await page.context().tracing.stop({ path: currentTracePath! });
      this.attach(`Trace saved: ${path.relative(process.cwd(), currentTracePath!)}`);
    } catch (err) {
      this.attach(`Trace stop failed: ${(err as Error).message}`);
    }
  }
  tracingActive = false;
  currentTracePath = null;
  await page.close();
});

Given('I open the expense entry page', async () => {
  // Page is prepared in Before hook; just navigate (navigation captured in trace)
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

Then('I should see only {int} distinct category label {string}', async (count: number, category: string) => {
  const locators = await page.locator('[data-test="expense-row"]').all();
  const found = new Set<string>();
  for (const row of locators) {
    const text = await row.textContent();
    if (text && text.includes(category)) found.add(category);
  }
  if (found.size !== count) {
    throw new Error(`Expected ${count} distinct '${category}' categories, found ${found.size}`);
  }
});

async function assertRow(row: import('playwright').Locator, amount: string, category: string) {
  await row.waitFor();
  const text = await row.textContent();
  assert(text && text.includes(amount), 'Amount not found in row');
  assert(text && text.includes(category), 'Category not found in row');
}
