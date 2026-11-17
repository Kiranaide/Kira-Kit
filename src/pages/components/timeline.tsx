import * as React from "react";
import { IconList, IconLayoutColumns, IconHistory } from "@tabler/icons-react";
import {
  Timeline,
  TimelineItem,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
  TimelineActions,
  TimelineAvatar,
  KiraTimeline,
  type TimelineItemData,
  type TimelineProps,
} from "@/components/ui/timeline";
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

const releaseEvents: TimelineItemData[] = [
  {
    id: "review",
    title: "Release reviewed",
    datetime: "2026-10-29T09:00:00Z",
    status: "success",
    description: "Mina approved the accessibility fixes and release notes.",
    avatar: { alt: "Mina Park", fallback: "MP" },
  },
  {
    id: "build",
    title: "Production build completed",
    datetime: "2026-10-29T09:12:00Z",
    status: "success",
    description: "The signed artifact is ready for the staging environment.",
  },
  {
    id: "deploy",
    title: "Staging health check needs attention",
    datetime: "2026-10-30T10:00:00Z",
    status: "warning",
    description:
      "The search worker did not report readiness. Review the logs before continuing.",
  },
];

function BasicDemo() {
  const [note, setNote] = React.useState("");

  return (
    <Timeline aria-label="Release activity" size="lg">
      <TimelineItem status="success">
        <TimelineDot />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTitle>Changes approved</TimelineTitle>
          <TimelineTime datetime="2026-10-29T09:00:00Z" timeZone="UTC" />
          <TimelineAvatar alt="Mina Park" fallback="MP" />
          <TimelineDescription>
            Accessibility review completed.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem status="info">
        <TimelineDot />
        <TimelineConnector />
        <TimelineContent>
          <TimelineTitle>Release notes available</TimelineTitle>
          <TimelineDescription>
            Review the rollout checklist before publishing.
          </TimelineDescription>
          <TimelineActions>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setNote("Checklist reviewed. The release is ready for staging.")
              }
            >
              Review checklist
            </Button>
          </TimelineActions>
          <output className="block text-xs text-muted-foreground">
            {note}
          </output>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}

const basicCode =
  'import * as React from "react";\nimport { Timeline, TimelineItem, TimelineDot, TimelineConnector, TimelineContent, TimelineTime, TimelineTitle, TimelineDescription, TimelineActions, TimelineAvatar } from "@/components/ui/timeline";\nimport { Button } from "@/components/ui/button";\n\nexport default function BasicDemo() {\n  const [note, setNote] = React.useState("");\n  return <Timeline aria-label="Release activity" size="lg">\n    <TimelineItem status="success"><TimelineDot /><TimelineConnector /><TimelineContent>\n      <TimelineTitle>Changes approved</TimelineTitle><TimelineTime datetime="2026-10-29T09:00:00Z" timeZone="UTC" />\n      <TimelineAvatar alt="Mina Park" fallback="MP" /><TimelineDescription>Accessibility review completed.</TimelineDescription>\n    </TimelineContent></TimelineItem>\n    <TimelineItem status="info"><TimelineDot /><TimelineConnector /><TimelineContent>\n      <TimelineTitle>Release notes available</TimelineTitle><TimelineDescription>Review the rollout checklist before publishing.</TimelineDescription>\n      <TimelineActions><Button size="sm" variant="outline" onClick={() => setNote("Checklist reviewed. The release is ready for staging.")}>Review checklist</Button></TimelineActions>\n      <p role="status" className="text-xs text-muted-foreground">{note}</p>\n    </TimelineContent></TimelineItem>\n  </Timeline>;\n}\n';

function LayoutsDemo() {
  const [layout, setLayout] =
    React.useState<TimelineProps["layout"]>("alternating");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["left", "right", "alternating", "centered"] as const).map(
          (value) => (
            <Button
              key={value}
              size="sm"
              variant="outline"
              aria-pressed={layout === value}
              onClick={() => setLayout(value)}
            >
              {value}
            </Button>
          ),
        )}
      </div>
      <Timeline items={releaseEvents} layout={layout} size="lg" />
      <p className="text-xs text-muted-foreground">
        Alternating and centered rails stack at narrow widths. Event order stays
        the same.
      </p>
      <Timeline
        items={releaseEvents}
        orientation="horizontal"
        size="lg"
        aria-label="Horizontal release history"
        tabIndex={0}
      />
    </div>
  );
}

