import {
  Skeleton,
  SkeletonText,
  SkeletonHeading,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonCard,
} from "@/components/ui/skeleton";

export function SkeletonPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Skeleton</h1>
        <p className="text-muted-foreground">
          Loading placeholder animations for content.
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
            <p className="text-sm text-muted-foreground">Avatar</p>
            <SkeletonAvatar />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Button</p>
            <SkeletonButton />
          </div>
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
          <Skeleton className="h-48 w-full rounded-lg" />
          <div className="space-y-2">
            <SkeletonText />
            <SkeletonText />
            <SkeletonText className="w-4/5" />
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
            {`import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
} from "@/components/ui/skeleton"

{/* Basic */}
<Skeleton className="h-4 w-full" />

{/* Circle (for avatars) */}
<Skeleton variant="circle" className="h-10 w-10" />

{/* Presets */}
<SkeletonText />
<SkeletonAvatar />
<SkeletonCard />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
