import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconLayoutGrid,
  IconArrowsHorizontal,
  IconFileText,
} from "@tabler/icons-react";
import { Container, KiraContainer } from "@/components/ui/container";
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
  const id = React.useId();

  return (
    <Container
      as="section"
      size="lg"
      aria-labelledby={id}
      className="space-y-3"
    >
      <h3 id={id} className="text-lg font-semibold">
        October release brief
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Permissions, audit history, and export improvements share one rollout
        plan. This local fixture keeps the brief within the available page
        width.
      </p>
      <p className="text-sm text-muted-foreground">Owner: Maya Chen</p>
    </Container>
  );
}

const basicDemoCode = `import * as React from "react";
import { Container } from "@/components/ui/container";

export function BasicDemo() {
  const id = React.useId();

  return (
    <Container as="section" size="lg" aria-labelledby={id} className="space-y-3">
      <h3 id={id} className="text-lg font-semibold">October release brief</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Permissions, audit history, and export improvements share one rollout plan.
      </p>
      <p className="text-sm text-muted-foreground">Owner: Maya Chen</p>
    </Container>
  );
}`;

function SizesDemo() {
  return (
    <div className="space-y-3">
      {(["sm", "md", "lg", "xl", "2xl", "full", "prose"] as const).map(
        (size) => (
          <Container
            key={size}
            size={size}
            padding="sm"
            data-demo-size={size}
            className="rounded-lg border bg-muted/30 py-3"
          >
            <p className="text-sm">size="{size}"</p>
          </Container>
        ),
      )}
      <p className="text-sm text-muted-foreground">
        A maximum width does not force overflow when the parent is narrower.
      </p>
    </div>
  );
}

const sizesDemoCode = `import { Container } from "@/components/ui/container";

export function SizesDemo() {
  return (
    <div className="space-y-3">
      {(["sm", "md", "lg", "xl", "2xl", "full", "prose"] as const).map((size) => (
        <Container
          key={size}
          size={size}
          padding="sm"
          className="rounded-lg border bg-muted/30 py-3"
        >
          <p className="text-sm">size="{size}"</p>
        </Container>
      ))}
    </div>
  );
}`;

