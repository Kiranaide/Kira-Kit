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
import { CodeBlock } from "@/components/ui/code-block";
import { ComponentPage, PageHeader, Section } from "@/components/docs";

interface CommandDoc {
  name: string;
  summary: string;
  example: string;
  options: { flag: string; description: string }[];
}

const commands: CommandDoc[] = [
  {
    name: "init",
    summary:
      "Set up a project: writes components.json with the @kira-kit registry, installs the kit's base CSS and default theme, adds the base dependencies, and optionally applies a preset or custom theme. Requires React 19.2+.",
    example: `kira-kit init
kira-kit init --preset ember-press
kira-kit init --primary "#0B7F79"
kira-kit init --font inter --font-mono jetbrains-mono --icon lucide
kira-kit init --primary "#0B7F79" --base-color stone --yes`,
    options: [
      {
        flag: "--preset <name>",
        description: "Apply one of the 9 curated theme presets.",
      },
      {
        flag: "--primary <hex>",
        description: "Generate and apply a custom OKLCH theme.",
      },
      {
        flag: "--base-color <name>",
        description: "Neutral family for a generated custom theme.",
      },
      {
        flag: "--font <name>",
        description:
          "Sans font: geist, inter, manrope, plus-jakarta-sans, space-grotesk, dm-sans.",
      },
      {
        flag: "--font-mono <name>",
        description: "Mono font: geist-mono, jetbrains-mono, fira-code.",
      },
      {
        flag: "--icon <library>",
        description:
          "tabler (default) or lucide — lucide rewrites icon imports at install time.",
      },
      {
        flag: "--force",
        description: "Re-apply the theme even if one already exists.",
      },
      { flag: "-y, --yes", description: "Skip confirmation prompts." },
      {
        flag: "-c, --cwd <path>",
        description: "Run against a different project directory.",
      },
    ],
  },
  {
    name: "add [items...]",
    summary:
      "Add components, hooks, and lib modules from the registry. Transitive registry dependencies are resolved automatically and missing npm packages are installed with your detected package manager.",
    example: `kira-kit add button
kira-kit add button card dialog --overwrite
kira-kit add --all`,
    options: [
      {
        flag: "-o, --overwrite",
        description: "Overwrite existing local files.",
      },
      {
        flag: "-a, --all",
        description:
          "Add every component, hook, and lib item (themes and styles are excluded).",
      },
      {
        flag: "-p, --path <path>",
        description: "Target directory for the added files.",
      },
      {
        flag: "--dry-run",
        description: "Show what would be added without writing.",
      },
      { flag: "--diff", description: "Preview changes against local files." },
      {
        flag: "--view",
        description: "Print item contents instead of installing.",
      },
      { flag: "-y, --yes", description: "Skip confirmation prompts." },
      {
        flag: "-c, --cwd <path>",
        description: "Run against a different project directory.",
      },
    ],
  },
  {
    name: "list / view / search",
    summary:
      "Registry inspection. list enumerates items, view prints one item's contents, search filters by keyword.",
    example: `kira-kit list
kira-kit list --json
kira-kit view button
kira-kit search table --json`,
    options: [
      {
        flag: "--json",
        description: "Machine-readable output for scripting and agents.",
      },
      {
        flag: "-c, --cwd <path>",
        description: "Read registry settings from a different project.",
      },
    ],
  },
  {
    name: "theme",
    summary:
      "Generate an OKLCH palette from a primary color: light/dark schemes, chart hues, and APCA-verified contrast. Every token lands in the 4.5:1 (text) / 3:1 (UI) range. Also applies font and icon options on their own — no color change required.",
    example: `kira-kit theme --primary "#0B7F79"
kira-kit theme --primary "#0B7F79" --apply
kira-kit theme --primary "#0B7F79" --out my-theme.json
kira-kit theme --font manrope --font-mono fira-code --apply
kira-kit theme --icon lucide --apply`,
    options: [
      {
        flag: "--primary <hex>",
        description: "The seed color for the whole palette.",
      },
      {
        flag: "--base-color <name>",
        description:
          "neutral, stone, zinc, slate, gray, mauve, olive, mist, taupe.",
      },
      {
        flag: "--font <name>",
        description:
          "Sans font: geist, inter, manrope, plus-jakarta-sans, space-grotesk, dm-sans.",
      },
      {
        flag: "--font-mono <name>",
        description: "Mono font: geist-mono, jetbrains-mono, fira-code.",
      },
      {
        flag: "--icon <library>",
        description:
          "tabler or lucide — rewrites icon imports across project sources.",
      },
      {
        flag: "--out <file>",
        description: "Write the registry:theme JSON to a file.",
      },
      {
        flag: "--apply",
        description:
          "Install the generated theme and/or font/icon options into the project.",
      },
      {
        flag: "-c, --cwd <path>",
        description: "Run against a different project directory.",
      },
    ],
  },
  {
    name: "check [paths...]",
    summary:
      "Run the 13 parser-based quality checks over component sources (defaults to src/components/ui + src/hooks + src/lib). Errors fail the run; warnings are advisory unless --ci is passed.",
    example: `kira-kit check
kira-kit check --format github
kira-kit check --ci
kira-kit check src/components/ui/button.tsx`,
    options: [
      {
        flag: "--ci",
        description: "Strict mode: every finding, including warnings, fails.",
      },
      {
        flag: "--format <fmt>",
        description: "Output format: github (Actions annotations) or json.",
      },
    ],
  },
  {
    name: "create [dir]",
    summary:
      "Scaffold a new project pre-wired for Kira Kit: components.json with the @kira-kit registry, OKLCH theme tokens, the cn package, and a welcome component.",
    example: `kira-kit create my-app
kira-kit create my-app --template next --install --git`,
    options: [
      {
        flag: "--template <name>",
        description: "vite, next, tanstack-start, or monorepo.",
      },
      {
        flag: "--install",
        description: "Install dependencies after scaffolding.",
      },
      { flag: "--git", description: "Initialize a git repository." },
    ],
  },
  {
    name: "migrate",
    summary:
      "Migrate a legacy project: converts the legacy registryUrl field to the registries map, rewrites clsx/tailwind-merge imports to the cn package, and reports components that diverged from the published registry. Your component files are never overwritten.",
    example: `kira-kit migrate
kira-kit migrate --dry-run`,
    options: [
      {
        flag: "--dry-run",
        description: "Report what would change without writing.",
      },
      { flag: "-y, --yes", description: "Apply changes without prompting." },
      {
        flag: "-c, --cwd <path>",
        description: "Run against a different project directory.",
      },
    ],
  },
  {
    name: "build",
    summary:
      "Maintainers only: the full registry pipeline — quality checks, regenerate the theme presets, validate the import graph, build public/r/*.json and the JSON schemas, prune stale outputs, and generate llms.txt plus per-item markdown docs.",
    example: `kira-kit build
kira-kit build --skip-checks`,
    options: [
      {
        flag: "--skip-checks",
        description: "Skip the quality-check stage (not recommended).",
      },
    ],
  },
];

