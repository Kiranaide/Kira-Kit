import { useEffect, useState } from "react";
import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import {
  IconArrowUpRight,
  IconBook,
  IconChevronDown,
} from "@tabler/icons-react";
import { cn } from "cn";
import {
  DocPage,
  DocSection,
  scrollToSection,
  type TocEntry,
} from "@/components/docs/doc-page";

type ChangeType =
  "added" | "changed" | "fixed" | "deprecated" | "removed" | "breaking";

interface Change {
  type: ChangeType;
  title: string;
  description?: string;
}

interface Release {
  version: string;
  date: string;
  changes: Change[];
}

const COMMIT_HISTORY_URL =
  "https://github.com/Kiranaide/kira-kit-v2/commits/development";

const RELEASES: readonly Release[] = [
  {
    version: "Unreleased",
    date: "In development",
    changes: [
      {
        type: "added",
        title: "TanStack Form integration example",
        description:
          "The Field page adds a runnable example with copyable source for email validation, submission, and reset using KiraField.",
      },
      {
        type: "fixed",
        title: "KiraAccordion draggable reorder",
        description:
          "Moved the sortable drag handle out of AccordionPrimitive.Trigger into a sibling button inside AccordionPrimitive.Header so pointer and keyboard drag events are no longer swallowed by the trigger, rendered DragOverlay as a standalone trigger shell instead of an unmounted AccordionItem, and removed the duplicate onReorder call inside useAccordionDrag.",
      },
      {
        type: "breaking",
        title: "Input, Badge, Layout, and Sidebar architectural realignments",
        description:
          "Extracted otp-input, rating, and theme-provider into standalone registry items; removed InputWithLabel, InputWithButton, InputWithTooltip, InputWithDropdown, InputCluster, OTPInput, Rating, and RatingDisplay from input.tsx (breaking the input ↔ field cycle; 10 → 1 transitive dep); removed duplicate TagInput from badge.tsx and IconButtonWithTooltip from button.tsx; stripped loading/error/onRetry (Skeleton + Button) from KiraContainer, KiraGrid, KiraStack, and KiraSpacer so layout primitives remain pure leaves; and renamed badgeVariants → sidebarBadgeVariants in sidebar.tsx.",
      },
      {
        type: "changed",
        title:
          "Shared optimistic commit seam, CSS micro-motion, unified layout responsive engine, router-agnostic Sidebar, and header Preset Studio popover",
        description:
          "Added use-optimistic-commit (OptimisticFeedbackProvider + useOptimisticCommit) and Tailwind --animate-* CSS motion across button, checkbox, switch, toggle, and toggle-group (removing direct toast and GSAP micro-motion deps); unified responsive resolution in lib/layout-responsive.ts and upgraded Box and Flex onto Base UI useRender + mergeProps; added SidebarRouterProvider so Sidebar works without @tanstack/react-router; aligned command, announcement-bar, field, date-picker, and time-picker onto kit seams; dropped zod from stepper; extracted use-visibility-pause and lib/layout-storage; organized site chrome under src/components/site/ with a top-bar Preset Studio popover and appearance toggle; and adopted prefersReducedMotion() in doc pages.",
      },
      {
        type: "added",
        title:
          "Whole-graph registry cycle detection in CLI and ThemeProvider / Sidebar / Toast setup guides",
        description:
          "Added packages/cli/src/core/checks/registry-graph.ts (wired into kira-kit check and kira-kit build with unit tests) to catch circular registry dependencies before build, plus segmented setup guides for ThemeProvider, Sidebar router adapters, and Toast across Installation and component docs.",
      },
      {
        type: "fixed",
        title:
          "HoverCard viewport children wrapping and RouteError nested button",
        description:
          "Fixed HoverCardContent so PreviewCardPrimitive.Viewport wraps props.children when viewport={true} instead of rendering empty as a sibling, and replaced the nested <DialogTrigger><Button> in RouteError with <DialogTrigger render={<Button />} />.",
      },
      {
        type: "removed",
        title: "Unreferenced orphan hooks/libs and unused sonner dependency",
        description:
          "Deleted five unreferenced modules (use-spotlight, use-async-data-table, use-focus-manager, lib/live-region, lib/camera/variants) with their stale registry payloads, and removed unused sonner from package.json.",
      },
      {
        type: "changed",
        title:
          "DatePicker and TimePicker migrated onto Base UI Popover; overlay wrappers narrowed to static className/style",
        description:
          "DatePicker and TimePicker now use @base-ui/react/popover instead of native [popover='auto'] and CSS Anchor Positioning. Eleven Base UI overlay and menu wrappers (alert-dialog, command, context-menu, dialog, drawer, dropdown-menu, menubar, navigation-menu, popover, radio-group, tooltip) now accept static className/style props and style states through Base UI's native data-* attributes and cn(...), removing @kira-kit/component-utils from dialog, drawer, menubar, popover, and time-picker.",
      },
      {
        type: "removed",
        title:
          "Redundant helpers from @kira-kit/component-utils and .kira-anchored-popover CSS",
        description:
          "Removed 9 exports from src/lib/component-utils.ts (StateClassName, StateStyle, mergeClassName, mergeStyle, mergeComponentRefs, NativePopoverOptions, showNativePopover, hideNativePopover, useNativePopover), dropped its cn dependency, replaced mergeComponentRefs with React 19 cleanup-preserving ref callbacks in code-block and color-picker, and removed .kira-anchored-popover from src/index.css and all four CLI templates.",
      },
      {
        type: "changed",
        title:
          "Shared native anchored-popover and Base UI state-prop helpers in @kira-kit/component-utils",
        description:
          "Consolidated mergeClassName, mergeStyle, and useNativePopover into src/lib/component-utils.ts across all overlay components and pickers, unified .date-picker-popover and .time-picker-popover into .kira-anchored-popover in base CSS and all four CLI templates, and removed the duplicate --animate-toast-progress block and discarded useMediaQuery subscription in TimePicker.",
      },
      {
        type: "changed",
        title:
          "Memoized check AST extraction, kira-kit check -c <dir>, and centralized ClientContext",
        description:
          "checks/runner.ts now parses TypeScript imports once per file across imports-deps, base-ui-only, cn-source, and lib-resolution; cn-source uses AST lib imports instead of a regex fallback; dead-animate replaces its shared stateful /g RegExp with matchAll; kira-kit check accepts -c, --cwd; ComponentsConfig is inferred directly from componentsConfigSchema; and createClientContext() centralizes registry context creation across list, view, search, add, and engine with new command-level tests.",
      },
      {
        type: "fixed",
        title: "Consistent npm dependency installation via ensureNpmDeps",
        description:
          "init, icons, apply-fonts, and migrate now route package installs through one ensureNpmDeps helper in core/install/deps.ts, preserving pinned version ranges (including lucide-react) and checking devDependencies and peerDependencies alongside dependencies.",
      },
      {
        type: "removed",
        title:
          "Unreferenced starter scaffolding and src/lib/utils.ts pass-through",
        description:
          "Deleted dead starter files (src/App.tsx, src/components/component-example.tsx, src/components/example.tsx) and the 1-line src/lib/utils.ts pass-through.",
      },
      {
        type: "changed",
        title:
          "Unified docs article shell with mobile section navigation on all docs pages",
        description:
          "Folded MobileJumpToSection, accessible anchor focusing (hash update + focus on target section), optional section metadata, and explicit section lists into DocPage, migrating Typeset, Form, and Changelog off the duplicate DocGuidePage shell and deleting doc-guide.tsx.",
      },
      {
        type: "changed",
        title:
          "Unified registry discovery and kit CSS loading across check and build",
        description:
          "checks/runner.ts now loads registry metadata and combined kit CSS (index.css + kira-utilities.css) through core/registry/loader.ts instead of hardcoding four registry paths, and dead-animate.ts shares ANIMATE_BUILTINS with motion-css.ts.",
      },
      {
        type: "changed",
        title: "Unified CLI runtime setup and AST patching",
        description:
          "Extracted the five duplicated TypeScript/JSONC AST splice helpers from tsconfig.ts and configure-runtime.ts into core/init/ast-patch.ts, shared POSTCSS_CONFIGS from detect-runtime.ts, and collapsed init's multi-step runtime and tsconfig setup behind one setupProjectRuntime(cwd) interface.",
      },
      {
        type: "changed",
        title:
          "Unified component boundary plumbing into @kira-kit/component-utils",
        description:
          "Merged the five tiny src/lib/component-*.ts modules and the two duplicated src/components/ui/{prop-guards,content-keys}.ts files into one @kira-kit/component-utils registry item, standardizing on isFunctionProp and withOccurrenceKeys across all UI components and pruning the five legacy public/r/component-*.json payloads.",
      },
      {
        type: "changed",
        title: "Single source of truth for the theme and font studio catalog",
        description:
          "kira-kit build now emits src/themes/catalog.json directly from the CLI's WCAG-verified base colors, radius/surface presets, fonts, font pairings, and recipe defaults. The docs app consolidates presets-catalog.ts, fonts.ts, font-preview.ts, and its duplicated token cascade into one src/lib/theme-studio.ts module, removing ~600 lines of hand-mirrored definitions.",
      },
      {
        type: "fixed",
        title: "Reduced-motion route navigation",
        description:
          "The router checks the current motion preference before starting a native crossfade. The outlet supplies the CSS fade when native transition types are unavailable.",
      },
      {
        type: "fixed",
        title: "Kira Default contrast and homepage theme",
        description:
          "Corrected light and dark status and sidebar colors, added a registry build contrast check for Kira Default, and removed repeated corrections for curated presets. The homepage hero follows the selected mode and footer links align.",
      },
      {
        type: "fixed",
        title: "Unified theme and typography resolution across init and theme",
        description:
          "Flag precedence, --base-color validation, standalone token assembly, and custom primary generation now share one core/theme/apply.ts module: invalid --base-color values fail fast with a ValidationError in both commands, defaults remain geist and geist-mono, and kira-kit theme --font-mono preserves an existing fontDisplay from components.json.",
      },
      {
        type: "fixed",
        title:
          "kira-kit migrate respects -c <dir> and rewrites legacy aliases.lib",
        description:
          "migrate previously resolved source rewrites against process.cwd() instead of --cwd, double-counted files importing both clsx and tailwind-merge, and announced aliases.lib changes in --dry-run without applying them (while falsely flagging the standard @/lib alias). Both migrate and create now sit behind deep core engine modules with injectable installer/git seams and integration tests.",
      },
      {
        type: "fixed",
        title: "Consumer kira-utilities.css no longer ships docs-site CSS",
        description:
          "The 134 lines of .docs-* rules moved to a docs-only src/styles/docs.css imported solely by the docs app, so kira-kit init and kira-kit create templates ship clean consumer utilities. CLI CSS parsing, variable/rule merging, and template syncing are unified in core/css/, and kira-kit build keeps embedded assets and all four templates in sync automatically.",
      },
      {
        type: "changed",
        title: "Redesigned Typeset, Form, and Changelog pages",
        description:
          "All three pages now have mobile section navigation. Typeset shows font specimens and a visual type scale, Form demonstrates validation and recovery in a live workspace form, and Changelog groups older releases into expandable rows.",
      },
      {
        type: "changed",
        title: "Redesigned UI Preview and Overview pages",
        description:
          "/ui-preview now runs in DocPage with an interactive component playground (Button, Input, Select, Dialog with Preview/Code tabs), a 5-tier control size table, size-selectable input combinations, Demo/Worst-case input actions, menu and overlay comparisons, container and form spacing cards, side-by-side light/dark preset previews, and a mobile section-jump selector. /overview adopts DocPage with a copyable init command pill, key metrics strip, Start Here path cards, architecture pillars, a linked 6-category component catalog, and a Quickstart CLI terminal card.",
      },
      {
        type: "added",
        title:
          "kira-kit init detects your runtime and wires up Tailwind CSS v4",
        description:
          "init now reads your project (Vite, Vite + Nitro v3, TanStack Start, Next.js with Turbopack, standalone Nitro, Astro, Bun, or plain PostCSS) and installs and configures Tailwind CSS v4 for it: @tailwindcss/vite in the Vite config, @tailwindcss/postcss with a postcss.config.mjs for Next.js, Nitro and PostCSS projects, and bun-plugin-tailwind in bunfig.toml. It also adds the @/* TypeScript path (no deprecated baseUrl, JSONC comments preserved, split tsconfig.app.json handled) and, on Vite, enables native resolve.tsconfigPaths on Vite 8 or a resolve.alias on older versions. Every edit is idempotent and skips configs you already set up.",
      },
      {
        type: "fixed",
        title: "llms.txt resolves to the deployed site dynamically",
        description:
          'The Introduction page\'s "Read llms.txt" button now links to /llms.txt instead of the hardcoded kira-kit.vercel.app host, and the docs generator emits root-relative /docs/<name>.md links by default or reads platform origin env vars (SITE_URL, COOLIFY_URL, COOLIFY_FQDN, VERCEL_PROJECT_PRODUCTION_URL, VERCEL_URL, CF_PAGES_URL). Docker/nginx and Vite dev/preview middleware qualify /docs/ links to the live request origin automatically.',
      },
      {
        type: "fixed",
        title: "The whole repository lints clean under strict oxlint",
        description:
          "485 errors are gone without relaxing a rule: section dividers and name-echo comments were deleted, why-comments over the four-line cap were cut to the constraint they protect, and doc-sample strings that looked like template literals now carry reasoned suppressions. The strict @kiranaide/oxlint-kit presets are the installed config. Source changes are real but narrow: promise executors no longer resolve with the timer id, the carousel's child-index cursor avoids a React Compiler immutability violation, and two test helpers stopped reading the wall clock.",
      },
      {
        type: "changed",
        title: "Table cells hold to one line",
        description:
          "TableHead and TableCell are whitespace-nowrap now, so a column sizes to its content instead of breaking a phrase mid-word at narrow widths. The data-table bulk-action count no longer splits, and its pagination arrows default to icon-only. Long free text is yours to wrap.",
      },
      {
        type: "removed",
        title: "Invisible ellipsis placeholders in pagination",
        description:
          "The desktop range stopped padding the slots where an ellipsis would appear, so the footer is as wide as the pages it shows and edge pages carry no dead space beside the buttons.",
      },
      {
        type: "fixed",
        title: "DatePicker stops logging every selection",
        description:
          "A debug console.log left in the select handler during the mobile sheet work fired on every pick, production builds included.",
      },
      {
        type: "added",
        title: "Changelog coverage on every component page",
        description:
          "Flex gained the Changelog section it was missing, so each of the 73 pages that documents an installable component now records its own version history alongside this page. The six pattern pages (color-usage, image, layout-utilities, modal, typography, video-player) teach with existing primitives and have nothing of their own to version.",
      },
      {
        type: "fixed",
        title: "Every component animation ships with its registry item",
        description:
          "The registry build now derives per-item motion CSS from the animations each component actually uses — tokens, keyframes, var() closures, and a slot-scoped reduced-motion gate — and kira-kit add merges it into your global stylesheet even when init kept an existing theme. Calendar month-transition keyframes ship with the calendar item; re-adding is idempotent.",
      },
      {
        type: "fixed",
        title: "DatePicker and TimePicker mobile bottom sheets",
        description:
          "Sheet content centers in the full-width sheet, the preset rail hides its native scrollbar and gives presets 44px touch targets, and the sheet slides up from the bottom edge on an iOS-style curve with a faster exit and contained overscroll. Demo previews no longer reserve desktop popover height on mobile.",
      },
      {
        type: "removed",
        title: "Orphan scan-overlay-pulse-glow keyframes",
        description:
          "Unused keyframes dropped from the base stylesheet and CLI templates; the camera scan overlay keeps scan-overlay-corner-pulse.",
      },
      {
        type: "breaking",
        title: "Native install engine — no external CLI",
        description:
          "init, add, build, list, view, search, theme, and migrate now run on a self-contained registry client. init installs the kit's own base CSS and default theme with no base-theme picker; add --all installs components, hooks, and lib modules (themes and styles are excluded). React 19.2+ is required and enforced by init.",
      },
      {
        type: "added",
        title: "Route transition utilities",
        description:
          "New RouteTransition (keyed entrance with fade, fade-up, fade-down, slide-left, slide-right, zoom, and none variants — movement variants ride a gentle spring curve with ~7% overshoot at 250ms) and NavigationProgress (glowing 2px top bar with grace delay, CSS trickle, and interruptible completion) components, plus a reduced-motion-aware startViewTransition lib helper. All motion is composite-only, with a variant gallery at /components/route-transition and a choosing-a-variant guide at /docs/transitions.",
      },
      {
        type: "added",
        title: "Per-item CSS injection in the CLI",
        description:
          "Registry items can now carry a css snippet: kira-kit add route-transition merges the spring token, entrance keyframes, and view-transition tuning straight into your global stylesheet. The merge is idempotent — tokens upsert, keyframes replace, and @media blocks merge without clobbering existing rules. The TanStack Start template ships pre-wired with route transitions.",
      },
      {
        type: "changed",
        title: "Smoother docs navigation",
        description:
          "The docs app now crossfades path changes with the native View Transitions API (150ms, tuned in base CSS), falls back to the keyed entrance fade elsewhere, shows the top progress bar while routes load, and preloads lazy route chunks on hover intent.",
      },
      {
        type: "added",
        title: "Lib support modules ship with components",
        description:
          "The src/lib support modules are now registry:lib items resolved transitively, so color-picker and every other component install complete. A new lib-resolution check prevents missing-module regressions.",
      },
      {
        type: "added",
        title: "Published JSON schemas",
        description:
          "registry, registry-item, and components schemas are emitted to /schema/*.json and referenced by built payloads and new configs.",
      },
      {
        type: "added",
        title: "Font options for sans and mono",
        description:
          "init and theme accept --font (geist, inter, manrope, plus-jakarta-sans, space-grotesk, dm-sans) and --font-mono (geist-mono, jetbrains-mono, fira-code). Fonts apply to existing projects without --force — only the @fontsource imports and font tokens change, never colors. The theming page previews every pairing live, and the preview persists across pages and reloads.",
      },
      {
        type: "added",
        title: "Icon library switch: Tabler or Lucide",
        description:
          '--icon lucide rewrites icon imports at install time, keeping local names aliased so usages keep their names. Filled Tabler icons get fill="currentColor" injected and Tabler stroke-width props become strokeWidth; a few names map to approximate Lucide equivalents. Switch an existing project with kira-kit theme --icon lucide --apply, then kira-kit add --all --overwrite.',
      },
      {
        type: "removed",
        title: "Legacy public/r/index.json",
        description:
          "The stale legacy index is pruned; registry.json is the single registry index.",
      },
      {
        type: "fixed",
        title: "Code blocks follow the mono font token",
        description:
          "A --font-mono token and @fontsource-variable/geist-mono import ship with the base CSS; CodeBlock's default fontFamily is now var(--font-mono, ui-monospace, monospace) instead of a hardcoded family that was never installed.",
      },
      {
        type: "fixed",
        title: "Theming picker reflects the applied preset",
        description:
          "The theming page's preset grid, live preview, and Applied state now initialize from the site-wide preset and follow the sidebar switcher, instead of always highlighting a hardcoded preset that contradicted the active theme.",
      },
    ],
  },
  {
    version: "0.4.0",
    date: "November 19, 2026",
    changes: [
      {
        type: "added",
        title: "Spacing contract enforcement",
        description:
          "A 4px-based contract now governs control heights, gaps, padding, and radii. The CLI's spacing-scale check flags half-steps on heights, widths, gaps, and horizontal padding; optical exceptions are documented suppressions.",
      },
      {
        type: "added",
        title: "/ui-preview kitchen sink",
        description:
          "A single page rendering the contract's control ladder, gap tiers, and container metrics side by side.",
      },
      {
        type: "added",
        title: "Documentation pages",
        description:
          "New docs for introduction, installation, theming, CLI, typeset, form, and this changelog (PR #5).",
      },
      {
        type: "added",
        title: "Site-wide theme preset picker",
        description:
          "A theme preset picker with dark/light control across the docs site, backed by shared theme presets (PR #8).",
      },
      {
        type: "changed",
        title: "Control ladder alignment across the kit",
        description:
          "Button gains xl and icon-xl sizes; Input, Select, Textarea, Card, Field, and dropdown menus adopt the unified height ladder and menu-item metrics.",
      },
      {
        type: "fixed",
        title: "Sidebar FLIP context crash",
        description:
          "FLIP context access is deferred until mount, fixing a crash in the sidebar demo (PR #2).",
      },
      {
        type: "fixed",
        title: "Combobox select layout and affordance icon sizes",
        description:
          "One combobox select layout regression and contract affordance icon sizes corrected.",
      },
      {
        type: "fixed",
        title: "Build and deploy refinements",
        description:
          "Subtle theme borders, configurable deploy port, and faster builds (PR #6); deployment publishes no host port so Coolify proxy routing works (PR #7).",
      },
    ],
  },
  {
    version: "0.3.0",
    date: "November 18, 2026",
    changes: [
      {
        type: "fixed",
        title: "Input focus ring offsets",
        description:
          "Focus rings sit flush with control borders instead of offsetting outside them (PR #1).",
      },
    ],
  },
  {
    version: "0.2.1",
    date: "November 17, 2026",
    changes: [
      {
        type: "changed",
        title: "CLI commands, checks, themes, and templates refined",
        description:
          "Follow-up polish across the rewritten CLI surface after the 0.2.0 rewrite.",
      },
      {
        type: "added",
        title: "CI and deployment",
        description:
          "GitHub Actions check workflow, Docker/nginx deployment, and Vercel configuration.",
      },
      {
        type: "added",
        title: "Per-group component upgrade notes",
        description:
          "AGENTS/README refreshed; docs/*-upgrade.md notes record what changed per component group.",
      },
    ],
  },
  {
    version: "0.2.0",
    date: "November 17, 2026",
    changes: [
      {
        type: "breaking",
        title: "Package renamed: @kira-kit/cli → kira-kit",
        description:
          "The CLI is now published as kira-kit with a kira-kit bin. Node 22+ required.",
      },
      {
        type: "added",
        title: "CLI rewrite on a pinned registry core",
        description:
          "build/check/add/init delegate to a pinned registry CLI; new create, migrate, search, theme, and view commands; four embedded project templates; vitest coverage.",
      },
      {
        type: "added",
        title: "OKLCH theme engine and nine presets",
        description:
          "Generate a full light/dark palette from any primary color, verified against WCAG 2.2 AA and APCA at build time.",
      },
      {
        type: "added",
        title: "Agent-readable registry docs",
        description:
          "llms.txt and per-item markdown generated under /docs/ with every build.",
      },
      {
        type: "changed",
        title: "Registry sync: 92 items in registries-map format",
        description:
          "Components and hooks re-manifested for the registries map format; Kira* mega-components (KiraSidebar, KiraTable, KiraToaster, KiraStepper, and more) land across the catalog.",
      },
      {
        type: "removed",
        title: "Legacy build script",
        description:
          "scripts/build-registry.ts retired in favor of kira-kit build; mediapipe UMD shim dropped after the tensorflow removal.",
      },
    ],
  },
  {
    version: "Tooling",
    date: "October 19, 2026",
    changes: [
      {
        type: "changed",
        title: "ESLint migrated to oxlint",
        description:
          "Lint stack moved to oxlint with shared presets; registry build scripts updated alongside.",
      },
    ],
  },
  {
    version: "0.1.0",
    date: "January 22, 2026",
    changes: [
      {
        type: "added",
        title: "First CLI (@kira-kit/cli)",
        description:
          "Initial command-line tooling for building the component registry, with early tests and frontend optimizations.",
      },
    ],
  },
  {
    version: "Foundation",
    date: "December 2025",
    changes: [
      {
        type: "added",
        title: "Component suite and docs app",
        description:
          "First commit December 15; the comprehensive component suite, documentation pages, app layout, and routing landed through late December on Base UI, Tailwind CSS v4, and TypeScript.",
      },
    ],
  },
];

