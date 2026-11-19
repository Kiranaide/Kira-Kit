import { Link } from "@tanstack/react-router";
import {
  IconAccessible,
  IconBox,
  IconPalette,
  IconRuler2,
  IconCode,
  IconRobot,
  IconArrowRight,
  IconDownload,
  IconTerminal2,
  IconForms,
  IconBook2,
} from "@tabler/icons-react";
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
import { CodeBlock } from "@/components/ui/code-block";
import {
  ComponentPage,
  PageHeader,
  Section,
  FeatureGrid,
} from "@/components/docs";

const features = [
  {
    title: "Accessible by default",
    description:
      "Every component is built on Base UI primitives — keyboard navigation, focus management, and WAI-ARIA semantics come from the primitive layer, not bolted on afterwards.",
    icon: (
      <IconAccessible className="h-5 w-5 text-primary" aria-hidden="true" />
    ),
  },
  {
    title: "You own the code",
    description:
      "Kira Kit is a source registry, not a runtime dependency. Components are copied into your source tree, so you can read, edit, and extend every line.",
    icon: <IconBox className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
  {
    title: "OKLCH theming",
    description:
      "Nine curated presets and a generator that derives a full light/dark palette from any primary color, verified against WCAG 2.2 AA and APCA contrast at build time.",
    icon: <IconPalette className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
  {
    title: "A spacing contract",
    description:
      "One 4px-based scale governs control heights, gaps, padding, and radii across the kit. Twelve parser-based CLI checks keep every component on the ladder.",
    icon: <IconRuler2 className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
  {
    title: "TypeScript first",
    description:
      "Full type definitions, cva variant exports, and data-slot attributes on every root element — predictable APIs for humans and for tooling.",
    icon: <IconCode className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
  {
    title: "Agent-ready docs",
    description:
      "The registry publishes llms.txt and per-item markdown, so coding agents can discover components and install them without hallucinating APIs.",
    icon: <IconRobot className="h-5 w-5 text-primary" aria-hidden="true" />,
  },
];

const stats = [
  { value: "90+", label: "Components & hooks" },
  { value: "9", label: "Theme presets" },
  { value: "12", label: "Quality checks" },
  { value: "4", label: "Project templates" },
];

const paths = [
  {
    to: "/docs/installation",
    icon: IconDownload,
    title: "Installation",
    description: "Go from zero to your first component in a few minutes.",
  },
  {
    to: "/docs/theming",
    icon: IconPalette,
    title: "Theming",
    description: "Preview the nine presets and generate your own palette.",
  },
  {
    to: "/docs/cli",
    icon: IconTerminal2,
    title: "CLI",
    description: "Every command, flag, and quality check in one reference.",
  },
  {
    to: "/docs/form",
    icon: IconForms,
    title: "Form",
    description:
      "Build validated forms with TanStack Form, zod, and KiraField.",
  },
] as const;

const registryConfigCode = `{
  "registries": {
    "@kira-kit": "https://kira-kit.vercel.app/r/{name}.json"
  }
}`;

const steps = [
  {
    title: "Initialize",
    description:
      "kira-kit init wires the @kira-kit registry into components.json and can apply a theme preset in the same step.",
    code: "npx kira-kit init --preset phase-line",
  },
  {
    title: "Add components",
    description:
      "The kira-kit CLI copies components, hooks, and support modules into your project and resolves their dependencies automatically.",
    code: "npx kira-kit add button card",
  },
  {
    title: "Make it yours",
    description:
      "The source now lives in your repository. Edit variants, swap tokens, or extend a component — no fork of a node_modules package required.",
    code: 'import { Button } from "@/components/ui/button";',
  },
];

function HeroActions() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        to="/docs/installation"
        className={cn(buttonVariants({ size: "lg" }), "gap-2")}
      >
        Get started
        <IconArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <Link
        to="/components/button"
        className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
      >
        Browse components
      </Link>
    </div>
  );
}

function WhyKiraKitSection() {
  return (
    <Section
      title="Why Kira Kit"
      description="The kit optimizes for the three things teams actually fight with: accessibility regressions, visual drift, and theming that fails contrast checks."
    >
      <FeatureGrid features={features} />
    </Section>
  );
}

function HowItWorksSection() {
  return (
    <Section
      title="How it works"
      description="No runtime package to version-pin. The registry delivers source files through the self-contained kira-kit CLI."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={step.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                {step.title}
              </CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={step.code}
                language={index === 2 ? "tsx" : "bash"}
                copyFormat={index === 2 ? "raw" : "shell"}
              />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">One registry entry</CardTitle>
          <CardDescription>
            This is the entire configuration the CLI adds to components.json.
            Existing entries are never overwritten.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={registryConfigCode} language="json" />
        </CardContent>
      </Card>
    </Section>
  );
}

function StatsSection() {
  return (
    <Section title="By the numbers">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function PathsSection() {
  return (
    <Section
      title="Pick your path"
      description="Each guide is task-based: open the page that matches what you are trying to do right now."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {paths.map((path) => (
          <Link
            key={path.to}
            to={path.to}
            className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40 hover:bg-accent/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <div className="flex items-center gap-2">
              <path.icon className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="text-base font-semibold">{path.title}</h3>
              <IconArrowRight
                className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                aria-hidden="true"
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {path.description}
            </p>
          </Link>
        ))}
      </div>
    </Section>
  );
}

function AgentsSection() {
  return (
    <Section
      title="Working with coding agents?"
      description="The same structure that helps people helps agents. Point your assistant at the machine-readable index instead of letting it guess component APIs."
    >
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2">
            <IconBook2
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden="true"
            />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">llms.txt</span>{" "}
              lists every registry item; per-item markdown lives under{" "}
              <span className="font-mono text-xs">/docs/</span>. Agents can
              read, pick, and install without inventing props.
            </p>
          </div>
          <a
            href="https://kira-kit.vercel.app/llms.txt"
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "shrink-0 gap-2",
            )}
          >
            View llms.txt
            <IconArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </CardContent>
      </Card>
    </Section>
  );
}

function InstallationCta() {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-muted/30 p-6">
      <p className="text-sm text-muted-foreground">
        Ready to build? The quickstart takes a few minutes.
      </p>
      <Link
        to="/docs/installation"
        className={cn(buttonVariants({ size: "sm" }), "gap-2")}
      >
        Installation
        <IconArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default function IntroductionPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Introduction"
        description="Kira Kit is an enterprise React UI kit built on Base UI and Tailwind CSS v4, distributed as a source registry. Accessible primitives, a disciplined spacing system, and contrast-verified theming — with source code you own."
        badge={<Badge variant="secondary">Registry-first</Badge>}
      />

      <HeroActions />

      <WhyKiraKitSection />

      <HowItWorksSection />

      <StatsSection />

      <PathsSection />

      <AgentsSection />

      <InstallationCta />
    </ComponentPage>
  );
}
