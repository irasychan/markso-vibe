import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';

interface Expense { summary: string; amount: number; category: string; }

const expenses: Expense[] = [];
const categories = new Set<string>();
let lastError: string | null = null;

Given('the expense list is empty', function () {
  expenses.length = 0;
  categories.clear();
  lastError = null;
});

When('I enter an expense with summary {string} amount {float} category {string}', function (summary: string, amount: number, category: string) {
  lastError = null;
  if (!summary || summary.trim() === '') {
    lastError = 'Summary is required';
    return;
  }
  if (amount <= 0) {
    lastError = 'Amount must be positive';
    return;
  }
  const normalizedCategory = category.trim().toLowerCase();
  if (!categories.has(normalizedCategory)) {
    categories.add(normalizedCategory);
  }
  expenses.push({ summary: summary.trim(), amount, category: normalizedCategory });
});

Then('the expense is stored', function () {
  assert.ok(expenses.length > 0, 'Expected at least one expense');
});

Then('the category {string} is available for future selection', function (category: string) {
  const normalizedCategory = category.trim().toLowerCase();
  assert.ok(categories.has(normalizedCategory), 'Category not recorded');
});

Then('I see a validation error {string}', function (message: string) {
  assert.strictEqual(lastError, message);
});
