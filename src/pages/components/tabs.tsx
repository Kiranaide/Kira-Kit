import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  IconHome,
  IconSettings,
  IconUser,
  IconBell,
  IconAccessible,
  IconArrowsHorizontal,
  IconShieldCheck,
  IconLayoutNavbar,
} from "@tabler/icons-react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  KiraTabs,
} from "@/components/ui/tabs";
import type { TabItem } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              The default variant renders a muted track with a raised active
              tab.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Panels fade in (200ms, reduced-motion safe). Focus follows the
            roving tabindex: Tab moves into the list, arrows move between tabs.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="analytics">
        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Second panel.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Panels unmount when left unless <code>keepMounted</code> is set.
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Third panel.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Colors, variants, and features flow through one context.
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function SegmentDemo() {
  return (
    <Tabs defaultValue="day" variant="segment">
      <TabsList>
        <TabsTrigger value="day">Day</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
      </TabsList>
      <TabsContent value="day">
        <p className="text-sm text-muted-foreground">
          The active-tab pill is the Base UI <code>Tabs.Indicator</code>: it
          slides (translate + size transition, 200ms ease-out) and interrupts
          cleanly when you click another tab mid-flight.
        </p>
      </TabsContent>
      <TabsContent value="week">
        <p className="text-sm text-muted-foreground">
          Rapid multi-click: the pill lands on the last selected tab — final
          state never depends on transitionend.
        </p>
      </TabsContent>
      <TabsContent value="month">
        <p className="text-sm text-muted-foreground">
          Segment works with every color theme (the pill takes the token color).
        </p>
      </TabsContent>
    </Tabs>
  );
}

function DirectionAwareDemo() {
  return (
    <Tabs defaultValue="a">
      <TabsList variant="underline">
        <TabsTrigger value="a">Alpha</TabsTrigger>
        <TabsTrigger value="b">Bravo</TabsTrigger>
        <TabsTrigger value="c">Charlie</TabsTrigger>
      </TabsList>
      <TabsContent value="a" animation="auto">
        <p className="text-sm text-muted-foreground">
          Press → / ← arrow keys: the panel slides in from the side the
          selection came from (Base UI exposes{" "}
          <code>data-activation-direction</code> natively).
        </p>
      </TabsContent>
      <TabsContent value="b" animation="auto">
        <p className="text-sm text-muted-foreground">
          Direction-aware entry is opt-in via <code>animation="auto"</code>.
        </p>
      </TabsContent>
      <TabsContent value="c" animation="auto">
        <p className="text-sm text-muted-foreground">
          Without a direction (programmatic select) it falls back to a plain
          fade.
        </p>
      </TabsContent>
    </Tabs>
  );
}

