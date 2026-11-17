import { IconPhoto } from "@tabler/icons-react";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  UsageBlock,
  APIReference,
  KeyboardShortcuts,
} from "@/components/docs";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

const imageStyles = {
  aspectRatio: "aspect-video",
  rounded: "rounded-lg",
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
};

function BasicImageDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="w-48 space-y-2">
        <div
          className={cn(
            "overflow-hidden rounded-lg border",
            imageStyles.aspectRatio,
          )}
        >
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
            alt="Mountain landscape"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">Cover fit</p>
      </div>

      <div className="w-48 space-y-2">
        <div
          className={cn(
            "overflow-hidden rounded-lg border bg-muted",
            imageStyles.aspectRatio,
          )}
        >
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
            alt="Mountain landscape"
            className="h-full w-full object-contain"
          />
        </div>
        <p className="text-xs text-muted-foreground">Contain fit</p>
      </div>

      <div className="w-48 space-y-2">
        <div
          className={cn(
            "overflow-hidden rounded-lg border",
            imageStyles.aspectRatio,
          )}
        >
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
            alt="Mountain landscape"
            className="h-full w-full object-fill"
          />
        </div>
        <p className="text-xs text-muted-foreground">Fill fit</p>
      </div>
    </div>
  );
}

const basicImageCode = `import { cn } from "@/lib/utils"

export function BasicImageDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="w-48 space-y-2">
        <div className={cn("overflow-hidden rounded-lg border aspect-video")}>
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
            alt="Mountain landscape"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">Cover fit</p>
      </div>

      <div className="w-48 space-y-2">
        <div className={cn("overflow-hidden rounded-lg border bg-muted aspect-video")}>
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop"
            alt="Mountain landscape"
            className="h-full w-full object-contain"
          />
        </div>
        <p className="text-xs text-muted-foreground">Contain fit</p>
      </div>
    </div>
  )
}`;

function RoundedImageDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="space-y-2">
        <div className="w-32 h-32 overflow-hidden rounded-none border">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
            alt="Portrait"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">None</p>
      </div>

      <div className="space-y-2">
        <div className="w-32 h-32 overflow-hidden rounded-md border">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
            alt="Portrait"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">Rounded-md</p>
      </div>

      <div className="space-y-2">
        <div className="w-32 h-32 overflow-hidden rounded-lg border">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
            alt="Portrait"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">Rounded-lg</p>
      </div>

      <div className="space-y-2">
        <div className="w-32 h-32 overflow-hidden rounded-xl border">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
            alt="Portrait"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">Rounded-xl</p>
      </div>

      <div className="space-y-2">
        <div className="w-32 h-32 overflow-hidden rounded-full border">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
            alt="Portrait"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">Rounded-full</p>
      </div>
    </div>
  );
}

const roundedImageCode = `export function RoundedImageDemo() {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <div className="space-y-2">
        <div className="w-32 h-32 overflow-hidden rounded-none border">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
            alt="Portrait"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">None</p>
      </div>

      <div className="space-y-2">
        <div className="w-32 h-32 overflow-hidden rounded-full border">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop"
            alt="Portrait"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">Rounded-full</p>
      </div>
    </div>
  )
}`;

function WithCaptionDemo() {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
          alt="Nature landscape"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">Mountain Sunrise</h3>
        <p className="text-sm text-muted-foreground">
          A beautiful sunrise over the mountains, captured at dawn.
        </p>
      </div>
    </Card>
  );
}

const withCaptionCode = `import { Card } from "@/components/ui/card"

export function WithCaptionDemo() {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop"
          alt="Nature landscape"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold">Mountain Sunrise</h3>
        <p className="text-sm text-muted-foreground">
          A beautiful sunrise over the mountains, captured at dawn.
        </p>
      </div>
    </Card>
  )
}`;

function LoadingImageDemo() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="w-64 aspect-video overflow-hidden rounded-lg border">
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Spinner size="sm" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Loading state</p>
      </div>

      <div className="space-y-2">
        <div className="w-64 aspect-video overflow-hidden rounded-lg border">
          <Skeleton className="h-full w-full" />
        </div>
        <p className="text-xs text-muted-foreground">Skeleton state</p>
      </div>

      <div className="space-y-2">
        <div className="w-64 aspect-video overflow-hidden rounded-lg border bg-muted flex items-center justify-center">
          <IconPhoto className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-xs text-muted-foreground">Error state</p>
      </div>
    </div>
  );
}

