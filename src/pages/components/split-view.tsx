import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";

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
import {
  SplitView,
  KiraSplitView,
  type SplitViewRef,
} from "@/components/ui/split-view";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function BasicDemo() {
  const controlId1 = React.useId();

  return (
    <div className="h-96">
      <SplitView
        variant="bordered"
        sidebarLabel="Release queue"
        sidebarContent={
          <div className="space-y-3 p-4">
            <h3 className="font-medium">Ready for review</h3>
            <p className="text-sm text-muted-foreground">
              Workspace permissions
            </p>
            <p className="text-sm text-muted-foreground">Migration rollback</p>
          </div>
        }
        mainContent={
          <div className="space-y-3 p-4">
            <h3 className="font-medium">Workspace permissions</h3>
            <p className="text-sm text-muted-foreground">
              Verify the guest-to-member handoff before release.
            </p>
            <label htmlFor={controlId1} className="block space-y-2 text-sm">
              Review note
              <Textarea
                id={controlId1}
                defaultValue="Check that inherited permissions stay visible."
              />
            </label>
          </div>
        }
      />
    </div>
  );
}

const basicCode = `import { SplitView } from "@/components/ui/split-view";\nimport { Textarea } from "@/components/ui/textarea";\n\nexport function BasicDemo() {\n  return <div className="h-96"><SplitView variant="bordered" sidebarLabel="Release queue" sidebarContent={<div className="space-y-3 p-4"><h3>Ready for review</h3><p>Workspace permissions</p><p>Migration rollback</p></div>} mainContent={<div className="space-y-3 p-4"><h3>Workspace permissions</h3><p>Verify the guest-to-member handoff before release.</p><label>Review note<Textarea defaultValue="Check that inherited permissions stay visible." /></label></div>} /></div>;\n}`;

function VerticalDemo() {
  return (
    <div className="h-96">
      <SplitView
        orientation="vertical"
        variant="bordered"
        defaultSize={40}
        sidebarLabel="Change summary"
        mainLabel="Validation log"
        sidebarContent={
          <div className="p-4">
            <h3 className="font-medium">Migration rollback</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The summary sits above the validation output.
            </p>
          </div>
        }
        mainContent={
          <div className="space-y-3 p-4">
            <h3 className="font-medium">Validation output</h3>
            <pre className="overflow-auto text-xs">
              {
                "Schema check: passed\nRollback rehearsal: passed\nStaging restore: waiting"
              }
            </pre>
          </div>
        }
      />
    </div>
  );
}

const verticalCode = `import { SplitView } from "@/components/ui/split-view";\n\nexport function VerticalDemo() {\n  return <div className="h-96"><SplitView orientation="vertical" variant="bordered" defaultSize={40} sidebarLabel="Change summary" mainLabel="Validation log" sidebarContent={<div className="p-4"><h3>Migration rollback</h3><p>The summary sits above the validation output.</p></div>} mainContent={<div className="p-4"><h3>Validation output</h3><pre className="overflow-auto">{"Schema check: passed\\nRollback rehearsal: passed\\nStaging restore: waiting"}</pre></div>} /></div>;\n}`;

function SizesDemo() {
  const [size, setSize] = React.useState(30);

  return (
    <div className="space-y-2">
      <p className="text-sm tabular-nums text-muted-foreground">
        Sidebar: {size.toFixed(1)}%. Bounds: 20–60%. Main minimum: 30%.
      </p>
      <div className="h-96">
        <SplitView
          variant="bordered"
          defaultSize={30}
          minSize={20}
          maxSize={60}
          mainMinSize={30}
          onSidebarSizeChange={setSize}
          sidebarContent={
            <p className="p-4 text-sm">Use Narrower, Wider or the divider.</p>
          }
          mainContent={
            <p className="p-4 text-sm">
              Both pointer and keyboard resizing obey the same bounds.
            </p>
          }
        />
      </div>
    </div>
  );
}

