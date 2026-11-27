import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import { IconCopy, IconFiles, IconCode } from "@tabler/icons-react";
import {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockActions,
  CodeBlockCopyButton,
  CodeBlockContent,
  KiraCodeBlock,
  type CodeBlockFile,
} from "@/components/ui/code-block";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

const example =
  // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
  'export type Guide = { id: string; title: string };\n\nexport async function loadGuide(id: string): Promise<Guide> {\n  const response = await fetch(`/api/guides/${id}`);\n  if (!response.ok) throw new Error("Guide unavailable");\n  return response.json();\n}';

function BasicDemo() {
  return <CodeBlock code={example} filename="guide.ts" language="typescript" />;
}

const basicCode =
  // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
  'import { CodeBlock } from "@/components/ui/code-block";\nconst code = "export type Guide = { id: string; title: string };\\n\\nexport async function loadGuide(id: string): Promise<Guide> {\\n  const response = await fetch(`/api/guides/${id}`);\\n  if (!response.ok) throw new Error(\\"Guide unavailable\\");\\n  return response.json();\\n}";\nexport function GuideSnippet() {\n  return <CodeBlock code={code} filename="guide.ts" language="typescript" />;\n}';

function FormattingDemo() {
  return (
    <div className="space-y-3">
      <CodeBlock
        code={
          // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
          'export const guide={title:"Alpine trail",distance:8.4,tags:["ridge","lake"]};export function distanceLabel(km:number){return `${km.toFixed(1)} km`; }'
        }
        filename="trail.ts"
        language="typescript"
      />
      <p className="text-sm text-muted-foreground">
        Formatted uses Prettier with two-space indentation and syntax colors.
        Source retains the original text. Copy follows the selected view.
      </p>
    </div>
  );
}

const formattingCode =
  'import { CodeBlock } from "@/components/ui/code-block";\nexport function TrailSnippet() {\n  return <CodeBlock code={\'export const guide={title:"Alpine trail",distance:8.4};\'} filename="trail.ts" language="typescript" formatCode syntaxHighlight />;\n}';

function TrailPreview() {
  const [saved, setSaved] = React.useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4">
      <div>
        <p className="font-medium">Alpine trail</p>
        <p className="mt-1 text-sm text-muted-foreground">
          8.4 km · Ridge and lake loop
        </p>
      </div>
      <Button
        variant={saved ? "secondary" : "default"}
        onClick={() => setSaved((value) => !value)}
        aria-pressed={saved}
      >
        {saved ? "Saved offline" : "Save trail"}
      </Button>
    </div>
  );
}

const trailSource =
  'import * as React from "react";import {Button} from "@/components/ui/button";export function TrailPreview(){const [saved,setSaved]=React.useState(false);return <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border p-4"><div><p className="font-medium">Alpine trail</p><p className="mt-1 text-sm text-muted-foreground">8.4 km · Ridge and lake loop</p></div><Button variant={saved?"secondary":"default"} onClick={()=>setSaved(value=>!value)} aria-pressed={saved}>{saved?"Saved offline":"Save trail"}</Button></div>; }';

function PreviewDemo() {
  return (
    <CodeBlock
      code={trailSource}
      language="tsx"
      filename="trail-preview.tsx"
      preview={<TrailPreview />}
    />
  );
}

const previewCode =
  'import { CodeBlock } from "@/components/ui/code-block";\nimport { TrailPreview } from "./trail-preview";\nexport function TrailExample({ source }: { source: string }) {\n  return <CodeBlock code={source} filename="trail-preview.tsx" language="tsx" preview={<TrailPreview />} />;\n}';

function PartsDemo() {
  return (
    <CodeBlock
      code="bun add @base-ui/react"
      language="shell"
      showLineNumbers={false}
      copyFeedback="toast"
    >
      <CodeBlockHeader>
        <CodeBlockTitle>Install Base UI</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton label="Copy install command" />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent className="max-h-64" />
    </CodeBlock>
  );
}

const partsCode =
  'import { CodeBlock, CodeBlockHeader, CodeBlockTitle, CodeBlockActions, CodeBlockCopyButton, CodeBlockContent } from "@/components/ui/code-block";\nexport function InstallCommand() {\n  return <CodeBlock code="bun add @base-ui/react" language="shell" showLineNumbers={false} copyFeedback="toast">\n    <CodeBlockHeader>\n      <CodeBlockTitle>Install Base UI</CodeBlockTitle>\n      <CodeBlockActions><CodeBlockCopyButton label="Copy install command" /></CodeBlockActions>\n    </CodeBlockHeader>\n    <CodeBlockContent className="max-h-64" />\n  </CodeBlock>;\n}';