const layoutsCode =
  'import * as React from "react";\nimport { Timeline, type TimelineItemData, type TimelineProps } from "@/components/ui/timeline";\nimport { Button } from "@/components/ui/button";\n\nconst releaseEvents: TimelineItemData[] = [\n  { id: "review", title: "Release reviewed", datetime: "2026-10-29T09:00:00Z", status: "success", description: "Mina approved the accessibility fixes and release notes.", avatar: { alt: "Mina Park", fallback: "MP" } },\n  { id: "build", title: "Production build completed", datetime: "2026-10-29T09:12:00Z", status: "success", description: "The signed artifact is ready for the staging environment." },\n  { id: "deploy", title: "Staging health check needs attention", datetime: "2026-10-30T10:00:00Z", status: "warning", description: "The search worker did not report readiness. Review the logs before continuing." },\n];\n\nexport default function LayoutsDemo() {\n  const [layout, setLayout] = React.useState<TimelineProps["layout"]>("alternating");\n  return <div className="space-y-6">\n    <div className="flex flex-wrap gap-2">{(["left", "right", "alternating", "centered"] as const).map((value) => <Button key={value} size="sm" variant="outline" aria-pressed={layout === value} onClick={() => setLayout(value)}>{value}</Button>)}</div>\n    <Timeline items={releaseEvents} layout={layout} size="lg" />\n    <p className="text-xs text-muted-foreground">Alternating and centered rails stack at narrow widths. Event order stays the same.</p>\n    <Timeline items={releaseEvents} orientation="horizontal" size="lg" aria-label="Horizontal release history" tabIndex={0} />\n  </div>;\n}\n';

const connectorVariants = {
  default: "solid",
  compact: "dashed",
  minimal: "gradient",
} as const;

