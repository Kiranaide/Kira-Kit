import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconCheck,
  IconSettings,
  IconLayoutAlignMiddle,
  IconDeviceMobile,
  IconArrowsMaximize,
  IconCode,
} from "@tabler/icons-react";

import { Center, KiraCenter } from "@/components/ui/center";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
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
    <div className="grid w-full gap-4 sm:grid-cols-2">
      <Center className="h-40 rounded-lg border">
        <p className="text-sm font-medium">Centered review summary</p>
      </Center>
      <Center type="grid" className="h-40 rounded-lg border">
        <p className="text-sm font-medium">Grid alignment</p>
      </Center>
    </div>
  );
}

const BasicDemoCode =
  'import { Center } from "@/components/ui/center";\n\nexport function BasicDemo() {\n  return <div className="grid w-full gap-4 sm:grid-cols-2">\n    <Center className="h-40 rounded-lg border"><p className="text-sm font-medium">Centered review summary</p></Center>\n    <Center type="grid" className="h-40 rounded-lg border"><p className="text-sm font-medium">Grid alignment</p></Center>\n  </div>;\n}';

function InlineDemo() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="space-y-4">
      <p className="text-sm">
        Reviewer status:{" "}
        <Center
          as="span"
          inline
          className="size-6 rounded-full bg-muted align-middle"
        >
          <IconCheck aria-hidden="true" className="size-4" />
        </Center>{" "}
        available
      </p>
      <Button variant="outline" onClick={() => setCount((value) => value + 1)}>
        <Center as="span" inline>
          <IconSettings aria-hidden="true" className="size-4" />
        </Center>
        Adjust review settings
      </Button>
      <output className="block text-sm text-muted-foreground">
        Settings opened {count} times in this local example.
      </output>
    </div>
  );
}

const InlineDemoCode =
  'import * as React from "react";\nimport { IconCheck, IconSettings } from "@tabler/icons-react";\nimport { Center } from "@/components/ui/center";\nimport { Button } from "@/components/ui/button";\n\nexport function InlineDemo() {\n  const [count, setCount] = React.useState(0);\n  return <div className="space-y-4">\n    <p className="text-sm">Reviewer status: <Center as="span" inline className="size-6 rounded-full bg-muted align-middle"><IconCheck aria-hidden="true" className="size-4" /></Center> available</p>\n    <Button variant="outline" onClick={() => setCount((value) => value + 1)}><Center as="span" inline><IconSettings aria-hidden="true" className="size-4" /></Center>Adjust review settings</Button>\n    <output className="block text-sm text-muted-foreground">Settings opened {count} times in this local example.</output>\n  </div>;\n}';

function AbsoluteDemo() {
  return (
    <div className="relative h-48 w-full rounded-lg border bg-muted/30">
      <p className="p-3 text-sm text-muted-foreground">
        Positioned preview frame
      </p>
      <Center
        type="absolute"
        className="rounded-md bg-background px-4 py-2 text-sm shadow-sm"
      >
        Preview unavailable
      </Center>
      <p className="absolute inset-x-3 bottom-3 text-xs text-muted-foreground">
        Absolute centering needs a positioned parent and does not protect
        oversized content.
      </p>
    </div>
  );
}

const AbsoluteDemoCode =
  'import { Center } from "@/components/ui/center";\n\nexport function AbsoluteDemo() {\n  return <div className="relative h-48 w-full rounded-lg border bg-muted/30">\n    <p className="p-3 text-sm text-muted-foreground">Positioned preview frame</p>\n    <Center type="absolute" className="rounded-md bg-background px-4 py-2 text-sm shadow-sm">Preview unavailable</Center>\n    <p className="absolute inset-x-3 bottom-3 text-xs text-muted-foreground">Absolute centering needs a positioned parent and does not protect oversized content.</p>\n  </div>;\n}';

