import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  IconAccessible,
  IconAdjustmentsHorizontal,
  IconArrowRight,
  IconArrowUpRight,
  IconBook,
  IconBox,
  IconCheck,
  IconCode,
  IconCopy,
  IconPalette,
  IconRuler2,
  IconTerminal2,
} from "@tabler/icons-react";
import { cn } from "cn";
import { DocPage, DocSection } from "@/components/docs/doc-page";
import { Reveal } from "@/components/docs/layout";
import { buttonVariants } from "@/components/ui/button";

const INIT_COMMAND = "npx kira-kit init";

const QUICKSTART_COMMANDS = [
  "npx kira-kit init",
  "npx kira-kit add button input select dialog",
] as const;

const METRICS = [
  { value: "90+", label: "Components & hooks", detail: "Source registry" },
  { value: "4px", label: "Spacing contract", detail: "xs 28px → xl 44px" },
  { value: "WCAG AA", label: "Accessibility", detail: "Contrast & keyboard" },
  { value: "0", label: "Runtime lock-in", detail: "Copy into your repo" },
] as const;

const START_PATHS = [
  {
    to: "/docs/introduction",
    icon: IconBook,
    title: "Introduction",
    tag: "Guide",
    description:
      "Learn how Base UI primitives, OKLCH theme tokens, and the source registry fit together.",
  },
  {
    to: "/docs/installation",
    icon: IconTerminal2,
    title: "Installation",
    tag: "5 min",
    description:
      "Scaffold a new Vite + React app or drop Kira Kit into an existing TypeScript workspace.",
  },
  {
    to: "/ui-preview",
    icon: IconRuler2,
    title: "UI Preview",
    tag: "Interactive",
    description:
      "Inspect the 4px control ladder, composite input seams, worst-case strings, and motion.",
  },
  {
    to: "/docs/theming",
    icon: IconPalette,
    title: "Theming",
    tag: "Presets",
    description:
      "Switch between curated presets, tune primary colors, typography pairs, and dark mode.",
  },
] as const;

const PILLARS = [
  {
    icon: IconAdjustmentsHorizontal,
    title: "4px spacing contract",
    description:
      "Every control shares one height ladder (28px to 44px) and verified light/dark contrast tokens.",
  },
  {
    icon: IconAccessible,
    title: "Base UI powered",
    description:
      "Unstyled, accessible primitives with WAI-ARIA patterns, focus restoration, and keyboard navigation built in.",
  },
  {
    icon: IconCode,
    title: "TypeScript first",
    description:
      "Strict generic props, exported cva variants, and clean compound APIs designed for autocomplete.",
  },
  {
    icon: IconBox,
    title: "Source registry ownership",
    description:
      "Components install directly into your codebase with zero black-box dependency lock-in.",
  },
] as const;

const CATALOG_CATEGORIES = [
  {
    name: "Forms & Inputs",
    count: "24",
    samples: [
      { label: "Button", to: "/components/button" },
      { label: "Input", to: "/components/input" },
      { label: "Select", to: "/components/select" },
      { label: "Field", to: "/components/field" },
    ],
  },
  {
    name: "Overlays & Menus",
    count: "14",
    samples: [
      { label: "Dialog", to: "/components/dialog" },
      { label: "Drawer", to: "/components/drawer" },
      { label: "Popover", to: "/components/popover" },
      { label: "Dropdown", to: "/components/dropdown-menu" },
    ],
  },
  {
    name: "Navigation & Layout",
    count: "16",
    samples: [
      { label: "Sidebar", to: "/components/sidebar" },
      { label: "Tabs", to: "/components/tabs" },
      { label: "Breadcrumb", to: "/components/breadcrumb" },
      { label: "Card", to: "/components/card" },
    ],
  },
  {
    name: "Data Display",
    count: "15",
    samples: [
      { label: "Table", to: "/components/table" },
      { label: "Badge", to: "/components/badge" },
      { label: "Avatar", to: "/components/avatar" },
    ],
  },
  {
    name: "Feedback & Status",
    count: "11",
    samples: [
      { label: "Toast", to: "/components/toast" },
      { label: "Alert", to: "/components/alert" },
      { label: "Progress", to: "/components/progress" },
      { label: "Skeleton", to: "/components/skeleton" },
    ],
  },
  {
    name: "Utilities & Hooks",
    count: "12",
    samples: [
      { label: "CodeBlock", to: "/components/code-block" },
      { label: "Command", to: "/components/command" },
    ],
  },
] as const;

