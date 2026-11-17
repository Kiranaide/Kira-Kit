# Kira Kit CLI v1.0 — Execution Plan

Companion to `kira-cli-context.md` (the spec). This plan turns the spec's 7 phases into
concrete, reviewable work units grounded in the **actual** state of this repo (surveyed
2026-11-17). Where the spec and reality disagree, it is called out explicitly.

---

## 1. Gap analysis — where we actually are

| Spec assumption | Reality found in repo |
|---|---|
| CLI has fetch/install/alias code to delete | Yes: `packages/cli/src/lib/registry.ts`, `lib/deps.ts`, `lib/build-config.ts` (NPM_DEPENDENCY_MAP :1-20, REGISTRY_DEPENDENCY_MAP :22-81), inline PM detection in `commands/init.ts:154-162`, `.replace("@/", "src/")` everywhere |
| One registry builder to thin out | **Three** exist: `scripts/build-registry.ts` (730 lines), `packages/cli/src/commands/build.ts`, and the maps in `packages/cli/src/lib/build-config.ts` — with divergent data between them (e.g. `checkbox` deps differ) |
| `create` spawns a sibling package | `src/index.ts:46-63` spawns `../../create/src/index.ts` via tsx — **`packages/create` does not exist**. Command is dead code today |
| Root `registry.json` + included registries | None exist. Only generated `public/r/` (gitignored). All 72 items have **boilerplate** descriptions ("Button component from Kira Kit."), auto-forced `clsx`+`tailwind-merge` deps, hooks never get their own items |
| Hooks as `registry:hook` items | 11 hooks exist in `src/hooks` but are inlined as `files` into components |
| shadcn pinned in CLI package | `shadcn ^4.22.1` is a **root** devDep with a caret range, not a dep of `packages/cli`, not pinned |
| Tests via Vitest, CI on GitHub Actions | **No Vitest anywhere**, tests use `bun:test` (`scripts/*.test.tsx`, `scripts/cli-config.test.ts` imports CLI code). **No `.github/` at all** |
| Components use `cn` package | All import `@/lib/utils` (which wraps clsx+tailwind-merge); CLI `init` writes a `cn.ts` — inconsistent with the repo's own `utils.ts` convention |
| Theme generator to rework | `packages/cli/src/lib/theme-generator.ts`: string-hacked `oklch(...)`, hardcoded hue 343 (:17,:43,:60,:80), no clamping, no contrast checks. Silent `#3b82f6` fallback in `init.ts:129` |
| Checks 1–9 exist | Yes, in `scripts/build-registry.ts:389-609` — regex-based, check 1 one-directional, **no** suppression syntax, **no** `--ci`/`--format`. Checks 10–12 missing (the script itself *creates* boilerplate descriptions at :357) |
| Changesets, engines, version single-source | None exist. `.version("1.0.0")` hardcoded at `packages/cli/src/index.ts:22` while package.json says 0.2.1. Committed bundle `packages/cli/bin/kira-kit.js` (33k lines) is a build artifact that shouldn't be committed |
| Clean baseline | **Working tree has extensive uncommitted modifications** across `packages/cli/*`, `scripts/build-registry.ts`, package.json, AGENTS.md, REGISTRY.md |

Also noted: root `components.json` already has `"registries": {}` (empty) and `"style": "base-nova"` — the namespace slot exists. No Radix/react-aria imports anywhere in `src/components/ui`, so check 11 will pass trivially at first. The `kira-registry-check` skill and `COMPONENT-UPGRADE-PLAYBOOK.md` reference "nine playbook §8 checks inside scripts/build-registry.ts" — both must be updated when checks move (Phase 3).

**Runtime conflict to resolve:** AGENTS.md mandates bun for the repo; the spec locks Node 22+ / ESM / Vitest for the CLI package. Resolution (recommended): the CLI **package** is runtime-agnostic Node 22+ ESM with `engines` and Vitest (it ships to npm users who use npm/pnpm/bun); the **repo** keeps bun for dev tooling. Vitest runs fine under bun-installed node_modules.

---

## 2. Phase 0 — Groundwork and shadcn verification spike

