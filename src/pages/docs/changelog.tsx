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
    version: "0.3.0",
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
        title: "Input focus ring offsets",
        description:
          "Focus rings sit flush with control borders instead of offsetting outside them (PR #1).",
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
        title: "CLI rewrite on a pinned shadcn core",
        description:
          "build/check/add/init delegate to shadcn 4.22.1; new create, migrate, search, theme, and view commands; four embedded project templates; vitest coverage.",
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
        title: "Registry sync: 92 shadcn-compatible items",
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

export default function ChangelogPage() {
  const [filter, setFilter] = useState<ChangeType | "all">("all");

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
    <ComponentPage>
      <PageHeader
        title="Changelog"
        description="Notable changes to Kira Kit and the kira-kit CLI, in Keep a Changelog format. Entries are drawn from the repository's release history; the CLI is versioned with Changesets."
        badge={<Badge variant="secondary">Keep a Changelog</Badge>}
      />

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
                Changesets. Breaking CLI changes get a major bump and a
                migration path (kira-kit migrate).
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
    </ComponentPage>
  );
}