const sizesCode = `import * as React from "react";\nimport { SplitView } from "@/components/ui/split-view";\n\nexport function SizesDemo() {\n  const [size, setSize] = React.useState(30);\n  return <><p>Sidebar: {size.toFixed(1)}%. Bounds: 20–60%.</p><div className="h-96"><SplitView variant="bordered" defaultSize={30} minSize={20} maxSize={60} mainMinSize={30} onSidebarSizeChange={setSize} sidebarContent={<p className="p-4">Use Narrower, Wider or the divider.</p>} mainContent={<p className="p-4">Both pointer and keyboard resizing obey the same bounds.</p>} /></div></>;\n}`;

function PresetsDemo() {
  return (
    <div className="h-96 rounded-lg border">
      <KiraSplitView
        responsive={false}
        presets={[
          { label: "Focus details", size: 20 },
          { label: "Equal panes", size: 50 },
          { label: "Focus queue", size: 65 },
        ]}
        showResizeControls={false}
        sidebarContent={
          <p className="p-4 text-sm">
            Queue width follows the selected preset.
          </p>
        }
        mainContent={
          <p className="p-4 text-sm">
            Named layouts provide a click/tap alternative to the divider.
          </p>
        }
      />
    </div>
  );
}

const presetsCode = `import { KiraSplitView } from "@/components/ui/split-view";\n\nexport function PresetsDemo() {\n  return <div className="h-96 rounded-lg border"><KiraSplitView responsive={false} presets={[{ label: "Focus details", size: 20 }, { label: "Equal panes", size: 50 }, { label: "Focus queue", size: 65 }]} showResizeControls={false} sidebarContent={<p className="p-4">Queue width follows the selected preset.</p>} mainContent={<p className="p-4">Named layouts provide a click/tap alternative to the divider.</p>} /></div>;\n}`;

function ControlDemo() {
  const controlId1 = React.useId();

  const ref = React.useRef<SplitViewRef>(null);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => ref.current?.toggleSidebar()}
        >
          Toggle
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => ref.current?.expandSidebar()}
        >
          Expand
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => ref.current?.collapseSidebar()}
        >
          Collapse
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => ref.current?.resizeSidebar(40)}
        >
          Set to 40%
        </Button>
      </div>
      <div className="h-96">
        <SplitView
          ref={ref}
          variant="bordered"
          defaultCollapsed
          defaultSize={35}
          sidebarContent={
            <label htmlFor={controlId1} className="block p-4 text-sm">
              Retained sidebar draft
              <Textarea
                id={controlId1}
                defaultValue="This stays mounted while collapsed."
              />
            </label>
          }
          mainContent={
            <p className="p-4 text-sm">
              First expansion restores the configured 35%. Later expansions
              restore the last expanded size.
            </p>
          }
        />
      </div>
    </div>
  );
}

const controlCode = `import * as React from "react";\nimport { SplitView, type SplitViewRef } from "@/components/ui/split-view";\nimport { Button } from "@/components/ui/button";\nimport { Textarea } from "@/components/ui/textarea";\n\nexport function ControlDemo() {\n  const ref = React.useRef<SplitViewRef>(null);\n  return <><Button onClick={() => ref.current?.toggleSidebar()}>Toggle</Button><Button onClick={() => ref.current?.expandSidebar()}>Expand</Button><Button onClick={() => ref.current?.collapseSidebar()}>Collapse</Button><Button onClick={() => ref.current?.resizeSidebar(40)}>Set to 40%</Button><div className="h-96"><SplitView ref={ref} variant="bordered" defaultCollapsed defaultSize={35} sidebarContent={<label>Retained sidebar draft<Textarea defaultValue="This stays mounted while collapsed." /></label>} mainContent={<p>First expansion restores 35%; later expansions restore the last size.</p>} /></div></>;\n}`;

