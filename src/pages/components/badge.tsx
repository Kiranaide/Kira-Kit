import type { ComponentProps as ReactComponentProps } from "react";
import { useState } from "react";
import {
  Badge,
  StatusBadge,
  CountBadge,
  TagBadge,
  BadgeGroup,
  TagInput,
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

function VariantsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
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
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Semantic
        </h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Soft</h3>
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
      <Badge variant="default" icon={<IconCheck />}>
        Approved
      </Badge>
      <Badge variant="destructive" icon={<IconX />}>
        Rejected
      </Badge>
      <Badge variant="success" icon={<IconCheck />}>
        Completed
      </Badge>
      <Badge variant="warning" icon={<IconAlertCircle />}>
        Warning
      </Badge>
      <Badge variant="info" icon={<IconInfoCircle />}>
        Information
      </Badge>
      <Badge variant="secondary" icon={<IconStar />} iconPosition="right">
        Featured
      </Badge>
    </div>
  );
}

const withIconsCode = `import { Badge } from "@/components/ui/badge"
import { IconCheck, IconX, IconAlertCircle } from "@tabler/icons-react"

// Icon on left (default)
<Badge variant="success" icon={<IconCheck />}>
  Completed
</Badge>

// Icon on right
<Badge variant="secondary" icon={<IconStar />} iconPosition="right">
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
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
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

// With pulse animation
<Badge dot dotPulse="continuous">Live</Badge>
<Badge dot="success" dotPulse="once">New</Badge>`;

