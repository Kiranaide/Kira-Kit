import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import {
  ScrollArea,
  SimpleScrollArea,
  KiraScrollArea,
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollBar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
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

const releaseTasks = [
  "Review release notes",
  "Check keyboard navigation",
  "Approve translations",
  "Update migration guide",
  "Review contrast",
  "Publish changelog",
  "Notify maintainers",
  "Archive previous release",
];

const timelineStages = [
  { name: "Design review", day: 19 },
  { name: "Implementation", day: 21 },
  { name: "Accessibility", day: 23 },
  { name: "Translations", day: 25 },
  { name: "Release", day: 27 },
];

const serviceRows = Array.from({ length: 16 }, (_, index) => ({
  id: `worker-${String(index + 1).padStart(2, "0")}`,
  latency: 40 + index,
}));

const appearanceItems = [
  "item-1",
  "item-2",
  "item-3",
  "item-4",
  "item-5",
  "item-6",
];

const shadowNotes = [
  "note-1",
  "note-2",
  "note-3",
  "note-4",
  "note-5",
  "note-6",
  "note-7",
  "note-8",
];

const buildLines = Array.from({ length: 20 }, (_, index) => ({
  id: `line-${String(index).padStart(2, "0")}`,
  prefix: String(index).padStart(2, "0"),
}));

const stressNotes = Array.from({ length: 12 }, (_, index) => ({
  id: `stress-note-${index + 1}`,
  label: `review-${index + 1}-international-accessibility-migration@example.team · 日本語 · العربية`,
}));

function BasicDemo() {
  return (
    <ScrollArea
      className="h-56 rounded-lg border"
      aria-label="Release checklist"
      contentProps={{ className: "p-4 pe-6" }}
    >
      <ol className="space-y-4">
        {releaseTasks.map((task, index) => (
          <li key={task} className="flex gap-3 text-sm">
            <span className="tabular-nums text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{task}</span>
          </li>
        ))}
      </ol>
    </ScrollArea>
  );
}

const basicCode = `import { ScrollArea } from "@/components/ui/scroll-area"

const tasks = [
  "Review release notes",
  "Check keyboard navigation",
  "Approve translations",
  "Update migration guide",
]

export function BasicDemo() {
  return (
    <ScrollArea
      className="h-56 rounded-lg border"
      aria-label="Release checklist"
      contentProps={{ className: "p-4 pe-6" }}
    >
      <ol className="space-y-4">
        {tasks.map((task, index) => (
          <li key={task} className="flex gap-3 text-sm">
            <span className="tabular-nums text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{task}</span>
          </li>
        ))}
      </ol>
    </ScrollArea>
  )
}`;

function HorizontalDemo() {
  return (
    <ScrollArea
      className="h-40 rounded-lg border"
      orientation="horizontal"
      scrollShadows
      aria-label="Release timeline"
    >
      <ol className="flex w-max gap-6 p-4 pb-6">
        {timelineStages.map((stage) => (
          <li key={stage.name} className="w-40 space-y-2 border-s-2 ps-3">
            <p className="text-xs tabular-nums text-muted-foreground">
              October {stage.day}
            </p>
            <p className="text-sm font-medium">{stage.name}</p>
            <p className="text-xs text-muted-foreground">Release team</p>
          </li>
        ))}
      </ol>
    </ScrollArea>
  );
}

const horizontalCode = `import { ScrollArea } from "@/components/ui/scroll-area"

export function HorizontalDemo() {
  return (
    <ScrollArea
      className="h-40 rounded-lg border"
      orientation="horizontal"
      scrollShadows
      aria-label="Release timeline"
    >
      <ol className="flex w-max gap-6 p-4 pb-6">
        {stages.map((stage) => (
          <li key={stage.name} className="w-40 space-y-2 border-s-2 ps-3">
            <p className="text-xs tabular-nums text-muted-foreground">
              October {stage.day}
            </p>
            <p className="text-sm font-medium">{stage.name}</p>
          </li>
        ))}
      </ol>
    </ScrollArea>
  )
}`;

function BothAxesDemo() {
  return (
    <ScrollArea
      orientation="both"
      className="h-64 rounded-lg border"
      aria-label="Service comparison"
      scrollShadows
    >
      <table className="w-max min-w-full text-left text-sm">
        <thead>
          <tr>
            {["Service", "Region", "Version", "Latency", "Owner"].map(
              (heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap border-b px-6 py-3"
                >
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {serviceRows.map((row) => (
            <tr key={row.id}>
              <td className="whitespace-nowrap border-b px-6 py-3">{row.id}</td>
              <td className="whitespace-nowrap border-b px-6 py-3">
                Asia Pacific
              </td>
              <td className="border-b px-6 py-3">2.4.0</td>
              <td className="border-b px-6 py-3 tabular-nums">
                {row.latency} ms
              </td>
              <td className="whitespace-nowrap border-b px-6 py-3">
                Infrastructure team
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}

const bothCode = `import { ScrollArea } from "@/components/ui/scroll-area"

export function BothAxesDemo() {
  return (
    <ScrollArea
      orientation="both"
      className="h-64 rounded-lg border"
      aria-label="Service comparison"
      scrollShadows
    >
      <table className="w-max min-w-full text-left text-sm">
        {/* wide table columns and rows */}
      </table>
    </ScrollArea>
  )
}`;

function AppearanceDemo() {
  const sizes = ["thin", "default", "thick"] satisfies Array<
    ReactComponentProps<typeof ScrollArea>["scrollbarSize"]
  >;

  return (
    <div className="space-y-4">
      {sizes.map((size) => (
        <div key={size}>
          <p className="mb-2 text-sm font-medium">{size}</p>
          <ScrollArea
            className="h-28 rounded-lg border"
            scrollbarSize={size}
            scrollbarVisibility="hover"
            aria-label={`${size} scrollbar example`}
          >
            <div className="space-y-3 p-3 pe-6">
              {appearanceItems.map((id, index) => (
                <p key={id} className="text-sm text-muted-foreground">
                  Review item {index + 1}
                </p>
              ))}
            </div>
          </ScrollArea>
        </div>
      ))}
    </div>
  );
}

const appearanceCode = `import { ScrollArea } from "@/components/ui/scroll-area"

export function AppearanceDemo() {
  return (
    <div className="space-y-4">
      {(["thin", "default", "thick"] as const).map((size) => (
        <ScrollArea
          key={size}
          className="h-28 rounded-lg border"
          scrollbarSize={size}
          scrollbarVisibility="hover"
          aria-label={\`\${size} scrollbar example\`}
        >
          <div className="space-y-3 p-3 pe-6">{/* items */}</div>
        </ScrollArea>
      ))}
    </div>
  )
}`;

function ShadowsDemo() {
  return (
    <ScrollArea
      className="h-56 rounded-lg border bg-background"
      aria-label="Review notes"
      scrollShadows
      overflowEdgeThreshold={4}
    >
      <div className="space-y-4 p-4 pe-6">
        {shadowNotes.map((id, index) => (
          <section key={id}>
            <h3 className="text-sm font-medium">Review note {index + 1}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Keep the migration steps readable at narrow widths and make each
              action reachable from the keyboard.
            </p>
          </section>
        ))}
      </div>
    </ScrollArea>
  );
}

const shadowsCode = `import { ScrollArea } from "@/components/ui/scroll-area"

export function ShadowsDemo() {
  return (
    <ScrollArea
      className="h-56 rounded-lg border bg-background"
      aria-label="Review notes"
      scrollShadows
      overflowEdgeThreshold={4}
    >
      <div className="space-y-4 p-4 pe-6">{/* notes */}</div>
    </ScrollArea>
  )
}`;

function FollowDemo() {
  const [events, setEvents] = React.useState(() =>
    Array.from({ length: 18 }, (_, index) => ({
      id: index + 1,
      text: `Reviewed package ${index + 1} · no changes required.`,
    })),
  );

  const viewport = React.useRef<HTMLDivElement>(null);

  const append = () =>
    setEvents((current) => [
      ...current,
      {
        id: current.length + 1,
        text: `Received review update ${current.length + 1}.`,
      },
    ]);

  const grow = () =>
    setEvents((current) =>
      current.map((event, index) =>
        index === current.length - 1
          ? {
              ...event,
              text: `${event.text}\nAdditional details arrived for this review.`,
            }
          : event,
      ),
    );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={append}>
          Append event
        </Button>
        <Button size="sm" variant="outline" onClick={grow}>
          Grow latest event
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (viewport.current) viewport.current.scrollTop = 0;
          }}
        >
          Read earlier
        </Button>
      </div>
      <KiraScrollArea
        className="h-80"
        followOutput
        contentVersion={`${events.length}:${events[events.length - 1].text.length}`}
        viewportRef={viewport}
        aria-label="Review activity"
        scrollShadows
        contentProps={{ className: "p-4 pe-6" }}
      >
        <ol className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="flex items-start gap-3 text-sm">
              <span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
                {String(event.id).padStart(3, "0")}
              </span>
              <p className="min-w-0 whitespace-pre-wrap break-words">
                {event.text}
              </p>
            </li>
          ))}
        </ol>
      </KiraScrollArea>
    </div>
  );
}

const kiraCode = `import * as React from "react"
import { KiraScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

export function FollowDemo() {
  const [events, setEvents] = React.useState(initialEvents)
  const viewport = React.useRef<HTMLDivElement>(null)

  return (
    <KiraScrollArea
      className="h-80"
      followOutput
      contentVersion={\`\${events.length}:\${events[events.length - 1].text.length}\`}
      viewportRef={viewport}
      aria-label="Review activity"
      scrollShadows
      contentProps={{ className: "p-4 pe-6" }}
    >
      <ol className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="flex items-start gap-3 text-sm">
            <span>{event.text}</span>
          </li>
        ))}
      </ol>
    </KiraScrollArea>
  )
}`;

function CompositionDemo() {
  const viewport = React.useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-3">
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          viewport.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }}
      >
        Back to origin
      </Button>
      <ScrollAreaRoot orientation="both" className="h-56 rounded-lg border">
        <ScrollAreaViewport
          ref={viewport}
          render={<section />}
          aria-label="Build output"
        >
          <ScrollAreaContent className="space-y-2 p-4 pe-8">
            {buildLines.map((line) => (
              <p key={line.id} className="whitespace-nowrap font-mono text-xs">
                [{line.prefix}] checked
                packages/layout/components/scroll-area.tsx successfully
              </p>
            ))}
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <ScrollBar>
          <ScrollAreaThumb className="bg-primary/50" />
        </ScrollBar>
        <ScrollBar orientation="horizontal" />
        <ScrollAreaCorner />
      </ScrollAreaRoot>
    </div>
  );
}

