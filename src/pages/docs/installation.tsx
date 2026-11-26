import * as React from "react";
import { useGSAP } from "@gsap/react";
import {
  IconCheck,
  IconFolderCode,
  IconRocket,
  IconTerminal2,
} from "@tabler/icons-react";
import { cn } from "cn";
import gsap from "gsap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Code,
  DocCallout,
  DocChecklist,
  DocPage,
  DocSection,
  DocSteps,
  DocTable,
  pickedValue,
} from "@/components/docs/doc-page";
import { SegmentedInstallationGuide } from "@/components/docs/segmented-installation-guide";
import { prefersReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(useGSAP);

const packageManagers = ["npm", "bun", "pnpm", "yarn"] as const;

type PackageManager = (typeof packageManagers)[number];

/** How the CLI is invoked under each package manager. */
const runner: Record<PackageManager, string> = {
  npm: "npx",
  bun: "bunx",
  pnpm: "pnpm dlx",
  yarn: "yarn dlx",
};

/** Each manager's shorthand for the template's `dev` script. */
const devScript: Record<PackageManager, string> = {
  npm: "npm run dev",
  bun: "bun run dev",
  pnpm: "pnpm dev",
  yarn: "yarn dev",
};

const setupPaths = ["new", "existing"] as const;

type SetupPath = (typeof setupPaths)[number];

const pathCopy: Record<
  SetupPath,
  { label: string; badge: string; description: string }
> = {
  new: {
    label: "Create new project",
    badge: "Fastest",
    description:
      "Fresh React 19.2+ & Vite starter with Tailwind v4, tokens, and registry pre-configured.",
  },
  existing: {
    label: "Existing project",
    badge: "Auto-patched",
    description:
      "Run from any React 19.2+ app root. Detects Vite or Next.js and patches tsconfig & Tailwind v4.",
  },
};

const configuredRows: Record<
  SetupPath,
  readonly { title: string; description: string }[]
> = {
  new: [
    {
      title: "Tailwind CSS v4",
      description:
        "Tailwind CSS and @tailwindcss/vite are included. The global CSS imports Tailwind and defines Kira’s theme tokens.",
    },
    {
      title: "TypeScript paths",
      description: "tsconfig.json maps @/* to src/*.",
    },
    {
      title: "Vite resolution",
      description:
        "Vite resolves @ to src/ and already loads the React and Tailwind plugins.",
    },
    {
      title: "Kira registry & styles",
      description:
        "components.json, base CSS, and Kira utility styles are in place.",
    },
  ],
  existing: [
    {
      title: "Tailwind CSS v4",
      description:
        "Install missing Tailwind packages, register the Vite plugin, and ensure the app loads the global stylesheet.",
    },
    {
      title: "TypeScript paths",
      description:
        "Merge the @/* alias into the app’s active tsconfig so editor and type checker resolve the same imports.",
    },
    {
      title: "Vite resolution",
      description:
        "Match Vite’s resolve.alias to the TypeScript path and keep existing Vite plugins and settings.",
    },
    {
      title: "Kira registry & styles",
      description:
        "Update components.json and add Kira’s base styles while preserving existing theme CSS where possible.",
    },
  ],
};

const templates = [
  { name: "next", description: "Next.js App Router" },
  {
    name: "tanstack-start",
    description: "Full-stack TanStack Start with route transitions",
  },
  { name: "monorepo", description: "Separate app and shared UI packages" },
];

const troubleshooting = [
  {
    title: "Already using Tailwind v3?",
    description:
      "Upgrade to Tailwind v4 before using the kit’s CSS-first tokens.",
  },
  {
    title: "Already have a theme?",
    description: (
      <>
        Review the proposed CSS changes before replacing tokens or passing{" "}
        <Code>--force</Code>.
      </>
    ),
  },
];

function CommandBlock({
  command,
  runnerPrefix,
}: {
  command: string;
  runnerPrefix: string;
}) {
  return (
    <CodeBlock
      code={command.replace("{runner}", runnerPrefix)}
      language="bash"
      copyFormat="shell"
      showLineNumbers
    />
  );
}

const pathIcons: Record<SetupPath, React.ReactNode> = {
  new: <IconRocket className="size-4 shrink-0" aria-hidden />,
  existing: <IconFolderCode className="size-4 shrink-0" aria-hidden />,
};

function SetupPathOptionCard({
  option,
  selected,
  onSelect,
}: {
  option: SetupPath;
  selected: boolean;
  onSelect: () => void;
}) {
  const copy = pathCopy[option];

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col gap-2 rounded-xl border p-4 text-left transition-[background-color,border-color,box-shadow,transform] duration-150 active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:active:scale-100",
        selected
          ? "border-primary/60 bg-primary/[0.06] shadow-xs"
          : "border-border/80 bg-background/60 hover:border-border hover:bg-muted/35",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-lg border transition-colors duration-150",
              selected
                ? "border-primary/40 bg-primary/12 text-primary"
                : "border-border/80 bg-muted/60 text-muted-foreground group-hover:text-foreground",
            )}
          >
            {pathIcons[option]}
          </span>
          {copy.label}
        </span>

        <span className="flex items-center gap-1.5">
          <Badge
            variant={selected ? "secondary" : "outline"}
            size="sm"
            className="text-[11px]"
          >
            {copy.badge}
          </Badge>
          <span
            aria-hidden
            className={cn(
              "flex size-4 items-center justify-center rounded-full border transition-colors duration-150",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-transparent",
            )}
          >
            {selected && <IconCheck className="size-3" />}
          </span>
        </span>
      </div>

      <p className="text-xs leading-5 text-muted-foreground">
        {copy.description}
      </p>
    </button>
  );
}

