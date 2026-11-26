import * as React from "react";
import {
  IconLayout,
  IconColumns,
  IconSpacingVertical,
  IconRefresh,
} from "@tabler/icons-react";

import { Stack, HStack, VStack, KiraStack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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
  const [saved, setSaved] = React.useState(false);

  return (
    <VStack
      as="form"
      gap={3}
      onSubmit={(event) => {
        event.preventDefault();
        setSaved(true);
      }}
      className="w-full max-w-md"
    >
      <label htmlFor="stack-basic-name" className="text-sm font-medium">
        Release name
      </label>
      <Input
        id="stack-basic-name"
        name="release"
        defaultValue="Autumn access update"
        onChange={() => setSaved(false)}
      />
      <HStack gap={2} align="center">
        <Button type="submit">Save draft</Button>
        <span className="text-sm text-muted-foreground">
          {saved ? "Local draft saved." : "Local example; no server request."}
        </span>
      </HStack>
    </VStack>
  );
}

const BasicDemoCode =
  'import * as React from "react";\nimport { HStack, VStack } from "@/components/ui/stack";\nimport { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\n\nexport function BasicDemo() {\n  const [saved, setSaved] = React.useState(false);\n  return <VStack as="form" gap={3} onSubmit={(event) => { event.preventDefault(); setSaved(true); }} className="w-full max-w-md">\n    <label htmlFor="stack-basic-name" className="text-sm font-medium">Release name</label>\n    <Input id="stack-basic-name" name="release" defaultValue="Autumn access update" onChange={() => setSaved(false)} />\n    <HStack gap={2} align="center">\n      <Button type="submit">Save draft</Button>\n      <span className="text-sm text-muted-foreground">{saved ? "Local draft saved." : "Local example; no server request."}</span>\n    </HStack>\n  </VStack>;\n}';

function ResponsiveDemo() {
  return (
    <Stack
      direction={{ base: "vertical", md: "horizontal" }}
      gap={{ base: 3, md: 6 }}
      align={{ base: "stretch", md: "baseline" }}
      className="w-full"
    >
      <section className="min-w-0 flex-1">
        <h3 className="text-lg font-semibold">Release owner</h3>
        <p className="text-sm text-muted-foreground">
          Amara Okafor, platform engineering
        </p>
      </section>
      <section className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold">Review window</h3>
        <p className="text-sm text-muted-foreground">October 26–30, 2026</p>
      </section>
      <section className="min-w-0 flex-1">
        <h3 className="text-sm font-semibold">Scope</h3>
        <p className="text-sm text-muted-foreground">
          Workspace invitations and external collaborators
        </p>
      </section>
    </Stack>
  );
}

const ResponsiveDemoCode =
  'import { Stack } from "@/components/ui/stack";\n\nexport function ResponsiveDemo() {\n  return <Stack direction={{ base: "vertical", md: "horizontal" }} gap={{ base: 3, md: 6 }} align={{ base: "stretch", md: "baseline" }} className="w-full">\n    <section className="min-w-0 flex-1"><h3 className="text-lg font-semibold">Release owner</h3><p className="text-sm text-muted-foreground">Amara Okafor, platform engineering</p></section>\n    <section className="min-w-0 flex-1"><h3 className="text-sm font-semibold">Review window</h3><p className="text-sm text-muted-foreground">October 26–30, 2026</p></section>\n    <section className="min-w-0 flex-1"><h3 className="text-sm font-semibold">Scope</h3><p className="text-sm text-muted-foreground">Workspace invitations and external collaborators</p></section>\n  </Stack>;\n}';

function WrapDemo() {
  const [selected, setSelected] = React.useState<string[]>(["Needs review"]);

  const filters = [
    "Needs review",
    "Assigned to me",
    "External collaborators",
    "Recently updated",
    "Archived",
  ];

  return (
    <VStack gap={3}>
      <HStack wrap gap={2} rowGap={3}>
        {filters.map((filter) => (
          <Button
            key={filter}
            variant="outline"
            aria-pressed={selected.includes(filter)}
            className="max-w-full whitespace-normal"
            onClick={() =>
              setSelected((current) =>
                current.includes(filter)
                  ? current.filter((value) => value !== filter)
                  : [...current, filter],
              )
            }
          >
            {filter}
          </Button>
        ))}
      </HStack>
      <output className="text-sm text-muted-foreground">
        {selected.length} filters active.
      </output>
    </VStack>
  );
}

