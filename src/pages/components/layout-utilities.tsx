import { Center } from "@/components/ui/center";
import { Spacer } from "@/components/ui/spacer";
import { Box } from "@/components/ui/box";
import { Flex } from "@/components/ui/flex";
import { HStack, VStack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  IconLoader2,
  IconCheck,
  IconSettings,
  IconBell,
  IconUser,
} from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  APIReference,
} from "@/components/docs";

function CenterTypesDemo() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">type="flex" (default)</p>
          <Center className="h-32 border rounded-lg bg-muted/30">
            <div className="p-4 bg-primary/20 rounded">Centered</div>
          </Center>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">type="grid"</p>
          <Center type="grid" className="h-32 border rounded-lg bg-muted/30">
            <div className="p-4 bg-primary/20 rounded">Centered</div>
          </Center>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-medium">type="absolute"</p>
          <div className="h-32 border rounded-lg bg-muted/30 relative">
            <Center type="absolute">
              <div className="p-4 bg-primary/20 rounded">Centered</div>
            </Center>
          </div>
        </div>
      </div>
    </div>
  );
}

const centerTypesCode = `import { Center } from "@/components/ui/center"

// Flex centering (default)
<Center className="h-screen">
  <Logo />
</Center>

// Grid centering
<Center type="grid" className="min-h-64">
  <EmptyState />
</Center>

// Absolute centering (for overlays)
<div className="relative h-96">
  <Center type="absolute">
    <Spinner />
  </Center>
</div>`;

function InlineCenterDemo() {
  return (
    <div>
      Icon button:
      <Center inline className="size-8 bg-primary/20 rounded mx-2">
        <IconSettings className="size-4" />
      </Center>
      with text around it.
    </div>
  );
}

const inlineCenterCode = `import { Center } from "@/components/ui/center"

// Inline centering
<Center inline className="size-8">
  <Icon />
</Center>`;

function LoadingOverlayDemo() {
  return (
    <div className="h-48 border rounded-lg bg-muted/30 relative">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm">
        <Center className="h-full">
          <VStack gap={2} align="center">
            <IconLoader2 className="size-8 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Loading...</span>
          </VStack>
        </Center>
      </div>
    </div>
  );
}

const loadingOverlayCode = `import { Center } from "@/components/ui/center"
import { VStack } from "@/components/ui/stack"

// Loading overlay
<div className="relative h-48">
  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm">
    <Center className="h-full">
      <VStack gap={2} align="center">
        <IconLoader2 className="size-8 animate-spin text-primary" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </VStack>
    </Center>
  </div>
</div>`;

function EmptyStateDemo() {
  return (
    <Center className="h-48 border rounded-lg border-dashed">
      <VStack gap={4} align="center">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center">
          <IconCheck className="size-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h4 className="font-semibold">No items yet</h4>
          <p className="text-sm text-muted-foreground">
            Add your first item to get started
          </p>
        </div>
        <Button>Add Item</Button>
      </VStack>
    </Center>
  );
}

const emptyStateCode = `import { Center } from "@/components/ui/center"
import { VStack } from "@/components/ui/stack"

// Empty state
<Center className="h-48 border rounded-lg border-dashed">
  <VStack gap={4} align="center">
    <div className="size-16 rounded-full bg-muted flex items-center justify-center">
      <IconCheck className="size-8 text-muted-foreground" />
    </div>
    <div className="text-center">
      <h4 className="font-semibold">No items yet</h4>
      <p className="text-sm text-muted-foreground">Add your first item to get started</p>
    </div>
    <Button>Add Item</Button>
  </VStack>
</Center>`;

function AutoSpacerDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Push elements apart
        </p>
        <Flex align="center" className="p-4 border rounded-lg bg-muted/30">
          <span className="font-semibold">Brand</span>
          <Spacer />
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Multiple spacers</p>
        <Flex align="center" className="p-4 border rounded-lg bg-muted/30">
          <IconUser className="size-5" />
          <Spacer />
          <span>Center Content</span>
          <Spacer />
          <IconSettings className="size-5" />
        </Flex>
      </div>
    </div>
  );
}

const autoSpacerCode = `import { Flex } from "@/components/ui/flex"
import { Spacer } from "@/components/ui/spacer"

// Push elements apart
<Flex align="center">
  <Logo />
  <Spacer />
  <Button>Sign In</Button>
</Flex>

// Multiple spacers
<Flex align="center">
  <IconUser className="size-5" />
  <Spacer />
  <span>Center Content</span>
  <Spacer />
  <IconSettings className="size-5" />
</Flex>`;

function FixedSpacerDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Horizontal (size=8)</p>
        <HStack className="p-4 border rounded-lg bg-muted/30">
          <div className="p-2 bg-primary/20 rounded">A</div>
          <Spacer size={8} axis="horizontal" />
          <div className="p-2 bg-primary/20 rounded">B</div>
        </HStack>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Vertical (size=8)</p>
        <VStack className="p-4 border rounded-lg bg-muted/30">
          <div className="p-2 bg-primary/20 rounded w-full text-center">A</div>
          <Spacer size={8} axis="vertical" />
          <div className="p-2 bg-primary/20 rounded w-full text-center">B</div>
        </VStack>
      </div>
    </div>
  );
}

const fixedSpacerCode = `import { HStack, VStack } from "@/components/ui/stack"
import { Spacer } from "@/components/ui/spacer"

// Fixed horizontal spacing
<HStack>
  <div>A</div>
  <Spacer size={8} axis="horizontal" />
  <div>B</div>
</HStack>

// Fixed vertical spacing
<VStack>
  <div>A</div>
  <Spacer size={8} axis="vertical" />
  <div>B</div>
</VStack>`;

function NavigationHeaderDemo() {
  return (
    <Flex
      as="nav"
      align="center"
      className="p-4 border rounded-lg bg-background"
    >
      <HStack gap={2} align="center">
        <div className="size-8 bg-primary rounded" />
        <span className="font-semibold">App Name</span>
      </HStack>
      <Spacer />
      <HStack gap={1}>
        <Button variant="ghost" size="icon-sm">
          <IconBell className="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <IconSettings className="size-4" />
        </Button>
      </HStack>
      <Spacer size={4} axis="horizontal" />
      <Avatar size="sm">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </Flex>
  );
}

const navigationHeaderCode = `import { Flex } from "@/components/ui/flex"
import { HStack } from "@/components/ui/stack"
import { Spacer } from "@/components/ui/spacer"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Navigation header
<Flex as="nav" align="center" className="p-4">
  <HStack gap={2} align="center">
    <div className="size-8 bg-primary rounded" />
    <span className="font-semibold">App Name</span>
  </HStack>
  <Spacer />
  <HStack gap={1}>
    <Button variant="ghost" size="icon-sm">
      <IconBell className="size-4" />
    </Button>
    <Button variant="ghost" size="icon-sm">
      <IconSettings className="size-4" />
    </Button>
  </HStack>
  <Spacer size={4} axis="horizontal" />
  <Avatar size="sm">
    <AvatarFallback>JD</AvatarFallback>
  </Avatar>
</Flex>`;

function BoxBasicDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

// Padding & Background
<Box p={4} bg="muted" rounded="lg">
  Box with padding
</Box>

// Shadow
<Box p={4} shadow="md" rounded="lg" bg="background" border>
  Box with shadow
</Box>

// Custom Colors
<Box p={4} bg="primary" color="primary-foreground" rounded="lg">
  Custom colors
</Box>`;

function BoxRoundedDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      {(
        ["none", "sm", "default", "md", "lg", "xl", "2xl", "full"] as const
      ).map((rounded) => (
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

// Border radius variants
<Box p={4} rounded="lg">Large radius</Box>
<Box p={4} rounded="full">Pill</Box>
<Box p={4} rounded="none">No radius</Box>`;

function BoxShadowDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      {(["none", "sm", "default", "md", "lg", "xl", "2xl"] as const).map(
        (shadow) => (
          <Box
            key={shadow}
            p={4}
            shadow={shadow}
            rounded="lg"
            bg="background"
            className="min-w-20 text-center"
          >
            <span className="text-xs">{shadow}</span>
          </Box>
        ),
      )}
    </div>
  );
}

const boxShadowCode = `import { Box } from "@/components/ui/box"

// Shadow variants
<Box p={4} shadow="sm">Small shadow</Box>
<Box p={4} shadow="md">Medium shadow</Box>
<Box p={4} shadow="lg">Large shadow</Box>
<Box p={4} shadow="xl">Extra large</Box>`;

