import type { ComponentProps as ReactComponentProps } from "react";
import {
  IconBrandGithub,
  IconBell,
  IconSettings,
  IconArrowsLeftRight,
  IconLayoutGrid,
  IconDeviceLaptop,
  IconUser,
  IconMail,
  IconPhone,
  IconHome,
} from "@tabler/icons-react";
import { Flex } from "@/components/ui/flex";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
  Changelog,
} from "@/components/docs";

const directionCode = `import { Flex } from "@/components/ui/flex"

export function DirectionDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Row (default)</p>
        <Flex gap={4} className="p-4 border rounded-lg bg-muted/30">
          <div className="p-4 bg-primary/20 rounded">1</div>
          <div className="p-4 bg-primary/20 rounded">2</div>
          <div className="p-4 bg-primary/20 rounded">3</div>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Column</p>
        <Flex direction="column" gap={4} className="p-4 border rounded-lg bg-muted/30">
          <div className="p-4 bg-primary/20 rounded">1</div>
          <div className="p-4 bg-primary/20 rounded">2</div>
          <div className="p-4 bg-primary/20 rounded">3</div>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Row Reverse</p>
        <Flex direction="row-reverse" gap={4} className="p-4 border rounded-lg bg-muted/30">
          <div className="p-4 bg-primary/20 rounded">1</div>
          <div className="p-4 bg-primary/20 rounded">2</div>
          <div className="p-4 bg-primary/20 rounded">3</div>
        </Flex>
      </div>
    </div>
  )
}`;

function DirectionDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Row (default)</p>
        <Flex gap={4} className="p-4 border rounded-lg bg-muted/30">
          <div className="p-4 bg-primary/20 rounded">1</div>
          <div className="p-4 bg-primary/20 rounded">2</div>
          <div className="p-4 bg-primary/20 rounded">3</div>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Column</p>
        <Flex
          direction="column"
          gap={4}
          className="p-4 border rounded-lg bg-muted/30"
        >
          <div className="p-4 bg-primary/20 rounded">1</div>
          <div className="p-4 bg-primary/20 rounded">2</div>
          <div className="p-4 bg-primary/20 rounded">3</div>
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Row Reverse</p>
        <Flex
          direction="row-reverse"
          gap={4}
          className="p-4 border rounded-lg bg-muted/30"
        >
          <div className="p-4 bg-primary/20 rounded">1</div>
          <div className="p-4 bg-primary/20 rounded">2</div>
          <div className="p-4 bg-primary/20 rounded">3</div>
        </Flex>
      </div>
    </div>
  );
}

const justifyCode = `import { Flex } from "@/components/ui/flex"

export function JustifyDemo() {
  return (
    <div className="space-y-4">
      {(["start", "center", "end", "between", "around", "evenly"] as const).map((justify) => (
        <div key={justify}>
          <p className="text-sm text-muted-foreground mb-2">{justify}</p>
          <Flex justify={justify} gap={4} className="p-4 border rounded-lg bg-muted/30">
            <div className="p-3 bg-primary/20 rounded">A</div>
            <div className="p-3 bg-primary/20 rounded">B</div>
            <div className="p-3 bg-primary/20 rounded">C</div>
          </Flex>
        </div>
      ))}
    </div>
  )
}`;

function JustifyDemo() {
  return (
    <div className="space-y-4">
      {(["start", "center", "end", "between", "around", "evenly"] as const).map(
        (justify) => (
          <div key={justify}>
            <p className="text-sm text-muted-foreground mb-2">{justify}</p>
            <Flex
              justify={justify}
              gap={4}
              className="p-4 border rounded-lg bg-muted/30"
            >
              <div className="p-3 bg-primary/20 rounded">A</div>
              <div className="p-3 bg-primary/20 rounded">B</div>
              <div className="p-3 bg-primary/20 rounded">C</div>
            </Flex>
          </div>
        ),
      )}
    </div>
  );
}

