import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconAccessible,
  IconKeyboard,
  IconLoader,
  IconPalette,
  IconStack2,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardSkeleton,
  CardTitle,
} from "@/components/ui/card";
import {
  APIReference,
  Changelog,
  ComponentPage,
  DemoTabs,
  DemoWrapper,
  FeatureGrid,
  KeyboardShortcuts,
  PageHeader,
  UsageBlock,
} from "@/components/docs";

function BasicDemo() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          Card description with additional context.
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  );
}

const basicCode = `import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function BasicDemo() {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          Card description with additional context.
        </CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">Edit</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>This is the main content area of the card.</p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Action</Button>
      </CardFooter>
    </Card>
  )
}`;

function VariantsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card variant="interactive" className="max-w-md">
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>Hover to see lift effect.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This card has a hover effect with shadow and translation.
          </p>
        </CardContent>
      </Card>
      <Card variant="gradient" className="max-w-md">
        <CardHeader>
          <CardTitle>Gradient Card</CardTitle>
          <CardDescription>Beautiful gradient background.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Gradient border and background effect.
          </p>
        </CardContent>
      </Card>
      <Card variant="outline" className="max-w-md">
        <CardHeader>
          <CardTitle>Outline Card</CardTitle>
          <CardDescription>Transparent with border.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Clean outline style with transparent background.
          </p>
        </CardContent>
      </Card>
      <Card variant="elevated" className="max-w-md">
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
          <CardDescription>Card with shadow elevation.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Subtle shadow for depth and hierarchy.
          </p>
        </CardContent>
      </Card>
      <Card variant="bordered" className="max-w-md">
        <CardHeader>
          <CardTitle>Bordered Card</CardTitle>
          <CardDescription>Card with prominent border.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Clear border definition for separation.
          </p>
        </CardContent>
      </Card>
      <Card variant="soft" className="max-w-md">
        <CardHeader>
          <CardTitle>Soft Card</CardTitle>
          <CardDescription>Muted background style.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Subtle muted background for gentle contrast.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const variantsCode = `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Interactive - hover effect with lift
<Card variant="interactive">...</Card>

// Gradient - gradient border and background
<Card variant="gradient">...</Card>

// Glass - glassmorphism with blur
<Card variant="glass">...</Card>

// Outline - transparent with border
<Card variant="outline">...</Card>

// Elevated - shadow for depth
<Card variant="elevated">...</Card>

// Bordered - prominent border
<Card variant="bordered">...</Card>

// Soft - muted background
<Card variant="soft">...</Card>

// Flat - no borders or shadows
<Card variant="flat">...</Card>`;