function GuttersDemo() {
  const [padding, setPadding] = React.useState<
    "none" | "sm" | "default" | "lg"
  >("default");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["none", "sm", "default", "lg"] as const).map((value) => (
          <Button
            key={value}
            variant="outline"
            size="sm"
            aria-pressed={padding === value}
            onClick={() => setPadding(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <Container
        padding={padding}
        centered
        className="rounded-lg border bg-muted/30 py-6"
      >
        <div className="w-full rounded-md border bg-background p-4 text-sm">
          Gutters: {padding}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Horizontal content alignment. Vertical placement remains caller-owned.
        </p>
      </Container>
    </div>
  );
}

const guttersDemoCode = `import * as React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function GuttersDemo() {
  const [padding, setPadding] = React.useState<
    "none" | "sm" | "default" | "lg"
  >("default");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["none", "sm", "default", "lg"] as const).map((value) => (
          <Button
            key={value}
            variant="outline"
            size="sm"
            aria-pressed={padding === value}
            onClick={() => setPadding(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <Container
        padding={padding}
        centered
        className="rounded-lg border bg-muted/30 py-6"
      >
        <div className="w-full rounded-md border bg-background p-4 text-sm">
          Gutters: {padding}
        </div>
      </Container>
    </div>
  );
}`;

function QueryDemo() {
  const [wide, setWide] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          aria-pressed={!wide}
          onClick={() => setWide(false)}
        >
          Compact record
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={wide}
          onClick={() => setWide(true)}
        >
          Wide record
        </Button>
      </div>
      <div className="max-w-full" style={{ width: wide ? 760 : 320 }}>
        <Container
          size="full"
          query
          queryName="record"
          className="rounded-lg border bg-muted/30 py-4"
        >
          <div
            data-demo-query-grid
            className="grid gap-4 @lg/record:grid-cols-2"
          >
            <section className="space-y-3">
              <h3 className="font-medium">Access review</h3>
              <p className="text-sm text-muted-foreground">Owner: Maya Chen</p>
              <p className="text-sm">Status: ready for review</p>
            </section>
            <section className="space-y-3">
              <h3 className="font-medium">Rollout notes</h3>
              <p className="text-sm text-muted-foreground">
                The audit history and export changes share the same access
                policy. Review the owner notes before rollout.
              </p>
            </section>
          </div>
        </Container>
      </div>
      <p className="text-sm text-muted-foreground">
        The query is opt-in. Its content switches to two columns when the record
        itself is wide enough.
      </p>
    </div>
  );
}

const queryDemoCode = `import * as React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function QueryDemo() {
  const [wide, setWide] = React.useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" aria-pressed={!wide} onClick={() => setWide(false)}>
          Compact record
        </Button>
        <Button variant="outline" size="sm" aria-pressed={wide} onClick={() => setWide(true)}>
          Wide record
        </Button>
      </div>
      <div className="max-w-full" style={{ width: wide ? 760 : 320 }}>
        <Container size="full" query queryName="record" className="rounded-lg border bg-muted/30 py-4">
          <div className="grid gap-4 @lg/record:grid-cols-2">
            <section className="space-y-3">
              <h3 className="font-medium">Access review</h3>
              <p className="text-sm text-muted-foreground">Owner: Maya Chen</p>
            </section>
            <section className="space-y-3">
              <h3 className="font-medium">Rollout notes</h3>
              <p className="text-sm text-muted-foreground">Review the owner notes before rollout.</p>
            </section>
          </div>
        </Container>
      </div>
    </div>
  );
}`;

function NestedDemo() {
  return (
    <Container
      size="full"
      padding="none"
      className="rounded-lg bg-muted/30 py-6"
    >
      <Container size="md" className="space-y-3">
        <h3 className="font-semibold">Release checklist</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Review access rules with the owner.</li>
          <li>Confirm migration notes and export behavior.</li>
          <li>Record the rollout decision.</li>
        </ul>
      </Container>
    </Container>
  );
}

const nestedDemoCode = `import { Container } from "@/components/ui/container";

export function NestedDemo() {
  return (
    <Container size="full" padding="none" className="rounded-lg bg-muted/30 py-6">
      <Container size="md" className="space-y-3">
        <h3 className="font-semibold">Release checklist</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>Review access rules with the owner.</li>
          <li>Confirm migration notes and export behavior.</li>
          <li>Record the rollout decision.</li>
        </ul>
      </Container>
    </Container>
  );
}`;

function ReadingDemo() {
  const [read, setRead] = React.useState(false);

  return (
    <Container as="article" size="prose" className="space-y-4">
      <h3 className="text-xl font-semibold">Access policy brief</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The October release brings access review, audit history, and exports
        into one workflow. Project owners review the permission changes before
        the rollout begins.
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The release checklist records the owner, the review result, and the
        migration notes. Export settings remain visible alongside the audit
        summary.
      </p>
      <Button
        variant="outline"
        aria-pressed={read}
        onClick={() => setRead((value) => !value)}
      >
        {read ? "Marked read" : "Mark read"}
      </Button>
      <output className="block text-sm text-muted-foreground">
        {read
          ? "The local brief is marked read."
          : "The local brief is waiting for review."}
      </output>
    </Container>
  );
}

const readingDemoCode = `import * as React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function ReadingDemo() {
  const [read, setRead] = React.useState(false);

  return (
    <Container as="article" size="prose" className="space-y-4">
      <h3 className="text-xl font-semibold">Access policy brief</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        The October release brings access review, audit history, and exports into one workflow.
      </p>
      <Button variant="outline" aria-pressed={read} onClick={() => setRead((value) => !value)}>
        {read ? "Marked read" : "Mark read"}
      </Button>
      <output className="block text-sm text-muted-foreground">
        {read ? "The local brief is marked read." : "The local brief is waiting for review."}
      </output>
    </Container>
  );
}`;

function SemanticsDemo() {
  const id = React.useId();
  const ref = React.useRef<HTMLElement>(null);
  const [tag, setTag] = React.useState("");

  return (
    <div className="space-y-4">
      <Container
        as="article"
        ref={ref}
        aria-labelledby={id}
        className="space-y-3 rounded-lg border py-4"
      >
        <h3 id={id} className="font-medium">
          Release record
        </h3>
        <p className="text-sm text-muted-foreground">
          Native article semantics and a typed HTMLElement ref.
        </p>
        <Button
          variant="outline"
          onClick={() => setTag(ref.current?.tagName ?? "")}
        >
          Read the element ref
        </Button>
      </Container>
      <output className="block text-sm text-muted-foreground">
        {tag ? `Ref element: ${tag}.` : "The ref has not been read."}
      </output>
    </div>
  );
}

const semanticsDemoCode = `import * as React from "react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function SemanticsDemo() {
  const id = React.useId();
  const ref = React.useRef<HTMLElement>(null);
  const [tag, setTag] = React.useState("");

  return (
    <div className="space-y-4">
      <Container as="article" ref={ref} aria-labelledby={id} className="space-y-3 rounded-lg border py-4">
        <h3 id={id} className="font-medium">Release record</h3>
        <p className="text-sm text-muted-foreground">
          Native article semantics and a typed HTMLElement ref.
        </p>
        <Button variant="outline" onClick={() => setTag(ref.current?.tagName ?? "")}>
          Read the element ref
        </Button>
      </Container>
      <output className="block text-sm text-muted-foreground">
        {tag ? \`Ref element: \${tag}.\` : "The ref has not been read."}
      </output>
    </div>
  );
}`;

function KiraDemo() {
  const id = React.useId();
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="space-y-4">
      <Button variant="outline" onClick={() => setLoading((value) => !value)}>
        {loading ? "Finish local reload" : "Reload local document"}
      </Button>
      <KiraContainer
        as="article"
        size="prose"
        header={
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Access policy brief</h3>
            <p className="text-sm text-muted-foreground">
              Release owner: Maya Chen
            </p>
          </div>
        }
        footer={
          <p className="text-sm text-muted-foreground">
            Local fixture · no network request
          </p>
        }
      >
        <output className="sr-only">
          {loading ? "Reloading the local access brief..." : ""}
        </output>
        <div className="relative" aria-busy={loading}>
          <div
            aria-hidden={loading || undefined}
            inert={loading || undefined}
            className={
              loading ? "invisible min-h-48 space-y-4" : "min-h-48 space-y-4"
            }
          >
            <p className="text-sm leading-relaxed text-muted-foreground">
              Review the permissions, migration notes, and audit summary before
              the rollout.
            </p>
            <div className="space-y-2">
              <label htmlFor={id} className="text-sm font-medium">
                Personal review note
              </label>
              <Input id={id} defaultValue="Check the owner permissions" />
            </div>
          </div>
          {loading && (
            <Skeleton
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
            />
          )}
        </div>
      </KiraContainer>
    </div>
  );
}

