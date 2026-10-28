# AGENTS.md

Fretomaton is a single-page React + TypeScript app (Vite) that generates printable, 1:1-scale fretboard templates and bridge compensation recommendations for guitars, basses, and ukuleles. It is deployed to GitHub Pages at https://mkokes.github.io/Fretomaton/.

See [README.md](README.md) for user-facing usage, printing, and deployment details.

## Structure

- `src/App.tsx` — almost all app logic: state, fret position math, unit conversion, preset loading, SVG template rendering, and result tables. There is no router and no global state library.
- `src/utils/bridgeCompensation.ts` — string gauge sets (`STRING_GAUGE_SETS`), instrument type detection, and bridge compensation calculations.
- `src/data/presets.json` + `src/types/presets.ts` — instrument presets (stored in **inches**) and shared types.
- `src/components/` — `Tooltip.tsx` (used) and `DaisyUIDemo.tsx` (a showcase; not rendered anywhere).
- `src/tests/` and `src/*.test.tsx` — Vitest + Testing Library tests (jsdom; setup in `src/tests/setup.ts`).
- `.github/workflows/deploy.yml` — CI checks on PRs and pushes; deploys to Pages from `main`.
- `deploy*.sh`, `check-remote.sh` — optional rsync deployment to a self-hosted server, configured with `.env` (see `.env.example`).

## Commands

npm is the only package manager (`package-lock.json`). Don't use yarn or pnpm.

```bash
npm install            # also installs Husky hooks via "prepare"
npm run dev            # Vite dev server on http://localhost:5173
npm run check          # format:check + lint + typecheck + test:run (same as pre-push and CI)
npm run lint           # oxlint (npm run lint:fix to auto-fix)
npm run format         # oxfmt, writes in place (npm run format:check to verify)
npm run typecheck      # tsc -b
npm run test:run       # vitest, single run
npm run build          # tsc -b && vite build -> dist/
```

## Conventions

- Formatting is owned by oxfmt (`.oxfmtrc.json`): single quotes, semicolons, LF line endings (enforced by `.gitattributes`). Run `npm run format` rather than hand-formatting.
- Linting is oxlint (`.oxlintrc.json`) with the typescript, react, oxc, unicorn, and vitest plugins. `correctness` rules are errors; `suspicious` rules are warnings. Lint must pass with 0 errors.
- Internal calculations run in the currently selected unit (`inches` or `mm`). Switching units converts all state values. The SVG always renders in **inches** (`toInchesForSVG`) so 1 SVG unit = 1 inch.
- Prefer deriving values with `useMemo` over syncing state in `useEffect` (oxlint's `react/set-state-in-effect` is an error).
- Commit messages use Conventional Commit prefixes (`feat:`, `fix:`, `docs:`, `chore:`).

## Gotchas

- **Base path:** `vite.config.ts` reads `VITE_BASE_PATH` (env or `.env`) and defaults to `/`. GitHub Pages serves from `/Fretomaton/`, and the path is **case-sensitive**. CI derives it from `actions/configure-pages`, so don't hardcode it.
- **Print calibration:** `getSVGDimensions` in `App.tsx` applies a `0.9541 / 0.89` (~1.072) calibration factor based on a physical measurement. Changing it affects real-world print accuracy and the print-scaling tests.
- **Pre-push hook:** `.husky/pre-push` runs `npm run check`, so pushes fail on formatting drift. Run `npm run format` first.
- On Windows Git Bash, setting `VITE_BASE_PATH=/Foo` inline gets rewritten into a Windows path by MSYS. Use `MSYS_NO_PATHCONV=1` or put the value in `.env`.