function PersistenceDemo() {
  const [mount, setMount] = React.useState(0);

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => setMount(mount + 1)}
      >
        Remount saved layout
      </Button>
      <div className="h-96">
        <SplitView
          key={mount}
          autoSaveId="split-view-release-demo"
          variant="bordered"
          sidebarContent={
            <p className="p-4 text-sm">Resize or collapse, then remount.</p>
          }
          mainContent={
            <p className="p-4 text-sm">
              Only layout is saved in browser storage. Application data stays
              caller-owned.
            </p>
          }
        />
      </div>
    </div>
  );
}

const persistenceCode = `import * as React from "react";\nimport { SplitView } from "@/components/ui/split-view";\nimport { Button } from "@/components/ui/button";\n\nexport function PersistenceDemo() {\n  const [mount, setMount] = React.useState(0);\n  return <><Button onClick={() => setMount(mount + 1)}>Remount saved layout</Button><div className="h-96"><SplitView key={mount} autoSaveId="split-view-release-demo" variant="bordered" sidebarContent={<p className="p-4">Resize or collapse, then remount.</p>} mainContent={<p className="p-4">Only layout is saved. Application data stays caller-owned.</p>} /></div></>;\n}`;

function CompactDemo() {
  const controlId1 = React.useId();

  const [narrow, setNarrow] = React.useState(true);
  const [pane, setPane] = React.useState<"sidebar" | "main">("sidebar");

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        aria-pressed={narrow}
        onClick={() => setNarrow(!narrow)}
      >
        Narrow container: {narrow ? "on" : "off"}
      </Button>
      <div
        className={
          narrow
            ? "h-96 w-full max-w-80 rounded-lg border"
            : "h-96 w-full rounded-lg border"
        }
      >
        <KiraSplitView
          activePane={pane}
          onActivePaneChange={setPane}
          sidebarContent={
            <div className="p-4">
              <Button
                type="button"
                variant="ghost"
                className="h-auto whitespace-normal text-start"
                onClick={() => setPane("main")}
              >
                Review workspace permissions
              </Button>
            </div>
          }
          mainContent={
            <label htmlFor={controlId1} className="block space-y-2 p-4 text-sm">
              Review draft
              <Textarea
                id={controlId1}
                defaultValue="Keep this draft when returning to the queue or widening the container."
              />
            </label>
          }
        />
      </div>
    </div>
  );
}

const compactCode = `import * as React from "react";\nimport { KiraSplitView } from "@/components/ui/split-view";\nimport { Button } from "@/components/ui/button";\nimport { Textarea } from "@/components/ui/textarea";\n\nexport function CompactDemo() {\n  const [narrow, setNarrow] = React.useState(true);\n  const [pane, setPane] = React.useState<"sidebar" | "main">("sidebar");\n  return <><Button aria-pressed={narrow} onClick={() => setNarrow(!narrow)}>Narrow container: {narrow ? "on" : "off"}</Button><div className={narrow ? "h-96 w-full max-w-80 rounded-lg border" : "h-96 w-full rounded-lg border"}><KiraSplitView activePane={pane} onActivePaneChange={setPane} sidebarContent={<Button onClick={() => setPane("main")}>Review workspace permissions</Button>} mainContent={<label>Review draft<Textarea defaultValue="Keep this draft when returning to the queue or widening the container." /></label>} /></div></>;\n}`;

function RefreshDemo() {
  const controlId1 = React.useId();

  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          aria-pressed={loading}
          onClick={() => setLoading(!loading)}
        >
          Refresh fixture
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setLoading(false);
            setError(
              "Details could not be refreshed. Retry to load the latest review.",
            );
          }}
        >
          Fail refresh
        </Button>
      </div>
      <div className="h-96 rounded-lg border">
        <KiraSplitView
          defaultActivePane="main"
          loading={loading}
          error={error}
          onRetry={() => {
            setError(undefined);
            setLoading(false);
          }}
          sidebarContent={<p className="p-4 text-sm">Workspace permissions</p>}
          mainContent={
            <label htmlFor={controlId1} className="block space-y-2 p-4 text-sm">
              Unsaved review note
              <Textarea
                id={controlId1}
                defaultValue="Type here, then refresh or fail the fixture."
              />
            </label>
          }
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Local fixture. The editor stays mounted; retry is caller-owned.
      </p>
    </div>
  );
}

