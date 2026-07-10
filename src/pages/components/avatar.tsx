import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarTyping,
  AvatarGroup,
  AvatarStack,
  KiraAvatar,
} from "@/components/ui/avatar";
import { IconAccessible, IconPalette, IconStack2, IconUser } from "@tabler/icons-react";
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
      <Avatar size="lg" badge={<AvatarBadge content="5" size="sm" />}>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Avatar
        size="lg"
        badge={<AvatarBadge variant="success" content="✓" size="default" />}
      >
        <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
        <AvatarFallback>VC</AvatarFallback>
      </Avatar>
      <Avatar
        size="lg"
        badge={<AvatarBadge variant="destructive" content="!" />}
      >
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar size="lg" badge={<AvatarBadge variant="info" content="12" />}>
        <AvatarFallback>GM</AvatarFallback>
      </Avatar>
    </div>
  );
}

const badgeCode = `import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from "@/components/ui/avatar"

// Pass badge via the \`badge\` prop — it's rendered next to (not inside)
// the avatar's image, so it isn't clipped by its overflow-hidden shape.
<Avatar size="lg" badge={<AvatarBadge content="5" size="sm" />}>
  <AvatarImage src="..." alt="..." />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

// Variants
<Avatar badge={<AvatarBadge variant="success" content="✓" />}>...</Avatar>
<Avatar badge={<AvatarBadge variant="destructive" content="!" />}>...</Avatar>
<Avatar badge={<AvatarBadge variant="info" content="12" />}>...</Avatar>`;

function KiraAvatarDemo() {
  return (
    <div className="flex items-center gap-4">
      <KiraAvatar name="John Doe" size="lg" status="online" statusPulse />
      <KiraAvatar
        name="Jane Smith"
        src="https://github.com/shadcn.png"
        size="lg"
        badge="3"
      />
      <KiraAvatar name="Bob Johnson" size="lg" gradient="purple" />
      <KiraAvatar name="Alice" size="lg" lastSeen="2h ago" status="away" />
      <KiraAvatar name="Team" size="lg" icon={<IconUser className="h-5 w-5" />} />
    </div>
  );
}

const kiraAvatarCode = `import { KiraAvatar } from "@/components/ui/avatar"

// Name → initials, plus status / badge / gradient / last-seen in one prop set
<KiraAvatar name="John Doe" status="online" statusPulse />
<KiraAvatar name="Jane Smith" src="https://…" badge="3" />
<KiraAvatar name="Bob Johnson" gradient="purple" />
<KiraAvatar name="Alice" lastSeen="2h ago" status="away" />`;

function LoadingDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Image → initials → icon fallback chain. Broken URLs fall back
        automatically; images blur-up as they decode.
      </p>
      <div className="flex items-center gap-4">
        <Avatar size="lg">
          <AvatarImage src="https://github.com/shadcn.png" alt="Loaded" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="https://broken.example/nope.png" alt="Broken" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="https://broken.example/nope.png" alt="Icon" />
          <AvatarFallback>
            <IconUser className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

const loadingCode = `import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Base UI drives real load/error state — fallback shows on error,
// and AvatarImage blur-ups as it decodes.
<Avatar>
  <AvatarImage src="https://…" alt="User" />
  <AvatarFallback>CN</AvatarFallback>   {/* initials */}
</Avatar>
<Avatar>
  <AvatarImage src={brokenUrl} alt="User" />
  <AvatarFallback><IconUser /></AvatarFallback>  {/* icon */}
</Avatar>`;

function PresenceDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-3">
          Pulsing online ring
        </p>
        <div className="flex items-center gap-6">
          <Avatar size="lg" status="online" statusPulse>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar size="lg" status="online" statusPulse>
            <AvatarFallback>ON</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-3">Typing indicator</p>
        <div className="flex items-center gap-3">
          <Avatar size="default">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <AvatarTyping />
        </div>
      </div>
    </div>
  );
}

const presenceCode = `import { Avatar, AvatarFallback, AvatarTyping } from "@/components/ui/avatar"

// Pulsing online ring (respects reduced motion)
<Avatar status="online" statusPulse>
  <AvatarFallback>ON</AvatarFallback>
</Avatar>

// Typing indicator
<AvatarTyping />`;

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
          With tooltips + expandable overflow
        </p>
        <AvatarGroup max={3} tooltips overflowNames={["Dana", "Erin"]}>
          <Avatar data-name="Cody">
            <AvatarImage src="https://github.com/shadcn.png" alt="Cody" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar data-name="Vera">
            <AvatarImage src="https://github.com/vercel.png" alt="Vera" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <Avatar data-name="Abe">
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar data-name="Dana">
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar data-name="Erin">
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
        </AvatarGroup>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
          With add-member affordance
        </p>
        <AvatarGroup max={3} onAddMember={() => {}}>
          <Avatar>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>VC</AvatarFallback>
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
        "AvatarGroup, AvatarStack, KiraAvatar, and gradient fallbacks.",
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
      value: "loading",
      label: "Loading & Fallback",
      demo: (
        <DemoWrapper
          title="Loading & Fallback Chain"
          description="Real load/error state with blur-up; image → initials → icon"
          code={loadingCode}
        >
          <LoadingDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "presence",
      label: "Presence & Typing",
      demo: (
        <DemoWrapper
          title="Presence & Typing"
          description="Pulsing online ring and a typing indicator (reduced-motion aware)"
          code={presenceCode}
        >
          <PresenceDemo />
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
    {
      value: "kira",
      label: "KiraAvatar",
      demo: (
        <DemoWrapper
          title="KiraAvatar"
          description="One prop-driven component: name + src + status + badge + gradient + last-seen"
          code={kiraAvatarCode}
        >
          <KiraAvatarDemo />
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
  KiraAvatar
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

// Status indicators (statusPulse for a pulsing online ring)
<Avatar status="online" statusPulse>...</Avatar>

// Ring colors
<Avatar ring="primary">...</Avatar>

// Badge with notification count — pass it via the \`badge\` prop so it's
// rendered next to (not inside) the avatar, avoiding the overflow-hidden clip
<Avatar badge={<AvatarBadge content="5" />}>
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

// KiraAvatar — one prop-driven component
<KiraAvatar name="John Doe" status="online" badge="3" lastSeen="2h ago" />

// Avatar group (tooltips + expandable overflow)
<AvatarGroup max={3} tooltips>
  <Avatar data-name="Cody">...</Avatar>
  <Avatar data-name="Vera">...</Avatar>
</AvatarGroup>

// Avatar stack (scrollable)
<AvatarStack>
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
        {
          prop: "badge",
          type: "ReactNode",
          default: "-",
          description:
            "Corner badge, e.g. <AvatarBadge />. Rendered outside the clipped image so it isn't cut off.",
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
      title: "KiraAvatar",
      props: [
        {
          prop: "name",
          type: "string",
          default: "-",
          description: "Generates initials and aria-label; enables tooltips",
        },
        {
          prop: "src",
          type: "string",
          default: "-",
          description: "Image URL (falls back to initials/icon)",
        },
        {
          prop: "badge",
          type: "ReactNode",
          default: "-",
          description: "Corner badge content",
        },
        {
          prop: "lastSeen",
          type: "string",
          default: "-",
          description: "Shows a last-seen tooltip on hover",
        },
        {
          prop: "icon",
          type: "ReactNode",
          default: "-",
          description: "Fallback icon when no image/initials",
        },
        {
          prop: "...props",
          type: "AvatarProps",
          default: "-",
          description: "size, shape, status, statusPulse, ring, gradient",
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
