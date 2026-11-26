import type { ComponentProps as ReactComponentProps } from "react";
import { IconPhoto, IconPhotoOff } from "@tabler/icons-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
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

function BasicImageDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      {fitOptions.map((item) => (
        <div key={item.fit} className="w-48 space-y-2">
          <div className="aspect-video overflow-hidden rounded-lg border border-border bg-muted">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
              alt="Snow-capped alpine peaks beneath a bright sky"
              loading="lazy"
              decoding="async"
              className={cn("h-full w-full", item.className)}
            />
          </div>
          <p className="text-xs text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

const basicImageCode = `import { cn } from "cn"

export function BasicImageDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="w-48 space-y-2">
        <div className={cn("aspect-video overflow-hidden rounded-lg border border-border bg-muted")}>
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
            alt="Snow-capped alpine peaks beneath a bright sky"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">Cover fit</p>
      </div>
    </div>
  )
}`;

function RoundedImageDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      {roundedOptions.map((item) => (
        <div key={item.label} className="space-y-2">
          <div
            className={cn(
              "size-32 overflow-hidden border border-border bg-muted",
              item.className,
            )}
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
              alt="Portrait headshot against a neutral backdrop"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-xs text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

const roundedImageCode = `<div className="flex flex-wrap items-center gap-6">
  <div className="size-32 overflow-hidden rounded-lg border border-border">
    <img src="/portrait.jpg" alt="Portrait" className="h-full w-full object-cover" />
  </div>
  <div className="size-32 overflow-hidden rounded-full border border-border">
    <img src="/portrait.jpg" alt="Portrait" className="h-full w-full object-cover" />
  </div>
</div>`;

function WithCaptionDemo() {
  return (
    <Card className="overflow-hidden p-0">
      <figure>
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
            alt="Golden sunrise lighting a mountain valley"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <figcaption className="space-y-1 p-4">
          <h3 className="font-semibold text-foreground">Mountain Sunrise</h3>
          <p className="text-sm text-muted-foreground">
            Semantic figure and figcaption pair the visual with its accessible
            description.
          </p>
        </figcaption>
      </figure>
    </Card>
  );
}

const withCaptionCode = `import { Card } from "@/components/ui/card"

export function WithCaptionDemo() {
  return (
    <Card className="overflow-hidden p-0">
      <figure>
        <div className="aspect-video overflow-hidden bg-muted">
          <img
            src="/sunrise.jpg"
            alt="Golden sunrise lighting a mountain valley"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
        <figcaption className="space-y-1 p-4">
          <h3 className="font-semibold">Mountain Sunrise</h3>
          <p className="text-sm text-muted-foreground">
            Semantic figure and figcaption pair the visual with its description.
          </p>
        </figcaption>
      </figure>
    </Card>
  )
}`;

function LoadingImageDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2">
        <output
          aria-label="Loading image"
          className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted"
        >
          <Spinner size="sm" />
        </output>
        <p className="text-xs text-muted-foreground">Spinner loading state</p>
      </div>

      <div className="space-y-2">
        <div className="aspect-video w-full overflow-hidden rounded-lg border border-border">
          <Skeleton className="h-full w-full" />
        </div>
        <p className="text-xs text-muted-foreground">Skeleton placeholder</p>
      </div>

      <div className="space-y-2">
        <div className="flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border bg-muted text-muted-foreground">
          <IconPhoto aria-hidden="true" className="size-6" />
          <span className="text-xs">Unavailable</span>
        </div>
        <p className="text-xs text-muted-foreground">Fallback error state</p>
      </div>
    </div>
  );
}

const loadingImageCode = `import { IconPhoto } from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

export function LoadingImageDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <output aria-label="Loading image" className="flex aspect-video items-center justify-center rounded-lg border bg-muted">
        <Spinner size="sm" />
      </output>
      <div className="aspect-video overflow-hidden rounded-lg border">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="flex aspect-video flex-col items-center justify-center gap-1 rounded-lg border border-dashed bg-muted text-muted-foreground">
        <IconPhoto aria-hidden="true" className="size-6" />
        <span className="text-xs">Unavailable</span>
      </div>
    </div>
  )
}`;

function ResponsiveImageDemo() {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden p-0">
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop"
            alt="Wide mountain range view"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        </div>
      </Card>
      <p className="text-xs text-muted-foreground">
        Full-width 16:9 container prevents layout shift while loading.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Card className="overflow-hidden p-0">
          <div className="aspect-square w-full overflow-hidden bg-muted">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop"
              alt="Alpine peaks detail"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </Card>
        <Card className="overflow-hidden p-0">
          <div className="aspect-square w-full overflow-hidden bg-muted">
            <img
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop"
              alt="Sunlit alpine ridge"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

const responsiveImageCode = `import { Card } from "@/components/ui/card"

<Card className="overflow-hidden p-0">
  <div className="aspect-video w-full overflow-hidden bg-muted">
    <img
      src="/landscape.jpg"
      alt="Wide mountain range view"
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover"
    />
  </div>
</Card>`;

function AvatarImageDemo() {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {avatarSizeOptions.map((item) => (
        <div key={item.label} className="space-y-2 text-center">
          <div
            className={cn(
              "overflow-hidden rounded-full border border-border bg-muted",
              item.className,
            )}
          >
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
              alt="Team member portrait"
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="text-xs text-muted-foreground">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

const avatarImageCode = `<div className="flex flex-wrap items-end gap-4">
  <div className="size-12 overflow-hidden rounded-full border border-border">
    <img src="/avatar.jpg" alt="Team member portrait" className="h-full w-full object-cover" />
  </div>
  <div className="size-20 overflow-hidden rounded-full border border-border">
    <img src="/avatar.jpg" alt="Team member portrait" className="h-full w-full object-cover" />
  </div>
</div>`;

function OverlayImageDemo() {
  return (
    <Card className="overflow-hidden p-4">
      <div className="relative h-64 w-full overflow-hidden rounded-lg bg-muted">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
          alt="Alpine peaks beneath a cloudy sky"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
        <div className="absolute right-4 bottom-4 left-4">
          <h3 className="text-lg font-semibold text-foreground">
            Alpine Ridge
          </h3>
          <p className="text-sm text-muted-foreground">
            Semantic scrim keeps overlaid copy legible in both light and dark
            themes.
          </p>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-background/90">
            Featured
          </Badge>
        </div>
      </div>
    </Card>
  );
}

const overlayImageCode = `import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

<Card className="overflow-hidden p-4">
  <div className="relative h-64 w-full overflow-hidden rounded-lg">
    <img src="/alpine.jpg" alt="Alpine peaks" className="h-full w-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
    <div className="absolute right-4 bottom-4 left-4">
      <h3 className="text-lg font-semibold text-foreground">Alpine Ridge</h3>
      <p className="text-sm text-muted-foreground">Theme-safe gradient scrim.</p>
    </div>
    <div className="absolute top-4 right-4">
      <Badge variant="secondary" className="bg-background/90">Featured</Badge>
    </div>
  </div>
</Card>`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <Card className="overflow-hidden p-0">
        <figure>
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 bg-muted p-4 text-center text-muted-foreground">
            <IconPhotoOff aria-hidden="true" className="size-6" />
            <span className="text-xs font-medium">
              No image source provided
            </span>
          </div>
          <figcaption className="space-y-2 p-4">
            <h4 className="truncate text-sm font-semibold text-foreground">
              ExtremelyLongQuarterlyProductPhotographyAssetCaption_v2026_Final
            </h4>
            <p className="text-xs text-muted-foreground">
              Empty sources fall back without breaking aspect ratio, and long
              titles truncate inside a narrow column.
            </p>
            <Button size="sm" variant="outline" disabled>
              Download unavailable
            </Button>
          </figcaption>
        </figure>
      </Card>
    </div>
  );
}

const stressCode = `// Narrow max-w-xs card: empty source fallback, long title truncation, disabled action
<div className="max-w-xs">
  <Card className="overflow-hidden p-0">
    <figure>
      <div role="img" aria-label="Missing media asset fallback" className="flex aspect-video items-center justify-center bg-muted">
        <span className="text-xs text-muted-foreground">No image source provided</span>
      </div>
      <figcaption className="space-y-2 p-4">
        <h4 className="truncate text-sm font-semibold">ExtremelyLongAssetCaption_v2026</h4>
        <Button size="sm" variant="outline" disabled>Download unavailable</Button>
      </figcaption>
    </figure>
  </Card>
</div>`;

const usageCode = `import { AspectRatio } from "@/components/ui/aspect-ratio"

export function ResponsiveFigure() {
  return (
    <figure className="space-y-2">
      <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-lg border border-border bg-muted">
        <img
          src="/hero.jpg"
          alt="Descriptive alt text for screen readers"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </AspectRatio>
      <figcaption className="text-xs text-muted-foreground">
        Reserve aspect ratio to avoid Cumulative Layout Shift.
      </figcaption>
    </figure>
  )
}`;

export default function ImagePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Image"
        description="Responsive image composition patterns with aspect-ratio locking, accessible figure captions, loading skeletons, and fallback states."
        version="v1.0.0"
      />

      <FeatureGrid
        features={imagePageFeatures}
        description="Image layout, loading, and accessibility patterns built with native HTML and Tailwind tokens."
      />

      <DemoTabs defaultValue="basic" tabs={imagePageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={imagePageShortcuts}
        description="Keyboard and screen-reader behavior for media figures and interactive overlays."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Combine native img attributes with AspectRatio or Tailwind aspect utilities."
        notes={imagePageUsageNotes}
      />

      <APIReference
        sections={imagePageAPISections}
        description="Recommended HTML image attributes and Tailwind layout utilities."
      />

      <Changelog
        entries={imagePageChangelogEntries}
        title="Changelog"
        description="Version history for image composition patterns."
      />
    </ComponentPage>
  );
}

const fitOptions = [
  { fit: "cover", label: "Cover fit", className: "object-cover" },
  { fit: "contain", label: "Contain fit", className: "object-contain" },
  { fit: "fill", label: "Fill fit", className: "object-fill" },
] as const;

const roundedOptions = [
  { label: "None", className: "rounded-none" },
  { label: "rounded-md", className: "rounded-md" },
  { label: "rounded-lg", className: "rounded-lg" },
  { label: "rounded-xl", className: "rounded-xl" },
  { label: "rounded-full", className: "rounded-full" },
] as const;

const avatarSizeOptions = [
  { label: "xs", className: "size-12" },
  { label: "sm", className: "size-16" },
  { label: "md", className: "size-20" },
  { label: "lg", className: "size-24" },
] as const;

const imagePageFeatures = [
  {
    title: "Layout-Shift Free",
    description:
      "Lock aspect ratios with AspectRatio or aspect-* utilities so media never jumps during load.",
  },
  {
    title: "Loading & Error States",
    description:
      "Pair Skeleton, Spinner, and labelled fallback frames for slow or broken network loads.",
  },
  {
    title: "Accessible Semantics",
    description:
      "Uses figure, figcaption, descriptive alt text, and theme-safe overlay scrims.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const imagePageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Object Fit Modes"
        description="Compare object-cover, object-contain, and object-fill inside a 16:9 frame."
        code={basicImageCode}
      >
        <BasicImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "rounded",
    label: "Rounded",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Border Radius"
        description="Clipped corners from sharp edges to circular frames."
        code={roundedImageCode}
      >
        <RoundedImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "caption",
    label: "With Caption",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Figure & Caption"
        description="Semantic figure and figcaption inside a Card."
        code={withCaptionCode}
      >
        <WithCaptionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "responsive",
    label: "Responsive",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Responsive Grids"
        description="Full-width 16:9 banners paired with 1:1 grid tiles."
        code={responsiveImageCode}
      >
        <ResponsiveImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "avatar",
    label: "Avatar",
    group: "Patterns",
    demo: (
      <DemoWrapper
        title="Circular Portraits"
        description="Consistent portrait crops across four sizes. Use Avatar when you need initials or status indicators."
        code={avatarImageCode}
      >
        <AvatarImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "overlay",
    label: "Overlay",
    group: "Patterns",
    demo: (
      <DemoWrapper
        title="Gradient Overlay"
        description="Theme-aware scrim keeps foreground text and badges readable over photography."
        code={overlayImageCode}
      >
        <OverlayImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "loading",
    label: "Loading States",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Loading & Error States"
        description="Spinner, skeleton placeholder, and labelled fallback for unavailable media."
        code={loadingImageCode}
      >
        <LoadingImageDemo />
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
        description="Missing source fallback, long unbroken caption truncation, and disabled download action in a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const imagePageShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    group: "Interactive media",
    description:
      "Native img elements are not tab stops; focus moves only to interactive links or buttons paired with the image.",
  },
  {
    keys: "Enter / Space",
    group: "Interactive media",
    description: "Activate focused overlay buttons or media links.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const imagePageUsageNotes = [
  {
    label: "AspectRatio vs Avatar",
    body: "Use AspectRatio for responsive cards and media embeds; reach for Avatar when rendering user profiles with initials fallbacks or presence badges.",
  },
  {
    label: "Decorative images",
    body: 'Pass alt="" on purely decorative imagery so screen readers skip it; provide concise descriptive alt text for informative photos.',
  },
] satisfies NonNullable<ReactComponentProps<typeof UsageBlock>["notes"]>;

const imagePageAPISections = [
  {
    title: "HTML <img> Attributes",
    props: [
      {
        prop: "src",
        type: "string",
        default: "required",
        description: "Image source URL or imported asset path.",
      },
      {
        prop: "alt",
        type: "string",
        default: "required",
        description:
          'Accessible text alternative. Use empty string ("") for purely decorative images.',
      },
      {
        prop: "loading",
        type: '"lazy" | "eager"',
        default: '"eager"',
        description: "Defer off-screen image fetches with lazy loading.",
      },
      {
        prop: "decoding",
        type: '"async" | "sync" | "auto"',
        default: '"auto"',
        description:
          "Hint to decode off the main thread for smoother scrolling.",
      },
      {
        prop: "width / height",
        type: "number",
        default: "-",
        description:
          "Intrinsic dimensions that reserve layout space before decode.",
      },
    ],
  },
  {
    title: "Tailwind Media Utilities",
    props: [
      {
        prop: "object-cover / object-contain / object-fill",
        type: "class",
        default: "-",
        description: "Control how the image fits its container box.",
      },
      {
        prop: "aspect-video / aspect-square",
        type: "class",
        default: "-",
        description: "Reserve 16:9 or 1:1 proportions on the wrapper.",
      },
      {
        prop: "rounded-lg / rounded-full",
        type: "class",
        default: "-",
        description: "Clip corners consistently with overflow-hidden.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const imagePageChangelogEntries = [
  {
    version: "1.0.0",
    date: "26 November 2026",
    changes: [
      {
        type: "added",
        title: "Image composition guide",
        description:
          "Documented responsive aspect-ratio framing, semantic figure captions, theme-safe overlays, loading/error states, and narrow-container stress cases.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
