import { CodeBlock } from "@/components/ui/code-block";
import {
  Code,
  DocChecklist,
  DocPage,
  DocSection,
  DocTable,
  GuideLink,
} from "@/components/docs/doc-page";

const CLI_REFERENCE_URL = "https://www.npmjs.com/package/kira-kit";

const commands = [
  {
    command: "create [dir]",
    purpose: "Scaffold Vite, Next.js, TanStack Start, or a monorepo.",
  },
  {
    command: "init",
    purpose: "Set up the registry, base styles, and kit dependencies.",
  },
  {
    command: "add [items...]",
    purpose:
      "Install source files, transitive registry items, and missing packages.",
  },
  {
    command: "list / view / search",
    purpose: "Browse the registry, read an item, or filter by keyword.",
  },
  {
    command: "theme",
    purpose: "Generate and apply a palette, fonts, or icon options.",
  },
  {
    command: "check [paths...]",
    purpose: "Run source checks for component and registry quality.",
  },
  {
    command: "migrate",
    purpose: "Update legacy config and imports. Review a dry run first.",
  },
  {
    command: "build",
    purpose:
      "Validate and generate registry payloads and docs. For maintainers.",
  },
];

const addOptions = [
  {
    option: "--dry-run",
    behavior: "List the proposed install without writing files.",
  },
  { option: "--diff", behavior: "Compare your files with the registry." },
  { option: "--view", behavior: "Print the registry item." },
  {
    option: "--all",
    behavior: "Install components, hooks, and support modules.",
  },
  { option: "--path <path>", behavior: "Choose a target directory." },
];

const addFlags = [
  {
    title: "--overwrite",
    description: "Replace local copies when you choose to reinstall.",
  },
  {
    title: "--cwd <path>",
    description: "Target another workspace or project root.",
  },
  {
    title: "--yes",
    description: "Skip confirmation prompts. Review changes first.",
  },
];

const checkGroups = [
  {
    title: "Imports and dependencies",
    description:
      "Find missing registry dependencies and unresolved local support modules.",
  },
  {
    title: "Component contracts",
    description: "Check data-slot, variants, metadata, and spacing.",
  },
  {
    title: "Motion",
    description: "Find dead utilities and missing reduced-motion gates.",
  },
];

const exitCodes = [
  { code: "0", meaning: "Success" },
  { code: "1", meaning: "Invalid input or validation failure" },
  { code: "2", meaning: "Invalid registry data" },
  { code: "3", meaning: "Quality checks failed" },
];

function CommandCell({ children }: { children: string }) {
  return (
    <span className="inline-block whitespace-nowrap">
      <Code>{children}</Code>
    </span>
  );
}

function CommandsSection() {
  return (
    <DocSection id="command-reference" title="Command reference">
      <DocTable
        columns={["Command", "Purpose"]}
        rows={commands.map((entry) => [
          <CommandCell
            key={entry.command}
          >{`kira-kit ${entry.command}`}</CommandCell>,
          entry.purpose,
        ])}
        caption="Commands"
      />

      <p className="text-sm leading-6 text-muted-foreground">
        Use the options below to preview changes or control what gets installed.
      </p>

      <div className="flex flex-col gap-2">
        <p className="text-[15px] font-semibold text-foreground">
          <Code>kira-kit add</Code>
        </p>
        <DocTable
          columns={["Option", "Behavior"]}
          rows={addOptions.map((entry) => [
            <CommandCell key={entry.option}>{entry.option}</CommandCell>,
            entry.behavior,
          ])}
          caption="kira-kit add options"
        />
      </div>
    </DocSection>
  );
}

function PreviewSection() {
  return (
    <DocSection
      id="preview-a-change"
      title="Preview a change"
      description="Use a dry run for the install plan. Use a diff to compare your local files with the registry version."
    >
      <CodeBlock
        code={`npx kira-kit add button --dry-run
npx kira-kit add button --diff`}
        language="bash"
        copyFormat="shell"
        showLineNumbers
      />
      <DocChecklist items={addFlags} />
    </DocSection>
  );
}

function ChecksSection() {
  return (
    <DocSection
      id="quality-checks"
      title="Quality checks"
      description="Check the whole component surface or pass a path to focus the report."
    >
      <CodeBlock
        code={`npx kira-kit check
npx kira-kit check src/components/ui`}
        language="bash"
        copyFormat="shell"
        showLineNumbers
      />
      <DocChecklist items={checkGroups} />
      <p className="text-sm leading-6 text-muted-foreground">
        Thirteen checks run on every <Code>kira-kit build</Code>, so what fails
        locally is what would fail in release. See{" "}
        <GuideLink to="/docs/installation">Installation</GuideLink> for how a
        project gets its config first.
      </p>
    </DocSection>
  );
}

function CiSection() {
  return (
    <DocSection
      id="continuous-integration"
      title="Continuous integration"
      description="Strict mode fails on warnings. GitHub output formats findings as annotations."
    >
      <CodeBlock
        code="npx kira-kit check --ci --format github"
        language="bash"
        copyFormat="shell"
        showLineNumbers
      />

      <div className="flex flex-col gap-2">
        <p className="text-[17px] font-semibold text-foreground">Exit codes</p>
        <DocTable
          columns={["Code", "Meaning"]}
          rows={exitCodes.map((entry) => [
            <CommandCell key={entry.code}>{entry.code}</CommandCell>,
            entry.meaning,
          ])}
          caption="Exit codes"
        />
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        <Code>--ci</Code> is opt-in — the <Code>CI</Code> environment variable
        only silences prompts, it does not enable strict mode.{" "}
        <Code>--format</Code> also accepts <Code>pretty</Code> and{" "}
        <Code>json</Code>, with <Code>--json</Code> as the shorthand.{" "}
        <Code>kira-kit build</Code> runs the same checks in non-strict mode and
        takes neither flag; it has <Code>--skip-checks</Code> instead.
      </p>
    </DocSection>
  );
}

export default function CliPage() {
  return (
    <DocPage
      title="CLI"
      description="Create projects, install source files, inspect the registry, and run quality checks."
      previous={{ to: "/docs/transitions", label: "Transitions" }}
      next={{ to: "/docs/typeset", label: "Typeset" }}
    >
      <DocSection
        id="run-the-cli"
        title="Run the CLI"
        description="Use Node.js 22.12.0 or later, or Bun. Run the command from your project root."
      >
        <CodeBlock
          code="npx kira-kit --help"
          language="bash"
          copyFormat="shell"
          showLineNumbers
        />
        <p className="text-sm leading-6 text-muted-foreground">
          <Code>--help</Code> lists the commands and their flags.{" "}
          <a
            href={CLI_REFERENCE_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
          >
            The npm package README
          </a>{" "}
          includes command examples and describes what the CLI writes.
        </p>
      </DocSection>

      <CommandsSection />
      <PreviewSection />
      <ChecksSection />
      <CiSection />
    </DocPage>
  );
}