function SemanticBoxDemo() {
  return (
    <Box as="article" p={6} rounded="lg" border shadow="sm" bg="background">
      <h4 className="font-semibold mb-2">Article Title</h4>
      <p className="text-muted-foreground text-sm">
        This Box renders as an &lt;article&gt; element for semantic HTML.
      </p>
    </Box>
  );
}

const semanticBoxCode = `import { Box } from "@/components/ui/box"

// Semantic Box (renders as <article>)
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
        <VStack gap={1} className="flex-1">
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

const quickCardCode = `import { Box } from "@/components/ui/box"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { HStack, VStack } from "@/components/ui/stack"

// Quick card
<Box p={6} rounded="xl" shadow="lg" bg="background" border>
  <HStack gap={4} align="start">
    <Avatar>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
    <VStack gap={1} className="flex-1">
      <span className="font-semibold">John Doe</span>
      <span className="text-sm text-muted-foreground">Software Engineer</span>
      <HStack gap={2} className="mt-2">
        <Badge variant="secondary">React</Badge>
        <Badge variant="secondary">TypeScript</Badge>
      </HStack>
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
      className="border-primary/20 max-w-md"
    >
      <HStack gap={3}>
        <Center className="size-10 rounded-full bg-primary/20">
          <IconCheck className="size-5 text-primary" />
        </Center>
        <VStack gap={0} className="flex-1">
          <span className="font-medium">Success!</span>
          <span className="text-sm text-muted-foreground">
            Your changes have been saved.
          </span>
        </VStack>
      </HStack>
    </Box>
  );
}

const notificationBoxCode = `import { Box } from "@/components/ui/box"
import { Center } from "@/components/ui/center"
import { HStack, VStack } from "@/components/ui/stack"
import { IconCheck } from "@tabler/icons-react"

// Notification box
<Box p={4} rounded="lg" bg="primary/10" border className="border-primary/20">
  <HStack gap={3}>
    <Center className="size-10 rounded-full bg-primary/20">
      <IconCheck className="size-5 text-primary" />
    </Center>
    <VStack gap={0} className="flex-1">
      <span className="font-medium">Success!</span>
      <span className="text-sm text-muted-foreground">Your changes have been saved.</span>
    </VStack>
  </HStack>
</Box>`;

export default function LayoutUtilitiesPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Layout Utilities"
        description="Utility components for centering, spacing, and generic wrappers. Quick styling helpers for common layout patterns."
        version="v1.0"
      />

      <FeatureGrid features={layoutUtilitiesPageFeatureGridFeatures} />

      <DemoTabs
        defaultValue="center-types"
        tabs={layoutUtilitiesPageDemoTabsTabs}
      />

      <APIReference sections={layoutUtilitiesPageAPIReferenceSections} />
    </ComponentPage>
  );
}

const layoutUtilitiesPageFeatureGridFeatures = [
  {
    title: "Flexible Centering",
    description:
      "Three centering strategies: flex, grid, and absolute positioning for any layout scenario.",
  },
  {
    title: "Smart Spacing",
    description:
      "Auto spacer pushes elements apart, fixed spacer adds consistent gaps.",
  },
  {
    title: "Polymorphic Box",
    description:
      "Semantic HTML with utility props for quick styling without className bloat.",
  },
] satisfies React.ComponentProps<typeof FeatureGrid>["features"];

