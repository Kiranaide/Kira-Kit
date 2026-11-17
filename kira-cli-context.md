# Kira Kit CLI — Improvement Spec (v1.0 target)

&gt; Hand-off spec for an AI coding agent. Based on [`kira-cli-context.md`](http://kira-cli-context.md) (current state, v0.2.1)

&gt; plus an interview with the maintainer and shadcn ecosystem research as of October 2026.

&gt; Read the whole file before changing code. Where this spec says "verify", check the docs

&gt; of the pinned shadcn version (`shadcn --help`, [ui.shadcn.com/docs](http://ui.shadcn.com/docs)) instead of guessing.

---

## 0. TL;DR

Kira Kit becomes a \*\*shadcn-compatible registry first\*\* and a \*\*thin CLI second\*\*.

- Users install components via shadcn's own CLI: `shadcn add @kira-kit/button`.

- The `kira-kit` CLI keeps only what shadcn doesn't do: \*\*OKLCH theme generation\*\*,

  \*\*quality checks (§8 playbook)\*\*, an \*\*embedded `create` scaffolder\*\*, a \*\*`migrate`\*\*

  command for v0.2.1 users, and \*\*agent docs\*\* (llms.txt + Markdown per item).

- `add` / `list` / `view` / `search` delegate to a \*\*pinned shadcn CLI\*\* via spawn.

- Everything that duplicated shadcn (alias resolution, package-manager detection, dep

  install, registry fetching, hand-maintained dependency maps) is \*\*deleted\*\*, not fixed.

---

## 1. Decisions (locked — do not re-litigate)

| Area | Decision |

|---|---|

| Strategy | Thin wrapper over shadcn CLI; registry is fully shadcn-compatible |

| Frameworks (day one) | Vite + React, Next.js App Router, TanStack Start / React Router, Monorepo (`packages/ui`) |

| Primitives | \*\*Base UI only\*\* (`@base-ui/react`) — matches shadcn's default since July 2026 |

| Hosting | \*\*Both\*\*: GitHub source registry (root `registry.json`) is the source of truth; Vercel serves docs + static built JSON at [`https://kira-kit.vercel.app/r`](https://kira-kit.vercel.app/r`) |

| Namespace | `@kira-kit` → `shadcn add @kira-kit/<item>` |

| Delegation | Spawn a \*\*pinned\*\* shadcn CLI version; pass through flags |

| `cn` utility | Adopt the \*\*`cn` npm package\*\* (shadcn moved to it Sept 2026). Drop `clsx` + `tailwind-merge` from base deps |

| Themes | \*\*Both\*\*: curated presets as registry items + CLI generator for custom colors |

| Contrast | Enforce \*\*WCAG 2.2 AA\*\* (blocking); report \*\*APCA\*\* as info |

| Quality checks | Warnings allowed locally; \*\*all checks block in CI\*\* unless suppressed inline with a reason |

| Prompts | `@clack/prompts` (replace inquirer); every prompt must also have a flag |

| `create` | \*\*Embedded\*\* in kira-kit (templates bundled in the package) — no sibling-package spawn |

| Templates | Vite + React, Next.js App Router, TanStack Start, Monorepo |

| Migration | New `kira-kit migrate` command for v0.2.1 users |

| Metadata | Hand-written `registry.json` (split via `include`) is the source of truth for title/description/categories/deps |

| Animation | \*\*Keep GSAP as-is\*\* where components already use it (but declare it properly and keep reduced-motion check) |

| Agent docs | `llms.txt` + one `.md` per registry item |

| Runtime / tests | Node \*\*22+\*\*, \*\*Vitest\*\* |

| Releases | \*\*Changesets\*\*; version read from `package.json` (single source of truth) |

---

## 2. Why (context for the agent)

As of Oct 2026 the shadcn CLI natively supports: namespaced registries configured in

`components.json`, Bearer-token private registries, public and private GitHub repos as

registries (root `registry.json`, no build step), `registry validate`, `include` for

splitting large registries, `--dry-run` / `--diff` / `--view` on `add`, `registry:base`

and `registry:font` item types, local-file registry items, package-imports/target-alias

resolution, and `migrate cn`. Kira Kit's own `add`/`list`/alias/dep-install code

re-implements this worse. Deleting it fixes known issues #2, #3, #5, #9 (partially), #12

and #13 from the context doc for free.

---

## 3. Target repository layout

\`\`\`

/registry.json # ROOT source registry (metadata + include list)

/src/components/ui/registry.json # items for ui/\* (included)

/src/hooks/registry.json # items for hooks/\* (included)

/src/themes/registry.json # generated theme presets (included)

/src/components/ui/\*.tsx

/src/hooks/\*.ts

/public/r/\*.json # BUILD OUTPUT (shadcn build) for Vercel — gitignored or CI-generated

/public/llms.txt # BUILD OUTPUT

/public/docs/&lt;item&gt;.md # BUILD OUTPUT

/scripts/build-registry.ts # THIN: calls packages/cli core functions, then `shadcn build`

/packages/cli/

package.json # name: kira-kit, bin: kira-kit, deps incl. pinned `shadcn`

templates/ # embedded create templates (shipped in npm "files")

    vite/  next/  tanstack-start/  monorepo/

src/

    index.ts                        # commander wiring; version from package.json

    commands/

      init.ts  add.ts  list.ts  theme.ts  check.ts  build.ts  create.ts  migrate.ts  docs.ts

    core/                           # PURE, unit-tested, no I/O side effects where possible

      checks/                       # one file per §8 check + runner

      theme/                        # palette math, contrast, preset → registry item

      registry/                     # load/validate source registry.json (+include)

      docs/                         # llms.txt + per-item md generation

      migrate/                      # components.json transforms

    lib/

      shadcn.ts                     # resolve pinned shadcn bin + spawn helper

      prompts.ts                    # @clack/prompts wrappers with non-interactive fallback

      logger.ts  fs.ts  errors.ts

test/ # Vitest; fixtures per framework layout

\`\`\`

Single rule: \*\*one implementation of every concern.\*\* `scripts/build-registry.ts` imports

from `packages/cli/src/core` (or the published package) — it must not contain its own logic.

---

## 4. Delete list

Remove entirely (and their tests/usages):

- `lib/registry.ts` (HTTP fetching) → shadcn fetches.

- `lib/deps.ts` (package-manager detection, `parseDependencies`, install) → shadcn installs.

- Inline package-manager detection in `init.ts`.

- `lib/build-config.ts` `NPM_DEPENDENCY_MAP` \*\*and\*\* `REGISTRY_DEPENDENCY_MAP`, plus the

  divergent copy in `scripts/build-registry.ts`. Dependencies are now declared per item in

  `registry.json`; check #1 verifies declarations against imports (see §7).

- All `aliases.replace("@/", "src/")` logic → shadcn resolves aliases/targets.

- `prompts/base-color.ts`, `primary-color.ts`, `project-type.ts` (inquirer) → `lib/prompts.ts`.

- `inquirer`, `@types/inquirer`, `clsx`/`tailwind-merge` from CLI-installed base deps.

- The `tsx` spawn of `../../create/src/index.ts`.

- Hardcoded `program.version("1.0.0")`.

---

## 5. Commands spec

All commands: non-interactive when `--yes` is passed, when `CI` is set, or when stdin is not

a TTY. Any prompt must have an equivalent flag. Exit codes: `0` ok, `1` user/validation

error, `2` network/registry error, `3` check failures. Errors print a cause and a next step,

never a bare "not found".

### 5.1 `kira-kit init`

1. If no `components.json`: run pinned `shadcn init` with Base UI as the base

   (\*\*verify\*\* exact flag, e.g. `--base`, for the pinned version).

2. Register the namespace in `components.json` `registries`:

   `"@kira-kit": "[https://kira-kit.vercel.app/r/{name}.json"](https://kira-kit.vercel.app/r/{name}.json"`)`. Idempotent; never clobber

   other registries. \*\*Verify\*\* exact `registries` syntax against current docs.

3. Theme: prompt (or `--preset <name>` / `--primary <color>` / `--base-color <name>`).

   Presets install as registry items (`shadcn add @kira-kit/theme-<name>`); custom colors go

   through `kira-kit theme` (5.4).

4. `--force` re-applies the theme even if `:root {` already exists (fixes issue #11).

   Without `--force`, if a theme exists, say so and print the command to replace it.

5. No direct writes to `lib/cn.ts` — shadcn init handles `cn`/`lib/utils.ts`.

### 5.2 `kira-kit add [items...] [--all]`

- Map names to `@kira-kit/<name>` (pass through anything already namespaced or a URL).

- Spawn `shadcn add` with pass-through flags: `--overwrite`, `--yes`, `--dry-run`, `--diff`,

  `--view`, `--path`, `--cwd`.

- `--all`: read the registry index once, pass all names in \*\*one\*\* shadcn invocation

  (fixes the double-prompt recursion, issue #12).

### 5.3 `kira-kit list` / `view` / `search`

Thin pass-through to `shadcn list|view|search @kira-kit` (\*\*verify\*\* availability per pinned

version). Keep a `--json` flag for agents.

### 5.4 `kira-kit theme [--primary <color>] [--base-color <name>] [--out <file>] [--apply]`

- Generate palette (see §8), run contrast verification, emit a valid

  `registry-item.json` with `cssVars` (light/dark + theme keys as required by the current

  Tailwind v4 schema — `cssVars.theme` replaces the deprecated tailwind config field).

- `--apply`: install it via shadcn's local-file support (`shadcn add ./kira-theme.json`).

- Fails (exit 1) if any AA pair fails; prints the failing pairs and suggested lightness.

- Invalid color input is an error with examples, \*\*never\*\* a silent fallback to `#3b82f6`.

### 5.5 `kira-kit check [paths...] [--ci] [--format pretty|json|github]`

- Runs §7 checks on component sources.

- Local default: errors fail, warnings print.

- `--ci` (auto-on when `CI` env is set): \*\*every finding fails\*\* unless suppressed.

- `--format github` emits GitHub Actions annotations.

### 5.6 `kira-kit build`

Maintainer command (also what `scripts/build-registry.ts` calls):

1. `kira-kit check --ci`

2. Regenerate theme preset items into `src/themes/registry.json`

3. `shadcn registry validate`

4. `shadcn build` → `public/r/`

5. Prune stale `public/r/*.json` (check #2)

6. Generate `public/llms.txt` + `public/docs/<item>.md` (§9)

### 5.7 `kira-kit create [dir] --template vite|next|tanstack-start|monorepo`

- Copies from `packages/cli/templates/<t>` (bundled via package.json `files`), resolved

  relative to the \*\*package root\*\* (`import.meta.url` → package dir), never monorepo paths.

- Each template ships pre-wired: `components.json` with `@kira-kit` registry, Base UI,

  `cn` package, a default theme preset, and one example component.

- Then optionally runs `init`-equivalent theme step and installs deps via shadcn or a

  printed command (do not reintroduce package-manager detection code; if needed, reuse a

  small maintained library such as `package-manager-detector`).

- Must work from `npx kira-kit create` in an empty temp dir (acceptance test).

### 5.8 `kira-kit migrate [--dry-run]`

For v0.2.1 projects. Idempotent; prints a diff in `--dry-run`.

- Replace legacy `registryUrl` in `components.json` with `registries["@kira-kit"]`.

- Run `shadcn migrate cn` to move from `lib/cn.ts`/clsx+tailwind-merge to the `cn` package.

- Rewrite imports of the old `lib/cn` path to the project's `utils` alias.

- Report (don't auto-modify) components whose local copy differs from the registry —

  suggest `kira-kit add <name> --diff`.

---

## 6. Registry spec

- Root `registry.json`: `$schema` (shadcn registry schema), `name: "kira-kit"`, `homepage`,

  `include: ["src/components/ui/registry.json", "src/hooks/registry.json", "src/themes/registry.json"]`.

- Every item declares, by hand: `name`, `type` (`registry:ui` | `registry:hook` |

  theme type — \*\*verify\*\* whether presets should be `registry:theme`, `registry:style` or

  `registry:base`), `title`, \*\*real\*\* `description` (no boilerplate), `categories`,

  `dependencies` (npm, with version ranges where breaking majors matter),

  `registryDependencies`, `files`.

- Kira-internal registry deps use `@kira-kit/<name>` (not bare names — bare names resolve

  to shadcn's own items).

- Components import `cn` from `"cn"` and declare `cn` in `dependencies`.

- GSAP components declare `gsap` and `@gsap/react` explicitly.

- Works three ways (all three are acceptance tests):

  `shadcn add @kira-kit/button`, `shadcn add <github-user>/<repo>/button`,

  `shadcn add [https://kira-kit.vercel.app/r/button.json](https://kira-kit.vercel.app/r/button.json`)`.

---

## 7. Quality checks (§8 playbook), reworked

Each check is a \*\*pure function\*\* `(file: SourceFile, ctx: CheckContext) => Finding[]` in

`core/checks/`, with its own unit tests. `Finding = { checkId, severity, file, line, col, message, fix? }`.

| # | Check | Change from today |

|---|---|---|

| 1 | Imports vs declared deps | Now \*\*bidirectional\*\*: every bare import must be in the item's `dependencies` (or a registry dep), and every declared dep must be imported. Handle `import "pkg"` side-effect imports, `import type`, dynamic `import()`, `export … from`, scoped deep subpaths (`@x/y/z`), `pkg/sub`, and `node:*` builtins (exempt). Use a real parser (e.g. `es-module-lexer` or TS compiler API), not regex. |

| 2 | Stale `public/r/*.json` | Unchanged (auto-prune in build). |

| 3 | Dead `animate-*` | Unchanged; keep builtin allowlist. |

| 4 | `data-slot`, cva `*Variants` export | Unchanged. |

| 5 | Motion without `useReducedMotion` / `gsap.matchMedia` | Unchanged; GSAP stays, so this matters. |

| 6 | Interactive target &lt; 24px (WCAG 2.5.8) | Unchanged. |

| 7 | Raw hex/rgb literals | Unchanged. |

| 8 | `transition-all` / layout-property transitions | Unchanged. |

| 9 | Arbitrary `z-[…]`/`shadow-[…]`/`rounded-[…]` | Unchanged. |

| 10 | \*\*New:\*\* registry item metadata | Description present, not boilerplate, ≥ 1 category. |

| 11 | \*\*New:\*\* Base UI only | Flag imports of `radix-ui`, `@radix-ui/*`, `react-aria*`. |

| 12 | \*\*New:\*\* `cn` source | Flag imports of `clsx`/`tailwind-merge`/local `lib/cn`. |

\*\*Suppression syntax\*\* (required in CI for any intentional violation):

`// kira-kit-ignore <checkId>: <reason>` on the line above, or file-level

`/* kira-kit-ignore-file <checkId>: <reason> */`. A suppression without a reason is itself

an error. Unused suppressions are a warning.

---

## 8. Theme generator rework (`core/theme/`)

- Build OKLCH colors \*\*numerically\*\* (`{ mode: "oklch", l, c, h }`) — no string hacking of

  `oklch(...)` for chart hue rotation.

- Remove hardcoded hue 343 for `primaryForeground`; derive foregrounds from the primary hue

  (or neutral), choosing lightness to satisfy contrast.

- Clamp to sRGB gamut (culori `clampChroma` or equivalent) before emitting; also emit

  values that render correctly in P3-capable browsers.

- Contrast verification for every role pair, light and dark:

  foreground/background, card-fg/card, popover-fg/popover, primary-fg/primary,

  secondary-fg/secondary, muted-fg/muted \*\*and\*\* muted-fg/background,

  accent-fg/accent, destructive-fg/destructive (or destructive/background),

  sidebar pairs, ring/background (3:1), border/background (3:1 if used as a UI boundary).

- Thresholds: text pairs ≥ 4.5:1, UI/large-text pairs ≥ 3:1 (\*\*blocking\*\*).

  Also compute APCA Lc (e.g. via `apca-w3`) and report it (\*\*non-blocking\*\*).

- If a pair fails, auto-adjust lightness within a bounded range before failing; record the

  adjustment in output.

- Curated presets (at least: the 8 named primaries × the 5 base colors, or a chosen subset)

  are generated at build time into `src/themes/registry.json` from the same function, so

  CLI-generated and preset themes are identical for the same input.

- Snapshot-test every preset's output; property-test random hues to prove AA always holds

  after adjustment.

---

## 9. Agent docs

Generated by `kira-kit build` from `registry.json` + usage examples:

- `public/llms.txt`: project summary, install instructions (`shadcn add @kira-kit/<item>`),

  conventions (Base UI, `cn` package, `data-slot`, reduced motion, tokens not raw colors),

  and a linked list of every item's `.md`.

- `public/docs/<item>.md`: title, description, install command, dependencies, registry

  deps, props/variants (from the cva definition where possible), one usage example,

  accessibility notes.

- Every docs page on the site should also be reachable as `.md` (same content).

---

## 10. Engineering standards

- Node ≥ 22 (`engines`), ESM only, TypeScript strict.

- Bundle with esbuild (or tsdown); `bin/kira-kit.js` is a build artifact, not committed.

- `shadcn` is a \*\*pinned exact\*\* dependency; resolve its bin from the package's own

  `node_modules` so behavior doesn't drift with `@latest`. Bumping it is a deliberate

  changeset with the acceptance suite re-run.

- Version: read from `package.json` at build time (esbuild `define`) — one source of truth.

- Changesets for `kira-kit` releases; changelog generated.

- Vitest: unit tests for every check, theme math, contrast, migrate transforms, docs

  generation. Integration tests run the built CLI against fixture projects for all four

  templates (temp dirs, no network — serve a local registry fixture).

- CI (GitHub Actions): typecheck, lint, unit, integration, `kira-kit build --ci`,

  `shadcn registry validate`; Node 22 and 24 matrix.

- Zod stays for validating `components.json` and registry files (confirm major version

  and keep schemas aligned with shadcn's published JSON schema).

---

## 11. Phased plan

1. \*\*Foundation:\*\* layout from §3, version single-source, Vitest + CI, `lib/shadcn.ts`

   spawn helper, `lib/prompts.ts` on @clack/prompts.

2. \*\*Registry migration:\*\* write root + included `registry.json` with real descriptions and

   explicit deps for every existing component/hook; switch components to `cn` package;

   delete dependency maps; `shadcn registry validate` green.

3. \*\*Checks:\*\* port §8 checks into `core/checks/` with parser-based imports, add 10–12,

   suppression syntax, `--ci`, `--format github`.

4. \*\*Thin commands:\*\* `add`/`list`/`view`/`search` delegation; delete old fetch/install code.

5. \*\*Theme:\*\* numeric palette, contrast enforcement, presets as registry items, `theme`

   command, `init --force`.

6. \*\*create + migrate:\*\* embedded templates for all four targets; `migrate` with dry-run.

7. \*\*Agent docs + release:\*\* llms.txt, per-item md, changesets, publish 1.0.0.

Each phase ends with tests green and no dead code from the phase left behind.

---

## 12. Acceptance criteria

- \[ \] `npx kira-kit create my-app --template <t>` works for all 4 templates from a clean temp

      dir using the \*\*published-style\*\* package (packed tarball), then `npm run build` passes.

- \[ \] In each template, `shadcn add @kira-kit/data-table` installs files to the correct

      alias paths (incl. Next.js root `@/` and monorepo `packages/ui`) and installs deps.

- \[ \] Same item installs via GitHub address and via direct Vercel URL.

- \[ \] `kira-kit add --all --yes` performs one shadcn invocation, no duplicate prompts.

- \[ \] Network failure produces exit code 2 with a clear message (not "not found").

- \[ \] No `NPM_DEPENDENCY_MAP`/`REGISTRY_DEPENDENCY_MAP`, no `replace("@/", "src/")`, no

      inquirer, no package-manager detection code remain in the repo.

- \[ \] `kira-kit --version` equals `package.json` version.

- \[ \] Every preset and 1,000 random generated palettes pass WCAG AA for all pairs in §8.

- \[ \] `kira-kit check --ci` fails on an unsuppressed warning and passes with a reasoned

      suppression.

- \[ \] `kira-kit migrate` on a v0.2.1 fixture produces a working project; running it twice

      changes nothing the second time.

- \[ \] `public/llms.txt` and one `.md` per item are generated and linked.

- \[ \] No registry item has a boilerplate description.

---

## 13. Non-goals

- Radix or React Aria variants.

- Re-implementing anything shadcn's CLI already does.

- Removing GSAP.

- Supporting Node &lt; 22.

## 14. Verify before implementing (things that move fast)

Check against the pinned shadcn version's docs/`--help`: the exact `components.json`

`registries` syntax, `init` flags for selecting Base UI, which item type theme presets

should use (`registry:theme` / `registry:style` / `registry:base`), the current

`cssVars` shape for Tailwind v4, and availability of `view`/`search`/`registry validate`.

If anything in this spec conflicts with the pinned version, follow the pinned version and

note the deviation in the PR description.
