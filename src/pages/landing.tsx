import * as React from "react";
import { Link } from "@tanstack/react-router";
import {
  IconArrowRight,
  IconArrowUpRight,
  IconBrandGithub,
  IconBox,
  IconCheck,
  IconCommand,
  IconCopy,
  IconFileCode2,
  IconFolderOpen,
  IconFolderPlus,
  IconKeyboard,
  IconList,
  IconPalette,
  IconTable,
  IconTerminal2,
} from "@tabler/icons-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Reveal, SectionRule } from "@/components/docs/layout";
import { SITE_REPOSITORY_URL, SiteHeader } from "@/components/site/site-chrome";
import { HeroShowcase } from "@/components/landing/hero-showcase";

const TECH_STACK = ["React", "Base UI", "Tailwind CSS", "TypeScript"] as const;

const catalogCards = [
  {
    to: "/components/data-table",
    icon: IconTable,
    title: "Data Table",
    description:
      "Build tables with sorting, filters, pagination, and row selection.",
  },
  {
    to: "/components/accordion",
    icon: IconList,
    title: "Accordion",
    description:
      "Organize dense content into keyboard-accessible collapsible panels.",
  },
  {
    to: "/components/command",
    icon: IconCommand,
    title: "Command",
    description: "Give users a searchable menu for commands and shortcuts.",
  },
] as const;

const installPaths = [
  {
    icon: IconFolderPlus,
    title: "Create new project",
    description:
      "The Vite starter includes Tailwind CSS, TypeScript paths, and the Vite alias.",
    code: "npx kira-kit create my-app --template vite --install",
    link: { to: "/docs/installation", label: "Create a project" },
  },
  {
    icon: IconFolderOpen,
    title: "Existing project",
    description:
      "Initialize the registry and base styles in your React project.",
    code: "npx kira-kit init --preset phase-line",
    link: { to: "/docs/installation", label: "Set up an existing project" },
  },
] as const;

const principles = [
  {
    icon: IconFileCode2,
    title: "Source you can edit",
    description: "The CLI writes component files directly into your project.",
  },
  {
    icon: IconKeyboard,
    title: "Accessible primitives",
    description: "Base UI handles core semantics and keyboard interactions.",
  },
  {
    icon: IconPalette,
    title: "Themeable by design",
    description:
      "Semantic tokens let components follow your product’s light and dark themes.",
  },
] as const;

/** Click-to-copy command chip; the whole row is the target so it stays tappable. */
function InstallChip({ command }: { command: string }) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => setCopied(false), 1600);

    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = () => {
    navigator.clipboard
      .writeText(command)
      .then(() => setCopied(true))
      .catch(() => setCopied(false));
  };

  return (
    <button
      type="button"
      onClick={copy}
      data-slot="install-chip"
      aria-label={copied ? "Command copied to clipboard" : `Copy: ${command}`}
      className="docs-focus-ring flex min-h-11 w-full max-w-80 items-center gap-2.5 rounded-md border border-border bg-muted px-3 text-left transition-colors duration-150 ease-out hover:border-primary/40 lg:h-10"
    >
      <IconTerminal2
        aria-hidden="true"
        className="h-4 w-4 shrink-0 docs-accent"
      />
      <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-card-foreground">
        {command}
      </code>
      {copied ? (
        <IconCheck
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 docs-accent"
        />
      ) : (
        <IconCopy
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
        />
      )}
    </button>
  );
}

