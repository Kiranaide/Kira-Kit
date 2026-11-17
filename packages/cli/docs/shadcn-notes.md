# shadcn CLI verification notes (spec §14)

Verified 2026-11-17 against locally installed **shadcn 4.22.1** (npm latest: **4.23.0**).
Answers below are authoritative for the pinned version; deviations from the spec noted.

## Confirmed facts

| Question                                      | Answer (shadcn 4.22.1)                                                                                                                                                                                                       |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components.json` `registries` syntax         | Supported. Root `components.json` already has `"registries": {}`; entries are `"@kira-kit": "https://kira-kit.vercel.app/r/{name}.json"`. `shadcn registry add` manages this map.                                            |
| `init` flag for Base UI                       | `shadcn init --base base` (choices: `base`, `radix`, `aria`). Also `-t, --template <next\|start\|vite\|react-router\|laravel\|astro>`, `--monorepo`, `--preset`, `-y/--yes`, `-f/--force`, `-c/--cwd`, `-n/--name`.          |
| Theme preset item type                        | `registry:theme` exists (also `registry:style`, `registry:base`, `registry:ui`, `registry:hook`, `registry:lib`, `registry:block`, `registry:file`, `registry:page`, `registry:item`). **Use `registry:theme` for presets.** |
| `cssVars` shape (Tailwind v4)                 | `{ theme?: Record<string,string>, light?: Record<string,string>, dark?: Record<string,string> }` — confirmed in `node_modules/shadcn/dist/index.d.ts`.                                                                       |
| `add` flags                                   | `-y/--yes -o/--overwrite -c/--cwd -a/--all -p/--path -s/--silent --dry-run --diff [path] --view [path]`. `--all` supported → `kira-kit add --all` can delegate with one invocation.                                          |
| `view` / `search` / `list`                    | All exist: `shadcn view <items...>`, `shadcn search                                                                                                                                                                          | list [registries...]`. Spec's "verify availability" → **available**. |
| `registry validate`                           | `shadcn registry validate [registry]` exists.                                                                                                                                                                                |
| `registry build`                              | `shadcn build [registry] -o <path>` (default `./public/r`).                                                                                                                                                                  |
| `migrate cn`                                  | `shadcn migrate cn` exists ("migrate clsx and tailwind-merge to cn"). Also `icons`, `base-color`, `radix`, `rtl` migrations.                                                                                                 |
| Local-file add                                | `add` accepts "names, url or local path" (init help arg description) → `shadcn add ./kira-theme.json` works.                                                                                                                 |
| `docs` command                                | `shadcn docs <components...>` — "get docs, api references and usage examples". Bonus beyond spec; consider using for per-item docs seeding.                                                                                  |
| `apply` / `preset` / `eject` / `info` / `mcp` | Additional 4.22.1 commands; `apply [preset]` and `preset` subcommand relate to theme presets.                                                                                                                                |

## Dependency versions researched (npm latest, 2026-11-17)

| Package                  | Latest               | Plan usage                          |
| ------------------------ | -------------------- | ----------------------------------- |
| shadcn                   | 4.23.0 (have 4.22.1) | pinned exact in packages/cli        |
| culori                   | 4.0.2                | OKLCH math, clampChroma             |
| apca-w3                  | 0.1.9                | APCA Lc (non-blocking report)       |
| cn                       | 0.5.2                | replaces clsx + tailwind-merge      |
| @clack/prompts           | 1.9.0                | replaces inquirer                   |
| es-module-lexer          | 3.0.5                | parser-based imports check          |
| package-manager-detector | 1.9.0                | create command dep install          |
| tsdown                   | 0.23.7               | CLI bundling (esbuild-based)        |
| vitest                   | 5.1.0                | unit + integration tests            |
| zod                      | 4.6.7 (current)      | components.json/registry validation |
| commander                | 15.1.0               | CLI wiring                          |
| @changesets/cli          | 3.0.3                | releases                            |
| @base-ui/react           | 1.9.0 (current)      | —                                   |
| gsap / @gsap/react       | 3.15.1 / 2.1.2       | —                                   |
| class-variance-authority | 0.7.1 (current)      | —                                   |

## Decisions

- Pin shadcn at the verified **4.22.1** first (all flags above verified against it); a bump
  to 4.23.0 is a deliberate later changeset with the acceptance suite re-run.
- Theme presets use `registry:theme`.
- `shadcn add --all` exists, so `kira-kit add --all` maps to a single delegated invocation.
- `shadcn docs` may seed `kira-kit build` docs generation; primary source stays our registry metadata.
