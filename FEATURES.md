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
	    - [x] Create basic UI with NextJS App
	- [~] Category handling
		- [x] Create inline if new (lowercased normalization)
		- [x] Prevent duplicates differing only by case/whitespace (silent-reuse implemented)
		- [ ] Enforce max length for category name (decide limit) [>]
	- [ ] Summary length limit (~100 chars) enforced [> decision: exact max]
	- [x] Amount: 2 decimal precision enforcement (reject >2 decimals)

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
- [x] Empty/whitespace category handled (auto defaults to "uncategorized" per decision, no error)
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
- [x] Decision: Category duplicate handling = silent-reuse
- [x] Decision: Amount precision policy = reject (>2 decimals => error)
- [x] Decision: Category mandatory policy = default-uncategorized (blank => "uncategorized")

## 8. BDD Mapping Table (High Level)
| Tree Node | Feature File | Status |
|-----------|--------------|--------|
| Expense Entry Basic | `expense_entry.feature` | Implemented |
| Category duplicate prevention | `expense_entry.feature` / `ui_expense_entry.feature` | Implemented |
| Listing | (to be created) | Pending |
| Persistence | (to be created once path chosen) | Pending |

## 9. Update Workflow (Logic + UI BDD)
1. Plan: Update this file first (checkboxes, add nodes, clarify decisions). Keep scope small (1–2 nodes per iteration).
2. Feature Files: Add/modify `.feature` with appropriate tag:
	- `@logic` (default / omit tag) for pure domain scenarios (no browser).
	- `@ui` for browser scenarios interacting with real page (Playwright).
3. Steps: Implement or extend step definitions under:
	- Logic: `features/step_definitions/*.ts`
	- UI: `features/step_definitions/ui/*.ts` (reuse data-test selectors; add new selectors if needed in UI code).
4. Run tests incrementally:
	- Domain only: `npm run bdd:logic`
	- UI only: `npm run bdd:ui`
	- Full suite: `npm run bdd`
5. Make UI/code changes only after red → green cycle for new scenarios.
6. Update this file again if any scope shifted during implementation (avoid drift).
7. Open Questions: Convert resolved [>] items into concrete limits / decisions here before enforcing in code.

---
Next Immediate Targets:
1. [x] Replace start-server-and-test with Playwright test runner (scripts updated: `bdd:ui`).
2. [x] Add shadcn-style UI primitives & refactor form (Button, Input, Card) preserving data-test selectors.
3. [ ] Add accessibility UI scenario (keyboard submit + label association) & axe-core scan (future enhancement).
4. [ ] Decide summary/category max lengths and implement validation.
5. [ ] Choose persistence path (likely LocalStorage) and create `persistence_local.feature`.