function SafeDemo() {
  const [safe, setSafe] = React.useState(true);

  return (
    <div className="w-full max-w-md space-y-4">
      <Button
        variant="outline"
        aria-pressed={safe}
        onClick={() => setSafe((value) => !value)}
      >
        {safe ? "Show unsafe centering" : "Restore safe centering"}
      </Button>
      <Center
        safe={safe}
        className="h-48 overflow-auto rounded-lg border p-4"
        data-demo="safe-center"
      >
        <section className="w-full min-w-0 shrink-0 space-y-4">
          <h3 className="font-semibold">Access review checklist</h3>
          {[
            "Confirm the release owner",
            "Review external collaborators",
            "Check invitation expiry",
            "Inspect inherited permissions",
            "Record the approval rationale",
            "Notify workspace administrators",
          ].map((step) => (
            <p key={step} className="text-sm">
              {step}
            </p>
          ))}
          <Button variant="outline">Checklist complete</Button>
        </section>
      </Center>
      <p className="text-sm text-muted-foreground">
        Safe alignment keeps the first checklist item reachable when content is
        taller than the panel.
      </p>
    </div>
  );
}

const SafeDemoCode =
  'import * as React from "react";\nimport { Center } from "@/components/ui/center";\nimport { Button } from "@/components/ui/button";\n\nexport function SafeDemo() {\n  const [safe, setSafe] = React.useState(true);\n  return <div className="w-full max-w-md space-y-4">\n    <Button variant="outline" aria-pressed={safe} onClick={() => setSafe((value) => !value)}>{safe ? "Show unsafe centering" : "Restore safe centering"}</Button>\n    <Center safe={safe} className="h-48 overflow-auto rounded-lg border p-4" data-demo="safe-center">\n      <section className="w-full min-w-0 shrink-0 space-y-4">\n        <h3 className="font-semibold">Access review checklist</h3>\n        {["Confirm the release owner", "Review external collaborators", "Check invitation expiry", "Inspect inherited permissions", "Record the approval rationale", "Notify workspace administrators"].map((step) => <p key={step} className="text-sm">{step}</p>)}\n        <Button variant="outline">Checklist complete</Button>\n      </section>\n    </Center>\n    <p className="text-sm text-muted-foreground">Safe alignment keeps the first checklist item reachable when content is taller than the panel.</p>\n  </div>;\n}';

function ViewportDemo() {
  const [viewport, setViewport] = React.useState<"none" | "small" | "dynamic">(
    "none",
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["none", "small", "dynamic"] as const).map((value) => (
          <Button
            key={value}
            variant="outline"
            aria-pressed={viewport === value}
            onClick={() => setViewport(value)}
          >
            {
              {
                none: "Panel height",
                small: "Small viewport",
                dynamic: "Dynamic viewport",
              }[value]
            }
          </Button>
        ))}
      </div>
      <KiraCenter
        viewport={viewport}
        offset="8rem"
        safeArea
        width="sm"
        className={
          viewport === "none"
            ? "min-h-48 rounded-lg border"
            : "rounded-lg border"
        }
      >
        <div className="space-y-3">
          <h3 className="font-semibold">Workspace invitation</h3>
          <p className="text-sm text-muted-foreground">
            Small and dynamic modes reserve the viewport height minus an
            eight-rem app-chrome offset. This is a local layout fixture.
          </p>
        </div>
      </KiraCenter>
    </div>
  );
}

const ViewportDemoCode =
  'import * as React from "react";\nimport { KiraCenter } from "@/components/ui/center";\nimport { Button } from "@/components/ui/button";\n\nexport function ViewportDemo() {\n  const [viewport, setViewport] = React.useState<"none" | "small" | "dynamic">("none");\n  return <div className="w-full space-y-4">\n    <div className="flex flex-wrap gap-2">{(["none", "small", "dynamic"] as const).map((value) => <Button key={value} variant="outline" aria-pressed={viewport === value} onClick={() => setViewport(value)}>{{none: "Panel height", small: "Small viewport", dynamic: "Dynamic viewport"}[value]}</Button>)}</div>\n    <KiraCenter viewport={viewport} offset="8rem" safeArea width="sm" className={viewport === "none" ? "min-h-48 rounded-lg border" : "rounded-lg border"}>\n      <div className="space-y-3"><h3 className="font-semibold">Workspace invitation</h3><p className="text-sm text-muted-foreground">Small and dynamic modes reserve the viewport height minus an eight-rem app-chrome offset. This is a local layout fixture.</p></div>\n    </KiraCenter>\n  </div>;\n}';

