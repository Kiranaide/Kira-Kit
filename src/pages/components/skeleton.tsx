import * as React from "react";
import { IconLayoutGrid, IconClock, IconRefresh } from "@tabler/icons-react";
import {
  Skeleton,
  SkeletonGroup,
  SkeletonRoot,
  SkeletonBone,
  SkeletonText,
  SkeletonHeading,
  SkeletonAvatar,
  SkeletonButton,
  SkeletonImage,
  SkeletonLines,
  SkeletonCard,
  SkeletonTableRow,
  SkeletonListItem,
  KiraSkeleton,
  type SkeletonBoneProps,
} from "@/components/ui/skeleton";
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

function BasicDemo() {
  return (
    <SkeletonRoot loadingLabel="Loading article preview" className="space-y-3">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </SkeletonRoot>
  );
}

const basicCode =
  'import { Skeleton, SkeletonRoot } from "@/components/ui/skeleton";\n\nexport default function BasicDemo() {\n  return <SkeletonRoot loadingLabel="Loading article preview" className="space-y-3">\n    <Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" />\n  </SkeletonRoot>;\n}\n';

function GeometryDemo() {
  return (
    <SkeletonGroup loadingLabel="Loading profile" className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <SkeletonAvatar size="sm" />
        <SkeletonAvatar size="md" />
        <SkeletonAvatar size="lg" />
        <SkeletonAvatar size="xl" />
      </div>
      <SkeletonHeading />
      <SkeletonText />
      <SkeletonLines count={3} lastLineWidth="2/3" />
      <SkeletonButton />
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonButton size="xs" />
        <SkeletonButton size="sm" />
        <SkeletonButton size="default" />
        <SkeletonButton size="lg" />
        <SkeletonButton size="xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SkeletonImage aspectRatio="16/9" />
        <SkeletonImage aspectRatio="4/3" />
        <SkeletonImage aspectRatio="1/1" />
      </div>
    </SkeletonGroup>
  );
}

const geometryCode =
  'import { SkeletonGroup, SkeletonText, SkeletonHeading, SkeletonAvatar, SkeletonButton, SkeletonImage, SkeletonLines } from "@/components/ui/skeleton";\n\nexport default function GeometryDemo() {\n  return <SkeletonGroup loadingLabel="Loading profile" className="space-y-6">\n    <div className="flex flex-wrap items-center gap-4"><SkeletonAvatar size="sm" /><SkeletonAvatar size="md" /><SkeletonAvatar size="lg" /><SkeletonAvatar size="xl" /></div>\n    <SkeletonHeading /><SkeletonText /><SkeletonLines count={3} lastLineWidth="2/3" /><SkeletonButton />\n    <div className="grid gap-4 sm:grid-cols-3"><SkeletonImage aspectRatio="16/9" /><SkeletonImage aspectRatio="4/3" /><SkeletonImage aspectRatio="1/1" /></div>\n  </SkeletonGroup>;\n}\n';