const loadingImageCode = `import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import { Image as ImageIcon } from "@tabler/icons-react"

export function LoadingImageDemo() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="w-64 aspect-video overflow-hidden rounded-lg border">
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <Spinner size="sm" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">Loading state</p>
      </div>

      <div className="space-y-2">
        <div className="w-64 aspect-video overflow-hidden rounded-lg border">
          <Skeleton className="h-full w-full" />
        </div>
        <p className="text-xs text-muted-foreground">Skeleton state</p>
      </div>
    </div>
  )
}`;

function ResponsiveImageDemo() {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop"
            alt="Alpine peaks beneath a cloudy sky"
            className="h-full w-full object-cover"
          />
        </div>
      </Card>
      <p className="text-xs text-muted-foreground">
        Full width responsive image
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Card className="overflow-hidden">
          <div className="aspect-square w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=600&fit=crop"
              alt="Alpine peaks beneath a cloudy sky"
              className="h-full w-full object-cover"
            />
          </div>
        </Card>
        <Card className="overflow-hidden">
          <div className="aspect-square w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=600&fit=crop"
              alt="Alpine peaks beneath a cloudy sky"
              className="h-full w-full object-cover"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

const responsiveImageCode = `import { Card } from "@/components/ui/card"

export function ResponsiveImageDemo() {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop"
            alt="Alpine peaks beneath a cloudy sky"
            className="h-full w-full object-cover"
          />
        </div>
      </Card>
    </div>
  )
}`;

function AvatarImageDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="space-y-2">
        <div className="w-12 h-12 overflow-hidden rounded-full border">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">xs</p>
      </div>

      <div className="space-y-2">
        <div className="w-16 h-16 overflow-hidden rounded-full border">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">sm</p>
      </div>

      <div className="space-y-2">
        <div className="w-20 h-20 overflow-hidden rounded-full border">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">md</p>
      </div>

      <div className="space-y-2">
        <div className="w-24 h-24 overflow-hidden rounded-full border">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">lg</p>
      </div>
    </div>
  );
}

const avatarImageCode = `export function AvatarImageDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="space-y-2">
        <div className="w-12 h-12 overflow-hidden rounded-full border">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">xs</p>
      </div>

      <div className="space-y-2">
        <div className="w-20 h-20 overflow-hidden rounded-full border">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="text-xs text-muted-foreground">md</p>
      </div>
    </div>
  )
}`;

function OverlayImageDemo() {
  return (
    <Card className="overflow-hidden p-4">
      <div className="relative h-64 w-full overflow-hidden rounded-lg">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
          alt="Alpine peaks beneath a cloudy sky"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-semibold">Beautiful Mountain</h3>
          <p className="text-sm opacity-90">Explore nature's beauty</p>
        </div>
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/90 text-black">
            Featured
          </Badge>
        </div>
      </div>
    </Card>
  );
}

const overlayImageCode = `import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function OverlayImageDemo() {
  return (
    <Card className="overflow-hidden p-4">
      <div className="relative h-64 w-full overflow-hidden rounded-lg">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop"
          alt="Image with overlay"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-lg font-semibold">Beautiful Mountain</h3>
          <p className="text-sm opacity-90">Explore nature's beauty</p>
        </div>
      </div>
    </Card>
  )
}`;

const features = [
  {
    title: "Responsive",
    description:
      "Images scale gracefully with aspect ratio utilities and flexible widths.",
  },
  {
    title: "Loading States",
    description: "Built-in skeleton and loading spinner support for better UX.",
  },
  {
    title: "Accessible",
    description: "Proper alt text and ARIA attributes for screen readers.",
  },
];

const keyboardShortcuts = [
  { keys: "Tab", description: "Navigate through interactive elements" },
  { keys: "Shift + Tab", description: "Navigate backwards" },
  { keys: "Enter", description: "Activate focused links" },
];

