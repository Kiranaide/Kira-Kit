import { useState } from "react";
import {
  AspectRatio,
  ResponsiveAspectRatio,
  AspectRatioImage,
  KiraAspectRatio,
} from "@/components/ui/aspect-ratio";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  UsageBlock,
  APIReference,
} from "@/components/docs";

const presetRatiosCode = `import { AspectRatio } from "@/components/ui/aspect-ratio"

<div className="grid gap-6 md:grid-cols-4">
  <div>
    <p className="text-sm text-muted-foreground mb-2">16:9 (Video)</p>
    <AspectRatio ratio="16:9" className="bg-muted rounded-lg overflow-hidden">
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        16:9
      </div>
    </AspectRatio>
  </div>
  <div>
    <p className="text-sm text-muted-foreground mb-2">4:3 (Photo)</p>
    <AspectRatio ratio="4:3" className="bg-muted rounded-lg overflow-hidden">
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        4:3
      </div>
    </AspectRatio>
  </div>
  <div>
    <p className="text-sm text-muted-foreground mb-2">1:1 (Square)</p>
    <AspectRatio ratio="1:1" className="bg-muted rounded-lg overflow-hidden">
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        1:1
      </div>
    </AspectRatio>
  </div>
  <div>
    <p className="text-sm text-muted-foreground mb-2">9:16 (Story)</p>
    <AspectRatio ratio="9:16" className="bg-muted rounded-lg overflow-hidden">
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        9:16
      </div>
    </AspectRatio>
  </div>
  <div>
    <p className="text-sm text-muted-foreground mb-2">21:9 (Ultrawide)</p>
    <AspectRatio ratio="21:9" className="bg-muted rounded-lg overflow-hidden">
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        21:9
      </div>
    </AspectRatio>
  </div>
  <div>
    <p className="text-sm text-muted-foreground mb-2">3:2 (Classic)</p>
    <AspectRatio ratio="3:2" className="bg-muted rounded-lg overflow-hidden">
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        3:2
      </div>
    </AspectRatio>
  </div>
  <div>
    <p className="text-sm text-muted-foreground mb-2">3:4 (Portrait)</p>
    <AspectRatio ratio="3:4" className="bg-muted rounded-lg overflow-hidden">
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        3:4
      </div>
    </AspectRatio>
  </div>
  <div>
    <p className="text-sm text-muted-foreground mb-2">2:3 (Portrait)</p>
    <AspectRatio ratio="2:3" className="bg-muted rounded-lg overflow-hidden">
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        2:3
      </div>
    </AspectRatio>
  </div>
</div>`;

function PresetRatiosDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">16:9 (Video)</p>
        <AspectRatio
          ratio="16:9"
          className="bg-muted rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            16:9
          </div>
        </AspectRatio>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">4:3 (Photo)</p>
        <AspectRatio
          ratio="4:3"
          className="bg-muted rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            4:3
          </div>
        </AspectRatio>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">1:1 (Square)</p>
        <AspectRatio
          ratio="1:1"
          className="bg-muted rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            1:1
          </div>
        </AspectRatio>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">9:16 (Story)</p>
        <AspectRatio
          ratio="9:16"
          className="bg-muted rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            9:16
          </div>
        </AspectRatio>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">21:9 (Ultrawide)</p>
        <AspectRatio
          ratio="21:9"
          className="bg-muted rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            21:9
          </div>
        </AspectRatio>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">3:2 (Classic)</p>
        <AspectRatio
          ratio="3:2"
          className="bg-muted rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            3:2
          </div>
        </AspectRatio>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">3:4 (Portrait)</p>
        <AspectRatio
          ratio="3:4"
          className="bg-muted rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            3:4
          </div>
        </AspectRatio>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">2:3 (Portrait)</p>
        <AspectRatio
          ratio="2:3"
          className="bg-muted rounded-lg overflow-hidden"
        >
          <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
            2:3
          </div>
        </AspectRatio>
      </div>
    </div>
  );
}