const kiraDemoCode = `import * as React from "react";
import { KiraContainer } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export function KiraDemo() {
  const id = React.useId();
  const [loading, setLoading] = React.useState(false);
  return <div className="space-y-4">
    <Button variant="outline" onClick={() => setLoading((value) => !value)}>{loading ? "Finish local reload" : "Reload local document"}</Button>
    <KiraContainer as="article" size="prose"
      header={<div className="space-y-2"><h3 className="text-lg font-semibold">Access policy brief</h3><p className="text-sm text-muted-foreground">Release owner: Maya Chen</p></div>}
      footer={<p className="text-sm text-muted-foreground">Local fixture · no network request</p>}>
      <output className="sr-only">{loading ? "Reloading the local access brief..." : ""}</output>
      <div className="relative" aria-busy={loading}>
        <div aria-hidden={loading || undefined} inert={loading || undefined} className={loading ? "invisible min-h-48 space-y-4" : "min-h-48 space-y-4"}>
          <p className="text-sm leading-relaxed text-muted-foreground">Review the permissions, migration notes, and audit summary before the rollout.</p>
          <div className="space-y-2"><label htmlFor={id} className="text-sm font-medium">Personal review note</label><Input id={id} defaultValue="Check the owner permissions" /></div>
        </div>
        {loading && <Skeleton aria-hidden="true" className="absolute inset-0 h-full w-full" />}
      </div>
    </KiraContainer>
  </div>;
}`;

