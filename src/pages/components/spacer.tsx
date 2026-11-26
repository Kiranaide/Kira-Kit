import * as React from "react";
import {
  IconSpacingHorizontal,
  IconArrowsHorizontal,
  IconDeviceMobile,
  IconHourglass,
} from "@tabler/icons-react";

import { Stack, HStack, VStack } from "@/components/ui/stack";
import { Spacer, KiraSpacer } from "@/components/ui/spacer";
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
  const [filter, setFilter] = React.useState(false);

  return (
    <div className="w-full space-y-3">
      <HStack gap={0} align="center" className="w-full">
        <span className="min-w-0 text-sm font-medium">Release reviews</span>
        <Spacer />
        <Button
          variant="outline"
          aria-pressed={filter}
          onClick={() => setFilter((value) => !value)}
        >
          {filter ? "All reviews" : "Assigned to me"}
        </Button>
      </HStack>
      <output className="text-sm text-muted-foreground">
        {filter
          ? "Showing reviews assigned to you."
          : "Showing all local review fixtures."}
      </output>
    </div>
  );
}

const BasicDemoCode =
  'import * as React from "react";\nimport { HStack } from "@/components/ui/stack";\nimport { Spacer } from "@/components/ui/spacer";\nimport { Button } from "@/components/ui/button";\n\nexport function BasicDemo() {\n  const [filter, setFilter] = React.useState(false);\n  return <div className="w-full space-y-3">\n    <HStack gap={0} align="center" className="w-full">\n      <span className="min-w-0 text-sm font-medium">Release reviews</span>\n      <Spacer />\n      <Button variant="outline" aria-pressed={filter} onClick={() => setFilter((value) => !value)}>{filter ? "All reviews" : "Assigned to me"}</Button>\n    </HStack>\n    <output className="text-sm text-muted-foreground">{filter ? "Showing reviews assigned to you." : "Showing all local review fixtures."}</output>\n  </div>;\n}';

function FixedDemo() {
  return (
    <div className="space-y-4">
      <HStack gap={0} align="center">
        <span className="text-sm">Owner</span>
        <Spacer size={4} />
        <span className="text-sm">Amara Okafor</span>
      </HStack>
      <VStack gap={0}>
        <p className="text-sm font-medium">Review notes</p>
        <Spacer size={6} axis="vertical" />
        <p className="text-sm text-muted-foreground">
          The fixed vertical gap uses the existing six-unit spacing token.
        </p>
      </VStack>
      <p className="text-sm text-muted-foreground">
        Parent gaps are zero, so the visible space comes from Spacer alone.
      </p>
    </div>
  );
}

const FixedDemoCode =
  'import { HStack, VStack } from "@/components/ui/stack";\nimport { Spacer } from "@/components/ui/spacer";\n\nexport function FixedDemo() {\n  return <div className="space-y-4">\n    <HStack gap={0} align="center"><span className="text-sm">Owner</span><Spacer size={4} /><span className="text-sm">Amara Okafor</span></HStack>\n    <VStack gap={0}><p className="text-sm font-medium">Review notes</p><Spacer size={6} axis="vertical" /><p className="text-sm text-muted-foreground">The fixed vertical gap uses the existing six-unit spacing token.</p></VStack>\n    <p className="text-sm text-muted-foreground">Parent gaps are zero, so the visible space comes from Spacer alone.</p>\n  </div>;\n}';

function ScaleDemo() {
  const sizes = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24] as const;

  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {sizes.map((size) => (
        <HStack key={size} gap={0} align="center">
          <span className="w-8 shrink-0 text-xs tabular-nums">{size}</span>
          <Spacer size={size} className="h-3 rounded-sm bg-muted" />
          <span className="ml-2 text-xs text-muted-foreground">
            {size === 0 ? "Explicit zero" : "Spacing token"}
          </span>
        </HStack>
      ))}
    </div>
  );
}