function GlassDemo() {
  return (
    <div className="relative rounded-lg bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10 p-8">
      <Card variant="glass" className="max-w-md">
        <CardHeader>
          <CardTitle>Glass Card</CardTitle>
          <CardDescription>
            See the blur effect behind this card.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The backdrop blur creates a frosted glass effect that blurs the
            colorful background behind it.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const glassCode = `// Glass card works best over colorful backgrounds
<div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-8 rounded-lg">
  <Card variant="glass" className="max-w-md">
    <CardHeader>
      <CardTitle>Glass Card</CardTitle>
      <CardDescription>Glassmorphism effect</CardDescription>
    </CardHeader>
    <CardContent>
      Content with backdrop blur
    </CardContent>
  </Card>
</div>`;

function MoreVariantsDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card variant="elevated2" className="max-w-md">
        <CardHeader>
          <CardTitle>Elevated 2</CardTitle>
          <CardDescription>Stronger shadow elevation.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            More pronounced shadow for emphasis.
          </p>
        </CardContent>
      </Card>
      <Card variant="flat" className="max-w-md">
        <CardHeader>
          <CardTitle>Flat Card</CardTitle>
          <CardDescription>Minimal flat design.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No borders or shadows, pure flat design.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const moreVariantsCode = `// Elevated 2 - stronger shadow
<Card variant="elevated2">...</Card>

// Flat - no borders or shadows
<Card variant="flat">...</Card>`;

function InteractiveCardDemo() {
  const [activated, setActivated] = React.useState(0);

  return (
    <div className="flex min-h-48 items-center justify-center">
      <Card variant="interactive" className="relative max-w-md">
        <button
          type="button"
          aria-label="Open project details"
          onClick={() => setActivated((n) => n + 1)}
          className="absolute inset-0 z-10 rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
        />
        <CardHeader>
          <CardTitle>Interactive Card</CardTitle>
          <CardDescription>
            A click-target card with full keyboard operability.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Tab to focus, then press Enter or Space. Activations:{" "}
            <output className="font-medium text-foreground tabular-nums">
              {activated}
            </output>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const interactiveCode = `import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function InteractiveCardDemo() {
  const [activated, setActivated] = React.useState(0)

  return (
    <Card variant="interactive" className="relative max-w-md">
      <button
        type="button"
        aria-label="Open project details"
        onClick={() => setActivated((n) => n + 1)}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline-2 focus-visible:outline-ring"
      />
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Keyboard operable click target.</CardDescription>
      </CardHeader>
      <CardContent>
        <output className="tabular-nums">Activations: {activated}</output>
      </CardContent>
    </Card>
  )
}`;

function SkeletonDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CardSkeleton />
      <CardSkeleton size="sm" />
    </div>
  );
}

const skeletonCode = `import { CardSkeleton } from "@/components/ui/card"

<div className="grid gap-4 md:grid-cols-2">
  <CardSkeleton />
  <CardSkeleton size="sm" />
</div>`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle>
            Quarterly Regional Infrastructure Reliability and Incident Review
            Summary
          </CardTitle>
          <CardDescription>
            Long titles and descriptions wrap cleanly alongside a pinned header
            action inside a narrow column.
          </CardDescription>
          <CardAction>
            <Button variant="outline" size="sm" disabled>
              Locked
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Compact size reduces card padding and footer spacing without
            cramping controls.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm" disabled>
            Publish report
          </Button>
        </CardFooter>
      </Card>

      <Card variant="outline" size="sm">
        <CardHeader>
          <CardTitle>Empty content card</CardTitle>
          <CardDescription>No body or footer rendered.</CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}

const stressCode = `import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Long titles, empty content, and disabled actions inside a narrow container
<div className="max-w-xs space-y-4">
  <Card size="sm">
    <CardHeader>
      <CardTitle>Quarterly Regional Infrastructure Reliability Summary</CardTitle>
      <CardDescription>Wraps cleanly beside CardAction.</CardDescription>
      <CardAction>
        <Button variant="outline" size="sm" disabled>Locked</Button>
      </CardAction>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">Compact card body.</p>
    </CardContent>
    <CardFooter>
      <Button size="sm" disabled>Publish report</Button>
    </CardFooter>
  </Card>

  <Card variant="outline" size="sm">
    <CardHeader>
      <CardTitle>Empty content card</CardTitle>
      <CardDescription>No body or footer rendered.</CardDescription>
    </CardHeader>
    <CardContent />
  </Card>
</div>`;

const usageCode = `import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardSkeleton,
  CardTitle,
} from "@/components/ui/card"

// Basic card with header action
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
    <CardAction>
      <Button variant="ghost" size="sm">Edit</Button>
    </CardAction>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>
    <Button size="sm">Save</Button>
  </CardFooter>
</Card>

// Variants & loading skeleton
<Card variant="interactive">...</Card>
<Card variant="glass">...</Card>
<CardSkeleton size="sm" />`;

export default function CardPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Card"
        description="A flexible card component with multiple variants, composable sections, and keyboard-operable interactive cards."
        version="v2.2.0"
      />

      <FeatureGrid
        features={cardPageFeatures}
        description="Surface variants, composable sections, and loading placeholders built for Kira Kit."
      />

      <DemoTabs defaultValue="basic" tabs={cardPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={cardPageShortcuts}
        description="Keyboard navigation when wiring Card as an interactive click target."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Compose Card with its header, action, content, and footer primitives."
        notes={cardPageUsageNotes}
      />

      <APIReference
        sections={cardPageAPISections}
        description="Props, variants, and defaults for every exported Card part."
      />

      <Changelog
        entries={cardPageChangelogEntries}
        title="Changelog"
        description="Version history for the Card component."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const cardPageFeatures = [
  {
    title: "Accessible",
    description: "Semantic HTML structure with proper heading hierarchy.",
    icon: <IconAccessible aria-hidden="true" className="size-4 text-primary" />,
  },
  {
    title: "Multiple Variants",
    description: "10 variants including glass, gradient, elevated, and more.",
    icon: <IconPalette aria-hidden="true" className="size-4 text-primary" />,
  },
  {
    title: "Keyboard Operable",
    description:
      "Click-target cards activate with Enter and Space when paired with a native button overlay.",
    icon: <IconKeyboard aria-hidden="true" className="size-4 text-primary" />,
  },
  {
    title: "Skeleton Fallback",
    description: "CardSkeleton reserves layout space while content loads.",
    icon: <IconLoader aria-hidden="true" className="size-4 text-primary" />,
  },
  {
    title: "Composable",
    description:
      "Header, Title, Description, Action, Content, and Footer sub-components.",
    icon: <IconStack2 aria-hidden="true" className="size-4 text-primary" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const cardPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Basic Card"
        description="Standard card with header, action, content, and footer."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Card Variants"
        description="Different visual styles for various contexts."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "glass",
    label: "Glass",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Glass Card"
        description="Glassmorphism effect with backdrop blur."
        code={glassCode}
      >
        <GlassDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "more",
    label: "More Variants",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Additional Variants"
        description="Elevated and flat card styles."
        code={moreVariantsCode}
      >
        <MoreVariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "interactive",
    label: "Interactive",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Interactive Card"
        description="Click-target card with a stretched native button for full keyboard operability."
        code={interactiveCode}
      >
        <InteractiveCardDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "skeleton",
    label: "Skeleton",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Card Skeleton"
        description="Loading placeholder in default and small sizes."
        code={skeletonCode}
      >
        <SkeletonDemo />
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
        description="Long titles, empty content, and disabled actions in a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const cardPageShortcuts = [
  { keys: "Tab", description: "Focus the interactive card button." },
  { keys: "Enter", description: "Activate the focused interactive card." },
  { keys: "Space", description: "Activate the focused interactive card." },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const cardPageUsageNotes = [
  {
    label: "Composable primitives",
    body: "Card is intentionally composable with no data-driven KiraCard wrapper. Combine CardHeader, CardTitle, CardDescription, CardAction, CardContent, and CardFooter directly.",
  },
  {
    label: "CardAction & cardSurfaceVariants",
    body: "Place top-right controls inside CardAction so CardHeader automatically switches to a two-column grid. Use cardSurfaceVariants when aligning custom containers with Card surfaces.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const cardPageAPISections = [
  {
    title: "Card",
    props: [
      {
        prop: "variant",
        type: '"default" | "interactive" | "gradient" | "glass" | "outline" | "elevated" | "elevated2" | "bordered" | "soft" | "flat"',
        default: '"default"',
        description: "Visual surface style of the card.",
      },
      {
        prop: "size",
        type: '"default" | "sm"',
        default: '"default"',
        description: "Density of the card; sm uses p-4 instead of p-6.",
      },
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description:
          "Card sections (Header, Content, Footer, or bleed images).",
      },
    ],
  },
  {
    title: "CardHeader",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Header content (CardTitle, CardDescription, CardAction).",
      },
    ],
  },
  {
    title: "CardTitle",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Title text.",
      },
    ],
  },
  {
    title: "CardDescription",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Description text.",
      },
    ],
  },
  {
    title: "CardAction",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description:
          "Action control pinned to the top-right column of CardHeader.",
      },
    ],
  },
  {
    title: "CardContent",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Main content area.",
      },
    ],
  },
  {
    title: "CardFooter",
    props: [
      {
        prop: "className",
        type: "string",
        default: "-",
        description: "Additional CSS classes.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "-",
        description: "Footer content (actions, buttons).",
      },
    ],
  },
  {
    title: "CardSkeleton",
    props: [
      {
        prop: "size",
        type: '"default" | "sm"',
        default: '"default"',
        description:
          "Matches Card sizing; scales padding and placeholder blocks.",
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
    title: "cardSurfaceVariants",
    props: [
      {
        prop: "variant / size",
        type: "VariantProps<typeof cardSurfaceVariants>",
        default: '"default" / "default"',
        description:
          "Exported CVA helper for reusing Card surface styles on custom containers.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const cardPageChangelogEntries = [
  {
    version: "2.2.0",
    date: "18 November 2026",
    changes: [
      {
        type: "changed",
        title: "Spacing Contract Padding Model",
        description:
          'Card now owns all padding: p-6 (size="sm" p-4) instead of py-4 plus per-section px. Card\'s own gap-4 is gone — CardHeader adds mb-4 (sm mb-3) and CardFooter adds pt-6 (sm pt-4) for section rhythm. Direct image children still bleed to the card edges.',
      },
      {
        type: "changed",
        title: "CardFooter Is No Longer a Tinted Band",
        description:
          "Removed the bg-muted/50 border-t full-width band. CardFooter is now a plain flex items-center gap-2 row with pt-6 (sm pt-4), inside the card padding.",
      },
      {
        type: "changed",
        title: "CardTitle Typography",
        description:
          "Title is now text-base font-semibold leading-none (sm keeps text-sm), matching the design-system contract.",
      },
      {
        type: "changed",
        title: "CardSkeleton Padding",
        description:
          "Skeleton placeholder now mirrors the new p-6/p-4 card padding instead of py-4/py-3 plus section px.",
      },
    ],
  },
  {
    version: "2.1.0",
    date: "3 November 2026",
    changes: [
      {
        type: "added",
        title: "cardSurfaceVariants Export",
        description:
          "The card surface styles are now a class-variance-authority variant function, exported for consumers and stats-card surface alignment. All 10 variants are unchanged.",
      },
      {
        type: "added",
        title: "CardSkeleton",
        description:
          'New loading placeholder that mirrors Card sizing (size="sm" scales padding and placeholder blocks).',
      },
      {
        type: "added",
        title: "Interactive Card a11y Guidance",
        description:
          'Card stays presentational; click-target cards should opt in with a stretched button overlay or role="button", tabIndex={0}, and Enter/Space handling (see the Interactive tab).',
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
