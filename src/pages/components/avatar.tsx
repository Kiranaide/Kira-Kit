import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarStack,
  AutoAvatar,
} from "@/components/ui/avatar";
import { IconAccessible, IconPalette, IconStack2 } from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs";

// =============================================================================
// Demo Components
// =============================================================================

function BasicDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
        <AvatarFallback>VC</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    </div>
  );
}

const basicCode = `import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>`;

function SizesDemo() {
  return (
    <div className="flex items-end gap-6">
      <Avatar size="xs">
        <AvatarFallback>XS</AvatarFallback>
      </Avatar>
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="default">
        <AvatarFallback>DF</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
      <Avatar size="2xl">
        <AvatarFallback>2XL</AvatarFallback>
      </Avatar>
      <Avatar size="3xl">
        <AvatarFallback>3XL</AvatarFallback>
      </Avatar>
      <Avatar size="4xl">
        <AvatarFallback>4XL</AvatarFallback>
      </Avatar>
    </div>
  );
}

const sizesCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Sizes: xs (24px), sm (32px), default (40px), lg (48px), 
//        xl (56px), 2xl (64px), 3xl (80px), 4xl (128px)
<Avatar size="xs"><AvatarFallback>XS</AvatarFallback></Avatar>
<Avatar size="lg"><AvatarFallback>LG</AvatarFallback></Avatar>
<Avatar size="4xl"><AvatarFallback>4XL</AvatarFallback></Avatar>`;

function ShapesDemo() {
  return (
    <div className="flex items-center gap-6">
      <Avatar shape="circle" size="lg">
        <AvatarFallback>Circle</AvatarFallback>
      </Avatar>
      <Avatar shape="rounded" size="lg">
        <AvatarFallback>Rounded</AvatarFallback>
      </Avatar>
      <Avatar shape="square" size="lg">
        <AvatarFallback>Square</AvatarFallback>
      </Avatar>
    </div>
  );
}

const shapesCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Shapes: circle (default), rounded, square
<Avatar shape="circle"><AvatarFallback>C</AvatarFallback></Avatar>
<Avatar shape="rounded"><AvatarFallback>R</AvatarFallback></Avatar>
<Avatar shape="square"><AvatarFallback>S</AvatarFallback></Avatar>`;

function StatusDemo() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar status="online" size="lg">
          <AvatarFallback>ON</AvatarFallback>
        </Avatar>
        <Avatar status="offline" size="lg">
          <AvatarFallback>OFF</AvatarFallback>
        </Avatar>
        <Avatar status="busy" size="lg">
          <AvatarFallback>BUSY</AvatarFallback>
        </Avatar>
        <Avatar status="away" size="lg">
          <AvatarFallback>AWAY</AvatarFallback>
        </Avatar>
        <Avatar status="offline_gray" size="lg">
          <AvatarFallback>GRAY</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          Status Positions
        </h4>
        <div className="grid gap-6 md:grid-cols-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Top Right</p>
            <Avatar status="online" statusPosition="top-right" size="lg">
              <AvatarFallback>TR</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Top Left</p>
            <Avatar status="online" statusPosition="top-left" size="lg">
              <AvatarFallback>TL</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Bottom Right</p>
            <Avatar status="online" statusPosition="bottom-right" size="lg">
              <AvatarFallback>BR</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Bottom Left</p>
            <Avatar status="online" statusPosition="bottom-left" size="lg">
              <AvatarFallback>BL</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );
}

const statusCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Status indicators
<Avatar status="online"><AvatarFallback>ON</AvatarFallback></Avatar>
<Avatar status="offline"><AvatarFallback>OFF</AvatarFallback></Avatar>
<Avatar status="busy"><AvatarFallback>BUSY</AvatarFallback></Avatar>
<Avatar status="away"><AvatarFallback>AWAY</AvatarFallback></Avatar>

