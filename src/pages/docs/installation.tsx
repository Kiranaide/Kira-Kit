import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  IconCheck,
  IconArrowRight,
  IconAlertCircle,
} from "@tabler/icons-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { ComponentPage, PageHeader, Section } from "@/components/docs";

const packageManagers = ["npm", "bun", "pnpm", "yarn"] as const;

type PackageManager = (typeof packageManagers)[number];

const runCommand: Record<PackageManager, string> = {
  npm: "npx",
  bun: "bunx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
};

function CommandTabs({ command }: { command: string }) {
  return (
    <Tabs defaultValue="npm">
      <TabsList>
        {packageManagers.map((pm) => (
          <TabsTrigger key={pm} value={pm}>
            {pm}
          </TabsTrigger>
        ))}
      </TabsList>
      {packageManagers.map((pm) => (
        <TabsContent key={pm} value={pm} animation="none">
          <CodeBlock
            code={`${runCommand[pm]} ${command}`}
            language="bash"
            copyFormat="shell"
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

const requirements = [
  {
    title: "React 18.3+",
    description: "Components target modern React with hooks and refs.",
  },
  {
    title: "Tailwind CSS v4",
    description: "Tokens are CSS variables mapped through @theme inline.",
  },
  {
    title: "Node.js 22+",
    description: "Required by the kira-kit CLI (Bun 1.x also works).",
  },
  {
    title: "TypeScript",
    description: "Recommended — every component ships full type definitions.",
  },
];

const registryConfigCode = `{
  "registries": {
    "@kira-kit": "https://kira-kit.vercel.app/r/{name}.json"
  }
}`;

const firstComponentCode = `import { Button } from "@/components/ui/button";

export function Example() {
  return <Button variant="default">Ship it</Button>;
}`;

const fileTreeCode = `my-app/
├── components.json          # @kira-kit registry entry
├── src/
│   ├── components/ui/       # copied components — yours to edit
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── hooks/               # copied hooks (use-reduced-motion, ...)
│   └── index.css            # OKLCH theme tokens
└── package.json             # cn, cva, @base-ui/react, ...`;

const templates = [
  {
    name: "vite",
    description: "Vite + React SPA — the fastest way to try the kit.",
  },
  {
    name: "next",
    description: "Next.js App Router with the registry pre-wired.",
  },
  {
    name: "tanstack-start",
    description: "TanStack Start full-stack React setup.",
  },
  {
    name: "monorepo",
    description: "Workspace with separate app and ui packages.",
  },
];

const troubleshooting = [
  {
    value: "node-version",
    question: "The CLI exits immediately or throws a syntax error",
    answer:
      "kira-kit targets Node.js 22 or newer. Check with node --version; older LTS lines such as 18 or 20 are not supported. Bun 1.x is a supported alternative runtime.",
  },
  {
    value: "registry-404",
    question: "shadcn reports it cannot fetch @kira-kit items",
    answer:
      "Confirm components.json contains the @kira-kit entry pointing at https://kira-kit.vercel.app/r/{name}.json — the {name} placeholder is literal and must stay in the URL. Running kira-kit init again repairs the entry without touching your other registries.",
  },
  {
    value: "tailwind-v3",
    question: "Styles are missing in a Tailwind v3 project",
    answer:
      "Kira Kit tokens are defined with Tailwind v4's @theme inline and @custom-variant syntax. Upgrade the project to Tailwind v4 first; the kit does not ship a v3 compatibility layer.",
  },
  {
    value: "existing-config",
    question: "I already have a components.json — will init overwrite it?",
    answer:
      "No. init registers the @kira-kit namespace only if it is absent and never overwrites an existing entry. Your shadcn configuration, aliases, and other registries are preserved.",
  },
  {
    value: "diverged",
    question: "I edited a component — how do I compare it with the registry?",
    answer:
      "Run kira-kit migrate. It reports components that have diverged from the published registry and never overwrites your work. Use kira-kit add --diff to preview incoming changes before applying them.",
  },
];

function StepHeading({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {step}
        </span>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function RequirementsSection() {
  return (
    <Section
      title="Requirements"
      description="An existing shadcn project on Tailwind v4 already satisfies most of this list."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {requirements.map((req) => (
          <Card key={req.title}>
            <CardContent className="flex items-start gap-2 pt-6">
              <IconCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-success"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium">{req.title}</p>
                <p className="text-sm text-muted-foreground">
                  {req.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function QuickstartSection() {
  return (
    <Section
      title="Quick start"
      description="Follow the four steps in order — each one ends with something you can run or see."
    >
      <div className="space-y-8">
        <StepHeading step={1} title="Create a project (optional)">
          <p className="text-sm text-muted-foreground">
            Starting fresh? Scaffold a project pre-wired for Kira Kit. Skip this
            step if you already have a React + Tailwind v4 app.
          </p>
          <CommandTabs command="kira-kit create my-app --template vite --install" />
        </StepHeading>

        <StepHeading step={2} title="Initialize your project">
          <p className="text-sm text-muted-foreground">
            In an existing project, init delegates base setup to the pinned
            shadcn CLI and registers the{" "}
            <span className="font-mono text-xs">@kira-kit</span> namespace. Add{" "}
            <span className="font-mono text-xs">--preset phase-line</span> to
            apply a theme in the same step — see{" "}
            <Link
              to="/docs/theming"
              className="font-medium text-primary underline underline-offset-4"
            >
              Theming
            </Link>
            .
          </p>
          <CommandTabs command="kira-kit init" />
        </StepHeading>

        <StepHeading step={3} title="Add your first component">
          <p className="text-sm text-muted-foreground">
            Either command works — kira-kit add delegates to the same pinned
            shadcn CLI and resolves transitive registry dependencies for you.
          </p>
          <CommandTabs command="shadcn@latest add @kira-kit/button" />
          <CodeBlock
            code="npx kira-kit add button card dialog"
            language="bash"
            copyFormat="shell"
            filename="or use the kira-kit CLI directly"
          />
        </StepHeading>

        <StepHeading step={4} title="Render it">
          <CodeBlock code={firstComponentCode} language="tsx" />
          <div className="flex items-start gap-2 rounded-lg border border-success/40 bg-success/10 p-4 text-sm">
            <IconCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-success"
              aria-hidden="true"
            />
            <p>
              If you see a styled button, the registry, tokens, and fonts are
              all wired correctly. Continue with{" "}
              <Link
                to="/docs/theming"
                className="font-medium text-primary underline underline-offset-4"
              >
                Theming
              </Link>{" "}
              to make it look like your product.
            </p>
          </div>
        </StepHeading>
      </div>
    </Section>
  );
}

function RegistryConfigSection() {
  return (
    <Section
      title="Registry configuration"
      description="This is what init writes. The {name} placeholder is part of the shadcn registries format — keep it literal."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">components.json</CardTitle>
          <CardDescription>
            Existing entries are never overwritten; the namespace is added only
            when absent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock
            code={registryConfigCode}
            language="json"
            filename="components.json"
          />
        </CardContent>
      </Card>
    </Section>
  );
}

function FileTreeSection() {
  return (
    <Section
      title="What lands in your project"
      description="Registry items are source files, not a runtime package. Dependencies such as cn, class-variance-authority, and @base-ui/react are added to package.json by shadcn."
    >
      <Card>
        <CardContent className="pt-6">
          <CodeBlock code={fileTreeCode} language="text" showCopy={false} />
        </CardContent>
      </Card>
    </Section>
  );
}

function TemplatesSection() {
  return (
    <Section
      title="Project templates"
      description="kira-kit create embeds four templates, each pre-wired with the registry, theme tokens, and the cn package."
    >
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium">Template</th>
                  <th className="py-2 text-left font-medium">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {templates.map((template) => (
                  <tr key={template.name}>
                    <td className="py-2 font-mono text-xs">{template.name}</td>
                    <td className="py-2 text-muted-foreground">
                      {template.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}

function TroubleshootingSection() {
  return (
    <Section
      title="Troubleshooting"
      description="The failures people actually hit, and how to recover from each."
    >
      <Accordion defaultValue={[]}>
        {troubleshooting.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <IconAlertCircle
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                {item.question}
              </span>
            </AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Section>
  );
}

function NextStepsCta() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-6">
      <p className="text-sm text-muted-foreground">
        Installed? Shape the look next, or learn the CLI in depth.
      </p>
      <div className="flex flex-wrap gap-2">
        <Link
          to="/docs/theming"
          className={cn(buttonVariants({ size: "sm" }), "gap-2")}
        >
          Theming
          <IconArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          to="/docs/cli"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-2",
          )}
        >
          CLI reference
          <IconArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function InstallationPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Installation"
        description="From zero to a rendered Kira Kit component in a few minutes. Every command below is copy-ready for your package manager."
      />

      <RequirementsSection />

      <QuickstartSection />

      <RegistryConfigSection />

      <FileTreeSection />

      <TemplatesSection />

      <TroubleshootingSection />

      <NextStepsCta />
    </ComponentPage>
  );
}