const withImageCode = `import { AspectRatio } from "@/components/ui/aspect-ratio"

<div className="grid gap-4 md:grid-cols-2">
  <div>
    <p className="text-sm text-muted-foreground mb-2">Cover (default)</p>
    <AspectRatio ratio="16:9">
      <img
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Sunset landscape"
        className="w-full h-full object-cover rounded-lg"
      />
    </AspectRatio>
  </div>
  <div>
    <p className="text-sm text-muted-foreground mb-2">Contain</p>
    <AspectRatio ratio="16:9" fit="contain" className="bg-muted rounded-lg">
      <img
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
        alt="Sunset landscape"
        className="w-full h-full object-contain rounded-lg"
      />
    </AspectRatio>
  </div>
</div>`;

function WithImageDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Cover (default)</p>
        <AspectRatio ratio="16:9">
          <img
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            alt="Sunset landscape"
            className="w-full h-full object-cover rounded-lg"
          />
        </AspectRatio>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Contain</p>
        <AspectRatio ratio="16:9" fit="contain" className="bg-muted rounded-lg">
          <img
            src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
            alt="Sunset landscape"
            className="w-full h-full object-contain rounded-lg"
          />
        </AspectRatio>
      </div>
    </div>
  );
}

const loadingStateCode = `import { AspectRatio } from "@/components/ui/aspect-ratio"

<div className="grid gap-4 md:grid-cols-3">
  <AspectRatio ratio="16:9" loading>
    <img
      src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
      alt="Loading example"
      className="w-full h-full object-cover rounded-lg"
    />
  </AspectRatio>
  <AspectRatio ratio="1:1" loading>
    <img
      src="https://github.com/shadcn.png"
      alt="Loading example"
      className="w-full h-full object-cover rounded-lg"
    />
  </AspectRatio>
  <AspectRatio ratio="9:16" loading>
    <img
      src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=700&dpr=2&q=80"
      alt="Loading example"
      className="w-full h-full object-cover rounded-lg"
    />
  </AspectRatio>
</div>`;

function LoadingStateDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <AspectRatio ratio="16:9" loading>
        <img
          src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
          alt="Loading example"
          className="w-full h-full object-cover rounded-lg"
        />
      </AspectRatio>
      <AspectRatio ratio="1:1" loading>
        <img
          src="https://github.com/shadcn.png"
          alt="Loading example"
          className="w-full h-full object-cover rounded-lg"
        />
      </AspectRatio>
      <AspectRatio ratio="9:16" loading>
        <img
          src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=400&h=700&dpr=2&q=80"
          alt="Loading example"
          className="w-full h-full object-cover rounded-lg"
        />
      </AspectRatio>
    </div>
  );
}

const contentPositionCode = `import { AspectRatio } from "@/components/ui/aspect-ratio"

<div className="grid gap-4 md:grid-cols-4">
  <AspectRatio ratio="4:3" position="center" className="bg-muted rounded-lg overflow-hidden">
    <div className="bg-primary text-primary-foreground p-2 rounded text-xs w-16 h-16">
      Center
    </div>
  </AspectRatio>
  <AspectRatio ratio="4:3" position="top" className="bg-muted rounded-lg overflow-hidden">
    <div className="bg-primary text-primary-foreground p-2 rounded text-xs w-16 h-16">
      Top
    </div>
  </AspectRatio>
  <AspectRatio ratio="4:3" position="bottom-left" className="bg-muted rounded-lg overflow-hidden">
    <div className="bg-primary text-primary-foreground p-2 rounded text-xs w-16 h-16">
      Bottom Left
    </div>
  </AspectRatio>
  <AspectRatio ratio="4:3" position="bottom-right" className="bg-muted rounded-lg overflow-hidden">
    <div className="bg-primary text-primary-foreground p-2 rounded text-xs w-16 h-16">
      Bottom Right
    </div>
  </AspectRatio>
</div>`;

function ContentPositionDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <AspectRatio
        ratio="4:3"
        position="center"
        className="bg-muted rounded-lg overflow-hidden"
      >
        <div className="bg-primary text-primary-foreground p-2 rounded text-xs w-16 h-16">
          Center
        </div>
      </AspectRatio>
      <AspectRatio
        ratio="4:3"
        position="top"
        className="bg-muted rounded-lg overflow-hidden"
      >
        <div className="bg-primary text-primary-foreground p-2 rounded text-xs w-16 h-16">
          Top
        </div>
      </AspectRatio>
      <AspectRatio
        ratio="4:3"
        position="bottom-left"
        className="bg-muted rounded-lg overflow-hidden"
      >
        <div className="bg-primary text-primary-foreground p-2 rounded text-xs w-16 h-16">
          Bottom Left
        </div>
      </AspectRatio>
      <AspectRatio
        ratio="4:3"
        position="bottom-right"
        className="bg-muted rounded-lg overflow-hidden"
      >
        <div className="bg-primary text-primary-foreground p-2 rounded text-xs w-16 h-16">
          Bottom Right
        </div>
      </AspectRatio>
    </div>
  );
}

const withVideoCode = `import { AspectRatio } from "@/components/ui/aspect-ratio"

<div className="max-w-xl">
  <AspectRatio ratio="16:9">
    <iframe
      src="https://www.youtube.com/embed/dQw4w9WgXcQ"
      title="YouTube video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="w-full h-full rounded-lg"
    />
  </AspectRatio>
</div>`;

function WithVideoDemo() {
  return (
    <div className="max-w-xl">
      <AspectRatio ratio="16:9">
        <iframe
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full rounded-lg"
        />
      </AspectRatio>
    </div>
  );
}

// =============================================================================
// Blur-up image loading
// =============================================================================
const blurUpCode = `import { AspectRatio, AspectRatioImage } from "@/components/ui/aspect-ratio"

<AspectRatio ratio="16:9" className="rounded-lg">
  <AspectRatioImage
    src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=1200&q=80"
    alt="Sunset landscape"
  />
</AspectRatio>`;

function BlurUpDemo() {
  const [key, setKey] = useState(0);

  return (
    <div className="space-y-3 max-w-md">
      <AspectRatio ratio="16:9" className="rounded-lg bg-muted">
        <AspectRatioImage
          key={key}
          src={`https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=1200&q=80&sig=${key}`}
          alt="Sunset landscape"
        />
      </AspectRatio>
      <button
        onClick={() => setKey((k) => k + 1)}
        className="text-sm text-primary underline underline-offset-4"
      >
        Reload image
      </button>
      <p className="text-xs text-muted-foreground">
        The image fades and un-blurs once decoded. Snaps instantly under reduced motion.
      </p>
    </div>
  );
}

// =============================================================================
// Zoom on hover
// =============================================================================
const zoomCode = `import { AspectRatio } from "@/components/ui/aspect-ratio"

<AspectRatio ratio="4:3" zoomOnHover className="rounded-lg">
  <img src="..." alt="Product" />
</AspectRatio>`;

function ZoomDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
      <AspectRatio ratio="4:3" zoomOnHover className="rounded-lg">
        <img
          src="https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80"
          alt="Product"
        />
      </AspectRatio>
      <AspectRatio ratio="4:3" zoomOnHover className="rounded-lg">
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"
          alt="Product"
        />
      </AspectRatio>
    </div>
  );
}

// =============================================================================
// Responsive (breakpoint) ratios
// =============================================================================
const responsiveCode = `import { ResponsiveAspectRatio } from "@/components/ui/aspect-ratio"

// Portrait on mobile, widescreen on desktop
<ResponsiveAspectRatio base="1:1" md="4:3" lg="16:9" className="rounded-lg">
  <img src="..." alt="Responsive" />
</ResponsiveAspectRatio>`;

function ResponsiveDemo() {
  return (
    <div className="space-y-3 max-w-2xl">
      <ResponsiveAspectRatio
        base="1:1"
        md="4:3"
        lg="16:9"
        className="rounded-lg bg-muted"
      >
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80"
          alt="Responsive landscape"
        />
      </ResponsiveAspectRatio>
      <p className="text-xs text-muted-foreground">
        Resize the window: 1:1 on mobile → 4:3 at md → 16:9 at lg. Static
        Tailwind breakpoint classes (no broken CSS attr()).
      </p>
    </div>
  );
}

