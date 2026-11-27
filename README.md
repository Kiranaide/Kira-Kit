# Kira Kit

Enterprise UI kit built on [Base UI](https://base-ui.com) primitives — 72
components, 11 hooks, 10 lib modules, and 9 curated OKLCH themes, installed
straight into your project via the `kira-kit` CLI.

**Registry-first.** Kira Kit is a plain source registry: every item is a set of
files that land in your codebase, yours to edit. The self-contained `kira-kit`
CLI handles installation, OKLCH theme generation, source quality checks,
project scaffolding, and building this registry itself — no other CLI needed.

## Conventions

- **Primitives**: `@base-ui/react` (Base UI only — no Radix, no React Aria)
- **Class merging**: the [`cn`](https://www.npmjs.com/package/cn) package
- **Styling**: Tailwind CSS v4 with semantic CSS variables (never raw hex)
- **Slots**: every component root carries `data-slot`
- **Variants**: class-variance-authority, exported as `<name>Variants`
- **Motion**: GSAP and CSS animations, gated by `useReducedMotion`
- **Icons**: `@tabler/icons-react`

## Quick start

Requires React 19.2+ and Tailwind CSS v4. Register the registry once (the
`kira-kit init` command does this for you, and installs the kit's base CSS and
default theme):

```json
// components.json
{
  "registries": {
    "@kira-kit": "https://kira-kit.vercel.app/r/{name}.json"
  }
}
```

Then install anything from it:

```bash
npx kira-kit add button
npx kira-kit add use-reduced-motion   # a hook
npx kira-kit add theme-ember-press    # a theme
```

Or start a brand-new project pre-wired for Kira Kit:

```bash
npx kira-kit create my-app --template vite   # vite | next | tanstack-start | monorepo
```

Agent-friendly docs are published at [`/llms.txt`](https://kira-kit.vercel.app/llms.txt)
with per-item markdown under `/docs/`.

## Theme presets

Nine hand-curated palettes, generated through the same OKLCH engine as
`kira-kit theme` and verified against WCAG 2.2 AA at build time:

| Preset            | Family            | Primary   |
| ----------------- | ----------------- | --------- |
| `ember-press`     | warm / editorial  | `#A54932` |
| `oxblood-atelier` | warm / editorial  | `#7E3548` |
| `olive-ledger`    | warm / editorial  | `#5F6738` |
| `laurel-study`    | warm / editorial  | `#315C4E` |
| `phase-line`      | cool / technical  | `#0B7F79` |
| `cryostat`        | cool / technical  | `#007C91` |
| `low-orbit`       | cool / technical  | `#3B5F82` |
| `coral-circuit`   | bold / expressive | `#F2555A` |
| `magenta-riot`    | bold / expressive | `#B91668` |

Generate your own from any primary color with `kira-kit theme --primary "#0B7F79" --apply`.

## Repository layout

```
src/components/ui/   Component sources (the registry items)
src/hooks/           Hook sources
src/lib/             Support modules shipped as registry:lib items
src/themes/          Generated theme registry (build output)
packages/cli/        The kira-kit CLI (Node 22+ ESM, own deps)
public/r/            Built registry JSON (the CLI consumes this)
public/schema/       Published JSON schemas for registry/config payloads
public/docs/         Generated per-item agent docs + llms.txt
```

## Development

Use [Bun](https://bun.sh) 1.4.4 for development and Node 24 LTS for the
build tooling. The published CLI supports Node.js 22.12.0 and later.

```bash
bun install --frozen-lockfile
(cd packages/cli && bun install --frozen-lockfile)
bun run dev                     # Dev server (showcase site)
bun run build                   # Full: registry build → checks → vite build
bun run registry:build          # Rebuild public/r + themes + docs only
bun run check                   # oxlint + tsc + prettier
bun run lint && bun run typecheck
```

CLI development (tests live in `packages/cli`):

```bash
cd packages/cli
bun install --frozen-lockfile
bun run test       # vitest
bun run typecheck
bun run build      # tsdown → dist/index.mjs
```

### Quality checks

`kira-kit check` runs the parser-based checks over `src/components/ui`,
`src/hooks`, and `src/lib` — imports-vs-declared-deps, lib resolution, dead
animations, `data-slot`/cva coverage, reduced-motion gating, target sizes, raw
colors, layout transitions, arbitrary values, registry metadata, and more.
Errors block `kira-kit build`; warnings are advisory. Suppress a false positive
inline:

```tsx
// kira-kit-ignore target-size: decorative icon, no pointer target needed
```

See the [CLI README](packages/cli/README.md) for its check catalog and the
[CLI documentation](https://kira-kit.vercel.app/docs/cli) for command examples.

## Deployment

The site is a static build: `vite build` produces a self-contained `dist/`
containing the showcase app, the registry JSONs (`/r/*.json`), and the agent
docs. Both deployment targets below run the identical pipeline (registry
build → theme presets → validate → JSON → docs → Vite), pinned by
`vercel.json` on one side and the `Dockerfile` on the other — since
`public/r` is generated (never committed), every deploy builds it fresh.

### Vercel

The checked-in `vercel.json` pins the install and build commands, so Vercel
builds the registry and site in one pass. The registry is served at
`https://kira-kit.vercel.app/r/{name}.json`.

### Self-hosting on a VPS (Docker)

```bash
docker compose up -d --build      # serves on http://localhost:3000
```

The multi-stage `Dockerfile` builds the registry, theme presets, docs, and the
Vite bundle with Bun, then serves `dist/` with nginx (SPA fallback, immutable
asset caching, `no-cache` + CORS on `/r/` so remote `kira-kit add` fetches always
get fresh items). Point the port and a reverse proxy/TLS at it, and register
your own domain in consumer projects:

```json
{
  "registries": {
    "@kira-kit": "https://your-domain.example.com/r/{name}.json"
  }
}
```

## License

MIT
