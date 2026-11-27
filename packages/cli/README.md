# kira-kit

The CLI for [Kira Kit](../../#readme) — a source registry of Base UI components.
`kira-kit` is a self-contained registry client: it resolves items and their
transitive dependencies, rewrites import aliases to your project layout,
installs missing npm packages with your detected package manager, and merges
theme tokens into your global CSS. No other CLI is involved.

- **Native install engine** — `init` and `add` work offline against the embedded
  kit assets and any registry reachable by URL or local path
- **OKLCH theme generation** from any primary color, with WCAG 2.2 AA verified
  contrast
- **Font & icon options** — six sans and three mono variable fonts, Tabler or
  Lucide icons (install-time import rewrite)
- **Quality checks** over component sources (13 parser-based checks)
- **Project scaffolding** with four embedded templates
- **`migrate`** from legacy `registryUrl` / `clsx` / `tailwind-merge` setups
- **`build`** for maintainers: the full registry → validate → JSON → docs
  pipeline

## Requirements

- Node.js 22.12.0 or later (or Bun 1.x)
- Consumer projects: React 19.2+ (components use `useEffectEvent`), Tailwind
  CSS v4, TypeScript path aliases (`@/*`)

## Usage

The notes below cover common commands. Run `kira-kit <command> --help` for
the flags supported by the installed CLI. See the
[CLI documentation](https://kira-kit.vercel.app/docs/cli) for more examples.

### `kira-kit init`

Set up a project for Kira Kit:

1. Writes or repairs `components.json` (`style: "kira"`, standard aliases, the
   `@kira-kit` registry — existing entries are never overwritten)
2. Enforces the React 19.2+ floor
3. Installs the kit's base CSS (tokens, safelists, keyframes, `@theme inline`)
   and the vendored `kira-utilities.css` — unless a theme already exists
4. Installs the base dependencies (`@base-ui/react`, `cn`,
   `class-variance-authority`, the chosen icon library, `tailwindcss`,
   `tw-animate-css`, and the chosen `@fontsource-variable` fonts)
5. Applies the kit's default theme — no prompt, no network. `--preset` and
   `--primary` override it.
6. With `--icon lucide`, rewrites Tabler icon imports across project sources
   to aliased `lucide-react` imports (local names never change).

```bash
kira-kit init
kira-kit init --preset ember-press          # one of the 9 curated presets
kira-kit init --primary "#0B7F79"           # generate a custom theme
kira-kit init --font inter --font-mono jetbrains-mono --icon lucide
kira-kit init --primary "#0B7F79" --base-color stone --yes
```

In an interactive terminal (no `--yes`), `init` also prompts for the sans
font, mono font, and icon library before the theme choice.

Options: `--preset`, `--primary`, `--base-color`, `--font` (geist, inter,
manrope, plus-jakarta-sans, space-grotesk, dm-sans), `--font-mono`
(geist-mono, jetbrains-mono, fira-code), `--icon` (tabler, lucide), `--force`,
`-y/--yes`, `-c/--cwd`.

### `kira-kit add [items...]`

Add components, hooks, and lib modules. Transitive `registryDependencies` are
resolved automatically (cycles included), imports are rewritten to your
aliases, and missing npm deps are installed with pinned ranges where majors
matter.

```bash
kira-kit add button
kira-kit add button card dialog --overwrite
kira-kit add --all                          # every ui/hook/lib item
kira-kit add color-picker --dry-run --diff
```

`--all` installs components, hooks, and lib modules only — themes and styles
are excluded (install those explicitly, e.g. `kira-kit add theme-ember-press`).

Options: `-o/--overwrite`, `-y/--yes`, `-a/--all`, `-p/--path`, `--dry-run`,
`--diff`, `--view`, `-c/--cwd`.

### `kira-kit list` / `view` / `search`

Registry inspection:

```bash
kira-kit list                     # every available item
kira-kit list --json
kira-kit view button              # show item contents
kira-kit search table --json
```

Options: `--json` (list/search), `-c/--cwd`.

### `kira-kit theme`

Generate an OKLCH theme palette from a primary color. Produces a
`registry:theme` item with light/dark schemes, chart hues, and APCA-verified
contrast; every token lands in the 4.5:1 (text) / 3:1 (UI) range. Font and
icon options apply on their own too — at least one of `--primary`, `--font`,
`--font-mono`, or `--icon` is required.

```bash
kira-kit theme --primary "#0B7F79"             # print the palette
kira-kit theme --primary "#0B7F79" --apply     # install into the project
kira-kit theme --primary "#0B7F79" --out my-theme.json
kira-kit theme --font manrope --font-mono fira-code --apply
kira-kit theme --icon lucide --apply
```

Font application rewrites the `@fontsource-variable` imports and the
`--font-sans` / `--font-mono` tokens in your global CSS — color tokens are
never touched and `--force` is not required. `--icon lucide` installs
`lucide-react` and rewrites every Tabler import in your project sources,
keeping local names aliased (`import { Check as IconCheck } from
"lucide-react"`). Filled Tabler icons get `fill="currentColor"` injected and
Tabler `stroke` width props become `strokeWidth`; a few names map to
approximate Lucide equivalents. The CLI never removes
`@tabler/icons-react` from package.json — it prints a hint instead. To
convert already-installed registry components after switching, run
`kira-kit add --all --overwrite`.

Options: `--primary`, `--base-color` (neutral, stone, zinc, slate, gray, plus
mauve, olive, mist, taupe), `--font`, `--font-mono`, `--icon`, `--out`,
`--apply`, `-c/--cwd`.

### `kira-kit check [paths...]`

Run the quality checks over component sources (defaults to
`src/components/ui` + `src/hooks` + `src/lib`). Errors fail the run; warnings
are advisory unless `--ci` is passed.

```bash
kira-kit check
kira-kit check --format github          # GitHub Actions annotations
kira-kit check --ci                     # strict: every finding fails
kira-kit check src/components/ui        # directories only, not file paths
```

Checks include: imports-vs-declared-deps, lib resolution, dead animation
utilities, `data-slot`/cva exports, reduced-motion gating, 24×24 target sizes,
raw colors, layout-property transitions, arbitrary Tailwind values, spacing
scale, registry metadata, Base-UI-only primitives, `cn` import source, and
suppression hygiene.

Suppress a false positive with a reason (unused suppressions are themselves
flagged):

```tsx
// kira-kit-ignore target-size: decorative icon, no pointer target needed
```

Or for a whole file — the reason is mandatory in both forms:

```tsx
/* kira-kit-ignore-file raw-colors: this file defines the raw palette itself */
```

### `kira-kit create [dir]`

Scaffold a new project pre-wired for Kira Kit — `components.json` with the
`@kira-kit` registry, the kit's base CSS and theme tokens, the `cn` package,
and a welcome component.

```bash
kira-kit create my-app
kira-kit create my-app --template next --install --git
```

Templates: `vite`, `next`, `tanstack-start`, `monorepo` (app + ui packages).

Options: `-t/--template`, `--install` / `--no-install`, `--git` / `--no-git`,
`-y/--yes`.

### `kira-kit migrate`

Migrate a legacy project: converts the legacy `registryUrl` field to the
`registries` map, normalizes legacy `$schema`/`style` values, rewrites
`clsx`/`tailwind-merge`/`@/lib/cn` imports to the `cn` package (including
`twMerge(clsx(…))` → `cn(…)`), and reports components that have diverged from
the published registry. Your component files are never overwritten.

```bash
kira-kit migrate
kira-kit migrate --dry-run
```

Options: `--dry-run`, `-y/--yes`, `-c/--cwd`.

### `kira-kit build` (maintainers)

The full registry pipeline, run from the repository root:

1. Quality checks (errors block, warnings advise)
2. Regenerate the theme presets + `theme-default` into `src/themes/registry.json`
3. Validate every source registry, including full import-graph resolution
4. Build `public/r/*.json` (file contents inlined) + `public/schema/*.json`
5. Prune stale `public/r` outputs
6. Generate `public/llms.txt` + per-item markdown docs

```bash
kira-kit build
kira-kit build --skip-checks
```

## Registry configuration

Items resolve through the `registries` map in `components.json`. The `{name}`
placeholder is literal; URLs, `file://` paths, and local paths all work:

```json
{
  "registries": {
    "@kira-kit": "https://kira-kit.vercel.app/r/{name}.json"
  }
}
```

The index lives at `/r/registry.json`; JSON schemas are published at
`/schema/registry.json`, `/schema/registry-item.json`, and
`/schema/components.json`.

## Deliberately not supported

Features the old shadcn-delegating CLI exposed that the native engine does
not implement:

- Tailwind prefix support and Tailwind v3 / JavaScript output
- Base-library pickers (Radix / React Aria) and base-color theme pickers —
  the kit is Base UI-only and ships one default theme plus curated presets
- Registry authentication and env-var interpolation beyond `{name}`
- Per-file AST `"use client"` detection (the `rsc` config flag drives it)
- Framework scaffolding inside `init` — use `kira-kit create`

## Exit codes

| Code | Meaning                                            |
| ---- | -------------------------------------------------- |
| 0    | Success                                            |
| 1    | User error (bad input, validation failure)         |
| 2    | Registry problem (invalid/malformed registry data) |
| 3    | Quality checks failed                              |

## Development

```bash
bun install
bun run test        # vitest
bun run typecheck
bun run build       # embed-assets + tsdown → dist/index.mjs
```

`bun run build` first runs `scripts/embed-assets.ts`, which embeds the kit's
base CSS, vendored utilities, and default theme tokens into
`src/generated/assets.ts` and syncs the same CSS into the bundled templates.
A drift-guard test fails if the embedded assets fall out of sync with
`src/index.css`.

When source registries change, refresh dependency/file facts with
`bun run scripts/scaffold-sources.ts` (curated titles/descriptions/categories
in `scripts/registry-metadata.json` are preserved).

Releases use [Changesets](https://changesets.js.org) scoped to this package.

## License

MIT. The vendored utilities CSS (`src/styles/kira-utilities.css` in the kit,
embedded as `UTILITIES_CSS`) is derived from shadcn's MIT-licensed Tailwind
CSS — Copyright (c) 2023 shadcn.
