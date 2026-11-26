import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import { IconPhoto, IconFocus2, IconDeviceMobile } from "@tabler/icons-react";

import {
  AspectRatio,
  ResponsiveAspectRatio,
  AspectRatioImage,
  KiraAspectRatio,
  type AspectRatioPreset,
} from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const artwork = "/kira-alpine-landscape.svg";
const portrait = "/kira-alpine-portrait.svg";

const preview =
  '<!doctype html><html lang="en"><body style="margin:0;font-family:system-ui;display:grid;place-items:center;min-height:100vh;color-scheme:light dark"><main><h1>Field guide preview</h1><p>This document loaded after your choice.</p><a href="#notes">Read field notes</a><p id="notes">Pack water and check the weather before the hike.</p></main></body></html>';

const presets: AspectRatioPreset[] = [
  "1:1",
  "4:3",
  "3:2",
  "16:9",
  "9:16",
  "21:9",
  "3:4",
  "2:3",
];

const focalOptions = [
  { value: 0, label: "Left peak" },
  { value: 50, label: "Center" },
  { value: 100, label: "Right peak" },
];

function BasicDemo() {
  return (
    <div className="max-w-xl space-y-3">
      <KiraAspectRatio
        src={artwork}
        alt="Illustrated alpine peaks and a field guide title"
        ratio="16:9"
        className="rounded-lg"
        imageProps={{ width: 1200, height: 680 }}
      />
      <p className="text-sm text-muted-foreground">
        Local illustration: a stable frame while the image loads.
      </p>
    </div>
  );
}

function RatiosDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {presets.map((ratio) => (
        <div key={ratio} className="space-y-2">
          <AspectRatio ratio={ratio} className="rounded-lg">
            <AspectRatioImage src={artwork} alt={`Guide crop at ${ratio}`} />
          </AspectRatio>
          <p className="text-sm tabular-nums">{ratio}</p>
        </div>
      ))}
    </div>
  );
}

function LoadingDemo() {
  const controlId = React.useId();
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="space-y-4">
      <AspectRatio
        ratio="16:9"
        loading={loading}
        className="max-w-xl rounded-lg border border-border"
      >
        <div className="flex h-full w-full flex-col justify-center gap-3 bg-background p-4">
          <label htmlFor={controlId} className="space-y-2 text-sm">
            <span className="block">Guide title</span>
            <Input
              id={controlId}
              aria-label="Retained guide title"
              defaultValue="Weekend alpine guide"
            />
          </label>
          <p className="text-xs text-muted-foreground">
            The input stays mounted during reload.
          </p>
        </div>
      </AspectRatio>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setLoading((value) => !value)}
      >
        {loading ? "Finish reload" : "Start reload"}
      </Button>
    </div>
  );
}

function ResponsiveDemo() {
  return (
    <div className="space-y-3">
      <ResponsiveAspectRatio
        base={2 / 3}
        md={1.7}
        lg={2.5}
        xl={3}
        className="rounded-lg"
      >
        <AspectRatioImage src={artwork} alt="A numeric responsive crop" />
      </ResponsiveAspectRatio>
      <p className="text-sm text-muted-foreground">
        Numeric ratios: 2/3 at base, 1.7 at md, 2.5 at lg, and 3 at xl.
      </p>
    </div>
  );
}

function ContainerDemo() {
  const [wide, setWide] = React.useState(false);

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        size="sm"
        aria-pressed={wide}
        onClick={() => setWide((value) => !value)}
      >
        {wide ? "Use compact card" : "Use wide article"}
      </Button>
      <div className={wide ? "w-full" : "w-64 max-w-full"}>
        <ResponsiveAspectRatio
          query="container"
          base="1:1"
          md="16:9"
          className="rounded-lg"
        >
          <AspectRatioImage src={artwork} alt="Cover adapting to card width" />
        </ResponsiveAspectRatio>
      </div>
      <p className="text-sm text-muted-foreground">
        The crop follows the card width while the page viewport stays unchanged.
      </p>
    </div>
  );
}

