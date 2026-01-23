import {
  Badge,
  StatusBadge,
  CountBadge,
  TagBadge,
  BadgeGroup,
} from "@/components/ui/badge";
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
} from "@/components/docs";

// =============================================================================
// Demo Components
// =============================================================================

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
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          Clickable
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
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          Dismissible
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

// Clickable badge
<Badge onClick={() => handleClick()}>Click me</Badge>

// Dismissible badge
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
          <CountBadge count={25000} format="short" />
          <CountBadge count={1500000} format="short" />
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

// =============================================================================
// Main Page Component
// =============================================================================

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
          prop: "onClick",
          type: "() => void",
          default: "-",
          description: "Click handler",
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
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Badge"
        description="Small status indicators and labels to highlight information, display counts, and show user status."
        version="v2.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiReference} />
    </ComponentPage>
  );
}
