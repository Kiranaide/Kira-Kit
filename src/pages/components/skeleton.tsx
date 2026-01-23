import * as React from "react";
import {
  IconLoader,
  IconAccessible,
  IconComponents,
} from "@tabler/icons-react";

import {
  Skeleton,
  SkeletonText,
  SkeletonHeading,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
  SkeletonGroup,
  SkeletonLines,
  SkeletonImage,
  SkeletonTableRow,
  SkeletonListItem,
  SkeletonBone,
} from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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
// Demo Code Snippets
// =============================================================================
const basicCode = `import { Skeleton } from "@/components/ui/skeleton"

export function BasicSkeletonDemo() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}`;

const shapesCode = `import {
  SkeletonText,
  SkeletonHeading,
  SkeletonAvatar,
  SkeletonButton,
} from "@/components/ui/skeleton"

export function ShapesDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Text</p>
        <SkeletonText />
        <SkeletonText className="w-3/4" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Heading</p>
        <SkeletonHeading />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Avatar (sizes)</p>
        <div className="flex items-center gap-3">
          <SkeletonAvatar size="sm" />
          <SkeletonAvatar size="md" />
          <SkeletonAvatar size="lg" />
          <SkeletonAvatar size="xl" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Button</p>
        <SkeletonButton />
      </div>
    </div>
  )
}`;

const compoundCode = `import { useState } from "react"
import { SkeletonGroup } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export function CompoundDemo() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Button
          size="sm"
          variant={isLoading ? "default" : "outline"}
          onClick={() => setIsLoading(true)}
        >
          Loading
        </Button>
        <Button
          size="sm"
          variant={!isLoading ? "default" : "outline"}
          onClick={() => setIsLoading(false)}
        >
          Loaded
        </Button>
      </div>

      <SkeletonGroup
        loading={isLoading}
        aria-label="Loading user profile"
        className="flex items-start gap-4 p-4 border rounded-lg"
      >
        <SkeletonGroup.Avatar size="lg" />
        <div className="flex-1 space-y-3">
          <SkeletonGroup.Heading />
          <SkeletonGroup.Lines count={2} lastLineWidth="2/3" />
          <SkeletonGroup.Button />
        </div>
      </SkeletonGroup>

      <p className="text-xs text-muted-foreground mt-2">
        aria-busy={isLoading ? "true" : "false"} • aria-live="polite" • role="status"
      </p>
    </>
  )
}`;

const linesCode = `import { SkeletonLines } from "@/components/ui/skeleton"

export function LinesDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-medium">3 lines (default)</p>
        <SkeletonLines count={3} />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">5 lines, large gap</p>
        <SkeletonLines count={5} gap="lg" lastLineWidth="1/2" />
      </div>
    </div>
  )
}`;

const imageCode = `import { SkeletonImage } from "@/components/ui/skeleton"

export function ImageDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-2">
        <p className="text-sm font-medium">16:9</p>
        <SkeletonImage aspectRatio="16/9" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">4:3</p>
        <SkeletonImage aspectRatio="4/3" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">1:1</p>
        <SkeletonImage aspectRatio="1/1" />
      </div>
    </div>
  )
}`;

const tableCode = `import { SkeletonTableRow } from "@/components/ui/skeleton"

export function TableDemo() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <SkeletonTableRow columns={4} />
      <SkeletonTableRow columns={4} delay={50} />
      <SkeletonTableRow columns={4} delay={100} />
      <SkeletonTableRow columns={4} delay={150} />
    </div>
  )
}`;

const listCode = `import { SkeletonListItem } from "@/components/ui/skeleton"

export function ListDemo() {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <SkeletonListItem />
      <SkeletonListItem delay={50} />
      <SkeletonListItem delay={100} />
    </div>
  )
}`;

const cardCode = `import { SkeletonCard } from "@/components/ui/skeleton"

export function CardDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}`;

const animationsCode = `import { Skeleton } from "@/components/ui/skeleton"

export function AnimationsDemo() {
  return (
    <div className="space-y-8">
      {/* Default pulse animation */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Pulse (default)</p>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Shimmer animation */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Shimmer</p>
        <Skeleton variant="shimmer" className="h-4 w-full" />
        <Skeleton variant="shimmer" className="h-4 w-3/4" />
        <Skeleton variant="shimmer" className="h-32 w-full rounded-lg" />
      </div>

      {/* Wave animation */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Wave</p>
        <Skeleton variant="wave" className="h-4 w-full" />
        <Skeleton variant="wave" className="h-4 w-3/4" />
      </div>
    </div>
  )
}`;