function ClipboardDemo() {
  const [fail, setFail] = React.useState(true);
  const [copied, setCopied] = React.useState("");

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Local clipboard adapter: reject a copy, then allow it and inspect the
        captured value.
      </p>
      <Button
        variant="outline"
        size="sm"
        aria-pressed={!fail}
        onClick={() => setFail((value) => !value)}
      >
        {fail ? "Allow copy" : "Reject copy"}
      </Button>
      <CodeBlock
        code={example}
        filename="guide.ts"
        onCopy={async (value) => {
          await new Promise((resolve) => {
            setTimeout(resolve, 200);
          });

          if (fail) throw new Error("Clipboard rejected by fixture");
          setCopied(value);
        }}
      />
      <output className="block whitespace-pre-wrap wrap-anywhere rounded-md bg-muted p-3 text-xs">
        {copied ? `Captured copy:\n${copied}` : "No code copied yet."}
      </output>
    </div>
  );
}

const clipboardCode =
  // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
  'import * as React from "react";\nimport { CodeBlock } from "@/components/ui/code-block";\nconst code = "export type Guide = { id: string; title: string };\\n\\nexport async function loadGuide(id: string): Promise<Guide> {\\n  const response = await fetch(`/api/guides/${id}`);\\n  if (!response.ok) throw new Error(\\"Guide unavailable\\");\\n  return response.json();\\n}";\nexport function ClipboardAdapter() {\n  const [captured, setCaptured] = React.useState("");\n  return <div>\n    <CodeBlock code={code} filename="guide.ts" onCopy={async (value) => {\n      await navigator.clipboard.writeText(value);\n      setCaptured(value);\n    }} onCopyError={(error) => console.error(error.message)} />\n    <output>{captured}</output>\n  </div>;\n}';

function FormatsDemo() {
  return (
    <div className="space-y-4">
      <CodeBlock
        code={"$ bun add @base-ui/react\n$ bun run dev"}
        filename="Terminal commands"
        language="shell"
        copyFormat="shell"
        showLineNumbers={false}
      />
      <p className="text-sm text-muted-foreground">
        The displayed prompt stays visible; copying removes the leading $ from
        each command.
      </p>
    </div>
  );
}

const formatsCode =
  'import { CodeBlock } from "@/components/ui/code-block";\nexport function TerminalCommands() {\n  return <CodeBlock code={"$ bun add @base-ui/react\\n$ bun run dev"} filename="Terminal commands"\n    language="shell" copyFormat="shell" showLineNumbers={false} />;\n}';

function ChangesDemo() {
  return (
    <div className="space-y-3">
      <CodeBlock
        code={
          "export const retries = 1;\nexport const retries = 3;\nexport const timeout = 3000;"
        }
        filename="retry-policy.ts"
        language="typescript"
        startLine={20}
        removedLines={[20]}
        addedLines={[21]}
        highlightLines={[22]}
      />
      <p className="text-sm text-muted-foreground">
        − marks removal, + marks addition. Copy includes the new policy and
        omits the removed line.
      </p>
    </div>
  );
}

const changesCode =
  'import { CodeBlock } from "@/components/ui/code-block";\nexport function ChangeReview() {\n  return <CodeBlock\n    code={"export const retries = 1;\\nexport const retries = 3;\\nexport const timeout = 3000;"}\n    filename="retry-policy.ts" language="typescript" startLine={20}\n    removedLines={[20]} addedLines={[21]} highlightLines={[22]} />;\n}';

const files: CodeBlockFile[] = [
  {
    value: "guide",
    filename: "guide.ts",
    language: "typescript",
    code: example,
  },
  {
    value: "config",
    filename: "guide.config.json",
    language: "json",
    code: '{\n  "region": "alpine",\n  "offline": true\n}',
  },
  {
    value: "readme",
    filename: "README.md",
    language: "markdown",
    code: "# Alpine guide\n\nDownload the guide before leaving the trailhead.",
  },
];