const WrapDemoCode =
  'import * as React from "react";\nimport { HStack, VStack } from "@/components/ui/stack";\nimport { Button } from "@/components/ui/button";\n\nexport function WrapDemo() {\n  const [selected, setSelected] = React.useState<string[]>(["Needs review"]);\n  const filters = ["Needs review", "Assigned to me", "External collaborators", "Recently updated", "Archived"];\n  return <VStack gap={3}>\n    <HStack wrap gap={2} rowGap={3}>\n      {filters.map((filter) => <Button key={filter} variant="outline" aria-pressed={selected.includes(filter)}\n        className="max-w-full whitespace-normal" onClick={() => setSelected((current) => current.includes(filter) ? current.filter((value) => value !== filter) : [...current, filter])}>{filter}</Button>)}\n    </HStack>\n    <output className="text-sm text-muted-foreground">{selected.length} filters active.</output>\n  </VStack>;\n}';

function DividersDemo() {
  const [records, setRecords] = React.useState([
    { id: "amara", name: "Amara Okafor" },
    { id: "leo", name: "Leo Martín" },
    { id: "mei", name: "Mei Tanaka" },
  ]);

  return (
    <VStack gap={4} className="w-full max-w-lg">
      <Button
        variant="outline"
        className="self-start"
        onClick={() => setRecords((current) => [...current].reverse())}
      >
        Reverse reviewer order
      </Button>
      <VStack as="ul" dividers gap={2} aria-label="Reviewers">
        {records.map((record) => (
          <li key={record.id} data-reviewer={record.id} className="min-w-0">
            <label
              htmlFor={"stack-note-" + record.id}
              className="mb-2 block text-sm font-medium"
            >
              {record.name}
            </label>
            <Input
              id={"stack-note-" + record.id}
              defaultValue=""
              placeholder="Add a review note"
            />
          </li>
        ))}
      </VStack>
      <HStack dividers align="center" gap={2}>
        {0}
        <span>pending revisions</span>
      </HStack>
      <p className="text-sm text-muted-foreground">
        Type a note, then reverse the list. Each note follows its reviewer.
      </p>
    </VStack>
  );
}

const DividersDemoCode =
  'import * as React from "react";\nimport { HStack, VStack } from "@/components/ui/stack";\nimport { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\n\nexport function DividersDemo() {\n  const [records, setRecords] = React.useState([{ id: "amara", name: "Amara Okafor" }, { id: "leo", name: "Leo Martín" }, { id: "mei", name: "Mei Tanaka" }]);\n  return <VStack gap={4} className="w-full max-w-lg">\n    <Button variant="outline" className="self-start" onClick={() => setRecords((current) => [...current].reverse())}>Reverse reviewer order</Button>\n    <VStack as="ul" dividers gap={2} aria-label="Reviewers">\n      {records.map((record) => <li key={record.id} data-reviewer={record.id} className="min-w-0">\n        <label htmlFor={"stack-note-" + record.id} className="mb-2 block text-sm font-medium">{record.name}</label>\n        <Input id={"stack-note-" + record.id} defaultValue="" placeholder="Add a review note" />\n      </li>)}\n    </VStack>\n    <HStack dividers align="center" gap={2}>{0}<span>pending revisions</span></HStack>\n    <p className="text-sm text-muted-foreground">Type a note, then reverse the list. Each note follows its reviewer.</p>\n  </VStack>;\n}';

function SwitcherDemo() {
  const [narrow, setNarrow] = React.useState(false);
  const [extra, setExtra] = React.useState(false);
  const [action, setAction] = React.useState("Choose a local action.");

  const labels = [
    "Review changes",
    "Compare versions",
    "Download brief",
    "Share for review",
    ...(extra ? ["Archive draft"] : []),
  ];

  return (
    <VStack gap={4} className="w-full">
      <HStack wrap gap={2}>
        <Button variant="outline" onClick={() => setNarrow((value) => !value)}>
          {narrow ? "Use full width" : "Use narrow panel"}
        </Button>
        <Button variant="outline" onClick={() => setExtra((value) => !value)}>
          {extra ? "Remove fifth action" : "Add fifth action"}
        </Button>
      </HStack>
      <div className="max-w-full" style={{ width: narrow ? "20rem" : "100%" }}>
        <KiraStack threshold="32rem" limit={4} gap={2}>
          {labels.map((label) => (
            <Button
              key={label}
              variant="outline"
              className="whitespace-normal"
              onClick={() =>
                setAction(label + " selected in this local example.")
              }
            >
              {label}
            </Button>
          ))}
        </KiraStack>
      </div>
      <output className="text-sm text-muted-foreground">{action}</output>
    </VStack>
  );
}

