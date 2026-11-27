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
  getInitials,
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
    <div className="flex flex-wrap items-end gap-6">
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
//        xl (64px), 2xl (80px), 3xl (96px), 4xl (128px)
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
      <div className="flex flex-wrap items-center gap-6">
        <Avatar status="online" statusLabel="Online" size="lg">
          <AvatarFallback>ON</AvatarFallback>
        </Avatar>
        <Avatar status="offline" statusLabel="Offline" size="lg">
          <AvatarFallback>OFF</AvatarFallback>
        </Avatar>
        <Avatar status="busy" statusLabel="Busy" size="lg">
          <AvatarFallback>BUSY</AvatarFallback>
        </Avatar>
        <Avatar status="away" statusLabel="Away" size="lg">
          <AvatarFallback>AWAY</AvatarFallback>
        </Avatar>
        <Avatar status="offline_gray" statusLabel="Inactive" size="lg">
          <AvatarFallback>GRAY</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">
          Status Positions
        </h4>
        <div className="grid gap-6 md:grid-cols-4">
          <div className="text-center">
            <p className="mb-2 text-sm text-muted-foreground">Top Right</p>
            <Avatar status="online" statusPosition="top-right" size="lg">
              <AvatarFallback>TR</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <p className="mb-2 text-sm text-muted-foreground">Top Left</p>
            <Avatar status="online" statusPosition="top-left" size="lg">
              <AvatarFallback>TL</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <p className="mb-2 text-sm text-muted-foreground">Bottom Right</p>
            <Avatar status="online" statusPosition="bottom-right" size="lg">
              <AvatarFallback>BR</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-center">
            <p className="mb-2 text-sm text-muted-foreground">Bottom Left</p>
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

// Status indicators with accessible labels
<Avatar status="online" statusLabel="Online"><AvatarFallback>ON</AvatarFallback></Avatar>
<Avatar status="offline" statusLabel="Offline"><AvatarFallback>OFF</AvatarFallback></Avatar>
<Avatar status="busy" statusLabel="Busy"><AvatarFallback>BUSY</AvatarFallback></Avatar>
<Avatar status="away" statusLabel="Away"><AvatarFallback>AWAY</AvatarFallback></Avatar>

// Status position (default: bottom-right)
<Avatar status="online" statusPosition="top-right">...</Avatar>
<Avatar status="online" statusPosition="top-left">...</Avatar>
<Avatar status="online" statusPosition="bottom-right">...</Avatar>
<Avatar status="online" statusPosition="bottom-left">...</Avatar>`;

function RingsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <Avatar ring="primary" size="lg">
        <AvatarFallback>PR</AvatarFallback>
      </Avatar>
      <Avatar ring="secondary" size="lg">
        <AvatarFallback>SC</AvatarFallback>
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
      <Avatar ring="info" size="lg">
        <AvatarFallback>IN</AvatarFallback>
      </Avatar>
    </div>
  );
}

const ringsCode = `import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Ring colors
<Avatar ring="primary"><AvatarFallback>PR</AvatarFallback></Avatar>
<Avatar ring="secondary"><AvatarFallback>SC</AvatarFallback></Avatar>
<Avatar ring="success"><AvatarFallback>SU</AvatarFallback></Avatar>
<Avatar ring="warning"><AvatarFallback>WA</AvatarFallback></Avatar>
<Avatar ring="destructive"><AvatarFallback>DE</AvatarFallback></Avatar>
<Avatar ring="info"><AvatarFallback>IN</AvatarFallback></Avatar>`;

function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
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

// Pass badge via the \`badge\` prop — it is rendered next to (not inside)
// the avatar's image, so it isn't clipped by overflow-hidden.
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
    <div className="flex flex-wrap items-center gap-4">
      <KiraAvatar
        name="John Doe"
        size="lg"
        status="online"
        statusLabel="Online"
        statusPulse
      />
      <KiraAvatar
        name="Jane Smith"
        src="https://github.com/mui.png"
        size="lg"
        badge="3"
      />
      <KiraAvatar name="Bob Johnson" size="lg" gradient="purple" />
      <KiraAvatar
        name="Alice"
        size="lg"
        lastSeen="2h ago"
        status="away"
        statusLabel="Away"
      />
      <KiraAvatar
        name="Team"
        size="lg"
        icon={<IconUser className="size-5" aria-hidden="true" />}
      />
    </div>
  );
}

const kiraAvatarCode = `import { KiraAvatar } from "@/components/ui/avatar"