const ScaleDemoCode =
  'import { HStack } from "@/components/ui/stack";\nimport { Spacer } from "@/components/ui/spacer";\n\nexport function ScaleDemo() {\n  const sizes = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24] as const;\n  return <div className="grid w-full gap-3 sm:grid-cols-2">\n    {sizes.map((size) => <HStack key={size} gap={0} align="center"><span className="w-8 shrink-0 text-xs tabular-nums">{size}</span><Spacer size={size} className="h-3 rounded-sm bg-muted" /><span className="ml-2 text-xs text-muted-foreground">{size === 0 ? "Explicit zero" : "Spacing token"}</span></HStack>)}\n  </div>;\n}';

function ResponsiveDemo() {
  return (
    <Stack
      direction={{ base: "vertical", md: "horizontal" }}
      gap={0}
      align="start"
      className="w-full rounded-lg border p-4"
    >
      <section className="min-w-0">
        <h3 className="text-sm font-semibold">Workspace owner</h3>
        <p className="text-sm text-muted-foreground">Amara Okafor</p>
      </section>
      <Spacer
        size={{ base: 4, md: 8 }}
        axis={{ base: "vertical", md: "horizontal" }}
      />
      <section className="min-w-0">
        <h3 className="text-sm font-semibold">Review team</h3>
        <p className="text-sm text-muted-foreground">
          Platform and access engineering
        </p>
      </section>
    </Stack>
  );
}

const ResponsiveDemoCode =
  'import { Stack } from "@/components/ui/stack";\nimport { Spacer } from "@/components/ui/spacer";\n\nexport function ResponsiveDemo() {\n  return <Stack direction={{ base: "vertical", md: "horizontal" }} gap={0} align="start" className="w-full rounded-lg border p-4">\n    <section className="min-w-0"><h3 className="text-sm font-semibold">Workspace owner</h3><p className="text-sm text-muted-foreground">Amara Okafor</p></section>\n    <Spacer size={{ base: 4, md: 8 }} axis={{ base: "vertical", md: "horizontal" }} />\n    <section className="min-w-0"><h3 className="text-sm font-semibold">Review team</h3><p className="text-sm text-muted-foreground">Platform and access engineering</p></section>\n  </Stack>;\n}';

function FluidDemo() {
  const [narrow, setNarrow] = React.useState(false);

  return (
    <div className="w-full space-y-4">
      <Button variant="outline" onClick={() => setNarrow((value) => !value)}>
        {narrow ? "Use full width" : "Use narrow panel"}
      </Button>
      <div
        className="max-w-full rounded-lg border p-4"
        style={{
          width: narrow ? "20rem" : "100%",
          containerType: "inline-size",
        }}
      >
        <HStack gap={0} align="center">
          <span className="min-w-0 text-sm">Release owner</span>
          <KiraSpacer min={2} max={12} preferred="10cqw" />
          <span className="min-w-0 text-sm">Review window</span>
        </HStack>
      </div>
      <p className="text-sm text-muted-foreground">
        The gap uses ten percent of the query container width, bounded by
        spacing tokens 2 and 12.
      </p>
    </div>
  );
}

const FluidDemoCode =
  'import * as React from "react";\nimport { HStack } from "@/components/ui/stack";\nimport { KiraSpacer } from "@/components/ui/spacer";\nimport { Button } from "@/components/ui/button";\n\nexport function FluidDemo() {\n  const [narrow, setNarrow] = React.useState(false);\n  return <div className="w-full space-y-4">\n    <Button variant="outline" onClick={() => setNarrow((value) => !value)}>{narrow ? "Use full width" : "Use narrow panel"}</Button>\n    <div className="max-w-full rounded-lg border p-4" style={{ width: narrow ? "20rem" : "100%", containerType: "inline-size" }}>\n      <HStack gap={0} align="center"><span className="min-w-0 text-sm">Release owner</span><KiraSpacer min={2} max={12} preferred="10cqw" /><span className="min-w-0 text-sm">Review window</span></HStack>\n    </div>\n    <p className="text-sm text-muted-foreground">The gap uses ten percent of the query container width, bounded by spacing tokens 2 and 12.</p>\n  </div>;\n}';

