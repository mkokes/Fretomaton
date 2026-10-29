# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- The Template Layout card now sits under Settings in the left column. Printing still puts it after the fret table and bridge compensation, at 1:1 scale.
- Restyled with the shared mk-styleguide design system: lime, greys, Poppins and Inter, with light and dark modes following the OS. Upgraded to Tailwind CSS 4 so daisyUI 5 runs on the version it targets. Under Tailwind 3 its theme and colour-opacity classes weren't being generated. The template SVG now has an explicit white background so it stays readable in dark mode.

### Removed

- Unused `src/App.css`, `tailwind.config.js` and `postcss.config.js`.

### Added

- System / light / dark theme toggle above the header. The choice is saved in `localStorage` and applied before first paint; System follows the OS.
- GPL-3.0-or-later license (`LICENSE`).
- String gauge selection with instrument-specific gauge sets, and per-string bridge compensation recommendations.
- DaisyUI for UI components.
- GitHub Pages deployment via GitHub Actions. CI also runs format, lint, typecheck, and tests on pushes and pull requests to `main`.
- oxlint and oxfmt for linting and formatting, with `lint:fix`, `format`, `format:check`, `typecheck`, and `check` scripts.
- Husky pre-push hook that runs `npm run check`.
- `@vitest/ui` so `npm run test:ui` works.
- `AGENTS.md`, `CLAUDE.md`, and this changelog.
- Rsync deployment scripts configured through `.env`, plus `deploy-debug.sh` and `check-remote.sh` helpers.
- Instrument presets for electric, acoustic, classical, and bass guitars and ukuleles.

### Changed

- Vite now reads the base path from `VITE_BASE_PATH` instead of a hardcoded production `/fretomaton/`.
- npm is now the only package manager.
- Applied oxfmt formatting across the codebase.

### Fixed

- SVG template scaling and calibration for accurate 1:1 printed fret measurements.
- Print layout: legend positioned below the SVG and borders removed when printing.
- `package-lock.json` was out of sync with `package.json`, which broke `npm ci` in CI.
- Gauge set selection no longer resets state from inside an effect. The selected set is derived from the current instrument type.

### Removed

- ESLint and its plugins, replaced by oxlint.
- Yarn artifacts (`yarn.lock`, the committed `.yarn/` cache, and the `packageManager` field).
