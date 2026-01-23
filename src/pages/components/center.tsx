import {
  IconLoader2,
  IconSettings,
  IconCheck,
  IconBell,
  IconUser,
} from "@tabler/icons-react";
import { Center } from "@/components/ui/center";
import { VStack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  APIReference,
} from "@/components/docs";

function CenterTypesDemo() {
  return (
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
    <div className="flex items-center gap-4 flex-wrap">
      <span>Icon button:</span>
      <Center inline className="size-8 bg-primary/20 rounded">
        <IconSettings className="size-4" />
      </Center>
      <span>with text around it.</span>
    </div>
  );
}

const inlineCenterCode = `import { Center } from "@/components/ui/center"
import { Icon } from "@tabler/icons-react"

// Inline centering
<span>Text</span>
<Center inline className="size-8 bg-primary/20 rounded">
  <Icon className="size-4" />
</Center>
<span>More text</span>

// Multiple inline centers
<Flex gap={4}>
  <Center inline><IconA /></Center>
  <Center inline><IconB /></Center>
  <Center inline><IconC /></Center>
</Flex>`;

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
import { IconLoader2 } from "@tabler/icons-react"

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
        <div className="text-center space-y-2">
          <h4 className="font-semibold">No items yet</h4>
          <p className="text-sm text-muted-foreground">
            Add your first item to get started
          </p>
          <Button>Add Item</Button>
        </div>
      </VStack>
    </Center>
  );
}

const emptyStateCode = `import { Center } from "@/components/ui/center"
import { VStack } from "@/components/ui/stack"
import { IconCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

// Empty state
<Center className="h-48 border rounded-lg border-dashed">
  <VStack gap={4} align="center">
    <div className="size-16 rounded-full bg-muted flex items-center justify-center">
      <IconCheck className="size-8 text-muted-foreground" />
    </div>
    <div className="text-center space-y-2">
      <h4 className="font-semibold">No items yet</h4>
      <p className="text-sm text-muted-foreground">Add your first item to get started</p>
      <Button>Add Item</Button>
    </div>
  </VStack>
</Center>`;

function ModalOverlayDemo() {
  return (
    <div className="h-64 border rounded-lg bg-muted/30 relative">
      <div className="absolute inset-0 bg-background/90 backdrop-blur">
        <Center type="absolute" className="p-8">
          <div className="space-y-4 text-center max-w-sm">
            <IconBell className="size-12 text-primary mx-auto" />
            <h3 className="text-lg font-semibold">Confirm Action</h3>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. Are you sure you want to continue?
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline">Cancel</Button>
              <Button>Confirm</Button>
            </div>
          </div>
        </Center>
      </div>
    </div>
  );
}

const modalOverlayCode = `import { Center } from "@/components/ui/center"
import { IconBell } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

// Modal overlay with absolute centering
<div className="relative h-64">
  <div className="absolute inset-0 bg-background/90 backdrop-blur">
    <Center type="absolute" className="p-8">
      <div className="space-y-4 text-center max-w-sm">
        <IconBell className="size-12 text-primary mx-auto" />
        <h3>Confirm Action</h3>
        <p className="text-sm text-muted-foreground">
          This action cannot be undone.
        </p>
        <div className="flex gap-2 justify-center">
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </div>
      </div>
    </Center>
  </div>
</div>`;

function UserProfileDemo() {
  return (
    <div className="flex items-center gap-6">
      <Center className="size-20 rounded-full bg-primary text-primary-foreground">
        <IconUser className="size-10" />
      </Center>
      <div className="space-y-1">
        <h4 className="font-semibold">John Doe</h4>
        <p className="text-sm text-muted-foreground">Software Engineer</p>
        <p className="text-xs text-muted-foreground">New York, NY</p>
      </div>
    </div>
  );
}

const userProfileCode = `import { Center } from "@/components/ui/center"
import { IconUser } from "@tabler/icons-react"

// Avatar with centered icon
<Center className="size-20 rounded-full bg-primary text-primary-foreground">
  <IconUser className="size-10" />
</Center>

// Profile card
<div className="flex items-center gap-6">
  <Center className="size-20 rounded-full bg-primary text-primary-foreground">
    <IconUser className="size-10" />
  </Center>
  <div>
    <h4>John Doe</h4>
    <p className="text-sm text-muted-foreground">Software Engineer</p>
  </div>
</div>`;