function DensityDemo() {
  const [size, setSize] =
    React.useState<NonNullable<TimelineProps["size"]>>("lg");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(["sm", "default", "lg", "xl"] as const).map((value) => (
          <Button
            key={value}
            size="sm"
            variant="outline"
            aria-pressed={size === value}
            onClick={() => setSize(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        {(["default", "compact", "minimal"] as const).map((variant) => (
          <div key={variant} className="min-w-0 space-y-4">
            <p className="text-sm font-medium">{variant}</p>
            <Timeline
              variant={variant}
              size={size}
              connectorVariant={connectorVariants[variant]}
              items={releaseEvents.slice(0, 2)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const densityCode =
  'import * as React from "react";\nimport { Timeline, type TimelineItemData, type TimelineProps } from "@/components/ui/timeline";\nimport { Button } from "@/components/ui/button";\n\nconst releaseEvents: TimelineItemData[] = [\n  { id: "review", title: "Release reviewed", datetime: "2026-10-29T09:00:00Z", status: "success", description: "Mina approved the accessibility fixes and release notes.", avatar: { alt: "Mina Park", fallback: "MP" } },\n  { id: "build", title: "Production build completed", datetime: "2026-10-29T09:12:00Z", status: "success", description: "The signed artifact is ready for the staging environment." },\n  { id: "deploy", title: "Staging health check needs attention", datetime: "2026-10-30T10:00:00Z", status: "warning", description: "The search worker did not report readiness. Review the logs before continuing." },\n];\n\nexport default function DensityDemo() {\n  const [size, setSize] = React.useState<NonNullable<TimelineProps["size"]>>("lg");\n  return <div className="space-y-6">\n    <div className="flex flex-wrap gap-2">{(["sm", "default", "lg", "xl"] as const).map((value) => <Button key={value} size="sm" variant="outline" aria-pressed={size === value} onClick={() => setSize(value)}>{value}</Button>)}</div>\n    <div className="grid gap-6 lg:grid-cols-3">{(["default", "compact", "minimal"] as const).map((variant) => <div key={variant} className="min-w-0 space-y-4"><p className="text-sm font-medium">{variant}</p><Timeline variant={variant} size={size} connectorVariant={connectorVariants[variant]} items={releaseEvents.slice(0, 2)} /></div>)}</div>\n  </div>;\n}\n';

function GroupingDemo() {
  const [group, setGroup] = React.useState<"day" | "week" | "month" | "year">(
    "day",
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(["day", "week", "month", "year"] as const).map((value) => (
          <Button
            key={value}
            size="sm"
            variant="outline"
            aria-pressed={group === value}
            onClick={() => setGroup(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <Timeline
        items={releaseEvents}
        groupBy={group}
        timeZone="America/New_York"
        locale="en-US"
        weekStartsOn={1}
      />
    </div>
  );
}

const groupingCode =
  'import * as React from "react";\nimport { Timeline, type TimelineItemData } from "@/components/ui/timeline";\nimport { Button } from "@/components/ui/button";\n\nconst releaseEvents: TimelineItemData[] = [\n  { id: "review", title: "Release reviewed", datetime: "2026-10-29T09:00:00Z", status: "success", description: "Mina approved the accessibility fixes and release notes.", avatar: { alt: "Mina Park", fallback: "MP" } },\n  { id: "build", title: "Production build completed", datetime: "2026-10-29T09:12:00Z", status: "success", description: "The signed artifact is ready for the staging environment." },\n  { id: "deploy", title: "Staging health check needs attention", datetime: "2026-10-30T10:00:00Z", status: "warning", description: "The search worker did not report readiness. Review the logs before continuing." },\n];\n\nexport default function GroupingDemo() {\n  const [group, setGroup] = React.useState<"day" | "week" | "month" | "year">("day");\n  return <div className="space-y-4">\n    <div className="flex flex-wrap gap-2">{(["day", "week", "month", "year"] as const).map((value) => <Button key={value} size="sm" variant="outline" aria-pressed={group === value} onClick={() => setGroup(value)}>{value}</Button>)}</div>\n    <Timeline items={releaseEvents} groupBy={group} timeZone="America/New_York" locale="en-US" weekStartsOn={1} />\n  </div>;\n}\n';

function DisclosureDemo() {
  const [collapsed, setCollapsed] = React.useState(true);

  return (
    <div className="space-y-4">
      <Button
        size="sm"
        variant="outline"
        onClick={() => setCollapsed((value) => !value)}
      >
        {collapsed ? "Expand evidence" : "Collapse evidence"}
      </Button>
      <Timeline collapsible size="lg">
        <TimelineItem
          status="warning"
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
        >
          <TimelineDot />
          <TimelineConnector />
          <TimelineContent summary="Inspect the failed health check">
            <TimelineDescription>
              The worker exceeded its readiness deadline.
            </TimelineDescription>
            <a
              href="#timeline-recovery"
              className="text-sm underline underline-offset-4"
            >
              Read the recovery note
            </a>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem collapsible={false} status="success">
          <TimelineDot />
          <TimelineConnector />
          <TimelineContent summary="Approval stays visible">
            <TimelineDescription>
              This event overrides the timeline's disclosure setting.
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem
          disabled
          disabledReason="Detailed logs become available when the worker finishes."
          defaultCollapsed
        >
          <TimelineDot />
          <TimelineContent summary="Worker logs">
            <TimelineDescription>
              Logs are still being collected.
            </TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
      <p id="timeline-recovery" className="text-xs text-muted-foreground">
        Recovery note: restart the staging worker, then repeat the health check.
      </p>
    </div>
  );
}

const disclosureCode =
  'import * as React from "react";\nimport { Timeline, TimelineItem, TimelineDot, TimelineConnector, TimelineContent, TimelineDescription } from "@/components/ui/timeline";\nimport { Button } from "@/components/ui/button";\n\nexport default function DisclosureDemo() {\n  const [collapsed, setCollapsed] = React.useState(true);\n  return <div className="space-y-4">\n    <Button size="sm" variant="outline" onClick={() => setCollapsed((value) => !value)}>{collapsed ? "Expand evidence" : "Collapse evidence"}</Button>\n    <Timeline collapsible size="lg">\n      <TimelineItem status="warning" collapsed={collapsed} onCollapsedChange={setCollapsed}><TimelineDot /><TimelineConnector /><TimelineContent summary="Inspect the failed health check">\n        <TimelineDescription>The worker exceeded its readiness deadline.</TimelineDescription><a href="#timeline-recovery" className="text-sm underline underline-offset-4">Read the recovery note</a>\n      </TimelineContent></TimelineItem>\n      <TimelineItem collapsible={false} status="success"><TimelineDot /><TimelineConnector /><TimelineContent summary="Approval stays visible"><TimelineDescription>This event overrides the timeline\'s disclosure setting.</TimelineDescription></TimelineContent></TimelineItem>\n      <TimelineItem disabled disabledReason="Detailed logs become available when the worker finishes." defaultCollapsed><TimelineDot /><TimelineContent summary="Worker logs"><TimelineDescription>Logs are still being collected.</TimelineDescription></TimelineContent></TimelineItem>\n    </Timeline>\n    <p id="timeline-recovery" className="text-xs text-muted-foreground">Recovery note: restart the staging worker, then repeat the health check.</p>\n  </div>;\n}\n';

function DatesDemo() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium">Upcoming event</p>
        <TimelineTime
          datetime="2026-10-31T14:00:00Z"
          now="2026-10-31T12:00:00Z"
          relative
        />
      </div>
      <div>
        <p className="text-sm font-medium">
          Older event uses the absolute date
        </p>
        <TimelineTime
          datetime="2026-10-01T09:00:00Z"
          now="2026-10-31T12:00:00Z"
          relative
          timeZone="UTC"
        />
      </div>
      <div>
        <p className="text-sm font-medium">Japanese locale, Tokyo time</p>
        <TimelineTime
          datetime="2026-10-31T12:00:00Z"
          locale="ja-JP"
          timeZone="Asia/Tokyo"
        />
      </div>
      <div>
        <p className="text-sm font-medium">Missing source date</p>
        <TimelineTime
          datetime="not-a-date"
          invalidLabel="Timestamp not supplied by the service"
        />
      </div>
    </div>
  );
}

const datesCode =
  'import { TimelineTime } from "@/components/ui/timeline";\n\nexport default function DatesDemo() {\n  return <div className="space-y-4">\n    <div><p className="text-sm font-medium">Upcoming event</p><TimelineTime datetime="2026-10-31T14:00:00Z" now="2026-10-31T12:00:00Z" relative /></div>\n    <div><p className="text-sm font-medium">Older event uses the absolute date</p><TimelineTime datetime="2026-10-01T09:00:00Z" now="2026-10-31T12:00:00Z" relative timeZone="UTC" /></div>\n    <div><p className="text-sm font-medium">Japanese locale, Tokyo time</p><TimelineTime datetime="2026-10-31T12:00:00Z" locale="ja-JP" timeZone="Asia/Tokyo" /></div>\n    <div><p className="text-sm font-medium">Missing source date</p><TimelineTime datetime="not-a-date" invalidLabel="Timestamp not supplied by the service" /></div>\n  </div>;\n}\n';

function VirtualizedDemo() {
  const items: TimelineItemData[] = Array.from({ length: 150 }, (_, index) => ({
    id: `event-${index}`,
    title: `Artifact ${index + 1} verified`,
    datetime: `2026-10-${String(1 + Math.floor(index / 10)).padStart(2, "0")}T09:00:00Z`,
    status: "success",
    description:
      index % 3 === 0
        ? "The build passed signature verification, accessibility checks, and the integration smoke run. This longer event demonstrates measured rows and text wrapping."
        : "Signature verification passed.",
    collapsible: true,
    defaultCollapsed: index % 3 !== 0,
  }));

  return (
    <Timeline
      items={items}
      virtualized
      groupBy="day"
      timeZone="UTC"
      size="lg"
      estimateSize={140}
      aria-label="150 artifact checks"
    />
  );
}

const virtualizedCode =
  'import { Timeline, type TimelineItemData } from "@/components/ui/timeline";\n\nexport default function VirtualizedDemo() {\n  const items: TimelineItemData[] = Array.from({ length: 150 }, (_, index) => ({\n    id: `event-${index}`, title: `Artifact ${index + 1} verified`, datetime: `2026-10-${String(1 + Math.floor(index / 10)).padStart(2, "0")}T09:00:00Z`, status: "success",\n    description: index % 3 === 0 ? "The build passed signature verification, accessibility checks, and the integration smoke run. This longer event demonstrates measured rows and text wrapping." : "Signature verification passed.",\n    collapsible: true, defaultCollapsed: index % 3 !== 0,\n  }));\n  return <Timeline items={items} virtualized groupBy="day" timeZone="UTC" size="lg" estimateSize={140} aria-label="150 artifact checks" />;\n}\n';

function KiraDemo() {
  const [items, setItems] = React.useState(releaseEvents);
  const [fail, setFail] = React.useState(true);
  const [hasMore, setHasMore] = React.useState(true);

  const loadOlder = async (signal: AbortSignal) => {
    await new Promise<void>((resolve, reject) => {
      const abort = () => {
        clearTimeout(timer);
        reject(new DOMException("Cancelled", "AbortError"));
      };

      const timer = setTimeout(() => {
        signal.removeEventListener("abort", abort);
        resolve();
      }, 900);

      signal.addEventListener("abort", abort, { once: true });
    });

    if (signal.aborted) return;

    if (fail)
      throw new Error(
        "The history service did not respond. Disable the simulated failure and try again.",
      );
    setItems((current) => [
      ...current,
      {
        id: "draft",
        title: "Release draft created",
        datetime: "2026-10-28T08:00:00Z",
        status: "info",
        description: "The team opened the release checklist.",
      },
    ]);
    setHasMore(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Illustrative history service with a 900 ms response.
      </p>
      <Button
        size="sm"
        variant="outline"
        aria-pressed={fail}
        onClick={() => setFail((value) => !value)}
      >
        Simulated failure: {fail ? "on" : "off"}
      </Button>
      <KiraTimeline
        items={items}
        label="Release history"
        size="lg"
        hasMore={hasMore}
        onLoadMore={loadOlder}
      />
    </div>
  );
}

const kiraCode =
  'import * as React from "react";\nimport { KiraTimeline, type TimelineItemData } from "@/components/ui/timeline";\nimport { Button } from "@/components/ui/button";\n\nconst releaseEvents: TimelineItemData[] = [\n  { id: "review", title: "Release reviewed", datetime: "2026-10-29T09:00:00Z", status: "success", description: "Mina approved the accessibility fixes and release notes.", avatar: { alt: "Mina Park", fallback: "MP" } },\n  { id: "build", title: "Production build completed", datetime: "2026-10-29T09:12:00Z", status: "success", description: "The signed artifact is ready for the staging environment." },\n  { id: "deploy", title: "Staging health check needs attention", datetime: "2026-10-30T10:00:00Z", status: "warning", description: "The search worker did not report readiness. Review the logs before continuing." },\n];\n\nexport default function KiraDemo() {\n  const [items, setItems] = React.useState(releaseEvents);\n  const [fail, setFail] = React.useState(true);\n  const [hasMore, setHasMore] = React.useState(true);\n  const loadOlder = async (signal: AbortSignal) => {\n    await new Promise<void>((resolve, reject) => {\n      const abort = () => { clearTimeout(timer); reject(new DOMException("Cancelled", "AbortError")) };\n      const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve() }, 900);\n      signal.addEventListener("abort", abort, { once: true });\n    });\n    if (signal.aborted) return;\n    if (fail) throw new Error("The history service did not respond. Disable the simulated failure and try again.");\n    setItems((current) => [...current, { id: "draft", title: "Release draft created", datetime: "2026-10-28T08:00:00Z", status: "info", description: "The team opened the release checklist." }]);\n    setHasMore(false);\n  };\n  return <div className="space-y-4">\n    <p className="text-xs text-muted-foreground">Illustrative history service with a 900 ms response.</p>\n    <Button size="sm" variant="outline" aria-pressed={fail} onClick={() => setFail((value) => !value)}>Simulated failure: {fail ? "on" : "off"}</Button>\n    <KiraTimeline items={items} label="Release history" size="lg" hasMore={hasMore} onLoadMore={loadOlder} />\n  </div>;\n}\n';

function StatesDemo() {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="min-w-0 space-y-3">
        <h3 className="text-sm font-medium">Initial loading</h3>
        <KiraTimeline items={[]} loading />
      </div>
      <div className="min-w-0 space-y-3">
        <h3 className="text-sm font-medium">Empty history</h3>
        <KiraTimeline
          items={[]}
          empty="No deployment events. Start a release to create the first event."
        />
      </div>
      <div className="min-w-0 space-y-3">
        <h3 className="text-sm font-medium">
          Long labels and a blocked action
        </h3>
        <KiraTimeline
          items={[
            {
              id: "long",
              title:
                "Internationalisation_Quality_Assurance_Release_Candidate_2026_10_31_Final_Approval",
              status: "pending",
              description:
                "等待审核 · ตรวจสอบการเผยแพร่ · Approval is still pending.",
            },
          ]}
          hasMore
          onLoadMore={async () => {}}
          loadMoreDisabledReason="Connect to the history service to load older events."
        />
      </div>
      <div className="min-w-0 space-y-3">
        <h3 className="text-sm font-medium">Every event status</h3>
        <Timeline
          variant="compact"
          size="lg"
          items={(
            [
              "default",
              "success",
              "warning",
              "error",
              "info",
              "active",
              "pending",
            ] as const
          ).map((status) => ({ id: status, title: status, status }))}
        />
      </div>
    </div>
  );
}

const statesCode =
  'import { Timeline, KiraTimeline } from "@/components/ui/timeline";\n\nexport default function StatesDemo() {\n  return <div className="grid gap-8 lg:grid-cols-2">\n    <div className="min-w-0 space-y-3"><h3 className="text-sm font-medium">Initial loading</h3><KiraTimeline items={[]} loading /></div>\n    <div className="min-w-0 space-y-3"><h3 className="text-sm font-medium">Empty history</h3><KiraTimeline items={[]} empty="No deployment events. Start a release to create the first event." /></div>\n    <div className="min-w-0 space-y-3"><h3 className="text-sm font-medium">Long labels and a blocked action</h3><KiraTimeline\n      items={[{ id: "long", title: "Internationalisation_Quality_Assurance_Release_Candidate_2026_10_31_Final_Approval", status: "pending", description: "等待审核 · ตรวจสอบการเผยแพร่ · Approval is still pending." }]}\n      hasMore onLoadMore={async () => {}} loadMoreDisabledReason="Connect to the history service to load older events."\n    /></div>\n    <div className="min-w-0 space-y-3"><h3 className="text-sm font-medium">Every event status</h3><Timeline variant="compact" size="lg" items={(["default", "success", "warning", "error", "info", "active", "pending"] as const).map((status) => ({ id: status, title: status, status }))} /></div>\n  </div>;\n}\n';

const demoTabs = [
  {
    value: "basic",
    label: "Basic",
    demo: (
      <DemoWrapper title="Release activity" code={basicCode}>
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "layouts",
    label: "Layouts",
    demo: (
      <DemoWrapper title="Rails and horizontal history" code={layoutsCode}>
        <LayoutsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "density",
    label: "Density",
    demo: (
      <DemoWrapper title="Sizes, spacing and connectors" code={densityCode}>
        <DensityDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "grouping",
    label: "Grouping",
    demo: (
      <DemoWrapper
        title="Calendar groups"
        description="Group dates in a chosen timezone; Monday starts the week in this example."
        code={groupingCode}
      >
        <GroupingDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "disclosure",
    label: "Disclosure",
    demo: (
      <DemoWrapper title="Inspect event details" code={disclosureCode}>
        <DisclosureDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "dates",
    label: "Dates",
    demo: (
      <DemoWrapper title="Localized and incomplete timestamps" code={datesCode}>
        <DatesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "virtualized",
    label: "Virtualized",
    demo: (
      <DemoWrapper
        title="A measured event history"
        description="Expand an event, scroll it away, and return. Its disclosure state remains."
        code={virtualizedCode}
      >
        <VirtualizedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    demo: (
      <DemoWrapper
        title="Load older events"
        description="Cancel a pending request or recover from a service error while keeping the current events."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "states",
    label: "States",
    demo: (
      <DemoWrapper
        title="Loading, empty and constrained histories"
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
    type: "React.ComponentProps<element>",
    description:
      "Forwarded to the named part. Custom className extends its styles.",
  },
];

const timelineProps = [
  ...nativeProps,
  {
    prop: "items / children",
    type: "TimelineItemData<T>[] / ReactNode",
    description:
      "Data-driven events or compound children. Items take precedence.",
  },
  {
    prop: "orientation",
    type: '"vertical" | "horizontal"',
    default: '"vertical"',
    description: "Horizontal histories scroll inside the root.",
  },
  {
    prop: "layout",
    type: '"left" | "right" | "alternating" | "centered"',
    default: '"left"',
    description:
      "Vertical rail position. Alternating and centered stack below md; horizontal uses left.",
  },
  {
    prop: "variant",
    type: '"default" | "compact" | "minimal"',
    default: '"default"',
    description: "Event spacing and connector emphasis.",
  },
  {
    prop: "size",
    type: '"sm" | "default" | "lg" | "xl"',
    default: '"default"',
    description: "Dot and rail geometry.",
  },
  {
    prop: "connectorVariant",
    type: '"solid" | "dashed" | "gradient"',
    default: '"solid"',
    description: "Connector presentation.",
  },
  {
    prop: "collapsible / animate",
    type: "boolean / boolean",
    default: "false / true",
    description:
      "Default disclosure behavior and shared collapse motion. No entrance animation.",
  },
  {
    prop: "virtualized / estimateSize",
    type: "boolean / number",
    default: "false / 120",
    description:
      "Measured virtual rows and initial pixel estimate. Compound children are not virtualized.",
  },
  {
    prop: "groupBy",
    type: '"day" | "week" | "month" | "year" | ((item: TimelineItemData<T>) => string)',
    description:
      "Groups data in first-seen group order; renderItem receives the displayed index.",
  },
  {
    prop: "locale / timeZone / weekStartsOn",
    type: "string / string / 0 | 1 | 2 | 3 | 4 | 5 | 6",
    default: "browser / browser / 0",
    description: "Intl locale/timezone and first weekday for calendar groups.",
  },
  {
    prop: "renderItem",
    type: "(item: TimelineItemData<T>, index: number) => ReactNode",
    description:
      "Return a TimelineItem. The custom item owns its disclosure state.",
  },
];

const apiSections = [
  ...["Timeline", "TimelineRoot"].map((title) => ({
    title,
    props: timelineProps,
  })),
  {
    title: "TimelineItemData<T>",
    props: [
      {
        prop: "id / title",
        type: "string / string",
        description: "Unique stable identity and summary.",
      },
      {
        prop: "datetime / description / statusLabel",
        type: "Date | string / string / string",
        description: "Optional timestamp, body and visible status wording.",
      },
      {
        prop: "status",
        type: '"default" | "success" | "warning" | "error" | "info" | "active" | "pending"',
        description: "Status text and dot appearance.",
      },
      {
        prop: "icon / actions / details",
        type: "ReactNode",
        description:
          "Decorative dot, application actions and optional disclosure content.",
      },
      {
        prop: "avatar",
        type: "{ src?: string; alt: string; fallback?: string }",
        description: "Shared avatar plus visible author name.",
      },
      {
        prop: "collapsible / defaultCollapsed / disabled",
        type: "boolean",
        description:
          "Per-event disclosure settings. Disabled affects the disclosure trigger.",
      },
      {
        prop: "disabledReason / data",
        type: "string / T",
        description:
          "Visible disclosure explanation and application data for custom rendering.",
      },
    ],
  },
  {
    title: "TimelineItem",
    props: [
      ...nativeProps,
      {
        prop: "status",
        type: '"default" | "success" | "warning" | "error" | "info" | "active" | "pending"',
        default: '"default"',
        description: "Inherited by the dot.",
      },
      {
        prop: "collapsible / defaultCollapsed / collapsed",
        type: "boolean",
        description:
          "Override root disclosure, initial state, or controlled state.",
      },
      {
        prop: "onCollapsedChange",
        type: "(collapsed: boolean) => void",
        description: "Runs on a disclosure change.",
      },
      {
        prop: "disabled / disabledReason",
        type: "boolean / string",
        description:
          "Disable the disclosure and show a keyboard/touch-readable explanation.",
      },
    ],
  },
  {
    title: "TimelineDot",
    props: [
      ...nativeProps,
      {
        prop: "status / children",
        type: "TimelineStatus / ReactNode",
        description:
          "Override inherited status or its decorative icon. Size comes from Timeline.",
      },
    ],
  },
  {
    title: "TimelineConnector",
    props: [
      ...nativeProps,
      {
        prop: "variant",
        type: '"solid" | "dashed" | "gradient"',
        description: "Override root style; the final connector is hidden.",
      },
    ],
  },
  {
    title: "TimelineContent",
    props: [
      ...nativeProps,
      {
        prop: "summary",
        type: "ReactNode",
        description:
          "Disclosure label or static heading. Without summary, a collapsible item uses the first child as its label.",
      },
    ],
  },
  {
    title: "TimelineTime",
    props: [
      ...nativeProps,
      {
        prop: "datetime",
        type: "Date | string",
        description:
          "Required event timestamp; invalid values render invalidLabel.",
      },
      {
        prop: "format",
        type: "Intl.DateTimeFormatOptions",
        default: '{ dateStyle: "medium", timeStyle: "short" }',
        description: "Options for absolute date formatting.",
      },
      {
        prop: "relative / now",
        type: "boolean / Date | string",
        default: "false / mount time",
        description:
          "Signed relative time for dates within seven days. Supply now to refresh or render deterministically on the server.",
      },
      {
        prop: "locale / timeZone / invalidLabel",
        type: "string",
        description:
          "Intl settings and invalid-date text (default: Date unavailable).",
      },
    ],
  },
  ...["TimelineTitle", "TimelineDescription", "TimelineActions"].map(
    (title) => ({ title, props: nativeProps }),
  ),
  {
    title: "TimelineAvatar",
    props: [
      ...nativeProps,
      {
        prop: "src / alt / fallback",
        type: "string",
        description:
          "Image source, visible author name and initials. Base UI owns image loading/recovery.",
      },
    ],
  },
  {
    title: "KiraTimeline",
    props: [
      {
        prop: "Timeline props",
        type: "TimelineProps<T>",
        description:
          "Event presentation and root attributes; items is required and children is omitted.",
      },
      {
        prop: "loading / error / empty",
        type: "boolean / string / ReactNode",
        description:
          "Initial skeleton, external error and empty-history content.",
      },
      {
        prop: "label",
        type: "string",
        default: '"Activity history"',
        description: "Accessible name of the busy history region.",
      },
      {
        prop: "hasMore / onLoadMore",
        type: "boolean / ((signal: AbortSignal) => Promise<void>)",
        description:
          "Show history loading. Owner appends events and honors cancellation before committing results.",
      },
      {
        prop: "loadMoreDisabledReason",
        type: "string",
        description: "Disable history loading with a visible explanation.",
      },
    ],
  },
];

const usageCode =
  'import { Timeline, TimelineRoot, TimelineItem, TimelineDot, TimelineConnector, TimelineContent, TimelineTime, TimelineTitle, TimelineDescription, TimelineActions, TimelineAvatar, KiraTimeline, type TimelineItemData } from "@/components/ui/timeline";\n\nconst releaseEvents: TimelineItemData[] = [\n  { id: "review", title: "Release reviewed", datetime: "2026-10-29T09:00:00Z", status: "success", description: "Mina approved the accessibility fixes and release notes.", avatar: { alt: "Mina Park", fallback: "MP" } },\n  { id: "build", title: "Production build completed", datetime: "2026-10-29T09:12:00Z", status: "success", description: "The signed artifact is ready for the staging environment." },\n  { id: "deploy", title: "Staging health check needs attention", datetime: "2026-10-30T10:00:00Z", status: "warning", description: "The search worker did not report readiness. Review the logs before continuing." },\n];\n\nexport default function AllPartsExample() {\n  return <div className="space-y-6">\n    <Timeline items={releaseEvents} />\n    <TimelineRoot size="lg"><TimelineItem><TimelineDot /><TimelineConnector /><TimelineContent>\n      <TimelineTitle>Release approved</TimelineTitle><TimelineTime datetime="2026-10-31T09:00:00Z" />\n      <TimelineAvatar alt="Mina Park" fallback="MP" /><TimelineDescription>Staging checks passed.</TimelineDescription>\n      <TimelineActions><a href="/components/timeline">Open history</a></TimelineActions>\n    </TimelineContent></TimelineItem></TimelineRoot>\n    <KiraTimeline items={releaseEvents} label="Release history" />\n  </div>;\n}\n';

export default function TimelinePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Timeline"
        version="v2.0.0"
        description="Readable event histories with measured virtualization, native disclosures and recoverable loading."
      />
      <FeatureGrid features={timelinePageFeatureGridFeatures} />
      <DemoTabs tabs={demoTabs} defaultValue="basic" />
      <KeyboardShortcuts
        shortcuts={[
          {
            keys: "Tab / Shift+Tab",
            description:
              "Move between event actions, disclosure controls and scrollable regions. Static events are not tab stops.",
          },
          {
            keys: "Enter / Space",
            description:
              "Toggle a disclosure (inherited from Base UI Collapsible) or activate a focused button.",
          },
          {
            keys: "Arrow keys / Home / End / Page Up / Page Down",
            description:
              "Native scrolling when the virtual viewport is focused. Kira does not implement feed-style article navigation.",
          },
          {
            keys: "Tab / Enter",
            description:
              "Reach Cancel loading during a request, then Try again after a service error.",
          },
        ]}
      />
      <UsageBlock code={usageCode} />
      <APIReference sections={apiSections} />
      <Changelog
        entries={[
          {
            version: "v2.0.0",
            date: "2026-11-13",
            changes: [
              {
                type: "changed",
                title: "Audited against Base UI 1.9.0",
                description:
                  "Shared Collapsible and Avatar; real layouts, group/date safety, measured virtual rows and retained disclosure state.",
              },
              {
                type: "added",
                title: "KiraTimeline",
                description:
                  "Initial loading, empty/error states and cancellable older-event loading. Pending and active statuses, timezone grouping and explicit disclosure summaries.",
              },
              {
                type: "breaking",
                title: "Semantics and motion corrected",
                description:
                  "The root contains a list instead of an unsupported feed; items are listitems. Automatic GSAP entrances are removed. Custom renderItem receives displayed indexes. TimelineAvatar now includes its author name; part DOM and slots changed. Disclosure content is inert while closed.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}

const timelinePageFeatureGridFeatures = [
  {
    title: "Event context",
    description:
      "Inspect a workflow using native disclosures and visible status labels.",
    icon: <IconList className="size-4" />,
  },
  {
    title: "Flexible rails",
    description: "Grouped, horizontal and responsive alternating histories.",
    icon: <IconLayoutColumns className="size-4" />,
  },
  {
    title: "Long histories",
    description:
      "Measured virtual rows and cancellable loading of older events.",
    icon: <IconHistory className="size-4" />,
  },
] satisfies React.ComponentProps<typeof FeatureGrid>["features"];
