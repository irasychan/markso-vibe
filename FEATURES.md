# Product Capability Decision Tree (Temporal Roadmap + BDD Source of Truth)

Track: current capabilities, upcoming scope, decisions. Always update THIS file before editing any `*.feature` file (red → green workflow). Status codes:
* [x] Implemented (passing scenarios)
* [~] Partial (scenarios exist; more to do)
* [ ] Not started
* [>] Open decision / question
* [#] Cancelled / superseded

Phases (macro timeline): Phase 0 (Done) → Phase 1 (Near Term) → Phase 2 (Exploratory) → Phase 3 (Deferred / Non‑Goals)

## Table of Contents
1. Core Expense Tracking (MVP Trunk)
2. Category Management (Branch A)
3. Expense Listing & Aggregation (Branch B)
4. Validation & UX Feedback (Cross‑Cutting)
5. Persistence Layer (Branch C)
6. Reporting & Insights (Branch D)
7. Non-Goals (Explicit)
8. Open Questions / Decisions
9. Tooling & Test Infrastructure
10. BDD Mapping Table
11. Update Workflow
12. Backlog (Next Targets)

## 0. Core Expense Tracking (MVP Trunk)
- [x] Expense Entry Basic
	- [x] Record expense: summary, amount, category (see `features/expense_entry.feature`)
	- [x] Validation: positive amount (reject ≤ 0)
	- [x] Validation: required non-empty summary
	    - [x] Create basic UI with NextJS App
	- [~] Category handling (partial: inline create + duplicate prevention done; length rules pending)
		- [x] Create inline if new (lowercased normalization)
		- [x] Prevent duplicates differing only by case/whitespace (silent-reuse implemented)
		- [#] ~~Enforce max length for category name (decide limit) [>]~~
	- [#] ~~Summary length limit (~100 chars) enforced [> decision: exact max]~~
	- [x] Amount: 2 decimal precision enforcement (reject >2 decimals)
	- [x] Blank category defaults to "uncategorized" (policy decision)
	- [x] Currency formatting decision & implementation (HKD en-HK)

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
- [ ] Accessibility scenario: keyboard-only submission & focus outline
- [ ] Axe-core (or similar) basic a11y audit script

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

## 7. Non-Goals (Phase 3 – Explicitly Deferred)
- [ ] Balance / multi-account ledger
- [ ] Multi-currency
- [ ] Authentication / user accounts
- [ ] Budget forecasting / predictive analytics

## 8. Open Questions / Decisions Needed
- [>] Category name max length?
- [>] Summary max length? (Proposal: 100 chars)
- [>] Persistence first step? (LocalStorage vs API route)
- [x] Decision: Currency formatting = Intl.NumberFormat('en-HK', { style:'currency', currency:'HKD' })
- [x] Decision: Category duplicate handling = silent-reuse
- [x] Decision: Amount precision policy = reject (>2 decimals => error)
- [x] Decision: Category mandatory policy = default-uncategorized (blank => "uncategorized")

## 9. Tooling & Test Infrastructure
- [x] Cucumber logic BDD suite (`npm run bdd:logic`)
- [x] Cucumber UI BDD scenarios (@ui tagged)
- [x] Playwright test runner integration (replaced start-server-and-test) (`npm run bdd:ui`)
- [x] Shadcn-style UI primitives (Button, Input, Card) adopted
- [ ] Add Playwright accessibility assertions (labels & roles)
- [ ] Introduce visual regression (optional, future) [>]

## 10. BDD Mapping Table (High Level)
| Tree Node | Feature File | Status |
|-----------|--------------|--------|
| Expense Entry Basic | `expense_entry.feature` | Implemented |
| Category duplicate prevention | `expense_entry.feature` / `ui_expense_entry.feature` | Implemented |
| Listing | (to be created) | Pending |
| Persistence | (to be created once path chosen) | Pending |

## 11. Update Workflow (Backlog → BDD → Code → Verification)
1. Select Scope:
	- Pick ONE backlog item and start with the `NEXT:` template in this file (Backlog section). Keep scope to 1–2 related nodes.
	- Mark checkbox/state in the tree (section 0+), and add any new decision bullets to section 7 (as [>] until decided).
2. Specify Acceptance:
	- Convert acceptance bullets into Gherkin scenarios. Prefer smallest set that drives implementation (red first).
3. Author / Modify Feature Files:
	- Logic/domain rules only: scenario without `@ui` tag (or add explicit `@logic`).
	- UI behavior / presentation: add `@ui` tagged scenario(s) in existing or new `ui_*.feature` file.
	- Keep selectors stable; only add new `data-test` attributes for new semantic elements.
4. Implement Step Definitions:
	- Logic steps: `features/step_definitions/*.ts`
	- UI steps: `features/step_definitions/ui/*.ts`
	- Reuse existing generic steps when possible; extend cautiously.
5. Run Focused Tests (Red → Green):
	- Logic only: `npm run bdd:logic`
	- UI Cucumber only: `npm run bdd:cucumber:ui` (not `bdd:ui` which is Playwright specs)
	- Expect new scenarios to fail first; implement minimal code to pass.
6. Code Implementation:
	- For UI, prefer server components unless interactivity needed.
	- Extract reusable formatting/helpers to `src/lib/*` (e.g., `money.ts`).
7. Broader Verification:
	- Playwright smoke/specs: `npm run bdd:ui` (ensure core flows still pass after change).
	- Full pipeline: `npm run bdd` (logic + cucumber UI + Playwright).
8. Decisions & Documentation:
	- Resolve any [>] open questions → convert to `[x] Decision:` lines in section 7.
	- Update mapping table if new feature file added; mark backlog checkbox done.
9. Quality Pass:
	- Run `npm run lint` if substantial code changes.
	- Confirm no unused selectors / dead steps (prune if obvious).
10. Commit / Next:
	- Keep commit scope aligned with single backlog item.
	- Choose next backlog item only after completing above and updating this file.
   
Notes:
	- `bdd:ui` (Playwright) complements cucumber `@ui` scenarios; cucumber drives behavior, Playwright provides independent smoke / future accessibility & visual tests.
	- Keep scenarios deterministic; avoid relying on relative timing or ordering beyond defined acceptance.

---
## 12. Backlog (Next Targets)
How to start the next task:
1. Pick ONE backlog item (or create a new bullet here first if missing).
2. Reply using the template below (copy & fill values) — I will then: (a) move it to "In Progress" inline, (b) add/adjust scenarios, (c) implement & test.

Reply Template:

To Analyze Task:
```
THINK:
item: <exact backlog bullet text>
depth: (shallow|auto|deep)
constraints:
    - <constraints 1>
optional_notes: <anything else>
```

To Start Next Task:
```
NEXT:
item: <exact backlog bullet text>
acceptance:
	- <concise bullet 1>
	- <bullet 2>
decisions:
	key1=value1
	key2=value2
optional_notes: <anything else>
```
Minimal Quick Form (shorthand accepted):
```
NEXT: accessibility
```
If the task needs decisions (e.g. length limits, persistence choice) include them under decisions. Omit sections you don’t need.

Backlog Items (grouped):
// Accessibility & UX
- [ ] Accessibility UI scenario (keyboard-only navigation, Enter submits, visible focus ring)
- [ ] Zero amount rejection UI scenario (explicit 0 case)
- [ ] Friendly error copy review pass (improve current validation messages)

// Testing & Quality
- [x] Tag strategy fix (make all logic scenarios @logic OR adjust bdd:logic to include untagged)
- [x] Full formatted currency assertion in Playwright spec (assert "HK$" prefix)
- [x] Reduce Playwright spec to minimal smoke (remove redundant behavioral assertions)
- [ ] Axe-core audit scaffold (basic accessibility scan in Playwright)
- [ ] Visual regression setup (optional snapshot baseline)
- [ ] Unified BDD runner script (merge cucumber + Playwright orchestration with a single `bdd:all` or refactor existing `bdd` for clarity)
- [ ] Scenario trace hook (@ui) start/stop Playwright trace & store artifact path
 - [x] Scenario trace hook (@ui) start/stop Playwright trace & store artifact path
- [ ] Journey visualization Phase A: scaffold (linear Mermaid per scenario + trace links)
 - [x] Journey visualization Phase A: scaffold (linear Mermaid per scenario + trace links) (script: journeys:gen)
- [ ] Duplication audit script (Gherkin steps vs Playwright spec assertions) & report
- [ ] Journey visualization Phase B: enforce de-duplication policy (<25% duplicated assertions)
- [ ] Journey visualization Phase C: step duration extraction + pass/fail node colorization
- [ ] Journey visualization Phase D: convergence decision gate (evaluate metrics for potential spec suite trimming)

// Domain / Architecture
- [x] Centralize validation logic (shared domain module used by UI + step defs)
- [ ] Category normalization explicit logic scenario (trim + lowercase assertion)

// Data & Features
- [ ] Timestamp field introduction (add createdAt to expenses) + adapt planned listing/reporting scenarios
- [ ] Listing chronological implementation & tests
- [ ] Persistence initial path (choose: LocalStorage vs API route) and implement chosen path

// Tooling / Maintenance
- [ ] Remove unused dependency (start-server-and-test) & add engines field to package.json
- [ ] Add Playwright accessibility assertions (labels & roles) (extends a11y coverage)