function SafeAreaDemo() {
  return (
    <VStack gap={0} className="w-full max-w-md rounded-lg border p-4">
      <p className="text-sm font-medium">Invitation review footer</p>
      <p className="text-sm text-muted-foreground">
        Place a vertical inset below footer content when the host uses
        viewport-fit=cover.
      </p>
      <KiraSpacer
        axis="vertical"
        min={4}
        max={8}
        preferred="4vw"
        safeArea="bottom"
      />
      <p className="text-xs text-muted-foreground">
        Device safe-area insets are usually zero on desktop. This example does
        not simulate a physical device inset.
      </p>
    </VStack>
  );
}

const SafeAreaDemoCode =
  'import { VStack } from "@/components/ui/stack";\nimport { KiraSpacer } from "@/components/ui/spacer";\n\nexport function SafeAreaDemo() {\n  return <VStack gap={0} className="w-full max-w-md rounded-lg border p-4">\n    <p className="text-sm font-medium">Invitation review footer</p>\n    <p className="text-sm text-muted-foreground">Place a vertical inset below footer content when the host uses viewport-fit=cover.</p>\n    <KiraSpacer axis="vertical" min={4} max={8} preferred="4vw" safeArea="bottom" />\n    <p className="text-xs text-muted-foreground">Device safe-area insets are usually zero on desktop. This example does not simulate a physical device inset.</p>\n  </VStack>;\n}';

function ReserveDemo() {
  const [loading, setLoading] = React.useState(false);

  return (
    <VStack gap={4} className="w-full max-w-lg">
      <HStack wrap gap={2}>
        <Button
          variant="outline"
          disabled={loading}
          onClick={() => setLoading(true)}
        >
          Start reload
        </Button>
        <Button
          variant="outline"
          disabled={!loading}
          onClick={() => setLoading(false)}
        >
          Finish reload
        </Button>
      </HStack>
      <KiraSpacer
        mode="reserve"
        minHeight="12rem"
        className="relative rounded-lg border p-4"
      >
        <div
          aria-hidden={loading || undefined}
          inert={loading || undefined}
          className={loading ? "invisible space-y-4" : "space-y-4"}
        >
          <h3 className="font-semibold">Release brief</h3>
          <p className="text-sm text-muted-foreground">
            A minimum footprint reserves space; compose a Skeleton overlay when
            loading so the draft stays mounted.
          </p>
          <label
            htmlFor="spacer-reserve-note"
            className="block text-sm font-medium"
          >
            Draft note
          </label>
          <Input
            id="spacer-reserve-note"
            defaultValue="Confirm the external collaborator policy."
          />
        </div>
        {loading && (
          <Skeleton
            aria-label="Reloading release brief…"
            className="absolute inset-4 h-auto w-auto"
          />
        )}
      </KiraSpacer>
      <p className="text-sm text-muted-foreground">
        Type a note, start reload, then finish. The draft returns without a
        remount.
      </p>
    </VStack>
  );
}

const ReserveDemoCode =
  'import * as React from "react";\nimport { HStack, VStack } from "@/components/ui/stack";\nimport { KiraSpacer } from "@/components/ui/spacer";\nimport { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\nimport { Skeleton } from "@/components/ui/skeleton";\n\nexport function ReserveDemo() {\n  const [loading, setLoading] = React.useState(false);\n  return <VStack gap={4} className="w-full max-w-lg">\n    <HStack wrap gap={2}><Button variant="outline" disabled={loading} onClick={() => setLoading(true)}>Start reload</Button><Button variant="outline" disabled={!loading} onClick={() => setLoading(false)}>Finish reload</Button></HStack>\n    <KiraSpacer mode="reserve" minHeight="12rem" className="relative rounded-lg border p-4">\n      <div aria-hidden={loading || undefined} inert={loading || undefined} className={loading ? "invisible space-y-4" : "space-y-4"}><h3 className="font-semibold">Release brief</h3><p className="text-sm text-muted-foreground">A minimum footprint reserves space; compose a Skeleton overlay when loading so the draft stays mounted.</p><label htmlFor="spacer-reserve-note" className="block text-sm font-medium">Draft note</label><Input id="spacer-reserve-note" defaultValue="Confirm the external collaborator policy." /></div>\n      {loading && <Skeleton aria-label="Reloading release brief…" className="absolute inset-4 h-auto w-auto" />}\n    </KiraSpacer>\n    <p className="text-sm text-muted-foreground">Type a note, start reload, then finish. The draft returns without a remount.</p>\n  </VStack>;\n}';