const layoutUtilitiesPageDemoTabsTabs = [
  {
    value: "center-types",
    label: "Center Types",
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
    demo: (
      <DemoWrapper
        title="Inline Centering"
        description="Center icons or small elements inline with text."
        code={inlineCenterCode}
      >
        <InlineCenterDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "loading-overlay",
    label: "Loading Overlay",
    demo: (
      <DemoWrapper
        title="Loading State Overlay"
        description="Center content in an absolute overlay for loading states."
        code={loadingOverlayCode}
      >
        <LoadingOverlayDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "empty-state",
    label: "Empty State",
    demo: (
      <DemoWrapper
        title="Empty State Pattern"
        description="Center content for empty states or no data scenarios."
        code={emptyStateCode}
      >
        <EmptyStateDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "auto-spacer",
    label: "Auto Spacer",
    demo: (
      <DemoWrapper
        title="Auto Spacer"
        description="Push elements apart using flex: 1 behavior."
        code={autoSpacerCode}
      >
        <AutoSpacerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "fixed-spacer",
    label: "Fixed Spacer",
    demo: (
      <DemoWrapper
        title="Fixed Size Spacer"
        description="Add consistent spacing with fixed pixel values."
        code={fixedSpacerCode}
      >
        <FixedSpacerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "nav-header",
    label: "Nav Header",
    demo: (
      <DemoWrapper
        title="Navigation Header"
        description="Common pattern for navigation headers with spacer."
        code={navigationHeaderCode}
      >
        <NavigationHeaderDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "box-basic",
    label: "Box Basic",
    demo: (
      <DemoWrapper
        title="Basic Box Usage"
        description="Common utility props for quick styling."
        code={boxBasicCode}
      >
        <BoxBasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "box-rounded",
    label: "Box Rounded",
    demo: (
      <DemoWrapper
        title="Border Radius"
        description="All available rounded variants from none to full."
        code={boxRoundedCode}
      >
        <BoxRoundedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "box-shadow",
    label: "Box Shadow",
    demo: (
      <DemoWrapper
        title="Box Shadow"
        description="All available shadow variants from none to 2xl."
        code={boxShadowCode}
      >
        <BoxShadowDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "semantic-box",
    label: "Semantic Box",
    demo: (
      <DemoWrapper
        title="Semantic HTML"
        description="Use the 'as' prop to render semantic elements."
        code={semanticBoxCode}
      >
        <SemanticBoxDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "quick-card",
    label: "Quick Card",
    demo: (
      <DemoWrapper
        title="Quick Card Pattern"
        description="Build cards quickly with Box utility props."
        code={quickCardCode}
      >
        <QuickCardDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "notification-box",
    label: "Notification",
    demo: (
      <DemoWrapper
        title="Notification Box"
        description="Success notification styled with Box."
        code={notificationBoxCode}
      >
        <NotificationBoxDemo />
      </DemoWrapper>
    ),
  },
] satisfies React.ComponentProps<typeof DemoTabs>["tabs"];

const layoutUtilitiesPageAPIReferenceSections = [
  {
    title: "Center Props",
    props: [
      {
        prop: "type",
        type: '"flex" | "grid" | "absolute"',
        default: "flex",
        description: "Centering method strategy",
      },
      {
        prop: "inline",
        type: "boolean",
        default: "false",
        description: "Use inline-flex or inline-grid",
      },
      {
        prop: "as",
        type: "CenterElement",
        default: "div",
        description: "Semantic HTML element to render",
      },
    ],
  },
  {
    title: "Spacer Props",
    props: [
      {
        prop: "size",
        type: 'number | "auto"',
        default: "auto",
        description: "Fixed size or auto (flex: 1)",
      },
      {
        prop: "axis",
        type: '"horizontal" | "vertical"',
        default: "horizontal",
        description: "Direction of spacing",
      },
    ],
  },
  {
    title: "Box Props",
    props: [
      {
        prop: "as",
        type: "BoxElement",
        default: "div",
        description: "Semantic HTML element to render",
      },
      {
        prop: "p",
        type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12",
        default: "-",
        description: "Padding on all sides",
      },
      {
        prop: "px",
        type: "0-8",
        default: "-",
        description: "Horizontal padding",
      },
      {
        prop: "py",
        type: "0-8",
        default: "-",
        description: "Vertical padding",
      },
      {
        prop: "rounded",
        type: "RoundedVariant",
        default: "-",
        description: "Border radius value",
      },
      {
        prop: "shadow",
        type: "ShadowVariant",
        default: "-",
        description: "Box shadow value",
      },
      {
        prop: "bg",
        type: "string",
        default: "-",
        description: "Background color (Tailwind without bg-)",
      },
      {
        prop: "color",
        type: "string",
        default: "-",
        description: "Text color (Tailwind without text-)",
      },
      {
        prop: "border",
        type: "boolean | string",
        default: "-",
        description: "Border (true or custom)",
      },
      {
        prop: "w",
        type: "string",
        default: "-",
        description: "Width (Tailwind without w-)",
      },
      {
        prop: "h",
        type: "string",
        default: "-",
        description: "Height (Tailwind without h-)",
      },
      {
        prop: "display",
        type: "DisplayVariant",
        default: "-",
        description: "CSS display property",
      },
      {
        prop: "position",
        type: "PositionVariant",
        default: "-",
        description: "CSS position property",
      },
    ],
  },
] satisfies React.ComponentProps<typeof APIReference>["sections"];