const LATEST_RELEASES = RELEASES.slice(0, 2);
const EARLIER_RELEASES = RELEASES.slice(2);

const FILTER_TYPES: readonly { value: ChangeType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "breaking", label: "Breaking" },
  { value: "added", label: "Added" },
  { value: "changed", label: "Changed" },
  { value: "fixed", label: "Fixed" },
  { value: "removed", label: "Removed" },
];

const CHANGE_BADGE_STYLES: Record<
  ChangeType,
  { label: string; className: string }
> = {
  breaking: { label: "Breaking", className: "docs-chip-deprecated" },
  added: { label: "Added", className: "bg-primary/10 docs-accent" },
  changed: { label: "Changed", className: "docs-chip-fixed" },
  fixed: { label: "Fixed", className: "docs-chip-added" },
  deprecated: { label: "Deprecated", className: "docs-chip-deprecated" },
  removed: { label: "Removed", className: "bg-muted text-muted-foreground" },
};

const SECTIONS: readonly TocEntry[] = [
  { id: "releases", label: "Releases" },
  { id: "unreleased", label: "Unreleased" },
  { id: "0.4.0", label: "0.4.0" },
  { id: "earlier-releases", label: "Earlier releases" },
  { id: "how-we-version", label: "How we version" },
];

function releaseAnchorId(version: string) {
  return version.toLowerCase().replace(/\s+/g, "-");
}

