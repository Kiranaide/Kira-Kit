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

function BasicDemo() {
  const tasks = [
    "Review release notes",
    "Check keyboard navigation",
    "Approve translations",
    "Update migration guide",
    "Review contrast",
    "Publish changelog",
    "Notify maintainers",
    "Archive previous release",
  ];

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
  );
}

const basicCode =
  'import { ScrollArea } from "@/components/ui/scroll-area";\nexport default function BasicDemo() {\n    const tasks = ["Review release notes", "Check keyboard navigation", "Approve translations", "Update migration guide", "Review contrast", "Publish changelog", "Notify maintainers", "Archive previous release"];\n    return <ScrollArea className="h-56 rounded-lg border" aria-label="Release checklist" contentProps={{ className: "p-4 pe-6" }}>\n    <ol className="space-y-4">{tasks.map((task, index) => <li key={task} className="flex gap-3 text-sm"><span className="tabular-nums text-muted-foreground">{String(index + 1).padStart(2, "0")}</span><span>{task}</span></li>)}</ol>\n  </ScrollArea>;\n}\n';

function HorizontalDemo() {
  const stages = [
    "Design review",
    "Implementation",
    "Accessibility",
    "Translations",
    "Release",
  ];

  return (
    <ScrollArea
      className="h-40 rounded-lg border"
      orientation="horizontal"
      scrollShadows
      aria-label="Release timeline"
    >
      <ol className="flex w-max gap-6 p-4 pb-6">
        {stages.map((stage, index) => (
          <li key={stage} className="w-40 space-y-2 border-s-2 ps-3">
            <p className="text-xs tabular-nums text-muted-foreground">
              October {19 + index * 2}
            </p>
            <p className="text-sm font-medium">{stage}</p>
            <p className="text-xs text-muted-foreground">Release team</p>
          </li>
        ))}
      </ol>
    </ScrollArea>
  );
}

