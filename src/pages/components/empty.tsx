import { useState, useRef, useId } from "react";
import { IconFolder } from "@tabler/icons-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyInbox,
  EmptySearch,
  EmptyFile,
  KiraEmpty,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function BasicDemo() {
  const [created, setCreated] = useState(false);

  return created ? (
    <output className="block text-sm">
      Project created. Your workspace is ready.
    </output>
  ) : (
    <Empty
      title="No projects yet"
      description="Create your first project to organize your team's work."
      action={
        <Button onClick={() => setCreated(true)}>Create a project</Button>
      }
    />
  );
}

const basicCode =
  'import { useState } from "react";\nimport { Empty } from "@/components/ui/empty";\nimport { Button } from "@/components/ui/button";\n\nexport function BasicDemo() {\n  const [created, setCreated] = useState(false);\n  return created ? <p role="status" className="text-sm">Project created. Your workspace is ready.</p> : <Empty title="No projects yet" description="Create your first project to organize your team\'s work." action={<Button onClick={() => setCreated(true)}>Create a project</Button>} />;\n}';

function PartsDemo() {
  const [imported, setImported] = useState(false);

  return (
    <Empty variant="outline">
      <EmptyMedia variant="icon" aria-hidden="true">
        <IconFolder />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle render={<h2>Bring your work together</h2>}>
          Bring your work together
        </EmptyTitle>
        <EmptyDescription>
          Import an existing project or start with an empty workspace.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button onClick={() => setImported(true)}>Import a project</Button>
      </EmptyContent>
      {imported && (
        <output className="block text-sm">Sample project imported.</output>
      )}
    </Empty>
  );
}

const partsCode =
  'import { IconFolder } from "@tabler/icons-react";\nimport { Empty, EmptyMedia, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty";\nimport { Button } from "@/components/ui/button";\nimport { useState } from "react";\n\nexport function PartsDemo() {\n  const [imported, setImported] = useState(false);\n  return <Empty variant="outline">\n    <EmptyMedia variant="icon" aria-hidden="true"><IconFolder /></EmptyMedia>\n    <EmptyHeader><EmptyTitle render={<h2 />}>Bring your work together</EmptyTitle><EmptyDescription>Import an existing project or start with an empty workspace.</EmptyDescription></EmptyHeader>\n    <EmptyContent><Button onClick={() => setImported(true)}>Import a project</Button></EmptyContent>\n    {imported && <p role="status" className="text-sm">Sample project imported.</p>}\n  </Empty>;\n}';

function LayoutsDemo() {
  return (
    <div className="space-y-4">
      <Empty
        layout="inline"
        size="sm"
        variant="muted"
        title="No unread messages"
        description="New conversations will appear here."
      />
      <Empty
        variant="outline"
        title="Nothing scheduled"
        description="Upcoming project milestones will appear in this calendar."
      />
    </div>
  );
}

const layoutsCode =
  'import { Empty } from "@/components/ui/empty";\n\nexport function LayoutsDemo() {\n  return <div className="space-y-4"><Empty layout="inline" size="sm" variant="muted" title="No unread messages" description="New conversations will appear here." /><Empty variant="outline" title="Nothing scheduled" description="Upcoming project milestones will appear in this calendar." /></div>;\n}';

function SizesDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Empty size="sm" title="No notes" description="Compact panel." />
      <Empty title="No projects" description="Workspace panel." />
      <Empty
        size="lg"
        title="No milestones"
        description="Prominent page state."
      />
    </div>
  );
}

const sizesCode =
  'import { Empty } from "@/components/ui/empty";\n\nexport function SizesDemo() {\n  return <div className="grid gap-4 md:grid-cols-3"><Empty size="sm" title="No notes" description="Compact panel." /><Empty title="No projects" description="Workspace panel." /><Empty size="lg" title="No milestones" description="Prominent page state." /></div>;\n}';

function PresetsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <EmptyInbox description="New messages will appear here." />
      <EmptySearch description="Try another phrase." />
      <EmptyFile description="Imported files will appear here." />
    </div>
  );
}

const presetsCode =
  'import { EmptyInbox, EmptySearch, EmptyFile } from "@/components/ui/empty";\n\nexport function PresetsDemo() {\n  return <div className="grid gap-4 md:grid-cols-3"><EmptyInbox description="New messages will appear here." /><EmptySearch description="Try another phrase." /><EmptyFile description="Imported files will appear here." /></div>;\n}';