const SwitcherDemoCode =
  'import * as React from "react";\nimport { HStack, VStack, KiraStack } from "@/components/ui/stack";\nimport { Button } from "@/components/ui/button";\n\nexport function SwitcherDemo() {\n  const [narrow, setNarrow] = React.useState(false);\n  const [extra, setExtra] = React.useState(false);\n  const [action, setAction] = React.useState("Choose a local action.");\n  const labels = ["Review changes", "Compare versions", "Download brief", "Share for review", ...(extra ? ["Archive draft"] : [])];\n  return <VStack gap={4} className="w-full">\n    <HStack wrap gap={2}><Button variant="outline" onClick={() => setNarrow((value) => !value)}>{narrow ? "Use full width" : "Use narrow panel"}</Button><Button variant="outline" onClick={() => setExtra((value) => !value)}>{extra ? "Remove fifth action" : "Add fifth action"}</Button></HStack>\n    <div className="max-w-full" style={{ width: narrow ? "20rem" : "100%" }}>\n      <KiraStack threshold="32rem" limit={4} gap={2}>\n        {labels.map((label) => <Button key={label} variant="outline" className="whitespace-normal" onClick={() => setAction(label + " selected in this local example.")}>{label}</Button>)}\n      </KiraStack>\n    </div>\n    <output className="text-sm text-muted-foreground">{action}</output>\n  </VStack>;\n}';

function RefreshingDemo() {
  const [loading, setLoading] = React.useState(false);

  return (
    <VStack gap={4} className="w-full max-w-lg">
      <HStack wrap gap={2}>
        <Button
          variant="outline"
          disabled={loading}
          onClick={() => setLoading(true)}
        >
          Start refresh
        </Button>
        <Button
          variant="outline"
          disabled={!loading}
          onClick={() => setLoading(false)}
        >
          Finish refresh
        </Button>
      </HStack>
      <KiraStack layout="vertical" gap={3}>
        {loading && (
          <output
            key="status"
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <Skeleton className="h-2 w-24" />
            <span>Refreshing reviewer details…</span>
          </output>
        )}
        <label
          key="label"
          htmlFor="stack-refresh-note"
          className="text-sm font-medium"
        >
          Draft review note
        </label>
        <Input
          key="note"
          id="stack-refresh-note"
          defaultValue="Keep external invite expiry at seven days."
        />
        <p key="hint" className="text-sm text-muted-foreground">
          {loading
            ? "Refreshing details. You can keep editing."
            : "Reviewer details are current."}
        </p>
      </KiraStack>
    </VStack>
  );
}

const RefreshingDemoCode =
  'import * as React from "react";\nimport { HStack, VStack, KiraStack } from "@/components/ui/stack";\nimport { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\nimport { Skeleton } from "@/components/ui/skeleton";\n\nexport function RefreshingDemo() {\n  const [loading, setLoading] = React.useState(false);\n  return <VStack gap={4} className="w-full max-w-lg">\n    <HStack wrap gap={2}><Button variant="outline" disabled={loading} onClick={() => setLoading(true)}>Start refresh</Button><Button variant="outline" disabled={!loading} onClick={() => setLoading(false)}>Finish refresh</Button></HStack>\n    <KiraStack layout="vertical" gap={3}>\n      {loading && <output key="status" className="flex items-center gap-2 text-xs text-muted-foreground"><Skeleton className="h-2 w-24" /><span>Refreshing reviewer details…</span></output>}\n      <label key="label" htmlFor="stack-refresh-note" className="text-sm font-medium">Draft review note</label>\n      <Input key="note" id="stack-refresh-note" defaultValue="Keep external invite expiry at seven days." />\n      <p key="hint" className="text-sm text-muted-foreground">{loading ? "Refreshing details. You can keep editing." : "Reviewer details are current."}</p>\n    </KiraStack>\n  </VStack>;\n}';

