import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarStack,
  AutoAvatar,
} from "@/components/ui/avatar";

export function AvatarPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Avatar</h1>
        <p className="text-muted-foreground">
          An image element with fallback for representing users.
        </p>
      </header>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Avatar
        </h2>
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
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          From xs (24px) to 4xl (128px) for different contexts.
        </p>
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
      </section>

      {/* Shapes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Shapes
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Circle (default), rounded, or square avatars.
        </p>
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
      </section>

      {/* Status Indicators */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Status Indicators
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Online, offline, busy, or away status dots.
        </p>
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
      </section>

      {/* Ring Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Ring Colors
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Colored border rings around avatars.
        </p>
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
      </section>

      {/* Avatar Badge */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Avatar Badge
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Notification counts or status indicators.
        </p>
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
      </section>

      {/* Auto-Avatar with Initials */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Auto Avatar (Initials)
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Automatically generates initials from name.
        </p>
        <div className="flex items-center gap-4">
          <AutoAvatar name="John Doe" size="lg" />
          <AutoAvatar name="Jane Smith" size="lg" />
          <AutoAvatar name="Bob Johnson" size="lg" />
          <AutoAvatar name="Alice" size="lg" />
          <AutoAvatar name="Charlie Brown" size="lg" />
        </div>
      </section>

      {/* Gradient Fallback */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Gradient Fallback
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Predefined gradient backgrounds for fallback state.
        </p>
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
      </section>

      {/* Avatar Group */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Avatar Group
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Stacked avatars with automatic overflow indicator.
        </p>
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
            <p className="text-sm text-muted-foreground mb-2">Large size</p>
            <AvatarGroup max={4} size="lg">
              <Avatar size="lg">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>EF</AvatarFallback>
              </Avatar>
            </AvatarGroup>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">With status indicators</p>
            <AvatarGroup max={4}>
              <Avatar status="online">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar status="online">
                <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
                <AvatarFallback>VC</AvatarFallback>
              </Avatar>
              <Avatar status="busy">
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar status="away">
                <AvatarFallback>CD</AvatarFallback>
              </Avatar>
              <Avatar status="offline">
                <AvatarFallback>EF</AvatarFallback>
              </Avatar>
            </AvatarGroup>
          </div>
        </div>
      </section>

      {/* Avatar Stack */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Avatar Stack
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Horizontally scrolling stack of avatars.
        </p>
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
      </section>

      {/* Complete Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Complete Example
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Combining all features in a user profile card.
        </p>
        <div className="flex items-center gap-4 p-4 border rounded-lg max-w-md">
          <div className="relative">
            <Avatar size="xl" ring="primary">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback variant="gradient">CN</AvatarFallback>
            </Avatar>
            <AvatarBadge
              content="5"
              variant="destructive"
              className="absolute -bottom-1 -right-1"
            />
          </div>
          <div>
            <h3 className="font-semibold">John Doe</h3>
            <p className="text-sm text-muted-foreground">Product Designer</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
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
            {`import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarStack, AutoAvatar } from "@/components/ui/avatar"

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
<Avatar status="busy" size="lg">...</Avatar>

// Ring colors
<Avatar ring="primary">...</Avatar>
<Avatar ring="success">...</Avatar>

// Badge with notification count
<Avatar>
  <AvatarImage src="..." />
  <AvatarFallback>CN</AvatarFallback>
  <AvatarBadge content="5" />
</Avatar>

// Auto avatar with initials
<AutoAvatar name="John Doe" size="lg" />

// Gradient fallback
<AvatarFallback variant="gradient">CN</AvatarFallback>

// Avatar group
<AvatarGroup max={3}>
  <Avatar>...</Avatar>
  <Avatar>...</Avatar>
</AvatarGroup>

// Avatar stack (scrollable)
<AvatarStack>
  <Avatar>...</Avatar>
  <Avatar>...</Avatar>
</AvatarStack>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
