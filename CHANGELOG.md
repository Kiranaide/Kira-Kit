# Changelog

All notable changes to Kira Kit and the `kira-kit` CLI are documented here, in
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format. The kit's
components are source files you own, so entries describe the registry surface
you install, not a published package's dependency tree. The CLI is versioned
with Changesets; per-component history lives on each component's docs page.

## 0.6.0 — November 27, 2026

### Breaking

- **Dedicated `kira-kit.json` configuration and Kira-native schema.** Replaced `components.json` and `/schema/components.json` with `kira-kit.json` and `/schema/kira-kit.json`, moving `css` to the top level, grouping theme settings (`preset`, `primary`, `baseColor`, `font`, `fontDisplay`, `fontMono`, `fontPreset`, `radius`, `surface`) under `theme`, and dropping obsolete keys (`style`, `tsx`, `tailwind.*`, `aliases.utils`). Existing projects can convert automatically with `kira-kit migrate`.

### Fixed

- **Full-stack `@types/node` timer ref compatibility.** Widened internal timer-ref helper/interface annotations from `number` to `ReturnType<typeof setTimeout>` / `ReturnType<typeof setInterval>` in `input`, `sidebar`, `announcement-bar`, `camera`, and `use-camera`, and added `tsconfig.registry-node.json` to `tsc -b` to guard against regressions.

## 0.5.0 — November 27, 2026

### Breaking

- **CLI runtime floor.** The CLI now requires Node.js 22.12.0 as the minimum supported version.
- **Input, Badge, Layout, and Sidebar architectural realignments.** Extracted `otp-input`, `rating`, and `theme-provider` into standalone registry items; removed `InputWithLabel`, `InputWithButton`, `InputWithTooltip`, `InputWithDropdown`, `InputCluster`, `OTPInput`, `Rating`, and `RatingDisplay` from `input.tsx` (breaking the `input ↔ field` cycle; 10 → 1 transitive dep); removed duplicate `TagInput` from `badge.tsx` and `IconButtonWithTooltip` from `button.tsx`; stripped `loading`/`error`/`onRetry` (`Skeleton` + `Button`) from `KiraContainer`, `KiraGrid`, `KiraStack`, and `KiraSpacer` so layout primitives remain pure leaves; and renamed `badgeVariants` → `sidebarBadgeVariants` in `sidebar.tsx`.
- **Native install engine — no external CLI.** init, add, build, list, view, search, theme, and migrate now run on a self-contained registry client. init installs the kit's own base CSS and default theme with no base-theme picker; add --all installs components, hooks, and lib modules (themes and styles are excluded). React 19.2+ is required and enforced by init.

### Added

