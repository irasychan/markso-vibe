# Feature List (Source of Truth)

Derived from product POC description. Each bullet will become one or more Gherkin *.feature scenarios.

## Expense Entry (MVP)
- User can record an expense with: summary (short description), amount, category.
- Category can be selected from existing or created inline if it does not exist.
- Amount must be a positive number with up to 2 decimal places.
- Summary is required (non-empty, trimmed) and limited to a reasonable length (tbd ~100 chars).
- Category names are case-insensitive unique.

## Category Management (Inline Lightweight)
- When user types a new category name, system offers to create it.
- Prevent duplicate categories differing only by case or surrounding whitespace.

## Listing & Basic Viewing (Future Increment)
- View a chronological list of recorded expenses (newest first).
- Show summary, amount (formatted), category badge, and created timestamp.
- Total sum for the current day (stretch later).

## Validation & Feedback
- Inline validation errors: missing summary, invalid/negative amount, empty category.
- Helpful error messages (concise, user-facing copy TBD—placeholder acceptable initially).

## Non-Goals (For Now)
- No balance / account tracking.
- No multi-currency support.
- No authentication / user accounts.
- No budgeting / forecasting logic.

## Open Questions
- Max number of categories? (Not defined.)
- Locale / currency formatting approach? (Default to en-US USD initially.)
- Persistence layer? (Not implemented; decide: local in-memory, localStorage, or API.)

---
Next Step: Derive `features/expense_entry.feature` & `features/category_management.feature` from above. Keep FEATURES.md updated before changing feature files.
