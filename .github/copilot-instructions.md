## AI Contributor Guide

Purpose: Fast orientation for automated agents contributing to this Next.js 15 + Tailwind v4 + TypeScript + Cucumber + Playwright expense tracking MVP.

### 1. Core Layout
* Routes live under `src/app/`. `layout.tsx` imports fonts once and exposes CSS vars (`--font-geist-*`). Never re-import fonts.
* Prefer server components; only add `"use client"` when event handlers or browser APIs are required.
* New route: `src/app/<segment>/page.tsx` (default export). Keep it thin; push reusable UI into `src/components/` (already has shadcn-style primitives under `ui/`).

### 2. Styling & Tokens
* Tailwind v4 + `@theme inline` in `globals.css` maps design tokens.
* Adding a color/token:
	1. Add raw CSS var in `:root` (e.g. `--brand-accent: #...;`).
	2. Map to semantic token inside `@theme inline` (e.g. `--color-accent: var(--brand-accent);`).
	3. Use via Tailwind utility (`bg-accent` if configured) or `text-[color:var(--color-accent)]` fallback.
* Only edit `globals.css` for new tokens; prefer utilities elsewhere.

### 3. Imports & Paths
* Use `@/*` alias for anything under `src/`: `import { formatAmount } from '@/lib/money'`.
* Collocate only route‑specific assets next to their `page.tsx`.

### 4. Domain Helpers
* Shared validation & normalization lives in `src/lib/expense.ts` (and related helpers in `money.ts`, `utils.ts`). Always extend these, do not duplicate logic in UI or step definitions.

### 5. BDD & Testing Strategy
* Single source of functional truth: `FEATURES.md`. Update it BEFORE modifying feature files.
* Gherkin feature files under `features/` drive implementation (red → green):
	* Logic scenarios: untagged or `@logic`.
	* UI behavior: `@ui`.
	* Planned: `@a11y`, `@visual`, `@smoke` (for selective non-functional runs), future `@journey` metadata.
* Scripts:
	* `npm run bdd:logic` → logic scenarios
	* `npm run bdd:cucumber:ui` → Cucumber UI scenarios
	* `npm run bdd:ui` → Playwright spec suite (smoke + future a11y/visual)
	* `npm run bdd` → combined pipeline
* Avoid adding Playwright spec assertions for behavior already expressed in Gherkin (prevents duplication). If a spec uncovers missing acceptance, migrate that assertion into a scenario.
* Keep steps high-level & business-facing; factor technical detail into helpers.

### 6. Journey Visualization (Roadmap)
Planned phased tasks (see `FEATURES.md` backlog): trace hook → Phase A Mermaid diagrams → duplication audit → timings & pass/fail coloring → convergence decision gate. When adding hooks, tag-scope them (only start traces for `@ui`). Generate artifacts into a future `docs/journeys/` (not committed until decided).

### 7. Assets
* Static assets: `public/`. Reference via `/file.svg`. Use `<Image />` only for raster / optimization; inline or `<img>` fine for simple SVGs.
* Add new raster images sparingly; prefer existing vector style.

### 8. Tooling / Environment
* Node 24 LTS. Keep `package-lock.json`; if you migrate package manager you must remove the old lockfile and commit the new one in the same change.
* TypeScript strict; avoid `any`. Use `unknown` + narrowing where necessary.
* ESLint (`next/core-web-vitals`) must be clean (warnings in performance/a11y should be fixed, not ignored).

### 9. Performance & DX
* Do not block the critical path with heavy client components.
* Reuse layout font & token variables; no duplicate font or global style declarations.
* Keep components focused; extract pure logic into `src/lib/`.

### 10. Contribution Guardrails
* ALWAYS:
	1. Update `FEATURES.md` (add or adjust node, decisions) before changing code/tests.
	2. Add/modify feature scenarios → watch them fail → implement minimal code to pass.
	3. Reuse existing step definitions where possible; extend with intent‑revealing wording.
	4. Run focused script(s) (`bdd:logic`, `bdd:cucumber:ui`) then `bdd` before commit.
* NEVER:
	* Re-import fonts or duplicate validation logic.
	* Introduce behavioral assertions in Playwright specs already covered by Gherkin.
	* Rename existing `data-test` attributes; add new ones if needed (stable selectors contract).

### 11. Tags (Current & Upcoming)
| Tag | Purpose | Notes |
|-----|---------|-------|
| @logic | Pure domain rule | No UI interaction |
| @ui | UI behavior / presentation | Eligible for trace capture |
| @smoke | Lean health subset (future) | Subset of @ui |
| @a11y | Accessibility scanning (planned) | Will invoke axe routine |
| @visual | Visual regression snapshot (planned) | Only stable layouts |
| @journey | (future) mark scenarios for enriched diagram generation | Superset of @ui |

### 12. Adding / Modifying Steps
* Keep step regex simple & intention-focused.
* Prefer parameter types (`{int}`, quoted strings) over broad `(.*)` capture where feasible.
* Internal utilities go in `src/lib/` or a localized helper file, not inline inside step bodies if reused.

### 13. Documentation Hygiene
* README: update only if structure/stack meaningfully changes; minor backlog/status changes stay in `FEATURES.md`.
* `FEATURES.md`: maintain decisions list (convert `[>]` → `[x] Decision:` when finalized).
* Reflect any new test tag or journey phase addition here in this guide.

### 14. Open Gaps / Future Enhancements
* Automated journey diagram generator CLI script.
* Tag strategy lint (enforce all domain scenarios explicitly tagged or default policy).
* a11y & visual hooks wiring.
* Persistence path selection (LocalStorage vs API route) → will add data layer section when chosen.

### 15. Quick Checklist Before Commit (AI or Human)
1. `FEATURES.md` updated? (scope + decisions)
2. New/changed scenarios passing locally? (`npm run bdd`)
3. No duplicated behavioral assertions in specs?
4. Lint clean? (`npm run lint`)
5. Docs (README / this file) updated only if needed?

If blocked, leave a concise NOTE in `FEATURES.md` under Open Questions rather than guessing.

---
Feedback: Add missing sections you discover (submit PR adjusting this guide) rather than embedding ad-hoc explanations in code comments.