function NativeDemo() {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [message, setMessage] = React.useState("Native form adapter.");

  return (
    <VStack gap={3} className="w-full max-w-md">
      <Stack
        as="form"
        ref={formRef}
        render={<form aria-label="Release lookup" />}
        gap={3}
        onSubmit={(event) => {
          event.preventDefault();
          setMessage(
            "Submitted " +
              String(new FormData(event.currentTarget).get("release")),
          );
        }}
      >
        <label htmlFor="stack-native-release" className="text-sm font-medium">
          Release identifier
        </label>
        <Input
          id="stack-native-release"
          name="release"
          defaultValue="access-2026-10"
          required
        />
        <Button type="submit">Look up release</Button>
      </Stack>
      <Button
        variant="outline"
        onClick={() => formRef.current?.requestSubmit()}
      >
        Submit through native ref
      </Button>
      <output className="text-sm text-muted-foreground">{message}</output>
    </VStack>
  );
}

const NativeDemoCode =
  'import * as React from "react";\nimport { Stack, VStack } from "@/components/ui/stack";\nimport { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\n\nexport function NativeDemo() {\n  const formRef = React.useRef<HTMLFormElement>(null);\n  const [message, setMessage] = React.useState("Native form adapter.");\n  return <VStack gap={3} className="w-full max-w-md">\n    <Stack as="form" ref={formRef} render={<form aria-label="Release lookup" />} gap={3}\n      onSubmit={(event) => { event.preventDefault(); setMessage("Submitted " + String(new FormData(event.currentTarget).get("release"))); }}>\n      <label htmlFor="stack-native-release" className="text-sm font-medium">Release identifier</label>\n      <Input id="stack-native-release" name="release" defaultValue="access-2026-10" required />\n      <Button type="submit">Look up release</Button>\n    </Stack>\n    <Button variant="outline" onClick={() => formRef.current?.requestSubmit()}>Submit through native ref</Button>\n    <output className="text-sm text-muted-foreground">{message}</output>\n  </VStack>;\n}';

function StatesDemo() {
  const [loading, setLoading] = React.useState(true);

  return (
    <VStack gap={4} className="w-full max-w-80">
      <Stack as="fieldset" disabled gap={2}>
        <legend className="text-sm font-medium">Approval settings</legend>
        <Input
          aria-label="Approval owner"
          defaultValue="Owner permission required"
        />
        <p className="text-sm text-muted-foreground">
          Only release owners can change these settings.
        </p>
      </Stack>
      <VStack as="ul" aria-label="Empty review queue" gap={0} />
      <Button variant="outline" onClick={() => setLoading((value) => !value)}>
        {loading ? "Show empty state" : "Show initial loading"}
      </Button>
      <KiraStack layout="vertical">
        {loading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <p className="text-sm text-muted-foreground">
            No reviews in this queue.
          </p>
        )}
      </KiraStack>
      <HStack gap={2} align="start">
        <span className="min-w-0">
          release-platform-external-collaborators-with-a-very-long-unbroken-identifier
        </span>
        <span className="shrink-0 text-sm">Ready</span>
      </HStack>
    </VStack>
  );
}

const StatesDemoCode =
  'import * as React from "react";\nimport { Stack, HStack, VStack, KiraStack } from "@/components/ui/stack";\nimport { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\nimport { Skeleton } from "@/components/ui/skeleton";\n\nexport function StatesDemo() {\n  const [loading, setLoading] = React.useState(true);\n  return <VStack gap={4} className="w-full max-w-80">\n    <Stack as="fieldset" disabled gap={2}><legend className="text-sm font-medium">Approval settings</legend><Input aria-label="Approval owner" defaultValue="Owner permission required" /><p className="text-sm text-muted-foreground">Only release owners can change these settings.</p></Stack>\n    <VStack as="ul" aria-label="Empty review queue" gap={0} />\n    <Button variant="outline" onClick={() => setLoading((value) => !value)}>{loading ? "Show empty state" : "Show initial loading"}</Button>\n    <KiraStack layout="vertical">{loading ? <Skeleton className="h-24 w-full" /> : <p className="text-sm text-muted-foreground">No reviews in this queue.</p>}</KiraStack>\n    <HStack gap={2} align="start"><span className="min-w-0">release-platform-external-collaborators-with-a-very-long-unbroken-identifier</span><span className="shrink-0 text-sm">Ready</span></HStack>\n  </VStack>;\n}';