function FirstUseDemo() {
  const [created, setCreated] = useState(false);

  return created ? (
    <output className="block text-sm">Atlas project created.</output>
  ) : (
    <KiraEmpty
      state="first-use"
      primaryAction={{
        label: "Create Atlas project",
        onClick: () => setCreated(true),
      }}
    />
  );
}

const firstuseCode =
  'import { useState } from "react";\nimport { KiraEmpty } from "@/components/ui/empty";\n\nexport function FirstUseDemo() {\n  const [created, setCreated] = useState(false);\n  return created ? <p role="status" className="text-sm">Atlas project created.</p> : <KiraEmpty state="first-use" primaryAction={{ label: "Create Atlas project", onClick: () => setCreated(true) }} />;\n}';

function NoResultsDemo() {
  const searchId = useId();
  const [query, setQuery] = useState("Archived launch");

  const results = ["Q4 product roadmap", "Customer onboarding guide"].filter(
    (value) => value.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="space-y-4">
      <label htmlFor={searchId} className="block space-y-2">
        <span className="text-sm font-medium">Search documents</span>
        <Input
          id={searchId}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
      {results.length ? (
        <ul className="list-inside list-disc text-sm">
          {results.map((value) => (
            <li key={value}>{value}</li>
          ))}
        </ul>
      ) : (
        <KiraEmpty
          state="no-results"
          query={query}
          primaryAction={{ label: "Clear search", onClick: () => setQuery("") }}
        />
      )}
    </div>
  );
}

const noresultsCode =
  'import { useState } from "react";\nimport { KiraEmpty } from "@/components/ui/empty";\nimport { Input } from "@/components/ui/input";\n\nexport function NoResultsDemo() {\n  const [query, setQuery] = useState("Archived launch");\n  const results = ["Q4 product roadmap", "Customer onboarding guide"].filter(value => value.toLowerCase().includes(query.toLowerCase()));\n  return <div className="space-y-4"><label className="block space-y-2"><span className="text-sm font-medium">Search documents</span><Input value={query} onChange={event => setQuery(event.target.value)} /></label>{results.length ? <ul className="list-inside list-disc text-sm">{results.map(value => <li key={value}>{value}</li>)}</ul> : <KiraEmpty state="no-results" query={query} primaryAction={{ label: "Clear search", onClick: () => setQuery("") }} />}</div>;\n}';

function RecoveryDemo() {
  const attempts = useRef(0);

  return (
    <KiraEmpty
      state="offline"
      primaryAction={{
        label: "Reconnect",
        pendingLabel: "Reconnecting…",
        successMessage:
          "Connection restored. Your content can be loaded again.",
        onClick: ({ signal }) =>
          new Promise((resolve, reject) => {
            attempts.current += 1;
            const attempt = attempts.current;

            const abort = () => {
              window.clearTimeout(timer);
              reject(new DOMException("Cancelled", "AbortError"));
            };

            const timer = window.setTimeout(() => {
              signal.removeEventListener("abort", abort);

              if (attempt === 1)
                reject(
                  new Error(
                    "Still offline. Check your connection and try Reconnect again.",
                  ),
                );
              else resolve();
            }, 700);

            signal.addEventListener("abort", abort, { once: true });
          }),
      }}
    />
  );
}

const recoveryCode =
  'import { useRef } from "react";\nimport { KiraEmpty } from "@/components/ui/empty";\n\nexport function RecoveryDemo() {\n  const attempts = useRef(0);\n  return <KiraEmpty state="offline" primaryAction={{ label: "Reconnect", pendingLabel: "Reconnecting…", successMessage: "Connection restored. Your content can be loaded again.", onClick: ({ signal }) => new Promise((resolve, reject) => {\n    attempts.current += 1;\n    const attempt = attempts.current;\n    const abort = () => { window.clearTimeout(timer); reject(new DOMException("Cancelled", "AbortError")); };\n    const timer = window.setTimeout(() => {\n      signal.removeEventListener("abort", abort);\n      if (attempt === 1) reject(new Error("Still offline. Check your connection and try Reconnect again."));\n      else resolve();\n    }, 700);\n    signal.addEventListener("abort", abort, { once: true });\n  }) }} />;\n}';