function KiraDemo() {
  const [saved, setSaved] = React.useState(false);

  return (
    <KiraCenter
      width="md"
      padding="default"
      className="min-h-80 w-full rounded-lg border"
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
      >
        <div>
          <h3 className="font-semibold">Join the release review</h3>
          <p className="text-sm text-muted-foreground">
            Centered content with a bounded reading width.
          </p>
        </div>
        <label htmlFor="center-email" className="block text-sm font-medium">
          Work email
        </label>
        <Input
          id="center-email"
          type="email"
          autoComplete="email"
          name="email"
          required
          defaultValue="amara@example.com"
          onChange={() => setSaved(false)}
        />
        <Button type="submit">Save contact</Button>
        <output className="block text-sm text-muted-foreground">
          {saved
            ? "Contact saved in this local example."
            : "No invitation will be sent."}
        </output>
      </form>
    </KiraCenter>
  );
}

const KiraDemoCode =
  'import * as React from "react";\nimport { KiraCenter } from "@/components/ui/center";\nimport { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\n\nexport function KiraDemo() {\n  const [saved, setSaved] = React.useState(false);\n  return <KiraCenter width="md" padding="default" className="min-h-80 w-full rounded-lg border">\n    <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); setSaved(true); }}>\n      <div><h3 className="font-semibold">Join the release review</h3><p className="text-sm text-muted-foreground">Centered content with a bounded reading width.</p></div>\n      <label htmlFor="center-email" className="block text-sm font-medium">Work email</label>\n      <Input id="center-email" type="email" autoComplete="email" name="email" required defaultValue="amara@example.com" onChange={() => setSaved(false)} />\n      <Button type="submit">Save contact</Button>\n      <output className="block text-sm text-muted-foreground">{saved ? "Contact saved in this local example." : "No invitation will be sent."}</output>\n    </form>\n  </KiraCenter>;\n}';

function NativeDemo() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const [tag, setTag] = React.useState("Read the rendered element.");

  return (
    <div className="w-full space-y-4">
      <Center
        as="section"
        ref={sectionRef}
        render={<section aria-label="Release readiness" />}
        className="min-h-32 rounded-lg border"
      >
        <p className="text-sm">Ready for owner review.</p>
      </Center>
      <Button
        variant="outline"
        onClick={() =>
          setTag(sectionRef.current?.tagName.toLowerCase() ?? "No element")
        }
      >
        Read native ref
      </Button>
      <output className="ml-3 text-sm text-muted-foreground">{tag}</output>
    </div>
  );
}

const NativeDemoCode =
  'import * as React from "react";\nimport { Center } from "@/components/ui/center";\nimport { Button } from "@/components/ui/button";\n\nexport function NativeDemo() {\n  const sectionRef = React.useRef<HTMLElement>(null);\n  const [tag, setTag] = React.useState("Read the rendered element.");\n  return <div className="w-full space-y-4">\n    <Center as="section" ref={sectionRef} render={<section aria-label="Release readiness" />} className="min-h-32 rounded-lg border">\n      <p className="text-sm">Ready for owner review.</p>\n    </Center>\n    <Button variant="outline" onClick={() => setTag(sectionRef.current?.tagName.toLowerCase() ?? "No element")}>Read native ref</Button>\n    <output className="ml-3 text-sm text-muted-foreground">{tag}</output>\n  </div>;\n}';

