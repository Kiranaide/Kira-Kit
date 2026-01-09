import { Badge, StatusBadge, CountBadge } from "@/components/ui/badge";
import {
  IconCheck,
  IconX,
  IconAlertCircle,
  IconInfoCircle,
  IconBell,
  IconStar,
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
      </section>

      {/* Count Badge */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Count Badge (for notifications)
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
          <CountBadge count={7} icon={<IconBell />} size="xs" />
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
            {`import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