const apiSections = [
  {
    title: "Image HTML Attributes",
    props: [
      {
        prop: "src",
        type: "string",
        default: "required",
        description: "Image source URL or path.",
      },
      {
        prop: "alt",
        type: "string",
        default: "required",
        description: "Alternative text for accessibility.",
      },
      {
        prop: "loading",
        type: "'lazy' | 'eager'",
        default: "'eager'",
        description: "Native lazy loading behavior.",
      },
      {
        prop: "width",
        type: "number",
        default: "undefined",
        description: "Image width in pixels.",
      },
      {
        prop: "height",
        type: "number",
        default: "undefined",
        description: "Image height in pixels.",
      },
      {
        prop: "decoding",
        type: "'async' | 'sync' | 'auto'",
        default: "'auto'",
        description: "Image decoding hint for browser.",
      },
    ],
  },
  {
    title: "Tailwind Utilities",
    props: [
      {
        prop: "object-cover",
        type: "class",
        default: "-",
        description: "Cover the container while maintaining aspect ratio.",
      },
      {
        prop: "object-contain",
        type: "class",
        default: "-",
        description: "Fit within container while maintaining aspect ratio.",
      },
      {
        prop: "object-fill",
        type: "class",
        default: "-",
        description: "Stretch to fill the container completely.",
      },
      {
        prop: "aspect-video",
        type: "class",
        default: "-",
        description: "16:9 aspect ratio.",
      },
      {
        prop: "aspect-square",
        type: "class",
        default: "-",
        description: "1:1 aspect ratio.",
      },
      {
        prop: "rounded-lg",
        type: "class",
        default: "-",
        description: "Large rounded corners.",
      },
      {
        prop: "rounded-full",
        type: "class",
        default: "-",
        description: "Fully rounded (circular).",
      },
    ],
  },
];

export default function ImagePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Image"
        description="Responsive image component with loading states, aspect ratios, and various styling options for displaying visual content."
        version="1.0"
      />

      <FeatureGrid features={features} />

      <DemoTabs defaultValue="basic" tabs={imagePageDemoTabsTabs} />

      <UsageBlock
        code={basicImageCode}
        title="Usage"
        description="Use img tag with object-fit and aspect ratio utilities."
      />

      <KeyboardShortcuts
        shortcuts={keyboardShortcuts}
        title="Accessibility"
        description="Keyboard navigation for screen readers"
      />

      <APIReference
        sections={apiSections}
        title="API Reference"
        description="HTML attributes and Tailwind utilities for images"
      />
    </ComponentPage>
  );
}

const imagePageDemoTabsTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper
        title="Basic Images"
        description="Images with different object-fit values."
        code={basicImageCode}
      >
        <BasicImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "rounded",
    label: "Rounded",
    demo: (
      <DemoWrapper
        title="Rounded Images"
        description="Images with different border radius values."
        code={roundedImageCode}
      >
        <RoundedImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "caption",
    label: "With Caption",
    demo: (
      <DemoWrapper
        title="Image with Caption"
        description="Image displayed with caption in a card."
        code={withCaptionCode}
      >
        <WithCaptionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "loading",
    label: "Loading States",
    demo: (
      <DemoWrapper
        title="Loading States"
        description="Images with loading and error states."
        code={loadingImageCode}
      >
        <LoadingImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "responsive",
    label: "Responsive",
    demo: (
      <DemoWrapper
        title="Responsive Images"
        description="Images that adapt to container width."
        code={responsiveImageCode}
      >
        <ResponsiveImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "avatar",
    label: "Avatar",
    demo: (
      <DemoWrapper
        title="Avatar Images"
        description="Circular avatar images in different sizes."
        code={avatarImageCode}
      >
        <AvatarImageDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "overlay",
    label: "Overlay",
    demo: (
      <DemoWrapper
        title="Image with Overlay"
        description="Image with gradient overlay and text."
        code={overlayImageCode}
      >
        <OverlayImageDemo />
      </DemoWrapper>
    ),
  },
] satisfies React.ComponentProps<typeof DemoTabs>["tabs"];
