import {
  IconCheck,
  IconX,
  IconAlertCircle,
  IconStar,
  IconLayout,
  IconColumns,
  IconSpacingVertical,
} from "@tabler/icons-react";
import { HStack, VStack } from "@/components/ui/stack";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs";

function VStackDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default gap</p>
        <VStack className="p-4 border rounded-lg bg-muted/30">
          <div className="p-3 bg-primary/20 rounded w-full text-center">
            Item 1
          </div>
          <div className="p-3 bg-primary/20 rounded w-full text-center">
            Item 2
          </div>
          <div className="p-3 bg-primary/20 rounded w-full text-center">
            Item 3
          </div>
        </VStack>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">gap={8}</p>
        <VStack gap={8} className="p-4 border rounded-lg bg-muted/30">
          <div className="p-3 bg-primary/20 rounded w-full text-center">
            Item 1
          </div>
          <div className="p-3 bg-primary/20 rounded w-full text-center">
            Item 2
          </div>
          <div className="p-3 bg-primary/20 rounded w-full text-center">
            Item 3
          </div>
        </VStack>
      </div>
    </div>
  );
}

const vstackCode = `import { VStack } from "@/components/ui/stack"

export function VStackDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <VStack className="p-4 border rounded-lg bg-muted/30">
          <div className="p-3 bg-primary/20 rounded w-full">Item 1</div>
          <div className="p-3 bg-primary/20 rounded w-full">Item 2</div>
          <div className="p-3 bg-primary/20 rounded w-full">Item 3</div>
        </VStack>
      </div>
      <div>
        <VStack gap={8} className="p-4 border rounded-lg bg-muted/30">
          <div className="p-3 bg-primary/20 rounded w-full">Item 1</div>
          <div className="p-3 bg-primary/20 rounded w-full">Item 2</div>
          <div className="p-3 bg-primary/20 rounded w-full">Item 3</div>
        </VStack>
      </div>
    </div>
  )
}`;

function HStackDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <HStack className="p-4 border rounded-lg bg-muted/30">
          <div className="p-3 bg-primary/20 rounded">Item 1</div>
          <div className="p-3 bg-primary/20 rounded">Item 2</div>
          <div className="p-3 bg-primary/20 rounded">Item 3</div>
        </HStack>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          With justify="between"
        </p>
        <HStack justify="between" className="p-4 border rounded-lg bg-muted/30">
          <div className="p-3 bg-primary/20 rounded">Left</div>
          <div className="p-3 bg-primary/20 rounded">Center</div>
          <div className="p-3 bg-primary/20 rounded">Right</div>
        </HStack>
      </div>
    </div>
  );
}

const hstackCode = `import { HStack } from "@/components/ui/stack"

export function HStackDemo() {
  return (
    <div className="space-y-4">
      <div>
        <HStack className="p-4 border rounded-lg bg-muted/30">
          <div className="p-3 bg-primary/20 rounded">Item 1</div>
          <div className="p-3 bg-primary/20 rounded">Item 2</div>
          <div className="p-3 bg-primary/20 rounded">Item 3</div>
        </HStack>
      </div>
      <div>
        <HStack justify="between" className="p-4 border rounded-lg bg-muted/30">
          <div className="p-3 bg-primary/20 rounded">Left</div>
          <div className="p-3 bg-primary/20 rounded">Center</div>
          <div className="p-3 bg-primary/20 rounded">Right</div>
        </HStack>
      </div>
    </div>
  )
}`;

function AlignmentDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {(["start", "center", "end"] as const).map((align) => (
        <div key={align}>
          <p className="text-sm text-muted-foreground mb-2">align="{align}"</p>
          <HStack
            align={align}
            gap={4}
            className="p-4 border rounded-lg bg-muted/30 h-24"
          >
            <div className="p-2 bg-primary/20 rounded">A</div>
            <div className="p-4 bg-primary/20 rounded">B</div>
            <div className="p-6 bg-primary/20 rounded">C</div>
          </HStack>
        </div>
      ))}
    </div>
  );
}

const alignmentCode = `import { HStack } from "@/components/ui/stack"

export function AlignmentDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {(["start", "center", "end"] as const).map((align) => (
        <div key={align}>
          <HStack align={align} gap={4} className="p-4 border rounded-lg bg-muted/30">
            <div className="p-2 bg-primary/20 rounded">A</div>
            <div className="p-4 bg-primary/20 rounded">B</div>
            <div className="p-6 bg-primary/20 rounded">C</div>
          </HStack>
        </div>
      ))}
    </div>
  )
}`;

function DividersDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          VStack with dividers
        </p>
        <VStack dividers className="p-4 border rounded-lg bg-background">
          <div className="py-2">Section 1</div>
          <div className="py-2">Section 2</div>
          <div className="py-2">Section 3</div>
        </VStack>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          HStack with dividers
        </p>
        <HStack
          dividers
          align="center"
          className="p-4 border rounded-lg bg-background h-16"
        >
          <span className="px-2">Home</span>
          <span className="px-2">Products</span>
          <span className="px-2">About</span>
          <span className="px-2">Contact</span>
        </HStack>
      </div>
    </div>
  );
}

const dividersCode = `import { HStack, VStack } from "@/components/ui/stack"

export function DividersDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <VStack dividers className="p-4 border rounded-lg bg-background">
          <div className="py-2">Section 1</div>
          <div className="py-2">Section 2</div>
          <div className="py-2">Section 3</div>
        </VStack>
      </div>
      <div>
        <HStack dividers align="center" className="p-4 border rounded-lg bg-background">
          <span className="px-2">Home</span>
          <span className="px-2">Products</span>
          <span className="px-2">About</span>
          <span className="px-2">Contact</span>
        </HStack>
      </div>
    </div>
  )
}`;

function ResponsiveGapDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Resize the window to see gap change: base=2, md=4, lg=8
      </p>
      <HStack
        gap={{ base: 2, md: 4, lg: 8 }}
        className="p-4 border rounded-lg bg-muted/30"
      >
        <div className="p-4 bg-primary/20 rounded">1</div>
        <div className="p-4 bg-primary/20 rounded">2</div>
        <div className="p-4 bg-primary/20 rounded">3</div>
        <div className="p-4 bg-primary/20 rounded">4</div>
      </HStack>
    </div>
  );
}

const responsiveGapCode = `import { HStack } from "@/components/ui/stack"

export function ResponsiveGapDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Resize the window to see gap change: base=2, md=4, lg=8
      </p>
      <HStack gap={{ base: 2, md: 4, lg: 8 }} className="p-4 border rounded-lg bg-muted/30">
        <div className="p-4 bg-primary/20 rounded">1</div>
        <div className="p-4 bg-primary/20 rounded">2</div>
        <div className="p-4 bg-primary/20 rounded">3</div>
        <div className="p-4 bg-primary/20 rounded">4</div>
      </HStack>
    </div>
  )
}`;

function ActionButtonsDemo() {
  return (
    <HStack gap={2}>
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </HStack>
  );
}

function StatusListDemo() {
  return (
    <VStack
      gap={2}
      align="start"
      className="p-4 border rounded-lg bg-background"
    >
      <HStack gap={2} align="center">
        <IconCheck className="size-4 text-green-500" />
        <span>Build completed successfully</span>
      </HStack>
      <HStack gap={2} align="center">
        <IconCheck className="size-4 text-green-500" />
        <span>Tests passed (42/42)</span>
      </HStack>
      <HStack gap={2} align="center">
        <IconAlertCircle className="size-4 text-yellow-500" />
        <span>2 warnings found</span>
      </HStack>
      <HStack gap={2} align="center">
        <IconX className="size-4 text-red-500" />
        <span>Deployment failed</span>
      </HStack>
    </VStack>
  );
}

function TeamMembersDemo() {
  const users = [
    { name: "Alice Johnson", role: "Lead Developer", avatar: "AJ" },
    { name: "Bob Smith", role: "Designer", avatar: "BS" },
    { name: "Carol White", role: "Product Manager", avatar: "CW" },
  ];

  return (
    <VStack dividers className="border rounded-lg bg-background">
      {users.map((user) => (
        <HStack
          key={user.name}
          justify="between"
          align="center"
          className="p-4"
        >
          <HStack gap={3} align="center">
            <Avatar size="sm">
              <AvatarFallback>{user.avatar}</AvatarFallback>
            </Avatar>
            <VStack gap={0}>
              <span className="font-medium">{user.name}</span>
              <span className="text-sm text-muted-foreground">{user.role}</span>
            </VStack>
          </HStack>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </HStack>
      ))}
    </VStack>
  );
}

