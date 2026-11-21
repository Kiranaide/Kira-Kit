import * as React from "react";
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

const pathCopy: Record<SetupPath, { label: string; description: string }> = {
  new: {
    label: "Create new project",
    description:
      "Use this path for a fresh React + TypeScript app. The Vite template comes ready to run.",
  },
  existing: {
    label: "Existing project",
    description: "Use this path from the root of a React 19.2+ app.",
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
    <Card>
      <CardContent className="flex flex-col gap-5 pt-6">
        <ToggleGroup
          aria-label="Setup path"
          variant="segment"
          radius="pill"
          size="sm"
          semantics="current"
          value={[path]}
          onValueChange={(next) => {
            const picked = pickedValue(next, setupPaths);

            if (picked) onPathChange(picked);
          }}
        >
          {setupPaths.map((option) => (
            <ToggleGroupItem key={option} value={option}>
              {pathCopy[option].label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <p className="max-w-[560px] text-sm leading-6 text-muted-foreground">
          {pathCopy[path].description}
        </p>

        <div className="flex flex-col gap-2">
          <span className="text-[13px] text-muted-foreground">
            Package manager
          </span>
          <ToggleGroup
            aria-label="Package manager"
            variant="segment"
            size="sm"
            semantics="current"
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
          <p className="text-[13px] leading-5 text-muted-foreground">
            CLI runtime: Node.js 22+ or Bun 1.x.
          </p>
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
                "Initializes the registry, installs missing base packages, and applies Phase Line.",
              children: (
                <CommandBlock
                  command="{runner} kira-kit init --preset phase-line"
                  runnerPrefix={cli}
                />
              ),
            },
          ]}
        />
        <DocCallout title="Existing-project automation is proposed">
          Today, init installs base dependencies and handles Kira CSS and
          components.json. In an existing Vite app, configure the Tailwind
          plugin and matching <Code>@</Code> alias in TypeScript and Vite before
          adding components.
        </DocCallout>
      </DocSection>

      <DocSection
        id="what-init-would-configure"
        title="What init would configure"
        description="Proposed for existing Vite + TypeScript projects. The CLI would check each item, reuse compatible settings, and flag conflicting configuration."
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

      {path === "new" ? (
        <NewProjectSections cli={cli} />
      ) : (
        <ExistingProjectSections cli={cli} />
      )}

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

      {path === "new" ? <OtherTemplatesSection /> : <TroubleshootingSection />}
    </DocPage>
  );
}