function StatesDemo() {
  const [state, setState] = React.useState<
    "empty" | "loading" | "error" | "ready"
  >("empty");

  return (
    <div className="w-full max-w-80 space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["empty", "loading", "error", "ready"] as const).map((value) => (
          <Button
            key={value}
            variant="outline"
            aria-pressed={state === value}
            onClick={() => setState(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <KiraCenter
        width="full"
        padding="sm"
        className="min-h-64 rounded-lg border"
      >
        {state === "empty" && (
          <div className="space-y-3">
            <h3 className="font-semibold">No reviewers yet</h3>
            <p className="text-sm text-muted-foreground">
              Add a reviewer to start this local queue.
            </p>
            <Button variant="outline" onClick={() => setState("ready")}>
              Add reviewer
            </Button>
          </div>
        )}
        {state === "loading" && (
          <div className="space-y-3">
            <Spinner label="Loading reviewer details…" />
            <p className="text-sm text-muted-foreground">
              Loading reviewer details…
            </p>
          </div>
        )}
        {state === "error" && (
          <div className="space-y-3">
            <p role="alert" className="text-sm text-destructive">
              Reviewer details could not be loaded. Try again.
            </p>
            <Button variant="outline" onClick={() => setState("ready")}>
              Try again
            </Button>
          </div>
        )}
        {state === "ready" && (
          <div className="space-y-3">
            <output className="text-sm">Reviewer added.</output>
            <p className="wrap-anywhere text-sm">
              reviewer-with-a-very-long-workspace-address@example-platform-infrastructure.com
            </p>
            <Input
              aria-label="Read-only reviewer role"
              readOnly
              defaultValue="Release owner"
            />
            <Button variant="outline" disabled>
              Remove owner
            </Button>
            <p className="text-sm text-muted-foreground">
              The release needs an owner before this reviewer can be removed.
            </p>
          </div>
        )}
      </KiraCenter>
    </div>
  );
}

const StatesDemoCode =
  'import * as React from "react";\nimport { KiraCenter } from "@/components/ui/center";\nimport { Button } from "@/components/ui/button";\nimport { Input } from "@/components/ui/input";\nimport { Spinner } from "@/components/ui/spinner";\n\nexport function StatesDemo() {\n  const [state, setState] = React.useState<"empty" | "loading" | "error" | "ready">("empty");\n  return <div className="w-full max-w-80 space-y-4">\n    <div className="flex flex-wrap gap-2">{(["empty", "loading", "error", "ready"] as const).map((value) => <Button key={value} variant="outline" aria-pressed={state === value} onClick={() => setState(value)}>{value}</Button>)}</div>\n    <KiraCenter width="full" padding="sm" className="min-h-64 rounded-lg border">\n      {state === "empty" && <div className="space-y-3"><h3 className="font-semibold">No reviewers yet</h3><p className="text-sm text-muted-foreground">Add a reviewer to start this local queue.</p><Button variant="outline" onClick={() => setState("ready")}>Add reviewer</Button></div>}\n      {state === "loading" && <div className="space-y-3"><Spinner label="Loading reviewer details…" /><p className="text-sm text-muted-foreground">Loading reviewer details…</p></div>}\n      {state === "error" && <div className="space-y-3"><p role="alert" className="text-sm text-destructive">Reviewer details could not be loaded. Try again.</p><Button variant="outline" onClick={() => setState("ready")}>Try again</Button></div>}\n      {state === "ready" && <div className="space-y-3"><output className="text-sm">Reviewer added.</output><p className="wrap-anywhere text-sm">reviewer-with-a-very-long-workspace-address@example-platform-infrastructure.com</p><Input aria-label="Read-only reviewer role" readOnly defaultValue="Release owner" /><Button variant="outline" disabled>Remove owner</Button><p className="text-sm text-muted-foreground">The release needs an owner before this reviewer can be removed.</p></div>}\n    </KiraCenter>\n  </div>;\n}';

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <KiraCenter
        width="full"
        padding="sm"
        className="min-h-32 rounded-lg border"
      >
        <div className="space-y-2">
          <p className="text-sm font-medium wrap-anywhere">
            release-approval-pipeline-with-extended-unbreakable-identifier-2026@example.com
          </p>
          <p className="text-xs text-muted-foreground">
            Long unbreakable tokens wrap cleanly inside a max-w-xs container.
          </p>
          <Button variant="outline" disabled>
            Disabled action
          </Button>
        </div>
      </KiraCenter>
      <Center
        aria-label="Empty centered region"
        className="min-h-24 rounded-lg border border-dashed"
      />
    </div>
  );
}