function InteractiveDemo() {
  const [activeFilters, setActiveFilters] = useState<string[]>(["react"]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  return (
    <div className="space-y-6">
      <InteractiveClickableRealButtonsTabEnterSection />
      <InteractiveToggleChipsSection
        activeFilters={activeFilters}
        toggleFilter={toggleFilter}
      />
      <InteractiveDismissibleCloseHitArea24pxSection />
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
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
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          Short Format
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <CountBadge count={1500} format="short" />
          <CountBadge count={25_000} format="short" />
          <CountBadge count={1_500_000} format="short" />
        </div>
      </div>
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          With Icons
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <IconBell className="w-6 h-6" />
            <CountBadge
              count={3}
              size="xs"
              className="absolute -top-1 -right-1"
            />
          </div>
          <CountBadge count={5} icon={<IconBell />} />
          <CountBadge count={42} icon={<IconBell />} pulse />
        </div>
      </div>
    </div>
  );
}

const countBadgeCode = `import { CountBadge } from "@/components/ui/badge"

// Basic count
<CountBadge count={5} />
<CountBadge count={150} max={99} /> // Shows "99+"

// Short format
<CountBadge count={1500} format="short" /> // Shows "1.5k"

// With icon
<CountBadge count={5} icon={<IconBell />} />

// With pulse
<CountBadge count={42} pulse />`;

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
          icon={<IconCheck />}
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

<TagBadge variant="outline" removable onRemove={handleRemove}>
  React
</TagBadge>

<TagBadge variant="success-soft" icon={<IconCheck />} removable>
  Active
</TagBadge>`;

function BadgeGroupDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Tight gap</p>
        <BadgeGroup gap="tight">
          <Badge variant="secondary">Tag 1</Badge>
          <Badge variant="secondary">Tag 2</Badge>
          <Badge variant="secondary">Tag 3</Badge>
        </BadgeGroup>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Normal gap</p>
        <BadgeGroup gap="normal">
          <Badge variant="outline">Option 1</Badge>
          <Badge variant="outline">Option 2</Badge>
          <Badge variant="outline">Option 3</Badge>
        </BadgeGroup>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">
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
          <IconBell className="w-6 h-6 text-muted-foreground" />
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
          onClick={() => setCount((c) => Math.max(0, c - 3))}
        >
          −3
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCount((c) => c + 3)}
        >
          +3
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setCount((c) => c + 25)}
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
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
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
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Shimmer
        </h3>
        <div className="flex flex-wrap gap-3">
          <Badge variant="primary-soft" shimmer>
            Featured
          </Badge>
          <Badge variant="success" shimmer icon={<IconStar />}>
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

  const [tickerFormat, setTickerFormat] = useState<
    "default" | "short" | "commas"
  >("default");

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

      <div className="flex flex-wrap items-center gap-3">
        <Badge size="xs">XS</Badge>
        <Badge size="xl">
          Very long badge label that must stay on one line without wrapping or
          breaking the pill
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

// StatusBadge: children replace the label (no role="status")
<StatusBadge status="success">Children replace label</StatusBadge>

// Shimmer on solid vs soft/outline (foreground-tinted sweep)
<Badge variant="default" shimmer>Solid</Badge>
<Badge variant="primary-soft" shimmer>Soft</Badge>

// CountBadge ticker + format switch (no stale tween origin)
<CountBadge count={count} animateCount format={format} />`;

function TagInputDemo() {
  const [tags, setTags] = useState<string[]>(["design", "frontend"]);
  const [capped, setCapped] = useState<string[]>([]);

  return (
    <div className="max-w-md space-y-6">
      <div className="space-y-2">
        <TagInput
          value={tags}
          onValueChange={setTags}
          suggestions={["design", "frontend", "a11y", "react", "motion"]}
          ariaLabel="Project tags"
        />
        <p className="text-xs text-muted-foreground">
          Type to filter or create · Enter commits · Backspace removes the last
          chip · Arrow keys navigate suggestions · Esc closes the popup.
        </p>
      </div>
      <div className="space-y-2">
        <TagInput
          value={capped}
          onValueChange={setCapped}
          suggestions={["one", "two", "three"]}
          maxTags={3}
          size="sm"
          placeholder="Max 3 tags…"
          ariaLabel="Capped tags"
        />
        <p className="text-xs text-muted-foreground">
          <code>maxTags=3</code> enforced — extra tags are ignored.
        </p>
      </div>
    </div>
  );
}

const tagInputCode = `import { TagInput } from "@/components/ui/badge"

const [tags, setTags] = useState(["design", "frontend"])

<TagInput
  value={tags}
  onValueChange={setTags}
  suggestions={["design", "frontend", "a11y", "react"]}
  maxTags={5}
  ariaLabel="Project tags"
/>
// Combobox.Chips chips · Enter commits · Backspace removes last
// comma input splits into multiple tags · dedupe case-insensitive`;

function KiraBadgeDemo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
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

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function BadgePage() {
  const features = [
    {
      title: "Accessible",
      description: "Semantic elements with proper ARIA attributes.",
      icon: <IconAccessible className="w-4 h-4 text-primary" />,
    },
    {
      title: "Multiple Variants",
      description: "15+ variants including soft, semantic, and outline styles.",
      icon: <IconPalette className="w-4 h-4 text-primary" />,
    },
    {
      title: "Composable",
      description:
        "StatusBadge, CountBadge, TagBadge, and BadgeGroup components.",
      icon: <IconStack2 className="w-4 h-4 text-primary" />,
    },
  ];

  const demoTabs = [
    {
      value: "variants",
      label: "Variants",
      demo: (
        <DemoWrapper
          title="Badge Variants"
          description="All available badge styles including semantic and soft variants"
          code={variantsCode}
        >
          <VariantsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "sizes",
      label: "Sizes",
      demo: (
        <DemoWrapper
          title="Size Variants"
          description="From extra small to extra large"
          code={sizesCode}
        >
          <SizesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "icons",
      label: "With Icons",
      demo: (
        <DemoWrapper
          title="Badges with Icons"
          description="Add icons for visual context"
          code={withIconsCode}
        >
          <WithIconsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "dots",
      label: "Dot Indicator",
      demo: (
        <DemoWrapper
          title="Dot Indicators"
          description="Status dots with optional pulse animation"
          code={dotIndicatorCode}
        >
          <DotIndicatorDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "interactive",
      label: "Interactive",
      demo: (
        <DemoWrapper
          title="Interactive Badges"
          description="Clickable, dismissible, and loading states"
          code={interactiveCode}
        >
          <InteractiveDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "status",
      label: "StatusBadge",
      demo: (
        <DemoWrapper
          title="Status Badge"
          description="Pre-configured badge with status dot indicator"
          code={statusBadgeCode}
        >
          <StatusBadgeDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "count",
      label: "CountBadge",
      demo: (
        <DemoWrapper
          title="Count Badge"
          description="Notification counts with formatting options"
          code={countBadgeCode}
        >
          <CountBadgeDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "tag",
      label: "TagBadge",
      demo: (
        <DemoWrapper
          title="Tag Badge"
          description="Removable tags for tagging systems"
          code={tagBadgeCode}
        >
          <TagBadgeDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "group",
      label: "BadgeGroup",
      demo: (
        <DemoWrapper
          title="Badge Group"
          description="Stack badges with configurable gaps"
          code={badgeGroupCode}
        >
          <BadgeGroupDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "ticker",
      label: "Number Ticker",
      demo: (
        <DemoWrapper
          title="Animated Count"
          description="CountBadge rolls to its new value; snaps under reduced motion"
          code={numberTickerCode}
        >
          <NumberTickerDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "trends",
      label: "Trends & Shimmer",
      demo: (
        <DemoWrapper
          title="Trends & Shimmer"
          description="Directional trend arrows and a light shimmer sweep"
          code={trendsShimmerCode}
        >
          <TrendsShimmerDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "presets",
      label: "Beta / Version",
      demo: (
        <DemoWrapper
          title="Preset Badges"
          description="Shorthand presets for Beta, New, and version tags"
          code={presetsCode}
        >
          <PresetsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "states",
      label: "States",
      demo: (
        <DemoWrapper
          title="Badge States"
          description="Loading, disabled, interactive, dismissible, shimmer, long/empty labels, format switching"
          code={statesCode}
        >
          <StatesDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "tag-input",
      label: "Tag Input",
      demo: (
        <DemoWrapper
          title="Tag Input"
          description="Combobox-powered tag collection: suggestions, maxTags, Enter commits, Backspace removes the last chip"
          code={tagInputCode}
        >
          <TagInputDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "kira",
      label: "KiraBadge",
      demo: (
        <DemoWrapper
          title="KiraBadge"
          description="One prop-driven component covering badge / status / count / tag / dot"
          code={kiraBadgeCode}
        >
          <KiraBadgeDemo />
        </DemoWrapper>
      ),
    },
  ];

  const usageCode = `import { 
  Badge, 
  StatusBadge, 
  CountBadge, 
  TagBadge, 
  BadgeGroup 
} from "@/components/ui/badge"

// Basic badge
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>

// With icon
<Badge icon={<IconCheck />}>Approved</Badge>

// Clickable
<Badge onClick={() => {}}>Click me</Badge>

// Dismissible
<Badge dismissible onClose={() => {}}>Removable</Badge>

// With dot indicator
<Badge dot>With dot</Badge>
<Badge dot="success" dotPulse="continuous">Live</Badge>

// Loading
<Badge loading>Loading...</Badge>

// StatusBadge
<StatusBadge status="success">Online</StatusBadge>

// CountBadge
<CountBadge count={1500} format="short" />

// TagBadge
<TagBadge removable onRemove={() => {}}>Tag</TagBadge>

// BadgeGroup
<BadgeGroup gap="normal">
  <Badge>Item 1</Badge>
  <Badge>Item 2</Badge>
</BadgeGroup>`;

  const apiReference = [
    {
      title: "Badge",
      props: [
        {
          prop: "variant",
          type: '"default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "info" | "primary-soft" | ...',
          default: '"default"',
          description: "Visual style",
        },
        {
          prop: "size",
          type: '"xs" | "sm" | "default" | "lg" | "xl"',
          default: '"default"',
          description: "Badge size",
        },
        {
          prop: "icon",
          type: "ReactNode",
          default: "-",
          description: "Icon element",
        },
        {
          prop: "iconPosition",
          type: '"left" | "right"',
          default: '"left"',
          description: "Icon position",
        },
        {
          prop: "dot",
          type: 'boolean | "success" | "warning" | "destructive" | "info"',
          default: "-",
          description: "Show dot indicator",
        },
        {
          prop: "dotPulse",
          type: '"once" | "continuous"',
          default: "-",
          description: "Dot pulse animation",
        },
        {
          prop: "dismissible",
          type: "boolean",
          default: "false",
          description: "Show close button",
        },
        {
          prop: "onClose",
          type: "() => void",
          default: "-",
          description: "Close callback",
        },
        {
          prop: "loading",
          type: "boolean",
          default: "false",
          description: "Show loading spinner",
        },
        {
          prop: "trend",
          type: '"up" | "down"',
          default: "-",
          description: "Directional trend arrow before content",
        },
        {
          prop: "shimmer",
          type: "boolean",
          default: "false",
          description: "Light sweep effect (respects reduced motion)",
        },
        {
          prop: "preset",
          type: '"beta" | "new" | "version"',
          default: "-",
          description: "Shorthand variant + default label",
        },
        {
          prop: "onClick",
          type: "() => void",
          default: "-",
          description:
            "Click handler; without a render prop the badge renders a real <button>",
        },
        {
          prop: "pressed",
          type: "boolean",
          default: "-",
          description:
            "Toggle state: sets aria-pressed + data-pressed (interactive badges)",
        },
      ],
    },
    {
      title: "StatusBadge",
      props: [
        {
          prop: "status",
          type: '"success" | "warning" | "error" | "info" | "default"',
          default: '"default"',
          description: "Status type",
        },
        {
          prop: "pulse",
          type: '"once" | "continuous"',
          default: "-",
          description: "Pulse animation",
        },
        {
          prop: "label",
          type: "string",
          default: "status default",
          description:
            "Override the default label; children replace the label instead",
        },
        {
          prop: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Badge size",
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
          description: "Count to display",
        },
        {
          prop: "max",
          type: "number",
          default: "99",
          description: "Maximum before showing +",
        },
        {
          prop: "format",
          type: '"default" | "short" | "commas"',
          default: '"default"',
          description: "Number format",
        },
        {
          prop: "icon",
          type: "ReactNode",
          default: "-",
          description: "Optional icon",
        },
        {
          prop: "pulse",
          type: "boolean",
          default: "false",
          description: "Pulse animation",
        },
        {
          prop: "animateCount",
          type: "boolean",
          default: "false",
          description:
            "Roll the number to its new value (respects reduced motion)",
        },
      ],
    },
    {
      title: "TagBadge",
      props: [
        {
          prop: "removable",
          type: "boolean",
          default: "false",
          description: "Show remove button",
        },
        {
          prop: "onRemove",
          type: "() => void",
          default: "-",
          description: "Remove callback",
        },
        {
          prop: "...props",
          type: "BadgeProps",
          default: "-",
          description: "All Badge props",
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
          description: "Spacing between badges",
        },
        {
          prop: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: "Layout direction",
        },
      ],
    },
    {
      title: "TagInput",
      props: [
        {
          prop: "value",
          type: "string[]",
          default: "-",
          description: "Current tags (controlled)",
        },
        {
          prop: "defaultValue",
          type: "string[]",
          default: "[]",
          description: "Initial tags (uncontrolled)",
        },
        {
          prop: "onValueChange",
          type: "(tags: string[]) => void",
          default: "-",
          description:
            "Fired on add / remove (deduped, comma-split, maxTags-capped)",
        },
        {
          prop: "suggestions",
          type: "string[]",
          default: "[]",
          description:
            "Suggested tags in the popup; typed text is appended dynamically",
        },
        {
          prop: "maxTags",
          type: "number",
          default: "-",
          description: "Maximum number of tags",
        },
        {
          prop: "disabled",
          type: "boolean",
          default: "false",
          description: "Disable the input and chips",
        },
        {
          prop: "size",
          type: 'Badge size ("sm" default)',
          default: '"sm"',
          description: "Chip size",
        },
        {
          prop: "placeholder",
          type: "string",
          default: '"Add tag…"',
          description: "Empty-state input placeholder",
        },
        {
          prop: "ariaLabel",
          type: "string",
          default: '"Tags"',
          description: "Accessible name for the group",
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
          description: "Which badge behavior to render",
        },
        {
          prop: "...props",
          type: "Badge / Status / Count / Tag props",
          default: "-",
          description: "Mode-specific props (variant, count, status, trend, …)",
        },
      ],
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Badge"
        description="Small status indicators and labels to highlight information, display counts, and show user status."
        version="v3.1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} />

      <KeyboardShortcuts shortcuts={badgePageKeyboardShortcutsShortcuts} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiReference} />

      <Changelog entries={badgePageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
const badgePageKeyboardShortcutsShortcuts = [
  {
    keys: "Tab",
    description:
      "Move between badges and into the tag input (focus rings visible)",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate a clickable badge — it renders a native <button> (inherited from the browser); a render prop replaces the element with its own semantics",
  },
  {
    keys: "Esc",
    description: "Close the tag input popup (inherited from Base UI)",
  },
  {
    keys: "Backspace",
    description:
      "Remove the last chip in the tag input (inherited from Base UI)",
  },
  {
    keys: "↑ / ↓",
    description: "Navigate tag input suggestions (inherited from Base UI)",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const badgePageChangelogEntries = [
  {
    version: "3.1.1",
    date: "18 November 2026",
    changes: [
      {
        type: "fixed",
        title: "lg close button off the 4px grid",
        description:
          "The lg dismiss button drops h-4.5 w-4.5 (18px) to h-4 w-4 with size-3 icons. The compact badge ladder itself is unchanged — badges are labels, not controls.",
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
          'A Badge with onClick and no render prop now renders <button type="button"> instead of a span with tabIndex + Enter/Space shim. Enter no longer needs the shim; press styling via data-pressed.',
      },
      {
        type: "added",
        title: "pressed prop for toggle chips",
        description:
          "Sets aria-pressed and data-pressed so filter chips expose selected state to AT and CSS (data-[pressed]:…).",
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
          "Under the 400ms motion cap (§3.5); reduced-motion still snaps instantly.",
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
          "New props API: value/defaultValue + onValueChange (was tags/onChange), plus suggestions, maxTags, disabled, ariaLabel. readOnlyInput and variant removed. Chips render via Base UI Combobox with full a11y (arrow-key navigation, result announcements).",
      },
      {
        type: "breaking",
        title: 'StatusBadge: role="status" removed; children replace label',
        description:
          "No more one live region per badge (announcement spam). Render a single contextual status region around your badges if you need live announcements. Children now replace the default label instead of being concatenated after it.",
      },
      {
        type: "changed",
        title: "Loading spinner reuses shared Spinner",
        description:
          "The hand-rolled inline SVG is replaced by <Spinner /> from @/components/ui/spinner, inheriting the badge foreground color and size on every variant.",
      },
      {
        type: "fixed",
        title: "Transition merge on clickable badges",
        description:
          "transition-all was overridden by a later transition-colors, so active:scale-95 never animated. One merged transition now covers colors, opacity and scale.",
      },
      {
        type: "fixed",
        title: "No double key activation with render props",
        description:
          "When render is a native <button>/<a>, Badge no longer adds tabIndex + Enter/Space handling — the consumer element handles its own keys.",
      },
      {
        type: "fixed",
        title: "Close button no longer double-fires",
        description:
          "Redundant Enter/Space keydown removed from the dismiss close button; native button activation is enough.",
      },
      {
        type: "changed",
        title: "Shimmer visible on soft/ghost/outline variants",
        description:
          "The white shimmer sweep was invisible on light backgrounds; those variants now use a foreground-tinted sweep.",
      },
      {
        type: "fixed",
        title: "CountBadge tween origin",
        description:
          'Switching format away from "default" and back no longer animates from a stale previous count.',
      },
      {
        type: "changed",
        title: "Close-button focus ring",
        description:
          "Dismiss close button now uses the kit focus ring (ring-ring/50, 2px).",
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

function InteractiveClickableRealButtonsTabEnterSection() {
  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-3">
        Clickable — real buttons (Tab + Enter/Space, native semantics)
      </h4>
      <div className="flex flex-wrap gap-3">
        <Badge
          variant="primary-soft"
          icon={<IconStar />}
          onClick={() => alert("Premium clicked!")}
        >
          Premium
        </Badge>
        <Badge
          variant="success-soft"
          icon={<IconCheck />}
          onClick={() => alert("Verified clicked!")}
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
      <h4 className="text-sm font-medium text-muted-foreground mb-3">
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
      <p className="text-sm text-muted-foreground mt-2">
        Active: {activeFilters.length ? activeFilters.join(", ") : "none"}
      </p>
    </div>
  );
}

function InteractiveDismissibleCloseHitArea24pxSection() {
  return (
    <div>
      <h4 className="text-sm font-medium text-muted-foreground mb-3">
        Dismissible — close hit area ≥ 24px (WCAG 2.5.8)
      </h4>
      <div className="flex flex-wrap gap-3">
        <Badge
          variant="secondary-soft"
          dismissible
          onClose={() => alert("Dismissed!")}
        >
          Removable
        </Badge>
        <Badge
          variant="warning-soft"
          icon={<IconAlertCircle />}
          dismissible
          onClose={() => alert("Dismissed!")}
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
  tickerFormat: "default" | "short" | "commas";
  setTickerFormat: React.Dispatch<
    React.SetStateAction<"default" | "short" | "commas">
  >;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <CountBadge count={tickerCount} max={9999} animateCount />
        <Button
          size="sm"
          variant="outline"
          onClick={() => setTickerCount((c) => c + 137)}
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
          onClick={() =>
            setTickerFormat((f) => {
              const resolveOnClick1 = () => {
                if (f === "default") {
                  return "short" as const;
                }

                if (f === "short") {
                  return "commas" as const;
                }

                return "default" as const;
              };

              return resolveOnClick1();
            })
          }
        >
          format: {tickerFormat}
        </Button>
      </div>
    </div>
  );
}
