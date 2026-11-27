# Contributing to Kira Kit

Use Bun 1.4.4 and Node 24 LTS to build and test the kit.

```sh
bun install --frozen-lockfile
(cd packages/cli && bun install --frozen-lockfile)
bun run dev
```

Run `bun run check`, `bun run check:pages`, and
`(cd packages/cli && bun run typecheck && bun run test)` before opening a PR.
Run `bun run build` for changes that affect the registry, themes, or the site.
Commit updates to generated files that Git already tracks. The build produces
`public/r/` from the source registry.

Update the matching demo, API reference and component changelog when a
component's behavior changes. Add a Changeset from `packages/cli` for a change
that affects the published CLI. Include migration instructions and update
both project changelogs for breaking changes.

Report bugs with the CLI version, Node or Bun version, affected item, and
steps to reproduce. See [SECURITY.md](SECURITY.md) for vulnerability reports.