function NativeDemo() {
  const spacerRef = React.useRef<HTMLSpanElement>(null);
  const [tag, setTag] = React.useState("Read the decorative element.");

  return (
    <div className="space-y-3">
      <HStack gap={0} align="center">
        <span>Owner</span>
        <Spacer as="span" ref={spacerRef} render={<span />} size={4} />
        <span>Reviewer</span>
      </HStack>
      <Button
        variant="outline"
        onClick={() =>
          setTag(spacerRef.current?.tagName.toLowerCase() ?? "No element")
        }
      >
        Read native ref
      </Button>
      <output className="ml-3 text-sm text-muted-foreground">{tag}</output>
    </div>
  );
}

const NativeDemoCode =
  'import * as React from "react";\nimport { HStack } from "@/components/ui/stack";\nimport { Spacer } from "@/components/ui/spacer";\nimport { Button } from "@/components/ui/button";\n\nexport function NativeDemo() {\n  const spacerRef = React.useRef<HTMLSpanElement>(null);\n  const [tag, setTag] = React.useState("Read the decorative element.");\n  return <div className="space-y-3">\n    <HStack gap={0} align="center"><span>Owner</span><Spacer as="span" ref={spacerRef} render={<span />} size={4} /><span>Reviewer</span></HStack>\n    <Button variant="outline" onClick={() => setTag(spacerRef.current?.tagName.toLowerCase() ?? "No element")}>Read native ref</Button>\n    <output className="ml-3 text-sm text-muted-foreground">{tag}</output>\n  </div>;\n}';

function StatesDemo() {
  return (
    <VStack gap={4} className="w-full max-w-80">
      <HStack gap={0} align="center">
        <span className="text-sm">Zero</span>
        <Spacer size={0} />
        <span className="text-sm">gap</span>
      </HStack>
      <HStack gap={0} align="center" className="max-w-full">
        <span className="min-w-0 text-sm">
          A-long-release-label-that-must-wrap-in-a-narrow-footer
        </span>
        <Spacer size={6} />
        <span className="shrink-0 text-sm">Ready</span>
      </HStack>
      <VStack gap={0} className="h-40 rounded-lg border p-3">
        <p className="text-sm">Review summary</p>
        <Spacer axis="vertical" />
        <p className="text-sm">Footer follows free space</p>
      </VStack>
      <KiraSpacer mode="reserve" minHeight="6rem">
        <Skeleton className="h-24 w-full" />
      </KiraSpacer>
    </VStack>
  );
}

const StatesDemoCode =
  'import { HStack, VStack } from "@/components/ui/stack";\nimport { Spacer, KiraSpacer } from "@/components/ui/spacer";\nimport { Skeleton } from "@/components/ui/skeleton";\n\nexport function StatesDemo() {\n  return <VStack gap={4} className="w-full max-w-80">\n    <HStack gap={0} align="center"><span className="text-sm">Zero</span><Spacer size={0} /><span className="text-sm">gap</span></HStack>\n    <HStack gap={0} align="center" className="max-w-full"><span className="min-w-0 text-sm">A-long-release-label-that-must-wrap-in-a-narrow-footer</span><Spacer size={6} /><span className="shrink-0 text-sm">Ready</span></HStack>\n    <VStack gap={0} className="h-40 rounded-lg border p-3"><p className="text-sm">Review summary</p><Spacer axis="vertical" /><p className="text-sm">Footer follows free space</p></VStack>\n    <KiraSpacer mode="reserve" minHeight="6rem"><Skeleton className="h-24 w-full" /></KiraSpacer>\n  </VStack>;\n}';