Small but must happen first; everything downstream depends on it.

1. **Commit or stash the current working tree.** There are uncommitted changes across the CLI, build script, and configs. Before large-scale surgery, land them (or explicitly discard after review) so phases have clean diffs.
2. **Pin shadcn inside `packages/cli`**: move `shadcn` to `packages/cli/package.json` as an **exact** dependency (currently `^4.22.1` at root). Record the pinned version in the plan PR.
3. **Verification spike (spec §14)** — run against the pinned version, document answers in `packages/cli/docs/shadcn-notes.md`:
   - exact `components.json` `registries` syntax for `"@kira-kit"`;
   - `shadcn init` flag for Base UI base;
   - correct item type for theme presets (`registry:theme` / `registry:style` / `registry:base`);
   - current `cssVars` shape for Tailwind v4 (`cssVars.theme`);
   - availability of `view` / `search` / `registry validate` / `migrate cn` / local-file `add ./file.json`.
   Each answer becomes a fixture in the test suite so drift is detected when we bump shadcn.
4. **Acceptance test harness for the spike**: a throwaway script that, in a temp dir, runs `shadcn add @kira-kit/button` against a **local** fixture registry (no network) — this prototype becomes the Phase 6/7 integration test.

**Exit:** committed baseline, pinned shadcn, a written answer for every §14 "verify" item.

---

## 3. Phase 1 — Foundation (spec §11.1)

Restructure `packages/cli` to the §3 layout. No behavior change yet — this is scaffolding + deleting the worst duplication.

**Files created:**
- `packages/cli/src/commands/` — add the missing stubs: `theme.ts`, `check.ts`, `create.ts` (replacing the tsx-spawn), `migrate.ts`, `docs.ts`; keep `init.ts`, `add.ts`, `list.ts`, `build.ts`.
- `packages/cli/src/core/` — empty modules `checks/`, `theme/`, `registry/`, `docs/`, `migrate/` (pure functions only).
- `packages/cli/src/lib/shadcn.ts` — resolve the pinned shadcn bin from the package's own `node_modules` (not PATH), spawn helper with stdio passthrough, typed exit-code mapping (0/1/2/3 per §5).
- `packages/cli/src/lib/prompts.ts` — `@clack/prompts` wrappers; every wrapper takes a flag-provided value and skips the prompt when present; auto-non-interactive when `--yes`, `CI`, or non-TTY stdin.
- `packages/cli/src/lib/errors.ts`, `logger.ts`, `fs.ts`.
- `packages/cli/test/` + `vitest.config.ts`; scripts `test`, `build` (esbuild with `define: { VERSION }` read from package.json).
- `.changeset/config.json`; `engines: { node: ">=22" }`; drop `bin/kira-kit.js` from git, add `"files"` including `templates/`.

**Deleted now (spec §4, mechanical part):**
- `inquirer` + `@types/inquirer` deps; `src/prompts/{base-color,primary-color,project-type}.ts` (replaced by `lib/prompts.ts`).
- Hardcoded `.version("1.0.0")` → esbuild `define`.
- The dead `create` tsx-spawn block in `src/index.ts:46-63,82`.

**Not yet deleted:** registry/deps code — that dies in Phase 4 when delegation lands (keeps the CLI runnable between phases).

**Exit:** `bun run test` green in `packages/cli`, `kira-kit --version` prints package.json version, built bin works, old prompts replaced by clack with flags.

---

## 4. Phase 2 — Registry migration (spec §11.2) — the biggest content lift

Move the source of truth from generated JSON + hand maps to hand-written registry files.

1. **Write the three source registries:**
   - `/registry.json` — `$schema`, `name: "kira-kit"`, `homepage`, `include: ["src/components/ui/registry.json", "src/hooks/registry.json", "src/themes/registry.json"]` (themes file lands in Phase 5; include it from the start as empty).
   - `src/components/ui/registry.json` — 72 items. Each needs: `name`, `type: "registry:ui"`, a **real hand-written** `title`/`description`, ≥1 `category`, explicit `dependencies`, `registryDependencies` (Kira-internal deps as `@kira-kit/<name>`), `files`.
   - `src/hooks/registry.json` — 11 items as `registry:hook`. Stop inlining hooks as component files; instead add `registryDependencies: ["@kira-kit/use-reduced-motion", ...]` where components use them.
