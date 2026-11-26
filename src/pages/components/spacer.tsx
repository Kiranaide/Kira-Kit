import type { ComponentProps as ReactComponentProps } from "react";
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

const basicCode = `import * as React from "react";
import { HStack } from "@/components/ui/stack";
import { Spacer } from "@/components/ui/spacer";
import { Button } from "@/components/ui/button";

export function BasicDemo() {
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
}`;

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

const fixedCode = `import { HStack, VStack } from "@/components/ui/stack";
import { Spacer } from "@/components/ui/spacer";

export function FixedDemo() {
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
    </div>
  );
}`;

function ScaleDemo() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {spacerSizes.map((size) => (
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

const scaleCode = `import { HStack } from "@/components/ui/stack";
import { Spacer } from "@/components/ui/spacer";

const sizes = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24] as const;

export function ScaleDemo() {
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
}`;

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

const responsiveCode = `import { Stack } from "@/components/ui/stack";
import { Spacer } from "@/components/ui/spacer";

export function ResponsiveDemo() {
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
}`;

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

const fluidCode = `import * as React from "react";
import { HStack } from "@/components/ui/stack";
import { KiraSpacer } from "@/components/ui/spacer";
import { Button } from "@/components/ui/button";

export function FluidDemo() {
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
    </div>
  );
}`;

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

const safeAreaCode = `import { VStack } from "@/components/ui/stack";
import { KiraSpacer } from "@/components/ui/spacer";

export function SafeAreaDemo() {
  return (
    <VStack gap={0} className="w-full max-w-md rounded-lg border p-4">
      <p className="text-sm font-medium">Invitation review footer</p>
      <p className="text-sm text-muted-foreground">
        Place a vertical inset below footer content when the host uses viewport-fit=cover.
      </p>
      <KiraSpacer
        axis="vertical"
        min={4}
        max={8}
        preferred="4vw"
        safeArea="bottom"
      />
    </VStack>
  );
}`;

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

const reserveCode = `import * as React from "react";
import { HStack, VStack } from "@/components/ui/stack";
import { KiraSpacer } from "@/components/ui/spacer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export function ReserveDemo() {
  const [loading, setLoading] = React.useState(false);

  return (
    <VStack gap={4} className="w-full max-w-lg">
      <HStack wrap gap={2}>
        <Button variant="outline" disabled={loading} onClick={() => setLoading(true)}>
          Start reload
        </Button>
        <Button variant="outline" disabled={!loading} onClick={() => setLoading(false)}>
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
          <label htmlFor="spacer-reserve-note" className="block text-sm font-medium">
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
    </VStack>
  );
}`;

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

const nativeCode = `import * as React from "react";
import { HStack } from "@/components/ui/stack";
import { Spacer } from "@/components/ui/spacer";
import { Button } from "@/components/ui/button";

export function NativeDemo() {
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
}`;

function StressDemo() {
  return (
    <VStack gap={4} className="w-full max-w-xs">
      <HStack gap={0} align="center">
        <span className="text-sm">Zero</span>
        <Spacer size={0} />
        <span className="text-sm">gap</span>
      </HStack>
      <HStack gap={0} align="center" className="max-w-full">
        <span className="min-w-0 text-sm wrap-anywhere">
          A-long-release-label-that-must-wrap-in-a-narrow-footer
        </span>
        <Spacer size={6} />
        <Button size="sm" variant="outline" disabled className="shrink-0">
          Locked
        </Button>
      </HStack>
      <VStack gap={0} className="h-40 rounded-lg border p-3">
        <p className="text-sm">Review summary</p>
        <Spacer axis="vertical" />
        <p className="text-sm">Footer follows free space</p>
      </VStack>
      <KiraSpacer
        mode="reserve"
        minHeight="6rem"
        className="rounded-lg border p-3"
      >
        <Skeleton className="h-24 w-full" />
      </KiraSpacer>
      <KiraSpacer
        mode="reserve"
        minHeight="4rem"
        className="rounded-lg border border-dashed p-3"
      />
    </VStack>
  );
}

const stressCode = `import { HStack, VStack } from "@/components/ui/stack";
import { Spacer, KiraSpacer } from "@/components/ui/spacer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function StressDemo() {
  return (
    <VStack gap={4} className="w-full max-w-xs">
      <HStack gap={0} align="center">
        <span className="text-sm">Zero</span>
        <Spacer size={0} />
        <span className="text-sm">gap</span>
      </HStack>
      <HStack gap={0} align="center" className="max-w-full">
        <span className="min-w-0 text-sm wrap-anywhere">
          A-long-release-label-that-must-wrap-in-a-narrow-footer
        </span>
        <Spacer size={6} />
        <Button size="sm" variant="outline" disabled className="shrink-0">
          Locked
        </Button>
      </HStack>
      <VStack gap={0} className="h-40 rounded-lg border p-3">
        <p className="text-sm">Review summary</p>
        <Spacer axis="vertical" />
        <p className="text-sm">Footer follows free space</p>
      </VStack>
      <KiraSpacer mode="reserve" minHeight="6rem" className="rounded-lg border p-3">
        <Skeleton className="h-24 w-full" />
      </KiraSpacer>
      <KiraSpacer
        mode="reserve"
        minHeight="4rem"
        className="rounded-lg border border-dashed p-3"
      />
    </VStack>
  );
}`;

const usageCode = `import { HStack, VStack } from "@/components/ui/stack";
import {
  Spacer,
  KiraSpacer,
  spacerVariants,
  spacerReserveVariants,
} from "@/components/ui/spacer";

export function SpacingPatterns() {
  return (
    <VStack gap={6}>
      <HStack gap={0}>
        <span>Owner</span>
        <Spacer />
        <span>Reviewer</span>
      </HStack>
      <Spacer size={{ base: 4, md: 8 }} axis="vertical" />
      <KiraSpacer
        axis="vertical"
        min={4}
        max={24}
        preferred="5vw"
        safeArea="bottom"
      />
      <KiraSpacer mode="reserve" minHeight="12rem">
        <p>Deferred release brief</p>
      </KiraSpacer>
      <div
        aria-hidden="true"
        className={spacerVariants({ axis: "horizontal", flexible: true })}
      />
      <div className={spacerReserveVariants()} style={{ minHeight: "12rem" }}>
        Reserved frame
      </div>
    </VStack>
  );
}`;

export default function SpacerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Spacer"
        description="Explicit, responsive and fluid space, plus stable footprints for deferred content."
        version="v3.0.0"
      />
      <FeatureGrid
        features={spacerPageFeatures}
        description="Capabilities built into Kira Kit Spacer."
      />
      <DemoTabs defaultValue="basic" tabs={spacerPageDemoTabs} />
      <KeyboardShortcuts
        description="Decorative spacing has no keyboard interaction; reserved content retains its own controls."
        shortcuts={spacerPageShortcuts}
      />
      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Use Spacer for fixed or flexible layout gaps, and KiraSpacer for fluid clamps, safe-area insets, or reserved footprints."
        notes={[
          {
            label: "KiraSpacer",
            body: 'Defaults to mode="fluid" for clamped CSS lengths. Pass mode="reserve" to hold a minimum block footprint around deferred content.',
          },
          {
            label: "Variant helpers",
            body: "spacerVariants and spacerReserveVariants are exported for custom wrappers.",
          },
        ]}
      />
      <APIReference
        sections={spacerPageAPISections}
        description="Props, types, and defaults for Spacer and KiraSpacer."
      />
      <Changelog
        entries={spacerPageChangelogEntries}
        title="Changelog"
        description="Version history for Spacer."
      />
    </ComponentPage>
  );
}

const spacerSizes = [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24] as const;

const spacerPageFeatures = [
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
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const spacerPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Basic"
        description="Automatic flex space separates a toolbar title from its action."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "fixed",
    label: "Fixed",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Fixed"
        description="Fixed horizontal and vertical gaps with zero parent gap."
        code={fixedCode}
      >
        <FixedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "scale",
    label: "Scale",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Scale"
        description="Every supported size, including explicit zero."
        code={scaleCode}
      >
        <ScaleDemo />
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
        description="Size and axis follow the same responsive layout change."
        code={responsiveCode}
      >
        <ResponsiveDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "fluid",
    label: "Fluid",
    group: "KiraSpacer",
    demo: (
      <DemoWrapper
        title="Fluid"
        description="A parent-relative gap bounded by existing spacing tokens."
        code={fluidCode}
      >
        <FluidDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "safe-area",
    label: "Safe area",
    group: "KiraSpacer",
    demo: (
      <DemoWrapper
        title="Safe area"
        description="Optional physical-device safe-area addition."
        code={safeAreaCode}
      >
        <SafeAreaDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Reserve",
    group: "KiraSpacer",
    demo: (
      <DemoWrapper
        title="Reserve"
        description="Reserve a footprint and retain a draft beneath a loading mask."
        code={reserveCode}
      >
        <ReserveDemo />
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
        description="A decorative span render adapter and its native ref."
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
        description="Zero gap, long wrapping labels, disabled controls, empty reserved footprints, and vertical auto inside a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const spacerPageShortcuts = [
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
      "In KiraSpacer reserve mode, the draft stays mounted. Loading hides and makes the content inert until finish; reload controls stay available.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

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
    default: "-",
    description:
      "Caller classes and styles; CSS custom lengths can override the footprint.",
  },
];

const spacerPageAPISections = [
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
        default: "-",
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
        default: "-",
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
        default: "-",
        description:
          "Content inside the reserved footprint; compose Skeleton directly when loading. Style the spacer-reserve-content wrapper via contentClassName.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const spacerPageChangelogEntries = [
  {
    version: "3.0.0",
    date: "26 November 2026",
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
] satisfies ReactComponentProps<typeof Changelog>["entries"];