function FilesDemo() {
  const [value, setValue] = React.useState("guide");

  return (
    <div className="space-y-3">
      <KiraCodeBlock files={files} value={value} onValueChange={setValue} />
      <p className="text-xs text-muted-foreground">
        Active file: {value}. Copy uses that file's content.
      </p>
    </div>
  );
}

const filesCode =
  // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
  'import * as React from "react";\nimport { KiraCodeBlock, type CodeBlockFile } from "@/components/ui/code-block";\nconst code = "export type Guide = { id: string; title: string };\\n\\nexport async function loadGuide(id: string): Promise<Guide> {\\n  const response = await fetch(`/api/guides/${id}`);\\n  if (!response.ok) throw new Error(\\"Guide unavailable\\");\\n  return response.json();\\n}";\nconst files: CodeBlockFile[] = [\n  { value: "guide", filename: "guide.ts", language: "typescript", code },\n  { value: "config", filename: "guide.config.json", language: "json", code: \'{ "region": "alpine", "offline": true }\' },\n];\nexport function GuideFiles() {\n  const [value, setValue] = React.useState("guide");\n  return <KiraCodeBlock files={files} value={value} onValueChange={setValue} />;\n}';

const fragments = [
  "export async function",
  " loadGuide(id: string)",
  " {\n",
  "  const response = await fetch(\n",
  // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
  "    `/api/guides/${id}`\n",
  "  );\n",
  "  if (!response.ok) {\n",
  '    throw new Error("Guide unavailable");\n',
  "  }\n",
  "  return response.json();\n",
  "}\n",
  "\n// Validate the guide before publishing.\n",
];

function StreamingDemo({ active }: { active: boolean }) {
  const [running, setRunning] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [version, setVersion] = React.useState(0);
  const index = React.useRef(0);
  React.useEffect(() => {
    if (!running || !active) return;

    const timer = setInterval(() => {
      const chunk = fragments[index.current];

      if (chunk === undefined) {
        setRunning(false);
        clearInterval(timer);

        return;
      }

      index.current += 1;
      setCode((value) => value + chunk);
    }, 300);

    return () => clearInterval(timer);
  }, [running, active, version]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            index.current = 0;
            setCode("");
            setVersion((value) => value + 1);
            setRunning(true);
          }}
        >
          Start local stream
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={!running}
          onClick={() => setRunning(false)}
        >
          Stop source
        </Button>
      </div>
      <CodeBlock
        code={code}
        filename="generated-guide.ts"
        language="typescript"
        height={220}
        streaming={running}
        followOutput
      />
      <p className="text-xs text-muted-foreground">
        Local fixture. Pause updates freezes the visible code while the source
        continues; copying uses that snapshot.
      </p>
    </div>
  );
}

const streamingCode =
  'import { CodeBlock } from "@/components/ui/code-block";\nexport function GeneratedCode({ code, receiving }: { code: string; receiving: boolean }) {\n  return <CodeBlock code={code} filename="generated-guide.ts" language="typescript"\n    height={220} streaming={receiving} followOutput />;\n}';

function EditorDemo() {
  const [code, setCode] = React.useState(example);
  const [advanced, setAdvanced] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(14);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          aria-pressed={advanced}
          onClick={() => setAdvanced((value) => !value)}
        >
          {advanced ? "Use plain editor" : "Use Monaco editor"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFontSize((value) => (value === 14 ? 18 : 14))}
        >
          Font size: {fontSize}
        </Button>
      </div>
      <CodeBlock
        code={code}
        onChange={setCode}
        editable
        editor={advanced ? "monaco" : "plain"}
        filename="editable-guide.ts"
        language="typescript"
        height={280}
        fontSize={fontSize}
        themeMode="system"
      />
      <p className="text-xs text-muted-foreground">
        Copy uses the edited buffer. Optional Monaco adds syntax and editing
        tools; its native fallback remains usable if loading fails.
      </p>
    </div>
  );
}

const editorCode =
  // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
  'import * as React from "react";\nimport { CodeBlock } from "@/components/ui/code-block";\nconst code = "export type Guide = { id: string; title: string };\\n\\nexport async function loadGuide(id: string): Promise<Guide> {\\n  const response = await fetch(`/api/guides/${id}`);\\n  if (!response.ok) throw new Error(\\"Guide unavailable\\");\\n  return response.json();\\n}";\nexport function EditableGuide() {\n  const [value, setValue] = React.useState(code);\n  return <CodeBlock code={value} onChange={setValue} editable editor="plain"\n    filename="editable-guide.ts" language="typescript" height={280} />;\n}';