function normalizeAnchor(hash: string) {
  return hash
    .replace(/^#/, "")
    .trim()
    .toLowerCase()
    .replace(/^v(?=\d)/, "")
    .replace(/-/g, ".");
}

function findMatchingRelease(hash: string) {
  const target = normalizeAnchor(hash);

  if (!target) return undefined;

  return RELEASES.find((release) => {
    const id = releaseAnchorId(release.version);

    return (
      id === target || id.replace(/\./g, "-") === target.replace(/\./g, "-")
    );
  });
}

function filterChanges(changes: readonly Change[], filter: ChangeType | "all") {
  return filter === "all"
    ? changes
    : changes.filter((change) => change.type === filter);
}

function ChangeRowList({ changes }: { changes: readonly Change[] }) {
  return (
    <ul className="flex flex-col divide-y divide-border border-t border-border">
      {changes.map((change) => {
        const badge = CHANGE_BADGE_STYLES[change.type];

        return (
          <li
            key={`${change.type}-${change.title}`}
            className="flex flex-col gap-1.5 py-3.5 sm:flex-row sm:items-start sm:gap-3"
          >
            <div className="flex shrink-0 sm:w-[100px]">
              <span
                className={cn(
                  "inline-flex h-[23px] items-center rounded-[4px] px-2 text-xs font-semibold leading-[1.42]",
                  badge.className,
                )}
              >
                {badge.label}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <h3 className="text-base font-semibold leading-[1.15] tracking-[-0.35px] text-foreground">
                {change.title}
              </h3>
              {change.description && (
                <p className="text-sm leading-[1.53] text-muted-foreground">
                  {change.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function FilterChipsSection({
  filter,
  onFilterChange,
  totalMatches,
}: {
  filter: ChangeType | "all";
  onFilterChange: (next: ChangeType | "all") => void;
  totalMatches: number;
}) {
  return (
    <DocSection id="releases" title="Releases">
      <fieldset className="flex flex-wrap gap-1.5 border-0 p-0 sm:gap-2">
        <legend className="sr-only">Filter releases by change type</legend>
        {FILTER_TYPES.map((option) => {
          const active = filter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={active ? undefined : () => onFilterChange(option.value)}
              className={cn(
                "docs-focus-ring inline-flex h-11 items-center rounded-[6px] border px-2.5 text-[13px] font-semibold leading-[1.42] transition-colors duration-150 sm:px-3.5",
                active
                  ? "border-primary bg-primary/10 docs-accent"
                  : "border-border bg-card text-foreground hover:bg-accent/50",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </fieldset>
      <p className="sr-only" aria-live="polite">
        Showing {totalMatches} matching{" "}
        {totalMatches === 1 ? "entry" : "entries"}.
      </p>
    </DocSection>
  );
}

function LatestReleaseSection({
  release,
  filter,
}: {
  release: Release;
  filter: ChangeType | "all";
}) {
  const changes = filterChanges(release.changes, filter);
  const id = releaseAnchorId(release.version);

  return (
    <DocSection id={id} title={release.version} meta={release.date}>
      {changes.length > 0 ? (
        <ChangeRowList changes={changes} />
      ) : (
        <p className="border-t border-border pt-3.5 text-sm leading-[1.53] text-muted-foreground">
          No {filter} entries in {release.version}.
        </p>
      )}
    </DocSection>
  );
}

function EarlierReleaseRow({
  release,
  changes,
  open,
  onOpenChange,
  filterActive,
}: {
  release: Release;
  changes: readonly Change[];
  open: boolean;
  onOpenChange: (next: boolean) => void;
  filterActive: boolean;
}) {
  const anchorId = releaseAnchorId(release.version);

  return (
    <CollapsiblePrimitive.Root
      id={anchorId}
      open={open}
      onOpenChange={onOpenChange}
      className="scroll-mt-20"
    >
      <CollapsiblePrimitive.Trigger className="docs-focus-ring flex min-h-11 w-full items-center gap-2.5 py-2.5 text-left transition-colors duration-150 hover:bg-muted/30">
        <span className="w-[87px] shrink-0 font-mono text-[13px] font-semibold leading-[1.42] docs-accent sm:w-[110px]">
          {release.version}
        </span>
        <span className="min-w-0 flex-1 text-[13px] leading-[1.53] text-muted-foreground">
          {release.date}
          {filterActive && (
            <span className="ml-2 font-mono text-xs text-foreground/75">
              ({changes.length})
            </span>
          )}
        </span>
        <IconChevronDown
          aria-hidden="true"
          className={cn(
            "size-[15px] shrink-0 text-muted-foreground transition-transform duration-150 motion-reduce:transition-none",
            open && "rotate-180",
          )}
        />
      </CollapsiblePrimitive.Trigger>

      <CollapsiblePrimitive.Panel className="overflow-hidden">
        <div className="pb-3">
          <ChangeRowList changes={changes} />
        </div>
      </CollapsiblePrimitive.Panel>
    </CollapsiblePrimitive.Root>
  );
}

function EarlierReleasesSection({
  filter,
  expandedVersions,
  onToggleVersion,
}: {
  filter: ChangeType | "all";
  expandedVersions: ReadonlySet<string>;
  onToggleVersion: (version: string, nextOpen: boolean) => void;
}) {
  const visibleReleases = EARLIER_RELEASES.flatMap((release) => {
    const changes = filterChanges(release.changes, filter);

    return changes.length > 0 ? [{ release, changes }] : [];
  });

  return (
    <DocSection id="earlier-releases" title="Earlier releases">
      {visibleReleases.length > 0 ? (
        <div className="flex flex-col divide-y divide-border border-t border-border">
          {visibleReleases.map(({ release, changes }) => (
            <EarlierReleaseRow
              key={release.version}
              release={release}
              changes={changes}
              open={expandedVersions.has(release.version)}
              onOpenChange={(next) => onToggleVersion(release.version, next)}
              filterActive={filter !== "all"}
            />
          ))}
        </div>
      ) : (
        <p className="border-t border-border pt-3.5 text-sm leading-[1.53] text-muted-foreground">
          No {filter} entries in earlier releases.
        </p>
      )}
    </DocSection>
  );
}

function HowWeVersionSection() {
  return (
    <DocSection
      id="how-we-version"
      title="How we version"
      description="The CLI uses Changesets. Installed components are source files you own. Check the component’s page for item-level history."
    >
      <a
        href={COMMIT_HISTORY_URL}
        target="_blank"
        rel="noreferrer"
        className="docs-focus-ring inline-flex min-h-11 w-fit items-center gap-1.5 rounded-[6px] text-sm font-semibold leading-[1.42] docs-accent underline-offset-4 hover:underline"
      >
        <span>Browse full commit history on GitHub</span>
        <IconArrowUpRight aria-hidden="true" className="size-[15px]" />
      </a>
    </DocSection>
  );
}

export default function ChangelogPage() {
  const [filter, setFilter] = useState<ChangeType | "all">("all");

  const [expandedVersions, setExpandedVersions] = useState<ReadonlySet<string>>(
    () => {
      if (typeof window === "undefined") return new Set();

      const matched = findMatchingRelease(window.location.hash);

      return matched ? new Set([matched.version]) : new Set();
    },
  );

  useEffect(() => {
    const syncHash = () => {
      const matched = findMatchingRelease(window.location.hash);

      if (!matched) return;

      const anchorId = releaseAnchorId(matched.version);

      setExpandedVersions((current) =>
        current.has(matched.version)
          ? current
          : new Set([...current, matched.version]),
      );

      window.requestAnimationFrame(() => scrollToSection(anchorId));
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);

    return () => window.removeEventListener("hashchange", syncHash);
  }, []);

  const totalMatches = RELEASES.reduce(
    (sum, release) => sum + filterChanges(release.changes, filter).length,
    0,
  );

  const handleToggleVersion = (version: string, nextOpen: boolean) => {
    setExpandedVersions((current) => {
      const next = new Set(current);

      if (nextOpen) next.add(version);
      else next.delete(version);

      return next;
    });
  };

  return (
    <DocPage
      title="Changelog"
      crumb="Changelog"
      description="Follow changes to the registry and CLI. Check breaking changes before updating local components."
      sections={SECTIONS}
      previous={{ to: "/docs/form", label: "Form" }}
      next={{
        to: "/docs/introduction",
        label: "Introduction",
        icon: IconBook,
      }}
    >
      <FilterChipsSection
        filter={filter}
        onFilterChange={(next) => {
          setFilter(next);
          setExpandedVersions(
            new Set(
              next === "all"
                ? []
                : EARLIER_RELEASES.map(({ version }) => version),
            ),
          );
        }}
        totalMatches={totalMatches}
      />

      {LATEST_RELEASES.map((release) => (
        <LatestReleaseSection
          key={release.version}
          release={release}
          filter={filter}
        />
      ))}

      <EarlierReleasesSection
        filter={filter}
        expandedVersions={expandedVersions}
        onToggleVersion={handleToggleVersion}
      />

      <HowWeVersionSection />
    </DocPage>
  );
}
