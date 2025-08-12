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
  // Amount precision policy: reject if more than 2 decimals
  const decimals = amount.toString().split('.')[1];
  if (decimals && decimals.length > 2) {
    lastError = 'Amount must have at most 2 decimals';
    return;
  }
  let normalizedCategory = category.trim().toLowerCase();
  if (!normalizedCategory) {
    normalizedCategory = 'uncategorized'; // default policy
  }
  if (!categories.has(normalizedCategory)) {
    categories.add(normalizedCategory); // silent reuse otherwise
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

Then('the category set size is {int}', function (expected: number) {
  assert.strictEqual(categories.size, expected);
});

Then('the last expense category is {string}', function (expected: string) {
  assert.ok(expenses.length > 0, 'No expenses recorded');
  const last = expenses[expenses.length - 1];
  assert.strictEqual(last.category, expected);
});
