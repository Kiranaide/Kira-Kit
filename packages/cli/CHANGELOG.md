# kira-kit

## 0.8.0

### Minor Changes

- Registry release with `KiraDataTable` presets and composable filters, table and card results, and loading, empty, and error states.
- Added live system theme tracking, cookie-backed theme control, and a pre-paint bootstrap helper to `ThemeProvider`.

### Patch Changes

- Fixed Input action overlap, InputGroup add-on spacing, and DataTable column resize behavior.
- Routed Sidebar links through the configured adapter and fixed duplicate `SidebarUser` avatars.

## 0.7.1

### Patch Changes

- Removed bundled starter templates (`packages/cli/templates/`) from the published npm tarball (`files: ["dist"]`) so package scanners (such as Socket.dev) no longer attribute template `package.json` manifests (`next@15.5.x` / `postcss@8.4.31` CVEs and `caniuse-lite` alerts) to `kira-kit`.
- Rewrote `kira-kit create` to delegate scaffolding to the official upstream framework CLIs (`create-vite`, `create-next-app`, `create-astro`, and `@tanstack/cli`) and run `kira-kit init` on top (supporting `vite`, `next`, `astro`, and `tanstack-start`, and dropping the static `monorepo` template).
- Added `skipDeps` support to `kira-kit init` for `--no-install` create runs and added `src/styles.css` to CSS path detection for TanStack Start projects.

## 0.7.0

### Patch Changes

- Registry release `0.7.0`:
  - `data-table`: resolved human-readable column labels (`meta.label` → string `header` → `DataTableColumnHeader` title → Title-Cased ID), unmounted sticky `DataTableBulkActions` at 0 selected rows with spring-out dock motion, and kept `DataTableRowCount` / `DataTablePageCount` single-line beside `DataTablePagination`.
  - `pagination`: stripped `onPaginationChange` and other hook/configuration props before spreading onto `<nav>` and stabilized `PaginationSizeSelector` width on open.
  - `select`: preserved the selected option label as `placeholder` when opening single-select `KiraSelect`.
  - `spotlight`: aligned close button in a dedicated flex header row, declared `@kira-kit/dialog` dependency, resolved OS-aware shortcut hints via `Kbd`, and added `aria-keyshortcuts` on `SpotlightTrigger`.
  - `command`: reserved trailing close-button clearance on `command-breadcrumb` when nested pages are active in `CommandDialog`.
  - `use-platform`: preferred `navigator.userAgentData.platform` before falling back to `navigator.userAgent`.

## 0.6.0

### Breaking changes

- Replaced `components.json` and `/schema/components.json` with a dedicated
  `kira-kit.json` config file and `/schema/kira-kit.json` schema.
  - Moved `tailwind.css` to top-level `css`.
  - Grouped theme and typography settings (`preset`, `primary`, `baseColor`,
    `font`, `fontDisplay`, `fontMono`, `fontPreset`, `radius`, `surface`) under
    `theme`.
  - Removed obsolete legacy keys (`style`, `tsx`, `tailwind.*`,
    `aliases.utils`, `menuColor`, `menuAccent`).
  - `kira-kit add` / `theme` now require `kira-kit.json` and point repos with
    legacy `components.json` to `kira-kit migrate`.

### Minor Changes

- `kira-kit migrate` converts legacy `components.json` configs into
  `kira-kit.json` (flattening `css`, grouping `theme` fields, dropping dead
  keys, and removing legacy Kira `components.json` while leaving foreign configs
  untouched).
- `kira-kit init` and `kira-kit theme --apply` persist `theme.preset` and
  `theme.primary` alongside typography, radius, surface, and base-color options
  in `kira-kit.json`.
- Updated all four starter templates (`vite`, `next`, `tanstack-start`,
  `monorepo`) and generated `llms.txt` to ship `kira-kit.json`.

### Patch Changes

- Fixed full-stack `@types/node` timer ref compatibility across `input`,
  `sidebar`, `announcement-bar`, `camera`, and `use-camera`.

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