function SectionHeading({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("flex max-w-[620px] flex-col gap-2.5", className)}>
      <h2 className="text-[30px] font-normal leading-[1.15] tracking-[-0.035em] text-balance text-foreground lg:text-[38px]">
        {title}
      </h2>
      <p className="text-base leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

/**
 * The hero is the one permanently-dark surface on the site. Scoping `.dark` to
 * the section gives it the preset's dark tokens (background, card, primary)
 * while the rest of the page keeps the user's mode — no second set of colours.
 */
function HeroSection() {
  return (
    <section data-slot="hero" className="dark bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-10 px-4 pt-12 pb-12 sm:px-8 lg:flex-row lg:items-center lg:gap-14 lg:px-12 lg:pt-20 lg:pb-16">
        <Reveal className="flex w-full max-w-[520px] shrink-0 flex-col gap-5">
          <p className="text-sm font-semibold tracking-wide docs-accent">
            React component registry
          </p>
          <h1 className="text-[clamp(2.75rem,8.5vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-balance text-card-foreground">
            Build with UI you own.
          </h1>
          <p className="max-w-[440px] text-base leading-7 text-muted-foreground lg:text-lg">
            Accessible React components built on Base UI. Install the source and
            make it part of your own design system.
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/docs/installation"
              className={cn(buttonVariants({ size: "lg" }), "gap-2")}
            >
              Get started
              <IconArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              to="/components/button"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Browse components
            </Link>
          </div>

          <InstallChip command="npx kira-kit add button" />
        </Reveal>

        <Reveal
          delay={80}
          className="min-w-0 flex-1 rounded-2xl border border-border bg-card p-4"
        >
          <HeroShowcase />
        </Reveal>
      </div>
    </section>
  );
}

function BuiltWithStrip() {
  return (
    <section aria-label="Built with" className="bg-background">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-4 sm:px-8 lg:gap-x-8 lg:px-12">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Built with
        </h2>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 lg:gap-x-8">
          {TECH_STACK.map((tech) => (
            <li key={tech} className="text-sm font-semibold text-foreground">
              {tech}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function CatalogSection() {
  return (
    <section
      aria-labelledby="catalog-heading"
      className="mx-auto flex w-full max-w-[1240px] flex-col gap-7 px-4 py-16 sm:px-8 lg:px-12 lg:py-20"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          title="Components for real workflows"
          description="Start with the pieces behind search, data management, and structured content."
        />
        <Link
          to="/components/button"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "min-h-11 shrink-0 gap-2",
          )}
        >
          Browse all components
          <IconArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catalogCards.map((card, index) => (
          <li key={card.to}>
            <Reveal delay={index * 60} className="h-full">
              <Link
                to={card.to}
                className="docs-focus-ring group flex h-full flex-col gap-3 rounded-[14px] border border-border bg-card p-6 transition-colors duration-150 ease-out hover:border-primary/40 hover:bg-accent/40"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 docs-accent">
                      <card.icon
                        aria-hidden="true"
                        className="h-[17px] w-[17px]"
                      />
                    </span>
                    <span className="truncate text-[17px] font-medium leading-6 text-card-foreground">
                      {card.title}
                    </span>
                  </span>
                  <IconArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                </div>
                <p className="text-[15px] leading-6 text-muted-foreground">
                  {card.description}
                </p>
              </Link>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

function InstallPathCard({ path }: { path: (typeof installPaths)[number] }) {
  return (
    <Card className="h-full gap-4">
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <path.icon
            aria-hidden="true"
            className="h-[22px] w-[22px] shrink-0 docs-accent"
          />
          <h4 className="text-base font-semibold text-card-foreground">
            {path.title}
          </h4>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          {path.description}
        </p>
        <CodeBlock code={path.code} language="bash" showLineNumbers />
        <Link
          to={path.link.to}
          className="docs-focus-ring inline-flex min-h-11 w-fit items-center gap-1.5 rounded-[8px] text-sm font-semibold docs-accent transition-opacity duration-150 ease-out hover:opacity-80"
        >
          {path.link.label}
          <IconArrowUpRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}

function InstallSection() {
  return (
    <section
      aria-labelledby="install-heading"
      className="bg-muted/40 border-y border-border/70"
    >
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-9 px-4 py-14 sm:px-8 lg:px-12 lg:py-16">
        <SectionHeading
          title="From registry to repo"
          description="Add components to an existing project and edit them alongside the rest of your app."
        />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-base font-semibold text-foreground">
              Install Kira Kit
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Create a preconfigured app or add the kit to a React project you
              already have.
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {installPaths.map((path, index) => (
              <Reveal key={path.title} delay={index * 80}>
                <InstallPathCard path={path} />
              </Reveal>
            ))}
          </div>
        </div>

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {principles.map((principle) => (
            <li
              key={principle.title}
              className="flex items-start gap-2.5 min-w-0"
            >
              <principle.icon
                aria-hidden="true"
                className="mt-0.5 h-[19px] w-[19px] shrink-0 docs-accent"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="text-base leading-6 text-foreground">
                  {principle.title}
                </h3>
                <p className="text-sm leading-5 text-muted-foreground">
                  {principle.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SiteFooterSection() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex min-h-21 w-full max-w-[1240px] flex-col items-start justify-between gap-5 px-4 py-6 sm:flex-row sm:items-center sm:px-8 lg:px-12">
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-foreground text-background"
          >
            <IconBox className="h-4 w-4" />
          </span>
          <span className="text-[17px] font-bold tracking-[-0.02em] text-foreground">
            Kira Kit
          </span>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-1">
          <Link
            to="/docs/introduction"
            className="docs-focus-ring min-h-11 rounded-[8px] px-2 text-sm font-medium text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
          >
            Documentation
          </Link>
          <Link
            to="/components/button"
            className="docs-focus-ring min-h-11 rounded-[8px] px-2 text-sm font-medium text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
          >
            Components
          </Link>
          <a
            href={SITE_REPOSITORY_URL}
            target="_blank"
            rel="noreferrer"
            className="docs-focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-[8px] px-2 text-sm font-medium text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
          >
            <IconBrandGithub aria-hidden="true" className="h-4 w-4" />
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <HeroSection />
        <SectionRule />
        <BuiltWithStrip />
        <SectionRule />
        <CatalogSection />
        <InstallSection />
      </main>

      <SiteFooterSection />
    </div>
  );
}