const checks = [
  {
    name: "imports-deps",
    catches:
      "Imports that are not declared in the item's registry dependencies.",
  },
  {
    name: "dead-animate",
    catches: "Animation utilities defined but never used.",
  },
  {
    name: "data-slot-cva",
    catches: "Missing data-slot attributes or unexported cva variants.",
  },
  {
    name: "reduced-motion",
    catches: "Motion that is not gated behind prefers-reduced-motion.",
  },
  { name: "target-size", catches: "Pointer targets smaller than 24×24px." },
  {
    name: "raw-colors",
    catches: "Raw hex/rgb colors instead of semantic tokens.",
  },
  {
    name: "layout-transitions",
    catches: "Transitions on layout properties (width, height, top, ...).",
  },
  {
    name: "arbitrary-values",
    catches: "Arbitrary Tailwind values outside the sanctioned exceptions.",
  },
  {
    name: "spacing-scale",
    catches:
      "Half-step spacing on heights, widths, gaps, and horizontal padding.",
  },
  {
    name: "registry-metadata",
    catches: "Registry items with missing or malformed metadata.",
  },
  {
    name: "base-ui-only",
    catches: "Radix or other non-Base-UI primitive imports.",
  },
  {
    name: "cn-source",
    catches: "clsx/tailwind-merge imports instead of the cn package.",
  },
  {
    name: "lib-resolution",
    catches: "Lib imports not covered by the item's transitive dependencies.",
  },
];

