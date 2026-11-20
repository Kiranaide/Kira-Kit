import type { ComponentProps as ReactComponentProps } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CardSkeleton } from "@/components/ui/card";
import {
  IconAccessible,
  IconKeyboard,
  IconLoader,
  IconPalette,
  IconStack2,
} from "@tabler/icons-react";
import { useState } from "react";
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
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>
          Card description with additional context.
        </CardDescription>
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

const basicCode = `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`;

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
    <div className="relative p-8 rounded-lg bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/10">
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
<div className="bg-gradient-to-br from-primary/20 to-secondary/20">
  <Card variant="glass">
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
  const [activated, setActivated] = useState(0);

  return (
    <div className="flex items-center justify-center min-h-[200px]">
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
            <span className="font-medium text-foreground tabular-nums">
              {activated}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

const interactiveCode = `import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function InteractiveCardDemo() {
  const [activated, setActivated] = useState(0)

  return (
    <Card
      variant="interactive"
      role="button"
      tabIndex={0}
      aria-label="Open project details"
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          setActivated((n) => n + 1)
        }
      }}
      onClick={() => setActivated((n) => n + 1)}
    >
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Keyboard operable click target.</CardDescription>
      </CardHeader>
      <CardContent>Activations: {activated}</CardContent>
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

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function CardPage() {
  const features = [
    {
      title: "Accessible",
      description: "Semantic HTML structure with proper heading hierarchy.",
      icon: <IconAccessible className="w-4 h-4 text-primary" />,
    },
    {
      title: "Multiple Variants",
      description: "10 variants including glass, gradient, elevated, and more.",
      icon: <IconPalette className="w-4 h-4 text-primary" />,
    },
    {
      title: "Keyboard Operable",
      description:
        "Click-target cards activate with Enter and Space when wired as buttons (see Interactive tab).",
      icon: <IconKeyboard className="w-4 h-4 text-primary" />,
    },
    {
      title: "Skeleton Fallback",
      description: "CardSkeleton reserves layout space while content loads.",
      icon: <IconLoader className="w-4 h-4 text-primary" />,
    },
    {
      title: "Composable",
      description:
        "Header, Content, Footer, Title, and Description sub-components.",
      icon: <IconStack2 className="w-4 h-4 text-primary" />,
    },
  ];

  const demoTabs = [
    {
      value: "basic",
      label: "Basic",
      demo: (
        <DemoWrapper
          title="Basic Card"
          description="Standard card with header, content, and footer"
          code={basicCode}
        >
          <BasicDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "variants",
      label: "Variants",
      demo: (
        <DemoWrapper
          title="Card Variants"
          description="Different visual styles for various contexts"
          code={variantsCode}
        >
          <VariantsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "glass",
      label: "Glass",
      demo: (
        <DemoWrapper
          title="Glass Card"
          description="Glassmorphism effect with backdrop blur"
          code={glassCode}
        >
          <GlassDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "more",
      label: "More Variants",
      demo: (
        <DemoWrapper
          title="Additional Variants"
          description="Elevated and flat card styles"
          code={moreVariantsCode}
        >
          <MoreVariantsDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "interactive",
      label: "Interactive",
      demo: (
        <DemoWrapper
          title="Interactive Card"
          description="Click-target card with keyboard operability"
          code={interactiveCode}
        >
          <InteractiveCardDemo />
        </DemoWrapper>
      ),
    },
    {
      value: "skeleton",
      label: "Skeleton",
      demo: (
        <DemoWrapper
          title="Card Skeleton"
          description="Loading placeholder in default and small sizes"
          code={skeletonCode}
        >
          <SkeletonDemo />
        </DemoWrapper>
      ),
    },
  ];

  const keyboardShortcuts = [
    { keys: "Tab", description: "Focus the interactive card" },
    { keys: "Enter", description: "Activate interactive card" },
    { keys: "Space", description: "Activate interactive card" },
  ];

  const usageCode = `import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Basic card
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>

// With variant
<Card variant="interactive">...</Card>
<Card variant="gradient">...</Card>
<Card variant="glass">...</Card>
<Card variant="elevated">...</Card>`;

  const apiReference = [
    {
      title: "Card",
      props: [
        {
          prop: "variant",
          type: '"default" | "interactive" | "gradient" | "glass" | "outline" | "elevated" | "elevated2" | "bordered" | "soft" | "flat"',
          default: '"default"',
          description: "Visual style of the card",
        },
        {
          prop: "size",
          type: '"default" | "sm"',
          default: '"default"',
          description: "Density of the card; sm uses p-4 instead of p-6",
        },
        {
          prop: "className",
          type: "string",
          default: "-",
          description: "Additional CSS classes",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Card content (Header, Content, Footer)",
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
          description: "Additional CSS classes",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Header content (Title, Description)",
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
          description: "Additional CSS classes",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Title text",
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
          description: "Additional CSS classes",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Description text",
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
          description: "Additional CSS classes",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Main content",
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
          description: "Additional CSS classes",
        },
        {
          prop: "children",
          type: "ReactNode",
          default: "-",
          description: "Footer content (actions, buttons)",
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
            "Matches Card sizing; scales padding and placeholder blocks",
        },
        {
          prop: "className",
          type: "string",
          default: "-",
          description: "Additional CSS classes",
        },
      ],
    },
  ];

  return (
    <ComponentPage>
      <PageHeader
        title="Card"
        description="A flexible card component with multiple variants, composable sections, and keyboard-operable interactive cards."
        version="v2.1"
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} />

      <KeyboardShortcuts shortcuts={keyboardShortcuts} />

      <UsageBlock code={usageCode} />

      <APIReference sections={apiReference} />

      <Changelog entries={cardPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located and follows its source constants.
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
          'Card stays presentational; click-target cards should opt in with role="button", tabIndex={0}, and Enter/Space handling (see the Interactive tab).',
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
