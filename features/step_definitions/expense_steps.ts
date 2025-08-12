import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { validateAndBuildExpense } from '../../src/lib/expense.ts';

interface Expense { summary: string; amount: number; category: string; }

const expenses: Expense[] = [];
const categories = new Set<string>();
let lastError: string | null = null;

Given('the expense list is empty', function () {
  expenses.length = 0;
  categories.clear();
  lastError = null;
});

When('I enter an expense with summary {string} amount {string} category {string}', function (summary: string, amountRaw: string, category: string) {
  lastError = null;
  const result = validateAndBuildExpense({ summary, amountRaw, category });
  if (!result.ok) {
    lastError = result.error;
    return;
  }
  // category normalization & duplicate handling
  if (!categories.has(result.expense.category)) {
    categories.add(result.expense.category);
  }
  expenses.push(result.expense);
});

// Backward compatibility: legacy float pattern (will be migrated to string form in future)
When('I enter an expense with summary {string} amount {float} category {string}', function (summary: string, amountNum: number, category: string) {
  lastError = null;
  const amountRaw = amountNum.toString();
  const result = validateAndBuildExpense({ summary, amountRaw, category });
  if (!result.ok) {
    lastError = result.error;
    return;
  }
  if (!categories.has(result.expense.category)) {
    categories.add(result.expense.category);
  }
  expenses.push(result.expense);
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
