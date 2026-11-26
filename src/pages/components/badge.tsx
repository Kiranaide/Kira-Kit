import type { ComponentProps as ReactComponentProps } from "react";
import { useState } from "react";
import {
  Badge,
  StatusBadge,
  CountBadge,
  TagBadge,
  BadgeGroup,
  KiraBadge,
} from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconCheck,
  IconX,
  IconAlertCircle,
  IconInfoCircle,
  IconBell,
  IconStar,
  IconAccessible,
  IconPalette,
  IconStack2,
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

type TickerFormat = "default" | "short" | "commas";

function nextTickerFormat(current: TickerFormat): TickerFormat {
  if (current === "default") return "short";

  if (current === "short") return "commas";

  return "default";
}

function VariantsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Basic
        </h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="ghost">Ghost</Badge>
          <Badge variant="link">Link</Badge>
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Semantic
        </h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">Soft</h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="primary-soft">Primary Soft</Badge>
          <Badge variant="secondary-soft">Secondary Soft</Badge>
          <Badge variant="destructive-soft">Destructive Soft</Badge>
          <Badge variant="success-soft">Success Soft</Badge>
          <Badge variant="warning-soft">Warning Soft</Badge>
          <Badge variant="info-soft">Info Soft</Badge>
        </div>
      </div>
    </div>
  );
}

const variantsCode = `import { Badge } from "@/components/ui/badge"

// Basic variants
<Badge variant="default">Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>

// Semantic variants
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="info">Info</Badge>

// Soft variants (muted backgrounds)
<Badge variant="primary-soft">Primary Soft</Badge>
<Badge variant="success-soft">Success Soft</Badge>`;

function SizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge size="xs">Extra Small</Badge>
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
      <Badge size="xl">Extra Large</Badge>
    </div>
  );
}

const sizesCode = `import { Badge } from "@/components/ui/badge"

<Badge size="xs">Extra Small</Badge>
<Badge size="sm">Small</Badge>
<Badge size="default">Default</Badge>
<Badge size="lg">Large</Badge>
<Badge size="xl">Extra Large</Badge>`;

function WithIconsDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <Badge variant="default" icon={<IconCheck aria-hidden="true" />}>
        Approved
      </Badge>
      <Badge variant="destructive" icon={<IconX aria-hidden="true" />}>
        Rejected
      </Badge>
      <Badge variant="success" icon={<IconCheck aria-hidden="true" />}>
        Completed
      </Badge>
      <Badge variant="warning" icon={<IconAlertCircle aria-hidden="true" />}>
        Warning
      </Badge>
      <Badge variant="info" icon={<IconInfoCircle aria-hidden="true" />}>
        Information
      </Badge>
      <Badge
        variant="secondary"
        icon={<IconStar aria-hidden="true" />}
        iconPosition="right"
      >
        Featured
      </Badge>
    </div>
  );
}

const withIconsCode = `import { Badge } from "@/components/ui/badge"
import { IconCheck, IconStar } from "@tabler/icons-react"

// Icon on left (default)
<Badge variant="success" icon={<IconCheck aria-hidden="true" />}>
  Completed
</Badge>

// Icon on right
<Badge variant="secondary" icon={<IconStar aria-hidden="true" />} iconPosition="right">
  Featured
</Badge>`;

function DotIndicatorDemo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Badge dot>With Dot</Badge>
        <Badge dot="success">Success Dot</Badge>
        <Badge dot="warning">Warning Dot</Badge>
        <Badge dot="destructive">Error Dot</Badge>
        <Badge dot="info">Info Dot</Badge>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">
          With Pulse Animation
        </h4>
        <div className="flex flex-wrap gap-3">
          <Badge dot dotPulse="continuous">
            Live
          </Badge>
          <Badge dot="success" dotPulse="once">
            New
          </Badge>
          <Badge dot="warning" dotPulse="continuous">
            Processing
          </Badge>
        </div>
      </div>
    </div>
  );
}

const dotIndicatorCode = `import { Badge } from "@/components/ui/badge"

// Basic dot
<Badge dot>With Dot</Badge>

// Colored dot
<Badge dot="success">Success Dot</Badge>
<Badge dot="warning">Warning Dot</Badge>
<Badge dot="destructive">Error Dot</Badge>

// With pulse animation (respects reduced motion)
<Badge dot dotPulse="continuous">Live</Badge>
<Badge dot="success" dotPulse="once">New</Badge>`;