2. **Authoring the 72 descriptions:** generate a first-pass draft with per-component reading (props/variants/features), then human review pass. This is the main place maintainer judgment is needed — the acceptance criterion "no boilerplate description" is a real content bar.
3. **Switch `cn` source:** add the `cn` npm package; rewrite `src/lib/utils.ts` to re-export from `cn` (or replace imports entirely per the verified `shadcn migrate cn` behavior); update all 72 components if the import path changes (`import { cn } from "cn"`); drop `clsx`/`tailwind-merge` from base deps everywhere they were only there for cn. Update AGENTS.md's component template accordingly.
4. **Declare GSAP properly:** components using gsap get explicit `gsap` + `@gsap/react` in their item's dependencies.
5. **Delete the maps:** `NPM_DEPENDENCY_MAP` + `REGISTRY_DEPENDENCY_MAP` from **both** `packages/cli/src/lib/build-config.ts` and `scripts/build-registry.ts:27-157`. Deps now live per-item in the registries; correctness is enforced by reworked check 1 (Phase 3) — so Phase 3's check must land before this delete is trusted, or land check 1 first within this phase. **Order inside the phase: write registries → port check 1 (parser-based, bidirectional) → run it → fix fallout → delete maps.**
6. **Collapse the three builders:** `packages/cli/src/commands/build.ts` and its maps are deleted; `scripts/build-registry.ts` becomes ~10 lines calling `kira-kit build` internals (spec §3 rule: one implementation). `shadcn registry validate` must pass.
7. **Three-way acceptance:** local-fixture tests for `shadcn add @kira-kit/data-table` via (a) namespace, (b) GitHub `<user>/<repo>/data-table`, (c) direct `https://kira-kit.vercel.app/r/data-table.json`.

**Risks:** description authoring is ~72 × real writing, not mechanical; dep-declaration fallout across 72 components will surface real missing/extra deps (the old maps were wrong in places — e.g. checkbox). Budget review time here.

**Exit:** `shadcn registry validate` green; maps gone; check 1 green; all three install paths work against a fixture.

---

## 5. Phase 3 — Checks engine (spec §7)

1. **Port checks 2–9** from `scripts/build-registry.ts:389-609` into pure functions in `packages/cli/src/core/checks/` — one file per check + `runner.ts` + shared `CheckContext`. Keep behavior identical (they're already spec'd "unchanged"), but each gets its own unit tests with fixture sources.
2. **Rework check 1** to bidirectional, parser-based (`es-module-lexer`): every bare import declared / every declared dep imported; handle `import "pkg"`, `import type`, dynamic `import()`, `export … from`, `@x/y/z`, `pkg/sub`, exempt `node:*`.
3. **Add checks 10–12:** metadata (real description, ≥1 category), Base-UI-only (flag `radix-ui`, `@radix-ui/*`, `react-aria*`), cn-source (flag `clsx`/`tailwind-merge`/local `lib/cn` imports).
4. **Suppression syntax:** line-level `// kira-kit-ignore <checkId>: <reason>` and file-level `/* kira-kit-ignore-file <checkId>: <reason> */`; reasonless suppression = error; unused suppression = warning. Unit-test the parser for the suppression comments themselves.
5. **`kira-kit check` command** (§5.5): `[paths...]`, `--ci` (auto when `CI` set: every finding fails unless suppressed), `--format pretty|json|github` (GitHub annotations format).
6. **Wire into build:** `kira-kit build` step 1 calls `check --ci`; local `bun run check` keeps running oxlint/tsc/prettier and can call `kira-kit check` too.
7. **Update dependents:** `kira-registry-check` skill and `COMPONENT-UPGRADE-PLAYBOOK.md` §8 references now point to `core/checks/`; run a sweep so stale skill instructions don't send an agent to the deleted script.

**Exit:** every check has unit tests; `check --ci` fails on unsuppressed warning, passes with reasoned suppression (acceptance test); `--format github` output validated.

---

