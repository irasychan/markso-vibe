## AI Contributor Guide

Concise orientation for automated agents in this Next.js 15 + Tailwind v4 app (App Router).

### Core Layout & Structure
- All routes under `src/app/`; `layout.tsx` owns font imports (`next/font` Geist) and exposes CSS vars (`--font-geist-*`). Do NOT re-import fonts.
- `page.tsx` is a minimal server component example (no `"use client"`). Prefer server components; add `"use client"` only for interactive hooks/events.
- Add new route: `src/app/<segment>/page.tsx` (default export). Keep files small & co-locate only route‑specific assets.

### Styling & Theming
- Tailwind v4 initialized in `globals.css` with `@theme inline`; map base vars (`--background`, `--foreground`) to token names (`--color-background`, etc.).
- To add a color: define base var in `:root`, then add mapped `--color-*` entry inside `@theme inline`, then use via utility (e.g. `bg-background`).
- Keep component styles as utilities; only modify `globals.css` for new tokens.

### Imports & Paths
- Use alias `@/*` (see `tsconfig.json`) for anything inside `src/` (e.g. `import X from '@/components/X'`). Create `src/components/` when the first reusable piece appears.

### Assets
- Static assets live in `public/`; reference with `/asset.svg`. Use `<Image />` when optimization helps (raster) or for consistency (current SVG usage acceptable). `priority` only for above‑the‑fold.

### Tooling / Environment
- Node 24 LTS (from broader project README). Current repo has `package-lock.json`; stay with npm unless intentionally migrating (then remove lock and commit new one).
- Scripts: dev `npm run dev` (Turbopack), build `npm run build`, prod `npm start`, lint `npm run lint`.
- TypeScript strict + `noEmit`; rely on Next build for type checking. Avoid `any`; prefer specific types or `unknown` + narrowing.
- ESLint extends `next/core-web-vitals`; fix a11y / performance warnings before merging.

### Performance & DX
- Reuse existing font vars; don’t duplicate font loading.
- Keep route components fast: minimal logic, delegate shared UI to future `components/` directory.

### Extension Checklist (apply per PR)
1. Add/modify route or component under `src/` using alias imports.
2. Introduce any new design token via the 3-step var pattern (base var -> theme map -> Tailwind utility usage).
3. Update `metadata` in a route/layout if SEO-relevant change.
4. Run lint; resolve all errors (treat warnings related to core web vitals seriously).

### Testing & Domain Notes
- No test harness yet. If adding one, prefer lightweight (e.g. Vitest + jsdom) and document commands here.
- Broader product README mentions BDD/TDD & expense tracking domain—NOT implemented here yet; avoid adding domain scaffolding without explicit task.

### When Unsure
- Prefer server components; only clientify minimally.
- Keep instructions updated when adding API routes (`src/app/api/*`) or shared UI.

Feedback: Mention gaps you hit (e.g. need testing section, data layer pattern) so this guide can evolve.