function KiraDemo() {
  const [lastFile, setLastFile] = React.useState("");

  return (
    <div className="space-y-3">
      <KiraCodeBlock
        files={files}
        editable
        editor="plain"
        onFileChange={(value) => setLastFile(value)}
        height={240}
      />
      <p className="text-xs text-muted-foreground">
        {lastFile
          ? `Last edited file: ${lastFile}. Switch away and return to keep the draft.`
          : "Edit a file, switch tabs, then return to your draft."}
      </p>
    </div>
  );
}

const kiraCode =
  // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
  'import { KiraCodeBlock, type CodeBlockFile } from "@/components/ui/code-block";\nconst code = "export type Guide = { id: string; title: string };\\n\\nexport async function loadGuide(id: string): Promise<Guide> {\\n  const response = await fetch(`/api/guides/${id}`);\\n  if (!response.ok) throw new Error(\\"Guide unavailable\\");\\n  return response.json();\\n}";\nconst files: CodeBlockFile[] = [\n  { value: "guide", filename: "guide.ts", language: "typescript", code },\n  { value: "readme", filename: "README.md", language: "markdown", code: "# Alpine guide" },\n];\nexport function FileDrafts() {\n  return <KiraCodeBlock files={files} editable editor="plain" height={240} />;\n}';

const wrapModes: ("on" | "off" | "bounded")[] = ["on", "off", "bounded"];

function AppearanceDemo() {
  const [wrap, setWrap] = React.useState<"on" | "off" | "bounded">("on");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {wrapModes.map((value) => (
          <Button
            key={value}
            variant="outline"
            size="sm"
            aria-pressed={wrap === value}
            onClick={() => setWrap(value)}
          >
            Wrap: {value}
          </Button>
        ))}
      </div>
      <CodeBlock
        code={example}
        variant="light"
        filename="Surface variant"
        wordWrap={wrap}
        showLineNumbers={false}
      />
      <CodeBlock
        code={
          'const guideTitle = "A complete field guide for the international alpine expedition team with offline maps and route notes.";'
        }
        filename="Default surface"
        wordWrap={wrap}
      />
    </div>
  );
}

const appearanceCode =
  // oxlint-disable-next-line eslint/no-template-curly-in-string -- sample code kept as literal display text, so the placeholder must not interpolate
  'import { CodeBlock } from "@/components/ui/code-block";\nconst code = "export type Guide = { id: string; title: string };\\n\\nexport async function loadGuide(id: string): Promise<Guide> {\\n  const response = await fetch(`/api/guides/${id}`);\\n  if (!response.ok) throw new Error(\\"Guide unavailable\\");\\n  return response.json();\\n}";\nexport function CodeSurfaces() {\n  return <div>\n    <CodeBlock code={code} variant="light" filename="Surface variant" wordWrap="bounded" showLineNumbers={false} />\n    <CodeBlock code={code} filename="Default surface" wordWrap="off" />\n  </div>;\n}';

function StatesDemo() {
  return (
    <div className="space-y-4">
      <CodeBlock code="" filename="empty.ts" />
      <CodeBlock code="" filename="pending.ts" loading />
      <CodeBlock
        code="export const guide = 'read-only';"
        filename="Restricted file"
        editable
        editor="plain"
        disabled
        disabledReason="Editing requires maintainer access."
        height={130}
      />
      <CodeBlock
        code={
          'const reference = "' +
          "international-guide-日本語-ภาษาไทย-العربية-".repeat(8) +
          '";'
        }
        filename="Very-long-file-name-for-the-international-guide-and-offline-map-publication-workflow_日本語_ภาษาไทย.ts"
        wordWrap="off"
        height={150}
      />
    </div>
  );
}

const statesCode =
  'import { CodeBlock } from "@/components/ui/code-block";\nexport function CodeStates() {\n  return <div>\n    <CodeBlock code="" filename="empty.ts" />\n    <CodeBlock code="" filename="pending.ts" loading />\n    <CodeBlock code="export const guide = \'read-only\';" filename="Restricted file"\n      editable editor="plain" disabled disabledReason="Editing requires maintainer access." />\n  </div>;\n}';