const compositionCode = `import * as React from "react"
import {
  ScrollAreaRoot,
  ScrollAreaViewport,
  ScrollAreaContent,
  ScrollBar,
  ScrollAreaThumb,
  ScrollAreaCorner,
} from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

export function CompositionDemo() {
  const viewport = React.useRef<HTMLDivElement>(null)

  return (
    <div className="space-y-3">
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          viewport.current?.scrollTo({ top: 0, left: 0, behavior: "instant" })
        }}
      >
        Back to origin
      </Button>
      <ScrollAreaRoot orientation="both" className="h-56 rounded-lg border">
        <ScrollAreaViewport
          ref={viewport}
          render={<section />}
          aria-label="Build output"
        >
          <ScrollAreaContent className="space-y-2 p-4 pe-8">
            {/* build output lines */}
          </ScrollAreaContent>
        </ScrollAreaViewport>
        <ScrollBar>
          <ScrollAreaThumb className="bg-primary/50" />
        </ScrollBar>
        <ScrollBar orientation="horizontal" />
        <ScrollAreaCorner />
      </ScrollAreaRoot>
    </div>
  )
}`;

function RtlDemo() {
  return (
    <DirectionProvider direction="rtl">
      <ScrollArea
        dir="rtl"
        orientation="horizontal"
        className="h-36 rounded-lg border"
        aria-label="مراحل المراجعة"
        scrollShadows
      >
        <div className="flex w-max gap-6 p-4">
          {["التخطيط", "التصميم", "التنفيذ", "المراجعة", "الإصدار"].map(
            (stage) => (
              <p key={stage} className="w-40 border-s ps-4 text-sm">
                {stage}
              </p>
            ),
          )}
        </div>
      </ScrollArea>
    </DirectionProvider>
  );
}

