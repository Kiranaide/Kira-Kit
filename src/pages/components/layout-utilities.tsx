import type { ComponentProps as ReactComponentProps } from "react";
import {
  IconBell,
  IconCheck,
  IconLoader2,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Flex } from "@/components/ui/flex";
import { Spacer } from "@/components/ui/spacer";
import { HStack, VStack } from "@/components/ui/stack";
import {
  APIReference,
  Changelog,
  ComponentPage,
  DemoTabs,
  DemoWrapper,
  FeatureGrid,
  KeyboardShortcuts,
  PageHeader,
  UsageBlock,
} from "@/components/docs";

function CenterTypesDemo() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="space-y-2">
        <p className="text-sm font-medium">type="flex" (default)</p>
        <Center className="h-32 rounded-lg border border-border bg-muted/30">
          <div className="rounded bg-primary/20 p-4 text-sm">Centered</div>
        </Center>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">type="grid"</p>
        <Center
          type="grid"
          className="h-32 rounded-lg border border-border bg-muted/30"
        >
          <div className="rounded bg-primary/20 p-4 text-sm">Centered</div>
        </Center>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">type="absolute"</p>
        <div className="relative h-32 rounded-lg border border-border bg-muted/30">
          <Center type="absolute">
            <div className="rounded bg-primary/20 p-4 text-sm">Centered</div>
          </Center>
        </div>
      </div>
    </div>
  );
}

const centerTypesCode = `import { Center } from "@/components/ui/center"

<Center className="h-32"><Logo /></Center>
<Center type="grid" className="min-h-64"><EmptyState /></Center>
<div className="relative h-48">
  <Center type="absolute"><Spinner /></Center>
</div>`;

function InlineCenterDemo() {
  return (
    <p className="text-sm text-foreground">
      Icon badge:
      <Center inline className="mx-2 size-8 rounded bg-primary/20">
        <IconSettings aria-hidden="true" className="size-4" />
      </Center>
      aligned inline with surrounding text.
    </p>
  );
}

const inlineCenterCode = `import { Center } from "@/components/ui/center"

<Center inline className="size-8 rounded bg-primary/20">
  <IconSettings aria-hidden="true" className="size-4" />
</Center>`;

function LoadingOverlayDemo() {
  return (
    <div className="relative h-48 rounded-lg border border-border bg-muted/30">
      <output className="absolute inset-0 block bg-background/80 backdrop-blur-sm">
        <Center className="h-full">
          <VStack gap={2} align="center">
            <IconLoader2
              aria-hidden="true"
              className="size-8 animate-spin text-primary motion-reduce:animate-none"
            />
            <span className="text-sm text-muted-foreground">Loading…</span>
          </VStack>
        </Center>
      </output>
    </div>
  );
}

const loadingOverlayCode = `import { IconLoader2 } from "@tabler/icons-react"
import { Center } from "@/components/ui/center"
import { VStack } from "@/components/ui/stack"

<div className="relative h-48 rounded-lg border border-border">
  <output className="absolute inset-0 block bg-background/80 backdrop-blur-sm">
    <Center className="h-full">
      <VStack gap={2} align="center">
        <IconLoader2 aria-hidden="true" className="size-8 animate-spin text-primary motion-reduce:animate-none" />
        <span className="text-sm text-muted-foreground">Loading…</span>
      </VStack>
    </Center>
  </output>
</div>`;

function EmptyStateDemo() {
  return (
    <Center className="h-48 rounded-lg border border-dashed border-border">
      <VStack gap={4} align="center">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <IconCheck
            aria-hidden="true"
            className="size-8 text-muted-foreground"
          />
        </div>
        <div className="text-center">
          <h4 className="font-semibold text-foreground">No items yet</h4>
          <p className="text-sm text-muted-foreground">
            Add your first item to get started
          </p>
        </div>
        <Button>Add Item</Button>
      </VStack>
    </Center>
  );
}

const emptyStateCode = `import { Button } from "@/components/ui/button"
import { Center } from "@/components/ui/center"
import { VStack } from "@/components/ui/stack"

<Center className="h-48 rounded-lg border border-dashed border-border">
  <VStack gap={4} align="center">
    <h4 className="font-semibold">No items yet</h4>
    <p className="text-sm text-muted-foreground">Add your first item to get started</p>
    <Button>Add Item</Button>
  </VStack>
</Center>`;

function AutoSpacerDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          Push elements apart
        </p>
        <Flex
          align="center"
          className="rounded-lg border border-border bg-muted/30 p-4"
        >
          <span className="font-semibold">Brand</span>
          <Spacer />
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Flex>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Multiple spacers</p>
        <Flex
          align="center"
          className="rounded-lg border border-border bg-muted/30 p-4"
        >
          <IconUser aria-hidden="true" className="size-5" />
          <Spacer />
          <span>Center Content</span>
          <Spacer />
          <IconSettings aria-hidden="true" className="size-5" />
        </Flex>
      </div>
    </div>
  );
}

const autoSpacerCode = `import { Flex } from "@/components/ui/flex"
import { Spacer } from "@/components/ui/spacer"

<Flex align="center">
  <span className="font-semibold">Brand</span>
  <Spacer />
  <Button variant="ghost" size="sm">Sign In</Button>
</Flex>`;

function FixedSpacerDemo() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Horizontal (size=8)</p>
        <HStack className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="rounded bg-primary/20 p-2">A</div>
          <Spacer size={8} axis="horizontal" />
          <div className="rounded bg-primary/20 p-2">B</div>
        </HStack>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Vertical (size=8)</p>
        <VStack className="rounded-lg border border-border bg-muted/30 p-4">
          <div className="w-full rounded bg-primary/20 p-2 text-center">A</div>
          <Spacer size={8} axis="vertical" />
          <div className="w-full rounded bg-primary/20 p-2 text-center">B</div>
        </VStack>
      </div>
    </div>
  );
}

const fixedSpacerCode = `import { Spacer } from "@/components/ui/spacer"
import { HStack, VStack } from "@/components/ui/stack"

<HStack>
  <div>A</div>
  <Spacer size={8} axis="horizontal" />
  <div>B</div>
</HStack>

<VStack>
  <div>A</div>
  <Spacer size={8} axis="vertical" />
  <div>B</div>
</VStack>`;

function NavigationHeaderDemo() {
  return (
    <Flex
      as="nav"
      aria-label="Workspace navigation preview"
      align="center"
      className="rounded-lg border border-border bg-background p-4"
    >
      <HStack gap={2} align="center">
        <div className="size-8 rounded bg-primary" />
        <span className="font-semibold">App Name</span>
      </HStack>
      <Spacer />
      <HStack gap={1}>
        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <IconBell aria-hidden="true" className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Settings">
          <IconSettings aria-hidden="true" className="size-4" />
        </Button>
      </HStack>
      <Spacer size={4} axis="horizontal" />
      <Avatar size="sm">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </Flex>
  );
}

const navigationHeaderCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Flex } from "@/components/ui/flex"
import { Spacer } from "@/components/ui/spacer"
import { HStack } from "@/components/ui/stack"

<Flex as="nav" aria-label="Workspace" align="center" className="p-4">
  <HStack gap={2} align="center">
    <div className="size-8 rounded bg-primary" />
    <span className="font-semibold">App Name</span>
  </HStack>
  <Spacer />
  <HStack gap={1}>
    <Button variant="ghost" size="icon-sm" aria-label="Notifications">
      <IconBell aria-hidden="true" className="size-4" />
    </Button>
  </HStack>
  <Spacer size={4} axis="horizontal" />
  <Avatar size="sm"><AvatarFallback>JD</AvatarFallback></Avatar>
</Flex>`;

function BoxBasicDemo() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Box p={4} bg="muted" rounded="lg">
        Box with padding
      </Box>
      <Box p={4} shadow="md" rounded="lg" bg="background" border>
        Box with shadow
      </Box>
      <Box p={4} bg="primary" color="primary-foreground" rounded="lg">
        Custom colors
      </Box>
    </div>
  );
}

const boxBasicCode = `import { Box } from "@/components/ui/box"

<Box p={4} bg="muted" rounded="lg">Box with padding</Box>
<Box p={4} shadow="md" rounded="lg" bg="background" border>Box with shadow</Box>
<Box p={4} bg="primary" color="primary-foreground" rounded="lg">Custom colors</Box>`;

function BoxRoundedDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      {boxRoundedOptions.map((rounded) => (
        <Box
          key={rounded}
          p={4}
          bg="primary/20"
          rounded={rounded}
          className="min-w-20 text-center"
        >
          <span className="text-xs">{rounded}</span>
        </Box>
      ))}
    </div>
  );
}

const boxRoundedCode = `import { Box } from "@/components/ui/box"

