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
  'export type Guide = { id: string; title: string };\n\nexport async function loadGuide(id: string): Promise<Guide> {\n  const response = await fetch(`/api/guides/${id}`);\n  if (!response.ok) throw new Error("Guide unavailable");\n  return response.json();\n}';

function BasicDemo() {
  return <CodeBlock code={example} filename="guide.ts" language="typescript" />;
}

function FormattingDemo() {
  return (
    <div className="space-y-3">
      <CodeBlock
        code={
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

const basicCode =
  'import { CodeBlock } from "@/components/ui/code-block";\nconst code = "export type Guide = { id: string; title: string };\\n\\nexport async function loadGuide(id: string): Promise<Guide> {\\n  const response = await fetch(`/api/guides/${id}`);\\n  if (!response.ok) throw new Error(\\"Guide unavailable\\");\\n  return response.json();\\n}";\nexport function GuideSnippet() {\n  return <CodeBlock code={code} filename="guide.ts" language="typescript" />;\n}';

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
          await new Promise((resolve) => setTimeout(resolve, 200));

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
  'import * as React from "react";\nimport { KiraCodeBlock, type CodeBlockFile } from "@/components/ui/code-block";\nconst code = "export type Guide = { id: string; title: string };\\n\\nexport async function loadGuide(id: string): Promise<Guide> {\\n  const response = await fetch(`/api/guides/${id}`);\\n  if (!response.ok) throw new Error(\\"Guide unavailable\\");\\n  return response.json();\\n}";\nconst files: CodeBlockFile[] = [\n  { value: "guide", filename: "guide.ts", language: "typescript", code },\n  { value: "config", filename: "guide.config.json", language: "json", code: \'{ "region": "alpine", "offline": true }\' },\n];\nexport function GuideFiles() {\n  const [value, setValue] = React.useState("guide");\n  return <KiraCodeBlock files={files} value={value} onValueChange={setValue} />;\n}';

const fragments = [
  "export async function",
  " loadGuide(id: string)",
  " {\n",
  "  const response = await fetch(\n",
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
  'import { KiraCodeBlock, type CodeBlockFile } from "@/components/ui/code-block";\nconst code = "export type Guide = { id: string; title: string };\\n\\nexport async function loadGuide(id: string): Promise<Guide> {\\n  const response = await fetch(`/api/guides/${id}`);\\n  if (!response.ok) throw new Error(\\"Guide unavailable\\");\\n  return response.json();\\n}";\nconst files: CodeBlockFile[] = [\n  { value: "guide", filename: "guide.ts", language: "typescript", code },\n  { value: "readme", filename: "README.md", language: "markdown", code: "# Alpine guide" },\n];\nexport function FileDrafts() {\n  return <KiraCodeBlock files={files} editable editor="plain" height={240} />;\n}';

function AppearanceDemo() {
  const [wrap, setWrap] = React.useState<"on" | "off" | "bounded">("on");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["on", "off", "bounded"] as const).map((value) => (
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

const tabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper title="A native code snippet" code={basicCode}>
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "formatting",
    label: "Formatting",
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
    demo: (
      <DemoWrapper title="Composable header and actions" code={partsCode}>
        <PartsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "clipboard",
    label: "Copy recovery",
    demo: (
      <DemoWrapper title="Copy failure and recovery" code={clipboardCode}>
        <ClipboardDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "formats",
    label: "Commands",
    demo: (
      <DemoWrapper title="Copy clean commands" code={formatsCode}>
        <FormatsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "changes",
    label: "Changes",
    demo: (
      <DemoWrapper title="Review line changes" code={changesCode}>
        <ChangesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "files",
    label: "Files",
    demo: (
      <DemoWrapper title="Copy the active file" code={filesCode}>
        <FilesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "streaming",
    label: "Streaming",
    demo: (active: boolean) => (
      <DemoWrapper title="Reader-controlled output" code={streamingCode}>
        <StreamingDemo active={active} />
      </DemoWrapper>
    ),
  },
  {
    value: "editor",
    label: "Editor",
    demo: (
      <DemoWrapper title="Edit and copy the current buffer" code={editorCode}>
        <EditorDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    demo: (
      <DemoWrapper title="Retained file drafts" code={kiraCode}>
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "appearance",
    label: "Appearance",
    demo: (
      <DemoWrapper title="Wrapping and semantic surfaces" code={appearanceCode}>
        <AppearanceDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper
        title="Empty, loading and restricted files"
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
] satisfies React.ComponentProps<typeof DemoTabs>["tabs"];

type APIRow = [string, string, string, string?];

function section(title: string, rows: APIRow[]) {
  return {
    title,
    props: rows.map(([prop, type, description, defaultValue]) => ({
      prop,
      type,
      description,
      default: defaultValue,
    })),
  };
}

const monacoThemes =
  "'vitesse-dark' | 'vitesse-light' | 'github-dark' | 'github-dark-default' | 'github-light' | 'nord' | 'one-dark-pro' | 'dracula' | 'tokyo-night'";

const api = [
  section("CodeBlock", [
    [
      "code / language / filename",
      "string / string / string",
      "Current buffer and contextual header.",
      "'' / 'tsx' / undefined",
    ],
    [
      "formatCode / syntaxHighlight / showViewTabs",
      "boolean / boolean / boolean",
      "Lazy Prettier, Shiki colors and Formatted/Source tabs. Formatting waits for stream completion and preserves annotated line coordinates; unsupported or invalid syntax stays readable.",
      "true / true / true",
    ],
    [
      "preview",
      "ReactNode",
      "Optional caller-rendered Preview/Code tabs. Code contains Formatted/Source tabs; preview state survives switching.",
      "undefined",
    ],
    [
      "variant",
      "'default' | 'light'",
      "Semantic kit surfaces in the app theme.",
      "'default'",
    ],
    [
      "showLineNumbers / startLine",
      "boolean / number",
      "Displayed line numbers; never copied.",
      "true / 1",
    ],
    [
      "highlightLines / addedLines / removedLines",
      "number[] / number[] / number[]",
      "Actual displayed line numbers. Removals are excluded from default copying.",
      "[] / [] / []",
    ],
    [
      "copyValue / copyFormat",
      "string / 'raw' | 'shell'",
      "Override clean copy or strip leading shell prompts.",
      "undefined / 'raw'",
    ],
    [
      "showCopy / copyFeedback",
      "boolean / 'inline' | 'toast'",
      "Inline check/status or shared Base UI toast.",
      "true / 'inline'",
    ],
    [
      "onCopy / onCopyError",
      "(value: string) => void | Promise<void> / (error: Error) => void",
      "Optional clipboard adapter and failure notification.",
    ],
    [
      "editable / readOnly / editor",
      "boolean / boolean / 'plain' | 'monaco'",
      "Either editable=true or readOnly=false enables editing.",
      "false / true / 'monaco'",
    ],
    [
      "onChange",
      "(value: string) => void",
      "Current draft changes; prop synchronization does not echo user events.",
    ],
    [
      "height / fontSize / fontFamily",
      "string | number / number / string",
      "Default renderer height capped at 480px; custom parts own their layout.",
      "'auto' / 14 / 'var(--font-mono, ui-monospace, monospace)'",
    ],
    [
      "wordWrap",
      "'on' | 'off' | 'bounded'",
      "Native bounded mode uses 80ch.",
      "'on'",
    ],
    [
      "theme / lightTheme / darkTheme",
      monacoThemes,
      "Optional Monaco palette. Explicit theme wins; Monaco themes are global to its instance.",
      "undefined / 'github-light' / 'vitesse-dark'",
    ],
    [
      "themeMode / minimap",
      "'light' | 'dark' | 'system' / boolean",
      "Read-only light/dark syntax colors and Monaco settings; system follows app and OS changes.",
      "'system' / false",
    ],
    [
      "loading / streaming / followOutput",
      "boolean / boolean / boolean",
      "Reserved loading, pausable displayed updates and opt-in following.",
      "false / false / false",
    ],
    [
      "disabled / disabledReason",
      "boolean / string",
      "Disable edit/copy with a visible explanation.",
      "false",
    ],
    [
      "children / native props / ref / render",
      "ReactNode / useRender.ComponentProps<'div'>",
      "Composable parts and native root forwarding.",
    ],
  ]),
  section("CodeBlockHeader / CodeBlockActions", [
    [
      "native props / ref",
      "React.ComponentProps<'div'>",
      "Composable header and action group.",
    ],
  ]),
  section("CodeBlockTitle", [
    [
      "native props / ref",
      "React.ComponentProps<'span'>",
      "A wrapping file title.",
    ],
  ]),
  section("CodeBlockCopyButton", [
    ["label", "string", "Accessible action name.", "'Copy code'"],
    [
      "native props",
      "React.ComponentProps<typeof Button>",
      "Uses the enclosing visible buffer with guarded async feedback.",
    ],
  ]),
  section("CodeBlockContent", [
    [
      "showLineNumbers",
      "boolean",
      "Optional numbering override. Buffer, start line and changes come from CodeBlock so copying matches the display.",
    ],
    [
      "native props / ref",
      "React.ComponentProps<'pre'>",
      "Native scrolling and focus; raw text is never a live stream announcement.",
    ],
  ]),
  section("CodeBlockTabs", [
    [
      "native props",
      "React.ComponentProps<typeof Tabs>",
      "Base UI controlled/uncontrolled value and native root props.",
    ],
  ]),
  section("CodeBlockTabsList", [
    [
      "native props",
      "React.ComponentProps<typeof TabsList>",
      "Shared scrollable underline list; label the file group.",
    ],
  ]),
  section("CodeBlockTabsTrigger", [
    [
      "value / native props",
      "string / React.ComponentProps<typeof TabsTrigger>",
      "Native Base UI tab selection and focus.",
    ],
  ]),
  section("CodeBlockTabsContent", [
    [
      "value / native props",
      "string / React.ComponentProps<typeof TabsContent>",
      "Retained panel with motion disabled by default.",
    ],
  ]),
  section("KiraCodeBlock", [
    [
      "files",
      "{ value: string; filename: string; code: string; language?: string; copyValue?: string; highlightLines?: number[]; addedLines?: number[]; removedLines?: number[] }[]",
      "Unique file values; external source updates replace the previous source draft.",
    ],
    [
      "value / defaultValue / onValueChange",
      "string / string / (value: string) => void",
      "Controlled or uncontrolled active file.",
    ],
    [
      "onFileChange",
      "(value: string, code: string) => void",
      "Per-file edits, retained across tab selection.",
    ],
    [
      "code block props",
      "Omit<CodeBlockProps, 'children'>",
      "Single-code mode or common per-file settings. render applies in single-code mode.",
    ],
  ]),
  section("Variants", [
    ["codeBlockVariants", "cva", "Shared semantic surface styling."],
  ]),
] satisfies React.ComponentProps<typeof APIReference>["sections"];

const usageCode =
  'import {\n  CodeBlock, CodeBlockHeader, CodeBlockTitle, CodeBlockActions, CodeBlockCopyButton, CodeBlockContent,\n  CodeBlockTabs, CodeBlockTabsList, CodeBlockTabsTrigger, CodeBlockTabsContent, KiraCodeBlock, codeBlockVariants,\n} from "@/components/ui/code-block";\nexport function CodeParts() {\n  return <div className="space-y-6">\n    <CodeBlock code="bun add @base-ui/react" language="shell" showLineNumbers={false}>\n      <CodeBlockHeader><CodeBlockTitle>Install</CodeBlockTitle><CodeBlockActions><CodeBlockCopyButton /></CodeBlockActions></CodeBlockHeader>\n      <CodeBlockContent />\n    </CodeBlock>\n    <CodeBlockTabs defaultValue="guide">\n      <CodeBlockTabsList aria-label="Code files"><CodeBlockTabsTrigger value="guide">guide.ts</CodeBlockTabsTrigger></CodeBlockTabsList>\n      <CodeBlockTabsContent value="guide"><CodeBlock code="export const guide = \'alpine\';" filename="guide.ts" /></CodeBlockTabsContent>\n    </CodeBlockTabs>\n    <KiraCodeBlock files={[{ value: "guide", filename: "guide.ts", code: "export const guide = \'alpine\';" }]} />\n  </div>;\n}\n// codeBlockVariants({ variant: "light" }) is exported.';

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function CodeBlockPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Code Block"
        description="Composable snippets, clean copying, file drafts and reader-controlled streamed output."
        version="3.1.0"
      />
      <FeatureGrid
        features={[
          {
            title: "Clean copying",
            description:
              "Current drafts, shell prompts, removals and recovery.",
            icon: <IconCopy className="size-5" />,
          },
          {
            title: "File workflows",
            description: "Native tabs retain each file's draft.",
            icon: <IconFiles className="size-5" />,
          },
          {
            title: "Formatted and colored",
            description: "Prettier, preserved source and interactive previews.",
            icon: <IconCode className="size-5" />,
          },
          {
            title: "Streaming",
            description:
              "Only new text fades in; completed lines keep their syntax tokens.",
            icon: <IconCode className="size-5" />,
          },
        ]}
      />
      <DemoTabs defaultValue="basic" tabs={tabs} />
      <KeyboardShortcuts
        shortcuts={[
          {
            keys: "Tab / Shift+Tab",
            description:
              "Reach copy, stream controls, file tabs and the native code viewport.",
          },
          {
            keys: "Enter / Space",
            description:
              "Activate actions; native buttons inherited from Base UI.",
          },
          {
            keys: "ArrowLeft / ArrowRight / Home / End",
            description:
              "Move between file, presentation and preview tabs; focus behavior inherited from Base UI.",
          },
          {
            keys: "Enter / Space",
            description: "Activate the focused file tab.",
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
        ]}
      />
      <UsageBlock code={usageCode} />
      <APIReference sections={api} />
      <Changelog
        entries={[
          {
            version: "3.1.0",
            date: "November 15, 2026",
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
            date: "November 14, 2026",
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
        ]}
      />
    </ComponentPage>
  );
}
