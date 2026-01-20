import * as React from "react";
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

export function SkeletonPage() {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Skeleton</h1>
        <p className="text-muted-foreground">
          Loading placeholder animations with full accessibility support.
        </p>
      </header>

      {/* Basic Skeleton */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Skeleton
        </h2>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </section>

      {/* Compound Pattern (New) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Compound Pattern (New API)
        </h2>
        <p className="text-sm text-muted-foreground">
          Use <code className="bg-muted px-1 rounded">SkeletonGroup</code> for accessible loading states with proper ARIA attributes.
        </p>
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
          ✓ aria-busy={isLoading ? "true" : "false"} • aria-live="polite" • role="status"
        </p>
      </section>

      {/* Skeleton Lines */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Skeleton Lines
        </h2>
        <p className="text-sm text-muted-foreground">
          Generate multiple text lines with customizable count and gap.
        </p>
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
      </section>

      {/* Presets */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Preset Components
        </h2>
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
      </section>

      {/* Skeleton Image */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Skeleton Image
        </h2>
        <p className="text-sm text-muted-foreground">
          Image placeholder with aspect ratio support.
        </p>
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
      </section>

      {/* Skeleton Table Row */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Table Row Skeleton
        </h2>
        <div className="border rounded-lg p-4 space-y-3">
          <SkeletonTableRow columns={4} />
          <SkeletonTableRow columns={4} delay={50} />
          <SkeletonTableRow columns={4} delay={100} />
          <SkeletonTableRow columns={4} delay={150} />
        </div>
      </section>

      {/* Skeleton List Item */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          List Item Skeleton
        </h2>
        <div className="border rounded-lg p-4 space-y-4">
          <SkeletonListItem />
          <SkeletonListItem delay={50} />
          <SkeletonListItem delay={100} />
        </div>
      </section>

      {/* Card Skeleton */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Card Skeleton
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>

      {/* User Profile Skeleton */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          User Profile Skeleton
        </h2>
        <div className="flex items-center gap-4">
          <SkeletonAvatar className="h-12 w-12" />
          <div className="space-y-2 flex-1">
            <SkeletonText className="h-4 w-32" />
            <SkeletonText className="h-3 w-48" />
          </div>
        </div>
      </section>

      {/* Article Skeleton */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Article Skeleton
        </h2>
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
      </section>

      {/* Shimmer Animation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Shimmer Animation
        </h2>
        <p className="text-sm text-muted-foreground">
          Smooth gradient sweep animation for loading states.
        </p>
        <div className="space-y-3">
          <Skeleton variant="shimmer" className="h-4 w-full" />
          <Skeleton variant="shimmer" className="h-4 w-3/4" />
          <Skeleton variant="shimmer" className="h-4 w-1/2" />
          <Skeleton variant="shimmer" className="h-32 w-full rounded-lg" />
        </div>
      </section>

      {/* Wave Animation (New) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Wave Animation (New)
        </h2>
        <p className="text-sm text-muted-foreground">
          Subtle opacity wave animation for a gentler loading effect.
        </p>
        <div className="space-y-3">
          <Skeleton variant="wave" className="h-4 w-full" />
          <Skeleton variant="wave" className="h-4 w-3/4" />
          <Skeleton variant="wave" className="h-4 w-1/2" />
        </div>
      </section>

      {/* Staggered Animation */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Staggered Animation
        </h2>
        <p className="text-sm text-muted-foreground">
          Use the <code className="bg-muted px-1 rounded">delay</code> prop to create staggered loading effects.
        </p>
        <div className="space-y-3">
          <SkeletonBone className="h-4 w-full" delay={0} />
          <SkeletonBone className="h-4 w-full" delay={100} />
          <SkeletonBone className="h-4 w-full" delay={200} />
          <SkeletonBone className="h-4 w-full" delay={300} />
        </div>
      </section>

      {/* Reduced Motion */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Reduced Motion Support
        </h2>
        <p className="text-sm text-muted-foreground">
          All animations respect <code className="bg-muted px-1 rounded">prefers-reduced-motion</code>. 
          When enabled, skeletons display with reduced opacity instead of animation.
        </p>
        <div className="p-4 bg-muted/50 rounded-lg text-sm">
          <code>motion-safe:animate-pulse motion-reduce:opacity-70</code>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
  Skeleton,
  SkeletonGroup,
  SkeletonLines,
  SkeletonImage,
  SkeletonTableRow,
  SkeletonListItem,
} from "@/components/ui/skeleton"

{/* Basic */}
<Skeleton className="h-4 w-full" />

{/* Circle (for avatars) */}
<Skeleton variant="circle" className="h-10 w-10" />

{/* Shimmer animation */}
<Skeleton variant="shimmer" className="h-32 w-full" />

{/* Compound pattern with accessibility */}
<SkeletonGroup 
  loading={isLoading} 
  aria-label="Loading user profile"
>
  <SkeletonGroup.Avatar size="lg" />
  <SkeletonGroup.Heading />
  <SkeletonGroup.Lines count={3} />
  <SkeletonGroup.Button />
</SkeletonGroup>

{/* Multiple lines */}
<SkeletonLines count={4} gap="lg" lastLineWidth="1/2" />

{/* Image with aspect ratio */}
<SkeletonImage aspectRatio="16/9" />

{/* Table rows with stagger */}
<SkeletonTableRow columns={4} delay={0} />
<SkeletonTableRow columns={4} delay={50} />

{/* List items */}
<SkeletonListItem />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