const suppressionCode = `// Line-level, with a required reason:
// kira-kit-ignore target-size: decorative icon, no pointer target needed

// Whole file:
/* kira-kit-ignore-file */`;

const ciCode = `# .github/workflows/ci.yml
- name: Quality checks
  run: npx kira-kit check --ci --format github`;

const exitCodes = [
  { code: "0", meaning: "Success" },
  { code: "1", meaning: "User error (bad input, validation failure)" },
  {
    code: "2",
    meaning: "Registry problem (invalid or malformed registry data)",
  },
  { code: "3", meaning: "Quality checks failed" },
];

function RunItSection() {
  return (
    <Section
      title="Run it"
      description="No global install needed — run it with npx, bunx, or pnpx. The CLI is self-contained; there is nothing else to install."
    >
      <CodeBlock
        code={`npx kira-kit --help\nnpx kira-kit init\nnpx kira-kit check`}
        language="bash"
        copyFormat="shell"
      />
    </Section>
  );
}

function CommandReferenceSection() {
  return (
    <Section
      title="Command reference"
      description="Eight command groups. Every example is copy-ready; options tables list the flags each command accepts."
    >
      <div className="space-y-6">
        {commands.map((command) => (
          <Card key={command.name}>
            <CardHeader>
              <CardTitle className="font-mono text-base">
                kira-kit {command.name}
              </CardTitle>
              <CardDescription>{command.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CodeBlock
                code={command.example}
                language="bash"
                copyFormat="shell"
              />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-medium">Option</th>
                      <th className="py-2 text-left font-medium">
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {command.options.map((option) => (
                      <tr key={option.flag}>
                        <td className="py-2 font-mono text-xs">
                          {option.flag}
                        </td>
                        <td className="py-2 text-muted-foreground">
                          {option.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function QualityChecksSection() {
  return (
    <Section
      title="Quality checks"
      description="Thirteen parser-based checks run over component sources. They encode the kit's constraints — Base UI only, cn package, spacing contract, reduced motion — so drift is caught before review."
    >
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium">Check</th>
                  <th className="py-2 text-left font-medium">
                    What it catches
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {checks.map((check) => (
                  <tr key={check.name}>
                    <td className="py-2 font-mono text-xs">{check.name}</td>
                    <td className="py-2 text-muted-foreground">
                      {check.catches}
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

function SuppressionSection() {
  return (
    <Section
      title="Suppressing a false positive"
      description="Suppressions require a reason — an unexplained suppression is itself an error, and unused suppressions are flagged. Keep them surgical."
    >
      <Card>
        <CardContent className="pt-6">
          <CodeBlock code={suppressionCode} language="tsx" />
        </CardContent>
      </Card>
    </Section>
  );
}

function ContinuousIntegrationSection() {
  return (
    <Section
      title="Continuous integration"
      description="--format github emits Actions annotations inline on the PR; --ci turns warnings into failures so nothing drifts silently."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">GitHub Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <CodeBlock code={ciCode} language="yaml" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exit codes</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left font-medium">Code</th>
                  <th className="py-2 text-left font-medium">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {exitCodes.map((entry) => (
                  <tr key={entry.code}>
                    <td className="py-2 font-mono text-xs">{entry.code}</td>
                    <td className="py-2 text-muted-foreground">
                      {entry.meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function InstallationBanner() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-muted/30 p-6">
      <p className="text-sm text-muted-foreground">
        New project? Start with the installation quickstart.
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

export default function CliPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="CLI"
        description="The kira-kit CLI is a self-contained registry client: install components, generate OKLCH themes, run quality checks, scaffold projects, and migrate legacy setups — no other CLI involved."
        version="v0.4.0"
        badge={<Badge variant="secondary">Node 22+</Badge>}
      />

      <RunItSection />

      <CommandReferenceSection />

      <QualityChecksSection />

      <SuppressionSection />

      <ContinuousIntegrationSection />

      <InstallationBanner />
    </ComponentPage>
  );
}
