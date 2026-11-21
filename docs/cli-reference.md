# kira-kit CLI reference

Everything the `kira-kit` binary accepts, does, writes, and refuses — verified against
`packages/cli/src` at version **0.4.0** rather than against `--help`, so where the two
disagree this file follows the code and says so in
[Help text vs. behavior](#help-text-vs-behavior).

- **Package:** `kira-kit` (npm), one bin: `kira-kit`. There are no aliases — no `kira`, no `kk`.
- **Runtime:** Node **≥ 22**, ESM. In this repo the CLI runs from source with `bun packages/cli/src/index.ts <cmd>`.
- **Version flag:** `-V, --version` (capital `V`, commander's default) → `0.4.0`. There is no `-v`.
- **No global flags:** `--verbose`, `--quiet`, `--no-color`, and `--config` do not exist.
- **Invoking it:** `npx kira-kit add button`, `bunx kira-kit list`, `pnpm dlx kira-kit theme --primary "#A5675B"`, or a global `npm i -g kira-kit`.

```bash
npm i -D kira-kit        # then: npx kira-kit <command>
bunx kira-kit init       # or run it straight from the registry site
```

## Reading this file

Each command section lists its flags, then what it does in order, then which files it
writes. Three properties apply across the board:

**Every flag is optional except where stated.** Commands with a required value tell you
via a `ValidationError` and exit `1`, never via a parser error.

**Prompts are silenced by four things,** and you should assume all four in automation:
`-y/--yes` where the command has it, a non-empty `CI` env var, `stdin` not being a TTY,
`stdout` not being a TTY. The last two matter even when you did not ask for them —
piping `kira-kit init | tee log.txt` takes the documented defaults (`geist`,
`geist-mono`, `tabler`, keep the current theme). Cancelling a prompt prints
`Cancelled.` and exits `1`.

**There is exactly one environment variable in kira-kit's own source:** `CI`, read in
`src/lib/prompts.ts` for the rule above. Nothing else is configurable by env — the
registry URL lives only in `components.json`, and there is no `KIRA_REGISTRY`, no
timeout, no cache directory, and no offline mode. Colors come from `picocolors`, so
`NO_COLOR` and `FORCE_COLOR` work as that library defines them.

### Exit codes

`src/lib/errors.ts` fixes the contract, and `run()` in `src/index.ts` funnels every
thrown `CliError` through it:

| Code | Name            | Means                                                                                                                                                                                                                                      |
| ---- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `0`  | `EXIT_OK`       | Success.                                                                                                                                                                                                                                   |
| `1`  | `EXIT_USER`     | Anything the operator got wrong or aborted: validation, unknown template/font/namespace, a React version below the floor, `check`'s registry-validation failure, a prompt cancel, an unknown flag, no command, or an unexpected exception. |
| `2`  | `EXIT_REGISTRY` | The registry could not be reached, returned a non-2xx status, or returned something that is not a valid item payload. Also a missing local item file.                                                                                      |
| `3`  | `EXIT_CHECKS`   | Quality-check findings: `kira-kit check`, and `build`'s pre-flight gate.                                                                                                                                                                   |

A `CliError` prints two lines to **stderr** and nothing else:

```text
error: No components.json found.
next step: Run 'kira-kit init' first.
```

`next step:` is always present on `CliError`, and the two `error: message` call sites
that bypass it (`theme` and `init` on a contrast failure) print only the first line.
Progress goes to stdout (`info`, `success`), `warn` to stderr.

### The one config file: `components.json`

`findConfigFile` looks at **exactly one path** — `<--cwd>/components.json`. There is no
parent-directory traversal, no `components.jsonc`, and no `package.json` fallback.
(`add`'s alias resolution _does_ walk upward, but for `tsconfig.json`, not for config.)

Both readers swallow every error and return `null`, so **a malformed `components.json`
is indistinguishable from a missing one.** `list`, `search`, `view` and `add --all` then
quietly use the built-in default registry URL; plain `add` and `migrate` hard-error with
`No components.json found.`

| Key                                                                                 | Read by                                 | Notes                                                                                                                   |
| ----------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `$schema`                                                                           | `migrate`                               | Set to the kira-kit URL when it previously mentioned `ui.shadcn.com`.                                                   |
| `style`                                                                             | `migrate`                               | Same condition; written as `"kira"` by `init`.                                                                          |
| `rsc`                                                                               | `add`                                   | `true` prepends `"use client";` to `registry:ui` and `registry:hook` files. `init` derives it from a `next` dependency. |
| `tsx`                                                                               | —                                       | Written by `init`, never read.                                                                                          |
| `tailwind.css`                                                                      | `init`, `add`, `theme`, `detectCssPath` | The single target for every CSS merge.                                                                                  |
| `tailwind.baseColor`, `tailwind.cssVariables`, `tailwind.config`, `tailwind.prefix` | —                                       | Written for shadcn compatibility, never read.                                                                           |
| `iconLibrary`                                                                       | `add`, `init`, `theme`, `check`         | `"lucide"` rewrites tabler imports and swaps the installed icon package.                                                |
| `font`, `fontMono`                                                                  | `init`, `theme`                         | Defaults `geist` / `geist-mono`.                                                                                        |
| `aliases.{components,ui,hooks,lib,utils}`                                           | `add`                                   | Where files land; resolved through `tsconfig` `compilerOptions.paths`.                                                  |
| `registries`                                                                        | every network command                   | Namespace → URL template. `{"@kira-kit": "https://kira-kit.vercel.app/r/{name}.json"}`.                                 |
| `registryUrl`                                                                       | `migrate` only                          | Legacy string; deleted on migration.                                                                                    |

The object is a zod `looseObject`, so **unknown keys pass validation and survive every
write** — that is why this repo's own file can carry `menuColor` and `menuAccent`
unmolested.

Default aliases: `components "@/components"`, `ui "@/components/ui"`, `hooks "@/hooks"`,
`lib "@/lib"`, `utils "@/lib/utils"`. If no `tsconfig` `paths` are found, `add` prints
`No tsconfig path aliases found — assuming @/ maps to src/.` and maps `@/x` → `<cwd>/src/x`.

---

## kira-kit create

Scaffold a project from a bundled template. Reads nothing, needs no config, no network.

```bash
kira-kit create [dir] [-t <template>] [--install] [--git] [-y]
```

| Flag                    | Default               | Meaning                                                                            |
| ----------------------- | --------------------- | ---------------------------------------------------------------------------------- |
| `[dir]`                 | `kira-<template>-app` | Target directory, resolved against the _invoking_ cwd. There is **no `-c/--cwd`**. |
| `-t, --template <name>` | prompt                | One of `vite`, `next`, `tanstack-start`, `monorepo`.                               |
| `--install`             | off                   | Run `<pm> install` in the new directory.                                           |
| `--no-install`          | —                     | **No-op.** Install is already off.                                                 |
| `--git`                 | off                   | Run `git init` in the new directory.                                               |
| `--no-git`              | —                     | **No-op.**                                                                         |
| `-y, --yes`             | `false`               | Skips the template prompt only.                                                    |

Order: resolve the template → `cpSync` `<package>/templates/<name>` → `git init` →
`<pm> install` → print next steps. Then it rewrites the new project's `package.json`
`name` to the target directory's basename.

- Without `-t`, and with `-y` or no TTY, it exits `1` with
  `No template specified.` An unknown name exits `1` too.
- A **non-empty** existing target exits `1` (`Target directory "…" is not empty.`). An
  empty existing directory is fine.
- `git init` failures are swallowed entirely — nothing is printed, and you get exit `0`.
- A failed `install` is a warning, not an error: it prints the manual command and exits `0`.
- The package manager comes from `package-manager-detector`, which walks **upward** from
  the target looking for lockfiles and `packageManager`, falling back to `npm`. It does
  not read `npm_config_user_agent`.
- All four templates already ship a `components.json`, so the next `init` takes the
  "fill existing config" path rather than writing a fresh one.

## kira-kit init

Install the base layer into an existing project: config, global CSS, utilities,
dependencies, icon library, and optionally a theme.

```bash
kira-kit init [-c <dir>] [--preset <name> | --primary <color>] [--base-color <name>]
              [--font <name>] [--font-mono <name>] [--icon <library>] [--force] [-y]
```

| Flag                  | Default      | Accepted values                                                                                               |
| --------------------- | ------------ | ------------------------------------------------------------------------------------------------------------- |
| `-c, --cwd <dir>`     | invoking cwd | Any directory.                                                                                                |
| `--preset <name>`     | none         | 9 built-ins (below) or **any** string, which becomes a registry fetch.                                        |
| `--primary <color>`   | none         | Any color `culori` parses: hex, named, `oklch()`, `hsl()`, `rgb()`.                                           |
| `--base-color <name>` | `neutral`    | `neutral, stone, zinc, gray, slate, mauve, olive, mist, taupe`. Invalid values **silently** become `neutral`. |
| `--font <name>`       | `geist`      | `geist, inter, manrope, plus-jakarta-sans, space-grotesk, dm-sans`. Invalid exits `1`.                        |
| `--font-mono <name>`  | `geist-mono` | `geist-mono, jetbrains-mono, fira-code`. Invalid exits `1`.                                                   |
| `--icon <library>`    | `tabler`     | `tabler`, `lucide`. Invalid exits `1`.                                                                        |
| `--force`             | `false`      | Re-apply the base stylesheet over an existing theme.                                                          |
| `-y, --yes`           | `false`      | Take every default.                                                                                           |

Order, and what each step can cost you:

1. **React gate.** Reads `dependencies.react`, then `devDependencies`, then
   `peerDependencies`, and parses the first `major.minor` in the range. Below **19.2**
   is a hard `1`: `Kira Kit requires React 19.2+ (found "…")`. A missing or unparseable
   range is only a warning.
2. **Prompts** (each skipped by its own flag, by `-y`, or by a non-TTY): sans font, mono
   font, icon library, then — only when neither `--preset` nor `--primary` was given —
   how to set up the theme, then `Primary color (hex, e.g. #e2694a)` validated against
   `/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i`, then an overwrite confirm if a theme
   already exists.
3. **Writes `components.json`** — fresh, or merged over the existing one (`iconLibrary`,
   `font`, `fontMono` overwritten; `aliases` merged; `tailwind.css` set only if absent).
   Then registers `registries["@kira-kit"]` **without ever clobbering an existing entry**.
4. **Writes the global stylesheet.** The path is auto-detected: config `tailwind.css`,
   else the first existing of `src/index.css`, `src/app/globals.css`, `app/globals.css`,
   else `app/globals.css` when an `app/` dir exists, else `src/index.css`. If that file
   exists and contains the substring `:root`, and `--force` is absent, **your CSS is left
   alone** (only font `@import`s may be swapped). With `--force`, or with no theme
   present, the file is **replaced wholesale** and `kira-utilities.css` is written next to
   it. That `:root` test is a substring check, not a schema check.
5. **Installs base dependencies** (any that are missing): `@base-ui/react`, `cn`,
   `class-variance-authority`, `@tabler/icons-react` or `lucide-react`, `tailwindcss`,
   `tw-animate-css`, `@fontsource-variable/<sans>`, `@fontsource-variable/<mono>`. Note
   that `cn` is a real npm package, not shadcn's `lib/utils`. Declining the prompt is a
   warning, not a failure.
6. **Applies the icon library.** Always writes `iconLibrary` back to the config. For
   `lucide`, installs `lucide-react` and **rewrites every `@tabler/icons-react` import in
   every `.ts/.tsx/.js/.jsx` file under `cwd`** (skipping `node_modules`, `.git`, `dist`),
   converting `stroke=` props to `strokeWidth=`. An icon with no mapping exits `1`.
7. **Theme.** `--preset` matching a built-in generates offline and writes
   `kira-theme.json`; `--primary` generates `theme-custom` and writes `kira-theme.json`;
   anything else leaves the default theme in place.

The nine built-in presets, all generated offline: `ember-press`, `oxblood-atelier`,
`olive-ledger`, `laurel-study`, `phase-line`, `cryostat`, `low-orbit`, `coral-circuit`,
`magenta-riot`.
**`--preset` is not validated against that list.** A typo silently becomes a live fetch of
`@kira-kit/theme-<typo>`, so you get exit `2` and a message that mentions the URL, not
`unknown preset`.

A theme that fails WCAG AA after bounded auto-adjustment prints
`error: Theme failed WCAG AA contrast for N pair(s): …` and exits `1` (no `next step:`
line — this path bypasses `CliError`). APCA figures are printed as information only and
never block.

## kira-kit add

Resolve items plus their dependency tree from a registry, install their npm
dependencies, and write their files.

```bash
kira-kit add [items...] [-c <dir>] [-a] [-o] [-p <path>] [-y]
             [--dry-run] [--diff] [--view]
```

| Flag                | Default        | Meaning                                                                          |
| ------------------- | -------------- | -------------------------------------------------------------------------------- |
| `[items...]`        | —              | Names, `@ns/name`, URLs, or local paths. Effectively required unless `-a`.       |
| `-c, --cwd <dir>`   | invoking cwd   |                                                                                  |
| `-a, --all`         | `false`        | Every **installable** item: `registry:ui`, `registry:hook`, `registry:lib` only. |
| `-o, --overwrite`   | `false`        | Replace existing files that differ.                                              |
| `-p, --path <path>` | the `ui` alias | Only affects `registry:ui` items whose payload sets no `file.target`.            |
| `-y, --yes`         | `false`        | Skip confirms. **Does not imply `--overwrite`.**                                 |
| `--dry-run`         | `false`        | Plan and report, write nothing, install nothing.                                 |
| `--diff`            | `false`        | Print a unified patch for files that would change.                               |
| `--view`            | `false`        | Print the full planned content of every file.                                    |

**Addressing.** A bare name becomes `@kira-kit/<name>`, so `add button` and
`add @kira-kit/button` are the same call. Anything starting with `@`, `http://`,
`https://`, `./`, `../`, `/`, a Windows drive letter, or exactly `.`/`..` passes through
untouched — which means `kira-kit add ./public/r/button.json` works against a local build.

**Validation:** no items and no `-a` → `1`. `-a` together with names →
`--all cannot be combined with explicit item names.` (`1`, the only mutually exclusive
pair in this command). An index with nothing installable → `2`.

**`--diff` and `--view` are a different code path** (`preview()`), and they ignore
`--dry-run`, `--yes`, and `--overwrite` completely. They still hit the network for the
whole tree, still run every content transform, write nothing, and install nothing.
`--view` wins if both are passed.

**Write path, in order:** resolve the tree (depth-first over `registryDependencies`,
deduped per resolved location, cycles tolerated) → install npm deps (the union of item
`dependencies`, minus `react`/`react-dom`/`next`, minus anything already in your
manifest, with a few versions pinned) → write files → merge `cssVars` → merge item `css`.
Because dependency resolution is recursive, a single `add` can issue many HTTP requests,
and there is no cache, timeout, or retry.

Destination per item type, after a payload `file.target` (which always wins):
`registry:ui` → `<ui alias>/<basename>`, or `join(cwd, --path, basename)`; `registry:hook`
→ `<hooks alias>`; `registry:lib` → `<lib alias>` with a leading `src/lib/` stripped;
`registry:style` → **the directory of `tailwind.css`**; anything else → resolved against
`cwd`.

Content transforms on the way out: CRLF → LF, `@/…` specifiers rewritten to your aliases,
tabler → lucide imports when `iconLibrary: "lucide"`, `"use client";` prepended when
`rsc: true`.

**Conflicts** (file exists and differs): `-o` replaces; `-y` or `--dry-run` **skips** with
`N existing file(s) differ — skipped (use --overwrite to replace).`; an interactive run
asks `Overwrite N existing file(s)?` with the default **No**. Files whose content already
matches are counted as skipped even under `-o`.

Last line: `Added <n> item(s): <w> file(s) written, <s> skipped.` plus
` Global stylesheet updated.` when a CSS merge changed something. Under `--dry-run` that
line still says "written".

## kira-kit list / search / view

Read-only, network-backed, and the only commands that tolerate a broken config by falling
back to the default registry URL.

```bash
kira-kit list [--json] [-c <dir>]
kira-kit search [query...] [--json] [-c <dir>]
kira-kit view [items...] [-c <dir>]
```

| Command  | Flags          | Output                                                                                                                                                                           |
| -------- | -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `list`   | `-c`, `--json` | `name` padded to 28, `type` (the `registry:` prefix stripped, `ui` when absent) padded to 10, `description ?? title`. `--json` dumps the raw index array.                        |
| `search` | `-c`, `--json` | Same rows without the type column.                                                                                                                                               |
| `view`   | `-c` only      | Title, `name`, description, `npm dependencies: …`, then each file under a `--- <registry path> ---` header. **The path shown is registry-relative, not where it would install.** |

`search` joins its positional words with a space and matches **AND-wise, case-insensitive,
substring** against `name + title + description` only — categories and file paths are not
searched. An empty query matches everything and prints `… match(es) for "(all items)"`.

`view` fetches the single item and **does not follow `registryDependencies`**, unlike
`add`. It has no `--json`, no write flags, and no overwrite concept.

## kira-kit theme

Generate an OKLCH theme from a primary color, or change typography and icons, without
re-running `init`. Fully offline.

```bash
kira-kit theme [--primary <color>] [--base-color <name>] [--font <name>]
               [--font-mono <name>] [--icon <library>] [--out <file>] [--apply] [-c <dir>]
```

| Flag                                | Default                                        | Notes                                                                     |
| ----------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------- |
| `--primary <color>`                 | none                                           | Switches to palette mode.                                                 |
| `--base-color <name>`               | `neutral`                                      | Used **only** with `--primary`; invalid values silently become `neutral`. |
| `--font` / `--font-mono` / `--icon` | config, else `geist` / `geist-mono` / `tabler` | Same value sets and errors as `init`.                                     |
| `--out <file>`                      | `kira-theme.json`                              | Resolved as `join(cwd, out)`. Used **only** with `--primary`.             |
| `--apply`                           | `false`                                        | Write the CSS and config changes.                                         |
| `-c, --cwd <dir>`                   | invoking cwd                                   |                                                                           |

There is **no `-y`**: `theme` passes `yes: true` internally to every step, so it never
asks — but it will still spawn a package manager to install fontsource packages.

Three behaviors:

- **Nothing passed** → `Nothing to generate or apply.` (`1`).
- **Typography only** (no `--primary`): without `--apply` it prints
  `Would apply: sans=…, mono=…, icons=….` and writes nothing. With `--apply` it applies
  only the parts you actually passed a flag for.
- **Palette mode** (`--primary`): prints a `adjusted <scheme>.<token> lightness …` line
  per auto-correction and the weakest APCA text pair, then **always writes the built
  `registry:theme` item JSON** to `--out`. Without `--apply` that is all it does — the
  file exists but your CSS and config are untouched, and it tells you to re-run with
  `--apply`. With `--apply` it installs the generated item with `overwrite: true`
  unconditionally (there is no `--force` here), merges `cssVars` into `tailwind.css`,
  then applies typography.

## kira-kit check

The 13 source quality checks plus the suppression parser, run over kit sources.

```bash
kira-kit check [dirs...] [--ci] [--format <pretty|json|github>] [--json]
```

| Flag           | Default                                     | Meaning                                                                      |
| -------------- | ------------------------------------------- | ---------------------------------------------------------------------------- |
| `[dirs...]`    | `src/components/ui`, `src/hooks`, `src/lib` | **Directories only.** A file path crashes with `ENOTDIR …` and exits `1`.    |
| `--ci`         | `false`                                     | Every unsuppressed finding fails, not just errors.                           |
| `--format <f>` | `pretty`                                    | `pretty`, `json`, or `github`. An unrecognized value silently prints pretty. |
| `--json`       | `false`                                     | Shorthand for `--format json`, and it wins over `--format`.                  |

`check` is the one repo-oriented command with **no `-c/--cwd`**: the repo root is always
`process.cwd()`.

With no paths it scans `.ts`/`.tsx` files at the top level of those three directories,
with no recursion — except `src/lib`, which recurses but only checks modules a
`registry:lib` item actually ships. Files named `registry`, `content-keys`, `index`, and
`prop-guards` are always skipped. Context comes from `src/index.css`, `components.json`
(for `iconLibrary`), and the four source registries (`src/components/ui`, `src/hooks`,
`src/lib`, `src/themes`).

| checkId              | Severity              | Flags                                                                                                             |
| -------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `imports-deps`       | error                 | An import the item's `dependencies` / `registryDependencies` do not declare.                                      |
| `base-ui-only`       | error                 | A Radix or React Aria import.                                                                                     |
| `cn-source`          | error                 | Class merging not coming from the `cn` package.                                                                   |
| `dead-animate`       | error                 | `animate-*` with no matching `--animate-*` token and `@keyframes` in `src/index.css` (Tailwind built-ins exempt). |
| `registry-metadata`  | error                 | A missing, boilerplate (`/^todo:/i`), or category-less registry entry.                                            |
| `lib-resolution`     | error                 | Layering violations, relative imports escaping the item, unknown lib items.                                       |
| `data-slot-cva`      | warning               | No `data-slot=` in the file, or cva used without exporting `*Variants`.                                           |
| `reduced-motion`     | warning               | gsap or `animate-*` without reduced-motion gating.                                                                |
| `target-size`        | warning               | An interactive element whose `h-*`/`size-*` is under 24px (WCAG 2.5.8).                                           |
| `raw-colors`         | warning               | A raw hex/rgb literal where a token belongs.                                                                      |
| `layout-transitions` | warning               | `transition-all`, or a transition on a layout property.                                                           |
| `arbitrary-values`   | warning               | A one-off `-[…]` value outside the token scales.                                                                  |
| `spacing-scale`      | warning               | A half-step on `h/w/size/min-*/gap*/px/pl/pr/ps/pe` — use the 4px scale or document the optical exception.        |
| `suppression`        | error **and** warning | Emitted by the parser: a `kira-kit-ignore` without a reason is an error, one that matches nothing is a warning.   |

Warnings do not fail a default run; they fail a `--ci` run. `failing` is
`findings.length` under `--ci` and the error count otherwise, and any non-zero value
exits `3`.

**Suppressions** are the only escape hatch — there is no ignore file and no config key.
A reason is mandatory, and one that suppresses nothing is reported:

```tsx
// kira-kit-ignore target-size: 20px density toggle, documented in DESIGN.md
<button className="size-5" />;

{
  /* kira-kit-ignore arbitrary-values: optical alignment against the 1px border */
}
<div className="w-[13px]" />;

/* kira-kit-ignore-file raw-colors: this file defines the raw palette itself */
```

A line comment covers the next non-suppression line, or a whole multi-line JSX opening
tag (up to 40 lines) when one follows; stacked comments all cover the same target.

Output: `pretty` prints `  ✖ [id] file:line — message` lines, a suppressed count, and
`N files checked — M finding(s)`; `github` prints `::error file=…,line=…,title=<id>::…`
annotations, expanding the `ui/`, `hooks/`, `lib/`, `pages/` label prefixes back to real
paths; `json` prints an **object** — `{findings, suppressed, ci, failing, filesChecked}`
— not an array.

## kira-kit build

Maintainer-only: regenerate the whole published registry from this repo's sources. No
network, and the only command that deletes files.

```bash
kira-kit build [-c <dir>] [--skip-checks]
```

`-c/--cwd` is honored **only if `<cwd>/registry.json` exists**, and silently falls back to
`process.cwd()` otherwise.

Order, and what lands on disk (all paths relative to the repo root):

1. **Quality gate** (unless `--skip-checks`): `runChecks({ repoRoot, paths: [], ci: false })`.
   Any error prints the findings and exits **`3`** before writing anything.
2. **`src/themes/registry.json`** — rewritten: `theme-default` (extracted from the depth-0
   `:root`/`.dark` tokens of `src/index.css`, skipping `--animate-*` and `--ease-*`) plus
   the 9 generated presets.
3. **Registry validation** — every declared file exists, and every internal, `@/lib`, and
   relative import resolves inside the item or its transitive dependency closure.
   Failures exit **`1`**, _after_ step 2 has already written the themes file.
4. **`public/r/<name>.json`** per item, plus a synthesized `kira-base` `registry:style`
   item, and **`public/r/registry.json`** as the index (metadata only, `content` stripped).
5. **Pruning** — any `public/r/*.json` that this build did not produce is deleted, one
   `Pruned stale registry output:` line each. `registry.json` is never pruned.
6. **`public/llms.txt`** and **`public/docs/<name>.md`** per item.
7. **`public/schema/{registry,registry-item,components}.json`**, generated from the zod
   schemas via `z.toJSONSchema`.

It reads `registry.json`, `src/index.css`, and `src/styles/kira-utilities.css`
unconditionally, so it only works inside the kit repo, and a missing one exits `1`.
Duplicate item names across `include[]` files are fatal.

## kira-kit migrate

Move an older project onto the current conventions: the `@kira-kit` registry namespace,
the `cn` package, and a report of local drift.

```bash
kira-kit migrate [-c <dir>] [--dry-run] [-y]
```

Requires `components.json` and exits `1` without one.

- **`--dry-run`** prints the plan and exits `0` — no writes, no install, no network, and
  deliberately **no divergence check**.
- **Config leg:** upserts `registries["@kira-kit"]`, reusing a legacy `registryUrl` value
  (appending `/{name}.json` when absent) rather than dropping it, deletes `registryUrl`,
  and replaces `$schema`/`style` with kira values only when the old `$schema` mentioned
  `ui.shadcn.com`. An existing `@kira-kit` entry is never overwritten.
- **`cn` leg:** scans `<cwd>/src` recursively (`.ts`/`.tsx`/`.js`/`.jsx`, skipping
  `node_modules`, `.git`, `dist`) for `@/lib/cn`, `@/lib/cn.ts`, `@/utils/cn`,
  `@/helpers/cn`, `clsx`, and `tailwind-merge` import specifiers, rewrites them to
  `import { cn } from "cn"`, collapses `twMerge(`/`clsx(` calls into `cn(`, dedupes, and
  installs `cn` if your manifest lacks it. Note the file list is resolved against the
  _invoking_ directory while the scan root is `<--cwd>/src`.
- **Divergence leg:** for each `*.tsx` in `src/components/ui` (minus `index`, `registry`)
  it fetches `@kira-kit/<name>` — one request per component, failures silently skipped —
  and byte-compares trimmed content, printing the list plus a
  `kira-kit add <name> --diff` suggestion. **`-y` skips this report entirely**, so an
  automated run looks shorter and says nothing about drift. `migrate` never modifies a
  component.

---

## Continuous integration

```yaml
- run: npx kira-kit check src/components/ui --ci --format github
```

`--format github` turns findings into inline annotations on the files they belong to.
`--ci` turns warnings into failures — remember that this is **opt-in**, and setting the
`CI` env var alone only silences prompts. The exit-code contract (`3` for findings) is
what actually fails the step, so no wrapper script is needed.

`kira-kit build` runs the same checks before writing anything, but always in
non-`--ci` mode; use `--skip-checks` only when a separate `check` step already covers it.

## Help text vs. behavior

Five places where `--help` and this file disagree. The code is what runs.

| Help says                                                                    | Code does                                                                                                                               |
| ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `create --install` / `--git`, with `--no-install` / `--no-git` also declared | Both positives default to **off**, so the negations are no-ops. Pass `--install` / `--git` to get either.                               |
| `add --all`: "Add every item in the registry"                                | Only `registry:ui`, `registry:hook`, `registry:lib`. Themes and styles are excluded by design; install a theme with `add theme-<name>`. |
| `migrate --dry-run` prints `components.json: update aliases.lib to "…"`      | The apply path never writes `aliases.lib`. That line is aspirational.                                                                   |
| `build -c, --cwd`                                                            | Silently ignored unless `<cwd>/registry.json` exists.                                                                                   |
| `view` and `add` described alike                                             | `add` resolves `registryDependencies`; `view` fetches exactly one item.                                                                 |

Two smaller ones: `init --preset <typo>` is not rejected locally but fetched remotely
(exit `2`, not "unknown preset"), and `theme --font x` without `--apply` writes nothing
while still validating the font name.

A third was fixed rather than documented: published 0.4.0 prints `check --ci` as
"(auto when CI is set)", but nothing in `check` reads `process.env.CI` — strict mode is
`Boolean(options.ci)`, deliberately, so an environment cannot turn warnings into
failures nobody asked for. The help string on `development` now says what the flag does.
