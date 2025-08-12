<div align="center">
	<h1>markso-vibe</h1>
	<p><strong>BDD‑driven Expense Tracking MVP</strong> built with Next.js 15 (App Router), Tailwind CSS v4, TypeScript, Cucumber & Playwright.</p>
</div>

## 1. Overview
Incremental expense tracking prototype. Functional scope & decisions live in `FEATURES.md` (single source of truth + temporal roadmap). Each change begins by updating/adding Gherkin scenarios (red → green) before implementation.

Current state (see `FEATURES.md` for detail):
* Core expense entry (summary, amount, category) implemented.
* Validation: required summary, positive amount, max 2 decimals (reject >2), blank category defaults to `uncategorized`.
* Category normalization + duplicate (case/whitespace) reuse.
* Currency formatting: HKD via `Intl.NumberFormat('en-HK', { style: 'currency', currency: 'HKD' })`.
* In‑memory storage only (no persistence yet).

## 2. Tech Stack
* Next.js 15 (App Router)
* Tailwind CSS v4 (design tokens in `globals.css`)
* TypeScript (strict, noEmit)
* Cucumber (`@cucumber/cucumber`) for logic & UI BDD (`@ui` tag) — also provides a consistent, human-readable step layer we can later transform into a visual user journey (overlaying Playwright traces / generating a flow graph)
* Playwright for smoke / spec tests (and future a11y / visual)
* Shadcn‑style minimal UI primitives (Button, Input, Card)

## 3. Installation
```bash
npm install
```
Node version: 24 LTS (recommend using `nvm` / `fnm`).

## 4. Scripts
```bash
npm run dev                # Start Next.js (Turbopack)
npm run build              # Production build
npm run start              # Start built app
npm run lint               # ESLint (next/core-web-vitals)

# BDD / Tests
npm run bdd:logic          # Cucumber (logic / domain) scenarios (@logic or untagged)
npm run bdd:cucumber:ui    # Cucumber UI scenarios (@ui tagged)
npm run bdd:ui             # Playwright test runner (smoke/spec tests)
npm run bdd                # logic + cucumber UI + Playwright (full pipeline)
```

## 5. Workflow (Summary)
1. Select ONE backlog item (see `FEATURES.md` Backlog) and declare it using the `NEXT:` template inside that file.
2. Add/modify Gherkin scenarios first (expect failing tests).
3. Run focused tests:
	 * Logic: `npm run bdd:logic`
	 * UI (Cucumber): `npm run bdd:cucumber:ui`
4. Implement minimal code to go green (domain or UI). Prefer server components unless interactivity is required.
5. Run Playwright (`npm run bdd:ui`) for regression smoke.
6. Update `FEATURES.md` (checkboxes, decisions). Resolve open questions (`[>]`) into concrete `[x] Decision:` lines.
7. Commit (single logical change) referencing the backlog item.

Expanded workflow: section 11 of `FEATURES.md`.

## 6. Key Decisions (Snapshot)
| Area | Decision |
|------|----------|
| Currency | HKD, locale `en-HK`, `Intl.NumberFormat`, grouping enabled |
| Category duplicate handling | Silent reuse (case/whitespace normalized lowercased) |
| Blank category | Auto → `uncategorized` |
| Amount precision | Reject inputs > 2 decimals (no rounding) |
| Storage (current) | In‑memory array (UI state / step defs) |

Refer to section 7 in `FEATURES.md` for authoritative list.

## 7. Adding Features / Changes
1. Update `FEATURES.md` (add node / mark partial / create decision placeholder).
2. Write scenarios (logic vs `@ui`). Keep them deterministic and minimal.
3. Extend or reuse step definitions (`features/step_definitions/**`).
4. Implement code (extract helpers to `src/lib/` when reusable, e.g., `money.ts`).
5. Ensure all tests pass (`npm run bdd`).
6. Document final decisions & mark checklist.

## 8. Directory Highlights
```
src/app/            # App Router pages (avoid re-importing fonts; layout sets them)
src/components/ui/  # Shadcn-style primitives
src/lib/            # Pure helpers (formatting, etc.)
features/           # Gherkin feature files + step definitions
tests/              # Playwright spec tests (non-Cucumber)
```

## 9. Accessibility & Quality (Planned)
Planned: keyboard-only accessibility scenario, axe-core audit, visual regression, error copy pass (track in `FEATURES.md`).

## 10. Contributing (Humans & AI Agents)
* Always start with `FEATURES.md` update before code.
* Keep PR scope to one backlog item.
* Maintain stable `data-test` selectors (add new ones if semantically needed; do not repurpose).
* Avoid introducing global CSS outside tokens; prefer Tailwind utilities.
* AI agents: follow `.github/copilot-instructions.md` for repo conventions.

## 11. Deployment
Standard Next.js deployment (e.g., Vercel). Run:
```bash
npm run build && npm start
```
Ensure tests pass locally before deploying.

## 12. Future Directions
See phases in `FEATURES.md`: category listing & autocomplete, persistence path, listing & aggregation, reporting.

### (Why Gherkin – Additional Rationale)
Beyond executable specifications & shared language, Gherkin step structure lets us: (a) map each scenario into a directed flow graph, (b) pair each Given/When/Then with Playwright trace segments, and (c) auto‑generate journey visualizations (e.g., Mermaid diagrams or timeline overlays). This upcoming capability is why we retain Gherkin alongside raw Playwright specs.

---
Generated from evolving BDD roadmap—update README sections if structural shifts occur beyond what `FEATURES.md` already captures.