function KiraDemo() {
  return (
    <KiraEmpty
      state="forbidden"
      layout="inline"
      variant="outline"
      primaryAction={{
        label: "Request access",
        pendingLabel: "Sending request…",
        successMessage: "Access requested. A workspace owner will review it.",
        onClick: ({ signal }) =>
          new Promise((resolve, reject) => {
            const abort = () => {
              window.clearTimeout(timer);
              reject(new DOMException("Cancelled", "AbortError"));
            };

            const timer = window.setTimeout(() => {
              signal.removeEventListener("abort", abort);
              resolve();
            }, 600);

            signal.addEventListener("abort", abort, { once: true });
          }),
      }}
      secondaryAction={{
        label: "Copy owner email",
        successMessage: "Owner email copied.",
        onClick: async () => {
          await navigator.clipboard.writeText("owner@example.com");
        },
      }}
    />
  );
}

const kiraCode =
  'import { KiraEmpty } from "@/components/ui/empty";\n\nexport function KiraDemo() {\n  return <KiraEmpty state="forbidden" layout="inline" variant="outline" primaryAction={{ label: "Request access", pendingLabel: "Sending request…", successMessage: "Access requested. A workspace owner will review it.", onClick: ({ signal }) => new Promise((resolve, reject) => {\n    const abort = () => { window.clearTimeout(timer); reject(new DOMException("Cancelled", "AbortError")); };\n    const timer = window.setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 600);\n    signal.addEventListener("abort", abort, { once: true });\n  }) }} secondaryAction={{ label: "Copy owner email", successMessage: "Owner email copied.", onClick: async () => { await navigator.clipboard.writeText("owner@example.com"); } }} />;\n}';

function StatesDemo() {
  return (
    <div className="space-y-4">
      <KiraEmpty state="loading" size="sm" />
      <KiraEmpty state="complete" size="sm" />
      <KiraEmpty
        state="error"
        size="sm"
        primaryAction={{
          label: "Retry import",
          disabled: true,
          disabledReason: "Connect an import source before trying again.",
          onClick: () => {},
        }}
      />
      <Empty
        size="sm"
        variant="outline"
        icon={null}
        title="Release readiness — 日本語 العربية ไทย"
        description="A_very_long_unbroken_workspace_identifier_0123456789012345678901234567890123456789"
      />
    </div>
  );
}

const statesCode =
  'import { Empty, KiraEmpty } from "@/components/ui/empty";\n\nexport function StatesDemo() {\n  return <div className="space-y-4">\n    <KiraEmpty state="loading" size="sm" />\n    <KiraEmpty state="complete" size="sm" />\n    <KiraEmpty state="error" size="sm" primaryAction={{ label: "Retry import", disabled: true, disabledReason: "Connect an import source before trying again.", onClick: () => {} }} />\n    <Empty size="sm" variant="outline" icon={null} title="Release readiness — 日本語 العربية ไทย" description="A_very_long_unbroken_workspace_identifier_0123456789012345678901234567890123456789" />\n  </div>;\n}';

const usageCode =
  'import { useState } from "react";\nimport { IconFolder } from "@tabler/icons-react";\nimport { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent, EmptyInbox, EmptySearch, EmptyFile, KiraEmpty } from "@/components/ui/empty";\nimport { Button } from "@/components/ui/button";\n\nexport function EmptyUsage() {\n  const [created, setCreated] = useState(false);\n  return <div>\n    <Empty variant="outline"><EmptyMedia variant="icon" aria-hidden="true"><IconFolder /></EmptyMedia><EmptyHeader><EmptyTitle render={<h2 />}>No projects yet</EmptyTitle><EmptyDescription>Create your first project.</EmptyDescription></EmptyHeader><EmptyContent><Button onClick={() => setCreated(true)}>Create a project</Button></EmptyContent></Empty>\n    <KiraEmpty state={created ? "complete" : "first-use"} primaryAction={created ? undefined : { label: "Create a project", onClick: () => setCreated(true) }} />\n    <EmptyInbox /><EmptySearch /><EmptyFile />\n  </div>;\n}';