<Box p={4} rounded="lg">Large radius</Box>
<Box p={4} rounded="full">Pill</Box>
<Box p={4} rounded="none">No radius</Box>`;

function BoxShadowDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      {boxShadowOptions.map((shadow) => (
        <Box
          key={shadow}
          p={4}
          shadow={shadow}
          rounded="lg"
          bg="background"
          border
          className="min-w-20 text-center"
        >
          <span className="text-xs">{shadow}</span>
        </Box>
      ))}
    </div>
  );
}

const boxShadowCode = `import { Box } from "@/components/ui/box"

<Box p={4} shadow="sm" border>Small shadow</Box>
<Box p={4} shadow="md" border>Medium shadow</Box>
<Box p={4} shadow="lg" border>Large shadow</Box>`;

function SemanticBoxDemo() {
  return (
    <Box as="article" p={6} rounded="lg" border shadow="sm" bg="background">
      <h4 className="mb-2 font-semibold">Article Title</h4>
      <p className="text-sm text-muted-foreground">
        This Box renders as an &lt;article&gt; element for semantic HTML.
      </p>
    </Box>
  );
}

const semanticBoxCode = `import { Box } from "@/components/ui/box"

<Box as="article" p={6} rounded="lg" border shadow="sm">
  <h2>Article Title</h2>
  <p>Content</p>
</Box>`;

function QuickCardDemo() {
  return (
    <Box
      p={6}
      rounded="xl"
      shadow="lg"
      bg="background"
      border
      className="max-w-sm"
    >
      <HStack gap={4} align="start">
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <VStack gap={1} className="min-w-0 flex-1">
          <span className="font-semibold">John Doe</span>
          <span className="text-sm text-muted-foreground">
            Software Engineer
          </span>
          <HStack gap={2} className="mt-2">
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">TypeScript</Badge>
          </HStack>
        </VStack>
      </HStack>
    </Box>
  );
}

const quickCardCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Box } from "@/components/ui/box"
import { HStack, VStack } from "@/components/ui/stack"

<Box p={6} rounded="xl" shadow="lg" bg="background" border>
  <HStack gap={4} align="start">
    <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
    <VStack gap={1} className="min-w-0 flex-1">
      <span className="font-semibold">John Doe</span>
      <span className="text-sm text-muted-foreground">Software Engineer</span>
    </VStack>
  </HStack>
</Box>`;

function NotificationBoxDemo() {
  return (
    <Box
      p={4}
      rounded="lg"
      bg="primary/10"
      border
      className="max-w-md border-primary/20"
    >
      <HStack gap={3}>
        <Center className="size-10 shrink-0 rounded-full bg-primary/20">
          <IconCheck aria-hidden="true" className="size-5 text-primary" />
        </Center>
        <VStack gap={0} className="min-w-0 flex-1">
          <span className="font-medium">Success</span>
          <span className="text-sm text-muted-foreground">
            Your changes have been saved.
          </span>
        </VStack>
      </HStack>
    </Box>
  );
}

const notificationBoxCode = `import { IconCheck } from "@tabler/icons-react"
import { Box } from "@/components/ui/box"
import { Center } from "@/components/ui/center"
import { HStack, VStack } from "@/components/ui/stack"

<Box p={4} rounded="lg" bg="primary/10" border className="border-primary/20">
  <HStack gap={3}>
    <Center className="size-10 shrink-0 rounded-full bg-primary/20">
      <IconCheck aria-hidden="true" className="size-5 text-primary" />
    </Center>
    <VStack gap={0} className="min-w-0 flex-1">
      <span className="font-medium">Success</span>
      <span className="text-sm text-muted-foreground">Your changes have been saved.</span>
    </VStack>
  </HStack>
</Box>`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <Flex
        align="center"
        gap={2}
        className="rounded-lg border border-border bg-muted/30 p-3"
      >
        <span className="min-w-0 truncate text-sm font-medium">
          VeryLongWorkspaceHeaderTitleThatMustTruncateCleanly
        </span>
        <Spacer />
        <Button size="sm" variant="outline" disabled>
          Locked
        </Button>
      </Flex>
      <Center className="min-h-24 rounded-lg border border-dashed border-border p-3">
        <p className="text-center text-xs text-muted-foreground">
          Empty-content fallback stays safely centered without clipping inside
          max-w-xs.
        </p>
      </Center>
      <Box p={3} rounded="lg" border bg="background" className="min-h-12">
        <span className="sr-only">Empty box slot</span>
      </Box>
    </div>
  );
}

const stressCode = `// Narrow max-w-xs container: long flex title truncation, disabled action, empty Box
<div className="max-w-xs space-y-4">
  <Flex align="center" gap={2} className="rounded-lg border p-3">
    <span className="min-w-0 truncate text-sm font-medium">
      VeryLongWorkspaceHeaderTitleThatMustTruncateCleanly
    </span>
    <Spacer />
    <Button size="sm" variant="outline" disabled>Locked</Button>
  </Flex>
</div>`;