const refreshCode = `import * as React from "react";\nimport { KiraSplitView } from "@/components/ui/split-view";\nimport { Button } from "@/components/ui/button";\nimport { Textarea } from "@/components/ui/textarea";\n\nexport function RefreshDemo() {\n  const [loading, setLoading] = React.useState(false);\n  const [error, setError] = React.useState<string>();\n  return <><Button aria-pressed={loading} onClick={() => setLoading(!loading)}>Refresh fixture</Button><Button onClick={() => { setLoading(false); setError("Details could not be refreshed. Retry to load the latest review."); }}>Fail refresh</Button><div className="h-96"><KiraSplitView defaultActivePane="main" loading={loading} error={error} onRetry={() => { setError(undefined); setLoading(false); }} sidebarContent={<p>Workspace permissions</p>} mainContent={<label>Unsaved review note<Textarea defaultValue="Type here, then refresh or fail the fixture." /></label>} /></div></>;\n}`;

type ReviewId = "permissions" | "migration";

function KiraDemo() {
  const controlId1 = React.useId();

  const [selected, setSelected] = React.useState<ReviewId>("permissions");
  const [pane, setPane] = React.useState<"sidebar" | "main">("sidebar");

  const [notes, setNotes] = React.useState<Record<ReviewId, string>>({
    permissions: "Check inherited guest permissions.",
    migration: "Waiting for staging restore.",
  });

  return (
    <div className="h-96 rounded-lg border">
      <KiraSplitView
        activePane={pane}
        onActivePaneChange={setPane}
        autoSaveId="split-view-kira-review"
        sidebarContent={
          <div className="space-y-2 p-3">
            {(["permissions", "migration"] as const).map((id) => (
              <Button
                key={id}
                type="button"
                variant={selected === id ? "secondary" : "ghost"}
                aria-pressed={selected === id}
                className="h-auto w-full justify-start whitespace-normal text-start"
                onClick={() => {
                  setSelected(id);
                  setPane("main");
                }}
              >
                {id === "permissions"
                  ? "Workspace permissions"
                  : "Migration rollback"}
              </Button>
            ))}
          </div>
        }
        mainContent={
          <div className="space-y-3 p-4">
            <h3 className="font-medium">
              {selected === "permissions"
                ? "Workspace permissions"
                : "Migration rollback"}
            </h3>
            <label htmlFor={controlId1} className="block space-y-2 text-sm">
              Review note
              <Textarea
                id={controlId1}
                value={notes[selected]}
                onChange={(event) =>
                  setNotes({ ...notes, [selected]: event.target.value })
                }
              />
            </label>
            <p className="text-xs text-muted-foreground">
              Each record's draft lives in caller state; switching records
              restores its note.
            </p>
          </div>
        }
      />
    </div>
  );
}

const kiraCode = `import * as React from "react";\nimport { KiraSplitView } from "@/components/ui/split-view";\nimport { Button } from "@/components/ui/button";\nimport { Textarea } from "@/components/ui/textarea";\ntype ReviewId = "permissions" | "migration";\n\nexport function KiraDemo() {\n  const [selected, setSelected] = React.useState<ReviewId>("permissions");\n  const [pane, setPane] = React.useState<"sidebar" | "main">("sidebar");\n  const [notes, setNotes] = React.useState<Record<ReviewId, string>>({ permissions: "Check inherited guest permissions.", migration: "Waiting for staging restore." });\n  return <div className="h-96"><KiraSplitView activePane={pane} onActivePaneChange={setPane} autoSaveId="split-view-kira-review" sidebarContent={<div>{(["permissions", "migration"] as const).map((id) => <Button key={id} aria-pressed={selected === id} onClick={() => { setSelected(id); setPane("main"); }}>{id === "permissions" ? "Workspace permissions" : "Migration rollback"}</Button>)}</div>} mainContent={<label>Review note<Textarea value={notes[selected]} onChange={(event) => setNotes({ ...notes, [selected]: event.target.value })} /></label>} /></div>;\n}`;

