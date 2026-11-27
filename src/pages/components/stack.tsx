import type { ComponentProps as ReactComponentProps } from "react";
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

const basicCode = `import * as React from "react"
import { HStack, VStack } from "@/components/ui/stack"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function BasicDemo() {
  const [saved, setSaved] = React.useState(false)

  return (
    <VStack
      as="form"
      gap={3}
      onSubmit={(event) => {
        event.preventDefault()
        setSaved(true)
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
  )
}`;

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

const responsiveCode = `import { Stack } from "@/components/ui/stack"

export function ResponsiveDemo() {
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
  )
}`;

const wrapFilters = [
  "Needs review",
  "Assigned to me",
  "External collaborators",
  "Recently updated",
  "Archived",
];

function WrapDemo() {
  const [selected, setSelected] = React.useState<string[]>(["Needs review"]);

  return (
    <VStack gap={3}>
      <HStack wrap gap={2} rowGap={3}>
        {wrapFilters.map((filter) => (
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

const wrapCode = `import * as React from "react"
import { HStack, VStack } from "@/components/ui/stack"
import { Button } from "@/components/ui/button"

const filters = [
  "Needs review",
  "Assigned to me",
  "External collaborators",
  "Recently updated",
  "Archived",
]

export function WrapDemo() {
  const [selected, setSelected] = React.useState<string[]>(["Needs review"])

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
  )
}`;

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

const dividersCode = `import * as React from "react"
import { HStack, VStack } from "@/components/ui/stack"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DividersDemo() {
  const [records, setRecords] = React.useState([
    { id: "amara", name: "Amara Okafor" },
    { id: "leo", name: "Leo Martín" },
    { id: "mei", name: "Mei Tanaka" },
  ])

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
          <li key={record.id} className="min-w-0">
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
    </VStack>
  )
}`;

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
      <div className={narrow ? "w-full max-w-xs" : "w-full"}>
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

const switcherCode = `import * as React from "react"
import { HStack, VStack, KiraStack } from "@/components/ui/stack"
import { Button } from "@/components/ui/button"

export function SwitcherDemo() {
  const [narrow, setNarrow] = React.useState(false)
  const [extra, setExtra] = React.useState(false)
  const [action, setAction] = React.useState("Choose a local action.")

  const labels = [
    "Review changes",
    "Compare versions",
    "Download brief",
    "Share for review",
    ...(extra ? ["Archive draft"] : []),
  ]

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
      <div className={narrow ? "w-full max-w-xs" : "w-full"}>
        <KiraStack threshold="32rem" limit={4} gap={2}>
          {labels.map((label) => (
            <Button
              key={label}
              variant="outline"
              className="whitespace-normal"
              onClick={() => setAction(label + " selected in this local example.")}
            >
              {label}
            </Button>
          ))}
        </KiraStack>
      </div>
      <output className="text-sm text-muted-foreground">{action}</output>
    </VStack>
  )
}`;

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

const refreshingCode = `import * as React from "react"
import { HStack, VStack, KiraStack } from "@/components/ui/stack"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

export function RefreshingDemo() {
  const [loading, setLoading] = React.useState(false)

  return (
    <VStack gap={4} className="w-full max-w-lg">
      <HStack wrap gap={2}>
        <Button variant="outline" disabled={loading} onClick={() => setLoading(true)}>
          Start refresh
        </Button>
        <Button variant="outline" disabled={!loading} onClick={() => setLoading(false)}>
          Finish refresh
        </Button>
      </HStack>
      <KiraStack layout="vertical" gap={3}>
        {loading && (
          <output key="status" className="flex items-center gap-2 text-xs text-muted-foreground">
            <Skeleton className="h-2 w-24" />
            <span>Refreshing reviewer details…</span>
          </output>
        )}
        <label key="label" htmlFor="stack-refresh-note" className="text-sm font-medium">
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
  )
}`;

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

const nativeCode = `import * as React from "react"
import { Stack, VStack } from "@/components/ui/stack"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NativeDemo() {
  const formRef = React.useRef<HTMLFormElement>(null)
  const [message, setMessage] = React.useState("Native form adapter.")

  return (
    <VStack gap={3} className="w-full max-w-md">
      <Stack
        as="form"
        ref={formRef}
        render={<form aria-label="Release lookup" />}
        gap={3}
        onSubmit={(event) => {
          event.preventDefault()
          setMessage("Submitted " + String(new FormData(event.currentTarget).get("release")))
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
      <Button variant="outline" onClick={() => formRef.current?.requestSubmit()}>
        Submit through native ref
      </Button>
      <output className="text-sm text-muted-foreground">{message}</output>
    </VStack>
  )
}`;

function StressDemo() {
  const [loading, setLoading] = React.useState(true);

  return (
    <VStack gap={4} className="w-full max-w-xs">
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

const stressCode = `import * as React from "react"
import { Stack, HStack, VStack, KiraStack } from "@/components/ui/stack"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"

export function StressDemo() {
  const [loading, setLoading] = React.useState(true)

  return (
    <VStack gap={4} className="w-full max-w-xs">
      <Stack as="fieldset" disabled gap={2}>
        <legend className="text-sm font-medium">Approval settings</legend>
        <Input aria-label="Approval owner" defaultValue="Owner permission required" />
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
          <p className="text-sm text-muted-foreground">No reviews in this queue.</p>
        )}
      </KiraStack>
      <HStack gap={2} align="start">
        <span className="min-w-0">
          release-platform-external-collaborators-with-a-very-long-unbroken-identifier
        </span>
        <span className="shrink-0 text-sm">Ready</span>
      </HStack>
    </VStack>
  )
}`;

const usageCode = `import {
  Stack,
  HStack,
  VStack,
  KiraStack,
  stackVariants,
} from "@/components/ui/stack"
import { Button } from "@/components/ui/button"

export function LayoutPatterns() {
  return (
    <VStack gap={6}>
      <Stack as="section" direction={{ base: "vertical", md: "horizontal" }} gap={4}>
        <p>Owner</p>
        <p>Review window</p>
      </Stack>
      <HStack wrap gap={2}>
        <Button variant="outline">Review</Button>
        <Button variant="outline">Compare</Button>
      </HStack>
      <VStack as="ul" dividers>
        <li>Amara Okafor</li>
        <li>Mei Tanaka</li>
      </VStack>
      <KiraStack threshold="32rem">
        <Button>Review changes</Button>
        <Button variant="outline">Compare versions</Button>
      </KiraStack>
      <div className={stackVariants({ direction: "horizontal" })}>
        Variant classes
      </div>
    </VStack>
  )
}`;

export default function StackPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Stack"
        description="Semantic rows and columns for forms, reviewer lists, and actions that adapt to their available space."
        version="v3.0.0"
      />

      <FeatureGrid
        features={stackPageFeatures}
        description="Responsive layout primitives and local-width switching built on Base UI useRender."
      />

      <DemoTabs defaultValue="basic" tabs={stackPageDemoTabs} />

      <KeyboardShortcuts
        description="Layout wrappers add no keyboard handlers or tab stops."
        shortcuts={stackPageShortcuts}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Compose semantic rows and columns with Stack, HStack, VStack, or KiraStack."
        notes={[
          {
            label: "KiraStack",
            body: "Use KiraStack when a row of actions should switch to a single column based on its local container width (threshold) or item count (limit) without viewport media queries.",
          },
          {
            label: "Loading states",
            body: "Stack is a zero-dependency layout leaf. Compose Skeleton directly inside your stack when rendering loading placeholders.",
          },
        ]}
      />

      <APIReference
        sections={stackPageAPISections}
        description="Props, types, and defaults for Stack, HStack, VStack, and KiraStack."
      />

      <Changelog
        entries={stackPageChangelogEntries}
        title="Changelog"
        description="Version history for Stack."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const stackPageFeatures = [
  {
    title: "Responsive layout",
    description: "Direction, alignment and independent row/column gaps.",
    icon: <IconLayout className="size-5" />,
  },
  {
    title: "Local-width actions",
    description: "KiraStack switches from one row to one column.",
    icon: <IconColumns className="size-5" />,
  },
  {
    title: "Stable divided lists",
    description: "Editable keyed rows keep their identity when reordered.",
    icon: <IconSpacingVertical className="size-5" />,
  },
  {
    title: "Retained refresh",
    description: "Caller-owned busy state preserves supplied content.",
    icon: <IconRefresh className="size-5" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const stackPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Basic"
        description="A native release form using vertical and horizontal stacks."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "responsive",
    label: "Responsive",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Responsive"
        description="Viewport direction, gap and baseline alignment preserve reading order."
        code={responsiveCode}
      >
        <ResponsiveDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "wrap",
    label: "Wrap",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Wrap"
        description="Filter controls wrap before their labels need to shrink."
        code={wrapCode}
      >
        <WrapDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "dividers",
    label: "Dividers",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Dividers"
        description="Keyed editable reviewers and decorative list-safe rules."
        code={dividersCode}
      >
        <DividersDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraStack",
    group: "KiraStack",
    demo: (
      <DemoWrapper
        title="KiraStack"
        description="Actions switch between one row and one column at the local width."
        code={switcherCode}
      >
        <SwitcherDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "refreshing",
    label: "Refreshing",
    group: "KiraStack",
    demo: (
      <DemoWrapper
        title="Refreshing"
        description="Supplied content stays mounted and editable during a caller-owned refresh."
        code={refreshingCode}
      >
        <RefreshingDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "native",
    label: "Native",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Native"
        description="Native form attributes, render adapter and a typed ref."
        code={nativeCode}
      >
        <NativeDemo />
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
        description="Disabled fieldset, empty queue, loading skeleton, and long unbroken identifiers in a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const stackPageShortcuts = [
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
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

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
    default: "-",
    description: "Cross-axis alignment.",
  },
  {
    prop: "justify",
    type: 'LayoutResponsiveValue<"start" | "end" | "center" | "between" | "around" | "evenly">',
    default: "-",
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
] satisfies ReactComponentProps<
  typeof APIReference
>["sections"][number]["props"];

const stackPageAPISections = [
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
        description: "Local-width switching or a fixed vertical content flow.",
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
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const stackPageChangelogEntries = [
  {
    version: "3.0.0",
    date: "26 November 2026",
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
] satisfies ReactComponentProps<typeof Changelog>["entries"];