const stressCode = `import { Center, KiraCenter } from "@/components/ui/center"
import { Button } from "@/components/ui/button"

export function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <KiraCenter width="full" padding="sm" className="min-h-32 rounded-lg border">
        <div className="space-y-2">
          <p className="text-sm font-medium wrap-anywhere">
            release-approval-pipeline-with-extended-unbreakable-identifier-2026@example.com
          </p>
          <Button variant="outline" disabled>
            Disabled action
          </Button>
        </div>
      </KiraCenter>
      <Center
        aria-label="Empty centered region"
        className="min-h-24 rounded-lg border border-dashed"
      />
    </div>
  )
}`;

const usageCode = `import {
  Center,
  KiraCenter,
  centerVariants,
  centerContentVariants,
  kiraCenterVariants,
} from "@/components/ui/center"

export function CenterPatterns() {
  return (
    <>
      <Center className="min-h-48">
        <p>Review summary</p>
      </Center>
      <Center as="span" inline className="size-6">
        <span aria-hidden="true">•</span>
      </Center>
      <KiraCenter as="main" viewport="dynamic" offset="4rem" safeArea width="md">
        <h1>Workspace invitation</h1>
        <p>Review the access request.</p>
      </KiraCenter>
      <div className={centerVariants({ type: "grid", safe: true })}>
        <p>Safe grid</p>
      </div>
      <div className={kiraCenterVariants({ padding: "sm" })}>
        <div className={centerContentVariants({ width: "prose" })}>
          Readable content
        </div>
      </div>
    </>
  )
}`;

