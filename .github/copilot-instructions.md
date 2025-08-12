# Copilot Instructions for MarkSo

Purpose: Make AI coding agents immediately productive in this repo. Keep changes minimal, reference file paths, and align with the MVP and BDD-first workflow below.

- Stack: Next.js (prototype; not scaffolded yet), Tailwind CSS + shadcn/ui (later), SQLite (later), Cucumber.js + TypeScript (in place).
- Goal: MVP Daily Expense Tracker that categorizes remembered expenses; no account balances yet.
- Working style: BDD-first with fast prototyping. Feature files are the source of truth; implementation follows after review and setup.
- Current state: Base BDD harness exists (`package.json`, `cucumber.mjs`, `tsconfig.json`, `features/expenses/track_expense.feature`, `features/support/world.ts`, `features/support/hooks.ts`). Next.js app is not scaffolded yet. We are still in the setup phase—no implementation yet.

## Architecture intent (MVP)
- Simple flow: UI form -> validate -> persist to Postgres -> list/filter recent expenses.
- Minimal layers; keep data access in a small helper module and use file‑based routing by feature.
- For now: Use in-memory domain objects in BDD steps until persistence is introduced.

## Conventions for this repo
- BDD:
	- Feature files: `features/**/*.feature` (e.g., `features/expenses/track_expense.feature`).
	- Step definitions: `features/**/*.steps.ts` (create only after feature approval).
	- Support: `features/support/world.ts` (scenario context), `features/support/hooks.ts`.
- Routing (when UI added): Next.js app directory (e.g., `app/expenses/page.tsx`).
- Styling/UI (later): shadcn/ui components with Tailwind; colocate simple components under `components/`.
- Data (later): single local SQLite file (e.g., `data/markso.sqlite`), access via `lib/db.ts`.
- Tests: prefer colocated BDD step code with features; keep unit helpers under `lib/` where sensible.
 - Context docs: store living context under `wiki/`:
	 - `wiki/architecture.md` — current architecture and folder structure
	 - `wiki/features/*.md` — narrative feature docs (optional; Gherkin remains source of truth)
	 - `wiki/exploration/*.md` — research/spikes notes
	 - `wiki/debt.md` — technical/product debt log
 - Decision board: `where-are-we.md` — all major decisions and status
 - Context docs: store living context under `wiki/`:
	 - `wiki/architecture.md` — current architecture and folder structure
	 - `wiki/features/*.md` — narrative feature docs (optional; Gherkin remains source of truth)
	 - `wiki/exploration/*.md` — research/spikes notes
	 - `wiki/debt.md` — technical/product debt log

- BDD workflow (active now):
	1. Author/edit `.feature` files under `features/**`. Do not implement steps until the feature is reviewed/approved and setup is complete.
	2. Run `pnpm bdd --dry-run` to see undefined steps and snippets.
	3. After approval and setup, add step definitions in `features/**/*.steps.ts` and keep state in `features/support/world.ts` (start in-memory).
	4. Iterate until scenarios pass. Then consider wiring UI and persistence.
- App scaffold (later):
	- Initialize Next.js with the app router and Tailwind; add shadcn/ui.
	- Add `next dev` script and basic pages (see Files to create next).
- Database (later):
	- Create `data/` folder (exists), add `data/.gitignore` to ignore `*.sqlite` and backups.
	- Add a lightweight migration/seed script when introducing SQLite.

## Initial data model
- Expense: id, occurredAt (date), amountCents, currency, category, note, createdAt.
- Categories: start hardcoded in code; plan to migrate to a table if needed.

## Files present now
- `features/expenses/track_expense.feature` — first feature (source of truth).
- `features/support/world.ts`, `features/support/hooks.ts` — BDD support placeholders.
- `cucumber.mjs`, `package.json`, `tsconfig.json` — BDD tooling.
 - `wiki/architecture.md` — architecture notes (moved from root).
 - `where-are-we.md` — decision board

## Files to create next
- `app/expenses/page.tsx` — render list + form shell for new expense.
- `lib/db.ts` — open/create SQLite DB and expose basic CRUD.
- `types/expense.ts` — shared Expense type.
- `data/.gitignore` — ignore `*.sqlite` and backups.
- Optionally: `features/**/*.steps.ts` — step implementations (after feature approval).
 - `wiki/features/` (optional) — add narrative docs for larger features if needed.
 - `wiki/debt.md`, `wiki/exploration/` — context for debt and exploration

## Integration points
- Persistence: direct SQLite access from server components/server actions or a minimal API route (e.g., `app/api/expenses/route.ts`). Steps can exercise domain helpers directly.

## Open decisions to confirm before proceeding
- Package manager (npm/pnpm/yarn). Prefer `pnpm`; `npm` is acceptable.
- SQLite client (better‑sqlite3 vs Prisma) and whether to add migrations now.
- Test runner for unit tests (Vitest/Jest) and directory layout for specs.

Keep PRs small, reference affected files, and stay within the MVP scope. If something is unclear, add a short TODO and ask for confirmation in the PR description.