const alignCode = `import { Flex } from "@/components/ui/flex"

export function AlignDemo() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      {(["start", "center", "end", "stretch", "baseline"] as const).map((align) => (
        <div key={align} className="min-w-0">
          <p className="text-sm text-muted-foreground mb-2">{align}</p>
          <Flex align={align} gap={3} className="h-32 w-full rounded-lg border bg-muted/30 p-3">
            <div className="rounded bg-primary/20 px-2 py-1.5 text-xs">Short</div>
            <div className="rounded bg-primary/20 px-3 py-3 text-sm">Medium</div>
            <div className="rounded bg-primary/20 px-4 py-5 text-base">Tall</div>
          </Flex>
        </div>
      ))}
    </div>
  )
}`;

function AlignDemo() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      {(["start", "center", "end", "stretch", "baseline"] as const).map(
        (align) => (
          <div key={align} className="min-w-0">
            <p className="text-sm text-muted-foreground mb-2">{align}</p>
            <Flex
              align={align}
              gap={3}
              className="h-32 w-full rounded-lg border bg-muted/30 p-3"
            >
              <div className="rounded bg-primary/20 px-2 py-1.5 text-xs">
                Short
              </div>
              <div className="rounded bg-primary/20 px-3 py-3 text-sm">
                Medium
              </div>
              <div className="rounded bg-primary/20 px-4 py-5 text-base">
                Tall
              </div>
            </Flex>
          </div>
        ),
      )}
    </div>
  );
}

const gapCode = `import { Flex } from "@/components/ui/flex"

export function GapDemo() {
  return (
    <div className="space-y-4">
      {([0, 2, 4, 6, 8, 12] as const).map((gap) => (
        <div key={gap}>
          <p className="text-sm text-muted-foreground mb-2">gap={gap}</p>
          <Flex gap={gap} className="p-4 border rounded-lg bg-muted/30">
            <div className="p-3 bg-primary/20 rounded">1</div>
            <div className="p-3 bg-primary/20 rounded">2</div>
            <div className="p-3 bg-primary/20 rounded">3</div>
            <div className="p-3 bg-primary/20 rounded">4</div>
          </Flex>
        </div>
      ))}
    </div>
  )
}`;

function GapDemo() {
  return (
    <div className="space-y-4">
      {([0, 2, 4, 6, 8, 12] as const).map((gap) => (
        <div key={gap}>
          <p className="text-sm text-muted-foreground mb-2">gap={gap}</p>
          <Flex gap={gap} className="p-4 border rounded-lg bg-muted/30">
            <div className="p-3 bg-primary/20 rounded">1</div>
            <div className="p-3 bg-primary/20 rounded">2</div>
            <div className="p-3 bg-primary/20 rounded">3</div>
            <div className="p-3 bg-primary/20 rounded">4</div>
          </Flex>
        </div>
      ))}
    </div>
  );
}

const wrapCode = `import { Flex } from "@/components/ui/flex"

export function WrapDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">wrap</p>
        <Flex wrap="wrap" gap={4} className="p-4 border rounded-lg bg-muted/30 max-w-md">
          {Array.from({ length: 8 }, (_, i) => ({ id: "item-" + (i + 1), number: i + 1 })).map((item) => (
            <div key={item.id} className="p-4 bg-primary/20 rounded w-24 text-center">{item.number}</div>
          ))}
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">nowrap (default)</p>
        <Flex wrap="nowrap" gap={4} className="p-4 border rounded-lg bg-muted/30 max-w-md overflow-x-auto">
          {Array.from({ length: 8 }, (_, i) => ({ id: "item-" + (i + 1), number: i + 1 })).map((item) => (
            <div key={item.id} className="p-4 bg-primary/20 rounded w-24 text-center shrink-0">{item.number}</div>
          ))}
        </Flex>
      </div>
    </div>
  )
}`;

function WrapDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">wrap</p>
        <Flex
          wrap="wrap"
          gap={4}
          className="p-4 border rounded-lg bg-muted/30 max-w-md"
        >
          {Array.from({ length: 8 }, (_, i) => ({
            id: "item-" + (i + 1),
            number: i + 1,
          })).map((item) => (
            <div
              key={item.id}
              className="p-4 bg-primary/20 rounded w-24 text-center"
            >
              {item.number}
            </div>
          ))}
        </Flex>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">nowrap (default)</p>
        <Flex
          wrap="nowrap"
          gap={4}
          className="p-4 border rounded-lg bg-muted/30 max-w-md overflow-x-auto"
        >
          {Array.from({ length: 8 }, (_, i) => ({
            id: "item-" + (i + 1),
            number: i + 1,
          })).map((item) => (
            <div
              key={item.id}
              className="p-4 bg-primary/20 rounded w-24 text-center shrink-0"
            >
              {item.number}
            </div>
          ))}
        </Flex>
      </div>
    </div>
  );
}