function KiraDemo() {
  const [selected, setSelected] = React.useState(false);

  return (
    <div className="space-y-4">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setSelected((value) => !value)}
      >
        {selected ? "Remove cover" : "Select cover"}
      </Button>
      <KiraAspectRatio
        src={selected ? artwork : undefined}
        alt="Selected field guide cover"
        ratio="16:9"
        emptyMessage="Select a cover for your guide."
        className="max-w-xl rounded-lg"
      />
    </div>
  );
}

function RecoveryDemo() {
  const [broken, setBroken] = React.useState(true);

  return (
    <div className="space-y-4">
      <KiraAspectRatio
        src={broken ? "data:image/png;base64,broken" : artwork}
        alt="Alpine field guide"
        ratio="16:9"
        className="max-w-xl rounded-lg"
        errorMessage="The field guide image is unavailable."
        onRetry={async () => {
          await new Promise<void>((resolve) => {
            window.setTimeout(resolve, 300);
          });
          setBroken(false);
        }}
      />
      <Button variant="outline" size="sm" onClick={() => setBroken(true)}>
        Reset broken source
      </Button>
    </div>
  );
}

function FocalDemo() {
  const [x, setX] = React.useState(50);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {focalOptions.map((option) => (
          <Button
            key={option.value}
            size="sm"
            variant="outline"
            aria-pressed={x === option.value}
            onClick={() => setX(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
      <KiraAspectRatio
        src={artwork}
        alt="A focal crop of the alpine guide"
        ratio="1:1"
        focalPoint={{ x, y: 50 }}
        className="max-w-sm rounded-lg"
      />
    </div>
  );
}

function ArtDirectionDemo() {
  return (
    <div className="space-y-3">
      <KiraAspectRatio
        src={artwork}
        sources={[{ media: "(max-width: 639px)", srcSet: portrait }]}
        alt="Alpine guide with a separate mobile illustration"
        responsive={{ base: "2:3", sm: "16:9" }}
        className="rounded-lg"
      />
      <p className="text-sm text-muted-foreground">
        A portrait resource below 640px and landscape above it. Both are local
        illustrations.
      </p>
    </div>
  );
}

function EmbedDemo() {
  const [version, setVersion] = React.useState(0);

  return (
    <div className="space-y-4">
      <KiraAspectRatio
        key={version}
        type="embed"
        alt="Field guide preview"
        ratio="16:9"
        posterSrc={artwork}
        className="max-w-xl rounded-lg"
        activateLabel="Open guide preview"
        embedProps={{
          srcDoc: preview,
          title: "Field guide preview",
          sandbox: "allow-scripts",
        }}
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() => setVersion((value) => value + 1)}
      >
        Reset preview
      </Button>
    </div>
  );
}

function StressDemo() {
  return (
    <div className="w-full max-w-xs space-y-4">
      <KiraAspectRatio
        ratio={Number.NaN}
        emptyMessage="An invalid ratio safely falls back to a square frame."
        className="rounded-lg"
      />
      <KiraAspectRatio
        src="data:image/png;base64,broken"
        alt="International alpine expedition-日本語-ภาษาไทย-العربية"
        errorMessage="Unable to load international-alpine-expedition-preview-asset.svg in this narrow frame."
        ratio="16:9"
        className="rounded-lg"
      />
      <AspectRatio ratio="16:9" fit="contain" className="rounded-lg bg-muted">
        <AspectRatioImage src={portrait} alt="A contained portrait image" />
      </AspectRatio>
      <AspectRatio
        ratio="16:9"
        position="bottom-right"
        className="rounded-lg bg-muted"
      >
        <span className="p-3 text-sm">Bottom-right content</span>
      </AspectRatio>
      <Button variant="outline" size="sm" disabled>
        Replace cover (read-only)
      </Button>
    </div>
  );
}

const basicCode = `import { KiraAspectRatio } from "@/components/ui/aspect-ratio"

const source = "/kira-alpine-landscape.svg"

export function GuideCover() {
  return (
    <KiraAspectRatio
      src={source}
      alt="Illustrated alpine peaks and a field guide title"
      ratio="16:9"
      className="rounded-lg"
      imageProps={{ width: 1200, height: 680 }}
    />
  )
}`;

const ratiosCode = `import {
  AspectRatio,
  AspectRatioImage,
  type AspectRatioPreset,
} from "@/components/ui/aspect-ratio"

const source = "/kira-alpine-landscape.svg"
const ratios: AspectRatioPreset[] = [
  "1:1",
  "4:3",
  "3:2",
  "16:9",
  "9:16",
  "21:9",
  "3:4",
  "2:3",
]

export function GuideCrops() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ratios.map((ratio) => (
        <AspectRatio key={ratio} ratio={ratio} className="rounded-lg">
          <AspectRatioImage src={source} alt={\`Guide crop at \${ratio}\`} />
        </AspectRatio>
      ))}
    </div>
  )
}`;

const loadingCode = `import * as React from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function RetainedDraft() {
  const [loading, setLoading] = React.useState(false)

  return (
    <div className="space-y-4">
      <AspectRatio ratio="16:9" loading={loading}>
        <label>
          Guide title{" "}
          <Input aria-label="Guide title" defaultValue="Weekend alpine guide" />
        </label>
      </AspectRatio>
      <Button onClick={() => setLoading((value) => !value)}>
        {loading ? "Finish reload" : "Start reload"}
      </Button>
    </div>
  )
}`;

const responsiveCode = `import { ResponsiveAspectRatio, AspectRatioImage } from "@/components/ui/aspect-ratio"

const source = "/kira-alpine-landscape.svg"

export function ResponsiveCover() {
  return (
    <ResponsiveAspectRatio base={2 / 3} md={1.7} lg={2.5} xl={3}>
      <AspectRatioImage src={source} alt="A numeric responsive crop" />
    </ResponsiveAspectRatio>
  )
}`;

const containerCode = `import * as React from "react"
import { ResponsiveAspectRatio, AspectRatioImage } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"

const source = "/kira-alpine-landscape.svg"

export function LocalCover() {
  const [wide, setWide] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button aria-pressed={wide} onClick={() => setWide((value) => !value)}>
        {wide ? "Use compact card" : "Use wide article"}
      </Button>
      <div className={wide ? "w-full" : "w-64 max-w-full"}>
        <ResponsiveAspectRatio query="container" base="1:1" md="16:9">
          <AspectRatioImage src={source} alt="Cover adapting to card width" />
        </ResponsiveAspectRatio>
      </div>
    </div>
  )
}`;

const kiraCode = `import * as React from "react"
import { KiraAspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"

const source = "/kira-alpine-landscape.svg"

export function GuideMedia() {
  const [selected, setSelected] = React.useState(false)

  return (
    <div className="space-y-4">
      <Button onClick={() => setSelected((value) => !value)}>
        {selected ? "Remove cover" : "Select cover"}
      </Button>
      <KiraAspectRatio
        src={selected ? source : undefined}
        alt="Selected field guide cover"
        ratio="16:9"
        emptyMessage="Select a cover for your guide."
      />
    </div>
  )
}`;

const recoveryCode = `import * as React from "react"
import { KiraAspectRatio } from "@/components/ui/aspect-ratio"

const source = "/kira-alpine-landscape.svg"

export function RecoverImage() {
  const [broken, setBroken] = React.useState(true)

  return (
    <KiraAspectRatio
      src={broken ? "data:image/png;base64,broken" : source}
      alt="Alpine field guide"
      ratio="16:9"
      errorMessage="The field guide image is unavailable."
      onRetry={async () => {
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 300)
        })
        setBroken(false)
      }}
    />
  )
}`;

const focalCode = `import * as React from "react"
import { KiraAspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"

const source = "/kira-alpine-landscape.svg"

export function FocalCrop() {
  const [x, setX] = React.useState(50)

  return (
    <div className="space-y-4">
      {[0, 50, 100].map((value) => (
        <Button key={value} aria-pressed={x === value} onClick={() => setX(value)}>
          {value}%
        </Button>
      ))}
      <KiraAspectRatio
        src={source}
        alt="A focal crop of the alpine guide"
        ratio="1:1"
        focalPoint={{ x, y: 50 }}
      />
    </div>
  )
}`;

const artDirectionCode = `import { KiraAspectRatio } from "@/components/ui/aspect-ratio"

const source = "/kira-alpine-landscape.svg"

export function CampaignCover() {
  return (
    <KiraAspectRatio
      src={source}
      alt="Alpine guide with a separate mobile illustration"
      sources={[{ media: "(max-width: 639px)", srcSet: "/kira-alpine-portrait.svg" }]}
      responsive={{ base: "2:3", sm: "16:9" }}
    />
  )
}`;

const embedCode = `import { KiraAspectRatio } from "@/components/ui/aspect-ratio"

const source = "/kira-alpine-landscape.svg"
const previewDocument = "<!doctype html><html><body><h1>Field guide preview</h1></body></html>"

export function DeferredPreview() {
  return (
    <KiraAspectRatio
      type="embed"
      alt="Field guide preview"
      ratio="16:9"
      posterSrc={source}
      activateLabel="Open guide preview"
      embedProps={{
        srcDoc: previewDocument,
        title: "Field guide preview",
        sandbox: "allow-scripts",
      }}
    />
  )
}`;

const stressCode = `import { AspectRatio, AspectRatioImage, KiraAspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"

export function StressDemo() {
  return (
    <div className="w-full max-w-xs space-y-4">
      <KiraAspectRatio
        ratio={Number.NaN}
        emptyMessage="An invalid ratio safely falls back to a square frame."
        className="rounded-lg"
      />
      <KiraAspectRatio
        src="data:image/png;base64,broken"
        alt="International alpine expedition-日本語-ภาษาไทย-العربية"
        errorMessage="Unable to load international-alpine-expedition-preview-asset.svg in this narrow frame."
        ratio="16:9"
        className="rounded-lg"
      />
      <AspectRatio ratio="16:9" fit="contain" className="rounded-lg bg-muted">
        <AspectRatioImage src="/kira-alpine-portrait.svg" alt="A contained portrait image" />
      </AspectRatio>
      <AspectRatio ratio="16:9" position="bottom-right" className="rounded-lg bg-muted">
        <span className="p-3 text-sm">Bottom-right content</span>
      </AspectRatio>
      <Button variant="outline" size="sm" disabled>
        Replace cover (read-only)
      </Button>
    </div>
  )
}`;

const usageCode = `import {
  AspectRatio,
  ResponsiveAspectRatio,
  AspectRatioImage,
  AspectRatioVideo,
  AspectRatioEmbed,
  KiraAspectRatio,
} from "@/components/ui/aspect-ratio"

const source = "/kira-alpine-landscape.svg"

export function MediaParts() {
  return (
    <div className="space-y-6">
      <AspectRatio ratio="16:9">
        <AspectRatioImage src={source} alt="Alpine guide" />
      </AspectRatio>
      <ResponsiveAspectRatio base="1:1" md={16 / 9}>
        <AspectRatioImage src={source} alt="Responsive guide" />
      </ResponsiveAspectRatio>
      <AspectRatio ratio="16:9">
        <AspectRatioVideo controls poster={source} preload="none" />
      </AspectRatio>
      <AspectRatio ratio="16:9">
        <AspectRatioEmbed title="Guide preview" srcDoc="<p>Guide preview</p>" />
      </AspectRatio>
      <KiraAspectRatio
        src={source}
        alt="Guide cover"
        ratio="16:9"
        focalPoint={{ x: 70, y: 40 }}
      />
    </div>
  )
}`;

const ratioType =
  "number | '1:1' | '4:3' | '3:2' | '16:9' | '9:16' | '21:9' | '3:4' | '2:3'";

export default function AspectRatioPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Aspect Ratio"
        description="Stable media frames with responsive art direction and recoverable loading."
        version="v3.0.1"
      />

      <FeatureGrid
        features={aspectRatioPageFeatures}
        description="Responsive frames, art direction, and recoverable media states."
      />

      <DemoTabs defaultValue="basic" tabs={aspectRatioPageDemoTabs} />

      <KeyboardShortcuts
        shortcuts={aspectRatioPageShortcuts}
        description="Keyboard navigation for media activation, retry, and retained controls."
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Use KiraAspectRatio for managed media lifecycles or compose AspectRatio primitives directly."
        notes={aspectRatioPageUsageNotes}
      />

      <APIReference
        sections={aspectRatioPageAPISections}
        description="Props, types, and defaults for every exported frame, media part, and variant helper."
      />

      <Changelog
        entries={aspectRatioPageChangelogEntries}
        title="Changelog"
        description="Version history for Aspect Ratio."
      />
    </ComponentPage>
  );
}

const aspectRatioPageFeatures = [
  {
    title: "Reliable media",
    description: "Placeholders, cached images and manual recovery.",
    icon: <IconPhoto aria-hidden="true" className="size-5" />,
  },
  {
    title: "Responsive crops",
    description: "Numeric viewport or local container ratios.",
    icon: <IconDeviceMobile aria-hidden="true" className="size-5" />,
  },
  {
    title: "Art direction",
    description: "Native picture sources and bounded focal points.",
    icon: <IconFocus2 aria-hidden="true" className="size-5" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const aspectRatioPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Stable media frame"
        description="Default 16:9 frame preventing layout shift while loading."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "ratios",
    label: "Ratios",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Eight presets"
        description="Built-in preset ratios from square to ultrawide and portrait."
        code={ratiosCode}
      >
        <RatiosDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "loading",
    label: "Loading",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Retain a draft"
        description="Skeleton overlay keeps underlying interactive content mounted during reload."
        code={loadingCode}
      >
        <LoadingDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "responsive",
    label: "Responsive",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Numeric breakpoint ratios"
        description="Viewport breakpoints accept both preset strings and arbitrary numeric ratios."
        code={responsiveCode}
      >
        <ResponsiveDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "container",
    label: "Container",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Local container ratios"
        description="Container query mode adapts the frame to its parent card width."
        code={containerCode}
      >
        <ContainerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Empty & Select",
    group: "KiraAspectRatio",
    demo: (
      <DemoWrapper
        title="Guide cover workflow"
        description="Graceful empty state when no media source is selected."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "recovery",
    label: "Recovery",
    group: "KiraAspectRatio",
    demo: (
      <DemoWrapper
        title="Recover a broken image"
        description="Error state with manual retry callback and stale-request protection."
        code={recoveryCode}
      >
        <RecoveryDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "focal",
    label: "Focal Point",
    group: "KiraAspectRatio",
    demo: (
      <DemoWrapper
        title="Keep the subject visible"
        description="Clamp x/y focal coordinates to control object-position within the crop."
        code={focalCode}
      >
        <FocalDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sources",
    label: "Art Direction",
    group: "KiraAspectRatio",
    demo: (
      <DemoWrapper
        title="Separate source crops"
        description="Native picture sources paired with responsive breakpoint ratios."
        code={artDirectionCode}
      >
        <ArtDirectionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "embed",
    label: "Deferred Embeds",
    group: "KiraAspectRatio",
    demo: (
      <DemoWrapper
        title="Load after a choice"
        description="Deferred iframe activation with poster preview and focus handoff."
        code={embedCode}
      >
        <EmbedDemo />
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
        description="Invalid NaN ratio fallback, broken multilingual media, contained portrait, corner alignment, and disabled control in a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const aspectRatioPageShortcuts = [
  {
    keys: "Tab / Shift+Tab",
    group: "Navigation",
    description:
      "Reach media retry, preview activation, and native media controls.",
  },
  {
    keys: "Tab",
    group: "Navigation",
    description:
      "Activation transfers focus to the loaded iframe; Tab reaches its document controls.",
  },
  {
    keys: "Enter / Space",
    group: "Controls",
    description:
      "Activate preview or retry buttons (native controls inherited from Base UI).",
  },
  {
    keys: "Enter",
    group: "Controls",
    description:
      "Toggle reload and confirm the input draft remains intact afterward.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const aspectRatioPageUsageNotes = [
  {
    label: "KiraAspectRatio",
    body: "Use KiraAspectRatio when displaying images, videos, or deferred embeds that need built-in loading skeletons, empty/error states, retry handling, or responsive art direction.",
  },
  {
    label: "Composable primitives",
    body: "Use AspectRatio and ResponsiveAspectRatio directly when wrapping arbitrary custom layouts, interactive forms, or custom media elements.",
  },
] satisfies ReactComponentProps<typeof UsageBlock>["notes"];

const aspectRatioPageAPISections = [
  {
    title: "AspectRatio",
    props: [
      {
        prop: "ratio",
        type: ratioType,
        default: "'1:1'",
        description: "Finite positive ratio; invalid values fall back to 1.",
      },
      {
        prop: "fit",
        type: "'cover' | 'contain' | 'fill' | 'none' | 'scaleDown'",
        default: "'cover'",
        description: "Native image and video object-fit.",
      },
      {
        prop: "position",
        type: "'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
        default: "'center'",
        description: "Media crop and child alignment.",
      },
      {
        prop: "focalPoint",
        type: "{ x: number; y: number }",
        default: "undefined",
        description: "Coordinates clamped 0-100; invalid values use 50.",
      },
      {
        prop: "loading / skeleton",
        type: "boolean / boolean",
        default: "false / loading",
        description: "Retain content under a reserved loading frame.",
      },
      {
        prop: "zoomOnHover",
        type: "boolean",
        default: "false",
        description: "Reduced-motion-gated optional media scale.",
      },
      {
        prop: "native props / ref / render",
        type: "useRender.ComponentProps<'div'>",
        default: "-",
        description: "Root props and Base UI composition.",
      },
    ],
  },
  {
    title: "ResponsiveAspectRatio",
    props: [
      {
        prop: "base / sm / md / lg / xl",
        type: ratioType,
        default: "base required",
        description:
          "Numeric or preset breakpoint values; missing breakpoints inherit the previous one.",
      },
      {
        prop: "query",
        type: "'viewport' | 'container'",
        default: "'viewport'",
        description: "Container mode creates a named local query wrapper.",
      },
      {
        prop: "frame props",
        type: "Omit<AspectRatioProps, 'ratio'>",
        default: "-",
        description: "Shared frame options and DOM props reach the ratio box.",
      },
    ],
  },
  {
    title: "AspectRatioImage",
    props: [
      {
        prop: "placeholderSrc / fallback",
        type: "string / ReactNode",
        default: "undefined",
        description:
          "Visible placeholder; null suppresses the default error view.",
      },
      {
        prop: "sources",
        type: "AspectRatioSource[]",
        default: "undefined",
        description: "Native picture art direction sources.",
      },
      {
        prop: "onStatusChange",
        type: "(status: 'loading' | 'loaded' | 'error') => void",
        default: "undefined",
        description: "Source-scoped and cached image lifecycle callback.",
      },
      {
        prop: "native props / ref",
        type: "React.ComponentProps<'img'>",
        default: "loading='lazy'; decoding='async'",
        description:
          "srcSet, sizes, dimensions, alt, and events reach the underlying image.",
      },
    ],
  },
  {
    title: "AspectRatioVideo",
    props: [
      {
        prop: "captions",
        type: "Omit<React.ComponentProps<'track'>, 'kind'>[]",
        default: "undefined",
        description: "Caller-provided caption track resources.",
      },
      {
        prop: "native props / ref",
        type: "React.ComponentProps<'video'>",
        default: "-",
        description: "Native controls, sources, poster, and events.",
      },
    ],
  },
  {
    title: "AspectRatioEmbed",
    props: [
      {
        prop: "title / loading",
        type: "string / 'eager' | 'lazy'",
        default: "'Embedded content' / 'lazy'",
        description: "Non-empty accessible title and native deferred loading.",
      },
      {
        prop: "native props / ref",
        type: "React.ComponentProps<'iframe'>",
        default: "-",
        description:
          "srcDoc, sandbox, permissions, and events reach the iframe.",
      },
    ],
  },
  {
    title: "KiraAspectRatio",
    props: [
      {
        prop: "src / type / alt",
        type: "string / 'image' | 'video' | 'embed' / string",
        default: "undefined / 'image' / ''",
        description: "Select native media resource and accessible text.",
      },
      {
        prop: "placeholderSrc / imageProps / videoProps / embedProps",
        type: "string / ComponentProps<'img'> / AspectRatioVideoProps / ComponentProps<'iframe'>",
        default: "undefined",
        description:
          "Media-specific attributes with composed lifecycle events.",
      },
      {
        prop: "sources / responsive",
        type: "AspectRatioSource[] / Omit<ResponsiveAspectRatioProps, keyof AspectRatioProps>",
        default: "undefined",
        description: "Art direction and shared breakpoint ratios.",
      },
      {
        prop: "deferEmbed / posterSrc / activateLabel",
        type: "boolean / string / string",
        default: "true / undefined / 'Load embedded content'",
        description: "Create the iframe only after explicit user activation.",
      },
      {
        prop: "errorMessage / emptyMessage",
        type: "string / string",
        default: "'Media could not be loaded.' / 'No media selected'",
        description: "Readable error and missing-source states.",
      },
      {
        prop: "onRetry / onMediaStatusChange",
        type: "() => void | Promise<void> / (status: AspectRatioMediaStatus) => void",
        default: "undefined",
        description:
          "Manual recovery and status notifications; stale retries cannot replace a new source.",
      },
      {
        prop: "children / frame props",
        type: "ReactNode / Omit<AspectRatioProps, 'children'>",
        default: "-",
        description: "Custom content takes over the media builder.",
      },
    ],
  },
  {
    title: "Variants and presets",
    props: [
      {
        prop: "aspectRatioVariants",
        type: "cva",
        default: "-",
        description: "Shared fit and position styling.",
      },
      {
        prop: "presetRatios",
        type: "Record<AspectRatioPreset, number>",
        default: "-",
        description: "Numeric values for all eight presets.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const aspectRatioPageChangelogEntries = [
  {
    version: "3.0.1",
    date: "15 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Deferred preview focus",
        description:
          "After activation, focus enters the loaded iframe once loading clears. Moving to another control while waiting preserves that focus. Audited on Base UI 1.9.0.",
      },
    ],
  },
  {
    version: "3.0.0",
    date: "14 November 2026",
    changes: [
      {
        type: "added",
        title: "Responsive art direction",
        description:
          "Numeric ratios, named local queries, picture sources and focal points. Audited on Base UI 1.9.0.",
      },
      {
        type: "added",
        title: "Recoverable media and deferred embeds",
        description:
          "Empty/error/retry and source changes; explicit iframe activation by default.",
      },
      {
        type: "fixed",
        title: "Loading and native composition",
        description:
          "Retained content, visible placeholders, cached completion, native props/refs and internal slots.",
      },
      {
        type: "breaking",
        title: "Image load-state wrapper",
        description:
          "AspectRatioImage adds a span; refs still reach the image. Update direct-child selectors.",
      },
      {
        type: "breaking",
        title: "Kira lifecycle defaults",
        description:
          "Kira tracks media loading. Embeds require activation unless deferEmbed=false. Invalid ratios use a square.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