const staggeredCode = `import { SkeletonBone } from "@/components/ui/skeleton"

export function StaggeredDemo() {
  return (
    <div className="space-y-3">
      <SkeletonBone className="h-4 w-full" delay={0} />
      <SkeletonBone className="h-4 w-full" delay={100} />
      <SkeletonBone className="h-4 w-full" delay={200} />
      <SkeletonBone className="h-4 w-full" delay={300} />
    </div>
  )
}`;

const compositionCode = `import {
  SkeletonAvatar,
  SkeletonText,
  SkeletonHeading,
  SkeletonImage,
  SkeletonLines,
} from "@/components/ui/skeleton"

// User Profile
function UserProfileSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <SkeletonAvatar className="h-12 w-12" />
      <div className="space-y-2 flex-1">
        <SkeletonText className="h-4 w-32" />
        <SkeletonText className="h-3 w-48" />
      </div>
    </div>
  )
}

// Article
function ArticleSkeleton() {
  return (
    <div className="space-y-4">
      <SkeletonHeading className="w-2/3" />
      <div className="flex items-center gap-3">
        <SkeletonAvatar className="h-8 w-8" />
        <SkeletonText className="h-3 w-24" />
        <SkeletonText className="h-3 w-16" />
      </div>
      <SkeletonImage aspectRatio="16/9" />
      <SkeletonLines count={3} lastLineWidth="3/4" />
    </div>
  )
}`;

const usageCode = `import {
  Skeleton,
  SkeletonGroup,
  SkeletonLines,
  SkeletonImage,
  SkeletonTableRow,
  SkeletonListItem,
} from "@/components/ui/skeleton"

// Basic skeleton
<Skeleton className="h-4 w-full" />

// Circle (for avatars)
<Skeleton variant="circle" className="h-10 w-10" />

// Shimmer animation
<Skeleton variant="shimmer" className="h-32 w-full" />

// Compound pattern with accessibility
<SkeletonGroup
  loading={isLoading}
  aria-label="Loading user profile"
>
  <SkeletonGroup.Avatar size="lg" />
  <SkeletonGroup.Heading />
  <SkeletonGroup.Lines count={3} />
  <SkeletonGroup.Button />
</SkeletonGroup>

// Multiple lines
<SkeletonLines count={4} gap="lg" lastLineWidth="1/2" />

// Image with aspect ratio
<SkeletonImage aspectRatio="16/9" />

// Table rows with stagger
<SkeletonTableRow columns={4} delay={0} />
<SkeletonTableRow columns={4} delay={50} />

// List items
<SkeletonListItem />`;

// =============================================================================
// Demo Components
// =============================================================================
function BasicDemo() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

function ShapesDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Text</p>
        <SkeletonText />
        <SkeletonText className="w-3/4" />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Heading</p>
        <SkeletonHeading />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Avatar (sizes)</p>
        <div className="flex items-center gap-3">
          <SkeletonAvatar size="sm" />
          <SkeletonAvatar size="md" />
          <SkeletonAvatar size="lg" />
          <SkeletonAvatar size="xl" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Button</p>
        <SkeletonButton />
      </div>
    </div>
  );
}

function CompoundDemo() {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={isLoading ? "default" : "outline"}
          onClick={() => setIsLoading(true)}
        >
          Loading
        </Button>
        <Button
          size="sm"
          variant={!isLoading ? "default" : "outline"}
          onClick={() => setIsLoading(false)}
        >
          Loaded
        </Button>
      </div>

      <SkeletonGroup
        loading={isLoading}
        aria-label="Loading user profile"
        className="flex items-start gap-4 p-4 border rounded-lg"
      >
        <SkeletonGroup.Avatar size="lg" />
        <div className="flex-1 space-y-3">
          <SkeletonGroup.Heading />
          <SkeletonGroup.Lines count={2} lastLineWidth="2/3" />
          <SkeletonGroup.Button />
        </div>
      </SkeletonGroup>

      <p className="text-xs text-muted-foreground">
        aria-busy={isLoading ? "true" : "false"} | aria-live="polite" |
        role="status"
      </p>
    </div>
  );
}

function LinesDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="space-y-2">
        <p className="text-sm font-medium">3 lines (default)</p>
        <SkeletonLines count={3} />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">5 lines, large gap</p>
        <SkeletonLines count={5} gap="lg" lastLineWidth="1/2" />
      </div>
    </div>
  );
}

function ImageDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="space-y-2">
        <p className="text-sm font-medium">16:9</p>
        <SkeletonImage aspectRatio="16/9" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">4:3</p>
        <SkeletonImage aspectRatio="4/3" />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">1:1</p>
        <SkeletonImage aspectRatio="1/1" />
      </div>
    </div>
  );
}

function TableDemo() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <SkeletonTableRow columns={4} />
      <SkeletonTableRow columns={4} delay={50} />
      <SkeletonTableRow columns={4} delay={100} />
      <SkeletonTableRow columns={4} delay={150} />
    </div>
  );
}

function ListDemo() {
  return (
    <div className="border rounded-lg p-4 space-y-4">
      <SkeletonListItem />
      <SkeletonListItem delay={50} />
      <SkeletonListItem delay={100} />
    </div>
  );
}

function CardDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

function AnimationsDemo() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium">Pulse (default)</p>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Shimmer</p>
        <Skeleton variant="shimmer" className="h-4 w-full" />
        <Skeleton variant="shimmer" className="h-4 w-3/4" />
        <Skeleton variant="shimmer" className="h-32 w-full rounded-lg" />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Wave</p>
        <Skeleton variant="wave" className="h-4 w-full" />
        <Skeleton variant="wave" className="h-4 w-3/4" />
      </div>
    </div>
  );
}

function StaggeredDemo() {
  return (
    <div className="space-y-3">
      <SkeletonBone className="h-4 w-full" delay={0} />
      <SkeletonBone className="h-4 w-full" delay={100} />
      <SkeletonBone className="h-4 w-full" delay={200} />
      <SkeletonBone className="h-4 w-full" delay={300} />
    </div>
  );
}

function CompositionDemo() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="space-y-4">
        <p className="text-sm font-medium">User Profile</p>
        <div className="flex items-center gap-4">
          <SkeletonAvatar className="h-12 w-12" />
          <div className="space-y-2 flex-1">
            <SkeletonText className="h-4 w-32" />
            <SkeletonText className="h-3 w-48" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm font-medium">Article</p>
        <div className="space-y-4">
          <SkeletonHeading className="w-2/3" />
          <div className="flex items-center gap-3">
            <SkeletonAvatar className="h-8 w-8" />
            <SkeletonText className="h-3 w-24" />
            <SkeletonText className="h-3 w-16" />
          </div>
          <SkeletonImage aspectRatio="16/9" />
          <SkeletonLines count={3} lastLineWidth="3/4" />
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Feature Data
// =============================================================================
const features = [
  {
    title: "Accessible",
    description:
      'Full ARIA support with aria-busy, aria-live, and role="status" for screen reader announcements.',
    icon: <IconAccessible className="h-4 w-4" />,
  },
  {
    title: "Animated",
    description:
      "Multiple animation variants (pulse, shimmer, wave) with prefers-reduced-motion support.",
    icon: <IconLoader className="h-4 w-4" />,
  },
  {
    title: "Composable",
    description:
      "Preset components (Avatar, Text, Card) plus compound patterns for complex loading states.",
    icon: <IconComponents className="h-4 w-4" />,
  },
];