function FeatureCardsDemo() {
  const features = [
    { icon: IconStar, title: "Premium", desc: "Access all features" },
    { icon: IconCheck, title: "Verified", desc: "Trusted by millions" },
    { icon: IconAlertCircle, title: "Support", desc: "24/7 assistance" },
  ];

  return (
    <HStack gap={4} className="overflow-x-auto pb-2">
      {features.map((feature) => (
        <Card key={feature.title} className="min-w-48 shrink-0">
          <CardHeader className="pb-2">
            <feature.icon className="size-8 text-primary mb-2" />
            <CardTitle className="text-lg">{feature.title}</CardTitle>
            <CardDescription>{feature.desc}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </HStack>
  );
}

const realWorldCode = `import { HStack, VStack } from "@/components/ui/stack"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { IconCheck, IconAlertCircle, IconX, IconStar } from "@tabler/icons-react"

// Action Buttons
export function ActionButtonsDemo() {
  return (
    <HStack gap={2}>
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </HStack>
  )
}

// Status List
export function StatusListDemo() {
  return (
    <VStack gap={2} align="start" className="p-4 border rounded-lg bg-background">
      <HStack gap={2} align="center">
        <IconCheck className="size-4 text-green-500" />
        <span>Build completed successfully</span>
      </HStack>
      <HStack gap={2} align="center">
        <IconAlertCircle className="size-4 text-yellow-500" />
        <span>2 warnings found</span>
      </HStack>
      <HStack gap={2} align="center">
        <IconX className="size-4 text-red-500" />
        <span>Deployment failed</span>
      </HStack>
    </VStack>
  )
}

// Team Members
export function TeamMembersDemo() {
  const users = [
    { name: "Alice Johnson", role: "Lead Developer", avatar: "AJ" },
    { name: "Bob Smith", role: "Designer", avatar: "BS" },
  ]
  return (
    <VStack dividers className="border rounded-lg bg-background">
      {users.map((user) => (
        <HStack key={user.name} justify="between" align="center" className="p-4">
          <HStack gap={3} align="center">
            <Avatar size="sm">
              <AvatarFallback>{user.avatar}</AvatarFallback>
            </Avatar>
            <VStack gap={0}>
              <span className="font-medium">{user.name}</span>
              <span className="text-sm text-muted-foreground">{user.role}</span>
            </VStack>
          </HStack>
          <Button variant="ghost" size="sm">View</Button>
        </HStack>
      ))}
    </VStack>
  )
}

// Feature Cards
export function FeatureCardsDemo() {
  const features = [
    { icon: IconStar, title: "Premium", desc: "Access all features" },
    { icon: IconCheck, title: "Verified", desc: "Trusted by millions" },
  ]
  return (
    <HStack gap={4} className="overflow-x-auto pb-2">
      {features.map((feature) => (
        <Card key={feature.title} className="min-w-48 shrink-0">
          <CardHeader className="pb-2">
            <feature.icon className="size-8 text-primary mb-2" />
            <CardTitle className="text-lg">{feature.title}</CardTitle>
            <CardDescription>{feature.desc}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </HStack>
  )
}`;

const usageCode = `import { Stack, HStack, VStack } from "@/components/ui/stack"

// Vertical stack
<VStack gap={4}>
  <Input placeholder="Email" />
  <Input placeholder="Password" />
  <Button>Sign In</Button>
</VStack>

// Horizontal stack
<HStack gap={2} align="center">
  <Avatar />
  <span>Username</span>
</HStack>

// With dividers
<VStack dividers>
  <MenuItem>Profile</MenuItem>
  <MenuItem>Settings</MenuItem>
  <MenuItem>Logout</MenuItem>
</VStack>

// Responsive gap
<HStack gap={{ base: 2, md: 4, lg: 8 }}>
  <Card />
  <Card />
</HStack>`;

export default function StackPage() {
  return (
    <div className="p-8 max-w-6xl space-y-10">
      <PageHeader
        title="Stack"
        description="Simplified flex layout for vertical and horizontal stacking with optional dividers."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Simple API",
            description:
              "Streamlined flex layout with gap, align, and justify props. No complex flex configuration needed.",
            icon: <IconLayout className="size-5" />,
          },
          {
            title: "Responsive",
            description:
              "Built-in responsive values for gap, align, and justify. Change layout across breakpoints with ease.",
            icon: <IconColumns className="size-5" />,
          },
          {
            title: "Dividers",
            description:
              "Optional automatic dividers between items. Perfect for menus, lists, and navigation patterns.",
            icon: <IconSpacingVertical className="size-5" />,
          },
        ]}
      />

      <DemoTabs
        defaultValue="vstack"
        tabs={[
          {
            value: "vstack",
            label: "VStack",
            demo: (
              <DemoWrapper
                title="Vertical Stack"
                description="Items stacked vertically with configurable gap."
                code={vstackCode}
              >
                <VStackDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "hstack",
            label: "HStack",
            demo: (
              <DemoWrapper
                title="Horizontal Stack"
                description="Items stacked horizontally with alignment options."
                code={hstackCode}
              >
                <HStackDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "alignment",
            label: "Alignment",
            demo: (
              <DemoWrapper
                title="Cross-Axis Alignment"
                description="Control how items align along the cross-axis."
                code={alignmentCode}
              >
                <AlignmentDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "dividers",
            label: "Dividers",
            demo: (
              <DemoWrapper
                title="Stack with Dividers"
                description="Automatic dividers between items using the Separator component."
                code={dividersCode}
              >
                <DividersDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "responsive",
            label: "Responsive",
            demo: (
              <DemoWrapper
                title="Responsive Gap"
                description="Gap changes based on viewport size."
                code={responsiveGapCode}
              >
                <ResponsiveGapDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "realworld",
            label: "Real-World",
            demo: (
              <div className="space-y-6">
                <DemoWrapper
                  title="Action Buttons"
                  description="Button group with primary and secondary actions."
                  code={realWorldCode}
                >
                  <ActionButtonsDemo />
                </DemoWrapper>
                <DemoWrapper
                  title="Status List"
                  description="Status indicators with icons and text."
                  code={realWorldCode}
                >
                  <StatusListDemo />
                </DemoWrapper>
                <DemoWrapper
                  title="Team Members"
                  description="User list with avatars and action buttons."
                  code={realWorldCode}
                >
                  <TeamMembersDemo />
                </DemoWrapper>
                <DemoWrapper
                  title="Feature Cards"
                  description="Horizontal scrollable feature cards."
                  code={realWorldCode}
                >
                  <FeatureCardsDemo />
                </DemoWrapper>
              </div>
            ),
          },
        ]}
      />

      <UsageBlock
        title="Usage"
        description="Basic implementation examples for common use cases"
        code={usageCode}
      />

      <APIReference
        sections={[
          {
            title: "Stack",
            props: [
              {
                prop: "as",
                type: "StackElement",
                default: '"div"',
                description:
                  "Semantic HTML element to render (div, section, nav, etc.)",
              },
              {
                prop: "direction",
                type: '"vertical" | "horizontal"',
                default: '"vertical"',
                description: "Stack direction",
              },
              {
                prop: "gap",
                type: "ResponsiveValue<StackGap>",
                default: "4",
                description: "Gap between items - supports responsive values",
              },
              {
                prop: "align",
                type: "ResponsiveValue<StackAlign>",
                default: "-",
                description:
                  "Cross-axis alignment (start, center, end, baseline, stretch)",
              },
              {
                prop: "justify",
                type: "ResponsiveValue<StackJustify>",
                default: "-",
                description:
                  "Main-axis justification (start, center, end, between, around, evenly)",
              },
              {
                prop: "dividers",
                type: "boolean",
                default: "false",
                description: "Insert dividers between children",
              },
              {
                prop: "dividerElement",
                type: "ReactNode",
                default: "Separator",
                description: "Custom divider element",
              },
              {
                prop: "inline",
                type: "boolean",
                default: "false",
                description: "Use inline-flex instead of flex",
              },
            ],
          },
          {
            title: "HStack",
            props: [
              {
                prop: "gap",
                type: "ResponsiveValue<StackGap>",
                default: "4",
                description: "Gap between items",
              },
              {
                prop: "align",
                type: "ResponsiveValue<StackAlign>",
                default: "-",
                description: "Cross-axis alignment",
              },
              {
                prop: "justify",
                type: "ResponsiveValue<StackJustify>",
                default: "-",
                description: "Main-axis justification",
              },
              {
                prop: "dividers",
                type: "boolean",
                default: "false",
                description: "Insert vertical dividers between items",
              },
            ],
          },
          {
            title: "VStack",
            props: [
              {
                prop: "gap",
                type: "ResponsiveValue<StackGap>",
                default: "4",
                description: "Gap between items",
              },
              {
                prop: "align",
                type: "ResponsiveValue<StackAlign>",
                default: "-",
                description: "Cross-axis alignment",
              },
              {
                prop: "justify",
                type: "ResponsiveValue<StackJustify>",
                default: "-",
                description: "Main-axis justification",
              },
              {
                prop: "dividers",
                type: "boolean",
                default: "false",
                description: "Insert horizontal dividers between items",
              },
            ],
          },
        ]}
      />
    </div>
  );
}
