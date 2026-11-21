import {
  IconArrowRight,
  IconBook2,
  IconDownload,
  IconLayoutCards,
} from "@tabler/icons-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Code,
  DocChecklist,
  DocPage,
  DocPathCards,
  DocSection,
  DocSteps,
  GuideLink,
} from "@/components/docs/doc-page";

const paths = [
  {
    to: "/docs/installation",
    icon: IconDownload,
    title: "Install Kira Kit",
    description:
      "Create a new app or add the kit to an existing React project.",
  },
  {
    to: "/components/button",
    icon: IconLayoutCards,
    title: "Explore components",
    description:
      "Preview examples and copy the install command for what you need.",
  },
] as const;

const steps: readonly {
  title: string;
  description: string;
  code?: string;
}[] = [
  {
    title: "Connect the registry",
    description:
      "Kira Kit stores the registry address, aliases, and theme settings in components.json.",
  },
  {
    title: "Add the pieces you need",
    description: "The CLI resolves supporting files and packages for you.",
    code: "npx kira-kit add button card",
  },
  {
    title: "Edit the source",
    description:
      "Components, hooks, and support modules live in your project. Extend variants and update tokens as your product changes.",
  },
];

const whatYouGet = [
  {
    title: "Base UI primitives",
    description:
      "Keyboard interactions, focus management, and ARIA semantics come from the primitive layer.",
  },
  {
    title: "Semantic OKLCH tokens",
    description:
      "Apply a curated light/dark preset or generate a palette from your brand color.",
  },
  {
    title: "TypeScript and consistent sizing",
    description:
      "Typed props, exported variants, and a shared 4px spacing scale make components easier to extend.",
  },
] as const;

function AgentsSection() {
  return (
    <DocSection
      id="for-coding-agents"
      title="For coding agents"
      description="Use the registry index and per-item Markdown for install commands, exports, and examples."
    >
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4">
        <IconBook2
          aria-hidden="true"
          className="h-5 w-5 shrink-0 docs-accent"
        />
        <p className="min-w-0 flex-1 text-sm leading-6 text-muted-foreground">
          <Code>llms.txt</Code> lists every registry item and each item has its
          own Markdown page, so an agent can read, pick, and install without
          inventing props.
        </p>
        <a
          href="https://kira-kit.vercel.app/llms.txt"
          target="_blank"
          rel="noreferrer"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "min-h-11 shrink-0 gap-2 lg:min-h-9",
          )}
        >
          Read llms.txt
          <IconArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>

      <p className="max-w-[620px] text-sm leading-6 text-muted-foreground">
        The same index works as a starting point for people:{" "}
        <GuideLink to="/docs/theming">theming</GuideLink>,{" "}
        <GuideLink to="/docs/transitions">transitions</GuideLink>, and the{" "}
        <GuideLink to="/docs/cli">full CLI reference</GuideLink> are each a
        task-sized read.
      </p>
    </DocSection>
  );
}

export default function IntroductionPage() {
  return (
    <DocPage
      title="Introduction"
      crumb="Introduction"
      description="Kira Kit is a React source registry. Install accessible components and customize the code in your own project."
      next={{ to: "/docs/installation", label: "Installation" }}
    >
      <DocSection
        id="pick-your-path"
        title="Pick your path"
        description="Two ways in: a fresh scaffold, or the CLI pointed at a project you already have."
      >
        <DocPathCards paths={paths} />
      </DocSection>

      <DocSection
        id="from-registry-to-repo"
        title="From registry to repo"
        description="Choose a template or initialize your existing app, then install the pieces you need."
      >
        <DocSteps
          steps={steps.map((step) => ({
            ...step,
            children: step.code ? (
              <CodeBlock code={step.code} language="bash" showLineNumbers />
            ) : null,
          }))}
        />
      </DocSection>

      <DocSection
        id="what-you-get"
        title="What you get"
        description="Every item in the registry is held to the same three contracts."
      >
        <DocChecklist items={whatYouGet} />
      </DocSection>

      <AgentsSection />
    </DocPage>
  );
}