function MotionDemo() {
  const [paused, setPaused] = React.useState(false);
  const [animated, setAnimated] = React.useState(true);

  const [variant, setVariant] =
    React.useState<SkeletonBoneProps["variant"]>("shimmer");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          aria-pressed={paused}
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? "Resume" : "Pause"} animation
        </Button>
        <Button
          size="sm"
          variant="outline"
          aria-pressed={!animated}
          onClick={() => setAnimated((value) => !value)}
        >
          Motion {animated ? "on" : "off"}
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(["default", "shimmer", "wave"] as const).map((value) => (
          <Button
            key={value}
            size="sm"
            variant="outline"
            aria-pressed={variant === value}
            onClick={() => setVariant(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <SkeletonGroup
        animated={animated}
        paused={paused}
        duration={1600}
        loadingLabel="Loading report"
        className="space-y-3"
      >
        <SkeletonBone variant={variant} className="h-5 w-3/4" />
        <SkeletonBone variant={variant} className="h-4 w-full" />
        <SkeletonBone variant={variant} className="h-4 w-2/3" />
      </SkeletonGroup>
      <p className="text-xs text-muted-foreground">
        The group pauses outside the viewport or in a hidden tab. Reduced motion
        renders static shapes.
      </p>
    </div>
  );
}

const motionCode =
  'import * as React from "react";\nimport { SkeletonGroup, SkeletonBone, type SkeletonBoneProps } from "@/components/ui/skeleton";\nimport { Button } from "@/components/ui/button";\n\nexport default function MotionDemo() {\n  const [paused, setPaused] = React.useState(false);\n  const [animated, setAnimated] = React.useState(true);\n  const [variant, setVariant] = React.useState<SkeletonBoneProps["variant"]>("shimmer");\n  return <div className="space-y-6">\n    <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>{paused ? "Resume" : "Pause"} animation</Button><Button size="sm" variant="outline" aria-pressed={!animated} onClick={() => setAnimated((value) => !value)}>Motion {animated ? "on" : "off"}</Button></div>\n    <div className="flex flex-wrap gap-2">{(["default", "shimmer", "wave"] as const).map((value) => <Button key={value} size="sm" variant="outline" aria-pressed={variant === value} onClick={() => setVariant(value)}>{value}</Button>)}</div>\n    <SkeletonGroup animated={animated} paused={paused} duration={1600} loadingLabel="Loading report" className="space-y-3">\n      <SkeletonBone variant={variant} className="h-5 w-3/4" /><SkeletonBone variant={variant} className="h-4 w-full" /><SkeletonBone variant={variant} className="h-4 w-2/3" />\n    </SkeletonGroup>\n    <p className="text-xs text-muted-foreground">The group pauses outside the viewport or in a hidden tab. Reduced motion renders static shapes.</p>\n  </div>;\n}\n';

function PresetsDemo() {
  return (
    <SkeletonGroup
      loadingLabel="Loading workspace"
      className="grid gap-8 md:grid-cols-2"
    >
      <SkeletonCard animated={false} />
      <div className="min-w-0 space-y-5">
        <SkeletonListItem />
        <SkeletonListItem />
        <SkeletonTableRow columns={3} />
        <SkeletonTableRow columns={3} />
      </div>
    </SkeletonGroup>
  );
}

const presetsCode =
  'import { SkeletonGroup, SkeletonCard, SkeletonTableRow, SkeletonListItem } from "@/components/ui/skeleton";\n\nexport default function PresetsDemo() {\n  return <SkeletonGroup loadingLabel="Loading workspace" className="grid gap-8 md:grid-cols-2">\n    <SkeletonCard animated={false} />\n    <div className="min-w-0 space-y-5"><SkeletonListItem /><SkeletonListItem /><SkeletonTableRow columns={3} /><SkeletonTableRow columns={3} /></div>\n  </SkeletonGroup>;\n}\n';

function DelayDemo() {
  const [request, setRequest] = React.useState({ loading: false, revision: 0 });
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const load = (milliseconds: number) => {
    if (timer.current) clearTimeout(timer.current);
    setRequest((previous) => ({
      loading: true,
      revision: previous.revision + 1,
    }));
    timer.current = setTimeout(
      () => setRequest((previous) => ({ ...previous, loading: false })),
      milliseconds,
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => load(50)}>
          Fast request (50 ms)
        </Button>
        <Button size="sm" variant="outline" onClick={() => load(800)}>
          Slow request (800 ms)
        </Button>
      </div>
      <KiraSkeleton
        key={request.revision}
        loading={request.loading}
        delayMs={150}
        minHeight={112}
        loadingLabel="Loading release summary"
      >
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Release summary</h3>
          <p className="text-sm text-muted-foreground">
            The staging build passed. One production approval remains.
          </p>
        </div>
      </KiraSkeleton>
      <p className="text-xs text-muted-foreground">
        Illustrative timings. A short request resolves before the 150 ms
        placeholder delay.
      </p>
    </div>
  );
}

const delayCode =
  'import * as React from "react";\nimport { KiraSkeleton } from "@/components/ui/skeleton";\nimport { Button } from "@/components/ui/button";\n\nexport default function DelayDemo() {\n  const [request, setRequest] = React.useState({ loading: false, revision: 0 });\n  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);\n  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, []);\n  const load = (milliseconds: number) => {\n    if (timer.current) clearTimeout(timer.current);\n    setRequest((previous) => ({ loading: true, revision: previous.revision + 1 }));\n    timer.current = setTimeout(() => setRequest((previous) => ({ ...previous, loading: false })), milliseconds);\n  };\n  return <div className="space-y-4">\n    <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => load(50)}>Fast request (50 ms)</Button><Button size="sm" variant="outline" onClick={() => load(800)}>Slow request (800 ms)</Button></div>\n    <KiraSkeleton key={request.revision} loading={request.loading} delayMs={150} minHeight={112} loadingLabel="Loading release summary">\n      <div className="space-y-2"><h3 className="text-sm font-semibold">Release summary</h3><p className="text-sm text-muted-foreground">The staging build passed. One production approval remains.</p></div>\n    </KiraSkeleton>\n    <p className="text-xs text-muted-foreground">Illustrative timings. A short request resolves before the 150 ms placeholder delay.</p>\n  </div>;\n}\n';

function HoldDemo() {
  const [request, setRequest] = React.useState({ loading: false, revision: 0 });
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const load = () => {
    if (timer.current) clearTimeout(timer.current);
    setRequest((previous) => ({
      loading: true,
      revision: previous.revision + 1,
    }));
    timer.current = setTimeout(
      () => setRequest((previous) => ({ ...previous, loading: false })),
      80,
    );
  };

  return (
    <div className="space-y-4">
      <Button size="sm" variant="outline" onClick={load}>
        Load summary with a minimum display
      </Button>
      <KiraSkeleton
        key={request.revision}
        loading={request.loading}
        delayMs={0}
        minDurationMs={500}
        minHeight={96}
      >
        <p className="text-sm">Summary ready.</p>
      </KiraSkeleton>
      <p className="text-xs text-muted-foreground">
        Optional: this example keeps a visible placeholder for 500 ms. The
        default minimum is zero.
      </p>
    </div>
  );
}

const holdCode =
  'import * as React from "react";\nimport { KiraSkeleton } from "@/components/ui/skeleton";\nimport { Button } from "@/components/ui/button";\n\nexport default function HoldDemo() {\n  const [request, setRequest] = React.useState({ loading: false, revision: 0 });\n  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);\n  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, []);\n  const load = () => {\n    if (timer.current) clearTimeout(timer.current);\n    setRequest((previous) => ({ loading: true, revision: previous.revision + 1 }));\n    timer.current = setTimeout(() => setRequest((previous) => ({ ...previous, loading: false })), 80);\n  };\n  return <div className="space-y-4">\n    <Button size="sm" variant="outline" onClick={load}>Load summary with a minimum display</Button>\n    <KiraSkeleton key={request.revision} loading={request.loading} delayMs={0} minDurationMs={500} minHeight={96}><p className="text-sm">Summary ready.</p></KiraSkeleton>\n    <p className="text-xs text-muted-foreground">Optional: this example keeps a visible placeholder for 500 ms. The default minimum is zero.</p>\n  </div>;\n}\n';

function RefreshDemo() {
  const [loading, setLoading] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const refresh = () => {
    if (timer.current) clearTimeout(timer.current);
    setLoading(true);
    timer.current = setTimeout(() => setLoading(false), 900);
  };

  const id = React.useId();

  return (
    <div className="space-y-4">
      <Button size="sm" variant="outline" onClick={refresh}>
        Refresh release details
      </Button>
      <KiraSkeleton
        loading={loading}
        retainContent
        loadedLabel="Release details updated"
      >
        <div className="space-y-2">
          <label htmlFor={id} className="text-sm font-medium">
            Your release note
          </label>
          <Input id={id} defaultValue="Keep the rollout gradual." />
          <p className="text-xs text-muted-foreground">
            Edit this draft, then refresh. The same input stays mounted.
          </p>
        </div>
      </KiraSkeleton>
      <p className="text-xs text-muted-foreground">
        {loading
          ? "Refreshing release details…"
          : "Release details are current."}
      </p>
    </div>
  );
}

const refreshCode =
  'import * as React from "react";\nimport { KiraSkeleton } from "@/components/ui/skeleton";\nimport { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\n\nexport default function RefreshDemo() {\n  const [loading, setLoading] = React.useState(false);\n  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);\n  React.useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, []);\n  const refresh = () => {\n    if (timer.current) clearTimeout(timer.current);\n    setLoading(true);\n    timer.current = setTimeout(() => setLoading(false), 900);\n  };\n  const id = React.useId();\n  return <div className="space-y-4">\n    <Button size="sm" variant="outline" onClick={refresh}>Refresh release details</Button>\n    <KiraSkeleton loading={loading} retainContent loadedLabel="Release details updated">\n      <div className="space-y-2"><label htmlFor={id} className="text-sm font-medium">Your release note</label><Input id={id} defaultValue="Keep the rollout gradual." /><p className="text-xs text-muted-foreground">Edit this draft, then refresh. The same input stays mounted.</p></div>\n    </KiraSkeleton>\n    <p role="status" className="text-xs text-muted-foreground">{loading ? "Refreshing release details…" : "Release details are current."}</p>\n  </div>;\n}\n';

function KiraDemo() {
  const [loading, setLoading] = React.useState(true);

  const [preset, setPreset] = React.useState<
    "text" | "card" | "list" | "table"
  >("list");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          aria-pressed={loading}
          onClick={() => setLoading((value) => !value)}
        >
          {loading ? "Show content" : "Load again"}
        </Button>
        {(["text", "card", "list", "table"] as const).map((value) => (
          <Button
            key={value}
            size="sm"
            variant="outline"
            aria-pressed={preset === value}
            onClick={() => setPreset(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <KiraSkeleton
        loading={loading}
        preset={preset}
        count={3}
        retainContent={false}
        minHeight={120}
        loadingLabel="Loading workspace preview"
      >
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Workspace ready</h3>
          <p className="text-sm text-muted-foreground">
            Your release checklist, review queue and activity history are
            available.
          </p>
          <Button size="sm" variant="outline" onClick={() => setLoading(true)}>
            Reload preview
          </Button>
        </div>
      </KiraSkeleton>
    </div>
  );
}

const kiraCode =
  'import * as React from "react";\nimport { KiraSkeleton } from "@/components/ui/skeleton";\nimport { Button } from "@/components/ui/button";\n\nexport default function KiraDemo() {\n  const [loading, setLoading] = React.useState(true);\n  const [preset, setPreset] = React.useState<"text" | "card" | "list" | "table">("list");\n  return <div className="space-y-4">\n    <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" aria-pressed={loading} onClick={() => setLoading((value) => !value)}>{loading ? "Show content" : "Load again"}</Button>{(["text", "card", "list", "table"] as const).map((value) => <Button key={value} size="sm" variant="outline" aria-pressed={preset === value} onClick={() => setPreset(value)}>{value}</Button>)}</div>\n    <KiraSkeleton loading={loading} preset={preset} count={3} retainContent={false} minHeight={120} loadingLabel="Loading workspace preview">\n      <div className="space-y-2"><h3 className="text-sm font-semibold">Workspace ready</h3><p className="text-sm text-muted-foreground">Your release checklist, review queue and activity history are available.</p><Button size="sm" variant="outline" onClick={() => setLoading(true)}>Reload preview</Button></div>\n    </KiraSkeleton>\n  </div>;\n}\n';

function StatesDemo() {
  const [failed, setFailed] = React.useState(true);

  return (
    <div className="space-y-8">
      <KiraSkeleton
        loading={false}
        loadedLabel={failed ? "Preview unavailable" : "Preview restored"}
      >
        {failed ? (
          <div className="space-y-2">
            <p className="text-sm">
              The preview could not be loaded. Your saved workspace is safe.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setFailed(false)}
            >
              Try again
            </Button>
          </div>
        ) : (
          <p className="text-sm">Preview restored. The workspace is ready.</p>
        )}
      </KiraSkeleton>
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="min-w-0 space-y-3">
          <p className="text-sm font-medium wrap-anywhere">
            Internationalisation_Release_Candidate_Review_2026_10_31
          </p>
          <SkeletonLines count={4} animated={false} />
          <Skeleton variant="shimmer" animated={false} className="h-16" />
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium">Empty and invalid counts</p>
          <SkeletonLines count={0} />
          <SkeletonTableRow columns={0} />
          <SkeletonLines count={Number.NaN} animated={false} />
          <p className="text-xs text-muted-foreground">
            Zero renders no bones; a non-finite line count uses three.
          </p>
        </div>
      </div>
    </div>
  );
}

const statesCode =
  'import * as React from "react";\nimport { Skeleton, SkeletonLines, SkeletonTableRow, KiraSkeleton } from "@/components/ui/skeleton";\nimport { Button } from "@/components/ui/button";\n\nexport default function StatesDemo() {\n  const [failed, setFailed] = React.useState(true);\n  return <div className="space-y-8">\n    <KiraSkeleton loading={false} loadedLabel={failed ? "Preview unavailable" : "Preview restored"}>\n      {failed ? <div className="space-y-2"><p className="text-sm">The preview could not be loaded. Your saved workspace is safe.</p><Button size="sm" variant="outline" onClick={() => setFailed(false)}>Try again</Button></div> : <p className="text-sm">Preview restored. The workspace is ready.</p>}\n    </KiraSkeleton>\n    <div className="grid gap-6 sm:grid-cols-2"><div className="min-w-0 space-y-3"><p className="text-sm font-medium wrap-anywhere">Internationalisation_Release_Candidate_Review_2026_10_31</p><SkeletonLines count={4} animated={false} /><Skeleton variant="shimmer" animated={false} className="h-16" /></div><div className="space-y-3"><p className="text-sm font-medium">Empty and invalid counts</p><SkeletonLines count={0} /><SkeletonTableRow columns={0} /><SkeletonLines count={Number.NaN} animated={false} /><p className="text-xs text-muted-foreground">Zero renders no bones; a non-finite line count uses three.</p></div></div>\n  </div>;\n}\n';

const demoTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper title="Article preview" code={basicCode}>
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "shapes",
    label: "Shapes",
    demo: (
      <DemoWrapper title="Primitives and aspect ratios" code={geometryCode}>
        <GeometryDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "motion",
    label: "Motion",
    demo: (
      <DemoWrapper title="Coordinated loading motion" code={motionCode}>
        <MotionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "presets",
    label: "Presets",
    demo: (
      <DemoWrapper title="Card, list and table placeholders" code={presetsCode}>
        <PresetsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "delay",
    label: "Delay",
    demo: (
      <DemoWrapper title="Avoid a fast-request flash" code={delayCode}>
        <DelayDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "hold",
    label: "Minimum display",
    demo: (
      <DemoWrapper title="An optional minimum display time" code={holdCode}>
        <HoldDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "refresh",
    label: "Refresh",
    demo: (
      <DemoWrapper title="Keep the draft during refresh" code={refreshCode}>
        <RefreshDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    demo: (
      <DemoWrapper title="A controlled loading boundary" code={kiraCode}>
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper
        title="Recovery and constrained data"
        description="Errors belong to the application. KiraSkeleton displays the resulting content when loading ends."
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
];

const nativeProps = [
  {
    prop: "HTML attributes / ref",
    type: 'React.ComponentProps<"div">',
    description:
      "Forwarded once to the named root. Bones and preset placeholders are decorative and inert.",
  },
];

const motionProps = [
  {
    prop: "animated / paused",
    type: "boolean",
    default: "true / false",
    description:
      "Disable animation or pause it in place. Parent group restrictions always apply.",
  },
  {
    prop: "duration / delay",
    type: "number",
    default: "2000 / 0",
    description:
      "Milliseconds on the moving layer. Zero duration disables motion; zero delay is respected.",
  },
];

const boneProps = [
  ...nativeProps,
  ...motionProps,
  {
    prop: "variant",
    type: '"default" | "circle" | "text" | "shimmer" | "wave"',
    default: '"default"',
    description:
      "Base shape or animation. Preset size classes can be extended with className.",
  },
];

const rootProps = [
  ...nativeProps,
  ...motionProps,
  {
    prop: "loading",
    type: "boolean",
    default: "true",
    description:
      "Sets aria-busy and stops descendants' motion when false. It does not replace children.",
  },
  {
    prop: "loadingLabel / loadedLabel",
    type: "string",
    default: '"Loading content" / "Content loaded"',
    description:
      "One contextual status message outside the busy subtree. aria-label is a legacy loadingLabel fallback.",
  },
  {
    prop: "announce / aria-live",
    type: 'boolean / "polite" | "assertive" | "off"',
    default: 'true / "polite"',
    description:
      "Top-level groups announce once; nested groups do not add live regions.",
  },
];

const apiSections = [
  ...["Skeleton", "SkeletonBone", "SkeletonText", "SkeletonHeading"].map(
    (title) => ({ title, props: boneProps }),
  ),
  {
    title: "SkeletonButton",
    props: [
      ...boneProps,
      {
        prop: "size",
        type: '"xs" | "sm" | "default" | "lg" | "xl"',
        default: '"default"',
        description:
          "Button bone height follows the control ladder: h-7/8/9/10/11.",
      },
    ],
  },
  ...["SkeletonRoot", "SkeletonGroup"].map((title) => ({
    title,
    props: rootProps,
  })),
  {
    title: "SkeletonLines",
    props: [
      ...boneProps,
      {
        prop: "count",
        type: "number",
        default: "3",
        description:
          "Finite integer from 0–100. Non-finite values use the default.",
      },
      {
        prop: "gap",
        type: '"sm" | "md" | "lg"',
        default: '"md"',
        description: "Space between text lines.",
      },
      {
        prop: "lastLineWidth",
        type: '"full" | "3/4" | "2/3" | "1/2"',
        default: '"3/4"',
        description: "Width of the final line.",
      },
    ],
  },
  {
    title: "SkeletonAvatar",
    props: [
      ...nativeProps,
      ...motionProps,
      {
        prop: "size",
        type: '"sm" | "md" | "lg" | "xl"',
        default: '"md"',
        description: "Circular placeholder size. Shape remains circular.",
      },
    ],
  },
  {
    title: "SkeletonImage",
    props: [
      ...boneProps,
      {
        prop: "aspectRatio",
        type: "string",
        default: '"16/9"',
        description: "CSS aspect-ratio; style can override it.",
      },
    ],
  },
  { title: "SkeletonCard", props: boneProps },
  {
    title: "SkeletonTableRow",
    props: [
      ...boneProps,
      {
        prop: "columns",
        type: "number",
        default: "4",
        description:
          "0–100 decorative columns; this is a div layout, not a semantic table row.",
      },
    ],
  },
  { title: "SkeletonListItem", props: boneProps },
  {
    title: "KiraSkeleton",
    props: [
      ...rootProps,
      {
        prop: "loading / children",
        type: "boolean / ReactNode",
        description:
          "Required controlled pending state and resolved content. It does not catch errors or fetch data.",
      },
      {
        prop: "fallback / preset",
        type: 'ReactNode / "text" | "card" | "list" | "table"',
        default: 'undefined / "text"',
        description:
          "Custom fallback takes precedence. Card renders one card; text/list/table use count.",
      },
      {
        prop: "count",
        type: "number",
        default: "3",
        description: "Lines or rows, normalized to 0–100.",
      },
      {
        prop: "delayMs / minDurationMs",
        type: "number",
        default: "150 / 0",
        description:
          "Delay before showing placeholders, then optional minimum visible duration. Timers are cancelled on state changes and unmount.",
      },
      {
        prop: "retainContent",
        type: "boolean",
        default: "true",
        description:
          "Once revealed, keep the content visible and mounted while refreshing. False hides it while showing a fallback but preserves the mounted subtree.",
      },
      {
        prop: "minHeight",
        type: 'CSSProperties["minHeight"]',
        description:
          "Reserve space appropriate to your final content. The fallback also reserves its own shape during the delay.",
      },
    ],
  },
];

const usageCode =
  'import { Skeleton, SkeletonGroup, SkeletonRoot, SkeletonBone, SkeletonText, SkeletonHeading, SkeletonAvatar, SkeletonButton, SkeletonImage, SkeletonLines, SkeletonCard, SkeletonTableRow, SkeletonListItem, KiraSkeleton } from "@/components/ui/skeleton";\n\nexport default function AllPartsExample() {\n  return <div className="space-y-6">\n    <SkeletonRoot loadingLabel="Loading document"><Skeleton /><SkeletonBone className="h-4 w-24" /><SkeletonText /><SkeletonHeading /><SkeletonAvatar /><SkeletonButton /><SkeletonImage /><SkeletonLines /><SkeletonCard /><SkeletonTableRow /><SkeletonListItem /></SkeletonRoot>\n    <SkeletonGroup loading={false}><p>Document loaded.</p></SkeletonGroup>\n    <KiraSkeleton loading={false}><p>Workspace ready.</p></KiraSkeleton>\n  </div>;\n}\n';

export default function SkeletonPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Skeleton"
        version="v2.0.0"
        description="Loading shapes and boundaries that reserve space, coordinate motion and preserve useful content during refresh."
      />
      <FeatureGrid features={skeletonPageFeatureGridFeatures} />
      <DemoTabs tabs={demoTabs} defaultValue="basic" />
      <KeyboardShortcuts
        shortcuts={[
          {
            keys: "Tab / Shift+Tab",
            description:
              "Skip decorative placeholders. Reach demo controls and revealed content in normal document order.",
          },
          {
            keys: "Enter / Space",
            description:
              "Activate Pause, Resume, reload and recovery buttons (inherited from Base UI Button).",
          },
          {
            keys: "Tab / Type",
            description:
              "Edit the Refresh draft and start a refresh. Retained content keeps the same input and value.",
          },
        ]}
      />
      <UsageBlock code={usageCode} />
      <APIReference sections={apiSections} />
      <Changelog
        entries={[
          {
            version: "v2.1.0",
            date: "2026-11-18",
            changes: [
              {
                type: "added",
                title: "SkeletonButton size prop",
                description:
                  'size="xs" | "sm" | "default" | "lg" | "xl" maps the button bone to the control-height ladder (h-7/8/9/10/11), so placeholders match every button size.',
              },
            ],
          },
          {
            version: "v2.0.0",
            date: "2026-11-13",
            changes: [
              {
                type: "changed",
                title: "Audited against Base UI 1.9.0",
                description:
                  "No Skeleton primitive exists. Existing exports extend the stock placeholder model.",
              },
              {
                type: "fixed",
                title: "Motion and attribute ownership",
                description:
                  "animated=false stops shimmer; delay/duration reach the moving layer. Groups pause offscreen or when the tab is hidden. IDs, refs, styles and events stay on their preset wrapper.",
              },
              {
                type: "added",
                title: "KiraSkeleton",
                description:
                  "Delayed placeholders, optional minimum display, retained refresh content, preset/custom fallbacks and explicit space reservation.",
              },
              {
                type: "breaking",
                title: "Loading semantics and preset DOM",
                description:
                  "Root no longer makes its entire subtree role=status; one sibling status owns announcements. loading=false stops descendant animation. Preset props no longer repeat on child bones, slots identify each part, counts clamp to 0–100, automatic per-line stagger is removed, and decorative content is inert.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}

const skeletonPageFeatureGridFeatures = [
  {
    title: "Composable shapes",
    description: "Text, media, cards and rows share one decorative bone.",
    icon: <IconLayoutGrid className="size-4" />,
  },
  {
    title: "Considered timing",
    description:
      "Delay fast-request placeholders and optionally hold an already visible fallback.",
    icon: <IconClock className="size-4" />,
  },
  {
    title: "Retained content",
    description: "Keep useful content and drafts mounted during a refresh.",
    icon: <IconRefresh className="size-4" />,
  },
] satisfies React.ComponentProps<typeof FeatureGrid>["features"];
