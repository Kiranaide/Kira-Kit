import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
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
import {
  IconAccessible,
  IconPalette,
  IconStack2,
  IconUser,
} from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
  KeyboardShortcuts,
  Changelog,
} from "@/components/docs";

function BasicDemo() {
  return (
    <div className="flex items-center gap-4">
      <Avatar>
        <AvatarImage src="https://github.com/mui.png" alt="@mui" />
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
  <AvatarImage src="https://github.com/mui.png" alt="@mui" />
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

/* oxlint-disable anti-slop/no-shape-in-symbol-names -- These public shape props select geometric outlines, not data structures. */
function GeometryDemo() {
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
/* oxlint-enable anti-slop/no-shape-in-symbol-names */

const geometryCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
        <AvatarImage src="https://github.com/mui.png" alt="@mui" />
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
        src="https://github.com/mui.png"
        size="lg"
        badge="3"
      />
      <KiraAvatar name="Bob Johnson" size="lg" gradient="purple" />
      <KiraAvatar name="Alice" size="lg" lastSeen="2h ago" status="away" />
      <KiraAvatar
        name="Team"
        size="lg"
        icon={<IconUser className="h-5 w-5" />}
      />
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
          <AvatarImage src="https://github.com/mui.png" alt="Loaded" />
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
            <AvatarImage src="https://github.com/mui.png" alt="@mui" />
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
            <AvatarImage src="https://github.com/mui.png" alt="@mui" />
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
            <AvatarImage src="https://github.com/mui.png" alt="Cody" />
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
          <AvatarImage src="https://github.com/mui.png" alt="@mui" />
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

function StatesDemo() {
  const imageRequestId = React.useId();

  return (
    <div className="space-y-8">
      <StatesLoadingSlowImageSection imageRequestId={imageRequestId} />

      <StatesFallbackDelaySection />

      <StatesLongNameInitials35CharsSection />

      <StatesSizeExtremesXs4xlInteractiveSection />

      <StatesInteractiveAvatarRealSection />

      <StatesBlurUpKeepMountedThrottledImageSection
        imageRequestId={imageRequestId}
      />
    </div>
  );
}

const statesCode = `import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// keepMounted blur-up (default): data-loading / data-starting-style drive
// the blur → sharp transition — visible on slow images
<Avatar>
  <AvatarImage src={url} keepMounted />
  <AvatarFallback>BU</AvatarFallback>
</Avatar>

// Broken image → immediate vs delayed fallback
<AvatarFallback delay={0}>NOW</AvatarFallback>
<AvatarFallback delay={600}>600</AvatarFallback>

// Accessible status dot
<Avatar status="online" statusLabel="Online">

// Interactive: renders a real <button> — native Tab/Enter/Space semantics,
// focus ring + scale animation kept
<Avatar onClick={() => {}} aria-label="Open profile">`;

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
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
          code={geometryCode}
        >
          <GeometryDemo />
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
      label: "Typing",
      demo: (
        <DemoWrapper
          title="Typing & Presence Dots"
          description="AvatarTyping dots and status-dot presence with optional sr-only labels (reduced-motion aware)"
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
      value: "states",
      label: "States",
      demo: (
        <DemoWrapper
          title="Avatar States"
          description="Loading, error fallback, delay behavior, long names, size extremes, interactive states, keepMounted blur-up"
          code={statesCode}
        >
          <StatesDemo />
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
</AvatarStack>

// Accessible status + keepMounted blur-up
<Avatar status="online" statusLabel="Online">...</Avatar>
<AvatarImage src={url} keepMounted />

// Typing indicator
<AvatarTyping />`;

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
          prop: "statusLabel",
          type: "string",
          default: "-",
          description:
            'Screen-reader label for the status dot (e.g. "Online"). Without it the dot is decorative.',
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
        {
          prop: "onClick",
          type: "() => void",
          default: "-",
          description:
            "Makes the avatar interactive: renders a real <button> (native Tab/Enter/Space, focusable).",
        },
        {
          prop: "aria-label",
          type: "string",
          default: "-",
          description:
            'Accessible name. Non-interactive + label = span[role=img]; interactive avatars default to "Avatar" when omitted.',
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
        {
          prop: "keepMounted",
          type: "boolean",
          default: "true",
          description:
            "Keep the img mounted through loading so the blur-up transition plays (data-loading / data-starting-style attributes).",
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
      title: "AvatarStack",
      props: [
        {
          prop: "count",
          type: "number",
          default: "-",
          description: "Total member count shown on the overflow chip",
        },
        {
          prop: "size",
          type: "AvatarSize",
          default: '"default"',
          description: "Chip and avatar size",
        },
        {
          prop: "max",
          type: "number",
          default: "-",
          description: "Maximum avatars rendered before collapsing",
        },
        {
          prop: "overlap",
          type: "boolean",
          default: "true",
          description: "Overlap avatars horizontally",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Avatar elements",
        },
      ],
    },
    {
      title: "AvatarTyping",
      props: [
        {
          prop: "size",
          type: "AvatarSize",
          default: '"default"',
          description: "Dot scale",
        },
        {
          prop: "dotCount",
          type: "number",
          default: "3",
          description: "Number of typing dots",
        },
        {
          prop: "className",
          type: "string",
          default: "-",
          description: "Additional classes",
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
        version="v3.1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} />

      <KeyboardShortcuts shortcuts={avatarPageKeyboardShortcutsShortcuts} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiReference} />

      <Changelog entries={avatarPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const avatarPageKeyboardShortcutsShortcuts = [
  {
    keys: "Tab",
    description:
      "Move focus between avatars; interactive avatars are real buttons and show the focus ring",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate an interactive avatar — it renders a native <button> (inherited from the browser)",
  },
  {
    keys: "Esc",
    description:
      "Close the AvatarGroup overflow popover (inherited from Base UI)",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const avatarPageChangelogEntries = [
  {
    version: "Unreleased",
    date: "In development",
    changes: [
      {
        type: "fixed",
        title: "Focus ring at full strength",
        description:
          "Interactive avatars draw the kit focus ring as ring-ring at 3px instead of ring-ring/50 — the half-strength halo measured 1.63–2.82:1 against the page, under WCAG 1.4.11's 3:1 for a state indicator. The primary ring also inherits the retuned default-theme primary pair.",
      },
    ],
  },
  {
    version: "3.1.0",
    date: "4 November 2026",
    changes: [
      {
        type: "breaking",
        title: "Interactive avatars render a real <button>",
        description:
          'An Avatar with onClick now renders <button type="button"> via the Base UI render prop, replacing the span + tabIndex + Enter/Space shim. AT announces a button (named by aria-label); role="img" applies only to non-interactive labelled avatars.',
      },
      {
        type: "changed",
        title: "Interactive avatars get a fallback accessible name",
        description:
          'An onClick avatar without aria-label announces as "Avatar" instead of an unnamed button (§9 icon-only rule).',
      },
    ],
  },
  {
    version: "3.0.0",
    date: "2 November 2026",
    changes: [
      {
        type: "changed",
        title: "Base UI 1.9.0 audit",
        description:
          "Full v2.3 re-audit against @base-ui/react 1.9.0 (latest).",
      },
      {
        type: "fixed",
        title: "AvatarImage blur-up actually transitions",
        description:
          "The image unmounted before the loaded state, so the blur could never play. AvatarImage now defaults keepMounted and drives the blur from data-loading / data-starting-style attributes.",
      },
      {
        type: "added",
        title: "statusLabel for accessible status dots",
        description:
          'Pass statusLabel="Online" to expose the status via a screen-reader label (color alone no longer carries meaning — WCAG 1.4.1).',
      },
      {
        type: "breaking",
        title: "AvatarStack chip shows a bare count",
        description:
          'The overflow chip now shows the number only (e.g. 5) with aria-label="5 members", instead of the misleading +5.',
      },
      {
        type: "fixed",
        title: "KiraAvatar forwards unknown props",
        description:
          "id, data-*, aria-*, onClick and interactive now reach the underlying Avatar instead of being dropped.",
      },
      {
        type: "changed",
        title: "AvatarBadge cva default aligned to destructive",
        description:
          "avatarBadgeVariants' default variant now matches the component signature default (destructive). Only affects direct cva calls.",
      },
      {
        type: "fixed",
        title: "AvatarGroup a11y",
        description:
          'Group root has role="group" and an overridable aria-label ("Avatar group").',
      },
      {
        type: "fixed",
        title: "scrollbar-hide utility added",
        description:
          "AvatarStack referenced a scrollbar-hide class that didn't exist; the utility is now defined in index.css (also fixes camera.tsx).",
      },
      {
        type: "changed",
        title: "Interactive focus ring + transitions",
        description:
          "Interactive avatars use the kit focus ring (ring-ring/50, 3px) and a merged transition so active:scale-95 animates.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "15 December 2025",
    changes: [
      {
        type: "added",
        title: "Initial documented release",
        description:
          "Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarTyping, AvatarGroup, AvatarStack, KiraAvatar.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

function StatesLoadingSlowImageSection({
  imageRequestId,
}: {
  imageRequestId: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Loading (slow image)</p>
      <div className="flex items-center gap-4">
        <Avatar size="lg">
          <AvatarImage
            src={`https://picsum.photos/seed/slow-avatar/200?r=${imageRequestId}`}
            alt="Slow image"
          />
          <AvatarFallback>SL</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarImage
            src="https://broken.example.invalid/x.png"
            alt="Broken"
          />
          <AvatarFallback>BR</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

function StatesFallbackDelaySection() {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">
        Fallback delay: <code>delay=0</code> (immediate) vs{" "}
        <code>delay=600</code>
      </p>
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage
            src="https://broken.example.invalid/x.png"
            alt="Immediate"
          />
          <AvatarFallback delay={0}>NOW</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage
            src="https://broken.example.invalid/x.png"
            alt="Delayed"
          />
          <AvatarFallback delay={600}>600</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

function StatesLongNameInitials35CharsSection() {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">Long name initials (35+ chars)</p>
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>
            {(() => {
              // getInitials of a very long name stays bounded
              const initials = "Alexandra Maximilian Bartholomew Wellington III"
                .trim()
                .split(/\s+/)
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return initials;
            })()}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">
          Alexandra Maximilian Bartholomew Wellington III
        </span>
      </div>
    </div>
  );
}

function StatesSizeExtremesXs4xlInteractiveSection() {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">
        Size extremes (xs / 4xl) + interactive hover/focus/active
      </p>
      <div className="flex items-center gap-4">
        <Avatar size="xs">
          <AvatarFallback>XS</AvatarFallback>
        </Avatar>
        <Avatar size="4xl">
          <AvatarFallback>4XL</AvatarFallback>
        </Avatar>
        <Avatar onClick={() => {}} aria-label="Interactive avatar">
          <AvatarFallback>GO</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>PL</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

function StatesInteractiveAvatarRealSection() {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">
        Interactive avatar = real <code>&lt;button&gt;</code> (was a span +
        keyboard shim). Tab to it, Enter/Space activate, AT announces a button
        named by <code>aria-label</code>.
      </p>
      <div className="flex items-center gap-4">
        <Avatar onClick={() => {}} aria-label="Open Priya's profile">
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
        <Avatar
          onClick={() => {}}
          aria-label="Open Marcus's profile"
          ring="primary"
        >
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground max-w-64">
          Inspect the DOM: the interactive ones are &lt;button&gt;, the labelled
          ones &lt;span role="img"&gt;.
        </span>
      </div>
    </div>
  );
}

function StatesBlurUpKeepMountedThrottledImageSection({
  imageRequestId,
}: {
  imageRequestId: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">
        Blur-up (keepMounted) — throttled image shows blur → sharp
      </p>
      <div className="flex items-center gap-4">
        <Avatar size="lg">
          <AvatarImage
            src={`https://picsum.photos/seed/blur-up/200?r=${imageRequestId}`}
            alt="Blur up"
            keepMounted
          />
          <AvatarFallback>BU</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground max-w-64">
          Watch the image enter blurred/scaled and settle sharp (500ms, respects
          reduced motion).
        </span>
      </div>
    </div>
  );
}