function StatesDemo() {
  const [state, setState] = React.useState<
    "ready" | "loading" | "empty" | "error"
  >("ready");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["ready", "loading", "empty", "error"] as const).map((value) => (
          <Button
            key={value}
            variant="outline"
            size="sm"
            aria-pressed={state === value}
            onClick={() => setState(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <KiraContainer
        size="sm"
        padding="sm"
        query
        queryName="brief"
        header={
          <h3 className="font-semibold">
            release-permissions-audit-history-and-migration-notes
          </h3>
        }
      >
        {state === "loading" && <Skeleton className="h-48 w-full" />}
        {state === "error" && (
          <div className="min-h-48 space-y-3 rounded-lg border border-destructive/30 p-4">
            <p role="alert" className="text-sm text-destructive">
              The latest brief is unavailable. Try the local fixture again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setState("ready")}
            >
              Try again
            </Button>
          </div>
        )}
        {state === "empty" && (
          <div className="min-h-48 space-y-3">
            <p className="text-sm text-muted-foreground">No document yet.</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setState("ready")}
            >
              Create local brief
            </Button>
          </div>
        )}
        {state === "ready" && (
          <div className="min-h-48 space-y-3">
            <p className="text-sm">
              owner-with-a-very-long-address@example.test
            </p>
            <p className="text-sm text-muted-foreground">
              Read-only snapshot. Request edit access from the release owner.
            </p>
          </div>
        )}
      </KiraContainer>
    </div>
  );
}

const statesDemoCode = `import * as React from "react";
import { KiraContainer } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function StatesDemo() {
  const [state, setState] = React.useState<"ready" | "loading" | "empty" | "error">("ready");
  return <div className="space-y-4">
    <div className="flex flex-wrap gap-2">{(["ready", "loading", "empty", "error"] as const).map((value) =>
      <Button key={value} variant="outline" size="sm" aria-pressed={state === value} onClick={() => setState(value)}>{value}</Button>)}</div>
    <KiraContainer size="sm" padding="sm" query queryName="brief"
      header={<h3 className="font-semibold">release-permissions-audit-history-and-migration-notes</h3>}>
      {state === "loading" && <Skeleton className="h-48 w-full" />}
      {state === "error" && <div className="min-h-48 space-y-3 rounded-lg border border-destructive/30 p-4"><p role="alert" className="text-sm text-destructive">The latest brief is unavailable. Try the local fixture again.</p><Button variant="outline" size="sm" onClick={() => setState("ready")}>Try again</Button></div>}
      {state === "empty" && <div className="min-h-48 space-y-3"><p className="text-sm text-muted-foreground">No document yet.</p><Button variant="outline" size="sm" onClick={() => setState("ready")}>Create local brief</Button></div>}
      {state === "ready" && <div className="min-h-48 space-y-3"><p className="text-sm">owner-with-a-very-long-address@example.test</p><p className="text-sm text-muted-foreground">Read-only snapshot. Request edit access from the release owner.</p></div>}
    </KiraContainer>
  </div>;
}`;

