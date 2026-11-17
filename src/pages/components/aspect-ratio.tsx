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

const basicCode =
  'import { KiraAspectRatio } from "@/components/ui/aspect-ratio";\nconst source = "/kira-alpine-landscape.svg";\nexport function GuideCover() {\n  return <KiraAspectRatio src={source} alt="Illustrated alpine peaks and a field guide title"\n    ratio="16:9" className="rounded-lg" imageProps={{ width: 1200, height: 680 }} />;\n}';

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

const ratiosCode =
  'import { AspectRatio, AspectRatioImage, type AspectRatioPreset } from "@/components/ui/aspect-ratio";\nconst source = "/kira-alpine-landscape.svg";\nconst ratios: AspectRatioPreset[] = ["1:1", "4:3", "3:2", "16:9", "9:16", "21:9", "3:4", "2:3"];\nexport function GuideCrops() {\n  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">\n    {ratios.map((ratio) => <AspectRatio key={ratio} ratio={ratio} className="rounded-lg"><AspectRatioImage src={source} alt={`Guide crop at ${ratio}`} /></AspectRatio>)}\n  </div>;\n}';

function LoadingDemo() {
  const controlId1 = React.useId();

  const [loading, setLoading] = React.useState(false);

  return (
    <div className="space-y-4">
      <AspectRatio
        ratio="16:9"
        loading={loading}
        className="max-w-xl rounded-lg border border-border"
      >
        <div className="flex h-full w-full flex-col justify-center gap-3 bg-background p-4">
          <label htmlFor={controlId1} className="space-y-2 text-sm">
            <span className="block">Guide title</span>
            <Input
              id={controlId1}
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

const loadingCode =
  'import * as React from "react";\nimport { AspectRatio } from "@/components/ui/aspect-ratio";\nimport { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\nexport function RetainedDraft() {\n  const [loading, setLoading] = React.useState(false);\n  return <div>\n    <AspectRatio ratio="16:9" loading={loading}><label>Guide title <Input aria-label="Guide title" defaultValue="Weekend alpine guide" /></label></AspectRatio>\n    <Button onClick={() => setLoading((value) => !value)}>{loading ? "Finish reload" : "Start reload"}</Button>\n  </div>;\n}';

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
          await new Promise((resolve) => setTimeout(resolve, 300));
          setBroken(false);
        }}
      />
      <Button variant="outline" size="sm" onClick={() => setBroken(true)}>
        Reset broken source
      </Button>
    </div>
  );
}

const recoveryCode =
  'import * as React from "react";\nimport { KiraAspectRatio } from "@/components/ui/aspect-ratio";\nconst source = "/kira-alpine-landscape.svg";\nexport function RecoverImage() {\n  const [broken, setBroken] = React.useState(true);\n  return <KiraAspectRatio src={broken ? "data:image/png;base64,broken" : source} alt="Alpine field guide"\n    ratio="16:9" errorMessage="The field guide image is unavailable."\n    onRetry={async () => { await new Promise((resolve) => setTimeout(resolve, 300)); setBroken(false); }} />;\n}';

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

const responsiveCode =
  'import { ResponsiveAspectRatio, AspectRatioImage } from "@/components/ui/aspect-ratio";\nconst source = "/kira-alpine-landscape.svg";\nexport function ResponsiveCover() {\n  return <ResponsiveAspectRatio base={2 / 3} md={1.7} lg={2.5} xl={3}><AspectRatioImage src={source} alt="A numeric responsive crop" /></ResponsiveAspectRatio>;\n}';

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

const containerCode =
  'import * as React from "react";\nimport { ResponsiveAspectRatio, AspectRatioImage } from "@/components/ui/aspect-ratio";\nimport { Button } from "@/components/ui/button";\nconst source = "/kira-alpine-landscape.svg";\nexport function LocalCover() {\n  const [wide, setWide] = React.useState(false);\n  return <div>\n    <Button aria-pressed={wide} onClick={() => setWide((value) => !value)}>{wide ? "Use compact card" : "Use wide article"}</Button>\n    <div className={wide ? "w-full" : "w-64 max-w-full"}><ResponsiveAspectRatio query="container" base="1:1" md="16:9"><AspectRatioImage src={source} alt="Cover adapting to card width" /></ResponsiveAspectRatio></div>\n  </div>;\n}';

