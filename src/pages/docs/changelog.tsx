import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { IconArrowRight } from "@tabler/icons-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ComponentPage,
  PageHeader,
  Section,
  ChangelogEntry,
} from "@/components/docs";

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

const releases: Release[] = [
  {
    version: "Unreleased",
    date: "In development",
    changes: [
      {
        type: "changed",
        title: "Redesigned UI Preview and Overview pages",
        description:
          "/ui-preview now runs in DocPage with an interactive component playground (Button, Input, Select, Dialog with Preview/Code tabs), a 5-tier control size table, size-selectable input combinations, Demo/Worst-case input actions, menu and overlay comparisons, container and form spacing cards, side-by-side light/dark preset previews, and a mobile section-jump selector. /overview adopts DocPage with a copyable init command pill, key metrics strip, Start Here path cards, architecture pillars, a linked 6-category component catalog, and a Quickstart CLI terminal card.",
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

const filterTypes: { value: ChangeType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "added", label: "Added" },
  { value: "changed", label: "Changed" },
  { value: "fixed", label: "Fixed" },
  { value: "breaking", label: "Breaking" },
  { value: "removed", label: "Removed" },
];

function ReleasesSection({
  filter,
  setFilter,
}: {
  filter: ChangeType | "all";
  setFilter: (value: ChangeType | "all") => void;
}) {
  const countFor = (value: ChangeType | "all") =>
    releases.reduce(
      (total, release) =>
        total +
        release.changes.filter(
          (change) => value === "all" || change.type === value,
        ).length,
      0,
    );

  const visibleReleases = releases.flatMap((release) => {
    const changes = release.changes.filter(
      (change) => filter === "all" || change.type === filter,
    );

    return changes.length > 0 ? [{ ...release, changes }] : [];
  });

  return (
    <Section
      title="Releases"
      description="Filter by change type to find what matters to your integration — breaking changes and removals are the ones to read before upgrading."
    >
      <Tabs
        value={filter}
        onValueChange={(value) => {
          const match = filterTypes.find((type) => type.value === value);

          setFilter(match ? match.value : "all");
        }}
      >
        <TabsList className="flex-wrap">
          {filterTypes.map((type) => (
            <TabsTrigger
              key={type.value}
              value={type.value}
              badge={countFor(type.value)}
            >
              {type.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="space-y-8 pt-6">
          {visibleReleases.map((release) => (
            <ChangelogEntry
              key={release.version}
              version={release.version}
              date={release.date}
              changes={release.changes}
            />
          ))}
        </CardContent>
      </Card>
    </Section>
  );
}

function HowWeVersionSection() {
  return (
    <Section
      title="How we version"
      description="The kit is registry-first: components are source files you own, so upgrades are deliberate diffs, not silent dependency bumps."
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              CLI: semver + Changesets
            </CardTitle>
            <CardDescription>
              kira-kit releases are scoped to packages/cli and versioned with
              Changesets. Breaking CLI changes get a major bump and a migration
              path (kira-kit migrate).
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Components: diff before you add
            </CardTitle>
            <CardDescription>
              Use kira-kit add --diff to preview incoming changes against your
              local edits, and kira-kit migrate to report divergence. Nothing
              overwrites your work without asking.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Full history</CardTitle>
            <CardDescription>
              Every entry above traces to commits on GitHub. Per-component
              upgrade notes live in docs/*-upgrade.md in the repository.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="https://github.com/Kiranaide/kira-kit-v2/commits/development"
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "gap-2",
              )}
            >
              Commit history
              <IconArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function IntroductionCta() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-6">
      <p className="text-sm text-muted-foreground">
        New to the kit? Start with the introduction.
      </p>
      <Link
        to="/docs/introduction"
        className={cn(buttonVariants({ size: "sm" }), "gap-2")}
      >
        Introduction
        <IconArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function ChangelogPage() {
  const [filter, setFilter] = useState<ChangeType | "all">("all");

  return (
    <ComponentPage>
      <PageHeader
        title="Changelog"
        description="Notable changes to Kira Kit and the kira-kit CLI, in Keep a Changelog format. Entries are drawn from the repository's release history; the CLI is versioned with Changesets."
        badge={<Badge variant="secondary">Keep a Changelog</Badge>}
      />
      <ReleasesSection filter={filter} setFilter={setFilter} />
      <HowWeVersionSection />
      <IntroductionCta />
    </ComponentPage>
  );
}
