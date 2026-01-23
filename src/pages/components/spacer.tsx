import { Flex } from "@/components/ui/flex";
import { HStack, VStack } from "@/components/ui/stack";
import { Spacer } from "@/components/ui/spacer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconSettings, IconBell, IconUser } from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  APIReference,
} from "@/components/docs";

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

function SizeVariantsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium mb-2">Horizontal sizes</p>
        <div className="flex items-center gap-4 flex-wrap">
          {[1, 2, 4, 8, 12, 16].map((size) => (
            <HStack key={size} className="border border-dashed rounded p-2">
              <span className="text-sm">Start</span>
              <Spacer size={size} axis="horizontal" />
              <Badge>{size}</Badge>
              <span className="text-sm">End</span>
            </HStack>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Vertical sizes</p>
        <div className="flex gap-4 items-start">
          {[2, 4, 6, 8, 12, 16].map((size) => (
            <VStack
              key={size}
              className="border border-dashed rounded p-2 w-20"
            >
              <span className="text-sm">Top</span>
              <Spacer size={size} axis="vertical" />
              <Badge>{size}</Badge>
              <span className="text-sm">Bottom</span>
            </VStack>
          ))}
        </div>
      </div>
    </div>
  );
}

const sizeVariantsCode = `import { HStack, VStack } from "@/components/ui/stack"
import { Spacer } from "@/components/ui/spacer"
import { Badge } from "@/components/ui/badge"

// Horizontal size variants
<HStack>
  <span>Start</span>
  <Spacer size={1} axis="horizontal" />
  <span>End</span>
</HStack>

<HStack>
  <span>Start</span>
  <Spacer size={8} axis="horizontal" />
  <span>End</span>
</HStack>

<HStack>
  <span>Start</span>
  <Spacer size={16} axis="horizontal" />
  <span>End</span>
</HStack>

// Vertical size variants
<VStack>
  <span>Top</span>
  <Spacer size={2} axis="vertical" />
  <span>Bottom</span>
</VStack>

<VStack>
  <span>Top</span>
  <Spacer size={8} axis="vertical" />
  <span>Bottom</span>
</VStack>

<VStack>
  <span>Top</span>
  <Spacer size={16} axis="vertical" />
  <span>Bottom</span>
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
import { IconBell, IconSettings } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"

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

function CardActionDemo() {
  return (
    <div className="max-w-sm">
      <div className="space-y-4 border rounded-lg p-4 bg-background">
        <div className="flex items-start gap-3">
          <div className="size-10 rounded bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
            J
          </div>
          <div className="flex-1 space-y-1">
            <h4 className="font-semibold">John Doe</h4>
            <p className="text-sm text-muted-foreground">Software Engineer</p>
          </div>
        </div>
        <div className="space-y-3 pt-3 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <Badge>Active</Badge>
          </div>
          <Flex align="center" className="gap-2">
            <Button variant="outline" size="sm">
              View Profile
            </Button>
            <Spacer />
            <Button size="sm">Message</Button>
          </Flex>
        </div>
      </div>
    </div>
  );
}

const cardActionCode = `import { Flex } from "@/components/ui/flex"
import { Spacer } from "@/components/ui/spacer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Card with spacer pushing actions apart
<div className="space-y-4 border rounded-lg p-4">
  <div className="flex items-start gap-3">
    <div className="size-10 rounded bg-primary text-primary-foreground flex items-center justify-center">
      JD
    </div>
    <div className="flex-1 space-y-1">
      <h4>John Doe</h4>
      <p className="text-sm text-muted-foreground">Software Engineer</p>
    </div>
  </div>
  <div className="space-y-3 pt-3 border-t">
    <div className="flex justify-between text-sm">
      <span>Status</span>
      <Badge>Active</Badge>
    </div>
    <Flex align="center">
      <Button variant="outline" size="sm">View Profile</Button>
      <Spacer />
      <Button size="sm">Message</Button>
    </Flex>
  </div>
</div>`;

function FormDemo() {
  return (
    <div className="max-w-sm space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <div className="relative">
          <div className="flex items-center">
            <input
              type="email"
              placeholder="john@example.com"
              className="w-full px-3 py-2 border rounded-md pr-24"
            />
            <Spacer size={4} axis="horizontal" />
            <Button type="submit" size="sm">
              Send
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <div className="flex items-center">
          <input
            type="password"
            placeholder="•••••••••"
            className="flex-1 px-3 py-2 border rounded-md"
          />
          <Spacer size={4} axis="horizontal" />
          <Button variant="outline" size="sm">
            Forgot?
          </Button>
        </div>
      </div>
    </div>
  );
}

const formCode = `import { Flex } from "@/components/ui/flex"
import { Spacer } from "@/components/ui/spacer"
import { Button } from "@/components/ui/button"

// Form with inline button
<div className="space-y-2">
  <label>Email</label>
  <div className="flex items-center">
    <input
      type="email"
      placeholder="john@example.com"
      className="w-full px-3 py-2 border rounded-md"
    />
    <Spacer size={4} axis="horizontal" />
    <Button type="submit" size="sm">Send</Button>
  </div>
</div>

// Form with button aligned
<div className="space-y-2">
  <label>Password</label>
  <div className="flex items-center">
    <input
      type="password"
      placeholder="•••••••••"
      className="flex-1 px-3 py-2 border rounded-md"
    />
    <Spacer />
    <Button variant="outline" size="sm">Forgot?</Button>
  </div>
</div>`;

function BreadcrumbDemo() {
  return (
    <Flex align="center" className="text-sm">
      <span className="text-muted-foreground">Home</span>
      <span className="text-muted-foreground">/</span>
      <Spacer size={2} axis="horizontal" />
      <span className="text-muted-foreground">Products</span>
      <span className="text-muted-foreground">/</span>
      <Spacer size={2} axis="horizontal" />
      <span className="font-semibold">Details</span>
    </Flex>
  );
}

const breadcrumbCode = `import { Flex } from "@/components/ui/flex"
import { Spacer } from "@/components/ui/spacer"

// Breadcrumb with spacers
<Flex align="center" className="text-sm">
  <span className="text-muted-foreground">Home</span>
  <span className="text-muted-foreground">/</span>
  <Spacer size={2} axis="horizontal" />
  <span className="text-muted-foreground">Products</span>
  <span className="text-muted-foreground">/</span>
  <Spacer size={2} axis="horizontal" />
  <span className="font-semibold">Details</span>
</Flex>`;

function ListDemo() {
  const items = [
    { title: "First item", time: "2 min ago" },
    { title: "Second item", time: "5 min ago" },
    { title: "Third item", time: "10 min ago" },
  ];

  return (
    <div className="max-w-sm border rounded-lg bg-background">
      {items.map((item, index) => (
        <Flex
          key={index}
          align="center"
          className="p-3 border-b last:border-b-0"
        >
          <div className="flex-1">
            <span className="font-medium">{item.title}</span>
          </div>
          <Spacer size={4} axis="horizontal" />
          <span className="text-xs text-muted-foreground">{item.time}</span>
        </Flex>
      ))}
    </div>
  );
}

const listCode = `import { Flex } from "@/components/ui/flex"
import { Spacer } from "@/components/ui/spacer"

// List item with spacer
const items = [
  { title: "First item", time: "2 min ago" },
  { title: "Second item", time: "5 min ago" },
  { title: "Third item", time: "10 min ago" },
]

<Flex align="center" className="p-3 border-b">
  <div className="flex-1">
    <span className="font-medium">{item.title}</span>
  </div>
  <Spacer size={4} axis="horizontal" />
  <span className="text-xs text-muted-foreground">{item.time}</span>
</Flex>`;

export default function SpacerPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Spacer"
        description="A flexible spacing utility component. Use auto mode to push elements apart with flex: 1, or fixed sizes for consistent gaps."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Auto Spacer",
            description:
              "Push siblings apart using flex: 1 behavior. Perfect for navigation headers and lists.",
          },
          {
            title: "Fixed Spacing",
            description:
              "Add consistent horizontal or vertical gaps with Tailwind spacing units (0-24).",
          },
          {
            title: "Two Axes",
            description:
              "Control spacing direction with axis prop: horizontal or vertical.",
          },
        ]}
      />

      <DemoTabs
        defaultValue="auto"
        tabs={[
          {
            value: "auto",
            label: "Auto",
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
            value: "fixed",
            label: "Fixed",
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
            value: "size-variants",
            label: "Sizes",
            demo: (
              <DemoWrapper
                title="Size Variants"
                description="All available spacer sizes from 1 to 24."
                code={sizeVariantsCode}
              >
                <SizeVariantsDemo />
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
            value: "card-actions",
            label: "Card Actions",
            demo: (
              <DemoWrapper
                title="Card with Actions"
                description="Push buttons apart in card action bars."
                code={cardActionCode}
              >
                <CardActionDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "form",
            label: "Form",
            demo: (
              <DemoWrapper
                title="Form Input"
                description="Inline action buttons with input fields."
                code={formCode}
              >
                <FormDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "breadcrumb",
            label: "Breadcrumb",
            demo: (
              <DemoWrapper
                title="Breadcrumb"
                description="Separate breadcrumb items with spacers."
                code={breadcrumbCode}
              >
                <BreadcrumbDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "list",
            label: "List Item",
            demo: (
              <DemoWrapper
                title="List Items"
                description="Push metadata to the right in list items."
                code={listCode}
              >
                <ListDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <APIReference
        sections={[
          {
            title: "Spacer Props",
            props: [
              {
                prop: "size",
                type: 'number | "auto"',
                default: "auto",
                description: "Fixed size (0-24) or 'auto' for flex: 1",
              },
              {
                prop: "axis",
                type: '"horizontal" | "vertical"',
                default: "horizontal",
                description: "Direction of spacing",
              },
              {
                prop: "className",
                type: "string",
                default: "-",
                description: "Additional CSS classes",
              },
            ],
          },
          {
            title: "Size Values",
            props: [
              {
                prop: "0",
                type: "number",
                default: "-",
                description: "No space (0px)",
              },
              {
                prop: "1",
                type: "number",
                default: "-",
                description: "0.25rem (4px)",
              },
              {
                prop: "2",
                type: "number",
                default: "-",
                description: "0.5rem (8px)",
              },
              {
                prop: "3",
                type: "number",
                default: "-",
                description: "0.75rem (12px)",
              },
              {
                prop: "4",
                type: "number",
                default: "-",
                description: "1rem (16px)",
              },
              {
                prop: "5",
                type: "number",
                default: "-",
                description: "1.25rem (20px)",
              },
              {
                prop: "6",
                type: "number",
                default: "-",
                description: "1.5rem (24px)",
              },
              {
                prop: "8",
                type: "number",
                default: "-",
                description: "2rem (32px)",
              },
              {
                prop: "10",
                type: "number",
                default: "-",
                description: "2.5rem (40px)",
              },
              {
                prop: "12",
                type: "number",
                default: "-",
                description: "3rem (48px)",
              },
              {
                prop: "16",
                type: "number",
                default: "-",
                description: "4rem (64px)",
              },
              {
                prop: "20",
                type: "number",
                default: "-",
                description: "5rem (80px)",
              },
              {
                prop: "24",
                type: "number",
                default: "-",
                description: "6rem (96px)",
              },
            ],
          },
          {
            title: "Usage Patterns",
            props: [
              {
                prop: "Auto spacer",
                type: "Flex container",
                default: "-",
                description:
                  "Use in flex containers. Spacer gets flex: 1, pushing siblings apart.",
              },
              {
                prop: "Fixed horizontal",
                type: "HStack",
                default: "-",
                description:
                  "Use with HStack for consistent horizontal gaps between items.",
              },
              {
                prop: "Fixed vertical",
                type: "VStack",
                default: "-",
                description:
                  "Use with VStack for consistent vertical gaps between items.",
              },
              {
                prop: "Multiple spacers",
                type: "Flex container",
                default: "-",
                description:
                  "Multiple spacers share remaining space equally in auto mode.",
              },
              {
                prop: "Mixed mode",
                type: "Flex container",
                default: "-",
                description:
                  "Combine auto and fixed spacers in same container for complex layouts.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