const demos = [
  {
    value: "basic",
    label: "Basic",
    description: "A native release form using vertical and horizontal stacks.",
    Demo: BasicDemo,
    code: BasicDemoCode,
  },
  {
    value: "responsive",
    label: "Responsive",
    description:
      "Viewport direction, gap and baseline alignment preserve reading order.",
    Demo: ResponsiveDemo,
    code: ResponsiveDemoCode,
  },
  {
    value: "wrap",
    label: "Wrap",
    description: "Filter controls wrap before their labels need to shrink.",
    Demo: WrapDemo,
    code: WrapDemoCode,
  },
  {
    value: "dividers",
    label: "Dividers",
    description: "Keyed editable reviewers and decorative list-safe rules.",
    Demo: DividersDemo,
    code: DividersDemoCode,
  },
  {
    value: "kira",
    label: "Kira",
    description:
      "Actions switch between one row and one column at the local width.",
    Demo: SwitcherDemo,
    code: SwitcherDemoCode,
  },
  {
    value: "refreshing",
    label: "Refreshing",
    description:
      "Supplied content stays mounted and editable during a caller-owned refresh.",
    Demo: RefreshingDemo,
    code: RefreshingDemoCode,
  },
  {
    value: "native",
    label: "Native",
    description: "Native form attributes, render adapter and a typed ref.",
    Demo: NativeDemo,
    code: NativeDemoCode,
  },
  {
    value: "states",
    label: "States",
    description:
      "Initial loading, empty queue, disabled reason and long identifiers.",
    Demo: StatesDemo,
    code: StatesDemoCode,
  },
];