export default function EmptyPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Empty"
        description="Composable empty states that explain the situation and give people a useful next action."
        version="v2.0.0"
      />
      <FeatureGrid features={emptyPageFeatureGridFeatures} />
      <DemoTabs defaultValue="basic" tabs={emptyPageDemoTabsTabs} />
      <KeyboardShortcuts
        shortcuts={[
          {
            keys: "Tab / Shift+Tab",
            description:
              "Move between the caller's actions; button behavior is inherited from Base UI Button.",
          },
          {
            keys: "Enter / Space",
            description:
              "Run a focused action; inherited from Base UI Button. Pending actions reject duplicate submissions.",
          },
          {
            keys: "Ctrl / V",
            description:
              "Paste a search phrase in the No results demo; the input remains a native editing control.",
          },
        ]}
      />
      <UsageBlock
        code={usageCode}
        description="All exported Empty parts, presets and the Kira recovery component."
      />
      <APIReference sections={emptyPageAPIReferenceSections} />
      <Changelog
        entries={[
          {
            version: "v2.0.0",
            date: "2026-11-13",
            changes: [
              {
                type: "added",
                title: "Composable Empty parts",
                description:
                  "EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription and EmptyContent match the stock registry shape with native refs and Base UI render composition. Audited against Base UI 1.9.0.",
              },
              {
                type: "added",
                title: "KiraEmpty recovery",
                description:
                  "First use, no matches, errors, offline, access, completion and loading states with caller actions, cancellation, pending/error/success feedback and a single status region.",
              },
              {
                type: "breaking",
                title: "Children are composition",
                description:
                  "Empty.children now replaces the shorthand icon/title/description/action layout. Use EmptyContent to place custom actions. Native title attributes move to the render element because title now accepts ReactNode.",
              },
              {
                type: "fixed",
                title: "Honest actions and layout",
                description:
                  "Null media no longer leaves a gap. Labels wrap, presets forward refs, centered/inline layouts share parts, and all demo actions have local behavior.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}

const emptyPageFeatureGridFeatures = [
  {
    title: "Composable parts",
    description:
      "Custom media, heading levels, content and native render adapters.",
  },
  {
    title: "Contextual recovery",
    description: "Clear first-use, no-results, offline and access states.",
  },
  {
    title: "Async actions",
    description: "Pending, failure and success feedback with cancellation.",
  },
  {
    title: "Flexible layouts",
    description: "Centered and compact inline layouts on shared scales.",
  },
] satisfies React.ComponentProps<typeof FeatureGrid>["features"];

const emptyPageDemoTabsTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="An empty project"
        description="A clear next action leads to a real local state change."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "parts",
    label: "Parts",
    demo: (
      <DemoWrapper
        title="Composable parts"
        description="Choose the heading level and provide custom media without a duplicate preset layout."
        code={partsCode}
      >
        <PartsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "layouts",
    label: "Layouts",
    demo: (
      <DemoWrapper
        title="Centered and inline layouts"
        description="Compact panels and full-page states share the same parts."
        code={layoutsCode}
      >
        <LayoutsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    demo: (
      <DemoWrapper
        title="Size variants"
        description="Small, default, and large sizes use the shared spacing and typography scales."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "presets",
    label: "Presets",
    demo: (
      <DemoWrapper
        title="Existing presets"
        description="Inbox, search, and file shorthand now compose the same underlying parts."
        code={presetsCode}
      >
        <PresetsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "first-use",
    label: "First use",
    demo: (
      <DemoWrapper
        title="First use"
        description="A caller-owned action creates local content. No implicit network request is made."
        code={firstuseCode}
      >
        <FirstUseDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "no-results",
    label: "No results",
    demo: (
      <DemoWrapper
        title="No matches"
        description="A query is different from an empty workspace; clearing it restores local results."
        code={noresultsCode}
      >
        <NoResultsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "recovery",
    label: "Recovery",
    demo: (
      <DemoWrapper
        title="Failure and retry"
        description="Illustrative local delay: the first retry fails, the second succeeds. Both remain visible and accessible."
        code={recoveryCode}
      >
        <RecoveryDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    demo: (
      <DemoWrapper
        title="Contextual recovery"
        description="Caller-controlled access requests show pending and success feedback."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper
        title="Loading, completion, disability and stress cases"
        description="Loading reserves space. Long multilingual and unbroken labels wrap without hiding the next action."
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
] satisfies React.ComponentProps<typeof DemoTabs>["tabs"];

const emptyPageAPIReferenceSections = [
  {
    title: "Empty",
    props: [
      {
        prop: "icon",
        type: '"inbox" | "file" | "search" | "alert" | ReactNode',
        default: '"inbox"',
        description:
          "Preset or custom decorative media. null removes the media gap.",
      },
      {
        prop: "title / description / action",
        type: "ReactNode / ReactNode / ReactNode",
        default: '"No data" / — / —',
        description:
          "Shorthand heading, text and content. Native title attributes belong on a render element.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "—",
        description: "Composed children replace the shorthand presentation.",
      },
      {
        prop: "size / layout / variant",
        type: '"sm" | "default" | "lg" / "center" | "inline" / "default" | "outline" | "muted"',
        default: '"default" / "center" / "default"',
        description: "Spacing, alignment and surface variants.",
      },
      {
        prop: "render / ref / native props",
        type: 'useRender.ComponentProps<"div">',
        default: "—",
        description:
          "Base UI composition, DOM ref and attributes; event handlers merge.",
      },
    ],
  },
  {
    title: "EmptyHeader / EmptyContent",
    props: [
      {
        prop: "children / className / render / ref / native props",
        type: 'useRender.ComponentProps<"div">',
        default: "—",
        description: "Header grouping or wrapping action content.",
      },
    ],
  },
  {
    title: "EmptyMedia",
    props: [
      {
        prop: "variant",
        type: '"default" | "icon"',
        default: '"default"',
        description: "Large preset media or compact icon surface.",
      },
      {
        prop: "children / render / ref / native props",
        type: 'useRender.ComponentProps<"div">',
        default: "—",
        description:
          "Provide an accessible name for meaningful media; mark decorative media aria-hidden.",
      },
    ],
  },
  {
    title: "EmptyTitle",
    props: [
      {
        prop: "children / render / ref / native props",
        type: 'useRender.ComponentProps<"h3">',
        default: "—",
        description: "Default h3; render={<h2 />} changes the heading level.",
      },
    ],
  },
  {
    title: "EmptyDescription",
    props: [
      {
        prop: "children / render / ref / native props",
        type: 'useRender.ComponentProps<"p">',
        default: "—",
        description: "Wrapping supporting text.",
      },
    ],
  },
  {
    title: "EmptyInbox / EmptySearch / EmptyFile",
    props: [
      {
        prop: "Empty props (except icon)",
        type: 'Omit<EmptyProps, "icon">',
        default: "No messages / No results found / No files",
        description:
          "Shorthand presets sharing the same native/ref/render and layout options.",
      },
    ],
  },
  {
    title: "KiraEmpty",
    props: [
      {
        prop: "state",
        type: '"first-use" | "no-results" | "error" | "offline" | "forbidden" | "complete" | "loading"',
        default: '"first-use"',
        description:
          "Contextual text and media. Loading is distinct from absence of data.",
      },
      {
        prop: "query",
        type: "string",
        default: "—",
        description: "Included in the no-results description.",
      },
      {
        prop: "primaryAction / secondaryAction",
        type: "KiraEmptyAction",
        default: "—",
        description:
          "One main action and an optional outline secondary action.",
      },
      {
        prop: "action.label / onClick",
        type: "string / (context: { signal: AbortSignal }) => void | Promise<void>",
        default: "Required",
        description:
          "Caller-owned action with cancellation on state/action-label change or unmount, duplicate protection and visible failure feedback.",
      },
      {
        prop: "action.pendingLabel / successMessage",
        type: "string / string",
        default: "Working… / Done.",
        description:
          "Pending button text and the single contextual status message.",
      },
      {
        prop: "action.disabled / disabledReason",
        type: "boolean / string",
        default: "false / —",
        description: "Disabled control with a visible explanation.",
      },
      {
        prop: "Empty props / children",
        type: "EmptyProps (except action) / ReactNode",
        default: "Contextual defaults",
        description:
          "Override copy/media/layout and append content below actions. Composed Empty parts are available separately.",
      },
    ],
  },
] satisfies React.ComponentProps<typeof APIReference>["sections"];