function StressDemo() {
  const [empty, setEmpty] = React.useState(false);

  return (
    <div className="max-w-xs space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          aria-pressed={!empty}
          onClick={() => setEmpty(false)}
        >
          Long content
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-pressed={empty}
          onClick={() => setEmpty(true)}
        >
          Empty body
        </Button>
      </div>
      <KiraContainer
        size="full"
        padding="sm"
        className="rounded-lg border py-4"
        header={
          <h3 className="text-sm font-semibold">
            quarterly-international-accessibility-compliance-and-rollout-audit-summary-2026
          </h3>
        }
        footer={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Publish (owner only)
            </Button>
            <span className="text-xs text-muted-foreground">
              owner-accessibility-reviews@northwind-international.example.test
            </span>
          </div>
        }
      >
        {empty ? (
          <p className="text-sm text-muted-foreground">
            No sections have been added to this narrow container.
          </p>
        ) : (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              Unbroken identifiers wrap cleanly inside the container without
              horizontal overflow:
              https://northwind.example.test/releases/2026/11/permissions-audit-export-manifest
            </p>
          </div>
        )}
      </KiraContainer>
    </div>
  );
}

const stressDemoCode = `import * as React from "react";
import { KiraContainer } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export function StressDemo() {
  const [empty, setEmpty] = React.useState(false);

  return (
    <div className="max-w-xs space-y-4">
      <KiraContainer
        size="full"
        padding="sm"
        className="rounded-lg border py-4"
        header={
          <h3 className="text-sm font-semibold">
            quarterly-international-accessibility-compliance-and-rollout-audit-summary-2026
          </h3>
        }
        footer={
          <Button variant="outline" size="sm" disabled>
            Publish (owner only)
          </Button>
        }
      >
        {empty ? (
          <p className="text-sm text-muted-foreground">No sections added.</p>
        ) : (
          <p className="text-sm text-muted-foreground">
            https://northwind.example.test/releases/2026/11/permissions-audit-export-manifest
          </p>
        )}
      </KiraContainer>
    </div>
  );
}`;

const usageCode = `import * as React from "react";
import { Container, KiraContainer, containerVariants } from "@/components/ui/container";

export function DocumentSection() {
  return (
    <Container as="article" size="prose" padding="default">
      <h2>Release brief</h2>
      <p>Review the access rules.</p>
    </Container>
  );
}

export function EmbeddedRecord() {
  return (
    <Container query queryName="record" size="full">
      <div className="grid gap-4 @lg/record:grid-cols-2">
        <section>Owner details</section>
        <section>Rollout notes</section>
      </div>
    </Container>
  );
}

export function DeferredDocument({ loading }: { loading: boolean }) {
  return (
    <KiraContainer
      size="prose"
      header={<h2>Release brief</h2>}
      footer={<p>Local document</p>}
    >
      <div className="min-h-48">{loading ? "Loading..." : "Document content."}</div>
    </KiraContainer>
  );
}

export function VariantClasses() {
  return (
    <div className={containerVariants({ size: "md", padding: "sm" })}>
      Contained content.
    </div>
  );
}`;

export default function ContainerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Container"
        description="Native width and gutter control for pages, reading views, and embedded records. Optional local size queries and deferred-document composition."
        version="v3.0.0"
      />

      <FeatureGrid
        features={containerPageFeatures}
        description="Responsive width constraints, opt-in container queries, and deferred-document composition."
      />

      <DemoTabs defaultValue="basic" tabs={containerPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={containerPageShortcuts}
        description="Focus passthrough and inert loading behavior."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Use Container for semantic layout bounds and KiraContainer for documents with header and footer slots and caller-managed loading and error states."
        notes={containerUsageNotes}
      />

      <APIReference
        sections={containerPageAPISections}
        description="Props, types, and defaults for Container, KiraContainer, and containerVariants."
      />

      <Changelog
        entries={containerPageChangelogEntries}
        title="Changelog"
        description="Version history for Container."
      />
    </ComponentPage>
  );
}