// =============================================================================
// Demo Tabs Configuration
// =============================================================================
const demoTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Basic Skeleton"
        description="Simple rectangular loading placeholders with customizable dimensions."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "shapes",
    label: "Shapes",
    demo: (
      <DemoWrapper
        title="Preset Shapes"
        description="Pre-configured components for common UI elements."
        code={shapesCode}
      >
        <ShapesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "compound",
    label: "Compound",
    demo: (
      <DemoWrapper
        title="Compound Pattern"
        description="Use SkeletonGroup for accessible loading states with proper ARIA attributes."
        code={compoundCode}
      >
        <CompoundDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "lines",
    label: "Lines",
    demo: (
      <DemoWrapper
        title="Skeleton Lines"
        description="Generate multiple text lines with customizable count and gap."
        code={linesCode}
      >
        <LinesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "image",
    label: "Image",
    demo: (
      <DemoWrapper
        title="Skeleton Image"
        description="Image placeholder with aspect ratio support."
        code={imageCode}
      >
        <ImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "table",
    label: "Table",
    demo: (
      <DemoWrapper
        title="Table Row Skeleton"
        description="Loading placeholder for table rows with staggered animation."
        code={tableCode}
      >
        <TableDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "list",
    label: "List",
    demo: (
      <DemoWrapper
        title="List Item Skeleton"
        description="Loading placeholder for list items with avatar and text."
        code={listCode}
      >
        <ListDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "card",
    label: "Card",
    demo: (
      <DemoWrapper
        title="Card Skeleton"
        description="Full card loading placeholder with image, title, and content."
        code={cardCode}
      >
        <CardDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "animations",
    label: "Animations",
    demo: (
      <DemoWrapper
        title="Animation Variants"
        description="Different animation styles: pulse (default), shimmer, and wave."
        code={animationsCode}
      >
        <AnimationsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "staggered",
    label: "Staggered",
    demo: (
      <DemoWrapper
        title="Staggered Animation"
        description="Use the delay prop to create staggered loading effects."
        code={staggeredCode}
      >
        <StaggeredDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "composition",
    label: "Composition",
    demo: (
      <DemoWrapper
        title="Composition Examples"
        description="Build complex loading states by composing skeleton primitives."
        code={compositionCode}
      >
        <CompositionDemo />
      </DemoWrapper>
    ),
  },
];

// =============================================================================
// API Reference Data
// =============================================================================
const apiSections = [
  {
    title: "Skeleton",
    props: [
      {
        prop: "variant",
        type: '"default" | "circle" | "shimmer" | "wave"',
        default: '"default"',
        description: "Animation style and shape variant.",
      },
      {
        prop: "className",
        type: "string",
        description: "Additional CSS classes for sizing and styling.",
      },
    ],
  },
  {
    title: "SkeletonGroup",
    props: [
      {
        prop: "loading",
        type: "boolean",
        default: "true",
        description: "Controls whether the skeleton is in loading state.",
      },
      {
        prop: "aria-label",
        type: "string",
        description: "Accessible label for the loading region.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "Compound children: Avatar, Heading, Lines, Button.",
      },
    ],
  },
  {
    title: "SkeletonAvatar",
    props: [
      {
        prop: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        default: '"md"',
        description: "Avatar size preset.",
      },
    ],
  },
  {
    title: "SkeletonLines",
    props: [
      {
        prop: "count",
        type: "number",
        default: "3",
        description: "Number of skeleton lines to render.",
      },
      {
        prop: "gap",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "Spacing between lines.",
      },
      {
        prop: "lastLineWidth",
        type: '"full" | "3/4" | "2/3" | "1/2"',
        default: '"3/4"',
        description: "Width of the last line for natural text appearance.",
      },
    ],
  },
  {
    title: "SkeletonImage",
    props: [
      {
        prop: "aspectRatio",
        type: '"16/9" | "4/3" | "1/1" | string',
        default: '"16/9"',
        description: "Aspect ratio for the image placeholder.",
      },
    ],
  },
  {
    title: "SkeletonTableRow",
    props: [
      {
        prop: "columns",
        type: "number",
        default: "4",
        description: "Number of columns in the table row.",
      },
      {
        prop: "delay",
        type: "number",
        default: "0",
        description: "Animation delay in milliseconds for staggered effect.",
      },
    ],
  },
  {
    title: "SkeletonListItem",
    props: [
      {
        prop: "delay",
        type: "number",
        default: "0",
        description: "Animation delay in milliseconds for staggered effect.",
      },
    ],
  },
  {
    title: "SkeletonBone",
    props: [
      {
        prop: "delay",
        type: "number",
        default: "0",
        description: "Animation delay in milliseconds for staggered effect.",
      },
      {
        prop: "className",
        type: "string",
        description: "Additional CSS classes for sizing.",
      },
    ],
  },
];

// =============================================================================
// Main Page Component
// =============================================================================
export default function SkeletonPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Skeleton"
        version="v1.0"
        description="Loading placeholder animations with full accessibility support and multiple animation variants."
      />

      <FeatureGrid features={features} />

      <DemoTabs tabs={demoTabs} defaultValue="basic" />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import and use skeleton components for loading states."
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="Props and configuration options for skeleton components."
      />
    </ComponentPage>
  );
}