const rtlCode = `import { DirectionProvider } from "@base-ui/react/direction-provider"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RtlDemo() {
  return (
    <DirectionProvider direction="rtl">
      <ScrollArea
        dir="rtl"
        orientation="horizontal"
        className="h-36 rounded-lg border"
        aria-label="مراحل المراجعة"
        scrollShadows
      >
        <div className="flex w-max gap-6 p-4">{/* RTL items */}</div>
      </ScrollArea>
    </DirectionProvider>
  )
}`;

function StressDemo() {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div className="max-w-xs space-y-4">
      <SimpleScrollArea
        className="h-20 rounded-lg border"
        aria-label="Empty activity"
      >
        <p className="p-4 text-sm text-muted-foreground">No activity yet.</p>
      </SimpleScrollArea>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setLoaded((value) => !value)}
        >
          {loaded ? "Clear example" : "Load example"}
        </Button>
        <Button size="sm" variant="outline" disabled>
          Disabled action
        </Button>
      </div>
      <ScrollArea
        className="h-40 rounded-lg border"
        aria-label="Loaded notes"
        scrollShadows
      >
        <div className="space-y-3 break-all p-4 pe-6 text-sm">
          {loaded ? (
            stressNotes.map((note) => <p key={note.id}>{note.label}</p>)
          ) : (
            <p className="text-muted-foreground">
              Select Load example to add notes.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

const stressCode = `import * as React from "react"
import { ScrollArea, SimpleScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"

export function StressDemo() {
  const [loaded, setLoaded] = React.useState(false)

  return (
    <div className="max-w-xs space-y-4">
      <SimpleScrollArea className="h-20 rounded-lg border" aria-label="Empty activity">
        <p className="p-4 text-sm text-muted-foreground">No activity yet.</p>
      </SimpleScrollArea>
      <Button size="sm" variant="outline" onClick={() => setLoaded((v) => !v)}>
        {loaded ? "Clear example" : "Load example"}
      </Button>
      <ScrollArea className="h-40 rounded-lg border" aria-label="Loaded notes" scrollShadows>
        <div className="space-y-3 break-all p-4 pe-6 text-sm">
          {loaded ? notes.map((note) => <p key={note.id}>{note.label}</p>) : "Empty"}
        </div>
      </ScrollArea>
    </div>
  )
}`;

const usageCode = `import { ScrollArea, KiraScrollArea } from "@/components/ui/scroll-area"

export function ActivityFeed() {
  return (
    <KiraScrollArea className="h-80" followOutput aria-label="Build activity">
      <p className="p-4">Build queued.</p>
    </KiraScrollArea>
  )
}`;

export default function ScrollAreaPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Scroll Area"
        description="Native scrolling with useful overflow cues and considerate activity following."
        version="v2.0.0"
      />

      <FeatureGrid
        features={scrollAreaPageFeatureGridFeatures}
        description="Base UI native scrolling primitives with Kira overflow cues and follow-output support."
      />

      <DemoTabs tabs={scrollAreaPageDemoTabs} defaultValue="basic" />

      <KeyboardShortcuts
        description="Base UI manages viewport focus; scrolling keys follow the browser's native scroll-container behavior."
        shortcuts={scrollAreaPageShortcuts}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Use ScrollArea for standard scrollable regions or KiraScrollArea for live activity feeds."
        notes={[
          {
            label: "ScrollArea vs KiraScrollArea",
            body: "Use ScrollArea (or SimpleScrollArea) for general vertical, horizontal, or two-axis overflow. Use KiraScrollArea when appending live logs or chat streams that need follow-output controls.",
          },
          {
            label: "Viewport refs and padding",
            body: "Pass viewportRef to read or set scrollTop/scrollLeft, and pass contentProps for inner content spacing.",
          },
        ]}
      />

      <APIReference
        sections={scrollAreaPageAPISections}
        description="Props, types, and defaults for every exported Scroll Area part."
      />

      <Changelog
        entries={scrollAreaPageChangelogEntries}
        title="Changelog"
        description="Version history for Scroll Area."
      />
    </ComponentPage>
  );
}