const responsiveCode = `import { Flex } from "@/components/ui/flex"

export function ResponsiveDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Resize the window to see the layout change from column on mobile to row on desktop.
      </p>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, lg: 8 }}
        align={{ base: "stretch", md: "center" }}
        className="p-4 border rounded-lg bg-muted/30"
      >
        <div className="p-4 bg-primary/20 rounded flex-1">Responsive Item 1</div>
        <div className="p-4 bg-primary/20 rounded flex-1">Responsive Item 2</div>
        <div className="p-4 bg-primary/20 rounded flex-1">Responsive Item 3</div>
      </Flex>
    </div>
  )
}`;

function ResponsiveDemo() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Resize the window to see the layout change from column on mobile to row
        on desktop.
      </p>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={{ base: 4, lg: 8 }}
        align={{ base: "stretch", md: "center" }}
        className="p-4 border rounded-lg bg-muted/30"
      >
        <div className="p-4 bg-primary/20 rounded flex-1">
          Responsive Item 1
        </div>
        <div className="p-4 bg-primary/20 rounded flex-1">
          Responsive Item 2
        </div>
        <div className="p-4 bg-primary/20 rounded flex-1">
          Responsive Item 3
        </div>
      </Flex>
    </div>
  );
}

const semanticCode = `import { Flex } from "@/components/ui/flex"
import { Button } from "@/components/ui/button"

export function SemanticDemo() {
  return (
    <Flex as="nav" justify="between" align="center" className="p-4 border rounded-lg bg-muted/30">
      <Flex as="ul" gap={4} className="list-none">
        <li><a href="/" className="hover:text-primary">Home</a></li>
        <li><a href="/components/flex" className="hover:text-primary">About</a></li>
        <li><a href="/components/flex" className="hover:text-primary">Contact</a></li>
      </Flex>
      <Button size="sm">Sign In</Button>
    </Flex>
  )
}`;

function SemanticDemo() {
  return (
    <Flex
      as="nav"
      justify="between"
      align="center"
      className="p-4 border rounded-lg bg-muted/30"
    >
      <Flex as="ul" gap={4} className="list-none">
        <li>
          <a href="/components/flex" className="hover:text-primary">
            Home
          </a>
        </li>
        <li>
          <a href="/components/flex" className="hover:text-primary">
            About
          </a>
        </li>
        <li>
          <a href="/components/flex" className="hover:text-primary">
            Contact
          </a>
        </li>
      </Flex>
      <Button size="sm">Sign In</Button>
    </Flex>
  );
}

const realWorldCode = `import { Flex } from "@/components/ui/flex"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconBrandGithub, IconBell, IconSettings, IconUser, IconMail, IconPhone, IconHome } from "@tabler/icons-react"

export function RealWorldDemos() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Navigation Header</p>
        <Flex as="header" justify="between" align="center" className="p-4 border rounded-lg bg-background">
          <Flex align="center" gap={2}>
            <div className="size-8 bg-primary rounded-md" />
            <span className="font-semibold">Brand</span>
          </Flex>
          <Flex gap={2}>
            <Button variant="ghost" size="icon-sm" aria-label="Notifications"><IconBell className="size-4" aria-hidden="true" /></Button>
            <Button variant="ghost" size="icon-sm" aria-label="Settings"><IconSettings className="size-4" aria-hidden="true" /></Button>
            <Avatar size="sm">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </Flex>
        </Flex>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">User Profile Card</p>
        <Flex gap={4} align="center" className="p-4 border rounded-lg bg-background">
          <Avatar size="lg">
            <AvatarImage src="https://github.com/mui.png" alt="John Doe" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Flex direction="column" gap={1} className="min-w-0 flex-1">
            <span className="font-semibold">John Doe</span>
            <span className="text-sm text-muted-foreground">Software Engineer</span>
            <Flex gap={2} className="mt-1">
              <Badge variant="secondary">React</Badge>
              <Badge variant="secondary">TypeScript</Badge>
            </Flex>
          </Flex>
          <Button variant="outline" size="sm">
            <IconBrandGithub className="size-4 mr-2" aria-hidden="true" />
            Follow
          </Button>
        </Flex>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Contact Information</p>
        <Flex direction="column" gap={3} className="p-4 border rounded-lg bg-background">
          <Flex align="center" gap={3}>
            <IconUser className="size-4 text-muted-foreground" aria-hidden="true" />
            <span>John Doe</span>
          </Flex>
          <Flex align="center" gap={3}>
            <IconMail className="size-4 text-muted-foreground" aria-hidden="true" />
            <span>john@example.com</span>
          </Flex>
          <Flex align="center" gap={3}>
            <IconPhone className="size-4 text-muted-foreground" aria-hidden="true" />
            <span>+1 (555) 123-4567</span>
          </Flex>
          <Flex align="center" gap={3}>
            <IconHome className="size-4 text-muted-foreground" aria-hidden="true" />
            <span>123 Main St, City, Country</span>
          </Flex>
        </Flex>
      </div>
    </div>
  )
}`;