const stackApi = [
  {
    prop: "as / render / ref",
    type: "StackElement / useRender.RenderProp / native element ref",
    default: '"div"',
    description:
      "Native tag-specific attributes and composed Base UI rendering; custom list adapters should also supply as.",
  },
  {
    prop: "direction",
    type: 'LayoutResponsiveValue<"vertical" | "horizontal">',
    default: '"vertical"',
    description: "Scalar or mobile-first base, sm, md, lg, xl and 2xl values.",
  },
  {
    prop: "gap / rowGap / columnGap",
    type: "LayoutResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24>",
    default: "gap: 4",
    description:
      "Existing spacing tokens. Row/column gaps override the matching physical gap.",
  },
  {
    prop: "align",
    type: 'LayoutResponsiveValue<"start" | "end" | "center" | "baseline" | "stretch">',
    description: "Cross-axis alignment.",
  },
  {
    prop: "justify",
    type: 'LayoutResponsiveValue<"start" | "end" | "center" | "between" | "around" | "evenly">',
    description: "Main-axis distribution.",
  },
  {
    prop: "wrap",
    type: "LayoutResponsiveValue<boolean>",
    default: "false",
    description:
      "Allow flex items to wrap. Wrapping and rules are independent; use wrap without dividers for multi-line controls.",
  },
  {
    prop: "inline",
    type: "boolean",
    default: "false",
    description: "Inline flex display.",
  },
  {
    prop: "dividers / dividerElement",
    type: "boolean / React.ReactNode",
    default: "false / shared Separator",
    description:
      "Decorative rules between direct child groups. Key direct collection children; fragments remain groups. Lists receive hidden presentation li adapters.",
  },
];

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function StackPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Stack"
        description="Semantic rows and columns for forms, reviewer lists, and actions that adapt to their available space."
        version="2.0.0"
      />
      <FeatureGrid
        features={[
          {
            title: "Responsive layout",
            description:
              "Direction, alignment and independent row/column gaps.",
            icon: <IconLayout className="size-5" />,
          },
          {
            title: "Local-width actions",
            description: "KiraStack switches from one row to one column.",
            icon: <IconColumns className="size-5" />,
          },
          {
            title: "Stable divided lists",
            description:
              "Editable keyed rows keep their identity when reordered.",
            icon: <IconSpacingVertical className="size-5" />,
          },
          {
            title: "Retained refresh",
            description: "Caller-owned busy state preserves supplied content.",
            icon: <IconRefresh className="size-5" />,
          },
        ]}
      />
      <DemoTabs
        defaultValue="basic"
        tabs={demos.map(({ value, label, description, Demo, code }) => ({
          value,
          label,
          demo: (
            <DemoWrapper title={label} description={description} code={code}>
              <Demo />
            </DemoWrapper>
          ),
        }))}
      />
      <KeyboardShortcuts
        description="Layout wrappers add no keyboard handlers or tab stops."
        shortcuts={[
          {
            keys: "Tab / Shift + Tab",
            description:
              "Follow native child controls in DOM order, including after responsive layout changes.",
          },
          {
            keys: "Enter",
            description:
              "Submit the Basic and Native forms. The form behavior belongs to native HTML.",
          },
          {
            keys: "Enter / Space",
            description:
              "Activate filter, width, reorder and refresh controls through the shared Base UI Button.",
          },
          {
            keys: "Type, then reorder",
            description:
              "In Dividers, type a note and reverse the reviewers; the note follows its keyed row.",
          },
        ]}
      />
      <UsageBlock
        code={
          'import { Stack, HStack, VStack, KiraStack } from "@/components/ui/stack";\nimport { Button } from "@/components/ui/button";\nimport { stackVariants } from "@/components/ui/stack";\n\nexport function LayoutPatterns() {\n  return <VStack gap={6}>\n    <Stack as="section" direction={{ base: "vertical", md: "horizontal" }} gap={4}><p>Owner</p><p>Review window</p></Stack>\n    <HStack wrap gap={2}><Button variant="outline">Review</Button><Button variant="outline">Compare</Button></HStack>\n    <VStack as="ul" dividers><li>Amara Okafor</li><li>Mei Tanaka</li></VStack>\n    <KiraStack threshold="32rem"><Button>Review changes</Button><Button variant="outline">Compare versions</Button></KiraStack>\n    <div className={stackVariants({ direction: "horizontal" })}>Variant classes</div>\n  </VStack>;\n}'
        }
      />
      <APIReference
        sections={[
          { title: "Stack", props: stackApi },
          {
            title: "HStack",
            props: stackApi.filter((entry) => entry.prop !== "direction"),
          },
          {
            title: "VStack",
            props: stackApi.filter((entry) => entry.prop !== "direction"),
          },
          {
            title: "KiraStack",
            props: [
              ...stackApi.filter(
                (entry) =>
                  !["direction", "wrap", "dividers / dividerElement"].includes(
                    entry.prop,
                  ),
              ),
              {
                prop: "layout",
                type: '"switcher" | "vertical"',
                default: '"switcher"',
                description:
                  "Local-width switching or a fixed vertical content flow.",
              },
              {
                prop: "threshold / limit",
                type: "string / number",
                default: '"32rem" / 4',
                description:
                  "CSS length threshold and maximum horizontal child-group count. Nonfinite limits fall back to four; positive whole limits are enforced.",
              },
            ],
          },
        ]}
      />
      <Changelog
        entries={[
          {
            version: "Unreleased",
            date: "In development",
            changes: [
              {
                type: "breaking",
                title: "Stripped loading props from KiraStack",
                description:
                  "Removed loading, loadingLabel, and loadingContent (and the Skeleton import) from KiraStack so stack stays a zero-dependency layout leaf. Compose Skeleton directly inside your stack when loading.",
              },
            ],
          },
          {
            version: "2.0.0",
            date: "15 November 2026",
            changes: [
              {
                type: "fixed",
                title: "Keys, numeric zero and native composition",
                description:
                  "Stable divided-child identity, list-safe decorative rules, typed native attributes and refs. Audited against Base UI 1.9.0.",
              },
              {
                type: "added",
                title: "Adaptive Stack family",
                description:
                  "Responsive direction/wrap/gaps, KiraStack local-width switching and retained refresh content. Research cutoff October 31, 2026.",
              },
              {
                type: "breaking",
                title: "Explicit native and divider contracts",
                description:
                  "Props follow the selected native tag. Fixed HStack/VStack directions cannot be overridden. Generated list dividers now use hidden presentation li adapters, and default rules expose stack-divider slots. Responsive CSS is registry-portable.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