// =============================================================================
// KiraAspectRatio (prop-driven)
// =============================================================================
const kiraCode = `import { KiraAspectRatio } from "@/components/ui/aspect-ratio"

// Image with blur-up
<KiraAspectRatio type="image" ratio="16:9" src="..." alt="Photo" className="rounded-lg" />

// Video embed
<KiraAspectRatio type="embed" ratio="16:9" src="https://www.youtube.com/embed/…" alt="Video" />`;

function KiraDemo() {
  return (
    <div className="grid gap-4 md:grid-cols-2 max-w-3xl">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">type=&quot;image&quot;</p>
        <KiraAspectRatio
          type="image"
          ratio="16:9"
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80"
          alt="Forest"
          zoomOnHover
          className="rounded-lg bg-muted"
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">type=&quot;embed&quot;</p>
        <KiraAspectRatio
          type="embed"
          ratio="16:9"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          alt="YouTube video"
          className="rounded-lg"
          embedProps={{
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true,
          }}
        />
      </div>
    </div>
  );
}

export default function AspectRatioPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Aspect Ratio"
        description="Maintains a consistent width-to-height ratio for responsive media."
        version="2.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Preset Ratios",
            description:
              "Built-in support for common aspect ratios like 16:9, 4:3, 1:1, 9:16, and more using string values.",
          },
          {
            title: "Loading State",
            description:
              "Built-in skeleton loading support with animated pulse effect while content loads.",
          },
          {
            title: "Content Positioning",
            description:
              "Control how content is positioned within the container with center, top, bottom, left, right options.",
          },
        ]}
      />

      <DemoTabs
        defaultValue="preset-ratios"
        tabs={[
          {
            value: "preset-ratios",
            label: "Preset Ratios",
            demo: (
              <DemoWrapper
                title="Preset Ratios"
                description="Use string values for common aspect ratios."
                code={presetRatiosCode}
              >
                <PresetRatiosDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "with-image",
            label: "With Image",
            demo: (
              <DemoWrapper
                title="With Image"
                description="Control how images fit within the aspect ratio container."
                code={withImageCode}
              >
                <WithImageDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "loading-state",
            label: "Loading State",
            demo: (
              <DemoWrapper
                title="Loading State"
                description="Show a skeleton placeholder while content loads."
                code={loadingStateCode}
              >
                <LoadingStateDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "content-position",
            label: "Content Position",
            demo: (
              <DemoWrapper
                title="Content Position"
                description="Control the position of content within the aspect ratio container."
                code={contentPositionCode}
              >
                <ContentPositionDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "with-video",
            label: "With Video",
            demo: (
              <DemoWrapper
                title="With Video"
                description="Perfect for responsive video embeds."
                code={withVideoCode}
              >
                <WithVideoDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "blur-up",
            label: "Blur-up Image",
            demo: (
              <DemoWrapper
                title="Blur-up Image"
                description="AspectRatioImage fades and un-blurs once the image decodes."
                code={blurUpCode}
              >
                <BlurUpDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "zoom",
            label: "Zoom on Hover",
            demo: (
              <DemoWrapper
                title="Zoom on Hover"
                description="Subtle scale on hover, disabled under reduced motion."
                code={zoomCode}
              >
                <ZoomDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "responsive",
            label: "Responsive",
            demo: (
              <DemoWrapper
                title="Responsive Ratios"
                description="Different ratios per breakpoint via ResponsiveAspectRatio."
                code={responsiveCode}
              >
                <ResponsiveDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "kira",
            label: "KiraAspectRatio",
            demo: (
              <DemoWrapper
                title="KiraAspectRatio"
                description="One prop-driven component for image, video, and embeds."
                code={kiraCode}
              >
                <KiraDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <UsageBlock
        title="Usage"
        description="Basic implementation examples"
        code={`import { AspectRatio } from "@/components/ui/aspect-ratio"

// Preset ratios
<AspectRatio ratio="16:9">...</AspectRatio>
<AspectRatio ratio="4:3">...</AspectRatio>
<AspectRatio ratio="1:1">...</AspectRatio>
<AspectRatio ratio="9:16">...</AspectRatio>

// Custom ratio (still supported)
<AspectRatio ratio={21 / 9}>...</AspectRatio>

// Object-fit control
<AspectRatio ratio="16:9" fit="contain">...</AspectRatio>

// Loading skeleton
<AspectRatio ratio="16:9" loading>
  <img src="..." />
</AspectRatio>

// Content position
<AspectRatio ratio="16:9" position="top-left">...</AspectRatio>`}
      />

      <APIReference
        sections={[
          {
            title: "AspectRatio",
            props: [
              {
                prop: "ratio",
                type: "number | AspectRatioPreset",
                default: '"1:1"',
                description:
                  "The aspect ratio to maintain. Can be a number or a preset string like '16:9', '4:3', '1:1', '9:16', '21:9', '3:4', '2:3', '3:2'.",
              },
              {
                prop: "fit",
                type: "'cover' | 'contain' | 'fill' | 'none' | 'scaleDown'",
                default: '"cover"',
                description:
                  "Controls how content fits within the container. Uses CSS object-fit.",
              },
              {
                prop: "position",
                type: "'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
                default: '"center"',
                description:
                  "Controls the alignment of content within the container.",
              },
              {
                prop: "loading",
                type: "boolean",
                default: "false",
                description:
                  "Shows a skeleton loading state while content loads.",
              },
              {
                prop: "skeleton",
                type: "boolean",
                default: "loading",
                description: "Explicitly control the skeleton display state.",
              },
              {
                prop: "zoomOnHover",
                type: "boolean",
                default: "false",
                description:
                  "Scale the media up slightly on hover (respects reduced motion).",
              },
            ],
          },
          {
            title: "ResponsiveAspectRatio",
            props: [
              {
                prop: "base",
                type: "number | AspectRatioPreset",
                default: "-",
                description: "The base aspect ratio for all screen sizes.",
              },
              {
                prop: "md",
                type: "number | AspectRatioPreset",
                default: "base",
                description: "Aspect ratio for medium screens (768px and up).",
              },
              {
                prop: "lg",
                type: "number | AspectRatioPreset",
                default: "md",
                description: "Aspect ratio for large screens (1024px and up).",
              },
              {
                prop: "xl",
                type: "number | AspectRatioPreset",
                default: "lg",
                description:
                  "Aspect ratio for extra large screens (1280px and up).",
              },
              {
                prop: "fit",
                type: "'cover' | 'contain' | 'fill' | 'none' | 'scaleDown'",
                default: "-",
                description: "Controls how content fits within the container.",
              },
              {
                prop: "loading",
                type: "boolean",
                default: "false",
                description:
                  "Shows a skeleton loading state while content loads.",
              },
            ],
          },
          {
            title: "AspectRatioImage",
            props: [
              {
                prop: "src",
                type: "string",
                default: "-",
                description: "Image source. Fades and un-blurs on load.",
              },
              {
                prop: "placeholderSrc",
                type: "string",
                default: "-",
                description:
                  "Optional low-res image shown blurred until the full image loads.",
              },
              {
                prop: "...props",
                type: "img attributes",
                default: "-",
                description: "All standard <img> attributes (alt, srcSet, …).",
              },
            ],
          },
          {
            title: "KiraAspectRatio",
            props: [
              {
                prop: "type",
                type: "'image' | 'video' | 'embed'",
                default: "'image'",
                description: "Which media element to render for `src`.",
              },
              {
                prop: "src",
                type: "string",
                default: "-",
                description: "Media source URL.",
              },
              {
                prop: "ratio / fit / zoomOnHover",
                type: "AspectRatio props",
                default: "-",
                description: "All AspectRatio props are forwarded.",
              },
              {
                prop: "videoProps / embedProps",
                type: "element attributes",
                default: "-",
                description:
                  "Props forwarded to the underlying <video> or <iframe>.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