function InteractiveDemo() {
  const [activeFilters, setActiveFilters] = useState<string[]>(["react"]);

  const [statusMessage, setStatusMessage] = useState(
    "Click or dismiss a badge to test native button semantics.",
  );

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter],
    );
  };

  return (
    <div className="space-y-6">
      <InteractiveClickableSection onSelect={setStatusMessage} />
      <InteractiveToggleChipsSection
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
      />
      <InteractiveDismissibleSection onDismiss={setStatusMessage} />
      <div>
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">
          Loading
        </h4>
        <div className="flex flex-wrap gap-3">
          <Badge loading>Loading...</Badge>
          <Badge variant="success" loading>
            Saving...
          </Badge>
          <Badge variant="destructive" loading>
            Deleting...
          </Badge>
        </div>
      </div>
      <output className="block text-xs text-muted-foreground">
        {statusMessage}
      </output>
    </div>
  );
}

const interactiveCode = `import { Badge } from "@/components/ui/badge"

// Clickable badge — renders a real <button> when no render prop is given
<Badge onClick={() => handleClick()}>Click me</Badge>

// Toggle chip — aria-pressed + data-pressed for styling
const [active, setActive] = useState(true)
<Badge
  pressed={active}
  onClick={() => setActive(!active)}
  variant={active ? "primary-soft" : "outline"}
>
  react
</Badge>

// Dismissible badge — close target is ≥ 24×24 despite the small ×
<Badge dismissible onClose={() => handleClose()}>
  Removable
</Badge>

// Loading state
<Badge loading>Loading...</Badge>`;

function StatusBadgeDemo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <StatusBadge status="success">Online</StatusBadge>
        <StatusBadge status="warning">Away</StatusBadge>
        <StatusBadge status="error">Offline</StatusBadge>
        <StatusBadge status="info">Busy</StatusBadge>
        <StatusBadge status="default">Unknown</StatusBadge>
      </div>
      <div className="flex flex-wrap gap-3">
        <StatusBadge status="success" size="sm">
          Small
        </StatusBadge>
        <StatusBadge status="success" size="default">
          Default
        </StatusBadge>
        <StatusBadge status="success" size="lg">
          Large
        </StatusBadge>
      </div>
      <div className="flex flex-wrap gap-3">
        <StatusBadge status="success" pulse="continuous">
          Live
        </StatusBadge>
        <StatusBadge status="warning" pulse="once">
          New
        </StatusBadge>
        <StatusBadge status="error" pulse="continuous">
          Error
        </StatusBadge>
      </div>
    </div>
  );
}

const statusBadgeCode = `import { StatusBadge } from "@/components/ui/badge"

// Status variants
<StatusBadge status="success">Online</StatusBadge>
<StatusBadge status="warning">Away</StatusBadge>
<StatusBadge status="error">Offline</StatusBadge>

// With pulse animation
<StatusBadge status="success" pulse="continuous">Live</StatusBadge>`;

function CountBadgeDemo() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <CountBadge count={5} />
        <CountBadge count={42} />
        <CountBadge count={150} max={99} />
        <CountBadge count={3} variant="destructive" />
        <CountBadge count={12} variant="secondary" />
      </div>
      <div>
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">
          Short Format
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <CountBadge count={1500} format="short" />
          <CountBadge count={25_000} format="short" />
          <CountBadge count={1_500_000} format="short" />
        </div>
      </div>
      <div>
        <h4 className="mb-3 text-sm font-medium text-muted-foreground">
          With Icons
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <IconBell className="size-6" aria-hidden="true" />
            <CountBadge
              count={3}
              size="xs"
              className="absolute -top-1 -right-1"
            />
          </div>
          <CountBadge count={5} icon={<IconBell aria-hidden="true" />} />
          <CountBadge count={42} icon={<IconBell aria-hidden="true" />} pulse />
        </div>
      </div>
    </div>
  );
}

const countBadgeCode = `import { CountBadge } from "@/components/ui/badge"
import { IconBell } from "@tabler/icons-react"

// Basic count
<CountBadge count={5} />
<CountBadge count={150} max={99} /> // Shows "99+"

// Short format
<CountBadge count={1500} format="short" /> // Shows "1.5k+"

// With icon and pulse
<CountBadge count={42} icon={<IconBell aria-hidden="true" />} pulse />`;

function TagBadgeDemo() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <TagBadge variant="outline" removable onRemove={() => {}}>
          React
        </TagBadge>
        <TagBadge variant="outline" removable onRemove={() => {}}>
          TypeScript
        </TagBadge>
        <TagBadge variant="outline" removable onRemove={() => {}}>
          Next.js
        </TagBadge>
        <TagBadge variant="outline" removable onRemove={() => {}}>
          Tailwind
        </TagBadge>
      </div>
      <div className="flex flex-wrap gap-2">
        <TagBadge variant="primary-soft" removable onRemove={() => {}}>
          JavaScript
        </TagBadge>
        <TagBadge
          variant="success-soft"
          icon={<IconCheck aria-hidden="true" />}
          removable
          onRemove={() => {}}
        >
          Active
        </TagBadge>
        <TagBadge variant="destructive-soft" removable onRemove={() => {}}>
          Bug
        </TagBadge>
      </div>
    </div>
  );
}

