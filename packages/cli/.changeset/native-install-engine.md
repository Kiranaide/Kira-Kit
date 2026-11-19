---
"kira-kit": minor
---

Replace the shadcn delegation with a native, self-contained install engine.

- `init` now writes the kira-owned `components.json`, installs the kit's base
  CSS + vendored utilities and the default theme (no base-theme picker, works
  offline), installs base deps, and enforces React 19.2+. The dead `--base`
  flag is removed.
- `add` resolves registry trees natively (cycles tolerated), rewrites import
  aliases via tsconfig paths, installs npm deps with pinned major ranges, and
  merges theme CSS vars. `--all` now installs components, hooks, and lib
  modules only — themes and styles are excluded. `--view`/`--diff` are
  side-effect-free previews.
- Lib support modules (`src/lib/*`) ship as `registry:lib` items, fixing
  missing-module errors for color-picker and 34 other items; a new
  `lib-resolution` check and full import-graph validation prevent regressions.
- `build` validates and builds natively, emits `theme-default` + `kira-base`,
  publishes JSON schemas to `public/schema/`, and prunes the legacy
  `public/r/index.json` (breaking: consumers of that endpoint must switch to
  `registry.json`).
- `list`/`view`/`search`/`theme --apply` run natively; `migrate` includes a
  native cn codemod (clsx/tailwind-merge → cn).
- Templates ship the kit CSS, utilities, kira config shape, and the
  `tw-animate-css` + `@fontsource-variable/geist` deps.