const usageCode = `import { Box } from "@/components/ui/box"
import { Center } from "@/components/ui/center"
import { Flex } from "@/components/ui/flex"
import { Spacer } from "@/components/ui/spacer"

export function ToolbarLayout() {
  return (
    <Box p={4} rounded="lg" border bg="card">
      <Flex align="center" gap={2}>
        <Center className="size-8 rounded bg-primary/15">K</Center>
        <span className="font-medium">Kira Kit</span>
        <Spacer />
        <span className="text-xs text-muted-foreground">v1.0.0</span>
      </Flex>
    </Box>
  )
}`;

export default function LayoutUtilitiesPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Layout Utilities"
        description="Composite guide for Center, Spacer, and Box — lightweight layout primitives for centering, flexible spacing, and semantic surfaces."
        version="v1.0.0"
      />

      <FeatureGrid
        features={layoutUtilitiesPageFeatures}
        description="Layout helpers that compose cleanly without extra wrapper divs or tab stops."
      />

      <DemoTabs
        defaultValue="center-types"
        tabs={layoutUtilitiesPageDemoTabs}
      />

      <KeyboardShortcuts
        shortcuts={layoutUtilitiesPageShortcuts}
        description="Layout primitives preserve natural document order and never introduce stray tab stops."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Compose Center, Spacer, and Box together for headers, empty states, and cards."
        notes={layoutUtilitiesPageUsageNotes}
      />

      <APIReference
        sections={layoutUtilitiesPageAPISections}
        description="Core props for Center, Spacer, and Box. See each primitive's dedicated page for full variant recipes."
      />

      <Changelog
        entries={layoutUtilitiesPageChangelogEntries}
        title="Changelog"
        description="Version history for the layout utilities guide."
      />
    </ComponentPage>
  );
}

const boxRoundedOptions = [
  "none",
  "sm",
  "default",
  "md",
  "lg",
  "xl",
  "2xl",
  "full",
] as const;

const boxShadowOptions = [
  "none",
  "sm",
  "default",
  "md",
  "lg",
  "xl",
  "2xl",
] as const;