function NavigationHeaderPreview() {
  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">Navigation Header</p>
      <Flex
        as="header"
        justify="between"
        align="center"
        className="rounded-lg border bg-background p-4"
      >
        <Flex align="center" gap={2}>
          <div className="size-8 rounded-md bg-primary" aria-hidden="true" />
          <span className="font-semibold">Brand</span>
        </Flex>
        <Flex gap={2}>
          <Button variant="ghost" size="icon-sm" aria-label="Notifications">
            <IconBell className="size-4" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Settings">
            <IconSettings className="size-4" aria-hidden="true" />
          </Button>
          <Avatar size="sm">
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </Flex>
      </Flex>
    </div>
  );
}

function UserProfileCardPreview() {
  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">User Profile Card</p>
      <Flex
        gap={4}
        align="center"
        className="rounded-lg border bg-background p-4"
      >
        <Avatar size="lg">
          <AvatarImage src="https://github.com/mui.png" alt="John Doe" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Flex direction="column" gap={1} className="min-w-0 flex-1">
          <span className="font-semibold">John Doe</span>
          <span className="text-sm text-muted-foreground">
            Software Engineer
          </span>
          <Flex gap={2} className="mt-1">
            <Badge variant="secondary">React</Badge>
            <Badge variant="secondary">TypeScript</Badge>
          </Flex>
        </Flex>
        <Button variant="outline" size="sm">
          <IconBrandGithub className="mr-2 size-4" aria-hidden="true" />
          Follow
        </Button>
      </Flex>
    </div>
  );
}

function ContactInfoPreview() {
  return (
    <div>
      <p className="mb-2 text-sm text-muted-foreground">Contact Information</p>
      <Flex
        direction="column"
        gap={3}
        className="rounded-lg border bg-background p-4"
      >
        <Flex align="center" gap={3}>
          <IconUser
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span>John Doe</span>
        </Flex>
        <Flex align="center" gap={3}>
          <IconMail
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span>john@example.com</span>
        </Flex>
        <Flex align="center" gap={3}>
          <IconPhone
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span>+1 (555) 123-4567</span>
        </Flex>
        <Flex align="center" gap={3}>
          <IconHome
            className="size-4 shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
          <span>123 Main St, City, Country</span>
        </Flex>
      </Flex>
    </div>
  );
}

function RealWorldDemos() {
  return (
    <div className="space-y-6">
      <NavigationHeaderPreview />
      <UserProfileCardPreview />
      <ContactInfoPreview />
    </div>
  );
}

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <div>
        <p className="mb-2 text-xs text-muted-foreground">
          Long unbroken label in narrow row
        </p>
        <Flex
          justify="between"
          align="center"
          gap={2}
          className="rounded-lg border bg-muted/30 p-3"
        >
          <span className="min-w-0 truncate text-sm font-medium">
            InternationalDesignAndAccessibilityReviewWorkspaceTitle
          </span>
          <Badge variant="secondary" className="shrink-0">
            Active
          </Badge>
        </Flex>
      </div>
      <div>
        <p className="mb-2 text-xs text-muted-foreground">
          Empty flex container
        </p>
        <Flex
          gap={2}
          className="min-h-10 items-center justify-center rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground"
        />
      </div>
      <div>
        <p className="mb-2 text-xs text-muted-foreground">
          Wrapping actions with disabled controls
        </p>
        <Flex wrap="wrap" gap={2} className="rounded-lg border bg-muted/30 p-3">
          <Button size="sm" variant="outline">
            Save draft
          </Button>
          <Button size="sm" disabled>
            Publish workspace changes
          </Button>
          <Button size="sm" variant="ghost" disabled>
            Archive
          </Button>
        </Flex>
      </div>
    </div>
  );
}