## 6. Phase 4 — Thin commands (spec §11.4)

1. **`add`** (§5.2): map bare names → `@kira-kit/<name>`, pass through namespaced/URLs; spawn pinned `shadcn add` with `--overwrite --yes --dry-run --diff --view --path --cwd` passthrough; `--all` reads the registry index **once** and passes all names in a **single** invocation (fixes issue #12).
2. **`list`/`view`/`search`** (§5.3): thin spawn of `shadcn list|view|search @kira-kit` + `--json` flag (per the Phase-0 verification of what the pinned version actually supports — if `search` doesn't exist, omit and note the deviation).
3. **Delete the old machinery:** `lib/registry.ts` (HTTP fetch), `lib/deps.ts` (PM detection, `parseDependencies`, `installDependencies`), inline detection in `init.ts:154-162`, all `aliases.replace("@/", "src/")`, `lib/schemas.ts` legacy `registryUrl`.
4. **`init`** (§5.1): delegate base setup to pinned `shadcn init` with Base UI; idempotently upsert `"registries": { "@kira-kit": "https://kira-kit.vercel.app/r/{name}.json" }` without clobbering others; theme step via preset add or `theme` command; `--force` semantics for existing `:root {` (fixes issue #11); no direct `lib/cn.ts` writes.
5. **Error contract:** exit codes 0/1/2/3, every error prints cause + next step. Wrap shadcn spawn failures distinctly (network → 2).

**Exit:** acceptance tests — `add --all --yes` single invocation/no duplicate prompts; network-failure test produces exit 2 with a clear message; greps confirm no `NPM_DEPENDENCY_MAP`, no `.replace("@/", "src/")`, no inquirer, no PM-detection remain.

---

## 7. Phase 5 — Theme engine (spec §8)

1. **`core/theme/palette.ts`:** build colors numerically as `{ mode: "oklch", l, c, h }` objects via culori; clamp chroma to sRGB (`clampChroma`) before emitting; emit P3-safe values. No string interpolation of `oklch(...)` anywhere.
2. **Derive foregrounds** from primary hue (or neutral) with lightness chosen to satisfy contrast — delete hardcoded hue 343 (`theme-generator.ts:17,43,60,80` and the copies in `src/index.css:44,71,86,112`).
3. **`core/theme/contrast.ts`:** verify all role pairs (§8 list, including muted-fg/background, sidebar pairs, ring/border at 3:1) in light **and** dark. Blocking: AA (4.5:1 text, 3:1 UI). Non-blocking: APCA Lc via `apca-w3`, reported.
4. **Auto-adjust:** on a failing pair, nudge lightness within a bounded range; record the adjustment in output; fail only if still failing, printing failing pairs + suggested lightness.
5. **`theme` command** (§5.4): `--primary`, `--base-color`, `--out`, `--apply` (via `shadcn add ./kira-theme.json` local-file support). Invalid color = error with examples; **delete the `#3b82f6` silent fallback** (`init.ts:129`).
6. **Presets:** generate the curated set (8 primaries × 5 base colors, or chosen subset) at build time into `src/themes/registry.json` from the **same** core function; `kira-kit build` regenerates them. Preset items use the item type verified in Phase 0.
7. **Tests:** snapshot every preset; property test — 1,000 random hues must pass AA for all pairs after adjustment (this is also acceptance criterion §12).

**Exit:** acceptance property test green; `theme --apply` installs a working theme in a fixture project; presets identical to CLI output for the same input.

---

## 8. Phase 6 — create + migrate (spec §11.6)

1. **Templates:** `packages/cli/templates/{vite,next,tanstack-start,monorepo}/`, shipped via package.json `files`, resolved from `import.meta.url` → package root (never monorepo paths). Each pre-wired: `components.json` with `@kira-kit` registry, Base UI, `cn` package, a default theme preset, one example component. Monorepo template targets `packages/ui` with correct aliases.
2. **`create` command** (§5.7): copy template, optionally run init-equivalent theme step, install deps by delegating to shadcn or printing the command (use `package-manager-detector` if detection is needed — do not hand-roll). Template contents are maintained as real fixture projects that CI builds.
3. **`migrate`** (§5.8): idempotent transforms of `components.json` (legacy `registryUrl` → `registries["@kira-kit"]`), run `shadcn migrate cn`, rewrite old `lib/cn` imports to the project's utils alias, **report** (never auto-modify) components differing from registry with a `kira-kit add <name> --diff` suggestion. `--dry-run` prints a diff. Transforms are pure functions in `core/migrate/` with unit tests over a v0.2.1 fixture.
4. **Integration tests:** `npx`-style runs of the **packed tarball** (`bun pm pack` / `npm pack`) in temp dirs, all four templates, local fixture registry, then `npm run build` in each scaffolded project (acceptance criterion #1).

**Exit:** all four templates scaffold + build from a packed tarball in CI; migrate fixture test idempotent (second run = no changes).

---

## 9. Phase 7 — Agent docs + release (spec §11.7)

1. **`core/docs/`:** generate `public/llms.txt` (project summary, install instructions, conventions, linked item list) and `public/docs/<item>.md` per item (title, description, install cmd, deps, registry deps, props/variants parsed from cva, one usage example, a11y notes). Same content reachable as `.md` from every site docs page.
2. **`kira-kit build`** gains steps 5–6 (prune stale `public/r`, generate docs); `scripts/build-registry.ts` already thinned in Phase 2.
3. **CI (GitHub Actions):** matrix Node 22/24 → typecheck, lint, unit, integration, `kira-kit build --ci`, `shadcn registry validate`. This can be introduced earlier (Phase 1) in minimal form and extended per phase — recommended: create the workflow in Phase 1 running unit tests only, add integration suites as phases land.
4. **Release:** changesets for `kira-kit`; version single-sourced from package.json; publish **1.0.0**; Vercel serves `public/r` + docs.

**Exit:** all §12 acceptance criteria checked in CI; 1.0.0 published.

---

## 10. Suggested work order & parallelism

Strictly sequential dependencies: Phase 0 → 1 → 2 → 3 (check 1 needed inside 2's delete step) → 4. After 4:

- **Theme (5)** and **create/migrate (6)** are independent of each other and can proceed in parallel branches.
- **Docs (7)** depends on registries (2) but not on 5/6 — llms.txt generation can start after Phase 3.

Each phase = one PR (or a small stack), each ending green with no dead code left from that phase (spec §11 rule). Given the repo's current uncommitted state, Phase 0's baseline commit is the gating item.

## 11. Risks / deviations to flag in PRs

| Risk | Mitigation |
|---|---|
| Spec's §14 items may conflict with pinned shadcn 4.22.1 | Phase 0 spike answers first; spec says follow pinned version + note deviation |
| 72 hand-written descriptions is real writing, not codegen | Draft per component, maintainer review pass; acceptance test only checks non-boilerplate mechanically |
| Old dep maps were wrong (checkbox divergence proves it) | Check 1 lands before map deletion; expect fallout fixes |
| `packages/create` referenced by spec never existed — `create` is net-new, not a migration | Build templates from scratch; the "issues" the context doc lists can't be re-verified against it |
| bun (repo) vs Node 22+ engines (CLI package) | CLI is runtime-agnostic ESM; repo keeps bun for dev; document in AGENTS.md |
| Committed 33k-line `bin/kira-kit.js` bundle | Untrack in Phase 1; CI builds it |
| `kira-registry-check` skill + playbook point at `scripts/build-registry.ts` internals | Update in Phase 3 alongside the check port |

## 12. Open questions for you (decide before Phase 2/5)

1. **Baseline:** commit the current uncommitted working-tree changes first as-is, or review/discard them first?
2. **Preset scope:** all 8 primaries × 5 base colors (40 presets) or a curated subset?
3. **Hooks as standalone items:** confirm consumers should `shadcn add @kira-kit/use-reduced-motion` directly (vs today's inlining) — affects existing users' expectations.
4. **`shadcn` version pin:** pin at current `4.22.1`, or bump to latest stable during Phase 0 before pinning?
5. **CI timing:** stand up the GitHub Actions workflow in Phase 1 (recommended) or defer to Phase 7?
