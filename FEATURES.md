# Product Capability Decision Tree (Temporal Roadmap + BDD Source of Truth)

Purpose: Track what exists (implemented in feature files), what is next, and branching future options. Update BEFORE writing/changing any `*.feature` files. Use checkboxes:
- [x] Implemented (has passing scenarios)
- [~] Partial (some scenarios exist / more planned)
- [ ] Not started
- [>] Decision pending / open question

Root Timeline Phases:
Phase 0 (Done) → Phase 1 (Near Term) → Phase 2 (Exploratory) → Phase 3 (Deferred / Non‑Goals)

## 0. Core Expense Tracking (MVP Trunk)
- [x] Expense Entry Basic
	- [x] Record expense: summary, amount, category (see `features/expense_entry.feature`)
	- [x] Validation: positive amount (reject ≤ 0)
	- [x] Validation: required non-empty summary
    - [ ] Create basic UI with NextJS App
	- [~] Category handling
		- [x] Create inline if new (lowercased normalization)
		- [ ] Prevent duplicates differing only by case/whitespace (add scenario)
		- [ ] Enforce max length for category name (decide limit) [>]
	- [ ] Summary length limit (~100 chars) enforced [> decision: exact max]
	- [ ] Amount: 2 decimal precision enforcement (round / reject) (add scenario)

## 1. Category Management Enhancements (Branch A)
- [ ] List existing categories for selection (UI + step definition)
- [ ] Autocomplete / suggestions while typing
- [ ] Merge duplicate categories tool [> need persistence design]

## 2. Expense Listing & Aggregation (Branch B)
- [ ] Chronological list (newest first)
- [ ] Display fields: summary, formatted amount, category badge, timestamp
- [ ] Daily total aggregate (stretch)
- [ ] Filter by category
- [ ] Sort by amount / date toggle

## 3. Validation & UX Feedback (Cross-Cutting)
- [x] Inline error for negative/zero amount
- [x] Inline error for missing summary
- [ ] Inline error for empty/whitespace category
- [ ] Friendly error copy review pass (replace placeholder strings)
- [ ] Client-side formatting of amount input

## 4. Persistence Layer (Branch C - Choose Path)
- Current: in-memory only (step definitions array)
- Options (choose one → expand scenarios):
	- [ ] LocalStorage prototype
	- [ ] API route (Next.js `src/app/api/expenses`) + in-memory server store
	- [ ] Real DB (e.g. SQLite/Prisma) [> deferred until after UI listing]

## 5. Reporting & Insights (Future Branch D)
- [ ] Simple category spend totals (period = current day)
- [ ] Weekly total
- [ ] Export CSV

## 6. Non-Goals (Phase 3 – Explicitly Deferred)
- [ ] Balance / multi-account ledger
- [ ] Multi-currency
- [ ] Authentication / user accounts
- [ ] Budget forecasting / predictive analytics

## 7. Open Questions / Decisions Needed
- [>] Category name max length?
- [>] Summary max length? (Proposal: 100 chars)
- [>] Persistence first step? (LocalStorage vs API route)
- [>] Currency formatting (Use `Intl.NumberFormat('en-US', { style:'currency', currency:'USD' })`?)

## 8. BDD Mapping Table (High Level)
| Tree Node | Feature File | Status |
|-----------|--------------|--------|
| Expense Entry Basic | `expense_entry.feature` | Implemented |
| Category duplicate prevention | (add to `expense_entry.feature` or new `category_management.feature`) | Pending |
| Listing | (to be created) | Pending |
| Persistence | (to be created once path chosen) | Pending |

## 9. Update Workflow
1. Edit this file (toggle checkboxes / add nodes) before coding.
2. Add or adjust `.feature` files to mirror updated nodes.
3. Implement / update step definitions.
4. Run `npm run bdd` until green.
5. Only then adjust application UI / domain code.

---
Next Immediate Targets:
1. Switch to using playwright test runner instead of start-server-and-test for cleaner shutdown.
Create a UI to visualize what we have done so far, make sure to use BDD and playwright to confirm the UI.