const demos = [
  {
    value: "basic",
    label: "Basic",
    description:
      "Automatic flex space separates a toolbar title from its action.",
    Demo: BasicDemo,
    code: BasicDemoCode,
  },
  {
    value: "fixed",
    label: "Fixed",
    description: "Fixed horizontal and vertical gaps with zero parent gap.",
    Demo: FixedDemo,
    code: FixedDemoCode,
  },
  {
    value: "scale",
    label: "Scale",
    description: "Every supported size, including explicit zero.",
    Demo: ScaleDemo,
    code: ScaleDemoCode,
  },
  {
    value: "responsive",
    label: "Responsive",
    description: "Size and axis follow the same responsive layout change.",
    Demo: ResponsiveDemo,
    code: ResponsiveDemoCode,
  },
  {
    value: "fluid",
    label: "Fluid",
    description: "A parent-relative gap bounded by existing spacing tokens.",
    Demo: FluidDemo,
    code: FluidDemoCode,
  },
  {
    value: "safe-area",
    label: "Safe area",
    description: "Optional physical-device safe-area addition.",
    Demo: SafeAreaDemo,
    code: SafeAreaDemoCode,
  },
  {
    value: "kira",
    label: "Kira",
    description:
      "Reserve a footprint and retain a draft beneath a loading mask.",
    Demo: ReserveDemo,
    code: ReserveDemoCode,
  },
  {
    value: "native",
    label: "Native",
    description: "A decorative span render adapter and its native ref.",
    Demo: NativeDemo,
    code: NativeDemoCode,
  },
  {
    value: "states",
    label: "States",
    description:
      "Zero gap, fixed-space shrinking, long labels, vertical auto and initial loading.",
    Demo: StatesDemo,
    code: StatesDemoCode,
  },
];