// Name → initials, plus status / badge / gradient / last-seen in one prop set
<KiraAvatar name="John Doe" status="online" statusLabel="Online" statusPulse />
<KiraAvatar name="Jane Smith" src="https://…" badge="3" />
<KiraAvatar name="Bob Johnson" gradient="purple" />
<KiraAvatar name="Alice" lastSeen="2h ago" status="away" statusLabel="Away" />`;

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
            <IconUser className="size-5" aria-hidden="true" />
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
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
<Avatar>
  <AvatarImage src={brokenUrl} alt="User" />
  <AvatarFallback><IconUser aria-hidden="true" /></AvatarFallback>
</Avatar>`;

function PresenceDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm text-muted-foreground">
          Pulsing online ring
        </p>
        <div className="flex items-center gap-6">
          <Avatar size="lg" status="online" statusLabel="Online" statusPulse>
            <AvatarImage src="https://github.com/mui.png" alt="@mui" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar size="lg" status="online" statusLabel="Online" statusPulse>
            <AvatarFallback>ON</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-muted-foreground">Typing indicator</p>
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
<Avatar status="online" statusLabel="Online" statusPulse>
  <AvatarFallback>ON</AvatarFallback>
</Avatar>

// Typing indicator
<AvatarTyping />`;

function GradientDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
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
  const [memberCount, setMemberCount] = React.useState(2);

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Default (max 3)</p>
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
        <p className="mb-2 text-sm text-muted-foreground">
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
        <p className="mb-2 text-sm text-muted-foreground">
          With add-member affordance ({memberCount} members)
        </p>
        <AvatarGroup
          max={4}
          onAddMember={() => setMemberCount((count) => Math.min(6, count + 1))}
        >
          {groupMembers.slice(0, memberCount).map((member) => (
            <Avatar key={member.id} data-name={member.name}>
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>
      </div>
    </div>
  );
}

const groupCode = `import { Avatar, AvatarImage, AvatarFallback, AvatarGroup } from "@/components/ui/avatar"

// Avatar group with tooltips and expandable overflow popover
<AvatarGroup max={3} tooltips overflowNames={["Dana", "Erin"]}>
  <Avatar data-name="Cody"><AvatarFallback>CN</AvatarFallback></Avatar>
  <Avatar data-name="Vera"><AvatarFallback>VC</AvatarFallback></Avatar>
  <Avatar data-name="Abe"><AvatarFallback>AB</AvatarFallback></Avatar>
  <Avatar data-name="Dana"><AvatarFallback>CD</AvatarFallback></Avatar>
  <Avatar data-name="Erin"><AvatarFallback>EF</AvatarFallback></Avatar>
</AvatarGroup>

// With add-member action
<AvatarGroup max={4} onAddMember={handleAdd}>
  <Avatar><AvatarFallback>CN</AvatarFallback></Avatar>
  <Avatar><AvatarFallback>VC</AvatarFallback></Avatar>
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

// Horizontally scrolling stack with total member count chip
<AvatarStack showCount>
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
      <StatesLongNameInitialsSection />
      <StatesSizeExtremesSection />
      <StatesInteractiveAvatarSection />
      <StatesBlurUpSection imageRequestId={imageRequestId} />
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
<Avatar status="online" statusLabel="Online">...</Avatar>

// Interactive: renders a real <button> — native Tab/Enter/Space semantics
<Avatar onClick={() => {}} aria-label="Open profile">...</Avatar>`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-6 rounded-lg border border-border p-4">
      <div className="flex items-center gap-3">
        <KiraAvatar
          name="Alexandra Maximilian Bartholomew Wellington III"
          status="online"
          statusLabel="Online"
          badge="99+"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            Alexandra Maximilian Bartholomew Wellington III
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Long name collapses to 2 initials without overflow
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Avatar aria-label="Empty fallback avatar">
          <AvatarFallback />
        </Avatar>
        <KiraAvatar
          name=""
          icon={<IconUser className="size-4" aria-hidden="true" />}
        />
        <Avatar
          aria-label="Disabled profile"
          aria-disabled="true"
          className="opacity-50"
        >
          <AvatarFallback>DS</AvatarFallback>
        </Avatar>
      </div>

      <AvatarGroup
        max={2}
        tooltips
        overflowNames={["Christopher", "Bartholomew", "Evangeline"]}
      >
        <KiraAvatar name="Alex Mercer" />
        <KiraAvatar name="Priya Nair" />
        <KiraAvatar name="Christopher" />
        <KiraAvatar name="Bartholomew" />
        <KiraAvatar name="Evangeline" />
      </AvatarGroup>
    </div>
  );
}

const stressCode = `import { Avatar, AvatarFallback, AvatarGroup, KiraAvatar } from "@/components/ui/avatar"
import { IconUser } from "@tabler/icons-react"