const containerUsageNotes = [
  {
    label: "KiraContainer",
    body: "Use KiraContainer for document header and footer slots. Compose loading and recovery feedback inside the body.",
  },
  {
    label: "Opt-in container queries",
    body: "Set query and queryName to create a named CSS inline-size container so descendant grids reflow based on panel width rather than viewport breakpoints.",
  },
  {
    label: "Horizontal centering",
    body: "The centered prop aligns children horizontally in a flex column; vertical placement stays caller-owned.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const containerPageFeatures = [
  {
    title: "Widths and gutters",
    description:
      "Existing breakpoint sizes, full width, nested surfaces and a 65ch reading measure.",
    icon: <IconArrowsHorizontal aria-hidden="true" className="size-4" />,
  },
  {
    title: "Local queries",
    description:
      "A named inline-size context lets record content reflow inside its own panel.",
    icon: <IconLayoutGrid aria-hidden="true" className="size-4" />,
  },
  {
    title: "Deferred documents",
    description:
      "Header/body/footer composition, reserved loading space, retained notes and visible recovery.",
    icon: <IconFileText aria-hidden="true" className="size-4" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const containerPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Constrain a release brief"
        description="A native section with a maximum width and responsive gutters."
        code={basicDemoCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Existing maximum widths"
        description="Breakpoint-based sizes, full width, and a 65ch reading measure."
        code={sizesDemoCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "gutters",
    label: "Gutters",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Gutters and horizontal centering"
        description="Switch the existing padding presets. Centered aligns children horizontally."
        code={guttersDemoCode}
      >
        <GuttersDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "nested",
    label: "Nested",
    group: "Core",
    demo: (
      <DemoWrapper
        title="A full surface with contained content"
        description="Nested containers separate surface width from readable content width."
        code={nestedDemoCode}
      >
        <NestedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "reading",
    label: "Reading",
    group: "Core",
    demo: (
      <DemoWrapper
        title="A document reading measure"
        description="The existing prose size caps the document at 65ch without a typography plugin."
        code={readingDemoCode}
      >
        <ReadingDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "query",
    label: "Queries",
    group: "Composition",
    demo: (
      <DemoWrapper
        title="Reflow an embedded record"
        description="The descendant grid queries this named container's width. It does not depend on viewport breakpoints."
        code={queryDemoCode}
      >
        <QueryDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "semantics",
    label: "Semantics",
    group: "Composition",
    demo: (
      <DemoWrapper
        title="Native composition and refs"
        description="The article ref and accessible name follow the selected native tag."
        code={semanticsDemoCode}
      >
        <SemanticsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraContainer",
    group: "KiraContainer",
    demo: (
      <DemoWrapper
        title="A deferred document with a retained note"
        description="Reload the local fixture and finish it. The note stays mounted beneath its skeleton."
        code={kiraDemoCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Long text, loading, empty content, and retry"
        description="Local lifecycle states and a read-only document inside a constrained container."
        code={statesDemoCode}
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
        description="Long unbroken labels, empty content, and disabled controls inside a max-w-xs container."
        code={stressDemoCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const containerPageShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description:
      "Pass through to native child controls. Container itself adds no tab stop or keyboard handler.",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate the child width, gutter, review and recovery buttons with native semantics.",
  },
  {
    keys: "Tab after reload",
    description:
      "The busy document body is inert until loading finishes; the caller's reload controls stay available.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const containerPageAPISections = [
  {
    title: "Container",
    props: [
      {
        prop: "as",
        type: '"div" | "section" | "main" | "article" | "aside" | "header" | "footer"',
        default: '"div"',
        description: "Native tag. Native props and refs follow as.",
      },
      {
        prop: "render",
        type: "React.ReactElement | ((props, state) => React.ReactElement)",
        default: "-",
        description:
          "Base UI render composition. Resolved props go to the rendered element.",
      },
      {
        prop: "size",
        type: '"sm" | "md" | "lg" | "xl" | "2xl" | "full" | "prose"',
        default: '"xl"',
        description:
          "Existing breakpoint maxima or full width; prose caps at 65ch.",
      },
      {
        prop: "padding",
        type: '"none" | "sm" | "default" | "lg"',
        default: '"default"',
        description: "Existing responsive horizontal gutters.",
      },
      {
        prop: "centered",
        type: "boolean",
        default: "false",
        description:
          "Flex column with horizontally centered children. It does not provide vertical centering.",
      },
      {
        prop: "query",
        type: "boolean",
        default: "false",
        description:
          "Establish an opt-in inline-size query container. Query descendants, not the root.",
      },
      {
        prop: "queryName",
        type: "string",
        default: "-",
        description:
          "CSS container name when query is enabled. Use a valid CSS container identifier.",
      },
      {
        prop: "style / className",
        type: "React.CSSProperties / string",
        default: "-",
        description:
          "Native overrides. Caller style can override containerName.",
      },
      {
        prop: "ref / native props",
        type: "React.ComponentPropsWithRef<T>",
        default: "-",
        description:
          "Selected-tag ref, accessible attributes, children and native events.",
      },
    ],
  },
  {
    title: "KiraContainer",
    props: [
      {
        prop: "children",
        type: "React.ReactNode",
        default: "-",
        description:
          "Mounted body content. Compose a skeleton or error feedback inside the body as needed.",
      },
      {
        prop: "header / footer",
        type: "React.ReactNode",
        default: "-",
        description: "Optional document header and footer.",
      },
      {
        prop: "Container props",
        type: "Omit<ContainerProps<T>, 'children'>",
        default: "-",
        description:
          "All existing width, gutter, query, native tag and ref options.",
      },
    ],
  },
  {
    title: "containerVariants",
    props: [
      {
        prop: "size",
        type: '"sm" | "md" | "lg" | "xl" | "2xl" | "full" | "prose"',
        default: '"xl"',
        description: "Shared maximum-width classes.",
      },
      {
        prop: "padding",
        type: '"none" | "sm" | "default" | "lg"',
        default: '"default"',
        description: "Shared responsive gutter classes.",
      },
      {
        prop: "centered / query",
        type: "boolean",
        default: "false",
        description: "Horizontal centering and opt-in inline-size containment.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional classes.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const containerPageChangelogEntries = [
  {
    version: "3.0.0",
    date: "26 November 2026",
    changes: [
      {
        type: "breaking",
        title: "Stripped loading/error/onRetry from KiraContainer",
        description:
          "Removed loading, error, and onRetry props (and Skeleton/Button imports) from KiraContainer so container remains a zero-dependency layout leaf. Compose Skeleton or error UI directly inside your layout.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "13 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Tailwind v4 widths and native composition",
        description:
          "Breakpoint sizes use existing theme variables; prose has its documented 65ch cap. Native props, refs and render adapters follow the selected tag. Audited against Base UI 1.9.0; Container has no native layout primitive.",
      },
      {
        type: "added",
        title: "Named queries and KiraContainer",
        description:
          "Opt-in inline-size containment and caller-owned deferred documents with retained body content and recovery. Research cutoff October 31, 2026.",
      },
      {
        type: "breaking",
        title: "Documented width constraints now apply",
        description:
          "Layouts that relied on missing maximum-width CSS now respect the existing sizes. Native tag-specific props and refs are typed; long values shrink and wrap.",
      },
      {
        type: "fixed",
        title: "Honest demos and reference",
        description:
          "Added focused Basic, Queries, Kira, States, keyboard and native-ref examples. Centered is documented as horizontal alignment; no typography plugin or unverified reading research is claimed.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
