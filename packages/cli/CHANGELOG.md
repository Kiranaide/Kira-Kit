# kira-kit

## 0.5.0

### Breaking changes

- Node.js 22.12.0 is the minimum supported Node version. The native installer
  uses the 0.5 registry format.

### Minor Changes

- [`e83d06c`](https://github.com/Kiranaide/Kira-Kit/commit/e83d06c3bb2e5be4dbb22fc1c13de95d5509a88b) Thanks [@Kiranaide](https://github.com/Kiranaide)! - Font and icon options for theming, shipping alongside the native install
  engine changeset in this release.

  - `init` and `theme` accept `--font` (geist, inter, manrope, plus-jakarta-sans,
    space-grotesk, dm-sans) and `--font-mono` (geist-mono, jetbrains-mono,
    fira-code). All fonts are `@fontsource-variable` packages. Application
    rewrites the CSS `@import` lines and upserts `--font-sans` / `--font-mono`
    in `@theme inline` — color tokens are never touched and `--force` is not
    required. Interactive `init` prompts for sans, mono, and icon choices.
  - `init` and `theme` accept `--icon` (tabler, lucide). Choosing lucide
    installs `lucide-react` and rewrites every `@tabler/icons-react` import in
    project sources to aliased lucide imports (`Check as IconCheck`), so
    usages, `typeof` refs, and icon records keep their names. Filled Tabler
    icons get `fill="currentColor"` injected and Tabler `stroke` width props
    become `strokeWidth`; a few names map to approximate Lucide
    equivalents. `@tabler/icons-react` is never auto-removed — a hint is
    printed. Convert installed components later with `add --all --overwrite`.
  - `theme` no longer requires `--primary`: font/icon options apply on their
    own with `--apply`, or print a dry-run summary without it.
  - The base CSS ships a `--font-mono` token and the
    `@fontsource-variable/geist-mono` import; CodeBlock's default `fontFamily`
    is now `var(--font-mono, ui-monospace, monospace)` instead of a hardcoded
    family that was never installed.
  - `kira-kit check` is icon-library aware: with `iconLibrary: "lucide"` in
    components.json, lucide imports satisfy the canonical tabler dependency
    declarations in both check directions.

- [`e83d06c`](https://github.com/Kiranaide/Kira-Kit/commit/e83d06c3bb2e5be4dbb22fc1c13de95d5509a88b) Thanks [@Kiranaide](https://github.com/Kiranaide)! - Replace the shadcn delegation with a native, self-contained install engine.

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