// Narrow container (max-w-xs): long names, empty fallback, disabled state, and group overflow
<div className="max-w-xs space-y-6">
  <KiraAvatar
    name="Alexandra Maximilian Bartholomew Wellington III"
    status="online"
    statusLabel="Online"
    badge="99+"
  />
  <Avatar aria-label="Empty fallback avatar">
    <AvatarFallback />
  </Avatar>
  <KiraAvatar name="" icon={<IconUser className="size-4" aria-hidden="true" />} />
  <AvatarGroup max={2} tooltips overflowNames={["Christopher", "Bartholomew", "Evangeline"]}>
    <KiraAvatar name="Alex Mercer" />
    <KiraAvatar name="Priya Nair" />
    <KiraAvatar name="Christopher" />
    <KiraAvatar name="Bartholomew" />
    <KiraAvatar name="Evangeline" />
  </AvatarGroup>
</div>`;

const avatarUsageCode = `import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarTyping,
  AvatarGroup,
  AvatarStack,
  KiraAvatar,
} from "@/components/ui/avatar"

// Composable primitives
<Avatar status="online" statusLabel="Online" badge={<AvatarBadge content="5" />}>
  <AvatarImage src="https://..." alt="Jane Doe" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>

// KiraAvatar — single prop-driven wrapper
<KiraAvatar name="Jane Doe" status="online" statusLabel="Online" badge="3" lastSeen="2h ago" />

// AvatarGroup with tooltips and overflow popover
<AvatarGroup max={3} tooltips overflowNames={["Dana", "Erin"]}>
  <Avatar data-name="Cody"><AvatarFallback>CN</AvatarFallback></Avatar>
  <Avatar data-name="Vera"><AvatarFallback>VC</AvatarFallback></Avatar>
</AvatarGroup>