const stressCode = `import { Flex } from "@/components/ui/flex"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <Flex justify="between" align="center" gap={2} className="rounded-lg border bg-muted/30 p-3">
        <span className="min-w-0 truncate text-sm font-medium">
          InternationalDesignAndAccessibilityReviewWorkspaceTitle
        </span>
        <Badge variant="secondary" className="shrink-0">Active</Badge>
      </Flex>
      <Flex gap={2} className="min-h-10 rounded-lg border border-dashed bg-muted/30 p-3" />
      <Flex wrap="wrap" gap={2} className="rounded-lg border bg-muted/30 p-3">
        <Button size="sm" variant="outline">Save draft</Button>
        <Button size="sm" disabled>Publish workspace changes</Button>
        <Button size="sm" variant="ghost" disabled>Archive</Button>
      </Flex>
    </div>
  )
}`;

const usageCode = `import { Flex } from "@/components/ui/flex"

// Basic row layout
<Flex gap={4} align="center">
  <Avatar />
  <span>Username</span>
</Flex>

// Column layout
<Flex direction="column" gap={2}>
  <Input />
  <Button>Submit</Button>
</Flex>

// Responsive layout
<Flex
  direction={{ base: "column", md: "row" }}
  gap={{ base: 4, lg: 8 }}
>
  <Card />
  <Card />
</Flex>

// Semantic HTML
<Flex as="nav" justify="between" align="center">
  <Logo />
  <NavLinks />
</Flex>`;

export default function FlexPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Flex"
        description="Flexible box layout primitive for building responsive layouts with ease."
        version="v1.1.0"
      />

      <FeatureGrid
        features={flexPageFeatureGridFeatures}
        description="Capabilities built into Kira Kit."
      />

      <DemoTabs defaultValue="direction" tabs={flexPageDemoTabsTabs} />

      <KeyboardShortcuts
        shortcuts={flexPageKeyboardShortcuts}
        description="Flex is a layout primitive and adds no custom keyboard bindings; focusable children keep native DOM order."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Basic implementation examples for common scenarios."
        notes={flexPageUsageNotes}
      />

      <APIReference
        sections={flexPageAPIReferenceSections}
        title="API reference"
        description="Key props and configuration options."
      />

      <Changelog
        entries={flexPageChangelogEntries}
        title="Changelog"
        description="Version history for this component."
      />
    </ComponentPage>
  );
}