function SizeVariantsDemo() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <Center className="size-16 bg-primary/20 rounded border">
        <span className="text-xs">size-16</span>
      </Center>
      <Center className="size-24 bg-primary/20 rounded border">
        <span className="text-xs">size-24</span>
      </Center>
      <Center className="size-32 bg-primary/20 rounded border">
        <span className="text-xs">size-32</span>
      </Center>
      <Center className="w-48 h-24 bg-primary/20 rounded border">
        <span className="text-xs">w-48 h-24</span>
      </Center>
    </div>
  );
}

const sizeVariantsCode = `import { Center } from "@/components/ui/center"

// Size variants
<Center className="size-16 bg-primary/20 rounded">
  <Icon className="size-8" />
</Center>

<Center className="size-24 bg-primary/20 rounded">
  <Icon className="size-12" />
</Center>

<Center className="size-32 bg-primary/20 rounded">
  <Icon className="size-16" />
</Center>

// Custom width and height
<Center className="w-48 h-24 bg-primary/20 rounded">
  Content
</Center>`;

export default function CenterPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Center"
        description="A flexible centering utility component with multiple strategies. Supports flex, grid, and absolute positioning for any layout scenario."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Multiple Strategies",
            description:
              "Choose between flex, grid, or absolute positioning based on your needs.",
          },
          {
            title: "Inline Support",
            description:
              "Center icons and small elements inline with text for badges and labels.",
          },
          {
            title: "Semantic HTML",
            description:
              "Render as semantic elements with the 'as' prop for better accessibility.",
          },
        ]}
      />

      <DemoTabs
        defaultValue="center-types"
        tabs={[
          {
            value: "center-types",
            label: "Center Types",
            demo: (
              <DemoWrapper
                title="Centering Strategies"
                description="Three centering methods: flex (default), grid, and absolute."
                code={centerTypesCode}
              >
                <CenterTypesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "inline-center",
            label: "Inline",
            demo: (
              <DemoWrapper
                title="Inline Centering"
                description="Center icons and small elements inline with text."
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
                description="Center content in an absolute overlay for loading indicators."
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
            value: "modal-overlay",
            label: "Modal Overlay",
            demo: (
              <DemoWrapper
                title="Modal/Dialog Overlay"
                description="Absolute centering for modal and dialog overlays."
                code={modalOverlayCode}
              >
                <ModalOverlayDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "user-profile",
            label: "User Profile",
            demo: (
              <DemoWrapper
                title="Avatar Centering"
                description="Center icons within circular avatar containers."
                code={userProfileCode}
              >
                <UserProfileDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "size-variants",
            label: "Size Variants",
            demo: (
              <DemoWrapper
                title="Size Examples"
                description="Different sizes using size, width, and height classes."
                code={sizeVariantsCode}
              >
                <SizeVariantsDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <APIReference
        sections={[
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
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional Tailwind classes",
              },
            ],
          },
          {
            title: "Center Types",
            props: [
              {
                prop: "flex",
                type: "string",
                default: "-",
                description:
                  "Uses CSS flexbox. Best for most cases. Adds items-center justify-center.",
              },
              {
                prop: "grid",
                type: "string",
                default: "-",
                description:
                  "Uses CSS Grid. Adds place-items-center. Good for simple containers.",
              },
              {
                prop: "absolute",
                type: "string",
                default: "-",
                description:
                  "Uses absolute positioning. Requires relative parent. Adds top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2.",
              },
            ],
          },
          {
            title: "Usage Tips",
            props: [
              {
                prop: "flex centering",
                type: "string",
                default: "-",
                description:
                  "Default. Works for any content size. Use for general purpose centering.",
              },
              {
                prop: "grid centering",
                type: "string",
                default: "-",
                description:
                  "Use when centering single element. Slightly more performant than flex.",
              },
              {
                prop: "absolute centering",
                type: "string",
                default: "-",
                description:
                  "Use for overlays, modals, tooltips. Parent must have relative, fixed, or absolute positioning.",
              },
              {
                prop: "inline centering",
                type: "string",
                default: "-",
                description:
                  "Set inline=true to use inline-flex or inline-grid. Useful for centering icons within badges.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
