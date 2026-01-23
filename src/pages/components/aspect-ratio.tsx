import { AspectRatio } from "@/components/ui/aspect-ratio";
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

export default function AspectRatioPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Aspect Ratio"
        description="Maintains a consistent width-to-height ratio for responsive media."
        version="1.0"
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
        ]}
      />
    </ComponentPage>
  );
}