const stressFiles: CodeBlockFile[] = [
  {
    value: "long",
    filename:
      "very-long-unbroken-international-guide-publication-pipeline-configuration.ts",
    language: "typescript",
    code: 'export const endpoint = "https://registry.example.com/v2/organizations/alpine-expeditions/guides/offline-route-manifest.json";',
  },
  {
    value: "empty",
    filename: "empty-snippet.ts",
    language: "typescript",
    code: "",
  },
];

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <KiraCodeBlock files={stressFiles} wordWrap="off" />
      <CodeBlock
        code="export const archived = true;"
        filename="archived-release-config-locked.ts"
        language="typescript"
        editable
        editor="plain"
        disabled
        disabledReason="Editing is locked for archived releases."
        height={120}
      />
    </div>
  );
}

const stressCode = `import { CodeBlock, KiraCodeBlock, type CodeBlockFile } from "@/components/ui/code-block";

const stressFiles: CodeBlockFile[] = [
  {
    value: "long",
    filename: "very-long-unbroken-international-guide-publication-pipeline-configuration.ts",
    language: "typescript",
    code: 'export const endpoint = "https://registry.example.com/v2/organizations/alpine-expeditions/guides/offline-route-manifest.json";',
  },
  { value: "empty", filename: "empty-snippet.ts", language: "typescript", code: "" },
];

export function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <KiraCodeBlock files={stressFiles} wordWrap="off" />
      <CodeBlock
        code="export const archived = true;"
        filename="archived-release-config-locked.ts"
        language="typescript"
        editable
        editor="plain"
        disabled
        disabledReason="Editing is locked for archived releases."
        height={120}
      />
    </div>
  );
}`;

const usageCode =
  'import {\n  CodeBlock, CodeBlockHeader, CodeBlockTitle, CodeBlockActions, CodeBlockCopyButton, CodeBlockContent,\n  CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger, CodeBlockTabsContent, KiraCodeBlock, codeBlockVariants,\n} from "@/components/ui/code-block";\nexport function CodeParts() {\n  return <div className="space-y-6">\n    <CodeBlock code="bun add @base-ui/react" language="shell" showLineNumbers={false}>\n      <CodeBlockHeader><CodeBlockTitle>Install</CodeBlockTitle><CodeBlockActions><CodeBlockCopyButton /></CodeBlockActions></CodeBlockHeader>\n      <CodeBlockContent />\n    </CodeBlock>\n    <CodeBlockTabs defaultValue="guide">\n      <CodeBlockTabsList aria-label="Code files"><CodeBlockTabsTrigger value="guide">guide.ts</CodeBlockTabsTrigger></CodeBlockTabsList>\n      <CodeBlockTabsContent value="guide"><CodeBlock code="export const guide = \'alpine\';" filename="guide.ts" /></CodeBlockTabsContent>\n    </CodeBlockTabs>\n    <KiraCodeBlock files={[{ value: "guide", filename: "guide.ts", code: "export const guide = \'alpine\';" }]} />\n  </div>;\n}\n// codeBlockVariants({ variant: "light" }) is exported.';

export default function CodeBlockPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Code Block"
        description="Composable snippets, clean copying, file drafts and reader-controlled streamed output."
        version="v3.1.0"
      />
      <FeatureGrid
        features={codeBlockPageFeatures}
        description="Syntax presentation, clipboard recovery and multi-file workflows built into Kira Kit."
      />
      <DemoTabs defaultValue="basic" tabs={codeBlockPageDemoTabs} />
      <KeyboardShortcuts
        shortcuts={codeBlockPageShortcuts}
        description="Keyboard navigation for copy actions, file tabs and scrollable code viewports."
      />
      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Use CodeBlock for single snippets, composable parts for custom headers, or KiraCodeBlock for tabbed file sets."
        notes={codeBlockPageUsageNotes}
      />
      <APIReference
        sections={codeBlockPageAPISections}
        description="Props, types and defaults for CodeBlock, composable sub-parts and KiraCodeBlock."
      />
      <Changelog
        entries={codeBlockPageChangelogEntries}
        title="Changelog"
        description="Version history for Code Block."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const monacoThemes =
  "'vitesse-dark' | 'vitesse-light' | 'github-dark' | 'github-dark-default' | 'github-light' | 'nord' | 'one-dark-pro' | 'dracula' | 'tokyo-night'";