const flexPageChangelogEntries = [
  {
    version: "1.1.0",
    date: "26 November 2026",
    changes: [
      {
        type: "changed",
        title: "Literal responsive maps and Base UI useRender",
        description:
          "Migrated responsive props onto @/lib/layout-responsive literal per-breakpoint class maps (zero global CSS safelist required) and adopted Base UI useRender + mergeProps so Flex supports the render prop alongside as.",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "20 November 2026",
    changes: [
      {
        type: "added",
        title: "Responsive layout props over a static class map",
        description:
          "direction, wrap, justify, align and gap take either a plain value or a breakpoint map ({ base, md, lg }), resolved against fixed class maps so no interpolated class strings are ever built. Breakpoint-prefixed classes are assembled at runtime, so they must be safelisted with @source inline(...) in your global CSS — the kira-base stylesheet installed by init already lists them.",
      },
      {
        type: "added",
        title: "Polymorphic element with a stable styling hook",
        description:
          "as renders any element (nav, section, ul) with its own props and ref forwarded, defaulting to div; data-slot flex stays constant across modes and inline swaps to inline-flex.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

const flexPageFeatureGridFeatures = [
  {
    title: "Responsive Values",
    description:
      "All layout props support breakpoint-aware responsive values using Tailwind conventions.",
    icon: (
      <IconDeviceLaptop className="size-5 text-primary" aria-hidden="true" />
    ),
  },
  {
    title: "Semantic HTML",
    description:
      "Render as any semantic element like nav, header, main, or form using the as prop.",
    icon: <IconLayoutGrid className="size-5 text-primary" aria-hidden="true" />,
  },
  {
    title: "Type Safe",
    description:
      "Full TypeScript support with strict type inference for direction, justify, align, and more.",
    icon: (
      <IconArrowsLeftRight className="size-5 text-primary" aria-hidden="true" />
    ),
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const flexPageKeyboardShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description:
      "Move through focusable descendants in DOM order. Avoid row-reverse or column-reverse on interactive controls where visual order would diverge from tab order.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const flexPageUsageNotes = [
  {
    label: "Responsive values",
    body: "Pass either a single token or a mobile-first breakpoint map ({ base, sm, md, lg, xl, 2xl }) for direction, wrap, justify, align, and gap.",
  },
  {
    label: "Semantic elements",
    body: "Use the as prop to render nav, header, main, ul, ol, form, or fieldset with full native attributes and ref typing.",
  },
  {
    label: "CSS safelist",
    body: "Responsive breakpoint classes are resolved at runtime; ensure @source inline(...) safelisting from kira-base is present in your global stylesheet.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const flexPageDemoTabsTabs = [
  {
    value: "direction",
    label: "Direction",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Flex Direction"
        description="Control the direction in which flex items are laid out."
        code={directionCode}
      >
        <DirectionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "justify",
    label: "Justify Content",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Justify Content"
        description="Align flex items along the main axis (row direction)."
        code={justifyCode}
      >
        <JustifyDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "align",
    label: "Align Items",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Align Items"
        description="Align flex items along the cross axis."
        code={alignCode}
      >
        <AlignDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "gap",
    label: "Gap Spacing",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Gap Spacing"
        description="Control the spacing between flex items."
        code={gapCode}
      >
        <GapDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "wrap",
    label: "Flex Wrap",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Flex Wrap"
        description="Control whether flex items wrap onto multiple lines."
        code={wrapCode}
      >
        <WrapDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "responsive",
    label: "Responsive",
    group: "Layout",
    demo: (
      <DemoWrapper
        title="Responsive Values"
        description="Use breakpoint-aware values for adaptive layouts."
        code={responsiveCode}
      >
        <ResponsiveDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "semantic",
    label: "Semantic HTML",
    group: "Layout",
    demo: (
      <DemoWrapper
        title="Semantic HTML (as prop)"
        description="Render Flex as semantic HTML elements like nav, header, form."
        code={semanticCode}
      >
        <SemanticDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "realworld",
    label: "Real-World Examples",
    group: "Layout",
    demo: (
      <DemoWrapper
        title="Real-World Examples"
        description="Common UI patterns using the Flex component."
        code={realWorldCode}
      >
        <RealWorldDemos />
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
        description="Long unbroken labels, empty containers, and disabled wrapping controls inside a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const flexPageAPIReferenceSections = [
  {
    title: "Flex",
    props: [
      {
        prop: "as",
        type: "FlexElement",
        default: '"div"',
        description:
          "Semantic HTML element to render (div, nav, header, main, article, aside, footer, ul, ol, form, fieldset, span)",
      },
      {
        prop: "direction",
        type: "ResponsiveValue<FlexDirection>",
        default: '"row"',
        description:
          "Flex direction - row, row-reverse, column, column-reverse",
      },
      {
        prop: "wrap",
        type: "ResponsiveValue<FlexWrap>",
        default: "-",
        description: "Flex wrap behavior - nowrap, wrap, wrap-reverse",
      },
      {
        prop: "justify",
        type: "ResponsiveValue<FlexJustify>",
        default: "-",
        description:
          "Justify content alignment - start, end, center, between, around, evenly",
      },
      {
        prop: "align",
        type: "ResponsiveValue<FlexAlign>",
        default: "-",
        description:
          "Align items alignment - start, end, center, baseline, stretch",
      },
      {
        prop: "gap",
        type: "ResponsiveValue<FlexGap>",
        default: "-",
        description:
          "Gap between items - 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24",
      },
      {
        prop: "inline",
        type: "boolean",
        default: "false",
        description: "Render as inline-flex instead of flex",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];