function SetupPathPicker({
  path,
  onPathChange,
  pm,
  onPmChange,
}: {
  path: SetupPath;
  onPathChange: (next: SetupPath) => void;
  pm: PackageManager;
  onPmChange: (next: PackageManager) => void;
}) {
  return (
    <Card className="overflow-hidden border-border/80">
      <CardContent className="flex flex-col gap-5 pt-6">
        <fieldset
          aria-label="Setup path"
          className="grid grid-cols-1 gap-3 border-0 p-0 sm:grid-cols-2"
        >
          {setupPaths.map((option) => (
            <SetupPathOptionCard
              key={option}
              option={option}
              selected={path === option}
              onSelect={() => onPathChange(option)}
            />
          ))}
        </fieldset>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground">
              Package manager
            </span>
            <ToggleGroup
              aria-label="Package manager"
              variant="segment"
              radius="pill"
              size="sm"
              slidingIndicator
              semantics="current"
              className="w-fit"
              value={[pm]}
              onValueChange={(next) => {
                const picked = pickedValue(next, packageManagers);

                if (picked) onPmChange(picked);
              }}
            >
              {packageManagers.map((option) => (
                <ToggleGroupItem key={option} value={option}>
                  {option}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          <Badge
            variant="outline"
            icon={<IconTerminal2 className="size-3" aria-hidden />}
            className="font-mono text-[11px] text-muted-foreground"
          >
            Node.js 22+ · Bun 1.x
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

/** The step 3 block both paths end with: snippet, dev command, live result. */
function VerifySetup({ pm }: { pm: PackageManager }) {
  return (
    <DocSteps
      steps={[
        {
          number: 3,
          title: "Render Button",
          description:
            "Use the Button in a screen, then start your app with its dev script.",
          children: (
            <div className="flex flex-col gap-4">
              <CodeBlock
                code={`import { Button } from "@/components/ui/button";\n\nexport function Example() {\n  return <Button>Ship it</Button>;\n}`}
                language="tsx"
                showLineNumbers
              />
              <CommandBlock command={devScript[pm]} runnerPrefix={runner[pm]} />
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-border bg-muted/40 px-4 py-3">
                <Button>Ship it</Button>
                <span className="text-[13px] text-muted-foreground">
                  Expected result · Styled button
                </span>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}

function NewProjectSections({ cli }: { cli: string }) {
  return (
    <>
      <DocSection id="scaffold-your-app" title="Scaffold your app">
        <DocSteps
          steps={[
            {
              number: 1,
              title: "Create and enter your app",
              description:
                "The Vite starter already includes the Kira registry, base styles, and dependencies.",
              children: (
                <CommandBlock
                  command={`{runner} kira-kit create my-app --template vite --install\ncd my-app`}
                  runnerPrefix={cli}
                />
              ),
            },
          ]}
        />
      </DocSection>

      <DocSection
        id="what-comes-configured"
        title="What comes configured"
        description="The Vite template ships with the full setup. You can go straight to adding a component."
      >
        <DocChecklist items={configuredRows.new} />
      </DocSection>
    </>
  );
}

function ExistingProjectSections({ cli }: { cli: string }) {
  return (
    <>
      <DocSection id="initialize-kira-kit" title="Initialize Kira Kit">
        <DocSteps
          steps={[
            {
              number: 1,
              title: "Run init from your project root",
              description:
                "Detects Vite, Next.js, or PostCSS, configures Tailwind v4 and @/* aliases, installs missing base packages, and applies Phase Line.",
              children: (
                <CommandBlock
                  command="{runner} kira-kit init --preset phase-line"
                  runnerPrefix={cli}
                />
              ),
            },
          ]}
        />
        <DocCallout
          variant="info"
          title="Automatic runtime detection & safe patching"
        >
          <Code>kira-kit init</Code> automatically detects Vite, Next.js, or
          PostCSS, inserts <Code>@/*</Code> into your active{" "}
          <Code>tsconfig.json</Code> (preserving comments), and AST-patches{" "}
          <Code>vite.config.*</Code> or PostCSS for Tailwind CSS v4. If a custom
          config cannot be safely auto-edited, the CLI prints a targeted warning
          instead of overwriting it.
        </DocCallout>
      </DocSection>

      <DocSection
        id="what-init-configures"
        title="What init configures"
        description="Checked and patched automatically on existing React 19.2+ projects while preserving compatible settings."
      >
        <DocChecklist items={configuredRows.existing} />
      </DocSection>
    </>
  );
}

function OtherTemplatesSection() {
  return (
    <DocSection
      id="other-templates"
      title="Other templates"
      description="Choose the scaffold that matches your application architecture."
    >
      <DocTable
        columns={["Template", "Setup"]}
        rows={templates.map((template) => [
          <Code key={template.name}>{template.name}</Code>,
          template.description,
        ])}
        caption="Project templates"
      />
    </DocSection>
  );
}

function AppShellGuideSection({ cli }: { cli: string }) {
  return (
    <DocSection
      id="core-modules"
      title="ThemeProvider, Sidebar, Toast & RouteTransition"
      description="Install and configure each app-level module independently — or wire all four together in one root-to-shell stack."
    >
      <SegmentedInstallationGuide cli={cli} />
    </DocSection>
  );
}

function TroubleshootingSection() {
  return (
    <DocSection
      id="troubleshooting"
      title="Troubleshooting"
      description="If the button renders without styles, check the global CSS import and Tailwind integration. If @ imports fail, compare TypeScript paths and the bundler alias."
    >
      <DocChecklist items={troubleshooting} />
    </DocSection>
  );
}

export default function InstallationPage() {
  const [path, setPath] = React.useState<SetupPath>("new");
  const [pm, setPm] = React.useState<PackageManager>("npm");
  const pathBodyRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion() || !pathBodyRef.current) return;

      gsap.fromTo(
        pathBodyRef.current,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.24,
          ease: "power2.out",
          clearProps: "transform",
        },
      );
    },
    { dependencies: [path], scope: pathBodyRef },
  );

  const cli = runner[pm];

  return (
    <DocPage
      title="Installation"
      description="Get Tailwind, theme tokens, and your first Kira Kit component into a React project."
      previous={{ to: "/docs/introduction", label: "Introduction" }}
      next={{ to: "/docs/theming", label: "Theming" }}
    >
      <DocSection id="choose-a-setup-path" title="Choose a setup path">
        <SetupPathPicker
          path={path}
          onPathChange={setPath}
          pm={pm}
          onPmChange={setPm}
        />
      </DocSection>

      <div ref={pathBodyRef} className="flex flex-col gap-12">
        {path === "new" ? (
          <NewProjectSections cli={cli} />
        ) : (
          <ExistingProjectSections cli={cli} />
        )}
      </div>

      <DocSection id="add-a-component" title="Add a component">
        <DocSteps
          steps={[
            {
              number: 2,
              title: "Install Button",
              description:
                "The CLI copies the source and resolves registry dependencies.",
              children: (
                <CommandBlock
                  command="{runner} kira-kit add button"
                  runnerPrefix={cli}
                />
              ),
            },
          ]}
        />
      </DocSection>

      <DocSection id="verify-the-setup" title="Verify the setup">
        <VerifySetup pm={pm} />
      </DocSection>

      <AppShellGuideSection cli={cli} />

      {path === "new" ? <OtherTemplatesSection /> : <TroubleshootingSection />}
    </DocPage>
  );
}