const tagBadgeCode = `import { TagBadge } from "@/components/ui/badge"
import { IconCheck } from "@tabler/icons-react"

<TagBadge variant="outline" removable onRemove={handleRemove}>
  React
</TagBadge>

<TagBadge variant="success-soft" icon={<IconCheck aria-hidden="true" />} removable>
  Active
</TagBadge>`;

function BadgeGroupDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Tight gap</p>
        <BadgeGroup gap="tight">
          <Badge variant="secondary">Tag 1</Badge>
          <Badge variant="secondary">Tag 2</Badge>
          <Badge variant="secondary">Tag 3</Badge>
        </BadgeGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">Normal gap</p>
        <BadgeGroup gap="normal">
          <Badge variant="outline">Option 1</Badge>
          <Badge variant="outline">Option 2</Badge>
          <Badge variant="outline">Option 3</Badge>
        </BadgeGroup>
      </div>
      <div>
        <p className="mb-2 text-sm text-muted-foreground">
          Vertical orientation
        </p>
        <BadgeGroup orientation="vertical" gap="normal">
          <Badge variant="success-soft">Step 1</Badge>
          <Badge variant="warning-soft">Step 2</Badge>
          <Badge variant="destructive-soft">Step 3</Badge>
        </BadgeGroup>
      </div>
    </div>
  );
}

const badgeGroupCode = `import { Badge, BadgeGroup } from "@/components/ui/badge"

// Horizontal group with gap
<BadgeGroup gap="normal">
  <Badge>Tag 1</Badge>
  <Badge>Tag 2</Badge>
</BadgeGroup>

// Vertical orientation
<BadgeGroup orientation="vertical" gap="normal">
  <Badge>Step 1</Badge>
  <Badge>Step 2</Badge>
</BadgeGroup>`;

function NumberTickerDemo() {
  const [count, setCount] = useState(3);

  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <IconBell
            className="size-6 text-muted-foreground"
            aria-hidden="true"
          />
          <span className="absolute -top-2 -right-2">
            <CountBadge
              count={count}
              animateCount
              size="sm"
              variant="destructive"
            />
          </span>
        </div>
        <CountBadge count={count} animateCount />
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCount((current) => Math.max(0, current - 3))}
        >
          −3
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCount((current) => current + 3)}
        >
          +3
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCount((current) => current + 25)}
        >
          +25
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        The number rolls to its new value. Disabled automatically under
        reduced-motion.
      </p>
    </div>
  );
}

const numberTickerCode = `import { CountBadge } from "@/components/ui/badge"

// animateCount rolls the number to its new value on change
<CountBadge count={count} animateCount />
<CountBadge count={count} animateCount size="sm" variant="destructive" />`;

function TrendsShimmerDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Trend arrows
        </h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success-soft" trend="up">
            12.5%
          </Badge>
          <Badge variant="destructive-soft" trend="down">
            3.2%
          </Badge>
          <Badge variant="secondary" trend="up">
            Revenue
          </Badge>
        </div>
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Shimmer
        </h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="primary-soft" shimmer>
            Featured
          </Badge>
          <Badge
            variant="success"
            shimmer
            icon={<IconStar aria-hidden="true" />}
          >
            Pro
          </Badge>
        </div>
      </div>
    </div>
  );
}

const trendsShimmerCode = `import { Badge } from "@/components/ui/badge"

// Trend arrows
<Badge variant="success-soft" trend="up">12.5%</Badge>
<Badge variant="destructive-soft" trend="down">3.2%</Badge>

// Shimmer sweep (respects reduced motion)
<Badge variant="primary-soft" shimmer>Featured</Badge>`;

function PresetsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge preset="beta" />
      <Badge preset="new" shimmer />
      <Badge preset="version">v2.0.0</Badge>
      <span className="inline-flex items-center gap-2 text-sm">
        Settings
        <Badge preset="beta" size="xs" />
      </span>
    </div>
  );
}

const presetsCode = `import { Badge } from "@/components/ui/badge"

<Badge preset="beta" />            {/* → "Beta", warning-soft */}
<Badge preset="new" shimmer />     {/* → "New", success-soft + shimmer */}
<Badge preset="version">v2.0.0</Badge>`;