function useCopyText(text: string) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => setCopied(false), 1600);

    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = React.useCallback(() => {
    navigator.clipboard
      .writeText(text)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  }, [text]);

  return { copied, copy };
}

function VersionBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-xs font-semibold docs-accent">
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full docs-accent-fill"
      />
      v2.1 · Base UI + Tailwind CSS v4
    </span>
  );
}

function HeroActions() {
  const { copied, copy } = useCopyText(INIT_COMMAND);
  const CopyGlyph = copied ? IconCheck : IconCopy;

  return (
    <div className="flex flex-col gap-5 border-b border-border/70 pb-7">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          to="/docs/introduction"
          className={cn(
            buttonVariants({ size: "lg" }),
            "group h-11 w-full gap-2 sm:h-10 sm:w-auto",
          )}
        >
          Get started
          <IconArrowRight
            aria-hidden="true"
            className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </Link>

        <Link
          to="/ui-preview"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 w-full gap-2 sm:h-10 sm:w-auto",
          )}
        >
          <IconRuler2 aria-hidden="true" className="size-4" />
          Explore UI Preview
        </Link>

        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied init command" : "Copy npx kira-kit init"}
          className="docs-focus-ring inline-flex h-11 w-full items-center justify-between gap-2.5 rounded-lg border border-border bg-muted/60 px-3 font-mono text-[13px] text-foreground transition-colors duration-150 ease-out hover:border-primary/40 hover:bg-muted sm:h-10 sm:w-auto"
        >
          <span className="flex items-center gap-1.5 truncate">
            <span aria-hidden="true" className="font-semibold docs-accent">
              $
            </span>
            <span>{INIT_COMMAND}</span>
          </span>
          <CopyGlyph
            aria-hidden="true"
            className={cn(
              "size-3.5 shrink-0 transition-transform duration-150 ease-out motion-reduce:transition-none",
              copied ? "scale-110 docs-accent" : "text-muted-foreground",
            )}
          />
          <span className="sr-only" aria-live="polite">
            {copied ? "Copied to clipboard" : ""}
          </span>
        </button>
      </div>
    </div>
  );
}