- **TanStack Form integration example.** The Field page adds a runnable example with copyable source for email validation, submission, and reset using `KiraField`.
- **Whole-graph registry cycle detection in CLI and ThemeProvider / Sidebar / Toast setup guides.** Added `packages/cli/src/core/checks/registry-graph.ts` (wired into `kira-kit check` and `kira-kit build` with unit tests) to catch circular registry dependencies before build, plus segmented setup guides for `ThemeProvider`, `Sidebar` router adapters, and `Toast` across Installation and component docs.
- **A complete CLI reference.** `docs/cli-reference.md` documents all ten commands flag by flag — defaults, prompts, exactly which files each command writes, the registry address grammar, the thirteen checks with their severities, the suppression grammar, and the exit-code contract — verified against `packages/cli/src` rather than against `--help`, and `/docs/cli` now links to it. The six places where the help text and the code disagree are listed as their own table instead of being repeated as features.
- **Changelog coverage on every component page.** Flex gained the Changelog section it was missing, so each of the 73 pages that documents an installable component now records its own version history alongside this page. The six pattern pages (color-usage, image, layout-utilities, modal, typography, video-player) teach with existing primitives and have nothing of their own to version.
- **Route transition utilities.** New RouteTransition (keyed entrance with fade, fade-up, fade-down, slide-left, slide-right, zoom, and none variants — movement variants ride a gentle spring curve with ~7% overshoot at 250ms) and NavigationProgress (glowing 2px top bar with grace delay, CSS trickle, and interruptible completion) components, plus a reduced-motion-aware startViewTransition lib helper. All motion is composite-only, with a variant gallery at /components/route-transition and a choosing-a-variant guide at /docs/transitions.
- **Per-item CSS injection in the CLI.** Registry items can now carry a css snippet: kira-kit add route-transition merges the spring token, entrance keyframes, and view-transition tuning straight into your global stylesheet. The merge is idempotent — tokens upsert, keyframes replace, and @media blocks merge without clobbering existing rules. The TanStack Start template ships pre-wired with route transitions.
- **Lib support modules ship with components.** The src/lib support modules are now registry:lib items resolved transitively, so color-picker and every other component install complete. A new lib-resolution check prevents missing-module regressions.
- **Published JSON schemas.** registry, registry-item, and components schemas are emitted to /schema/*.json and referenced by built payloads and new configs.
- **Font options for sans and mono.** init and theme accept --font (geist, inter, manrope, plus-jakarta-sans, space-grotesk, dm-sans) and --font-mono (geist-mono, jetbrains-mono, fira-code). Fonts apply to existing projects without --force — only the @fontsource imports and font tokens change, never colors. The theming page previews every pairing live, and the preview persists across pages and reloads.
- **Icon library switch: Tabler or Lucide.** --icon lucide rewrites icon imports at install time, keeping local names aliased so usages keep their names. Filled Tabler icons get fill="currentColor" injected and Tabler stroke-width props become strokeWidth; a few names map to approximate Lucide equivalents. Switch an existing project with kira-kit theme --icon lucide --apply, then kira-kit add --all --overwrite.

### Changed

- **Shared optimistic commit seam, CSS micro-motion, unified layout responsive engine, router-agnostic Sidebar, and header Preset Studio popover.** Added `use-optimistic-commit` (`OptimisticFeedbackProvider` + `useOptimisticCommit`) and Tailwind `--animate-*` CSS motion across `button`, `checkbox`, `switch`, `toggle`, and `toggle-group` (removing direct toast and GSAP micro-motion deps); unified responsive resolution in `lib/layout-responsive.ts` and upgraded `Box` and `Flex` onto Base UI `useRender` + `mergeProps`; added `SidebarRouterProvider` so `Sidebar` works without `@tanstack/react-router`; aligned `command`, `announcement-bar`, `field`, `date-picker`, and `time-picker` onto kit seams; dropped `zod` from `stepper`; extracted `use-visibility-pause` and `lib/layout-storage`; organized site chrome under `src/components/site/` with a top-bar Preset Studio popover and appearance toggle; and adopted `prefersReducedMotion()` in doc pages.
- **DatePicker and TimePicker migrated onto Base UI `Popover`, and overlay wrappers narrowed to static `className`/`style`.** `DatePicker` and `TimePicker` now use `@base-ui/react/popover` (`Popover.Root`, `Trigger`, `Portal`, `Positioner`, `Popup`) instead of native `[popover="auto"]` + CSS Anchor Positioning, dropping the `.kira-anchored-popover` stylesheet rules across base CSS and all four CLI templates. Eleven Base UI overlay and menu wrappers (`alert-dialog`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `menubar`, `navigation-menu`, `popover`, `radio-group`, `tooltip`) now accept static `className?: string` / `style?: React.CSSProperties` and style states via Base UI's native `data-*` attributes and `cn(...)`, removing `@kira-kit/component-utils` from `dialog`, `drawer`, `menubar`, `popover`, and `time-picker`.
- **Shared native anchored-popover & Base UI state-prop helpers in `@kira-kit/component-utils`.** Consolidated `mergeClassName`, `mergeStyle`, and `useNativePopover` into `src/lib/component-utils.ts` across all overlay components and pickers, unified `.date-picker-popover` and `.time-picker-popover` into `.kira-anchored-popover` in base CSS and all four CLI templates, and removed the duplicate `--animate-toast-progress` block and discarded `useMediaQuery` subscription in `TimePicker`.
- **Memoized check AST extraction, `kira-kit check -c <dir>`, and centralized `ClientContext`.** `checks/runner.ts` now parses TypeScript imports once per file across `imports-deps`, `base-ui-only`, `cn-source`, and `lib-resolution`; `cn-source` uses AST `lib` imports instead of a regex fallback; `dead-animate` replaces its shared stateful `/g` `RegExp` with `matchAll`; `kira-kit check` accepts `-c, --cwd`; `ComponentsConfig` is inferred directly from `componentsConfigSchema`; and `createClientContext()` centralizes registry context creation across `list`, `view`, `search`, `add`, and `engine` with new command-level tests.
- **Unified docs article shell (`DocPage`) with mobile section navigation across all docs pages.** Folded `MobileJumpToSection`, accessible anchor focusing (`tabIndex={-1}` + `focus({ preventScroll: true })`), optional explicit `sections`, and section `meta` into `src/components/docs/doc-page.tsx`, migrated `Typeset`, `Form`, and `Changelog` onto `DocPage`, and deleted the duplicate `doc-guide.tsx` shell (−404 lines).
- **Unified registry discovery and kit CSS loading across `kira-kit check` and `kira-kit build`.** `checks/runner.ts` now reads registry items through `core/registry/loader.ts` (`loadItemMetaMap`, `loadKitCss`) instead of hardcoding four registry JSON paths and skipping `kira-utilities.css`, and `dead-animate.ts` shares `ANIMATE_BUILTINS` with `motion-css.ts`.
- **Unified CLI runtime setup & AST patching (`core/init/setup.ts`, `ast-patch.ts`).** Extracted the five duplicated TypeScript/JSONC AST object-patching helpers from `tsconfig.ts` and `configure-runtime.ts` into `core/init/ast-patch.ts`, shared `POSTCSS_CONFIGS` from `detect-runtime.ts`, and collapsed `init`'s multi-step runtime/tsconfig orchestration behind one `setupProjectRuntime(cwd)` interface.
- **Unified component boundary plumbing into `@kira-kit/component-utils`.** Merged the five tiny `src/lib/component-*.ts` modules (`component-defaults`, `component-item-keys`, `component-native-props`, `component-prop-guards`, `component-refs`) and the two duplicated `src/components/ui/{prop-guards,content-keys}.ts` files into one `src/lib/component-utils.ts` registry item (`@kira-kit/component-utils`), standardizing on `isFunctionProp` and `withOccurrenceKeys` across all UI components and pruning the five legacy `public/r/component-*.json` items.
- **Single source of truth for the theme & font studio catalog.** `kira-kit build` now emits `src/themes/catalog.json` directly from the CLI's WCAG-verified base colors, radius/surface presets, fonts, font pairings, and recipe defaults. The docs app consolidates `presets-catalog.ts`, `fonts.ts`, `font-preview.ts`, and its duplicated token cascade into one `src/lib/theme-studio.ts` module, eliminating ~600 lines of hand-mirrored definitions and CLI-to-docs drift.
- **Redesigned Typeset, Form, and Changelog pages.** All three pages now have mobile section navigation. Typeset shows font specimens and a visual type scale, Form demonstrates validation and recovery in a live workspace form, and Changelog groups older releases into expandable rows.

- **Redesigned `/ui-preview` and `/overview` to match the Phase Line spec.** `/ui-preview` now runs in `DocPage` with an interactive 4-component playground (`Button`, `Input`, `Select`, `Dialog` with live Preview/Code tabs and reset feedback), a 5-tier control size comparison table, size-selectable input combinations, a Demo/Worst-case input actions matrix, menu & overlay comparisons, container and form spacing cards, and live side-by-side light/dark preset previews with a mobile section-jump selector. `/overview` adopts `DocPage` with a version status badge, inline copyable `npx kira-kit init` pill, key metrics strip, 2×2 Start Here path cards, architecture pillars, a 6-category linked component catalog, and a high-contrast Quickstart CLI terminal card. All motion honors `prefers-reduced-motion: reduce`.
- **Docs chrome is themed, not hand-painted.** The preview-page shell that was built for this branch shipped with its own invented palette; every `--docs-*` token is now gone from base CSS, the registry, and the CLI templates. The shell derives its accent ink, chips, hover tints, and focus ring from the active theme's `--primary`, `--foreground`, `--muted`, and `--success`/`--info`/`--warning`/`--destructive` through `color-mix`, so a preset switch retints the documentation alongside the components. All 600 text-, chip-, and indicator-on-surface pairs were verified numerically across the 10 presets in light and dark.
- **Every page runs in the Preview Page frame.** All 89 routes — the 79 component and pattern pages, the 8 written docs pages, the overview, and /ui-preview — now present inside the shared playground chrome: example rail, stage, and a segmented Preview/Code view with an animated indicator, plus the mobile frame variant at 375px. The frame's entrance, section reveals, and view swap are transform/opacity only on the kit's `--ease-out-strong` curve, gated behind `prefers-reduced-motion` and a fine-pointer query.
- **Table cells hold to one line.** TableHead and TableCell are whitespace-nowrap now, so a column sizes to its content instead of breaking a phrase mid-word at narrow widths. The data-table bulk-action count no longer splits, and its pagination arrows default to icon-only. Long free text is yours to wrap.
- **Smoother docs navigation.** The docs app now crossfades path changes with the native View Transitions API (150ms, tuned in base CSS), falls back to the keyed entrance fade elsewhere, shows the top progress bar while routes load, and preloads lazy route chunks on hover intent.

### Fixed

- **Reduced-motion route navigation.** The docs router checks the current motion preference before starting its native crossfade. The outlet supplies the CSS fade when native transition types are unavailable.
- **Kira Default contrast and homepage theme.** Corrected status and sidebar colors in light and dark mode, added a registry build contrast check for Kira Default, and removed repeated corrections for curated presets. The homepage hero follows the selected mode and footer labels align with the GitHub link.
- **`KiraAccordion` draggable reorder.** Moved the sortable drag handle out of `AccordionPrimitive.Trigger` into a sibling `<button type="button">` inside `AccordionPrimitive.Header` so pointer and keyboard drag events are no longer swallowed by the trigger button, rendered `DragOverlay` as a standalone trigger shell instead of an unmounted `AccordionItem`, and removed the duplicate `onReorder` invocation inside `useAccordionDrag`.
- **HoverCard viewport children wrapping and RouteError nested button.** Fixed `HoverCardContent` so `PreviewCardPrimitive.Viewport` wraps `props.children` when `viewport={true}` instead of rendering empty as a sibling, and replaced the nested `<DialogTrigger><Button>` in `RouteError` with `<DialogTrigger render={<Button />} />`.
- **Consistent npm dependency installation via `ensureNpmDeps`.** `init`, `icons`, `apply-fonts`, and `migrate` now route package installs through one `ensureNpmDeps` helper in `core/install/deps.ts`, preserving pinned version ranges (including `lucide-react`) and checking `devDependencies` and `peerDependencies` alongside `dependencies`.
- **Unified theme and typography resolution across `kira-kit init` and `kira-kit theme`.** Flag precedence, `--base-color` validation, standalone token CSS-var assembly, and custom primary theme generation now run through one `core/theme/apply.ts` module: invalid `--base-color` values now fail fast with a `ValidationError` in both commands, defaults stay on `geist` and `geist-mono`, and `kira-kit theme --font-mono ... --apply` preserves an existing `fontDisplay` from `components.json`.
- **`kira-kit migrate` respects `-c <dir>` and rewrites legacy `aliases.lib`.** `migrate` previously resolved source rewrites against `process.cwd()` instead of `--cwd`, double-counted files importing both `clsx` and `tailwind-merge`, and announced `aliases.lib` changes in `--dry-run` without applying them (while falsely flagging the standard `"@/lib"` alias). Both `migrate` and `create` now sit behind deep core engine modules (`core/migrate/engine.ts`, `core/create/engine.ts`) with injectable `DepInstaller`/`gitInit` seams and integration tests.
- **Consumer `kira-utilities.css` no longer ships docs-site CSS.** The 134 lines of `.docs-*` rules moved to a docs-only `src/styles/docs.css` imported solely by the docs app, so `kira-kit init` and `kira-kit create` templates ship clean consumer utilities. The CLI's CSS parsing, rule/var merging, and template syncing are unified in `core/css/stylesheet.ts` and `core/css/assets-sync.ts`, and `kira-kit build` now keeps embedded CLI assets and all four starter templates synced automatically.
- **`llms.txt` resolves to the deployed site dynamically.** The Introduction page's "Read llms.txt" button now links to `/llms.txt` instead of the hardcoded `kira-kit.vercel.app` host (which served stale pre-migration output), and the docs generator emits root-relative `/docs/<name>.md` links by default or reads platform origin env vars (`SITE_URL`, `COOLIFY_URL`, `COOLIFY_FQDN`, `VERCEL_PROJECT_PRODUCTION_URL`, `VERCEL_URL`, `CF_PAGES_URL`). Docker/nginx (`sub_filter`) and Vite dev/preview middleware qualify `/docs/` links to the live request origin automatically.
- **Every menu destination opens with the same header.** The sticky page bar lived inside the docs frame only, so guide pages had one and component pages had a different one built by `ComponentPage`; both now render a single `PageTopBar` from the shared site chrome, with the section crumb derived from the route instead of restated per page. The docs side rails and the anchor scroll margins moved by the bar's 56px to match.
- **`kira-kit check --help` describes the flag it implements.** The text promised `(auto when CI is set)`, which was never implemented and is not wanted — strict mode is opt-in, so an environment cannot turn warnings into failures nobody asked for. It now says what `--ci` does.
- **Focus indicators clear WCAG 1.4.11.** The kit's focus ring was drawn at half strength — `ring-ring/50` / `outline-ring/50` — which measured 1.63:1 to 2.82:1 against the page on every preset, so a keyboard user on a light theme got an indicator below the 3:1 minimum for a state boundary. All 68 usages across 31 components, the docs app, and the CLI's init templates now draw the ring at full strength, and the base layer's `* { outline-ring/50 }` default became `outline-ring`. Kira Default's light `--ring` and `--sidebar-ring` darkened from L 0.70 to L 0.63, giving 3.72:1 on the page and 3.20:1 on muted; the nine presets already cleared 3:1 once the alpha was gone and are untouched. The ring is visibly bolder than before — that is the fix, not a regression.
- **Kira Default's primary button label is readable.** `--primary-foreground` was the same near-white in both modes, which is correct for the dark-red light-mode primary but only 3.17:1 on the dark mode primary, a light pink. Dark mode now uses `oklch(0.16 0.05 354)` — the same convention the other nine presets follow — for 5.65:1, and the light primary moved from L 0.59 to L 0.57 so its white label reaches 4.60:1 instead of 4.23:1. Every primary Button, Badge, Switch, Toggle, and checkbox in the default theme picks this up.
- **The whole repository lints clean under strict oxlint.** 485 errors are gone without relaxing a rule: section dividers and name-echo comments were deleted, why-comments over the four-line cap were cut to the constraint they protect, and doc-sample strings that looked like template literals now carry reasoned suppressions. The strict @kiranaide/oxlint-kit presets are the installed config. Source changes are real but narrow: promise executors no longer resolve with the timer id, the carousel's child-index cursor avoids a React Compiler immutability violation, and two test helpers stopped reading the wall clock.
- **DatePicker stops logging every selection.** A debug console.log left in the select handler during the mobile sheet work fired on every pick, production builds included.
- **Every component animation ships with its registry item.** The registry build now derives per-item motion CSS from the animations each component actually uses — tokens, keyframes, var() closures, and a slot-scoped reduced-motion gate — and kira-kit add merges it into your global stylesheet even when init kept an existing theme. Calendar month-transition keyframes ship with the calendar item; re-adding is idempotent.
- **DatePicker and TimePicker mobile bottom sheets.** Sheet content centers in the full-width sheet, the preset rail hides its native scrollbar and gives presets 44px touch targets, and the sheet slides up from the bottom edge on an iOS-style curve with a faster exit and contained overscroll. Demo previews no longer reserve desktop popover height on mobile.
- **Code blocks follow the mono font token.** A --font-mono token and @fontsource-variable/geist-mono import ship with the base CSS; CodeBlock's default fontFamily is now var(--font-mono, ui-monospace, monospace) instead of a hardcoded family that was never installed.
- **Theming picker reflects the applied preset.** The theming page's preset grid, live preview, and Applied state now initialize from the site-wide preset and follow the sidebar switcher, instead of always highlighting a hardcoded preset that contradicted the active theme.

### Removed

- **Unreferenced orphan hooks/libs and unused `sonner` dependency.** Deleted five unreferenced modules (`use-spotlight`, `use-async-data-table`, `use-focus-manager`, `lib/live-region`, `lib/camera/variants`) along with their stale registry payloads, and removed unused `sonner` from `package.json`.
- **Redundant helpers from `@kira-kit/component-utils` and `.kira-anchored-popover` CSS.** Removed 9 exports from `src/lib/component-utils.ts` (`StateClassName`, `StateStyle`, `mergeClassName`, `mergeStyle`, `mergeComponentRefs`, `NativePopoverOptions`, `showNativePopover`, `hideNativePopover`, `useNativePopover`), dropped its `cn` dependency, replaced `mergeComponentRefs` with React 19 cleanup-preserving ref callbacks in `code-block` and `color-picker`, and removed `.kira-anchored-popover` from `src/index.css` and all four CLI templates.
- **Unreferenced starter scaffolding and `src/lib/utils.ts` pass-through.** Deleted dead starter files (`src/App.tsx`, `src/components/component-example.tsx`, `src/components/example.tsx`) and the 1-line `src/lib/utils.ts` pass-through.
- **Invisible ellipsis placeholders in pagination.** The desktop range stopped padding the slots where an ellipsis would appear, so the footer is as wide as the pages it shows and edge pages carry no dead space beside the buttons.
- **Orphan scan-overlay-pulse-glow keyframes.** Unused keyframes dropped from the base stylesheet and CLI templates; the camera scan overlay keeps scan-overlay-corner-pulse.
- **Legacy public/r/index.json.** The stale legacy index is pruned; registry.json is the single registry index.

## 0.4.0 — November 19, 2026

### Added

- **Spacing contract enforcement.** A 4px-based contract now governs control heights, gaps, padding, and radii. The CLI's spacing-scale check flags half-steps on heights, widths, gaps, and horizontal padding; optical exceptions are documented suppressions.
- **/ui-preview kitchen sink.** A single page rendering the contract's control ladder, gap tiers, and container metrics side by side.
- **Documentation pages.** New docs for introduction, installation, theming, CLI, typeset, form, and this changelog (PR #5).
- **Site-wide theme preset picker.** A theme preset picker with dark/light control across the docs site, backed by shared theme presets (PR #8).

### Changed

- **Control ladder alignment across the kit.** Button gains xl and icon-xl sizes; Input, Select, Textarea, Card, Field, and dropdown menus adopt the unified height ladder and menu-item metrics.

### Fixed

- **Sidebar FLIP context crash.** FLIP context access is deferred until mount, fixing a crash in the sidebar demo (PR #2).
- **Combobox select layout and affordance icon sizes.** One combobox select layout regression and contract affordance icon sizes corrected.
- **Build and deploy refinements.** Subtle theme borders, configurable deploy port, and faster builds (PR #6); deployment publishes no host port so Coolify proxy routing works (PR #7).

## 0.3.0 — November 18, 2026

### Fixed

- **Input focus ring offsets.** Focus rings sit flush with control borders instead of offsetting outside them (PR #1).

## 0.2.1 — November 17, 2026

### Added

- **CI and deployment.** GitHub Actions check workflow, Docker/nginx deployment, and Vercel configuration.
- **Per-group component upgrade notes.** AGENTS/README refreshed; docs/*-upgrade.md notes record what changed per component group.

### Changed

- **CLI commands, checks, themes, and templates refined.** Follow-up polish across the rewritten CLI surface after the 0.2.0 rewrite.

## 0.2.0 — November 17, 2026

### Breaking

- **Package renamed: @kira-kit/cli → kira-kit.** The CLI is now published as kira-kit with a kira-kit bin. Node 22+ required.

### Added

- **CLI rewrite on a pinned registry core.** build/check/add/init delegate to a pinned registry CLI; new create, migrate, search, theme, and view commands; four embedded project templates; vitest coverage.
- **OKLCH theme engine and nine presets.** Generate a full light/dark palette from any primary color, verified against WCAG 2.2 AA and APCA at build time.
- **Agent-readable registry docs.** llms.txt and per-item markdown generated under /docs/ with every build.

### Changed

- **Registry sync: 92 items in registries-map format.** Components and hooks re-manifested for the registries map format; Kira* mega-components (KiraSidebar, KiraTable, KiraToaster, KiraStepper, and more) land across the catalog.

### Removed

- **Legacy build script.** scripts/build-registry.ts retired in favor of kira-kit build; mediapipe UMD shim dropped after the tensorflow removal.

## Tooling — October 19, 2026

### Changed

- **ESLint migrated to oxlint.** Lint stack moved to oxlint with shared presets; registry build scripts updated alongside.

## 0.1.0 — January 22, 2026

### Added

- **First CLI (@kira-kit/cli).** Initial command-line tooling for building the component registry, with early tests and frontend optimizations.

## Foundation — December 2025

### Added

- **Component suite and docs app.** First commit December 15; the comprehensive component suite, documentation pages, app layout, and routing landed through late December on Base UI, Tailwind CSS v4, and TypeScript.