function StatesDemo() {
  const [tickerCount, setTickerCount] = useState(980);
  const [tickerFormat, setTickerFormat] = useState<TickerFormat>("default");

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Badge loading>Loading</Badge>
        <Badge loading variant="outline">
          Loading
        </Badge>
        <Badge loading variant="ghost">
          Loading
        </Badge>
        <Badge disabled>Disabled</Badge>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge onClick={() => {}} variant="primary-soft">
          Clickable (scales on press)
        </Badge>
        <Badge dismissible onClose={() => {}} variant="secondary">
          Dismissible
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status="success" />
        <StatusBadge status="error" />
        <StatusBadge status="warning" />
        <StatusBadge status="info">Children replace label</StatusBadge>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="default" shimmer>
          Shimmer on solid
        </Badge>
        <Badge variant="primary-soft" shimmer>
          Shimmer on soft
        </Badge>
        <Badge variant="outline" shimmer>
          Shimmer on outline
        </Badge>
      </div>

      <StatesControlsSection
        tickerCount={tickerCount}
        setTickerCount={setTickerCount}
        tickerFormat={tickerFormat}
        setTickerFormat={setTickerFormat}
      />
    </div>
  );
}

const statesCode = `import { Badge, StatusBadge, CountBadge } from "@/components/ui/badge"

// Loading (shared Spinner, inherits foreground)
<Badge loading>Loading</Badge>

// Disabled / clickable / dismissible
<Badge disabled>Disabled</Badge>
<Badge onClick={() => {}} variant="primary-soft">Clickable</Badge>
<Badge dismissible onClose={() => {}}>Dismissible</Badge>

// StatusBadge: children replace the label
<StatusBadge status="info">Children replace label</StatusBadge>

// Shimmer on solid vs soft/outline
<Badge variant="default" shimmer>Solid</Badge>
<Badge variant="primary-soft" shimmer>Soft</Badge>

// CountBadge ticker + format switch
<CountBadge count={count} animateCount format={format} />`;

function KiraBadgeDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          One component, every mode
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <KiraBadge mode="badge" variant="success" trend="up">
            Growth
          </KiraBadge>
          <KiraBadge mode="status" status="success" />
          <KiraBadge mode="count" count={128} animateCount />
          <KiraBadge mode="dot" variant="warning">
            Pending
          </KiraBadge>
          <KiraBadge mode="badge" preset="new" shimmer />
        </div>
      </div>
    </div>
  );
}

const kiraBadgeCode = `import { KiraBadge } from "@/components/ui/badge"

<KiraBadge mode="badge" variant="success" trend="up">Growth</KiraBadge>
<KiraBadge mode="status" status="success" />
<KiraBadge mode="count" count={128} animateCount />
<KiraBadge mode="dot" variant="warning">Pending</KiraBadge>
<KiraBadge mode="badge" preset="new" shimmer />`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4 rounded-lg border border-border p-4">
      <Badge variant="outline" className="max-w-full">
        <span className="truncate">
          Enterprise production deployment pipeline verification status label
        </span>
      </Badge>

      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary" aria-label="Empty badge" />
        <Badge dot="success" aria-label="Dot only status" />
        <CountBadge count={0} />
        <CountBadge count={2_450_000} format="short" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge disabled onClick={() => {}}>
          Disabled button
        </Badge>
        <Badge disabled dismissible variant="secondary">
          Disabled dismiss
        </Badge>
      </div>
    </div>
  );
}

const stressCode = `import { Badge, CountBadge } from "@/components/ui/badge"

// Narrow container (max-w-xs): long label truncation, empty content, disabled controls
<div className="max-w-xs space-y-4">
  <Badge variant="outline" className="max-w-full">
    <span className="truncate">Enterprise production deployment pipeline verification status label</span>
  </Badge>
  <Badge variant="secondary" aria-label="Empty badge" />
  <CountBadge count={0} />
  <Badge disabled dismissible variant="secondary">Disabled dismiss</Badge>
</div>`;

const badgeUsageCode = `import {
  Badge,
  StatusBadge,
  CountBadge,
  TagBadge,
  BadgeGroup,
  KiraBadge,
} from "@/components/ui/badge"

// Basic and semantic badges
<Badge>Default</Badge>
<Badge variant="success-soft" trend="up">12.5%</Badge>

// Interactive toggle chip & dismissible badge
<Badge pressed={active} onClick={() => setActive(!active)}>React</Badge>
<Badge dismissible onClose={handleClose}>Removable</Badge>

// Specialized helpers
<StatusBadge status="success">Online</StatusBadge>
<CountBadge count={1500} format="short" animateCount />
<TagBadge removable onRemove={handleRemove}>TypeScript</TagBadge>

// KiraBadge — unified prop-driven wrapper
<KiraBadge mode="status" status="success" />`;

