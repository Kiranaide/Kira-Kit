import { Badge, StatusBadge, CountBadge, TagBadge, BadgeGroup } from "@/components/ui/badge";
import {
  IconCheck,
  IconX,
  IconAlertCircle,
  IconInfoCircle,
  IconBell,
  IconStar,
  IconPlus,
} from "@tabler/icons-react";

export function BadgePage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Badge</h1>
        <p className="text-muted-foreground">
          Small status indicators and labels to highlight information.
        </p>
      </header>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Variants
        </h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="ghost">Ghost</Badge>
          <Badge variant="link">Link</Badge>
        </div>
      </section>

      {/* Semantic Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Semantic Variants
        </h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      {/* Soft Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Soft Variants
        </h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="primary-soft">Primary Soft</Badge>
          <Badge variant="secondary-soft">Secondary Soft</Badge>
          <Badge variant="destructive-soft">Destructive Soft</Badge>
          <Badge variant="success-soft">Success Soft</Badge>
          <Badge variant="warning-soft">Warning Soft</Badge>
          <Badge variant="info-soft">Info Soft</Badge>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Badge size="xs">Extra Small</Badge>
          <Badge size="sm">Small</Badge>
          <Badge size="default">Default</Badge>
          <Badge size="lg">Large</Badge>
          <Badge size="xl">Extra Large</Badge>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Icons
        </h2>
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
          <Badge variant="outline" icon={<IconBell />} iconPosition="right">
            Notifications
          </Badge>
        </div>
      </section>

      {/* Clickable Badge */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Clickable Badge
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Badges with onClick handler show hover state and pointer cursor.
        </p>
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
          <Badge
            variant="outline"
            onClick={() => alert("Learn more clicked!")}
          >
            Learn More
          </Badge>
        </div>
      </section>

      {/* Dismissible Badge */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Dismissible Badge
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Badges with close button. Calls onClose when dismissed.
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge
            variant="secondary-soft"
            dismissible
            onClose={() => alert("Dismissed: Secondary")}
          >
            Removable
          </Badge>
          <Badge
            variant="warning-soft"
            icon={<IconAlertCircle />}
            dismissible
            onClose={() => alert("Dismissed: Warning")}
          >
            Can be closed
          </Badge>
          <Badge
            variant="info-soft"
            icon={<IconInfoCircle />}
            dismissible
            onClose={() => alert("Dismissed: Info")}
          >
            Information
          </Badge>
        </div>
      </section>

      {/* With Dot Indicator */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Dot Indicator
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Built-in dot indicator with optional pulse animation.
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge dot>With Dot</Badge>
          <Badge dot="success">Success Dot</Badge>
          <Badge dot="warning">Warning Dot</Badge>
          <Badge dot="destructive">Error Dot</Badge>
          <Badge dot="info">Info Dot</Badge>
        </div>
      </section>

      {/* With Pulse Animation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Pulse Animation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Dot can pulse continuously or once on mount.
        </p>
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
      </section>

      {/* Loading State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Loading State
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Badge with loading spinner icon.
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge loading>Loading...</Badge>
          <Badge variant="success" loading>
            Saving...
          </Badge>
          <Badge variant="destructive" loading>
            Deleting...
          </Badge>
        </div>
      </section>

      {/* Status Badge */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Status Badge (with dot indicator)
        </h2>
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
      </section>

      {/* Count Badge */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Count Badge
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <CountBadge count={5} />
          <CountBadge count={42} />
          <CountBadge count={150} max={99} />
          <CountBadge count={3} variant="destructive" />
          <CountBadge count={12} variant="secondary" />
          <CountBadge count={7} size="xs" />
          <CountBadge count={25} size="sm" />
        </div>
        <h3 className="text-lg font-medium mt-4 mb-2">Short Format</h3>
        <div className="flex flex-wrap items-center gap-3">
          <CountBadge count={1500} format="short" />
          <CountBadge count={25000} format="short" />
          <CountBadge count={1500000} format="short" />
          <CountBadge count={99} format="short" />
          <CountBadge count={100} format="short" />
        </div>
        <h3 className="text-lg font-medium mt-4 mb-2">With Commas</h3>
        <div className="flex flex-wrap items-center gap-3">
          <CountBadge count={1500} format="commas" />
          <CountBadge count={25000} format="commas" />
          <CountBadge count={1500000} format="commas" />
        </div>
        <h3 className="text-lg font-medium mt-4 mb-2">With Icons</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <IconBell className="w-5 h-5" />
            <CountBadge count={3} size="xs" className="absolute -top-1 -right-1" />
          </div>
          <div className="relative">
            <IconBell className="w-6 h-6" />
            <CountBadge count={99} size="sm" className="absolute -top-1 -right-1" />
          </div>
          <CountBadge count={5} icon={<IconBell />} />
          <CountBadge count={12} icon={<IconBell />} iconPosition="right" />
          <CountBadge count={42} icon={<IconBell />} size="sm" />
        </div>
        <h3 className="text-lg font-medium mt-4 mb-2">With Pulse</h3>
        <div className="flex flex-wrap items-center gap-3">
          <CountBadge count={5} pulse />
          <CountBadge count={42} variant="destructive" pulse />
        </div>
      </section>

      {/* Tag Badge */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Tag Badge
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Removable tags for tagging systems.
        </p>
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
          <TagBadge variant="success-soft" icon={<IconCheck />} removable onRemove={() => {}}>
            Active
          </TagBadge>
          <TagBadge variant="destructive-soft" removable onRemove={() => {}}>
            Bug
          </TagBadge>
        </div>
      </section>

      {/* Badge Group */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Badge Group
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Stack badges with configurable gaps.
        </p>
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
            <p className="text-sm text-muted-foreground mb-2">Loose gap</p>
            <BadgeGroup gap="loose">
              <Badge variant="primary-soft">Item 1</Badge>
              <Badge variant="primary-soft">Item 2</Badge>
              <Badge variant="primary-soft">Item 3</Badge>
            </BadgeGroup>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Vertical orientation</p>
            <BadgeGroup orientation="vertical" gap="normal">
              <Badge variant="success-soft">Step 1</Badge>
              <Badge variant="warning-soft">Step 2</Badge>
              <Badge variant="destructive-soft">Step 3</Badge>
            </BadgeGroup>
          </div>
        </div>
      </section>

      {/* Real-world Examples */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Real-world Examples
        </h2>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge variant="success-soft">Active</Badge>
            <Badge variant="destructive-soft">Inactive</Badge>
            <Badge variant="warning-soft">Pending</Badge>
            <Badge variant="info-soft">Draft</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" size="sm">
              Tag 1
            </Badge>
            <Badge variant="outline" size="sm">
              Tag 2
            </Badge>
            <Badge variant="outline" size="sm">
              Tag 3
            </Badge>
            <TagBadge variant="outline" size="sm" removable icon={<IconPlus />}>
              Add Tag
            </TagBadge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="primary-soft" icon={<IconStar />}>
              Premium
            </Badge>
            <Badge variant="secondary-soft">Free</Badge>
            <Badge variant="success-soft" icon={<IconCheck />}>
              Verified
            </Badge>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Badge, StatusBadge, CountBadge, TagBadge, BadgeGroup } from "@/components/ui/badge"

// Basic
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>

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
<StatusBadge status="warning" pulse="continuous">Away</StatusBadge>

// CountBadge
<CountBadge count={1500} format="short" /> // "1.5k+"
<CountBadge count={42} pulse />

// TagBadge
<TagBadge removable onRemove={() => {}}>Tag</TagBadge>

// BadgeGroup
<BadgeGroup gap="normal">
  <Badge>Item 1</Badge>
  <Badge>Item 2</Badge>
</BadgeGroup>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