const layoutUtilitiesPageFeatures = [
  {
    title: "Flexible Centering",
    description:
      "Flex, grid, and absolute centering strategies with overflow-safe alignment.",
  },
  {
    title: "Smart Spacing",
    description:
      "Auto spacers push siblings apart in flex rows; fixed spacers add deterministic gaps.",
  },
  {
    title: "Polymorphic Box",
    description:
      "Render semantic HTML landmarks with typed spacing, radius, and elevation props.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const layoutUtilitiesPageDemoTabs = [
  {
    value: "center-types",
    label: "Center Types",
    group: "Center",
    demo: (
      <DemoWrapper
        title="Centering Strategies"
        description="Choose between flex, grid, or absolute positioning for centering content."
        code={centerTypesCode}
      >
        <CenterTypesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "inline-center",
    label: "Inline Center",
    group: "Center",
    demo: (
      <DemoWrapper
        title="Inline Centering"
        description="Center icons or badges inline with surrounding copy."
        code={inlineCenterCode}
      >
        <InlineCenterDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "loading-overlay",
    label: "Loading Overlay",
    group: "Center",
    demo: (
      <DemoWrapper
        title="Loading State Overlay"
        description="Center a reduced-motion-safe status overlay inside a relative container."
        code={loadingOverlayCode}
      >
        <LoadingOverlayDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "empty-state",
    label: "Empty State",
    group: "Center",
    demo: (
      <DemoWrapper
        title="Empty State Pattern"
        description="Center empty-state feedback and primary recovery actions."
        code={emptyStateCode}
      >
        <EmptyStateDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "auto-spacer",
    label: "Auto Spacer",
    group: "Spacer",
    demo: (
      <DemoWrapper
        title="Auto Spacer"
        description="Push siblings apart using flex: 1."
        code={autoSpacerCode}
      >
        <AutoSpacerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "fixed-spacer",
    label: "Fixed Spacer",
    group: "Spacer",
    demo: (
      <DemoWrapper
        title="Fixed Size Spacer"
        description="Insert explicit horizontal or vertical spacing steps."
        code={fixedSpacerCode}
      >
        <FixedSpacerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "nav-header",
    label: "Nav Header",
    group: "Spacer",
    demo: (
      <DemoWrapper
        title="Navigation Header"
        description="Semantic nav bar combining Flex, Spacer, labelled icon actions, and Avatar."
        code={navigationHeaderCode}
      >
        <NavigationHeaderDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "box-basic",
    label: "Box Basic",
    group: "Box",
    demo: (
      <DemoWrapper
        title="Basic Box Usage"
        description="Padding, borders, elevation, and semantic color props."
        code={boxBasicCode}
      >
        <BoxBasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "box-rounded",
    label: "Box Rounded",
    group: "Box",
    demo: (
      <DemoWrapper
        title="Border Radius"
        description="Rounded variants from none to full."
        code={boxRoundedCode}
      >
        <BoxRoundedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "box-shadow",
    label: "Box Shadow",
    group: "Box",
    demo: (
      <DemoWrapper
        title="Box Shadow"
        description="Elevation steps from none to 2xl with border definition for dark mode."
        code={boxShadowCode}
      >
        <BoxShadowDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "semantic-box",
    label: "Semantic Box",
    group: "Box",
    demo: (
      <DemoWrapper
        title="Semantic HTML"
        description="Use the as prop to render article, section, or aside landmarks."
        code={semanticBoxCode}
      >
        <SemanticBoxDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "quick-card",
    label: "Quick Card",
    group: "Patterns",
    demo: (
      <DemoWrapper
        title="Quick Card Pattern"
        description="Compose profile cards quickly using Box and Stack."
        code={quickCardCode}
      >
        <QuickCardDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "notification-box",
    label: "Notification",
    group: "Patterns",
    demo: (
      <DemoWrapper
        title="Notification Box"
        description="Compact inline status surface built from Box, Center, and Stack."
        code={notificationBoxCode}
      >
        <NotificationBoxDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stress",
    label: "Stress Cases",
    group: "Patterns",
    demo: (
      <DemoWrapper
        title="Stress Cases"
        description="Long flex title truncation, disabled action, empty Box slot, and narrow max-w-xs centering."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const layoutUtilitiesPageShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    group: "Navigation",
    description:
      "Move through child interactive controls in DOM order; Center, Spacer, and Box add no tab stops of their own.",
  },
  {
    keys: "Enter / Space",
    group: "Activation",
    description:
      "Activate interactive buttons placed inside layout headers or empty states.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const layoutUtilitiesPageUsageNotes = [
  {
    label: "Individual primitives",
    body: "Need viewport-safe centering, container queries, or Kira* wrappers? Visit the dedicated Center, Spacer, and Box pages.",
  },
  {
    label: "Overflow safety",
    body: "Always pair min-w-0 on flex children beside Spacer so long text truncates instead of pushing trailing actions off-screen.",
  },
] satisfies NonNullable<ReactComponentProps<typeof UsageBlock>["notes"]>;

const layoutUtilitiesPageAPISections = [
  {
    title: "Center",
    props: [
      {
        prop: "type",
        type: '"flex" | "grid" | "absolute"',
        default: '"flex"',
        description: "Centering strategy.",
      },
      {
        prop: "inline",
        type: "boolean",
        default: "false",
        description: "Use inline-flex or inline-grid sizing.",
      },
      {
        prop: "as",
        type: "CenterElement",
        default: '"div"',
        description: "Semantic HTML element to render.",
      },
    ],
  },
  {
    title: "Spacer",
    props: [
      {
        prop: "size",
        type: 'number | "auto"',
        default: '"auto"',
        description: "Fixed scale step or auto flex growth.",
      },
      {
        prop: "axis",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Axis applied when size is fixed.",
      },
    ],
  },
  {
    title: "Box",
    props: [
      {
        prop: "as",
        type: "BoxElement",
        default: '"div"',
        description: "Semantic HTML landmark or container tag.",
      },
      {
        prop: "p / px / py",
        type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12",
        default: "-",
        description: "Tokenized padding shortcuts.",
      },
      {
        prop: "rounded / shadow",
        type: "RoundedVariant / ShadowVariant",
        default: "-",
        description: "Corner radius and elevation scale props.",
      },
      {
        prop: "bg / color / border",
        type: "string / boolean",
        default: "-",
        description: "Semantic surface, text, and border styling props.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const layoutUtilitiesPageChangelogEntries = [
  {
    version: "1.0.0",
    date: "26 November 2026",
    changes: [
      {
        type: "added",
        title: "Layout utilities composite guide",
        description:
          "Grouped Center, Spacer, and Box patterns with reduced-motion loading overlays, labelled navigation controls, usage guidance, and stress cases.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