export default function BadgePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Badge"
        description="Small status indicators and labels to highlight information, display counts, and show user status."
        version="v4.0.0"
      />

      <FeatureGrid
        features={badgePageFeatures}
        description="Semantic badges, animated counters, and Base UI Combobox tag inputs."
      />

      <DemoTabs defaultValue="variants" tabs={badgePageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={badgePageShortcuts}
        description="Keyboard navigation and activation bindings."
      />

      <UsageBlock
        code={badgeUsageCode}
        title="Usage"
        description="Compose specialized badge primitives or switch modes with KiraBadge."
        notes={badgePageUsageNotes}
      />

      <APIReference
        sections={badgePageAPISections}
        description="Props, types, and defaults for every exported Badge component."
      />

      <Changelog
        entries={badgePageChangelogEntries}
        title="Changelog"
        description="Version history for Badge."
      />
    </ComponentPage>
  );
}

const badgePageFeatures = [
  {
    title: "Accessible",
    description:
      "Native button semantics for clickable badges, WCAG 2.5.8 close targets, and Combobox tag chips.",
    icon: <IconAccessible className="size-4 text-primary" aria-hidden="true" />,
  },
  {
    title: "Multiple Variants",
    description:
      "15 variants including solid, outline, ghost, semantic, and soft styles.",
    icon: <IconPalette className="size-4 text-primary" aria-hidden="true" />,
  },
  {
    title: "Composable",
    description:
      "StatusBadge, CountBadge, TagBadge, BadgeGroup, and KiraBadge.",
    icon: <IconStack2 className="size-4 text-primary" aria-hidden="true" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const badgePageDemoTabs = [
  {
    value: "variants",
    label: "Variants",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Badge Variants"
        description="All available badge styles including semantic and soft variants."
        code={variantsCode}
      >
        <VariantsDemo />
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
        description="From extra small to extra large."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "icons",
    label: "With Icons",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Badges with Icons"
        description="Add leading or trailing icons for visual context."
        code={withIconsCode}
      >
        <WithIconsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "dots",
    label: "Dot Indicator",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Dot Indicators"
        description="Status dots with optional pulse animation."
        code={dotIndicatorCode}
      >
        <DotIndicatorDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "trends",
    label: "Trends & Shimmer",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Trends & Shimmer"
        description="Directional trend arrows and a reduced-motion-safe shimmer sweep."
        code={trendsShimmerCode}
      >
        <TrendsShimmerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "presets",
    label: "Beta / Version",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Preset Badges"
        description="Shorthand presets for Beta, New, and version tags."
        code={presetsCode}
      >
        <PresetsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "status",
    label: "StatusBadge",
    group: "Specialized",
    demo: (
      <DemoWrapper
        title="Status Badge"
        description="Pre-configured badge with status dot indicator."
        code={statusBadgeCode}
      >
        <StatusBadgeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "count",
    label: "CountBadge",
    group: "Specialized",
    demo: (
      <DemoWrapper
        title="Count Badge"
        description="Notification counts with formatting and cap options."
        code={countBadgeCode}
      >
        <CountBadgeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "ticker",
    label: "Number Ticker",
    group: "Specialized",
    demo: (
      <DemoWrapper
        title="Animated Count"
        description="CountBadge rolls to its new value; snaps under reduced motion."
        code={numberTickerCode}
      >
        <NumberTickerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "tag",
    label: "TagBadge",
    group: "Specialized",
    demo: (
      <DemoWrapper
        title="Tag Badge"
        description="Removable tags for tagging systems."
        code={tagBadgeCode}
      >
        <TagBadgeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "group",
    label: "BadgeGroup",
    group: "Specialized",
    demo: (
      <DemoWrapper
        title="Badge Group"
        description="Stack badges with configurable gaps and orientation."
        code={badgeGroupCode}
      >
        <BadgeGroupDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraBadge",
    group: "KiraBadge",
    demo: (
      <DemoWrapper
        title="KiraBadge"
        description="One prop-driven component covering badge, status, count, tag, and dot modes."
        code={kiraBadgeCode}
      >
        <KiraBadgeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "interactive",
    label: "Interactive",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Interactive Badges"
        description="Clickable buttons, toggle chips, dismissible badges, and loading states."
        code={interactiveCode}
      >
        <InteractiveDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Badge States"
        description="Loading, disabled, interactive, dismissible, shimmer, and format switching."
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
        description="Long labels, empty badges, extreme counts, and disabled states inside a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const badgePageShortcuts = [
  {
    keys: "Tab",
    description: "Move between interactive badges and dismiss buttons.",
  },
  {
    keys: "Enter / Space",
    description: "Activate an interactive badge or its dismiss button.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const badgePageUsageNotes = [
  {
    label: "KiraBadge vs. Dedicated Primitives",
    body: "Use KiraBadge when a data schema selects between badge, status, count, tag, and dot modes dynamically. Import Badge, StatusBadge, CountBadge, or TagBadge directly for tighter TypeScript props and full Base UI render-prop control.",
  },
  {
    label: "Live Regions",
    body: 'StatusBadge intentionally omits role="status" so pages with many badges do not spam screen readers. Wrap a single contextual <output> region around dynamic status summaries when live announcements are needed.',
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const badgePageAPISections = [
  {
    title: "Badge",
    props: [
      {
        prop: "variant",
        type: '"default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" | "ghost" | "link" | "primary-soft" | "secondary-soft" | "destructive-soft" | "success-soft" | "warning-soft" | "info-soft"',
        default: '"default"',
        description: "Visual style and semantic color pairing.",
      },
      {
        prop: "size",
        type: '"xs" | "sm" | "default" | "lg" | "xl"',
        default: '"default"',
        description: "Height, horizontal padding, and icon scale.",
      },
      {
        prop: "icon",
        type: "React.ReactNode",
        default: "-",
        description: "Optional icon element rendered alongside label text.",
      },
      {
        prop: "iconPosition",
        type: '"left" | "right"',
        default: '"left"',
        description: "Side on which the icon is placed.",
      },
      {
        prop: "dot",
        type: 'boolean | "default" | "secondary" | "destructive" | "success" | "warning" | "info" | "outline" | "muted"',
        default: "false",
        description:
          "Displays a leading status dot in the chosen semantic color.",
      },
      {
        prop: "dotPulse",
        type: '"none" | "continuous" | "once"',
        default: '"none"',
        description: "Pulse animation on the dot (respects reduced motion).",
      },
      {
        prop: "dismissible",
        type: "boolean",
        default: "false",
        description: "Renders a dismiss button with a ≥ 24×24 hit target.",
      },
      {
        prop: "onClose",
        type: "() => void",
        default: "-",
        description: "Callback fired after the badge finishes dismissing.",
      },
      {
        prop: "closeLabel",
        type: "string",
        default: '"Remove"',
        description: "Accessible aria-label for the dismiss button.",
      },
      {
        prop: "loading",
        type: "boolean",
        default: "false",
        description: "Replaces the icon with a Spinner and sets aria-busy.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description:
          "Disables interaction, lowers opacity, and sets aria-disabled.",
      },
      {
        prop: "shimmer",
        type: "boolean",
        default: "false",
        description:
          "Light sweep effect (automatically disabled under reduced motion).",
      },
      {
        prop: "trend",
        type: '"up" | "down"',
        default: "-",
        description: "Renders a directional trend arrow before content.",
      },
      {
        prop: "preset",
        type: '"beta" | "new" | "version"',
        default: "-",
        description:
          "Shorthand that resolves default variant and label styling.",
      },
      {
        prop: "pressed",
        type: "boolean",
        default: "-",
        description:
          "Toggle state for interactive badges: sets aria-pressed and data-pressed.",
      },
      {
        prop: "onClick",
        type: "React.MouseEventHandler",
        default: "-",
        description:
          "Makes the badge interactive; renders a native <button> when no render prop is provided.",
      },
      {
        prop: "render",
        type: "useRender.RenderProp",
        default: "-",
        description:
          "Base UI render prop to replace the underlying element (e.g. with a link).",
      },
    ],
  },
  {
    title: "StatusBadge",
    props: [
      {
        prop: "status",
        type: '"success" | "warning" | "error" | "info" | "default"',
        default: "-",
        description: "Maps to semantic dot color and default label text.",
      },
      {
        prop: "size",
        type: '"sm" | "default" | "lg"',
        default: '"default"',
        description: "Badge size.",
      },
      {
        prop: "pulse",
        type: '"none" | "continuous" | "once"',
        default: '"none"',
        description: "Dot pulse animation.",
      },
      {
        prop: "label",
        type: "string",
        default: "status default",
        description:
          "Overrides the default status text (children take precedence).",
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
    title: "CountBadge",
    props: [
      {
        prop: "count",
        type: "number",
        default: "-",
        description: "Numeric count to display.",
      },
      {
        prop: "max",
        type: "number",
        default: "99",
        description: "Upper threshold before displaying <max>+.",
      },
      {
        prop: "format",
        type: '"default" | "short" | "commas"',
        default: '"default"',
        description: "Number formatting strategy.",
      },
      {
        prop: "size",
        type: '"xs" | "sm" | "default"',
        default: '"default"',
        description: "Pill size and minimum width.",
      },
      {
        prop: "variant",
        type: '"default" | "destructive" | "secondary"',
        default: '"default"',
        description: "Visual color variant.",
      },
      {
        prop: "icon",
        type: "React.ReactNode",
        default: "-",
        description: "Optional icon beside the count.",
      },
      {
        prop: "iconPosition",
        type: '"left" | "right"',
        default: '"left"',
        description: "Side on which the icon is rendered.",
      },
      {
        prop: "pulse",
        type: "boolean",
        default: "false",
        description: "Pulses when count > 0 (respects reduced motion).",
      },
      {
        prop: "animateCount",
        type: "boolean",
        default: "false",
        description:
          'Tweens the displayed number when format="default" (snaps under reduced motion).',
      },
    ],
  },
  {
    title: "TagBadge",
    props: [
      {
        prop: "variant",
        type: '"default" | "secondary" | "outline" | "ghost" | "primary-soft" | "secondary-soft" | "success" | "success-soft" | "warning" | "warning-soft" | "info" | "info-soft" | "destructive" | "destructive-soft"',
        default: '"default"',
        description: "Tag color variant.",
      },
      {
        prop: "size",
        type: 'BadgeProps["size"]',
        default: '"sm"',
        description: "Tag size.",
      },
      {
        prop: "removable",
        type: "boolean",
        default: "false",
        description:
          "Shows the dismiss button and unmounts the tag when removed.",
      },
      {
        prop: "onRemove",
        type: "() => void",
        default: "-",
        description: "Callback fired when the tag is removed.",
      },
      {
        prop: "...props",
        type: 'Omit<BadgeProps, "variant">',
        default: "-",
        description: "Forwards remaining Badge props.",
      },
    ],
  },
  {
    title: "BadgeGroup",
    props: [
      {
        prop: "gap",
        type: '"tight" | "normal" | "loose"',
        default: '"normal"',
        description: "Spacing between grouped badges.",
      },
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Layout flow direction.",
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
    title: "KiraBadge",
    props: [
      {
        prop: "mode",
        type: '"badge" | "status" | "count" | "tag" | "dot"',
        default: '"badge"',
        description: "Selects which underlying badge mode to render.",
      },
      {
        prop: "variant",
        type: 'BadgeProps["variant"]',
        default: '"default"',
        description:
          "Shared color variant (narrowed automatically for count/tag modes).",
      },
      {
        prop: "size",
        type: 'BadgeProps["size"]',
        default: '"default"',
        description: "Shared size token (mapped to valid sizes per mode).",
      },
      {
        prop: "status / label / pulse",
        type: 'StatusBadgeProps["status"] / string / "none" | "continuous" | "once"',
        default: '"default" / - / "none"',
        description: 'Status mode configuration when mode="status".',
      },
      {
        prop: "count / max / format / animateCount",
        type: 'number / number / "default" | "short" | "commas" / boolean',
        default: '0 / 99 / "default" / false',
        description: 'Count mode configuration when mode="count".',
      },
      {
        prop: "icon / iconPosition / trend / shimmer / preset / dismissible / onClose / dot / dotPulse",
        type: "BadgeProps",
        default: "-",
        description:
          "Badge, tag, and dot mode props forwarded to the active renderer.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const badgePageChangelogEntries = [
  {
    version: "4.0.0",
    date: "26 November 2026",
    changes: [
      {
        type: "breaking",
        title: "Removed duplicate TagInput export and Combobox dependency",
        description:
          "Removed TagInput and its @base-ui/react/combobox dependency from badge.tsx. Use TagInput from input.tsx or KiraSelect with multiple + creatable instead.",
      },
    ],
  },
  {
    version: "3.1.2",
    date: "26 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Dismiss focus ring at full strength",
        description:
          "The close button draws the kit focus ring as ring-ring at 2px instead of ring-ring/50, which sat below the 3:1 WCAG 1.4.11 minimum. Primary badges inherit the retuned default-theme primary pair.",
      },
    ],
  },
  {
    version: "3.1.1",
    date: "18 November 2026",
    changes: [
      {
        type: "fixed",
        title: "lg close button aligned to the 4px grid",
        description:
          "The lg dismiss button drops from 18px to 16px (h-4 w-4) with size-3 icons. The compact badge ladder itself is unchanged — badges are labels, not controls.",
      },
    ],
  },
  {
    version: "3.1.0",
    date: "4 November 2026",
    changes: [
      {
        type: "breaking",
        title: "Interactive badges render a real <button>",
        description:
          'A Badge with onClick and no render prop now renders <button type="button"> instead of a span with tabIndex + Enter/Space shim. Press styling uses data-pressed.',
      },
      {
        type: "added",
        title: "pressed prop for toggle chips",
        description:
          "Sets aria-pressed and data-pressed so filter chips expose selected state to AT and CSS.",
      },
      {
        type: "changed",
        title: "Close button hit area ≥ 24×24",
        description:
          "The dismissible × is padded out to the WCAG 2.5.8 floor with an ::after hit area; the visible glyph size is unchanged.",
      },
      {
        type: "changed",
        title: "CountBadge ticker 0.6s → 0.35s",
        description:
          "Under the 400ms motion cap; reduced-motion still snaps instantly.",
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
        type: "breaking",
        title: "TagInput rewritten on Combobox.Chips",
        description:
          "New props API: value/defaultValue + onValueChange (was tags/onChange), plus suggestions, maxTags, disabled, ariaLabel. Chips render via Base UI Combobox with full keyboard and screen-reader support.",
      },
      {
        type: "breaking",
        title: 'StatusBadge: role="status" removed; children replace label',
        description:
          "Eliminates one live region per badge. Render a single contextual status region around your badges if you need live announcements. Children now replace the default label.",
      },
      {
        type: "changed",
        title: "Loading spinner reuses shared Spinner",
        description:
          "The inline SVG is replaced by <Spinner /> from @/components/ui/spinner, inheriting the badge foreground color and size on every variant.",
      },
      {
        type: "fixed",
        title: "Transition merge on clickable badges",
        description:
          "A broad all-property transition was overridden by a later transition-colors, so active:scale-95 never animated. One explicit transition now covers colors, opacity, and scale.",
      },
      {
        type: "fixed",
        title: "No double key activation with render props",
        description:
          "When render is a native <button>/<a>, Badge no longer adds redundant Enter/Space handling.",
      },
      {
        type: "fixed",
        title: "Close button no longer double-fires",
        description:
          "Redundant Enter/Space keydown removed from the dismiss close button.",
      },
      {
        type: "changed",
        title: "Shimmer visible on soft/ghost/outline variants",
        description:
          "Soft, ghost, and outline variants now use a foreground-tinted shimmer sweep.",
      },
      {
        type: "fixed",
        title: "CountBadge tween origin",
        description:
          'Switching format away from "default" and back no longer animates from a stale previous count.',
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
          "Badge, StatusBadge, CountBadge, TagBadge, BadgeGroup, TagInput, KiraBadge.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

function InteractiveClickableSection({
  onSelect,
}: {
  onSelect: (message: string) => void;
}) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-muted-foreground">
        Clickable — real buttons (Tab + Enter/Space, native semantics)
      </h4>
      <div className="flex flex-wrap gap-3">
        <Badge
          variant="primary-soft"
          icon={<IconStar aria-hidden="true" />}
          onClick={() => onSelect("Activated Premium badge.")}
        >
          Premium
        </Badge>
        <Badge
          variant="success-soft"
          icon={<IconCheck aria-hidden="true" />}
          onClick={() => onSelect("Activated Verified badge.")}
        >
          Verified
        </Badge>
      </div>
    </div>
  );
}

function InteractiveToggleChipsSection({
  activeFilters,
  toggleFilter,
}: {
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
}) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-muted-foreground">
        Toggle chips — <code>pressed</code> sets aria-pressed + data-pressed
      </h4>
      <div className="flex flex-wrap gap-3">
        {["react", "vue", "svelte"].map((framework) => (
          <Badge
            key={framework}
            variant={
              activeFilters.includes(framework) ? "primary-soft" : "outline"
            }
            pressed={activeFilters.includes(framework)}
            onClick={() => toggleFilter(framework)}
          >
            {framework}
          </Badge>
        ))}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        Active: {activeFilters.length > 0 ? activeFilters.join(", ") : "none"}
      </p>
    </div>
  );
}

function InteractiveDismissibleSection({
  onDismiss,
}: {
  onDismiss: (message: string) => void;
}) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-medium text-muted-foreground">
        Dismissible — close hit area ≥ 24px (WCAG 2.5.8)
      </h4>
      <div className="flex flex-wrap gap-3">
        <Badge
          variant="secondary-soft"
          dismissible
          onClose={() => onDismiss("Dismissed Removable badge.")}
        >
          Removable
        </Badge>
        <Badge
          variant="warning-soft"
          icon={<IconAlertCircle aria-hidden="true" />}
          dismissible
          onClose={() => onDismiss("Dismissed warning badge.")}
        >
          Can be closed
        </Badge>
      </div>
    </div>
  );
}

function StatesControlsSection({
  tickerCount,
  setTickerCount,
  tickerFormat,
  setTickerFormat,
}: {
  tickerCount: number;
  setTickerCount: React.Dispatch<React.SetStateAction<number>>;
  tickerFormat: TickerFormat;
  setTickerFormat: React.Dispatch<React.SetStateAction<TickerFormat>>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <CountBadge count={tickerCount} max={9999} animateCount />
        <Button
          size="sm"
          variant="outline"
          onClick={() => setTickerCount((current) => current + 137)}
        >
          +137
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <CountBadge
          count={15_230}
          max={999_999}
          animateCount
          format={tickerFormat}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={() => setTickerFormat(nextTickerFormat)}
        >
          format: {tickerFormat}
        </Button>
      </div>
    </div>
  );
}