const nativeApi = [
  {
    prop: "as / render / ref",
    type: '"div" | "span" / useRender.RenderProp / native element ref',
    default: '"div"',
    description: "Base UI composition for the selected native tag.",
  },
  {
    prop: "className / style",
    type: "string / React.CSSProperties",
    description:
      "Caller classes and styles; CSS custom lengths can override the footprint.",
  },
];

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function SpacerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Spacer"
        description="Explicit, responsive and fluid space, plus stable footprints for deferred content."
        version="2.0.0"
      />
      <FeatureGrid
        features={[
          {
            title: "Explicit spacing",
            description: "Zero and fixed sizes use the existing spacing scale.",
            icon: <IconSpacingHorizontal className="size-5" />,
          },
          {
            title: "Bounded fluid gaps",
            description: "KiraSpacer clamps a preferred CSS length.",
            icon: <IconArrowsHorizontal className="size-5" />,
          },
          {
            title: "Responsive axes",
            description: "Size, axis and optional device insets.",
            icon: <IconDeviceMobile className="size-5" />,
          },
          {
            title: "Reserved content",
            description: "A loading footprint retains supplied draft content.",
            icon: <IconHourglass className="size-5" />,
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
        description="Decorative spacing has no keyboard interaction; reserved content retains its own controls."
        shortcuts={[
          {
            keys: "Tab / Shift + Tab",
            description:
              "Skip Spacer and fluid KiraSpacer; they are decorative and inert.",
          },
          {
            keys: "Enter / Space",
            description:
              "Use the local filter, width and reload controls through shared Base UI Button behavior.",
          },
          {
            keys: "Type, reload, finish",
            description:
              "In Kira, the draft stays mounted. Loading hides and makes the content inert until finish; reload controls stay available.",
          },
        ]}
      />
      <UsageBlock
        code={
          'import { HStack, VStack } from "@/components/ui/stack";\nimport { Spacer, KiraSpacer, spacerVariants, spacerReserveVariants } from "@/components/ui/spacer";\n\nexport function SpacingPatterns() {\n  return <VStack gap={6}>\n    <HStack gap={0}><span>Owner</span><Spacer /><span>Reviewer</span></HStack>\n    <Spacer size={{ base: 4, md: 8 }} axis="vertical" />\n    <KiraSpacer axis="vertical" min={4} max={24} preferred="5vw" safeArea="bottom" />\n    <KiraSpacer mode="reserve" minHeight="12rem"><p>Deferred release brief</p></KiraSpacer>\n    <div aria-hidden="true" className={spacerVariants({ axis: "horizontal", flexible: true })} />\n    <div className={spacerReserveVariants()} style={{ minHeight: "12rem" }}>Reserved frame</div>\n  </VStack>;\n}'
        }
      />
      <APIReference
        sections={[
          {
            title: "Spacer",
            props: [
              ...nativeApi,
              {
                prop: "size",
                type: 'LayoutResponsiveValue<0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | "auto">',
                default: '"auto"',
                description:
                  "Fixed sizes do not shrink; auto consumes free space along the parent flex direction. Breakpoint-only objects inherit the default below their first breakpoint.",
              },
              {
                prop: "axis",
                type: 'LayoutResponsiveValue<"horizontal" | "vertical">',
                default: '"horizontal"',
                description:
                  "The dimension used for fixed sizes; auto follows the parent flex direction.",
              },
              {
                prop: "children / tabIndex",
                type: "never",
                description:
                  "Decorative Spacer has no content or tab stop; aria-hidden and inert are enforced.",
              },
            ],
          },
          {
            title: "KiraSpacer — fluid",
            props: [
              ...nativeApi,
              {
                prop: "mode",
                type: '"fluid"',
                default: '"fluid"',
                description: "Decorative bounded CSS spacing.",
              },
              {
                prop: "min / max",
                type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24",
                default: "4 / 24",
                description:
                  "Existing spacing tokens; max below min is normalized to min.",
              },
              {
                prop: "preferred",
                type: "string",
                default: '"5vw"',
                description:
                  "Preferred CSS length in clamp(). cqw needs a query container supplied by the caller.",
              },
              {
                prop: "safeArea",
                type: '"none" | "top" | "right" | "bottom" | "left"',
                default: '"none"',
                description:
                  "Add the selected physical safe-area inset to the clamped gap.",
              },
              {
                prop: "axis",
                type: 'LayoutResponsiveValue<"horizontal" | "vertical">',
                default: '"horizontal"',
                description: "The dimension occupied by the fluid gap.",
              },
            ],
          },
          {
            title: "KiraSpacer — reserve",
            props: [
              ...nativeApi,
              {
                prop: "mode",
                type: '"reserve"',
                description:
                  "Required for accessible deferred content; the root is not decorative or inert.",
              },
              {
                prop: "minHeight",
                type: "string",
                default: '"6rem"',
                description:
                  "Minimum block footprint. Reserve enough for final content; taller content can still grow.",
              },
              {
                prop: "children / contentClassName",
                type: "React.ReactNode / string",
                description:
                  "Content inside the reserved footprint; compose Skeleton directly when loading. Style the spacer-reserve-content wrapper via contentClassName.",
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
                title: "Stripped loading props from KiraSpacer",
                description:
                  'Removed loading, loadingLabel, and loadingContent (and the Skeleton import) from KiraSpacer mode="reserve" so spacer remains a zero-dependency layout leaf. Compose Skeleton directly inside children when needed.',
              },
            ],
          },
          {
            version: "2.0.0",
            date: "15 November 2026",
            changes: [
              {
                type: "fixed",
                title: "Explicit sizes and decorative contract",
                description:
                  "Zero dimensions, fixed-size shrink protection, typed native refs/render adapters and exported variants. Audited against Base UI 1.9.0.",
              },
              {
                type: "added",
                title: "Responsive and reserved spacing",
                description:
                  "Responsive size/axis, KiraSpacer fluid clamp/device insets and a retained reserved-content mode with shared Skeleton. Research cutoff October 31, 2026.",
              },
              {
                type: "breaking",
                title: "Finite sizes and empty decoration",
                description:
                  "Arbitrary numeric sizes are replaced by the supported spacing union. Decorative Spacer rejects children/tabIndex and enforces hidden/inert semantics; use KiraSpacer mode=reserve for content. Fixed sizes no longer shrink.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