// Status position (default: top-right)
<Avatar status="online" statusPosition="top-right">...</Avatar>
<Avatar status="online" statusPosition="top-left">...</Avatar>
<Avatar status="online" statusPosition="bottom-right">...</Avatar>
<Avatar status="online" statusPosition="bottom-left">...</Avatar>`;

function RingsDemo() {
  return (
    <div className="flex items-center gap-6">
      <Avatar ring="primary" size="lg">
        <AvatarFallback>PR</AvatarFallback>
      </Avatar>
      <Avatar ring="success" size="lg">
        <AvatarFallback>SU</AvatarFallback>
      </Avatar>
      <Avatar ring="warning" size="lg">
        <AvatarFallback>WA</AvatarFallback>
      </Avatar>
      <Avatar ring="destructive" size="lg">
        <AvatarFallback>DE</AvatarFallback>
      </Avatar>
    </div>
  );
}

const ringsCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Ring colors
<Avatar ring="primary"><AvatarFallback>P</AvatarFallback></Avatar>
<Avatar ring="success"><AvatarFallback>S</AvatarFallback></Avatar>
<Avatar ring="warning"><AvatarFallback>W</AvatarFallback></Avatar>
<Avatar ring="destructive"><AvatarFallback>D</AvatarFallback></Avatar>`;

function BadgeDemo() {
  return (
    <div className="flex items-center gap-8">
      <div className="relative">
        <Avatar size="lg">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <AvatarBadge content="5" size="sm" />
      </div>
      <div className="relative">
        <Avatar size="lg">
          <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
          <AvatarFallback>VC</AvatarFallback>
        </Avatar>
        <AvatarBadge variant="success" content="✓" size="default" />
      </div>
      <div className="relative">
        <Avatar size="lg">
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <AvatarBadge variant="destructive" content="!" />
      </div>
      <div className="relative">
        <Avatar size="lg">
          <AvatarFallback>GM</AvatarFallback>
        </Avatar>
        <AvatarBadge variant="info" content="12" />
      </div>
    </div>
  );
}

const badgeCode = `import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "@/components/ui/avatar"

<div className="relative">
  <Avatar size="lg">
    <AvatarImage src="..." alt="..." />
    <AvatarFallback>CN</AvatarFallback>
  </Avatar>
  <AvatarBadge content="5" size="sm" />
</div>

// Variants
<AvatarBadge variant="success" content="✓" />
<AvatarBadge variant="destructive" content="!" />
<AvatarBadge variant="info" content="12" />`;

function AutoAvatarDemo() {
  return (
    <div className="flex items-center gap-4">
      <AutoAvatar name="John Doe" size="lg" />
      <AutoAvatar name="Jane Smith" size="lg" />
      <AutoAvatar name="Bob Johnson" size="lg" />
      <AutoAvatar name="Alice" size="lg" />
      <AutoAvatar name="Charlie Brown" size="lg" />
    </div>
  );
}

const autoAvatarCode = `import { AutoAvatar } from "@/components/ui/avatar"

// Automatically generates initials from name
<AutoAvatar name="John Doe" size="lg" />
<AutoAvatar name="Jane Smith" size="lg" />
<AutoAvatar name="Alice" size="lg" />`;

function GradientDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar size="lg">
        <AvatarFallback variant="gradient">CN</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback variant="gradient" gradient="blue">
          BL
        </AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback variant="gradient" gradient="purple">
          PU
        </AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback variant="gradient" gradient="green">
          GR
        </AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback variant="gradient" gradient="orange">
          OR
        </AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback variant="gradient" gradient="pink">
          PK
        </AvatarFallback>
      </Avatar>
    </div>
  );
}

const gradientCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Gradient fallback backgrounds
<AvatarFallback variant="gradient">CN</AvatarFallback>
<AvatarFallback variant="gradient" gradient="blue">BL</AvatarFallback>
<AvatarFallback variant="gradient" gradient="purple">PU</AvatarFallback>
<AvatarFallback variant="gradient" gradient="green">GR</AvatarFallback>`;

function GroupDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default (max 3)</p>
        <AvatarGroup max={3}>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          Large size with status
        </p>
        <AvatarGroup max={4} size="lg">
          <Avatar size="lg" status="online">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar size="lg" status="online">
            <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <Avatar size="lg" status="busy">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar size="lg" status="away">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar size="lg" status="offline">
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
    </div>
  );
}

const groupCode = `import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"

// Avatar group with overflow
<AvatarGroup max={3}>
  <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>C</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>D</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>E</AvatarFallback></Avatar>
</AvatarGroup>

// With size and status
<AvatarGroup max={4} size="lg">
  <Avatar size="lg" status="online">...</Avatar>
  <Avatar size="lg" status="busy">...</Avatar>
</AvatarGroup>`;

function StackDemo() {
  return (
    <div className="max-w-xl">
      <AvatarStack>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
          <AvatarFallback>VC</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>AB</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>CD</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>EF</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>GH</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>IJ</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>KL</AvatarFallback>
        </Avatar>
      </AvatarStack>
    </div>
  );
}

const stackCode = `import { Avatar, AvatarFallback, AvatarStack } from "@/components/ui/avatar"

// Horizontally scrolling stack
<AvatarStack>
  <Avatar><AvatarFallback>A</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>B</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>C</AvatarFallback></Avatar>
</AvatarStack>`;

// =============================================================================
// Main Page Component
// =============================================================================

export default function AvatarPage() {
  const features = [
    {
      title: "Accessible",
      description: "Proper alt text support and fallback handling.",
      icon: <IconAccessible className="w-4 h-4 text-primary" />,
    },
    {
      title: "Customizable",
      description: "8 sizes, 3 shapes, status indicators, and ring colors.",
      icon: <IconPalette className="w-4 h-4 text-primary" />,
    },
    {
      title: "Composable",
      description:
        "AvatarGroup, AvatarStack, AutoAvatar, and gradient fallbacks.",
      icon: <IconStack2 className="w-4 h-4 text-primary" />,
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Avatar"
          description="Image with fallback for when image fails to load"
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapper
          title="Size Variants"
          description="From 24px (xs) to 128px (4xl)"
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "shapes",
      label: "Shapes",
      demo: (
        <DemoWrapper
          title="Shape Variants"
          description="Circle, rounded, or square avatars"
          code={shapesCode}
        >
          <ShapesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "status",
      label: "Status",
      demo: (
        <DemoWrapper
          title="Status Indicators"
          description="Online, offline, busy, away status with configurable positions"
          code={statusCode}
        >
          <StatusDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "rings",
      label: "Rings",
      demo: (
        <DemoWrapper
          title="Ring Colors"
          description="Colored border rings around avatars"
          code={ringsCode}
        >
          <RingsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "badge",
      label: "Badge",
      demo: (
        <DemoWrapper
          title="Avatar Badge"
          description="Notification counts or status indicators"
          code={badgeCode}
        >
          <BadgeDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "auto",
      label: "AutoAvatar",
      demo: (
        <DemoWrapper
          title="Auto Avatar"
          description="Automatically generates initials from name"
          code={autoAvatarCode}
        >
          <AutoAvatarDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "gradient",
      label: "Gradient",
      demo: (
        <DemoWrapper
          title="Gradient Fallback"
          description="Predefined gradient backgrounds for fallback state"
          code={gradientCode}
        >
          <GradientDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "group",
      label: "Group",
      demo: (
        <DemoWrapper
          title="Avatar Group"
          description="Stacked avatars with automatic overflow indicator"
          code={groupCode}
        >
          <GroupDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "stack",
      label: "Stack",
      demo: (
        <DemoWrapper
          title="Avatar Stack"
          description="Horizontally scrolling stack of avatars"
          code={stackCode}
        >
          <StackDemo />
        </DemoWrapper>
      ),
    },
  ];

  const usageCode = `import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback, 
  AvatarBadge, 
  AvatarGroup, 
  AvatarStack, 
  AutoAvatar 
} from "@/components/ui/avatar"