const codeBlockPageFeatures = [
  {
    title: "Clean copying",
    description: "Current drafts, shell prompts, removals and recovery.",
    icon: <IconCopy aria-hidden="true" className="size-5" />,
  },
  {
    title: "File workflows",
    description: "Native tabs retain each file's draft.",
    icon: <IconFiles aria-hidden="true" className="size-5" />,
  },
  {
    title: "Formatted and colored",
    description: "Prettier, preserved source and interactive previews.",
    icon: <IconCode aria-hidden="true" className="size-5" />,
  },
  {
    title: "Streaming",
    description:
      "Only new text fades in; completed lines keep their syntax tokens.",
    icon: <IconCode aria-hidden="true" className="size-5" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const codeBlockPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper title="A native code snippet" code={basicCode}>
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "formatting",
    label: "Formatting",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Formatted code and preserved source"
        code={formattingCode}
      >
        <FormattingDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "preview",
    label: "Preview",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Interactive preview and implementation"
        code={previewCode}
      >
        <PreviewDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "parts",
    label: "Parts",
    group: "Core",
    demo: (
      <DemoWrapper title="Composable header and actions" code={partsCode}>
        <PartsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "appearance",
    label: "Appearance",
    group: "Core",
    demo: (
      <DemoWrapper title="Wrapping and semantic surfaces" code={appearanceCode}>
        <AppearanceDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "files",
    label: "Files",
    group: "KiraCodeBlock",
    demo: (
      <DemoWrapper title="Copy the active file" code={filesCode}>
        <FilesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    group: "KiraCodeBlock",
    demo: (
      <DemoWrapper title="Retained file drafts" code={kiraCode}>
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "clipboard",
    label: "Copy recovery",
    group: "Behavior",
    demo: (
      <DemoWrapper title="Copy failure and recovery" code={clipboardCode}>
        <ClipboardDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "formats",
    label: "Commands",
    group: "Behavior",
    demo: (
      <DemoWrapper title="Copy clean commands" code={formatsCode}>
        <FormatsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "changes",
    label: "Changes",
    group: "Behavior",
    demo: (
      <DemoWrapper title="Review line changes" code={changesCode}>
        <ChangesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "streaming",
    label: "Streaming",
    group: "Behavior",
    demo: (active: boolean) => (
      <DemoWrapper title="Reader-controlled output" code={streamingCode}>
        <StreamingDemo active={active} />
      </DemoWrapper>
    ),
  },
  {
    value: "editor",
    label: "Editor",
    group: "Behavior",
    demo: (
      <DemoWrapper title="Edit and copy the current buffer" code={editorCode}>
        <EditorDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Empty, loading and restricted files"
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long unbroken filenames, empty files, and disabled editor states inside a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const codeBlockPageShortcuts = [
  {
    keys: "Tab / Shift+Tab",
    description:
      "Reach copy, stream controls, file tabs and the native code viewport.",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate actions and focused file tabs; native buttons inherited from Base UI.",
  },
  {
    keys: "ArrowLeft / ArrowRight / Home / End",
    description:
      "Move between file, presentation and preview tabs; focus behavior inherited from Base UI.",
  },
  {
    keys: "ArrowUp / ArrowDown / PageUp / PageDown",
    description: "Scroll the focused native code viewport.",
  },
  {
    keys: "Ctrl+A / Ctrl+C",
    description:
      "Use native text selection/copy; editor copy includes current edits.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const codeBlockPageUsageNotes = [
  {
    label: "KiraCodeBlock",
    body: "Pass a files array for multi-file tabs with retained per-file drafts and active-file copying.",
  },
  {
    label: "Formatted vs. Source",
    body: "Read-only blocks default to Prettier-formatted Shiki output with a Source tab; set formatCode={false} and showViewTabs={false} for single-view raw text.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const codeBlockPageAPISections = [
  {
    title: "CodeBlock",
    props: [
      {
        prop: "code / language / filename",
        type: "string / string / string",
        default: "'' / 'tsx' / undefined",
        description: "Current buffer and contextual header.",
      },
      {
        prop: "formatCode / syntaxHighlight / showViewTabs",
        type: "boolean / boolean / boolean",
        default: "true / true / true",
        description:
          "Lazy Prettier, Shiki colors and Formatted/Source tabs. Formatting waits for stream completion and preserves annotated line coordinates; unsupported or invalid syntax stays readable.",
      },
      {
        prop: "preview",
        type: "ReactNode",
        default: "undefined",
        description:
          "Optional caller-rendered Preview/Code tabs. Code contains Formatted/Source tabs; preview state survives switching.",
      },
      {
        prop: "variant",
        type: "'default' | 'light'",
        default: "'default'",
        description: "Semantic kit surfaces in the app theme.",
      },
      {
        prop: "showLineNumbers / startLine",
        type: "boolean / number",
        default: "true / 1",
        description: "Displayed line numbers; never copied.",
      },
      {
        prop: "highlightLines / addedLines / removedLines",
        type: "number[] / number[] / number[]",
        default: "[] / [] / []",
        description:
          "Actual displayed line numbers. Removals are excluded from default copying.",
      },
      {
        prop: "copyValue / copyFormat",
        type: "string / 'raw' | 'shell'",
        default: "undefined / 'raw'",
        description: "Override clean copy or strip leading shell prompts.",
      },
      {
        prop: "showCopy / copyFeedback",
        type: "boolean / 'inline' | 'toast'",
        default: "true / 'inline'",
        description: "Inline check/status or shared Base UI toast.",
      },
      {
        prop: "onCopy / onCopyError",
        type: "(value: string) => void | Promise<void> / (error: Error) => void",
        default: "-",
        description: "Optional clipboard adapter and failure notification.",
      },
      {
        prop: "editable / readOnly / editor",
        type: "boolean / boolean / 'plain' | 'monaco'",
        default: "false / true / 'monaco'",
        description: "Either editable=true or readOnly=false enables editing.",
      },
      {
        prop: "onChange",
        type: "(value: string) => void",
        default: "-",
        description:
          "Current draft changes; prop synchronization does not echo user events.",
      },
      {
        prop: "height / fontSize / fontFamily",
        type: "string | number / number / string",
        default: "'auto' / 14 / 'var(--font-mono, ui-monospace, monospace)'",
        description:
          "Default renderer height capped at 480px; custom parts own their layout.",
      },
      {
        prop: "wordWrap",
        type: "'on' | 'off' | 'bounded'",
        default: "'on'",
        description: "Native bounded mode uses 80ch.",
      },
      {
        prop: "theme / lightTheme / darkTheme",
        type: monacoThemes,
        default: "undefined / 'github-light' / 'vitesse-dark'",
        description:
          "Optional Monaco palette. Explicit theme wins; Monaco themes are global to its instance.",
      },
      {
        prop: "themeMode / minimap",
        type: "'light' | 'dark' | 'system' / boolean",
        default: "'system' / false",
        description:
          "Read-only light/dark syntax colors and Monaco settings; system follows app and OS changes.",
      },
      {
        prop: "loading / streaming / followOutput",
        type: "boolean / boolean / boolean",
        default: "false / false / false",
        description:
          "Reserved loading, pausable displayed updates and opt-in following.",
      },
      {
        prop: "disabled / disabledReason",
        type: "boolean / string",
        default: "false",
        description: "Disable edit/copy with a visible explanation.",
      },
      {
        prop: "children / native props / ref / render",
        type: "ReactNode / useRender.ComponentProps<'div'>",
        default: "-",
        description: "Composable parts and native root forwarding.",
      },
    ],
  },
  {
    title: "CodeBlockHeader / CodeBlockActions",
    props: [
      {
        prop: "native props / ref",
        type: "React.ComponentProps<'div'>",
        default: "-",
        description: "Composable header and action group.",
      },
    ],
  },
  {
    title: "CodeBlockTitle",
    props: [
      {
        prop: "native props / ref",
        type: "React.ComponentProps<'span'>",
        default: "-",
        description: "A wrapping file title.",
      },
    ],
  },
  {
    title: "CodeBlockCopyButton",
    props: [
      {
        prop: "label",
        type: "string",
        default: "'Copy code'",
        description: "Accessible action name.",
      },
      {
        prop: "native props",
        type: "React.ComponentProps<typeof Button>",
        default: "-",
        description:
          "Uses the enclosing visible buffer with guarded async feedback.",
      },
    ],
  },
  {
    title: "CodeBlockContent",
    props: [
      {
        prop: "showLineNumbers",
        type: "boolean",
        default: "-",
        description:
          "Optional numbering override. Buffer, start line and changes come from CodeBlock so copying matches the display.",
      },
      {
        prop: "native props / ref",
        type: "React.ComponentProps<'pre'>",
        default: "-",
        description:
          "Native scrolling and focus; raw text is never a live stream announcement.",
      },
    ],
  },
  {
    title: "CodeBlockTabs",
    props: [
      {
        prop: "native props",
        type: "React.ComponentProps<typeof Tabs>",
        default: "-",
        description:
          "Base UI controlled/uncontrolled value and native root props.",
      },
    ],
  },
  {
    title: "CodeBlockTabsList",
    props: [
      {
        prop: "native props",
        type: "React.ComponentProps<typeof TabsList>",
        default: "-",
        description: "Shared scrollable underline list; label the file group.",
      },
    ],
  },
  {
    title: "CodeBlockTabsTrigger",
    props: [
      {
        prop: "value / native props",
        type: "string / React.ComponentProps<typeof TabsTrigger>",
        default: "-",
        description: "Native Base UI tab selection and focus.",
      },
    ],
  },
  {
    title: "CodeBlockTabsContent",
    props: [
      {
        prop: "value / native props",
        type: "string / React.ComponentProps<typeof TabsContent>",
        default: "-",
        description: "Retained panel with motion disabled by default.",
      },
    ],
  },
  {
    title: "KiraCodeBlock",
    props: [
      {
        prop: "files",
        type: "{ value: string; filename: string; code: string; language?: string; copyValue?: string; highlightLines?: number[]; addedLines?: number[]; removedLines?: number[] }[]",
        default: "-",
        description:
          "Unique file values; external source updates replace the previous source draft.",
      },
      {
        prop: "value / defaultValue / onValueChange",
        type: "string / string / (value: string) => void",
        default: "-",
        description: "Controlled or uncontrolled active file.",
      },
      {
        prop: "onFileChange",
        type: "(value: string, code: string) => void",
        default: "-",
        description: "Per-file edits, retained across tab selection.",
      },
      {
        prop: "code block props",
        type: "Omit<CodeBlockProps, 'children'>",
        default: "-",
        description:
          "Single-code mode or common per-file settings. render applies in single-code mode.",
      },
    ],
  },
  {
    title: "Variants",
    props: [
      {
        prop: "codeBlockVariants",
        type: "cva",
        default: "-",
        description: "Shared semantic surface styling.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const codeBlockPageChangelogEntries = [
  {
    version: "3.1.0",
    date: "15 November 2026",
    changes: [
      {
        type: "added",
        title: "Formatted / Source and Preview / Code",
        description:
          "Lazy Prettier with two-space indentation, light/dark Shiki syntax colors, retained original source, and optional caller-rendered previews. Copy follows the selected code view.",
      },
      {
        type: "fixed",
        title: "Code spacing and streaming motion",
        description:
          "Each row occupies one line, including blanks. New streamed text receives a bounded fade; completed lines retain their grammar state and tokens. Hidden content defers highlighting and formatting; reduced motion skips reveals.",
      },
      {
        type: "breaking",
        title: "Default presentation",
        description:
          "Read-only blocks now show Formatted/Source tabs and default to formatted code. Editable blocks default to Source. Use showViewTabs=false and formatCode=false for the prior single-view shape. Runtime registry dependencies include Prettier and Shiki.",
      },
    ],
  },
  {
    version: "3.0.0",
    date: "14 November 2026",
    changes: [
      {
        type: "added",
        title: "Composable code and file workflows",
        description:
          "Stock-shaped header/actions/content and Base UI tabs, per-file drafts and clean active-file copying. Audited on Base UI 1.9.0 and the October 2026 stock Code Block.",
      },
      {
        type: "added",
        title: "Change review and pausable output",
        description:
          "Labelled additions/removals, line highlights, command copying, paused stream snapshots and opt-in following.",
      },
      {
        type: "fixed",
        title: "Copying and editor lifecycle",
        description:
          "Copy current edits, recover clipboard failures, clear stale async feedback, defer hidden editors and update live options without recreating models.",
      },
      {
        type: "breaking",
        title: "Native read-only renderer",
        description:
          "Read-only snippets no longer mount Monaco or show TextMate syntax colors. Optional edit mode keeps Monaco; theme/minimap apply there. Header uses semantic tokens and removes window dots.",
      },
      {
        type: "breaking",
        title: "Theme and height defaults",
        description:
          "System theme is the default; explicit Monaco theme wins. Auto height is capped at 480px. editable=true and readOnly=false both enable editing.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