// Typing indicator
<AvatarTyping />`;

export default function AvatarPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Avatar"
        description="Image element with fallback for representing users, with status indicators, badges, and group layouts."
        version="v3.1.1"
      />

      <FeatureGrid
        features={avatarPageFeatures}
        description="Accessible user avatars built on Base UI primitives."
      />

      <DemoTabs defaultValue="basic" tabs={avatarPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={avatarPageShortcuts}
        description="Keyboard navigation and activation bindings."
      />

      <UsageBlock
        code={avatarUsageCode}
        title="Usage"
        description="Compose Avatar primitives directly or use KiraAvatar for one-line user avatars."
        notes={avatarPageUsageNotes}
      />

      <APIReference
        sections={avatarPageAPISections}
        description="Props, types, and defaults for every exported Avatar part."
      />

      <Changelog
        entries={avatarPageChangelogEntries}
        title="Changelog"
        description="Version history for Avatar."
      />
    </ComponentPage>
  );
}

const groupMembers = [
  { id: "cn", name: "Cody", initials: "CN" },
  { id: "vc", name: "Vera", initials: "VC" },
  { id: "ab", name: "Abe", initials: "AB" },
  { id: "cd", name: "Dana", initials: "CD" },
  { id: "ef", name: "Erin", initials: "EF" },
  { id: "gh", name: "Gale", initials: "GH" },
] as const;

const avatarPageFeatures = [
  {
    title: "Accessible",
    description:
      "Real button semantics for interactive avatars, alt text support, and screen-reader status labels.",
    icon: <IconAccessible className="size-4 text-primary" aria-hidden="true" />,
  },
  {
    title: "Customizable",
    description:
      "8 sizes, 3 shapes, status indicators, badges, and ring colors.",
    icon: <IconPalette className="size-4 text-primary" aria-hidden="true" />,
  },
  {
    title: "Composable",
    description:
      "AvatarGroup, AvatarStack, AvatarTyping, KiraAvatar, and gradient fallbacks.",
    icon: <IconStack2 className="size-4 text-primary" aria-hidden="true" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const avatarPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Basic Avatar"
        description="Image with fallback for when image fails to load."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Size Variants"
        description="From 24px (xs) to 128px (4xl)."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "shapes",
    label: "Shapes",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Shape Variants"
        description="Circle, rounded, or square avatars."
        code={geometryCode}
      >
        <GeometryDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "gradient",
    label: "Gradient",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Gradient Fallback"
        description="Predefined gradient backgrounds for fallback state."
        code={gradientCode}
      >
        <GradientDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "status",
    label: "Status",
    group: "Indicators",
    demo: (
      <DemoWrapper
        title="Status Indicators"
        description="Online, offline, busy, and away status dots with configurable positions."
        code={statusCode}
      >
        <StatusDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "rings",
    label: "Rings",
    group: "Indicators",
    demo: (
      <DemoWrapper
        title="Ring Colors"
        description="Colored border rings around avatars."
        code={ringsCode}
      >
        <RingsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "badge",
    label: "Badge",
    group: "Indicators",
    demo: (
      <DemoWrapper
        title="Avatar Badge"
        description="Notification counts or status indicators positioned outside the clipped frame."
        code={badgeCode}
      >
        <BadgeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "presence",
    label: "Typing",
    group: "Indicators",
    demo: (
      <DemoWrapper
        title="Typing & Presence Dots"
        description="AvatarTyping dots and pulsing online status (reduced-motion aware)."
        code={presenceCode}
      >
        <PresenceDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "group",
    label: "Group",
    group: "Layouts",
    demo: (
      <DemoWrapper
        title="Avatar Group"
        description="Overlapping avatars with tooltips, overflow popover, and add-member affordance."
        code={groupCode}
      >
        <GroupDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "stack",
    label: "Stack",
    group: "Layouts",
    demo: (
      <DemoWrapper
        title="Avatar Stack"
        description="Horizontally scrolling stack of avatars with a member count chip."
        code={stackCode}
      >
        <StackDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraAvatar",
    group: "KiraAvatar",
    demo: (
      <DemoWrapper
        title="KiraAvatar"
        description="One prop-driven component: name, src, status, badge, gradient, and last-seen tooltip."
        code={kiraAvatarCode}
      >
        <KiraAvatarDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "loading",
    label: "Loading & Fallback",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Loading & Fallback Chain"
        description="Real load/error state with blur-up; image → initials → icon."
        code={loadingCode}
      >
        <LoadingDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Avatar States"
        description="Loading, error fallback, delay behavior, long names, size extremes, interactive buttons, and blur-up."
        code={statesCode}
      >
        <StatesDemo />
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
        description="Long names, empty fallbacks, disabled styling, and group overflow inside a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const avatarPageShortcuts = [
  {
    keys: "Tab",
    description:
      "Move focus between interactive avatars, AvatarGroup overflow triggers, and add-member buttons.",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate an interactive avatar (renders a native <button>) or open the AvatarGroup overflow popover.",
  },
  {
    keys: "Esc",
    description:
      "Close the AvatarGroup overflow popover or last-seen tooltip (provided by Base UI).",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const avatarPageUsageNotes = [
  {
    label: "KiraAvatar vs. Composable Primitives",
    body: "Use KiraAvatar when you have a user name and optional src, status, badge, gradient, or lastSeen tooltip. Compose Avatar, AvatarImage, AvatarFallback, and AvatarBadge directly when you need custom fallback markup, custom loading callbacks, or fine-grained DOM control.",
  },
  {
    label: "Accessible Status & Badges",
    body: "Pass badge via Avatar's badge prop so it renders outside the overflow-hidden image frame. Provide statusLabel whenever presence carries meaning so screen readers announce it alongside the visual dot.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const avatarPageAPISections = [
  {
    title: "Avatar",
    props: [
      {
        prop: "size",
        type: '"xs" | "sm" | "default" | "lg" | "xl" | "2xl" | "3xl" | "4xl"',
        default: '"default"',
        description: "Avatar diameter from 24px (xs) to 128px (4xl).",
      },
      {
        prop: "shape",
        type: '"circle" | "rounded" | "square"',
        default: '"circle"',
        description: "Corner geometry of the avatar frame.",
      },
      {
        prop: "interactive",
        type: "boolean",
        default: "false",
        description:
          "Applies interactive hover, press, and focus ring styling (automatically enabled when onClick is passed).",
      },
      {
        prop: "ring",
        type: '"default" | "primary" | "secondary" | "destructive" | "success" | "warning" | "info"',
        default: '"default"',
        description: "Offset border ring color around the avatar.",
      },
      {
        prop: "status",
        type: '"online" | "offline" | "busy" | "away" | "offline_gray"',
        default: "-",
        description: "Presence status dot rendered outside the clipped frame.",
      },
      {
        prop: "statusPosition",
        type: '"top-right" | "top-left" | "bottom-right" | "bottom-left"',
        default: '"bottom-right"',
        description: "Corner placement of the status dot.",
      },
      {
        prop: "statusPulse",
        type: "boolean",
        default: "false",
        description:
          'Pulses the status dot when status="online" (automatically disabled under reduced motion).',
      },
      {
        prop: "statusLabel",
        type: "string",
        default: "-",
        description:
          'Screen-reader label for the status dot (e.g. "Online"). Omitting keeps the dot decorative.',
      },
      {
        prop: "badge",
        type: "React.ReactNode",
        default: "-",
        description:
          "Corner badge (typically <AvatarBadge />) rendered as a sibling so it is not clipped.",
      },
      {
        prop: "onClick",
        type: "React.MouseEventHandler<HTMLSpanElement>",
        default: "-",
        description:
          "Makes the avatar interactive by rendering a native <button> with Tab/Enter/Space activation.",
      },
      {
        prop: "aria-label",
        type: "string",
        default: "-",
        description:
          'Accessible name. Non-interactive avatars with aria-label get role="img"; interactive avatars default to "Avatar".',
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes merged onto the avatar root.",
      },
    ],
  },
  {
    title: "AvatarImage",
    props: [
      {
        prop: "src",
        type: "string",
        default: "-",
        description: "Image URL to load.",
      },
      {
        prop: "alt",
        type: "string",
        default: "-",
        description: "Alternative text describing the user or subject.",
      },
      {
        prop: "keepMounted",
        type: "boolean",
        default: "true",
        description:
          "Keeps the image mounted through loading so data-loading / data-starting-style blur-up transitions play.",
      },
      {
        prop: "onLoadingStatusChange",
        type: '(status: "idle" | "loading" | "loaded" | "error") => void',
        default: "-",
        description: "Callback invoked when image loading status changes.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
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
        description: "Solid muted background or soft gradient background.",
      },
      {
        prop: "gradient",
        type: '"default" | "blue" | "purple" | "green" | "orange" | "pink"',
        default: '"default"',
        description: 'Gradient palette used when variant="gradient".',
      },
      {
        prop: "delay",
        type: "number",
        default: "-",
        description:
          "Milliseconds to wait before displaying fallback content (Base UI prop).",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "AvatarBadge",
    props: [
      {
        prop: "variant",
        type: '"default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline"',
        default: '"destructive"',
        description: "Color theme of the corner badge.",
      },
      {
        prop: "size",
        type: "AvatarSize",
        default: '"default"',
        description: "Badge dimensions matched to the avatar size ladder.",
      },
      {
        prop: "position",
        type: '"top-right" | "top-left" | "bottom-right" | "bottom-left"',
        default: '"top-right"',
        description: "Corner placement around the avatar.",
      },
      {
        prop: "content",
        type: "React.ReactNode",
        default: "-",
        description: "Badge content (falls back to children when omitted).",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "AvatarTyping",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description:
          'Additional CSS classes on the semantic <output aria-label="typing"> indicator.',
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
        description: "Maximum visible avatars before collapsing into +N.",
      },
      {
        prop: "overlap",
        type: "number",
        default: "-8",
        description:
          "Horizontal margin in pixels between avatars (negative overlaps).",
      },
      {
        prop: "size",
        type: "AvatarSize",
        default: '"default"',
        description: "Size for overflow and add-member chips.",
      },
      {
        prop: "tooltips",
        type: "boolean",
        default: "false",
        description:
          "Wraps visible avatars with Base UI tooltips using each child's data-name prop.",
      },
      {
        prop: "overflowNames",
        type: "string[]",
        default: "-",
        description:
          "Names shown under hidden avatars inside the expandable overflow popover.",
      },
      {
        prop: "onAddMember",
        type: "() => void",
        default: "-",
        description:
          'Renders a trailing dashed "Add member" button when provided.',
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
    ],
  },
  {
    title: "AvatarStack",
    props: [
      {
        prop: "size",
        type: "AvatarSize",
        default: '"default"',
        description: "Scale used for left padding math and the count chip.",
      },
      {
        prop: "showCount",
        type: "boolean",
        default: "true",
        description: "Displays the trailing total-member count chip.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
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
        description:
          "User display name; derives initials, aria-label, alt, and data-name.",
      },
      {
        prop: "src",
        type: "string",
        default: "-",
        description: "Optional image URL; falls back to icon or initials.",
      },
      {
        prop: "icon",
        type: "React.ReactNode",
        default: "-",
        description: "Fallback icon shown instead of initials when provided.",
      },
      {
        prop: "badge",
        type: "React.ReactNode",
        default: "-",
        description: "Corner badge content rendered inside AvatarBadge.",
      },
      {
        prop: "badgePosition",
        type: '"top-right" | "top-left" | "bottom-right" | "bottom-left"',
        default: '"top-right"',
        description: "Corner placement of the rendered AvatarBadge.",
      },
      {
        prop: "lastSeen",
        type: "string",
        default: "-",
        description:
          'Wraps the avatar in a tooltip showing "Last seen <value>".',
      },
      {
        prop: "gradient",
        type: '"default" | "blue" | "purple" | "green" | "orange" | "pink"',
        default: "-",
        description:
          "Enables a gradient AvatarFallback with the chosen palette.",
      },
      {
        prop: "...props",
        type: 'Omit<AvatarProps, "children">',
        default: "-",
        description:
          "Forwards size, shape, ring, status, statusPosition, statusPulse, statusLabel, onClick, and HTML attributes.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const avatarPageChangelogEntries = [
  {
    version: "3.1.1",
    date: "26 November 2026",
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
          'An onClick avatar without aria-label announces as "Avatar" instead of an unnamed button.',
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
          "AvatarStack referenced a scrollbar-hide class that didn't exist; the utility is now defined in index.css.",
      },
      {
        type: "changed",
        title: "Interactive focus ring + transitions",
        description:
          "Interactive avatars use the kit focus ring and a merged transition so active:scale-95 animates.",
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

function StatesLongNameInitialsSection() {
  const longName = "Alexandra Maximilian Bartholomew Wellington III";

  return (
    <div>
      <p className="mb-2 text-sm font-medium">Long name initials (35+ chars)</p>
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>{getInitials(longName)}</AvatarFallback>
        </Avatar>
        <span className="text-sm text-muted-foreground">{longName}</span>
      </div>
    </div>
  );
}

function StatesSizeExtremesSection() {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">
        Size extremes (xs / 4xl) + interactive hover/focus/active
      </p>
      <div className="flex flex-wrap items-center gap-4">
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

function StatesInteractiveAvatarSection() {
  const [selectedProfile, setSelectedProfile] = React.useState<string | null>(
    null,
  );

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        Interactive avatar renders a native <code>&lt;button&gt;</code> — Tab to
        focus, Enter/Space to activate.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <Avatar
          onClick={() => setSelectedProfile("Priya")}
          aria-label="Open Priya's profile"
        >
          <AvatarFallback>PR</AvatarFallback>
        </Avatar>
        <Avatar
          onClick={() => setSelectedProfile("Marcus")}
          aria-label="Open Marcus's profile"
          ring="primary"
        >
          <AvatarFallback>MA</AvatarFallback>
        </Avatar>
        <output className="text-xs text-muted-foreground">
          {selectedProfile === null
            ? "Select an interactive avatar to preview button activation."
            : `Opened ${selectedProfile}'s profile.`}
        </output>
      </div>
    </div>
  );
}

function StatesBlurUpSection({ imageRequestId }: { imageRequestId: string }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">
        Blur-up (keepMounted) — throttled image transitions blur → sharp
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
        <span className="max-w-64 text-xs text-muted-foreground">
          Watch the image enter blurred/scaled and settle sharp (500ms, respects
          reduced motion).
        </span>
      </div>
    </div>
  );
}