function FocalDemo() {
  const [x, setX] = React.useState(50);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[0, 50, 100].map((value) => (
          <Button
            key={value}
            size="sm"
            variant="outline"
            aria-pressed={x === value}
            onClick={() => setX(value)}
          >
            {{ 0: "Left peak", 50: "Center", 100: "Right peak" }[value]}
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

const focalCode =
  'import * as React from "react";\nimport { KiraAspectRatio } from "@/components/ui/aspect-ratio";\nimport { Button } from "@/components/ui/button";\nconst source = "/kira-alpine-landscape.svg";\nexport function FocalCrop() {\n  const [x, setX] = React.useState(50);\n  return <div>\n    {[0, 50, 100].map((value) => <Button key={value} aria-pressed={x === value} onClick={() => setX(value)}>{value}%</Button>)}\n    <KiraAspectRatio src={source} alt="A focal crop of the alpine guide" ratio="1:1" focalPoint={{ x, y: 50 }} />\n  </div>;\n}';

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

const artDirectionCode =
  'import { KiraAspectRatio } from "@/components/ui/aspect-ratio";\nconst source = "/kira-alpine-landscape.svg";\nexport function CampaignCover() {\n  return <KiraAspectRatio src={source} alt="Alpine guide with a separate mobile illustration"\n    sources={[{ media: "(max-width: 639px)", srcSet: "/kira-alpine-portrait.svg" }]}\n    responsive={{ base: "2:3", sm: "16:9" }} />;\n}';

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

const embedCode =
  'import { KiraAspectRatio } from "@/components/ui/aspect-ratio";\nconst source = "/kira-alpine-landscape.svg";\nconst previewDocument = "<!doctype html><html lang=\\"en\\"><body style=\\"margin:0;font-family:system-ui;display:grid;place-items:center;min-height:100vh;color-scheme:light dark\\"><main><h1>Field guide preview</h1><p>This document loaded after your choice.</p><a href=\\"#notes\\">Read field notes</a><p id=\\"notes\\">Pack water and check the weather before the hike.</p></main></body></html>";\nexport function DeferredPreview() {\n  return <KiraAspectRatio type="embed" alt="Field guide preview" ratio="16:9" posterSrc={source}\n    activateLabel="Open guide preview" embedProps={{ srcDoc: previewDocument, title: "Field guide preview", sandbox: "allow-scripts" }} />;\n}';

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

const kiraCode =
  'import * as React from "react";\nimport { KiraAspectRatio } from "@/components/ui/aspect-ratio";\nimport { Button } from "@/components/ui/button";\nconst source = "/kira-alpine-landscape.svg";\nexport function GuideMedia() {\n  const [selected, setSelected] = React.useState(false);\n  return <div>\n    <Button onClick={() => setSelected((value) => !value)}>{selected ? "Remove cover" : "Select cover"}</Button>\n    <KiraAspectRatio src={selected ? source : undefined} alt="Selected field guide cover" ratio="16:9" emptyMessage="Select a cover for your guide." />\n  </div>;\n}';

function StatesDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <KiraAspectRatio
        ratio={Number.NaN}
        emptyMessage="An invalid ratio safely uses a square."
        className="rounded-lg"
      />
      <KiraAspectRatio
        src="data:image/png;base64,broken"
        alt="International alpine expedition-日本語-ภาษาไทย-العربية"
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
    </div>
  );
}

const statesCode =
  'import { AspectRatio, AspectRatioImage, KiraAspectRatio } from "@/components/ui/aspect-ratio";\nexport function MediaStates() {\n  return <div className="grid gap-4 sm:grid-cols-2">\n    <KiraAspectRatio ratio={Number.NaN} emptyMessage="An invalid ratio safely uses a square." />\n    <AspectRatio ratio="16:9" fit="contain"><AspectRatioImage src="/kira-alpine-portrait.svg" alt="A contained portrait image" /></AspectRatio>\n    <AspectRatio ratio="16:9" position="bottom-right"><span>Bottom-right content</span></AspectRatio>\n  </div>;\n}';

const tabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper title="Stable media frame" code={basicCode}>
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "ratios",
    label: "Ratios",
    demo: (
      <DemoWrapper title="Eight presets" code={ratiosCode}>
        <RatiosDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "loading",
    label: "Loading",
    demo: (
      <DemoWrapper title="Retain a draft" code={loadingCode}>
        <LoadingDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "recovery",
    label: "Recovery",
    demo: (
      <DemoWrapper title="Recover a broken image" code={recoveryCode}>
        <RecoveryDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "responsive",
    label: "Responsive",
    demo: (
      <DemoWrapper title="Numeric breakpoint ratios" code={responsiveCode}>
        <ResponsiveDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "container",
    label: "Container",
    demo: (
      <DemoWrapper title="Local container ratios" code={containerCode}>
        <ContainerDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "focal",
    label: "Focal point",
    demo: (
      <DemoWrapper title="Keep the subject visible" code={focalCode}>
        <FocalDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sources",
    label: "Art direction",
    demo: (
      <DemoWrapper title="Separate source crops" code={artDirectionCode}>
        <ArtDirectionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "embed",
    label: "Embeds",
    demo: (
      <DemoWrapper title="Load after a choice" code={embedCode}>
        <EmbedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    demo: (
      <DemoWrapper title="Guide cover workflow" code={kiraCode}>
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper title="Missing and contained media" code={statesCode}>
        <StatesDemo />
      </DemoWrapper>
    ),
  },
] satisfies React.ComponentProps<typeof DemoTabs>["tabs"];

type APIRow = [string, string, string, string?];

function section(title: string, rows: APIRow[]) {
  return {
    title,
    props: rows.map(([prop, type, description, defaultValue]) => ({
      prop,
      type,
      description,
      default: defaultValue,
    })),
  };
}

const ratioType =
  "number | '1:1' | '4:3' | '3:2' | '16:9' | '9:16' | '21:9' | '3:4' | '2:3'";

const api = [
  section("AspectRatio", [
    [
      "ratio",
      ratioType,
      "Finite positive ratio; invalid values use 1.",
      "'1:1'",
    ],
    [
      "fit",
      "'cover' | 'contain' | 'fill' | 'none' | 'scaleDown'",
      "Native image/video object-fit.",
      "'cover'",
    ],
    [
      "position",
      "'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'",
      "Media crop and child alignment.",
      "'center'",
    ],
    [
      "focalPoint",
      "{ x: number; y: number }",
      "Coordinates clamped 0–100; invalid values use 50.",
    ],
    [
      "loading / skeleton",
      "boolean / boolean",
      "Retain content under a reserved loading frame.",
      "false / loading",
    ],
    [
      "zoomOnHover",
      "boolean",
      "Reduced-motion-gated optional media scale.",
      "false",
    ],
    [
      "native props / ref / render",
      "useRender.ComponentProps<'div'>",
      "Root props and Base UI composition.",
    ],
  ]),
  section("ResponsiveAspectRatio", [
    [
      "base / sm / md / lg / xl",
      ratioType,
      "Numeric/preset breakpoint values; missing values inherit the previous one.",
    ],
    [
      "query",
      "'viewport' | 'container'",
      "Container mode creates a named local query wrapper.",
      "'viewport'",
    ],
    [
      "frame props",
      "Omit<AspectRatioProps, 'ratio'>",
      "Shared frame options and DOM props reach the ratio box.",
    ],
  ]),
  section("AspectRatioImage", [
    [
      "placeholderSrc / fallback",
      "string / ReactNode",
      "Visible placeholder; null suppresses the default error view.",
    ],
    [
      "sources",
      "{ srcSet: string; media?: string; type?: string; sizes?: string }[]",
      "Native picture art direction.",
    ],
    [
      "onStatusChange",
      "(status: 'loading' | 'loaded' | 'error') => void",
      "Source-scoped and cached image lifecycle.",
    ],
    [
      "native props / ref",
      "React.ComponentProps<'img'>",
      "srcSet, sizes, dimensions, alt and events reach the actual image.",
      "loading='lazy'; decoding='async'",
    ],
  ]),
  section("AspectRatioVideo", [
    [
      "native props / ref",
      "React.ComponentProps<'video'>",
      "Native controls, sources, captions, poster and events.",
    ],
  ]),
  section("AspectRatioEmbed", [
    [
      "title / loading",
      "string / 'eager' | 'lazy'",
      "Non-empty title and native deferred loading.",
      "'Embedded content' / 'lazy'",
    ],
    [
      "native props / ref",
      "React.ComponentProps<'iframe'>",
      "srcDoc, sandbox, permissions and events reach the iframe.",
    ],
  ]),
  section("KiraAspectRatio", [
    [
      "src / type / alt",
      "string / 'image' | 'video' | 'embed' / string",
      "Select native media.",
      "undefined / 'image' / ''",
    ],
    [
      "placeholderSrc / imageProps / videoProps / embedProps",
      "string / React.ComponentProps<'img'> / React.ComponentProps<'video'> / React.ComponentProps<'iframe'>",
      "Media-specific attributes with composed lifecycle events.",
    ],
    [
      "sources / responsive",
      "AspectRatioSource[] / { base: number | AspectRatioPreset; sm?: number | AspectRatioPreset; md?: number | AspectRatioPreset; lg?: number | AspectRatioPreset; xl?: number | AspectRatioPreset; query?: 'viewport' | 'container' }",
      "Art direction and shared breakpoint ratios.",
    ],
    [
      "deferEmbed / posterSrc / activateLabel",
      "boolean / string / string",
      "Create the iframe only after activation.",
      "true / undefined / 'Load embedded content'",
    ],
    [
      "errorMessage / emptyMessage",
      "string / string",
      "Readable error and missing-source states.",
      "'Media could not be loaded.' / 'No media selected'",
    ],
    [
      "onRetry / onMediaStatusChange",
      "() => void | Promise<void> / (status: 'loading' | 'loaded' | 'error') => void",
      "Manual recovery and status notifications; stale retries cannot replace a new source.",
    ],
    [
      "children / frame props",
      "ReactNode / Omit<AspectRatioProps, 'children'>",
      "Custom content takes over the media builder.",
    ],
  ]),
  section("Variants and presets", [
    ["aspectRatioVariants", "cva", "Shared fit and position styling."],
    [
      "presetRatios",
      "Record<AspectRatioPreset, number>",
      "Numeric values for all eight presets.",
    ],
  ]),
] satisfies React.ComponentProps<typeof APIReference>["sections"];

const usageCode =
  'import {\n  AspectRatio, ResponsiveAspectRatio, AspectRatioImage, AspectRatioVideo,\n  AspectRatioEmbed, KiraAspectRatio, aspectRatioVariants, presetRatios,\n} from "@/components/ui/aspect-ratio";\nconst source = "/kira-alpine-landscape.svg";\nexport function MediaParts() {\n  return <div className="space-y-6">\n    <AspectRatio ratio="16:9"><AspectRatioImage src={source} alt="Alpine guide" /></AspectRatio>\n    <ResponsiveAspectRatio base="1:1" md={16 / 9}><AspectRatioImage src={source} alt="Responsive guide" /></ResponsiveAspectRatio>\n    <AspectRatio ratio="16:9"><AspectRatioVideo controls poster={source} preload="none" /></AspectRatio>\n    <AspectRatio ratio="16:9"><AspectRatioEmbed title="Guide preview" srcDoc="<p>Guide preview</p>" /></AspectRatio>\n    <KiraAspectRatio src={source} alt="Guide cover" ratio="16:9" focalPoint={{ x: 70, y: 40 }} />\n  </div>;\n}\n// Attach a video source and caption track for playback.\n// aspectRatioVariants({ fit: "contain" }) and presetRatios["16:9"] are exported.';

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function AspectRatioPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Aspect Ratio"
        description="Stable media frames with responsive art direction and recoverable loading."
        version="3.0.1"
      />
      <FeatureGrid
        features={[
          {
            title: "Reliable media",
            description: "Placeholders, cached images and manual recovery.",
            icon: <IconPhoto className="size-5" />,
          },
          {
            title: "Responsive crops",
            description: "Numeric viewport or local container ratios.",
            icon: <IconDeviceMobile className="size-5" />,
          },
          {
            title: "Art direction",
            description: "Native picture sources and bounded focal points.",
            icon: <IconFocus2 className="size-5" />,
          },
        ]}
      />
      <DemoTabs defaultValue="basic" tabs={tabs} />
      <KeyboardShortcuts
        shortcuts={[
          {
            keys: "Tab / Shift+Tab",
            description:
              "Reach media retry, preview activation and native media controls.",
          },
          {
            keys: "Enter / Space",
            description:
              "Activate preview/retry buttons; native controls inherited from Base UI.",
          },
          {
            keys: "Tab",
            description:
              "Activation transfers focus to the loaded iframe; Tab reaches its document controls.",
          },
          {
            keys: "Enter",
            description:
              "Toggle reload and confirm the input draft remains afterward.",
          },
        ]}
      />
      <UsageBlock code={usageCode} />
      <APIReference sections={api} />
      <Changelog
        entries={[
          {
            version: "3.0.1",
            date: "November 15, 2026",
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
            date: "November 14, 2026",
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
        ]}
      />
    </ComponentPage>
  );
}