const horizontalCode =
  'import { ScrollArea } from "@/components/ui/scroll-area";\nexport default function HorizontalDemo() {\n    const stages = ["Design review", "Implementation", "Accessibility", "Translations", "Release"];\n    return <ScrollArea className="h-40 rounded-lg border" orientation="horizontal" scrollShadows aria-label="Release timeline">\n    <ol className="flex w-max gap-6 p-4 pb-6">{stages.map((stage, index) => <li key={stage} className="w-40 space-y-2 border-s-2 ps-3"><p className="text-xs tabular-nums text-muted-foreground">October {19 + index * 2}</p><p className="text-sm font-medium">{stage}</p><p className="text-xs text-muted-foreground">Release team</p></li>)}</ol>\n  </ScrollArea>;\n}\n';

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
          {Array.from({ length: 16 }, (_, index) => (
            <tr key={index}>
              <td className="whitespace-nowrap border-b px-6 py-3">
                worker-{String(index + 1).padStart(2, "0")}
              </td>
              <td className="whitespace-nowrap border-b px-6 py-3">
                Asia Pacific
              </td>
              <td className="border-b px-6 py-3">2.4.0</td>
              <td className="border-b px-6 py-3 tabular-nums">
                {40 + index} ms
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

const bothCode =
  'import { ScrollArea } from "@/components/ui/scroll-area";\nexport default function BothAxesDemo() {\n    return <ScrollArea orientation="both" className="h-64 rounded-lg border" aria-label="Service comparison" scrollShadows>\n    <table className="w-max min-w-full text-left text-sm">\n      <thead><tr>{["Service", "Region", "Version", "Latency", "Owner"].map((heading) => <th key={heading} className="whitespace-nowrap border-b px-6 py-3">{heading}</th>)}</tr></thead>\n      <tbody>{Array.from({ length: 16 }, (_, index) => <tr key={index}><td className="whitespace-nowrap border-b px-6 py-3">worker-{String(index + 1).padStart(2, "0")}</td><td className="whitespace-nowrap border-b px-6 py-3">Asia Pacific</td><td className="border-b px-6 py-3">2.4.0</td><td className="border-b px-6 py-3 tabular-nums">{40 + index} ms</td><td className="whitespace-nowrap border-b px-6 py-3">Infrastructure team</td></tr>)}</tbody>\n    </table>\n  </ScrollArea>;\n}\n';

function AppearanceDemo() {
  const sizes = ["thin", "default", "thick"] satisfies Array<
    React.ComponentProps<typeof ScrollArea>["scrollbarSize"]
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
            aria-label={size + " scrollbar example"}
          >
            <div className="space-y-3 p-3 pe-6">
              {Array.from({ length: 6 }, (_, index) => (
                <p key={index} className="text-sm text-muted-foreground">
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

const appearanceCode =
  'import * as React from "react";\nimport { ScrollArea } from "@/components/ui/scroll-area";\nexport default function AppearanceDemo() {\n    const sizes = ["thin", "default", "thick"] satisfies Array<React.ComponentProps<typeof ScrollArea>["scrollbarSize"]>;\n    return <div className="space-y-4">{sizes.map((size) => <div key={size}>\n    <p className="mb-2 text-sm font-medium">{size}</p>\n    <ScrollArea className="h-28 rounded-lg border" scrollbarSize={size} scrollbarVisibility="hover" aria-label={size + " scrollbar example"}>\n      <div className="space-y-3 p-3 pe-6">{Array.from({ length: 6 }, (_, index) => <p key={index} className="text-sm text-muted-foreground">Review item {index + 1}</p>)}</div>\n    </ScrollArea>\n  </div>)}</div>;\n}\n';

function ShadowsDemo() {
  return (
    <ScrollArea
      className="h-56 rounded-lg border bg-background"
      aria-label="Review notes"
      scrollShadows
      overflowEdgeThreshold={4}
    >
      <div className="space-y-4 p-4 pe-6">
        {Array.from({ length: 8 }, (_, index) => (
          <section key={index}>
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

const shadowsCode =
  'import { ScrollArea } from "@/components/ui/scroll-area";\nexport default function ShadowsDemo() {\n    return <ScrollArea className="h-56 rounded-lg border bg-background" aria-label="Review notes" scrollShadows overflowEdgeThreshold={4}>\n    <div className="space-y-4 p-4 pe-6">{Array.from({ length: 8 }, (_, index) => <section key={index}><h3 className="text-sm font-medium">Review note {index + 1}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">Keep the migration steps readable at narrow widths and make each action reachable from the keyboard.</p></section>)}</div>\n  </ScrollArea>;\n}\n';

function FollowDemo() {
  const [events, setEvents] = React.useState(() =>
    Array.from({ length: 18 }, (_, index) => ({
      id: index + 1,
      text: "Reviewed package " + (index + 1) + " · no changes required.",
    })),
  );

  const viewport = React.useRef<HTMLDivElement>(null);

  const append = () =>
    setEvents((current) => [
      ...current,
      {
        id: current.length + 1,
        text: "Received review update " + (current.length + 1) + ".",
      },
    ]);

  const grow = () =>
    setEvents((current) =>
      current.map((event, index) =>
        index === current.length - 1
          ? {
              ...event,
              text:
                event.text + "\nAdditional details arrived for this review.",
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
        contentVersion={
          events.length + ":" + events[events.length - 1].text.length
        }
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

const kiraCode =
  'import * as React from "react";\nimport { KiraScrollArea } from "@/components/ui/scroll-area";\nimport { Button } from "@/components/ui/button";\nexport default function FollowDemo() {\n    const [events, setEvents] = React.useState(() => Array.from({ length: 18 }, (_, index) => ({ id: index + 1, text: "Reviewed package " + (index + 1) + " · no changes required." })));\n    const viewport = React.useRef<HTMLDivElement>(null);\n    const append = () => setEvents((current) => [...current, { id: current.length + 1, text: "Received review update " + (current.length + 1) + "." }]);\n    const grow = () => setEvents((current) => current.map((event, index) => index === current.length - 1 ? { ...event, text: event.text + "\\nAdditional details arrived for this review." } : event));\n    return <div className="space-y-3">\n    <div className="flex flex-wrap gap-2">\n      <Button size="sm" onClick={append}>Append event</Button>\n      <Button size="sm" variant="outline" onClick={grow}>Grow latest event</Button>\n      <Button size="sm" variant="ghost" onClick={() => {\n            if (viewport.current)\n                viewport.current.scrollTop = 0;\n        }}>Read earlier</Button>\n    </div>\n    <KiraScrollArea className="h-80" followOutput contentVersion={events.length + ":" + events[events.length - 1].text.length} viewportRef={viewport} aria-label="Review activity" scrollShadows contentProps={{ className: "p-4 pe-6" }}>\n      <ol className="space-y-4">{events.map((event) => <li key={event.id} className="flex items-start gap-3 text-sm"><span className="shrink-0 font-mono text-xs tabular-nums text-muted-foreground">{String(event.id).padStart(3, "0")}</span><p className="min-w-0 whitespace-pre-wrap break-words">{event.text}</p></li>)}</ol>\n    </KiraScrollArea>\n  </div>;\n}\n';

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
            {Array.from({ length: 20 }, (_, index) => (
              <p key={index} className="whitespace-nowrap font-mono text-xs">
                [{String(index).padStart(2, "0")}] checked
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

const compositionCode =
  'import * as React from "react";\nimport { ScrollAreaRoot, ScrollAreaViewport, ScrollAreaContent, ScrollBar, ScrollAreaThumb, ScrollAreaCorner } from "@/components/ui/scroll-area";\nimport { Button } from "@/components/ui/button";\nexport default function CompositionDemo() {\n    const viewport = React.useRef<HTMLDivElement>(null);\n    return <div className="space-y-3">\n    <Button size="sm" variant="outline" onClick={() => { viewport.current?.scrollTo({ top: 0, left: 0, behavior: "instant" }); }}>Back to origin</Button>\n    <ScrollAreaRoot orientation="both" className="h-56 rounded-lg border">\n      <ScrollAreaViewport ref={viewport} role="region" aria-label="Build output">\n        <ScrollAreaContent className="space-y-2 p-4 pe-8">\n          {Array.from({ length: 20 }, (_, index) => <p key={index} className="whitespace-nowrap font-mono text-xs">[{String(index).padStart(2, "0")}] checked packages/layout/components/scroll-area.tsx successfully</p>)}\n        </ScrollAreaContent>\n      </ScrollAreaViewport>\n      <ScrollBar><ScrollAreaThumb className="bg-primary/50"/></ScrollBar>\n      <ScrollBar orientation="horizontal"/>\n      <ScrollAreaCorner />\n    </ScrollAreaRoot>\n  </div>;\n}\n';

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

const rtlCode =
  'import { DirectionProvider } from "@base-ui/react/direction-provider";\nimport { ScrollArea } from "@/components/ui/scroll-area";\nexport default function RtlDemo() {\n    return <DirectionProvider direction="rtl">\n    <ScrollArea dir="rtl" orientation="horizontal" className="h-36 rounded-lg border" aria-label="مراحل المراجعة" scrollShadows>\n      <div className="flex w-max gap-6 p-4">{["التخطيط", "التصميم", "التنفيذ", "المراجعة", "الإصدار"].map((stage) => <p key={stage} className="w-40 border-s ps-4 text-sm">{stage}</p>)}</div>\n    </ScrollArea>\n  </DirectionProvider>;\n}\n';

function StatesDemo() {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div className="max-w-sm space-y-4">
      <SimpleScrollArea
        className="h-20 rounded-lg border"
        aria-label="Empty activity"
      >
        <p className="p-4 text-sm text-muted-foreground">No activity yet.</p>
      </SimpleScrollArea>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setLoaded((value) => !value)}
      >
        {loaded ? "Clear example" : "Load example"}
      </Button>
      <ScrollArea
        className="h-40 rounded-lg border"
        aria-label="Loaded notes"
        scrollShadows
      >
        <div className="space-y-3 break-all p-4 pe-6 text-sm">
          {loaded ? (
            Array.from({ length: 12 }, (_, index) => (
              <p key={index}>
                review-{index + 1}
                -international-accessibility-migration@example.team · 日本語 ·
                العربية
              </p>
            ))
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

const statesCode =
  'import * as React from "react";\nimport { ScrollArea, SimpleScrollArea } from "@/components/ui/scroll-area";\nimport { Button } from "@/components/ui/button";\nexport default function StatesDemo() {\n    const [loaded, setLoaded] = React.useState(false);\n    return <div className="max-w-sm space-y-4">\n    <SimpleScrollArea className="h-20 rounded-lg border" aria-label="Empty activity"><p className="p-4 text-sm text-muted-foreground">No activity yet.</p></SimpleScrollArea>\n    <Button size="sm" variant="outline" onClick={() => setLoaded((value) => !value)}>{loaded ? "Clear example" : "Load example"}</Button>\n    <ScrollArea className="h-40 rounded-lg border" aria-label="Loaded notes" scrollShadows>\n      <div className="space-y-3 break-all p-4 pe-6 text-sm">{loaded ? Array.from({ length: 12 }, (_, index) => <p key={index}>review-{index + 1}-international-accessibility-migration@example.team · 日本語 · العربية</p>) : <p className="text-muted-foreground">Select Load example to add notes.</p>}</div>\n    </ScrollArea>\n  </div>;\n}\n';

const demoTabs = [
  {
    value: "basic",
    label: "Basic",
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
    label: "Kira · Follow output",
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
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper
        title="Fitting, empty and changing content."
        description="No scrollbars are needed for fitting content. Loading more content updates native measurements."
        code={statesCode}
      >
        <StatesDemo />
      </DemoWrapper>
    ),
  },
];

const apiSections = [
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
        description:
          "Access scrolling geometry and customize the viewport/content. Use viewportRef for the viewport ref.",
      },
      {
        prop: "onScroll / onScrollCapture / tabIndex / role / aria-label / aria-labelledby",
        type: "native viewport attributes",
        description:
          "Convenience props target the actual viewport. viewportProps takes precedence.",
      },
      {
        prop: "ref / className / style / render",
        type: "Base UI Root props",
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
        description:
          "Change for same-height content updates. Content growth and viewport resize are observed automatically.",
      },
      {
        prop: "onFollowingChange",
        type: "(following: boolean) => void",
        description:
          "Reports changes between following and reading earlier content.",
      },
      {
        prop: "className / other ScrollArea props",
        type: "string / ScrollAreaProps without orientation",
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
        description:
          "Supplies defaults to the composed parts. Add the matching ScrollBar parts yourself.",
      },
      {
        prop: "overflowEdgeThreshold / render / ref / className / style",
        type: "Base UI Root props",
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
        description:
          "Actual scrolling element. Native keyboard scroll and overflow-dependent tab order; supply an accessible region name.",
      },
      {
        prop: "className / style / render",
        type: "Base UI Viewport props",
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
        description:
          "Optional primitive-state indicators inside Root; scrollShadows renders this automatically. Do not add both.",
      },
      {
        prop: "scrollAreaVariants() / scrollBarVariants({ scrollbarSize })",
        type: "exported CVA functions",
        description:
          "Shared root and scrollbar styling for custom compositions.",
      },
    ],
  },
];

// oxlint-disable-next-line max-lines-per-function -- Static documentation keeps related examples and API tables together for comparison.
export default function ScrollAreaPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Scroll Area"
        description="Native scrolling with useful overflow cues and considerate activity following."
        version="2.0.0"
      />
      <FeatureGrid features={scrollAreaPageFeatureGridFeatures} />
      <DemoTabs tabs={demoTabs} defaultValue="basic" />
      <KeyboardShortcuts
        description="Base UI manages viewport focus; scrolling keys follow the browser's native scroll-container behavior."
        shortcuts={[
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
        ]}
      />
      <UsageBlock
        code={
          'import { KiraScrollArea } from "@/components/ui/scroll-area";\nexport default function Activity() {\n    return (<KiraScrollArea className="h-80" followOutput aria-label="Build activity">\n      <p className="p-4">Build queued.</p>\n    </KiraScrollArea>);\n}\n'
        }
      />
      <APIReference sections={apiSections} />
      <Changelog
        entries={[
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
        ]}
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
] satisfies React.ComponentProps<typeof FeatureGrid>["features"];
