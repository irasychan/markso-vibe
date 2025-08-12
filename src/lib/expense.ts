// Centralized expense validation & normalization
// Decisions enforced:
// - summary must be non-empty after trim -> error "Summary is required"
// - amount must be > 0
// - amount must have at most 2 decimals (reject, no rounding)
// - reject scientific notation (only plain decimal pattern accepted)
// - blank / whitespace category -> 'uncategorized'
// - category normalized: trim + lowercase

export interface RawExpenseInput {
  summary: string;
  amountRaw: string; // original user-entered string
  category: string;
}

export interface Expense {
  summary: string;
  amount: number; // validated numeric amount
  category: string; // normalized
}

export type ValidationResult =
  | { ok: true; expense: Expense }
  | { ok: false; error: string };

const DECIMAL_PATTERN = /^\d+(?:\.\d+)?$/; // plain decimal (no sign, handled separately), allows trailing "."?

/** Normalize category: trim, lowercase; blank -> 'uncategorized' */
export function normalizeCategory(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  return trimmed ? trimmed : 'uncategorized';
}

export function validateAndBuildExpense(input: RawExpenseInput): ValidationResult {
  const summary = input.summary.trim();
  if (!summary) {
    return { ok: false, error: 'Summary is required' };
  }

  const amountStr = input.amountRaw.trim();
  // Accept a trailing decimal point (e.g., '5.') by treating it as integer part
  const normalizedAmountStr = amountStr.endsWith('.') ? amountStr.slice(0, -1) : amountStr;

  // Must be plain decimal digits + optional fraction (reject signs & scientific notation separately)
  if (!DECIMAL_PATTERN.test(normalizedAmountStr)) {
    // Could be negative, zero, or scientific notation; parse to decide which existing message to reuse
    const parsed = Number(amountStr);
    if (!(parsed > 0)) {
      return { ok: false, error: 'Amount must be positive' };
    }
    // Positive but pattern invalid (e.g. scientific notation or extra chars) -> map to decimals error per decision to avoid new message
    return { ok: false, error: 'Amount must have at most 2 decimals' };
  }

  const num = Number(normalizedAmountStr);
  if (!(num > 0)) {
    return { ok: false, error: 'Amount must be positive' };
  }

  const decimalsPart = normalizedAmountStr.includes('.') ? normalizedAmountStr.split('.')[1] : '';
  if (decimalsPart.length > 2) {
    return { ok: false, error: 'Amount must have at most 2 decimals' };
  }

  const category = normalizeCategory(input.category);

  return { ok: true, expense: { summary, amount: num, category } };
}
