# Kira Kit

Enterprise UI kit built on [Base UI](https://base-ui.com) primitives and the
shadcn registry protocol — 72 components, 11 hooks, and 9 curated OKLCH themes,
installed straight into your project via the shadcn CLI.

**Registry-first, CLI-second.** Kira Kit is a plain shadcn-compatible registry.
You can consume it with nothing but `shadcn add`; the `kira-kit` CLI exists only
for what shadcn doesn't do: OKLCH theme generation, source quality checks,
project scaffolding, and building this registry itself.

## Conventions

- **Primitives**: `@base-ui/react` (Base UI only — no Radix, no React Aria)
- **Class merging**: the [`cn`](https://www.npmjs.com/package/cn) package
- **Styling**: Tailwind CSS v4 with semantic CSS variables (never raw hex)
- **Slots**: every component root carries `data-slot`
- **Variants**: class-variance-authority, exported as `<name>Variants`
- **Motion**: GSAP and CSS animations, gated by `useReducedMotion`
- **Icons**: `@tabler/icons-react`

## Quick start

Register the registry once (the `kira-kit init` command does this for you):

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
npx shadcn@latest add @kira-kit/button
npx shadcn@latest add @kira-kit/use-reduced-motion   # a hook
npx shadcn@latest add @kira-kit/theme-ember-press      # a theme
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

| Preset | Family | Primary |
| --- | --- | --- |
| `ember-press` | warm / editorial | `#A54932` |
| `oxblood-atelier` | warm / editorial | `#7E3548` |
| `olive-ledger` | warm / editorial | `#5F6738` |
| `laurel-study` | warm / editorial | `#315C4E` |
| `phase-line` | cool / technical | `#0B7F79` |
| `cryostat` | cool / technical | `#007C91` |
| `low-orbit` | cool / technical | `#3B5F82` |
| `coral-circuit` | bold / expressive | `#F2555A` |
| `magenta-riot` | bold / expressive | `#B91668` |

Generate your own from any primary color with `kira-kit theme --primary "#0B7F79" --apply`.

## Repository layout

```
src/components/ui/   Component sources (the registry items)
src/hooks/           Hook sources
src/themes/          Generated theme registry (build output)
packages/cli/        The kira-kit CLI (Node 22+ ESM, own deps)
public/r/            Built registry JSON (shadcn consumes this)
public/docs/         Generated per-item agent docs + llms.txt
```

## Development

Requires [Bun](https://bun.sh). The CLI additionally targets Node 22+.

```bash
bun install && bun run dev      # Dev server (showcase site)
bun run build                   # Full: registry build → checks → vite build
bun run registry:build          # Rebuild public/r + themes + docs only
bun run check                   # oxlint + tsc + prettier
bun run lint && bun run typecheck
```

CLI development (tests live in `packages/cli`):

```bash
cd packages/cli
bun install
bun run test       # vitest
bun run typecheck
bun run build      # tsdown → dist/index.mjs
```

### Quality checks

`kira-kit check` runs the parser-based checks over `src/components/ui` and
`src/hooks` — imports-vs-declared-deps, dead animations, `data-slot`/cva
coverage, reduced-motion gating, target sizes, raw colors, layout transitions,
arbitrary values, registry metadata, and more. Errors block `kira-kit build`;
warnings are advisory. Suppress a false positive inline:

```tsx
// kira-kit-ignore target-size: decorative icon, no pointer target needed
```

See `COMPONENT-UPGRADE-PLAYBOOK.md` §8 for the full check catalog and
`packages/cli/README.md` for CLI usage.

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
asset caching, `no-cache` + CORS on `/r/` so remote `shadcn add` fetches always
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