const stressReviewItems = [
  { id: "review-1", label: "Review item 1" },
  { id: "review-2", label: "Review item 2" },
  { id: "review-3", label: "Review item 3" },
  { id: "review-4", label: "Review item 4" },
  { id: "review-5", label: "Review item 5" },
  { id: "review-6", label: "Review item 6" },
  { id: "review-7", label: "Review item 7" },
  { id: "review-8", label: "Review item 8" },
] as const;

function StressDemo() {
  const controlId1 = React.useId();

  const [state, setState] = React.useState<
    "disabled" | "empty" | "loading" | "stress"
  >("stress");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(["disabled", "empty", "loading", "stress"] as const).map((value) => (
          <Button
            key={value}
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={state === value}
            onClick={() => setState(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="h-96 max-w-xs rounded-lg border">
        <KiraSplitView
          defaultActivePane="main"
          disabled={state === "disabled"}
          disabledReason={
            state === "disabled"
              ? "Layout is locked for this read-only review session."
              : undefined
          }
          empty={state === "empty" || state === "loading"}
          loading={state === "loading"}
          sidebarLabel="ReviewAcrossEngineeringCustomerSuccessAndLocalization"
          sidebarContent={
            <p className="p-4 text-sm">No items match the current queue.</p>
          }
          mainContent={
            state === "empty" || state === "loading" ? null : (
              <div className="space-y-2 p-4">
                <h3 className="break-words font-medium">
                  ReviewAcrossInternationalEnterpriseWorkspacesWithoutWhitespace
                </h3>
                <label htmlFor={controlId1} className="block text-sm">
                  Note
                  <Textarea
                    id={controlId1}
                    defaultValue="ณัฐชา 山田 — keep text and controls reachable."
                  />
                </label>
                {stressReviewItems.map((item) => (
                  <p key={item.id} className="text-sm text-muted-foreground">
                    {item.label}: independent pane scrolling keeps the toolbar
                    reachable.
                  </p>
                ))}
              </div>
            )
          }
        />
      </div>
    </div>
  );
}

const stressCode = `import * as React from "react";
import { KiraSplitView } from "@/components/ui/split-view";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const stressReviewItems = [
  { id: "review-1", label: "Review item 1" },
  { id: "review-2", label: "Review item 2" },
  { id: "review-3", label: "Review item 3" },
  { id: "review-4", label: "Review item 4" },
  { id: "review-5", label: "Review item 5" },
  { id: "review-6", label: "Review item 6" },
  { id: "review-7", label: "Review item 7" },
  { id: "review-8", label: "Review item 8" },
] as const;

export function StressDemo() {
  const [state, setState] = React.useState<
    "disabled" | "empty" | "loading" | "stress"
  >("stress");
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {(["disabled", "empty", "loading", "stress"] as const).map((value) => (
          <Button
            key={value}
            type="button"
            variant="outline"
            size="sm"
            aria-pressed={state === value}
            onClick={() => setState(value)}
          >
            {value}
          </Button>
        ))}
      </div>
      <div className="h-96 max-w-xs rounded-lg border">
        <KiraSplitView
          defaultActivePane="main"
          disabled={state === "disabled"}
          disabledReason={
            state === "disabled"
              ? "Layout is locked for this read-only review session."
              : undefined
          }
          empty={state === "empty" || state === "loading"}
          loading={state === "loading"}
          sidebarLabel="ReviewAcrossEngineeringCustomerSuccessAndLocalization"
          sidebarContent={
            <p className="p-4 text-sm">No items match the current queue.</p>
          }
          mainContent={
            state === "empty" || state === "loading" ? null : (
              <div className="space-y-2 p-4">
                <h3 className="break-words font-medium">
                  ReviewAcrossInternationalEnterpriseWorkspacesWithoutWhitespace
                </h3>
                <label className="block text-sm">
                  Note
                  <Textarea defaultValue="ณัฐชา 山田 — keep text and controls reachable." />
                </label>
                {stressReviewItems.map((item) => (
                  <p key={item.id} className="text-sm text-muted-foreground">
                    {item.label}: independent pane scrolling keeps the toolbar
                    reachable.
                  </p>
                ))}
              </div>
            )
          }
        />
      </div>
    </div>
  );
}`;

const usageCode = `import { SplitView, KiraSplitView } from "@/components/ui/split-view";

export function SplitViewUsage() {
  return (
    <div className="h-96 rounded-lg border">
      <KiraSplitView
        autoSaveId="release-review-layout"
        sidebarContent={<p className="p-4 text-sm">Queue items</p>}
        mainContent={<p className="p-4 text-sm">Selected review details</p>}
      />
    </div>
  );
}`;

export default function SplitViewPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Split View"
        description="A resizable review workspace with compact queue/detail navigation, saved widths and retained drafts."
        version="v2.0.1"
      />
      <FeatureGrid
        features={splitViewPageFeatures}
        description="Capabilities built into Kira Kit."
      />
      <DemoTabs defaultValue="basic" tabs={splitViewPageDemoTabs} />
      <KeyboardShortcuts
        description="Shared panel-engine keys and native action buttons."
        shortcuts={splitViewPageShortcuts}
      />
      <UsageBlock
        title="Usage"
        description="Import SplitView for direct layout control or KiraSplitView for responsive queue/detail workspaces."
        code={usageCode}
        notes={[
          {
            label: "KiraSplitView",
            body: "Use KiraSplitView for responsive single-pane switching below 640px, named width presets, and retained loading/empty/error feedback.",
          },
          {
            label: "SplitView + SplitViewRef",
            body: "Use SplitView directly with a ref when you need imperative toggleSidebar, expandSidebar, collapseSidebar, or resizeSidebar control.",
          },
        ]}
      />
      <APIReference
        sections={splitViewPageAPISections}
        description="Props, types, and defaults for each exported part."
      />
      <Changelog entries={splitViewPageChangelogEntries} />
    </ComponentPage>
  );
}

// Static demo metadata stays co-located at the bottom, typed via satisfies.
const splitViewPageFeatures = [
  {
    title: "Resize without dragging",
    description:
      "Native separator, width steps, presets and collapse controls.",
  },
  {
    title: "Compact review",
    description:
      "Local-container queue/detail navigation keeps both panes mounted.",
  },
  {
    title: "Retained context",
    description: "Saved layout, record-owned drafts and recoverable refresh.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const splitViewPageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Release queue and review"
        description="Default horizontal split with bordered container and persistent controls."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "vertical",
    label: "Vertical",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Summary above validation output"
        description="Stack the sidebar above the main pane with vertical orientation."
        code={verticalCode}
      >
        <VerticalDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "sizes",
    label: "Sizes",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Bounded percentage sizing"
        description="Configure minSize, maxSize, and mainMinSize bounds."
        code={sizesCode}
      >
        <SizesDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "control",
    label: "Control",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Collapse and imperative control"
        description="Drive toggle, expand, collapse, and resize through SplitViewRef."
        code={controlCode}
      >
        <ControlDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "persistence",
    label: "Saved layout",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Saved resize and collapse"
        description="Persist layout dimensions with autoSaveId across remounts."
        code={persistenceCode}
      >
        <PersistenceDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "presets",
    label: "Presets",
    group: "KiraSplitView",
    demo: (
      <DemoWrapper
        title="Named widths without dragging"
        description="Provide one-click layout presets in the KiraSplitView toolbar."
        code={presetsCode}
      >
        <PresetsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "compact",
    label: "Compact",
    group: "KiraSplitView",
    demo: (
      <DemoWrapper
        title="Queue/detail in a narrow container"
        description="Switch between single-pane queue and detail views while preserving drafts."
        code={compactCode}
      >
        <CompactDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "refresh",
    label: "Refresh",
    group: "KiraSplitView",
    demo: (
      <DemoWrapper
        title="Retain an unsaved review"
        description="Display loading and recoverable error banners without unmounting the editor."
        code={refreshCode}
      >
        <RefreshDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    group: "KiraSplitView",
    demo: (
      <DemoWrapper
        title="Record-specific review drafts"
        description="Combine responsive queue/detail navigation with autoSaveId and caller-owned drafts."
        code={kiraCode}
      >
        <KiraDemo />
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
        description="Long unbroken labels, empty content, loading, disabled lock state, and narrow max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const splitViewPageShortcuts = [
  {
    keys: "Tab / Shift+Tab",
    description:
      "Move through persistent controls, resize separator and active pane content.",
  },
  {
    keys: "ArrowLeft / ArrowRight",
    description:
      "Resize a horizontal split (inherited from react-resizable-panels).",
  },
  {
    keys: "ArrowUp / ArrowDown",
    description:
      "Resize a vertical split (inherited from react-resizable-panels).",
  },
  {
    keys: "Home / End / Enter on separator",
    description:
      "Engine minimum/maximum and collapse/restore behavior; verify against current panel constraints.",
  },
  {
    keys: "Enter / Space on width controls",
    description: "Kira click/keyboard alternative: ±5% or a named preset.",
  },
  {
    keys: "Enter / Space on queue/detail controls",
    description:
      "Change compact pane without remounting its editor; selection is caller-owned.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const splitViewPageAPISections = [
  {
    title: "SplitView",
    props: [
      {
        prop: "sidebarContent / mainContent",
        type: "React.ReactNode",
        default: "Required",
        description:
          "Required slots; both content trees stay mounted when hidden or collapsed.",
      },
      {
        prop: "orientation / variant",
        type: '"horizontal" | "vertical" / "default" | "bordered"',
        default: '"horizontal" / "default"',
        description:
          "Shared Resizable direction and exported splitViewVariants appearance.",
      },
      {
        prop: "defaultSize / minSize / maxSize / mainMinSize",
        type: "number",
        default: "25 / 10 / 75 / 10",
        description:
          "Percentages, not upstream numeric pixels; finite values clamp to valid bounds, sidebar minimum at least 1%.",
      },
      {
        prop: "collapsible / collapsedSize / defaultCollapsed",
        type: "boolean / number / boolean",
        default: "true / 0 / false",
        description:
          "Collapse policy, percentage strictly below minimum, and initial collapse.",
      },
      {
        prop: "showToggle / showResizeControls",
        type: "boolean / boolean",
        default: "true / true",
        description:
          "Persistent collapse action and click/tap ±5% resizing controls.",
      },
      {
        prop: "sidebarLabel / mainLabel",
        type: "string / string",
        default: '"Sidebar" / "Main content"',
        description: "Visible toolbar and accessible region/resize names.",
      },
      {
        prop: "onCollapsedChange / onSidebarSizeChange",
        type: "(collapsed: boolean) => void / (percentage: number) => void",
        default: "-",
        description:
          "Native resize state notifications; compact presentation does not publish split measurements.",
      },
      {
        prop: "disabled / disabledReason",
        type: "boolean / string",
        default: "false / -",
        description:
          "Disable layout actions with a visible reason. Content remains caller-owned.",
      },
      {
        prop: "autoSaveId",
        type: "string",
        default: "-",
        description:
          "Opt-in safe browser storage. Use one unique key per instance. Layout keys include orientation; no content is persisted.",
      },
      {
        prop: "pane",
        type: '"split" | "sidebar" | "main"',
        default: '"split"',
        description:
          "Presentation mode retaining both DOM trees; disables splitter in a single pane.",
      },
      {
        prop: "group props / className / ref",
        type: "Omit<React.ComponentProps<typeof ResizablePanelGroup>, 'orientation' | 'children' | 'className'> / string / React.Ref<SplitViewRef>",
        default: "-",
        description:
          "Group attributes, layout/callback/ref options; className styles outer shell and ref exposes the SplitView handle. defaultLayout panel keys follow autoSaveId + :sidebar/:main, otherwise generated IDs.",
      },
    ],
  },
  {
    title: "KiraSplitView",
    props: [
      {
        prop: "inherited",
        type: 'Omit<SplitViewProps, "pane">',
        default: "-",
        description:
          "All SplitView configuration; Kira owns adaptive pane presentation.",
      },
      {
        prop: "responsive",
        type: "boolean",
        default: "true",
        description:
          "Observe local container: below 640px show queue/detail navigation; at desktop retain split layout. Both content trees stay mounted.",
      },
      {
        prop: "activePane / defaultActivePane / onActivePaneChange",
        type: '"sidebar" | "main" / "sidebar" | "main" / (pane: "sidebar" | "main") => void',
        default: '"sidebar"',
        description:
          "Controlled/current or local initial compact navigation. Caller can open details when selecting a record.",
      },
      {
        prop: "presets",
        type: "SplitViewPreset[]",
        default: "25%, 50%, 65%",
        description:
          "Named width buttons in split mode; [] hides presets. Values obey SplitView bounds.",
      },
      {
        prop: "loading / empty / error / onRetry",
        type: "boolean / boolean / string / () => void",
        default: "false / false / - / -",
        description:
          "Detail status and caller recovery; existing editor stays mounted. empty with loading reserves a static skeleton.",
      },
      {
        prop: "sidebarLabel / mainLabel",
        type: "string / string",
        default: '"Work queue" / "Review details"',
        description: "Accessible queue and detail names.",
      },
    ],
  },
  {
    title: "SplitViewRef",
    props: [
      {
        prop: "toggleSidebar / expandSidebar / collapseSidebar",
        type: "() => void",
        default: "-",
        description:
          "Respect disabled/collapsible and split presentation; first expansion restores defaultSize, later expansions restore last size.",
      },
      {
        prop: "resizeSidebar",
        type: "(percentage: number) => void",
        default: "-",
        description:
          "Bounded percentage resize, including expansion; ignored while disabled or in a single pane.",
      },
      {
        prop: "getSidebarSize",
        type: "() => number | undefined",
        default: "-",
        description:
          "Current engine percentage; undefined before engine registration.",
      },
    ],
  },
  {
    title: "SplitViewPreset",
    props: [
      {
        prop: "label / size",
        type: "string / number",
        default: "Required",
        description: "Visible preset name and sidebar percentage.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const splitViewPageChangelogEntries = [
  {
    version: "2.0.1",
    date: "26 November 2026",
    changes: [
      {
        type: "changed",
        title: "Shared validated layout storage helper",
        description:
          "Adopted createValidatedLayoutStorage and unsavedLayoutStorage from @/lib/layout-storage, sharing persistence validation with Resizable.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "15 November 2026",
    changes: [
      {
        type: "breaking",
        title: "Explicit content and stable controls",
        description:
          "Removed inherited children (never rendered). Default sidebar is 25%, with maximum/main minimum and finite percentage constraints. Toolbar stays mounted outside panes; new slot names and generated panel IDs replace fixed sidebar/main IDs. autoSaveId uses a new validated split-view storage namespace; old saved widths are not migrated. Audited against Base UI 1.9.0 and react-resizable-panels 4.16.0; use-case research cutoff October 31.",
      },
      {
        type: "added",
        title: "Kira review workspace",
        description:
          "Compact container navigation, named presets, retained loading/error/empty states, caller retry and record-owned draft examples. ResizeSidebar/getSidebarSize extend the handle.",
      },
      {
        type: "fixed",
        title: "Accessible resizing and disclosure",
        description:
          "Named persistent toggle, click/tap resize controls, unique region IDs, inert collapsed content, first-expansion size retention and focus transfer when compact navigation hides the focused pane.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