const scrollAreaPageFeatureGridFeatures = [
  {
    title: "Native interaction",
    description:
      "Base UI scrolling, touch support and focusable overflowing viewports.",
  },
  {
    title: "Clear overflow cues",
    description:
      "Vertical, horizontal and RTL layouts with optional edge indicators.",
  },
  {
    title: "Follow incoming activity",
    description: "Read earlier content without new events moving your place.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const scrollAreaPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="A scrollable activity list."
        description="The viewport receives an accessible name and becomes a tab stop only when it overflows."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "horizontal",
    label: "Horizontal",
    group: "Core",
    demo: (
      <DemoWrapper
        title="A horizontal release timeline."
        description="Wide content stays inside its viewport. Edge indicators show where more remains."
        code={horizontalCode}
      >
        <HorizontalDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "both",
    label: "Both axes",
    group: "Core",
    demo: (
      <DemoWrapper
        title="A wide comparison matrix."
        description="Both native scrollbars share a corner and respond to content size."
        code={bothCode}
      >
        <BothAxesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "appearance",
    label: "Scrollbars",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Thickness and visibility."
        description="Hover-only scrollbars also reveal while scrolling or when the viewport has keyboard focus."
        code={appearanceCode}
      >
        <AppearanceDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "shadows",
    label: "Overflow cues",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Keep the edges readable."
        description="Indicators appear only at edges with hidden content. Focus remains inside the viewport."
        code={shadowsCode}
      >
        <ShadowsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Follow output",
    group: "KiraScrollArea",
    demo: (
      <DemoWrapper
        title="Read incoming activity at your own pace."
        description="This local fixture appends events on demand. Scroll up, append another event, then return to latest."
        code={kiraCode}
      >
        <FollowDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "composition",
    label: "Composition",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Access every primitive part."
        description="Own the viewport ref, content spacing, custom thumb and both scrollbars."
        code={compositionCode}
      >
        <CompositionDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "rtl",
    label: "RTL",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="A right-to-left document strip."
        description="Base UI DirectionProvider owns the scrollbar's direction; indicators use logical edges."
        code={rtlCode}
      >
        <RtlDemo />
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
        description="Empty content, long unbroken strings, disabled controls, and dynamic overflow inside a max-w-xs column."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const scrollAreaPageShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description:
      "Focus overflowing viewports and content controls; fitting viewports are skipped (Base UI).",
  },
  {
    keys: "Arrow keys",
    description:
      "Scroll the focused viewport along an available axis (browser behavior).",
  },
  {
    keys: "Page Up / Page Down",
    description:
      "Scroll approximately one viewport vertically (browser behavior).",
  },
  {
    keys: "Home / End",
    description:
      "Move to the start or end of the focused vertical viewport (browser behavior).",
  },
  {
    keys: "Enter / Space",
    description:
      "Activate Jump to latest. Kira keeps the control outside the scrolling content.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const scrollAreaPageAPISections = [
  {
    title: "ScrollArea / SimpleScrollArea",
    props: [
      {
        prop: "orientation",
        type: '"vertical" | "horizontal" | "both"',
        default: '"vertical"',
        description:
          "Controls viewport overflow axes and renders matching native scrollbars.",
      },
      {
        prop: "scrollbarSize",
        type: '"thin" | "default" | "thick"',
        default: '"default"',
        description:
          "Track thickness; all sizes retain native touch/keyboard scrolling.",
      },
      {
        prop: "scrollbarVisibility",
        type: '"always" | "hover"',
        default: '"always"',
        description:
          "Hover mode also reveals on scrolling and focus. Fitting content has no scrollbar.",
      },
      {
        prop: "scrollShadows / overflowEdgeThreshold",
        type: "boolean / number | Partial<{ xStart: number; xEnd: number; yStart: number; yEnd: number }>",
        default: "false / 0",
        description:
          "Native overflow attributes drive edge indicators. Threshold is measured in pixels.",
      },
      {
        prop: "viewportRef / viewportProps / contentProps",
        type: "React.Ref<HTMLDivElement> / ScrollAreaViewportProps / ScrollAreaContentProps",
        default: "-",
        description:
          "Access scrolling geometry and customize the viewport/content. Use viewportRef for the viewport ref.",
      },
      {
        prop: "onScroll / onScrollCapture / tabIndex / role / aria-label / aria-labelledby",
        type: "native viewport attributes",
        default: "-",
        description:
          "Convenience props target the actual viewport. viewportProps takes precedence.",
      },
      {
        prop: "ref / className / style / render",
        type: "Base UI Root props",
        default: "-",
        description:
          "Target the outer Root. className/style support Base UI state functions. Base UI render replaces unsupported asChild.",
      },
    ],
  },
  {
    title: "KiraScrollArea",
    props: [
      {
        prop: "followOutput",
        type: "boolean",
        default: "false",
        description:
          "Vertical follow mode. Scrolls immediately to the end while pinned, pauses for history/focused content, and resumes at the end or with Jump to latest.",
      },
      {
        prop: "contentVersion",
        type: "string | number",
        default: "-",
        description:
          "Change for same-height content updates. Content growth and viewport resize are observed automatically.",
      },
      {
        prop: "onFollowingChange",
        type: "(following: boolean) => void",
        default: "-",
        description:
          "Reports changes between following and reading earlier content.",
      },
      {
        prop: "className / other ScrollArea props",
        type: "string / ScrollAreaProps without orientation",
        default: "-",
        description:
          "className styles the outer frame; remaining props reach the inner ScrollArea. Follow controls stay outside the scrolling viewport.",
      },
    ],
  },
  {
    title: "ScrollAreaRoot",
    props: [
      {
        prop: "orientation / scrollbarSize / scrollbarVisibility / scrollShadows",
        type: "same as ScrollArea",
        default: '"vertical" / "default" / "always" / false',
        description:
          "Supplies defaults to the composed parts. Add the matching ScrollBar parts yourself.",
      },
      {
        prop: "overflowEdgeThreshold / render / ref / className / style",
        type: "Base UI Root props",
        default: "-",
        description:
          "Native overflow state, polymorphism, root ref and state-aware styling.",
      },
    ],
  },
  {
    title: "ScrollAreaViewport",
    props: [
      {
        prop: "ref / onScroll / role / aria-label",
        type: "Base UI Viewport props",
        default: "-",
        description:
          "Actual scrolling element. Native keyboard scroll and overflow-dependent tab order; supply an accessible region name.",
      },
      {
        prop: "className / style / render",
        type: "Base UI Viewport props",
        default: "-",
        description:
          "State functions supported. Orientation styles may be explicitly overridden.",
      },
    ],
  },
  {
    title: "ScrollAreaContent",
    props: [
      {
        prop: "children / ref / className / style / render",
        type: "Base UI Content props",
        default: "-",
        description:
          "Measures content growth. Vertical default min-width is zero to preserve wrapping.",
      },
    ],
  },
  {
    title: "ScrollBar",
    props: [
      {
        prop: "orientation / scrollbarSize / keepMounted",
        type: '"vertical" | "horizontal" / ScrollbarSize / boolean',
        default: '"vertical" / inherited / false',
        description:
          "Native track and drag mechanics. Hidden from the accessibility tree by Base UI.",
      },
      {
        prop: "children / ref / render / className / style",
        type: "Base UI Scrollbar props",
        default: "-",
        description:
          "Supply a custom ScrollAreaThumb or use the default thumb.",
      },
    ],
  },
  {
    title: "ScrollAreaThumb",
    props: [
      {
        prop: "ref / render / className / style",
        type: "Base UI Thumb props",
        default: "-",
        description:
          "Native draggable thumb with semantic color, minimum length and gated hover feedback.",
      },
    ],
  },
  {
    title: "ScrollAreaCorner",
    props: [
      {
        prop: "ref / render / className / style",
        type: "Base UI Corner props",
        default: "-",
        description: "Fills the intersection when both scrollbars are present.",
      },
    ],
  },
  {
    title: "ScrollAreaOverflow / variants",
    props: [
      {
        prop: "ScrollAreaOverflow",
        type: "no props",
        default: "-",
        description:
          "Optional primitive-state indicators inside Root; scrollShadows renders this automatically. Do not add both.",
      },
      {
        prop: "scrollAreaVariants() / scrollBarVariants({ scrollbarSize })",
        type: "exported CVA functions",
        default: "-",
        description:
          "Shared root and scrollbar styling for custom compositions.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const scrollAreaPageChangelogEntries = [
  {
    version: "2.0.0",
    date: "13 November 2026",
    changes: [
      {
        type: "added",
        title: "Composable Base UI parts",
        description:
          "Root, Viewport, Content, ScrollBar, Thumb, Corner, overflow indicators and shared variants. Audited against Base UI 1.9.0.",
      },
      {
        type: "added",
        title: "Follow incoming activity",
        description:
          "KiraScrollArea follows content growth, pauses while reading history, and exposes one status plus Jump to latest. Includes local append and growth examples.",
      },
      {
        type: "fixed",
        title: "Honest sizing and documentation",
        description:
          "Three actual track widths, native focus semantics, complete API tables and focused snippets replace invalid CSS and unsupported claims.",
      },
      {
        type: "breaking",
        title: "The viewport now owns scrolling",
        description:
          "ScrollArea now has separate Root, Viewport and Content elements. Move DOM scrolling refs to viewportRef and content layout/padding to contentProps. onScroll and viewport naming props remain convenience aliases. SimpleScrollArea is retained. Automatic smooth scrolling is removed; callers can opt into motion with their own reduced-motion policy.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