// Basic
<Avatar>
  <AvatarImage src="https://..." alt="Name" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

// Sizes: xs, sm, default, lg, xl, 2xl, 3xl, 4xl
<Avatar size="lg">...</Avatar>

// Shapes: circle, rounded, square
<Avatar shape="rounded">...</Avatar>

// Status indicators
<Avatar status="online">...</Avatar>
<Avatar status="busy" statusPosition="bottom-right">...</Avatar>

// Ring colors
<Avatar ring="primary">...</Avatar>

// Badge with notification count
<div className="relative">
  <Avatar><AvatarFallback>CN</AvatarFallback></Avatar>
  <AvatarBadge content="5" />
</div>

// Auto avatar with initials
<AutoAvatar name="John Doe" size="lg" />

// Avatar group
<AvatarGroup max={3}>
  <Avatar>...</Avatar>
  <Avatar>...</Avatar>
</AvatarGroup>

// Avatar stack (scrollable)
<AvatarStack>
  <Avatar>...</Avatar>
  <Avatar>...</Avatar>
</AvatarStack>`;

  const apiReference = [
    {
      title: "Avatar",
      props: [
        {
          prop: "size",
          type: '"xs" | "sm" | "default" | "lg" | "xl" | "2xl" | "3xl" | "4xl"',
          default: '"default"',
          description: "Avatar size",
        },
        {
          prop: "shape",
          type: '"circle" | "rounded" | "square"',
          default: '"circle"',
          description: "Avatar shape",
        },
        {
          prop: "status",
          type: '"online" | "offline" | "busy" | "away" | "offline_gray"',
          default: "-",
          description: "Status indicator",
        },
        {
          prop: "statusPosition",
          type: '"top-right" | "top-left" | "bottom-right" | "bottom-left"',
          default: '"top-right"',
          description: "Status position",
        },
        {
          prop: "ring",
          type: '"primary" | "success" | "warning" | "destructive"',
          default: "-",
          description: "Ring color",
        },
      ],
    },
    {
      title: "AvatarImage",
      props: [
        { prop: "src", type: "string", default: "-", description: "Image URL" },
        {
          prop: "alt",
          type: "string",
          default: "-",
          description: "Alt text for accessibility",
        },
      ],
    },
    {
      title: "AvatarFallback",
      props: [
        {
          prop: "variant",
          type: '"default" | "gradient"',
          default: '"default"',
          description: "Fallback style",
        },
        {
          prop: "gradient",
          type: '"default" | "blue" | "purple" | "green" | "orange" | "pink"',
          default: '"default"',
          description: "Gradient color",
        },
      ],
    },
    {
      title: "AvatarBadge",
      props: [
        {
          prop: "content",
          type: "string",
          default: "-",
          description: "Badge content",
        },
        {
          prop: "variant",
          type: '"default" | "success" | "destructive" | "info"',
          default: '"default"',
          description: "Badge variant",
        },
        {
          prop: "size",
          type: '"sm" | "default"',
          default: '"default"',
          description: "Badge size",
        },
      ],
    },
    {
      title: "AvatarGroup",
      props: [
        {
          prop: "max",
          type: "number",
          default: "3",
          description: "Maximum visible avatars",
        },
        {
          prop: "size",
          type: "AvatarSize",
          default: '"default"',
          description: "Size of all avatars",
        },
      ],
    },
    {
      title: "AutoAvatar",
      props: [
        {
          prop: "name",
          type: "string",
          default: "-",
          description: "Name to generate initials from",
        },
        {
          prop: "...props",
          type: "AvatarProps",
          default: "-",
          description: "All Avatar props",
        },
      ],
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Avatar"
        description="Image element with fallback for representing users, with status indicators, badges, and group layouts."
        version="v2.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiReference} />
    </ComponentPage>
  );
}