function MetricsStrip() {
  return (
    <Reveal>
      <dl className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
        {METRICS.map((metric) => (
          <div
            key={metric.label}
            className="flex flex-col gap-0.5 rounded-xl border border-border bg-card px-3.5 py-3 transition-colors duration-150 ease-out hover:border-primary/35 sm:px-4 sm:py-3.5"
          >
            <dt className="order-2 text-[13px] font-semibold text-foreground">
              {metric.label}
            </dt>
            <dd className="order-1 font-mono text-xl font-semibold tracking-[-0.03em] docs-accent sm:text-[22px]">
              {metric.value}
            </dd>
            <dd className="order-3 text-xs text-muted-foreground">
              {metric.detail}
            </dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}

function StartHereSection() {
  return (
    <DocSection
      id="start-here"
      title="Start here"
      description="Pick the workflow that matches where you are — from first install to live spacing verification."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {START_PATHS.map((path) => (
          <li key={path.to}>
            <Link
              to={path.to}
              className="docs-focus-ring group flex h-full flex-col gap-2.5 rounded-[14px] border border-border bg-card p-4 transition-colors duration-150 ease-out hover:border-primary/40 hover:bg-accent/35 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] bg-primary/10 docs-accent">
                    <path.icon aria-hidden="true" className="size-[17px]" />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold leading-5 text-card-foreground">
                      {path.title}
                    </span>
                    <span className="font-mono text-[11px] docs-accent">
                      {path.tag}
                    </span>
                  </div>
                </div>
                <IconArrowRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover:translate-x-1 group-hover:text-foreground motion-reduce:transition-none"
                />
              </div>
              <p className="text-[13px] leading-5 text-muted-foreground">
                {path.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </DocSection>
  );
}

function WhyKiraKitSection() {
  return (
    <DocSection
      id="why-kira-kit"
      title="Why Kira Kit"
      description="Engineered for consistency across desktop density and mobile touch targets."
    >
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
        {PILLARS.map((pillar) => (
          <li
            key={pillar.title}
            className="flex items-start gap-3 px-3.5 py-3.5 sm:px-4.5 sm:py-4"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/60 docs-accent">
              <pillar.icon aria-hidden="true" className="size-4" />
            </span>
            <div className="flex min-w-0 flex-col gap-0.5">
              <h3 className="text-sm font-semibold text-foreground">
                {pillar.title}
              </h3>
              <p className="text-[13px] leading-5 text-muted-foreground">
                {pillar.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </DocSection>
  );
}

function ComponentCatalogSection() {
  return (
    <DocSection
      id="component-catalog"
      title="Component catalog"
      description="Browse by category in the sidebar or add individual primitives directly with the CLI."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {CATALOG_CATEGORIES.map((category) => (
          <div
            key={category.name}
            className="flex flex-col gap-2.5 rounded-xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-foreground">
                {category.name}
              </h3>
              <span className="font-mono text-[11px] font-semibold docs-accent">
                {category.count}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {category.samples.map((sample) => (
                <Link
                  key={sample.to}
                  to={sample.to}
                  className="docs-focus-ring inline-flex items-center rounded-md bg-muted px-2 py-1 font-mono text-[11px] text-muted-foreground transition-colors duration-150 ease-out hover:bg-primary/12 hover:text-foreground"
                >
                  {sample.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DocSection>
  );
}

function QuickstartCliSection() {
  const { copied, copy } = useCopyText(QUICKSTART_COMMANDS.join("\n"));
  const CopyGlyph = copied ? IconCheck : IconCopy;

  return (
    <DocSection
      id="quickstart-cli"
      title="Quickstart CLI"
      description="Initialize once, then pull only the components you need into src/components/ui."
    >
      <div className="flex flex-col gap-3.5 rounded-[14px] border border-[#263338] bg-[#080A0C] p-4 text-[#F4F5F6] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <IconTerminal2
              aria-hidden="true"
              className="size-4 text-[#58B7B0]"
            />
            <span className="text-sm font-semibold">
              Add your first components
            </span>
          </div>

          <button
            type="button"
            onClick={copy}
            aria-label={
              copied ? "Copied CLI commands" : "Copy CLI quickstart commands"
            }
            className="docs-focus-ring inline-flex min-h-9 items-center gap-1.5 rounded-[7px] border border-[#34454A] bg-[#121B1F] px-2.5 text-xs font-medium text-[#F4F5F6] transition-colors duration-150 ease-out hover:border-[#58B7B0]/60"
          >
            <CopyGlyph
              aria-hidden="true"
              className={cn(
                "size-3.5",
                copied ? "text-[#58B7B0]" : "text-[#9C9FA0]",
              )}
            />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div aria-hidden="true" className="h-px w-full bg-[#263338]" />

        <ol className="flex flex-col gap-2 font-mono text-[13px]">
          {QUICKSTART_COMMANDS.map((command, index) => (
            <li key={command} className="flex items-baseline gap-2.5">
              <span className="select-none text-xs font-semibold text-[#58B7B0]">
                {index + 1}
              </span>
              <code className="min-w-0 overflow-x-auto text-[#F4F5F6]">
                {command}
              </code>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[#9C9FA0]">
            Auto-detects your package manager, Tailwind v4 CSS, and TS path
            aliases.
          </p>
          <Link
            to="/docs/cli"
            className="docs-focus-ring group inline-flex h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[#58B7B0] px-3.5 text-[13px] font-semibold text-[#02100F] transition-opacity duration-150 ease-out hover:opacity-90 sm:h-9"
          >
            Read CLI docs
            <IconArrowUpRight
              aria-hidden="true"
              className="size-3.5 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
            />
          </Link>
        </div>
      </div>
    </DocSection>
  );
}

export default function OverviewPage() {
  return (
    <DocPage
      title="Welcome to Kira Kit"
      description="An enterprise React component system built on Base UI primitives, Tailwind CSS v4, and TypeScript — delivered as a source registry so you own every line."
      crumb="Overview"
      badge={<VersionBadge />}
      next={{ to: "/docs/introduction", label: "Introduction" }}
    >
      <HeroActions />
      <MetricsStrip />
      <StartHereSection />
      <WhyKiraKitSection />
      <ComponentCatalogSection />
      <QuickstartCliSection />
    </DocPage>
  );
}
