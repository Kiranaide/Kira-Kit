# kira-kit

The CLI for [Kira Kit](../../#readme) — a shadcn-compatible registry of Base UI
components. Kira Kit is registry-first: installation is delegated entirely to
the pinned `shadcn` CLI (4.22.1), so what you add is exactly what shadcn would
add. The `kira-kit` CLI covers the parts shadcn doesn't:

- **OKLCH theme generation** from any primary color, with WCAG 2.2 AA verified
  contrast
- **Quality checks** over component sources (12 parser-based checks)
- **Project scaffolding** with four embedded templates
- **`migrate`** from the pre-1.0 `registryUrl` setup
- **`build`** for maintainers: the full registry → validate → JSON → docs
  pipeline

## Requirements

- Node.js 22+ (or Bun 1.x)
- The `shadcn` CLI is bundled as a pinned dependency — no separate install

## Usage

### `kira-kit init`

Set up a project for Kira Kit: delegates base setup to shadcn, registers the
`@kira-kit` namespace in `components.json` (never overwriting an existing
entry), and optionally applies a theme.

```bash
kira-kit init
kira-kit init --preset ember-press          # one of the 9 curated presets
kira-kit init --primary "#0B7F79"           # generate a custom theme
kira-kit init --base-color stone --yes
```

Options: `--base`, `--preset`, `--primary`, `--base-color`, `--force`, `-y/--yes`, `-c/--cwd`.

### `kira-kit add [items...]`

Add component(s) via the pinned shadcn CLI. Transitive registry dependencies
are resolved by shadcn automatically.

```bash
kira-kit add button
kira-kit add button card dialog --overwrite
kira-kit add --all
```

Options: `-o/--overwrite`, `-y/--yes`, `-a/--all`, `-p/--path`, `--dry-run`,
`--diff`, `--view`, `-c/--cwd`.

### `kira-kit list` / `view` / `search`

Registry inspection commands, all delegating to shadcn:

```bash
kira-kit list                     # every available item
kira-kit list --json
kira-kit view button              # show item contents
kira-kit search table --json
```

### `kira-kit theme`

Generate an OKLCH theme palette from a primary color. Produces a
`registry:theme` item with light/dark schemes, chart hues, and APCA-verified
contrast; every token lands in the 4.5:1 (text) / 3:1 (UI) range.

```bash
kira-kit theme --primary "#0B7F79"             # print the palette
kira-kit theme --primary "#0B7F79" --apply     # install into the project
kira-kit theme --primary "#0B7F79" --out my-theme.json
```

Options: `--primary`, `--base-color` (neutral, stone, zinc, slate, gray, plus
mauve, olive, mist, taupe), `--out`, `--apply`, `-c/--cwd`.

### `kira-kit check [paths...]`

Run the quality checks over component sources (defaults to
`src/components/ui` + `src/hooks`). Errors fail the run; warnings are advisory
unless `--ci` is passed.

```bash
kira-kit check
kira-kit check --format github          # GitHub Actions annotations
kira-kit check --ci                     # strict: every finding fails
kira-kit check src/components/ui/button.tsx
```

Checks include: imports-vs-declared-deps, dead animation utilities,
`data-slot`/cva exports, reduced-motion gating, 24×24 target sizes, raw colors,
layout-property transitions, arbitrary Tailwind values, registry metadata,
Base-UI-only primitives, `cn` import source, and suppression hygiene.

Suppress a false positive with a reason (unused suppressions are themselves
flagged):

```tsx
// kira-kit-ignore target-size: decorative icon, no pointer target needed
```

Or for a whole file:

```tsx
/* kira-kit-ignore-file */
```

### `kira-kit create [dir]`

Scaffold a new project pre-wired for Kira Kit — `components.json` with the
`@kira-kit` registry, OKLCH theme tokens, the `cn` package, and a welcome
component.

```bash
kira-kit create my-app
kira-kit create my-app --template next --install --git
```

Templates: `vite`, `next`, `tanstack-start`, `monorepo` (app + ui packages).

### `kira-kit migrate`

Migrate a pre-1.0 project: converts the legacy `registryUrl` field to the
`registries` map, runs `shadcn migrate cn` to switch `clsx`/`tailwind-merge`
imports to the `cn` package, and reports components that have diverged from
the published registry (read-only — it never overwrites your work).

```bash
kira-kit migrate
kira-kit migrate --dry-run
```

### `kira-kit build` (maintainers)

The full registry pipeline, run from the repository root:

1. Quality checks (errors block, warnings advise)
2. Regenerate the 9 theme presets into `src/themes/registry.json`
3. `shadcn registry validate` over every source registry
4. `shadcn build` → `public/r/*.json`
5. Prune stale `public/r` outputs
6. Generate `public/llms.txt` + per-item markdown docs

```bash
kira-kit build
kira-kit build --skip-checks
```

## Exit codes

| Code | Meaning |
| --- | --- |
| 0 | Success |
| 1 | User error (bad input, validation failure) |
| 2 | Registry problem (invalid/malformed registry data) |
| 3 | Quality checks failed |

## Development

```bash
bun install
bun run test        # vitest
bun run typecheck
bun run build       # tsdown → dist/index.mjs
```

When source registries change, refresh dependency/file facts with
`bun run scripts/scaffold-sources.ts` (curated titles/descriptions/categories
in `scripts/registry-metadata.json` are preserved).

Releases use [Changesets](https://changesets.js.org) scoped to this package.

## License

MIT