export default function CenterPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Center"
        description="Reachable centering for review panels, inline content and forms in changing mobile viewports."
        version="v2.0.0"
      />

      <FeatureGrid
        features={centerPageFeatures}
        description="Overflow-safe centering primitives and viewport-aware layout frames."
      />

      <DemoTabs defaultValue="basic" tabs={centerPageDemoTabs} />

      <KeyboardShortcuts
        description="Center controls placement; child controls retain their native keyboard behavior."
        shortcuts={centerPageShortcuts}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Import Center or KiraCenter and compose with native elements."
        notes={[
          {
            label: "Center",
            body: "Use Center for low-level flex, grid, inline, or absolute centering with overflow-safe alignment enabled by default.",
          },
          {
            label: "KiraCenter",
            body: "Use KiraCenter for full-viewport forms, empty states, and focused views that need bounded reading widths, app-chrome offsets, and device safe-area gutters.",
          },
        ]}
      />

      <APIReference
        sections={centerPageAPISections}
        description="Props, types, and defaults for Center and KiraCenter."
      />

      <Changelog
        entries={centerPageChangelogEntries}
        title="Changelog"
        description="Version history and migration notes for Center."
      />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const centerPageFeatures = [
  {
    title: "Safe centering",
    description: "Oversized flex/grid content stays aligned to the start.",
    icon: <IconLayoutAlignMiddle className="size-5" aria-hidden="true" />,
  },
  {
    title: "Viewport-aware",
    description: "Dynamic/small viewport height and safe-area gutters.",
    icon: <IconDeviceMobile className="size-5" aria-hidden="true" />,
  },
  {
    title: "Bounded content",
    description: "KiraCenter provides a quiet, readable content frame.",
    icon: <IconArrowsMaximize className="size-5" aria-hidden="true" />,
  },
  {
    title: "Native composition",
    description: "Typed tags, refs and Base UI render adapters.",
    icon: <IconCode className="size-5" aria-hidden="true" />,
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const centerPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Basic"
        description="Flex and grid centering for bounded panels."
        code={BasicDemoCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "inline",
    label: "Inline",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Inline"
        description="Inline content uses a semantic span; interactive actions use the shared Button."
        code={InlineDemoCode}
      >
        <InlineDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "absolute",
    label: "Absolute",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Absolute"
        description="An explicit absolute technique inside a positioned preview frame."
        code={AbsoluteDemoCode}
      >
        <AbsoluteDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "KiraCenter",
    group: "KiraCenter",
    demo: (
      <DemoWrapper
        title="KiraCenter"
        description="A local contact form with a bounded content width."
        code={KiraDemoCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "viewport",
    label: "Viewport",
    group: "KiraCenter",
    demo: (
      <DemoWrapper
        title="Viewport"
        description="Small/dynamic viewport height, app-chrome offset and safe-area gutters."
        code={ViewportDemoCode}
      >
        <ViewportDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "safe",
    label: "Safe overflow",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Safe overflow"
        description="Compare safe and unsafe alignment in an overflowing panel."
        code={SafeDemoCode}
      >
        <SafeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "native",
    label: "Native",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Native"
        description="Render composition and a native section ref."
        code={NativeDemoCode}
      >
        <NativeDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="States"
        description="Actionable empty/error fixtures, shared Spinner, read-only state and long values."
        code={StatesDemoCode}
      >
        <StatesDemo />
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
        description="Long unbreakable text, disabled controls, and empty centered content inside a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const centerPageShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description:
      "Reach child controls in document order. Center itself adds no tab stop.",
  },
  {
    keys: "Enter",
    description:
      "Submit the local contact form; native email validation still applies.",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate mode, recovery and ref buttons through the shared Base UI Button.",
  },
  {
    keys: "Tab through long content",
    description:
      "With Safe overflow enabled, the first and last checklist controls remain reachable by scrolling.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const nativeApi = [
  {
    prop: "as / render / ref",
    type: "CenterElement / useRender.RenderProp / native element ref",
    default: '"div"',
    description:
      "Native div, span, section, main or article attributes with Base UI prop/ref composition.",
  },
  {
    prop: "safe",
    type: "boolean",
    default: "true",
    description:
      "Overflow-safe alignment in flex/grid modes. Absolute mode uses transform centering and ignores safe; bound its content yourself.",
  },
  {
    prop: "className / style / children",
    type: "string / React.CSSProperties / React.ReactNode",
    default: "-",
    description:
      "Caller layout and native content; Center adds no widget roles or focus behavior.",
  },
];

const centerPageAPISections = [
  {
    title: "Center",
    props: [
      ...nativeApi,
      {
        prop: "type",
        type: '"flex" | "grid" | "absolute"',
        default: '"flex"',
        description:
          "Absolute mode requires a positioned ancestor and does not reserve flow space.",
      },
      {
        prop: "inline",
        type: "boolean",
        default: "false",
        description:
          "Inline-flex or inline-grid display. Has no effect in absolute mode.",
      },
    ],
  },
  {
    title: "KiraCenter",
    props: [
      ...nativeApi,
      {
        prop: "viewport",
        type: '"none" | "small" | "dynamic"',
        default: '"none"',
        description:
          "Minimum height from 100svh or 100dvh; content may grow beyond it.",
      },
      {
        prop: "offset",
        type: "string",
        default: '"0px"',
        description:
          "CSS length of app chrome to subtract from viewport height; negative computed heights clamp to zero.",
      },
      {
        prop: "width",
        type: '"sm" | "md" | "prose" | "full"',
        default: '"md"',
        description: "Content wrapper maximum width; prose uses 65ch.",
      },
      {
        prop: "padding",
        type: '"none" | "sm" | "default" | "lg"',
        default: '"default"',
        description: "Existing zero, 3, 6 and 8 spacing tokens.",
      },
      {
        prop: "safeArea",
        type: "boolean",
        default: "false",
        description:
          "Each physical gutter is the larger of padding and its device safe-area inset. The host controls viewport-fit.",
      },
      {
        prop: "contentClassName",
        type: "string",
        default: "-",
        description: "Styles the bounded center-content wrapper.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const centerPageChangelogEntries = [
  {
    version: "2.0.0",
    date: "15 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Native composition and honest examples",
        description:
          "Typed refs/render adapters, shared display classes, compiling snippets and accessible shared controls replace faux dialog/icon-button examples. Audited against Base UI 1.9.0.",
      },
      {
        type: "added",
        title: "Safe and viewport-aware Center",
        description:
          "Safe flex/grid overflow alignment and KiraCenter content widths, viewport heights, offsets and safe-area gutters. Research cutoff October 31, 2026.",
      },
      {
        type: "breaking",
        title: "Overflow defaults to safe alignment",
        description:
          "Oversized flex/grid content now aligns toward the start instead of extending behind the scroll origin. Use safe={false} for the previous alignment. Absolute behavior is retained.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