function ScrollableDemo() {
  const tabs = [
    "dashboard",
    "reports",
    "billing",
    "team",
    "integrations",
    "api-keys",
    "webhooks",
    "audit-log",
  ];

  return (
    <Tabs defaultValue="dashboard">
      <TabsList scrollable className="max-w-xs">
        {tabs.map((tab) => (
          <TabsTrigger key={tab} value={tab}>
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab} value={tab}>
          <p className="text-sm text-muted-foreground">
            Panel for <code>{tab}</code>. Resize narrower until chevrons appear;
            they disable at the edges and hide when everything fits.
          </p>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function renderCloseLog(log: string[]): string {
  if (log.length === 0) {
    return "onClose log — try closing “Unsaved changes”.";
  }

  return log.join(" · ");
}

function CloseGuardDemo() {
  const [log, setLog] = React.useState<string[]>([]);

  const items: TabItem[] = [
    {
      value: "saved",
      label: "Saved doc",
      closable: true,
      content: (
        <p className="text-sm text-muted-foreground">
          Closes immediately — the guard resolves true.
        </p>
      ),
    },
    {
      value: "dirty",
      label: "Unsaved changes",
      dirty: true,
      closable: true,
      content: (
        <p className="text-sm text-muted-foreground">
          Closing asks a fake 600ms guard. While pending, the close icon pulses
          and is inert; the veto keeps the tab and never fires{" "}
          <code>onClose</code>.
        </p>
      ),
    },
    {
      value: "notes",
      label: "Notes",
      closable: true,
      content: (
        <p className="text-sm text-muted-foreground">
          APG close rule: closing the active tab selects the FOLLOWING tab
          (wrapping to first).
        </p>
      ),
    },
  ];

  const logText = renderCloseLog(log);

  return (
    <div className="space-y-3">
      <KiraTabs
        items={items}
        onBeforeClose={(value) => {
          if (value !== "dirty") return true;

          return new Promise<boolean>((resolve) => {
            window.setTimeout(
              () => resolve(window.confirm("Discard changes?")),
              600,
            );
          });
        }}
        onClose={(value) => {
          setLog((prev) => [...prev, `onClose: ${value}`]);
        }}
      />
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {logText}
      </p>
    </div>
  );
}

function DeepLinkDemo() {
  const items: TabItem[] = [
    {
      value: "reports",
      label: "Reports",
      content: (
        <p className="text-sm text-muted-foreground">
          Select a tab — the URL hash updates via <code>replaceState</code>.
          Reload the page and the same tab is active on mount.
        </p>
      ),
    },
    {
      value: "billing",
      label: "Billing",
      content: (
        <p className="text-sm text-muted-foreground">
          Deep links are opt-in: <code>deepLink</code>.
        </p>
      ),
    },
    {
      value: "archive",
      label: "Archive",
      content: (
        <p className="text-sm text-muted-foreground">
          No history entries are pushed (back button stays on the page).
        </p>
      ),
    },
  ];

  return <KiraTabs items={items} deepLink defaultValue="reports" />;
}

function OverflowMenuDemo() {
  const tabs = [
    "overview",
    "projects",
    "members",
    "billing",
    "domains",
    "security",
  ];

  return (
    <KiraTabs
      items={tabs.map((tab) => ({
        value: tab,
        label: tab,
        content: (
          <p className="text-sm text-muted-foreground">
            Narrow this container: when tabs overflow the list, the ⋯ “All tabs”
            menu opens a dropdown listing every tab (check marks the active
            one).
          </p>
        ),
      }))}
      overflowMenu
    />
  );
}

function DragReorderDemo() {
  const [items, setItems] = React.useState<TabItem[]>([
    {
      value: "one",
      label: "First",
      content: <p className="text-sm text-muted-foreground">Tab one.</p>,
    },
    {
      value: "two",
      label: "Second",
      content: <p className="text-sm text-muted-foreground">Tab two.</p>,
    },
    {
      value: "three",
      label: "Third",
      content: <p className="text-sm text-muted-foreground">Tab three.</p>,
    },
  ]);

  return (
    <div className="space-y-3">
      <KiraTabs
        items={items}
        reorderable
        onReorder={(next) => setItems(next)}
      />
      <p className="text-xs text-muted-foreground">
        Drag the grip handle to reorder (pointer), or focus it and use Space to
        pick up, arrows to move, Space to drop, Escape to cancel. A polite
        “Moved to position N” is announced.
      </p>
    </div>
  );
}

function VariantsDemo() {
  return (
    <div className="space-y-8">
      {(
        [
          "default",
          "outline",
          "pills",
          "underline",
          "soft",
          "card",
          "segment",
        ] as const
      ).map((variant) => (
        <div key={variant}>
          <p className="mb-2 font-mono text-xs text-muted-foreground">
            variant=&quot;{variant}&quot;
          </p>
          <Tabs defaultValue="one" variant={variant}>
            <TabsList>
              <TabsTrigger value="one">One</TabsTrigger>
              <TabsTrigger value="two">Two</TabsTrigger>
              <TabsTrigger value="three" disabled>
                Disabled
              </TabsTrigger>
            </TabsList>
            <TabsContent value="one">
              <p className="text-sm text-muted-foreground">{variant} panel.</p>
            </TabsContent>
            <TabsContent value="two">
              <p className="text-sm text-muted-foreground">
                {variant} panel 2.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      ))}
    </div>
  );
}

function ColorsDemo() {
  return (
    <div className="space-y-6">
      {(
        ["default", "primary", "success", "warning", "destructive"] as const
      ).map((color) => (
        <div key={color}>
          <p className="mb-2 font-mono text-xs text-muted-foreground">
            color=&quot;{color}&quot; (semantic tokens — theme-aware)
          </p>
          <Tabs defaultValue="one" variant="pills" color={color}>
            <TabsList>
              <TabsTrigger value="one">Active</TabsTrigger>
              <TabsTrigger value="two">Inactive</TabsTrigger>
            </TabsList>
            <TabsContent value="one">
              <p className="text-sm text-muted-foreground">
                {color} panel — success/warning come from{" "}
                <code>--color-success/--color-warning</code>.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      ))}
    </div>
  );
}

function VerticalDemo() {
  return (
    <Tabs defaultValue="account" orientation="vertical">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm text-muted-foreground">
          Vertical list; underline vertical draws the marker on the inline-end
          edge.
        </p>
      </TabsContent>
      <TabsContent value="profile">
        <p className="text-sm text-muted-foreground">Profile panel.</p>
      </TabsContent>
      <TabsContent value="notifications">
        <p className="text-sm text-muted-foreground">Notifications panel.</p>
      </TabsContent>
    </Tabs>
  );
}

function IconsBadgesDemo() {
  return (
    <Tabs defaultValue="home">
      <TabsList>
        <TabsTrigger value="home" icon={<IconHome />}>
          Home
        </TabsTrigger>
        <TabsTrigger
          value="inbox"
          icon={<IconBell />}
          badge={5}
          badgeColor="destructive"
        >
          Inbox
        </TabsTrigger>
        <TabsTrigger value="profile" icon={<IconUser />} badge="new">
          Profile
        </TabsTrigger>
        <TabsTrigger value="settings" icon={<IconSettings />} closable>
          Settings
        </TabsTrigger>
      </TabsList>
      <TabsContent value="home">
        <p className="text-sm text-muted-foreground">
          Icons, badges, closable triggers.
        </p>
      </TabsContent>
      <TabsContent value="inbox">
        <p className="text-sm text-muted-foreground">Inbox panel.</p>
      </TabsContent>
      <TabsContent value="profile">
        <p className="text-sm text-muted-foreground">Profile panel.</p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm text-muted-foreground">Settings panel.</p>
      </TabsContent>
    </Tabs>
  );
}

const stressScrollTabs = ["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"];

function StressNarrowCases() {
  return (
    <>
      <div>
        <p className="mb-2 font-mono text-xs text-muted-foreground">
          Very long label &amp; disabled state in <code>max-w-xs</code>
        </p>
        <Tabs defaultValue="long">
          <TabsList className="max-w-xs">
            <TabsTrigger value="long">
              An extremely long tab label that must truncate gracefully at the
              max-width clamp
            </TabsTrigger>
            <TabsTrigger value="short">Short</TabsTrigger>
            <TabsTrigger value="disabled" disabled>
              Disabled
            </TabsTrigger>
          </TabsList>
          <TabsContent value="long">
            <p className="text-sm text-muted-foreground">
              Truncated label panel.
            </p>
          </TabsContent>
          <TabsContent value="short">
            <p className="text-sm text-muted-foreground">Short panel.</p>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <p className="mb-2 font-mono text-xs text-muted-foreground">
          Empty panel state
        </p>
        <Tabs defaultValue="unassigned">
          <TabsList>
            <TabsTrigger value="unassigned">Unassigned reports</TabsTrigger>
            <TabsTrigger value="resolved">Resolved reports</TabsTrigger>
          </TabsList>
          <TabsContent value="unassigned">
            <div className="min-h-12" aria-label="No unassigned reports" />
          </TabsContent>
          <TabsContent value="resolved">
            <p className="text-sm text-muted-foreground">
              Resolved reports remain available here.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      <div>
        <p className="mb-2 font-mono text-xs text-muted-foreground">
          Icon-only triggers with accessible names
        </p>
        <Tabs defaultValue="a">
          <TabsList>
            <TabsTrigger value="a" icon={<IconHome />} aria-label="Home">
              {""}
            </TabsTrigger>
            <TabsTrigger value="b" icon={<IconBell />} aria-label="Bell">
              {""}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="a">
            <p className="text-sm text-muted-foreground">Home panel.</p>
          </TabsContent>
          <TabsContent value="b">
            <p className="text-sm text-muted-foreground">Bell panel.</p>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

function StressDemo() {
  return (
    <div className="space-y-10">
      <StressNarrowCases />

      <div>
        <p className="mb-2 font-mono text-xs text-muted-foreground">
          8 tabs in <code>max-w-xs</code> — scrollable, no page overflow
        </p>
        <Tabs defaultValue="t1">
          <TabsList scrollable className="max-w-xs">
            {stressScrollTabs.map((t) => (
              <TabsTrigger key={t} value={t}>
                Tab {t}
              </TabsTrigger>
            ))}
          </TabsList>
          {stressScrollTabs.map((t) => (
            <TabsContent key={t} value={t}>
              <p className="text-sm text-muted-foreground">{t} panel.</p>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div>
        <p className="mb-2 font-mono text-xs text-muted-foreground">
          RTL (<code>dir=&quot;rtl&quot;</code>)
        </p>
        <div dir="rtl">
          <Tabs defaultValue="first">
            <TabsList>
              <TabsTrigger value="first">الأول</TabsTrigger>
              <TabsTrigger value="second">الثاني</TabsTrigger>
            </TabsList>
            <TabsContent value="first">
              <p className="text-sm text-muted-foreground">لوحة الأولى.</p>
            </TabsContent>
            <TabsContent value="second">
              <p className="text-sm text-muted-foreground">لوحة الثانية.</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div>
        <p className="mb-2 font-mono text-xs text-muted-foreground">
          Full editor: closable + addable + dirty + drag reorder
        </p>
        <KiraEditorStress />
      </div>
    </div>
  );
}

function KiraEditorStress() {
  const [nextId, setNextId] = React.useState(3);

  const [items, setItems] = React.useState<TabItem[]>([
    {
      value: "index",
      label: "index.ts",
      dirty: true,
      closable: true,
      content: (
        <div className="rounded-md border bg-muted/30 p-4 font-mono text-sm">
          export const one = 1
        </div>
      ),
    },
    {
      value: "utils",
      label: "utils.ts",
      closable: true,
      content: (
        <div className="rounded-md border bg-muted/30 p-4 font-mono text-sm">
          export const two = 2
        </div>
      ),
    },
    {
      value: "types",
      label: "types.d.ts",
      closable: true,
      content: (
        <div className="rounded-md border bg-muted/30 p-4 font-mono text-sm">
          export type two = number
        </div>
      ),
    },
  ]);

  return (
    <KiraTabs
      items={items}
      addable
      reorderable
      overflowMenu
      onAdd={() => {
        const id = nextId;
        setNextId(id + 1);

        return {
          value: `file-${id}`,
          label: `module-${id}.ts`,
          closable: true,
          content: (
            <div className="rounded-md border bg-muted/30 p-4 font-mono text-sm">
              export const module = {id}
            </div>
          ),
        };
      }}
      onReorder={(next) => setItems(next)}
    />
  );
}

const basicCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function ProjectOverviewTabs() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview</TabsContent>
      <TabsContent value="analytics">Analytics</TabsContent>
      <TabsContent value="settings">Settings</TabsContent>
    </Tabs>
  )
}`;

const variantsCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const variants = ["default", "outline", "pills", "underline", "soft", "card", "segment"] as const

export function TabsVariantExamples() {
  return (
    <div className="space-y-6">
      {variants.map((variant) => (
        <Tabs key={variant} defaultValue="one" variant={variant}>
          <TabsList>
            <TabsTrigger value="one">One</TabsTrigger>
            <TabsTrigger value="two">Two</TabsTrigger>
            <TabsTrigger value="three" disabled>Disabled</TabsTrigger>
          </TabsList>
          <TabsContent value="one">{variant} panel.</TabsContent>
          <TabsContent value="two">{variant} panel 2.</TabsContent>
        </Tabs>
      ))}
    </div>
  )
}`;

const segmentCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function DateRangeSegment() {
  return (
    <Tabs defaultValue="day" variant="segment">
      <TabsList>
        <TabsTrigger value="day">Day</TabsTrigger>
        <TabsTrigger value="week">Week</TabsTrigger>
        <TabsTrigger value="month">Month</TabsTrigger>
      </TabsList>
      <TabsContent value="day">Day view</TabsContent>
      <TabsContent value="week">Week view</TabsContent>
      <TabsContent value="month">Month view</TabsContent>
    </Tabs>
  )
}`;

const directionCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function DirectionAwareTabs() {
  return (
    <Tabs defaultValue="summary">
      <TabsList variant="underline">
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="traffic">Traffic</TabsTrigger>
        <TabsTrigger value="conversions">Conversions</TabsTrigger>
      </TabsList>
      <TabsContent value="summary" animation="auto">Workspace summary</TabsContent>
      <TabsContent value="traffic" animation="auto">Traffic report</TabsContent>
      <TabsContent value="conversions" animation="auto">Conversion report</TabsContent>
    </Tabs>
  )
}`;

const scrollableCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const reports = ["overview", "traffic", "revenue", "retention", "regions", "devices", "campaigns", "exports"]

export function ScrollableReportTabs() {
  return (
    <Tabs defaultValue="overview">
      <TabsList scrollable className="max-w-93.75">
        {reports.map((report) => <TabsTrigger key={report} value={report}>{report}</TabsTrigger>)}
      </TabsList>
      {reports.map((report) => <TabsContent key={report} value={report}>{report} report</TabsContent>)}
    </Tabs>
  )
}`;

const guardCode = `import { KiraTabs } from "@/components/ui/tabs"
import type { TabItem } from "@/components/ui/tabs"

const documents: TabItem[] = [
  { value: "brief", label: "Project brief", closable: true, content: <p>Approved project brief</p> },
  { value: "draft", label: "Budget draft", dirty: true, closable: true, content: <p>Unsaved budget changes</p> },
  { value: "notes", label: "Meeting notes", closable: true, content: <p>Notes from the planning meeting</p> },
]

export function GuardedDocumentTabs() {
  return (
    <KiraTabs
      items={documents}
      onBeforeClose={(value) => value !== "draft" || window.confirm("Discard the unsaved budget draft?")}
      onClose={(value) => console.info("Closed document", value)}
    />
  )
}`;

const deepLinkCode = `import { KiraTabs } from "@/components/ui/tabs"
import type { TabItem } from "@/components/ui/tabs"

const reports: TabItem[] = [
  { value: "monthly", label: "Monthly report", content: <p>October workspace metrics</p> },
  { value: "invoices", label: "Invoices", content: <p>Open customer invoices</p> },
  { value: "archive", label: "Archive", content: <p>Previously published reports</p> },
]

export function LinkedReportTabs() {
  return <KiraTabs items={reports} deepLink defaultValue="monthly" />
}`;

const overflowCode = `import { KiraTabs } from "@/components/ui/tabs"
import type { TabItem } from "@/components/ui/tabs"

const workspace: TabItem[] = [
  { value: "overview", label: "Overview", content: <p>Workspace summary</p> },
  { value: "projects", label: "Projects", content: <p>Active client projects</p> },
  { value: "members", label: "Members", content: <p>Workspace team roster</p> },
  { value: "billing", label: "Billing", content: <p>Plan and invoices</p> },
]

export function WorkspaceOverflowTabs() {
  return <KiraTabs items={workspace} overflowMenu />
}`;

const reorderCode = `import * as React from "react"
import { KiraTabs } from "@/components/ui/tabs"
import type { TabItem } from "@/components/ui/tabs"

export function ReorderableProjectFiles() {
  const [files, setFiles] = React.useState<TabItem[]>([
    { value: "brief", label: "brief.md", content: <p>Project brief</p> },
    { value: "plan", label: "plan.md", content: <p>Delivery plan</p> },
    { value: "budget", label: "budget.csv", content: <p>Approved project budget</p> },
  ])

  return <KiraTabs items={files} reorderable onReorder={setFiles} />
}`;

const kiraCode = `import * as React from "react"
import { KiraTabs } from "@/components/ui/tabs"
import type { TabItem } from "@/components/ui/tabs"

export function ProjectFileEditor() {
  const [files, setFiles] = React.useState<TabItem[]>([
    { value: "index", label: "index.ts", dirty: true, closable: true, content: <pre>export const one = 1</pre> },
    { value: "utils", label: "utils.ts", closable: true, content: <pre>export const two = 2</pre> },
    { value: "types", label: "types.d.ts", closable: true, content: <pre>export type two = number</pre> },
  ])
  const [nextId, setNextId] = React.useState(3)

  return (
    <KiraTabs
      items={files}
      addable
      onAdd={() => {
        const id = nextId
        setNextId(id + 1)
        return { value: \`file-\${id}\`, label: \`module-\${id}.ts\`, closable: true, content: <pre>export const module = {id}</pre> }
      }}
      reorderable
      overflowMenu
      onReorder={setFiles}
    />
  )
}`;

const statesCode = `import { IconBell, IconHome } from "@tabler/icons-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function TabsStressCases() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="long">
        <TabsList className="max-w-xs">
          <TabsTrigger value="long">An extremely long tab label that must truncate gracefully at the max-width clamp</TabsTrigger>
          <TabsTrigger value="short">Short</TabsTrigger>
          <TabsTrigger value="disabled" disabled>Disabled</TabsTrigger>
        </TabsList>
        <TabsContent value="long">Truncated label panel.</TabsContent>
        <TabsContent value="short">Short panel.</TabsContent>
      </Tabs>
      <Tabs defaultValue="unassigned">
        <TabsList>
          <TabsTrigger value="unassigned">Unassigned reports</TabsTrigger>
          <TabsTrigger value="resolved">Resolved reports</TabsTrigger>
        </TabsList>
        <TabsContent value="unassigned"><div className="min-h-12" aria-label="No unassigned reports" /></TabsContent>
        <TabsContent value="resolved">Resolved reports remain available here.</TabsContent>
      </Tabs>
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a" icon={<IconHome />} aria-label="Home">{ "" }</TabsTrigger>
          <TabsTrigger value="b" icon={<IconBell />} aria-label="Bell">{ "" }</TabsTrigger>
        </TabsList>
        <TabsContent value="a">Home panel.</TabsContent>
        <TabsContent value="b">Bell panel.</TabsContent>
      </Tabs>
      <Tabs defaultValue="t1">
        <TabsList scrollable className="max-w-xs">
          {["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"].map((tab) => <TabsTrigger key={tab} value={tab}>Tab {tab}</TabsTrigger>)}
        </TabsList>
        {["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8"].map((tab) => <TabsContent key={tab} value={tab}>{tab} panel.</TabsContent>)}
      </Tabs>
      <div dir="rtl">
        <Tabs defaultValue="first">
          <TabsList>
            <TabsTrigger value="first">الأول</TabsTrigger>
            <TabsTrigger value="second">الثاني</TabsTrigger>
          </TabsList>
          <TabsContent value="first">لوحة الأولى.</TabsContent>
          <TabsContent value="second">لوحة الثانية.</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}`;

const usageCode = `import * as React from "react"
import { IconBell, IconHome } from "@tabler/icons-react"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  KiraTabs,
} from "@/components/ui/tabs"
import type { TabItem } from "@/components/ui/tabs"

export function WorkspaceTabsExample() {
  const [files, setFiles] = React.useState<TabItem[]>([
    { value: "overview", label: "Overview", icon: <IconHome />, content: <p>Workspace summary</p> },
    { value: "alerts", label: "Alerts", icon: <IconBell />, badge: 3, content: <p>Three reports need review</p> },
  ])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" variant="segment" color="primary">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Workspace summary</TabsContent>
        <TabsContent value="alerts">Reports to review</TabsContent>
      </Tabs>

      <Tabs defaultValue="overview">
        <TabsList scrollable className="max-w-xs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Workspace summary</TabsContent>
        <TabsContent value="alerts">Reports to review</TabsContent>
      </Tabs>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" icon={<IconHome />}>Overview</TabsTrigger>
          <TabsTrigger value="alerts" icon={<IconBell />} badge={3} badgeColor="warning">Alerts</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Workspace summary</TabsContent>
        <TabsContent value="alerts">Reports to review</TabsContent>
      </Tabs>

      <KiraTabs items={files} overflowMenu reorderable onReorder={setFiles} />
    </div>
  )
}`;

const colorCode = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

const colors = ["default", "primary", "success", "warning", "destructive"] as const

export function SemanticColorExamples() {
  return (
    <div className="space-y-6">
      {colors.map((color) => (
        <Tabs key={color} defaultValue="one" variant="pills" color={color}>
          <TabsList>
            <TabsTrigger value="one">Active</TabsTrigger>
            <TabsTrigger value="two">Inactive</TabsTrigger>
          </TabsList>
          <TabsContent value="one">{color} panel</TabsContent>
        </Tabs>
      ))}
    </div>
  )
}`;

const contentCode = `import { IconBell, IconHome, IconSettings, IconUser } from "@tabler/icons-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export function IconBadgeAndOrientationTabs() {
  return (
    <div className="space-y-8">
      <Tabs defaultValue="home">
        <TabsList>
          <TabsTrigger value="home" icon={<IconHome />}>Home</TabsTrigger>
          <TabsTrigger value="inbox" icon={<IconBell />} badge={5} badgeColor="destructive">Inbox</TabsTrigger>
          <TabsTrigger value="profile" icon={<IconUser />} badge="new">Profile</TabsTrigger>
          <TabsTrigger value="settings" icon={<IconSettings />} closable>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="home">Workspace home</TabsContent>
        <TabsContent value="inbox">Five unread messages</TabsContent>
        <TabsContent value="profile">Member profile</TabsContent>
        <TabsContent value="settings">Account settings</TabsContent>
      </Tabs>
      <Tabs defaultValue="account" orientation="vertical">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account preferences</TabsContent>
        <TabsContent value="profile">Member details</TabsContent>
        <TabsContent value="notifications">Notification preferences</TabsContent>
      </Tabs>
    </div>
  )
}`;

export default function TabsPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Tabs"
        description="Switch between different views with full accessibility, RTL support, segmented-control and reorderable editor modes."
        version="v2.2.1"
      />

      <FeatureGrid features={tabsPageFeatures} />

      <DemoTabs tabs={tabsPageDemoTabs} defaultValue="basic" />

      <KeyboardShortcuts
        shortcuts={tabsPageShortcuts}
        description={
          <>
            Keyboard behavior for the WAI-ARIA tabs pattern (reference:{" "}
            <a
              className="underline underline-offset-4"
              href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/"
              target="_blank"
              rel="noreferrer"
            >
              WAI-ARIA APG Tabs
            </a>
            ).
          </>
        }
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Copy-paste examples for compound Tabs and the KiraTabs editor surface."
      />

      <APIReference
        sections={tabsPageAPISections}
        title="API reference"
        description="Props and configuration options for each exported Tabs component."
      />

      <Changelog entries={tabsPageChangelogEntries} />
    </ComponentPage>
  );
}

const tabsPageShortcuts = [
  {
    keys: "← / →",
    description:
      "Inherited from Base UI: move focus between horizontal tabs; when activateOnFocus is enabled, focus also selects.",
  },
  {
    keys: "↑ / ↓",
    description:
      "Inherited from Base UI: move focus between vertical tabs; when activateOnFocus is enabled, focus also selects.",
  },
  {
    keys: "Home / End",
    description:
      "Inherited from Base UI: move focus to the first or last tab. This Tabs implementation does not provide typeahead.",
  },
  {
    keys: "Enter / Space",
    description:
      "Inherited from Base UI: activate the focused tab when activation-on-focus is disabled.",
  },
  {
    keys: "Delete / Backspace",
    description:
      "Kira: close the focused closable tab; closing the active tab selects the following tab, wrapping to the first.",
  },
  {
    keys: "Tab",
    description:
      "Kira: move from the tab list to the Add tab and All tabs controls. In the overflow menu, use the menu keyboard navigation.",
  },
  {
    keys: "Space / arrows / Space",
    description:
      "Kira reorder: focus a grip, pick up the tab, move it with arrow keys, and drop it.",
  },
  {
    keys: "Escape",
    description:
      "Kira reorder: cancel keyboard sorting and restore the original order.",
  },
  {
    keys: "Enter / Space",
    description:
      "Kira: activate a focused scroll chevron; chevrons disable at the edges.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const tabsPageAPISections = [
  {
    title: "Tabs",
    props: [
      {
        prop: "value",
        type: 'TabsRoot.Props["value"]',
        description:
          "Base UI controlled active value; any trigger value type or null.",
      },
      {
        prop: "defaultValue",
        type: 'TabsRoot.Props["defaultValue"]',
        default: "first enabled tab",
        description: "Base UI selects the first enabled trigger when omitted.",
      },
      {
        prop: "onValueChange",
        type: 'TabsRoot.Props["onValueChange"]',
        description:
          "Base UI callback with the selected value and ChangeEventDetails.",
      },
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Tab layout and keyboard direction.",
      },
      {
        prop: "variant",
        type: '"default" | "outline" | "pills" | "underline" | "soft" | "card" | "segment"',
        default: '"default"',
        description: "List and trigger visual style.",
      },
      {
        prop: "color",
        type: '"default" | "primary" | "success" | "warning" | "destructive"',
        default: '"default"',
        description: "Semantic color theme.",
      },
      {
        prop: "showIndicator",
        type: "boolean",
        default: "true",
        description:
          "Render the indicator; affects underline and segment variants.",
      },
      {
        prop: "className",
        type: "string",
        description:
          "Additional root classes; Base UI root props are forwarded.",
      },
    ],
  },
  {
    title: "TabsList",
    props: [
      {
        prop: "variant",
        type: '"default" | "outline" | "pills" | "underline" | "soft" | "card" | "segment"',
        description: "Override the variant inherited from Tabs.",
      },
      {
        prop: "showIndicator",
        type: "boolean",
        description: "Override the indicator setting inherited from Tabs.",
      },
      {
        prop: "scrollable",
        type: "boolean",
        default: "false",
        description:
          "Enable overflow detection and edge chevrons; constrain the list width to reveal overflow.",
      },
      {
        prop: "activateOnFocus",
        type: "boolean",
        default: "false (Base UI)",
        description: "Select a tab as focus moves onto it.",
      },
      {
        prop: "loopFocus",
        type: "boolean",
        default: "true (Base UI)",
        description: "Wrap arrow-key focus at either end.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "TabsTrigger children; required.",
      },
      {
        prop: "className",
        type: "string",
        description:
          "Additional list classes; other Base UI list props are forwarded.",
      },
    ],
  },
  {
    title: "TabsTrigger",
    props: [
      {
        prop: "value",
        type: "string",
        description: "Unique tab value; required.",
      },
      {
        prop: "children",
        type: "ReactNode",
        description: "Visible label; required.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description:
          "Disable activation and exclude this tab from keyboard selection.",
      },
      {
        prop: "variant",
        type: '"default" | "outline" | "pills" | "underline" | "soft" | "card" | "segment"',
        description: "Override the variant inherited from Tabs.",
      },
      {
        prop: "color",
        type: '"default" | "primary" | "success" | "warning" | "destructive"',
        description: "Override the color inherited from Tabs.",
      },
      { prop: "icon", type: "ReactNode", description: "Leading icon slot." },
      {
        prop: "badge",
        type: "ReactNode",
        description: "Trailing badge content.",
      },
      {
        prop: "badgeColor",
        type: '"default" | "primary" | "destructive" | "success" | "warning"',
        default: '"default"',
        description: "Semantic badge color.",
      },
      {
        prop: "closable",
        type: "boolean",
        default: "false",
        description: "Render an accessible close affordance.",
      },
      {
        prop: "onClose",
        type: "(value: string) => void",
        description:
          "Handle close-button or Delete/Backspace requests; selection/removal is caller-owned.",
      },
      {
        prop: "dirty",
        type: "boolean",
        default: "false",
        description: "Mark unsaved content with a dot or close-control marker.",
      },
      {
        prop: "closePending",
        type: "boolean",
        default: "false",
        description:
          "Mark a pending guarded close; the close control is inert and pulses.",
      },
      {
        prop: "dragHandle",
        type: "ReactNode",
        description: "Optional leading drag-handle slot.",
      },
      {
        prop: "className",
        type: "string",
        description:
          "Additional trigger classes; other Base UI tab props are forwarded.",
      },
    ],
  },
  {
    title: "TabsContent",
    props: [
      {
        prop: "value",
        type: "string",
        description: "Panel value matching a trigger; required.",
      },
      {
        prop: "animation",
        type: '"none" | "fade" | "slide" | "slideUp" | "zoom" | "auto"',
        default: '"fade"',
        description:
          'Entry animation; "auto" uses Base UI activation direction, all motion is reduced-motion safe.',
      },
      {
        prop: "lazy",
        type: "boolean",
        default: "false",
        description:
          "Unmount until first selection and unmount again on leave.",
      },
      {
        prop: "keepMounted",
        type: "boolean",
        default: "true",
        description:
          "Keep inactive panel content mounted; lazy overrides this.",
      },
      { prop: "children", type: "ReactNode", description: "Panel content." },
      {
        prop: "className",
        type: "string",
        description:
          "Additional panel classes; other Base UI panel props are forwarded.",
      },
    ],
  },
  {
    title: "TabItem",
    props: [
      {
        prop: "value",
        type: "string",
        description: "Unique tab value; required.",
      },
      {
        prop: "label",
        type: "ReactNode",
        description: "Trigger label; required.",
      },
      { prop: "content", type: "ReactNode", description: "Panel content." },
      { prop: "icon", type: "ReactNode", description: "Leading icon." },
      {
        prop: "badge",
        type: "ReactNode",
        description: "Trailing badge content.",
      },
      {
        prop: "badgeColor",
        type: '"default" | "primary" | "destructive" | "success" | "warning"',
        description: "Semantic badge color.",
      },
      {
        prop: "disabled",
        type: "boolean",
        description: "Disable activation of the tab.",
      },
      {
        prop: "closable",
        type: "boolean",
        description: "Render a close affordance.",
      },
      {
        prop: "dirty",
        type: "boolean",
        description: "Mark the tab's content as unsaved.",
      },
    ],
  },
  {
    title: "KiraTabs",
    props: [
      {
        prop: "items",
        type: "TabItem[]",
        description:
          "Tab data; a new items reference is adopted when the prop changes.",
      },
      {
        prop: "value",
        type: "string",
        description: "Controlled active value.",
      },
      {
        prop: "defaultValue",
        type: "string",
        description:
          "Initial active value when uncontrolled; defaults to the first item.",
      },
      {
        prop: "onValueChange",
        type: "(value: string) => void",
        description: "Called after active tab selection changes.",
      },
      {
        prop: "variant",
        type: '"default" | "outline" | "pills" | "underline" | "soft" | "card" | "segment"',
        default: '"default"',
        description: "Tab-list visual style.",
      },
      {
        prop: "color",
        type: '"default" | "primary" | "success" | "warning" | "destructive"',
        default: '"default"',
        description: "Semantic tab color.",
      },
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Tab-list orientation.",
      },
      {
        prop: "showIndicator",
        type: "boolean",
        default: "true",
        description: "Render the underline or segment indicator.",
      },
      {
        prop: "animation",
        type: '"none" | "fade" | "slide" | "slideUp" | "zoom" | "auto"',
        default: '"fade"',
        description: "Panel entry animation.",
      },
      {
        prop: "lazy",
        type: "boolean",
        default: "false",
        description: "Unmount panel content when inactive.",
      },
      {
        prop: "addable",
        type: "boolean",
        default: "false",
        description: "Show an Add tab button.",
      },
      {
        prop: "onAdd",
        type: "() => TabItem | void",
        description: "Return a new TabItem to append and activate it.",
      },
      {
        prop: "onClose",
        type: "(value: string) => void",
        description: "Called after a tab closes successfully.",
      },
      {
        prop: "onBeforeClose",
        type: "(value: string) => boolean | Promise<boolean>",
        description:
          "Allow or veto a close; false or rejection keeps the tab open.",
      },
      {
        prop: "deepLink",
        type: "boolean",
        default: "false",
        description:
          "Synchronize selection with location.hash using replaceState.",
      },
      {
        prop: "overflowMenu",
        type: "boolean",
        default: "false",
        description: "Show an All tabs menu with active selection marked.",
      },
      {
        prop: "reorderable",
        type: "boolean",
        default: "false",
        description: "Enable pointer and keyboard drag sorting.",
      },
      {
        prop: "onReorder",
        type: "(items: TabItem[]) => void",
        description: "Called after a successful reorder.",
      },
      {
        prop: "className",
        type: "string",
        description: "Additional root classes.",
      },
      {
        prop: "listClassName",
        type: "string",
        description: "Additional tab-list classes.",
      },
      {
        prop: "contentClassName",
        type: "string",
        description: "Additional panel classes.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const tabsPageChangelogEntries = [
  {
    version: "2.2.1",
    date: "26 November 2026",
    changes: [
      {
        type: "fixed",
        title: "Focus indicators at full strength",
        description:
          "Selected and focused tabs paint border-ring, ring-ring and outline-ring at full opacity instead of the /50 halo, which measured 1.63–2.82:1 against the page — under WCAG 1.4.11. Active tab surfaces inherit the retuned default-theme primary pair.",
      },
    ],
  },
  {
    version: "2.2.0",
    date: "18 October 2026",
    changes: [
      {
        type: "breaking",
        title: "Semantic success/warning tokens",
        description:
          "All raw green-*/amber-* classes replaced with --color-success/--color-warning (+ -foreground). Hues are now theme-aware (dark-mode text uses success-foreground/warning-foreground instead of white).",
      },
      {
        type: "breaking",
        title: "Trigger focus ring aligned to button exemplar",
        description:
          "focus-visible:border-ring ring-ring/50 ring-[3px] outline-1 outline-ring (was ring-2 + ring-offset-2).",
      },
      {
        type: "breaking",
        title: "Indicator motion is transform-based",
        description:
          "Position/size from Base UI CSS vars; animates translate + size via transition (200ms ease-out), reduced-motion gated. Replaces the previous animate-in and all-property transition.",
      },
      {
        type: "breaking",
        title: "TabsList no longer sets data-orientation manually",
        description:
          "Base UI emits data-orientation natively on Root/List/Tab/Panel; the duplicate attribute was removed. data-variant is still set for styling hooks.",
      },
      {
        type: "breaking",
        title: "Closing a tab selects the FOLLOWING tab (APG)",
        description:
          "WAI-ARIA APG close rule: next tab in reading order, wrapping to first. Previously selected the previous tab.",
      },
      {
        type: "added",
        title: 'variant="segment" — sliding pill segmented control',
        description:
          "Tabs.Indicator renders a rounded pill that translates between tabs; CSS-transition interruptible; all color themes.",
      },
      {
        type: "added",
        title: 'animation="auto" — direction-aware panels',
        description:
          "Panels slide in from data-activation-direction (Base UI 1.9.0); plain-fade fallback; opt-in.",
      },
      {
        type: "added",
        title: "Scrollable TabsList with chevrons",
        description:
          "scrollable prop: edge chevrons (aria-labelled, disabled at edges, hidden when no overflow); ResizeObserver/MutationObserver-driven; keyboard alternative is native arrow navigation.",
      },
      {
        type: "added",
        title: "Close guard + dirty dot",
        description:
          "onBeforeClose (sync or promise, veto supported), pending pulse, dirty marker on the close affordance.",
      },
      {
        type: "added",
        title: "Deep-linkable KiraTabs",
        description:
          "deepLink: hash sync via replaceState + mount-time adoption (accordion precedent).",
      },
      {
        type: "added",
        title: "All-tabs overflow menu",
        description:
          "overflowMenu: ⋯ dropdown listing every tab; active item checked; registry dep dropdown-menu.",
      },
      {
        type: "added",
        title: "Drag reorder",
        description:
          "reorderable + onReorder via dnd-kit (PointerSensor 8px, KeyboardSensor); in-tab grip handles; polite 'Moved to position N' announcements.",
      },
      {
        type: "fixed",
        title: "Close-button hit area ≥24px",
        description:
          "Extended hit area via pseudo-element (§9 SC 2.5.8); add button is an explicit 24px target; aria-keyshortcuts=Delete.",
      },
      {
        type: "changed",
        title: "Audited against Base UI 1.9.0 (2026-10-18)",
        description:
          "Verified TabsTab.Value (any|null), activateOnFocus/loopFocus on List, Indicator CSS vars, Panel keepMounted, and the 1.9.0 fixes (issues 5886, 5171, 4852, and 5441).",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];

const tabsPageFeatures = [
  {
    icon: <IconAccessible className="h-4 w-4" />,
    title: "Accessible navigation",
    description:
      "Base UI provides the tabs pattern and roving keyboard navigation; Kira adds APG-aligned close behavior and guarded editor tabs.",
  },
  {
    icon: <IconLayoutNavbar className="h-4 w-4" />,
    title: "Seven visual variants",
    description:
      "Default, outline, pills, underline, soft, card, and segment styles share orientation, semantic colors, icons, and badges.",
  },
  {
    icon: <IconArrowsHorizontal className="h-4 w-4" />,
    title: "Responsive, interruptible motion",
    description:
      "Scrollable lists add edge-aware chevrons; the segment indicator follows fast selection changes and panels can enter by activation direction.",
  },
  {
    icon: <IconShieldCheck className="h-4 w-4" />,
    title: "KiraTabs editor",
    description:
      "KiraTabs manages guarded close, dirty state, deep links, overflow selection, add, and drag reorder; the editor example combines them in one live workspace.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const tabsPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Workspace tabs"
        description="A standard three-panel layout for a real workspace: overview, recent activity, and preferences."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Variants",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Seven tab-list variants"
        description="Compare default, outline, pills, underline, soft, card, and segment styles; disabled tabs stay visibly unavailable."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "colors",
    label: "Colors",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Semantic color themes"
        description="Theme-aware default, primary, success, warning, and destructive tab colors."
        code={colorCode}
      >
        <ColorsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "icons-and-orientation",
    label: "Icons & orientation",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Icons, badges, close, and orientation"
        description="Named tabs with icon and badge slots, a closable settings tab, and vertical navigation."
        code={contentCode}
      >
        <div className="space-y-8">
          <VerticalDemo />
          <IconsBadgesDemo />
        </div>
      </DemoWrapper>
    ),
  },
  {
    value: "segment",
    label: "Segment",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Segment control (sliding pill)"
        description={
          'variant="segment" — switch repeatedly between date ranges; the indicator tracks the latest selection.'
        }
        code={segmentCode}
      >
        <SegmentDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "direction-aware",
    label: "Direction-aware panels",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Direction-aware panels"
        description={
          'animation="auto" — arrow navigation shows panels entering from the direction of travel.'
        }
        code={directionCode}
      >
        <DirectionAwareDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "scrollable",
    label: "Scrollable",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Scrollable report list"
        description="Constrain the list to reveal its edge-aware chevrons; buttons hide when every report fits."
        code={scrollableCode}
      >
        <ScrollableDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "close-guard",
    label: "Close guard",
    group: "KiraTabs",
    demo: (
      <DemoWrapper
        title="Guarded close and unsaved state"
        description="The dirty document asks before closing; cancel the browser prompt to keep it open."
        code={guardCode}
      >
        <CloseGuardDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "deep-link",
    label: "Deep link",
    group: "KiraTabs",
    demo: (
      <DemoWrapper
        title="Deep-linked reports"
        description="Select a report to update the URL hash, then reload to restore that report."
        code={deepLinkCode}
      >
        <DeepLinkDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "overflow-menu",
    label: "Overflow menu",
    group: "KiraTabs",
    demo: (
      <DemoWrapper
        title="Overflow menu"
        description="The All tabs menu lists every workspace section and marks the active one."
        code={overflowCode}
      >
        <OverflowMenuDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "reorderable",
    label: "Reorderable",
    group: "KiraTabs",
    demo: (
      <DemoWrapper
        title="Reorderable reports"
        description="Move reports using the grip or the documented keyboard sorting controls."
        code={reorderCode}
      >
        <DragReorderDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira-tabs",
    label: "KiraTabs",
    group: "KiraTabs",
    demo: (
      <DemoWrapper
        title="Project file editor"
        description="A realistic editor fixture combining dirty state, guarded close, add, reorder, and overflow."
        code={kiraCode}
      >
        <KiraEditorStress />
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
        description="Long labels, empty panel state, narrow max-w-xs scroll, icon-only accessible names, disabled state, and RTL."
        code={statesCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];
