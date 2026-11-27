import type { ComponentProps as ReactComponentProps } from "react";
import * as React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  CollapsiblePanel,
  KiraResizable,
  usePanelRef,
  useGroupRef,
  type Layout,
} from "@/components/ui/resizable";
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
  const [layout, setLayout] = React.useState<Layout>({});

  return (
    <div className="space-y-3">
      <div className="h-56 overflow-hidden rounded-lg border">
        <ResizablePanelGroup onLayoutChange={setLayout}>
          <ResizablePanel id="basic-source" defaultSize="40%" minSize="20%">
            <div className="p-4 text-sm">
              <h3 className="font-medium">Source</h3>
              <p className="mt-2 text-muted-foreground">
                Edit the release notes beside their preview.
              </p>
            </div>
          </ResizablePanel>
          <ResizableHandle aria-label="Resize source and preview" />
          <ResizablePanel id="basic-preview" defaultSize="60%" minSize="20%">
            <div className="p-4 text-sm">
              <h3 className="font-medium">Preview</h3>
              <p className="mt-2 text-muted-foreground">
                The preview uses the remaining space.
              </p>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <p className="text-xs tabular-nums text-muted-foreground">
        Source {Math.round(layout["basic-source"] ?? 40)}% · Preview{" "}
        {Math.round(layout["basic-preview"] ?? 60)}%
      </p>
    </div>
  );
}

const basicCode = `import * as React from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  type Layout,
} from "@/components/ui/resizable"

export function BasicDemo() {
  const [layout, setLayout] = React.useState<Layout>({})

  return (
    <div className="space-y-3">
      <div className="h-56 overflow-hidden rounded-lg border">
        <ResizablePanelGroup onLayoutChange={setLayout}>
          <ResizablePanel id="basic-source" defaultSize="40%" minSize="20%">
            <div className="p-4 text-sm">
              <h3 className="font-medium">Source</h3>
              <p className="mt-2 text-muted-foreground">
                Edit the release notes beside their preview.
              </p>
            </div>
          </ResizablePanel>
          <ResizableHandle aria-label="Resize source and preview" />
          <ResizablePanel id="basic-preview" defaultSize="60%" minSize="20%">
            <div className="p-4 text-sm">
              <h3 className="font-medium">Preview</h3>
              <p className="mt-2 text-muted-foreground">
                The preview uses the remaining space.
              </p>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
      <p className="text-xs tabular-nums text-muted-foreground">
        Source {Math.round(layout["basic-source"] ?? 40)}% · Preview {Math.round(layout["basic-preview"] ?? 60)}%
      </p>
    </div>
  )
}`;

function VariantsDemo() {
  const variants = ["default", "subtle", "prominent"] satisfies Array<
    React.ComponentProps<typeof ResizableHandle>["variant"]
  >;

  return (
    <div className="space-y-4">
      {variants.map((variant) => (
        <div key={variant} className="h-24 overflow-hidden rounded-lg border">
          <ResizablePanelGroup>
            <ResizablePanel defaultSize="50%">
              <p className="p-3 text-sm">{variant}</p>
            </ResizablePanel>
            <ResizableHandle
              variant={variant}
              aria-label={"Resize " + variant + " example"}
            />
            <ResizablePanel defaultSize="50%">
              <p className="p-3 text-sm text-muted-foreground">
                Drag or use arrow keys
              </p>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ))}
    </div>
  );
}

const variantsCode = `import * as React from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

export function VariantsDemo() {
  const variants = ["default", "subtle", "prominent"] as const

  return (
    <div className="space-y-4">
      {variants.map((variant) => (
        <div key={variant} className="h-24 overflow-hidden rounded-lg border">
          <ResizablePanelGroup>
            <ResizablePanel defaultSize="50%">
              <p className="p-3 text-sm">{variant}</p>
            </ResizablePanel>
            <ResizableHandle
              variant={variant}
              aria-label={"Resize " + variant + " example"}
            />
            <ResizablePanel defaultSize="50%">
              <p className="p-3 text-sm text-muted-foreground">
                Drag or use arrow keys
              </p>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      ))}
    </div>
  )
}`;

function ConstraintsDemo() {
  return (
    <div className="h-56 overflow-hidden rounded-lg border">
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="30%" minSize="20%" maxSize="45%">
          <div className="space-y-2 p-3 text-sm">
            <h3 className="font-medium">Inspector</h3>
            <p className="break-words text-muted-foreground">
              20–45% of the available width
            </p>
          </div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize inspector from 20 to 45 percent" />
        <ResizablePanel>
          <p className="p-3 text-sm text-muted-foreground">
            Canvas fills the available space.
          </p>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

const constraintsCode = `import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

export function ConstraintsDemo() {
  return (
    <div className="h-56 overflow-hidden rounded-lg border">
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="30%" minSize="20%" maxSize="45%">
          <div className="space-y-2 p-3 text-sm">
            <h3 className="font-medium">Inspector</h3>
            <p className="break-words text-muted-foreground">
              20–45% of the available width
            </p>
          </div>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize inspector from 20 to 45 percent" />
        <ResizablePanel>
          <p className="p-3 text-sm text-muted-foreground">
            Canvas fills the available space.
          </p>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}`;

function CollapseDemo() {
  const panel = usePanelRef();
  const [collapsed, setCollapsed] = React.useState(false);
  const panelId = React.useId();

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        size="sm"
        aria-controls={panelId}
        aria-expanded={!collapsed}
        onClick={() => {
          if (panel.current?.isCollapsed()) panel.current.expand();
          else panel.current?.collapse();
        }}
      >
        {collapsed ? "Show outline" : "Hide outline"}
      </Button>
      <div className="h-48 overflow-hidden rounded-lg border">
        <ResizablePanelGroup>
          <CollapsiblePanel
            id={panelId}
            panelRef={panel}
            defaultSize="30%"
            minSize="20%"
            onResize={() => setCollapsed(panel.current?.isCollapsed() ?? false)}
          >
            <div className="p-3 text-sm" inert={collapsed || undefined}>
              Overview
              <br />
              API changes
              <br />
              Migration
            </div>
          </CollapsiblePanel>
          <ResizableHandle aria-label="Resize or collapse the outline" />
          <ResizablePanel>
            <p className="p-3 text-sm">Release notes</p>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

const collapseCode = `import * as React from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  CollapsiblePanel,
  usePanelRef,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"

export function CollapseDemo() {
  const panel = usePanelRef()
  const [collapsed, setCollapsed] = React.useState(false)
  const panelId = React.useId()

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        size="sm"
        aria-controls={panelId}
        aria-expanded={!collapsed}
        onClick={() => {
          if (panel.current?.isCollapsed()) panel.current.expand()
          else panel.current?.collapse()
        }}
      >
        {collapsed ? "Show outline" : "Hide outline"}
      </Button>
      <div className="h-48 overflow-hidden rounded-lg border">
        <ResizablePanelGroup>
          <CollapsiblePanel
            id={panelId}
            panelRef={panel}
            defaultSize="30%"
            minSize="20%"
            onResize={() => setCollapsed(panel.current?.isCollapsed() ?? false)}
          >
            <div className="p-3 text-sm" inert={collapsed || undefined}>
              Overview<br />API changes<br />Migration
            </div>
          </CollapsiblePanel>
          <ResizableHandle aria-label="Resize or collapse the outline" />
          <ResizablePanel>
            <p className="p-3 text-sm">Release notes</p>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}`;

function NestedDemo() {
  return (
    <div className="h-72 overflow-hidden rounded-lg border">
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize="65%" minSize="35%">
          <ResizablePanelGroup>
            <ResizablePanel defaultSize="35%" minSize="20%">
              <p className="p-3 text-sm">Files</p>
            </ResizablePanel>
            <ResizableHandle aria-label="Resize files and editor" />
            <ResizablePanel>
              <p className="p-3 text-sm">Editor</p>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize editor and build output" />
        <ResizablePanel minSize="20%">
          <p className="p-3 font-mono text-xs text-muted-foreground">
            Build completed.
            <br />
            Ready for review.
          </p>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

const nestedCode = `import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

export function NestedDemo() {
  return (
    <div className="h-72 overflow-hidden rounded-lg border">
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize="65%" minSize="35%">
          <ResizablePanelGroup>
            <ResizablePanel defaultSize="35%" minSize="20%">
              <p className="p-3 text-sm">Files</p>
            </ResizablePanel>
            <ResizableHandle aria-label="Resize files and editor" />
            <ResizablePanel>
              <p className="p-3 text-sm">Editor</p>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
        <ResizableHandle aria-label="Resize editor and build output" />
        <ResizablePanel minSize="20%">
          <p className="p-3 font-mono text-xs text-muted-foreground">
            Build completed.<br />Ready for review.
          </p>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}`;

function PersistenceDemo() {
  const [instance, setInstance] = React.useState(0);
  const group = useGroupRef();

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setInstance((value) => value + 1)}
        >
          Remount saved layout
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            group.current?.setLayout({ "saved-notes": 35, "saved-review": 65 })
          }
        >
          Restore 35 / 65
        </Button>
      </div>
      <div className="h-48 overflow-hidden rounded-lg border">
        <ResizablePanelGroup
          key={instance}
          autoSaveId="resizable-demo-v2"
          groupRef={group}
          defaultLayout={{ "saved-notes": 35, "saved-review": 65 }}
        >
          <ResizablePanel id="saved-notes" minSize="15%">
            <p className="p-3 text-sm">Notes</p>
          </ResizablePanel>
          <ResizableHandle aria-label="Resize saved notes and review" />
          <ResizablePanel id="saved-review" minSize="15%">
            <p className="p-3 text-sm">Review</p>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}

const persistenceCode = `import * as React from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  useGroupRef,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"

export function PersistenceDemo() {
  const [instance, setInstance] = React.useState(0)
  const group = useGroupRef()

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setInstance((v) => v + 1)}>
          Remount saved layout
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            group.current?.setLayout({ "saved-notes": 35, "saved-review": 65 })
          }
        >
          Restore 35 / 65
        </Button>
      </div>
      <div className="h-48 overflow-hidden rounded-lg border">
        <ResizablePanelGroup
          key={instance}
          autoSaveId="resizable-demo-v2"
          groupRef={group}
          defaultLayout={{ "saved-notes": 35, "saved-review": 65 }}
        >
          <ResizablePanel id="saved-notes" minSize="15%">
            <p className="p-3 text-sm">Notes</p>
          </ResizablePanel>
          <ResizableHandle aria-label="Resize saved notes and review" />
          <ResizablePanel id="saved-review" minSize="15%">
            <p className="p-3 text-sm">Review</p>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}`;

function PreviewDemo() {
  return (
    <div className="h-56 overflow-hidden rounded-lg border">
      <ResizablePanelGroup resizePreviewMode="separator">
        <ResizablePanel defaultSize="50%" minSize="20%">
          <p className="p-4 text-sm">Design canvas</p>
        </ResizablePanel>
        <ResizableHandle
          variant="prominent"
          aria-label="Preview a new canvas size"
        />
        <ResizablePanel minSize="20%">
          <p className="p-4 text-sm text-muted-foreground">
            A chart or embedded preview can stay still while you drag.
          </p>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

const previewCode = `import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

export function PreviewDemo() {
  return (
    <div className="h-56 overflow-hidden rounded-lg border">
      <ResizablePanelGroup resizePreviewMode="separator">
        <ResizablePanel defaultSize="50%" minSize="20%">
          <p className="p-4 text-sm">Design canvas</p>
        </ResizablePanel>
        <ResizableHandle variant="prominent" aria-label="Preview a new canvas size" />
        <ResizablePanel minSize="20%">
          <p className="p-4 text-sm text-muted-foreground">
            A chart or embedded preview can stay still while you drag.
          </p>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}`;

function KiraDemo() {
  return (
    <KiraResizable
      className="h-80"
      autoSaveId="kira-review-demo-v2"
      aria-label="Review workspace"
      defaultLayout={{ files: 25, preview: 50, details: 25 }}
      panels={[
        {
          id: "files",
          label: "Files",
          collapsible: true,
          minSize: "15%",
          content: (
            <div className="space-y-2 p-3 text-sm">
              <h3 className="font-medium">Files</h3>
              <p className="break-all text-muted-foreground">
                release-notes.md
              </p>
            </div>
          ),
        },
        {
          id: "preview",
          label: "Preview",
          minSize: "25%",
          content: (
            <div className="space-y-2 p-3 text-sm">
              <h3 className="font-medium">Ready for review</h3>
              <p className="text-muted-foreground">
                More room for the work in front of you.
              </p>
            </div>
          ),
        },
        {
          id: "details",
          label: "Details",
          collapsible: true,
          minSize: "15%",
          content: (
            <div className="p-3 text-sm">
              <h3 className="font-medium">Details</h3>
              <p className="mt-2 text-muted-foreground">Updated today</p>
              <Button size="sm" variant="ghost">
                View history
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}

const kiraCode = `import { KiraResizable } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"

export function KiraDemo() {
  return (
    <KiraResizable
      className="h-80"
      autoSaveId="kira-review-demo-v2"
      aria-label="Review workspace"
      defaultLayout={{ files: 25, preview: 50, details: 25 }}
      panels={[
        {
          id: "files",
          label: "Files",
          collapsible: true,
          minSize: "15%",
          content: (
            <div className="space-y-2 p-3 text-sm">
              <h3 className="font-medium">Files</h3>
              <p className="break-all text-muted-foreground">release-notes.md</p>
            </div>
          ),
        },
        {
          id: "preview",
          label: "Preview",
          minSize: "25%",
          content: (
            <div className="space-y-2 p-3 text-sm">
              <h3 className="font-medium">Ready for review</h3>
              <p className="text-muted-foreground">More room for the work in front of you.</p>
            </div>
          ),
        },
        {
          id: "details",
          label: "Details",
          collapsible: true,
          minSize: "15%",
          content: (
            <div className="p-3 text-sm">
              <h3 className="font-medium">Details</h3>
              <p className="mt-2 text-muted-foreground">Updated today</p>
              <Button size="sm" variant="ghost">View history</Button>
            </div>
          ),
        },
      ]}
    />
  )
}`;

function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <KiraResizable
        className="h-56"
        disabled
        disabledReason="Layout is fixed while presenting."
        panels={[
          {
            id: "presenter",
            label: "International accessibility presenter notes",
            collapsible: true,
            content: (
              <p className="break-all p-3 text-sm">
                release-notes-for-the-international-accessibility-review.md
              </p>
            ),
          },
          {
            id: "slides",
            label: "Slides",
            content: <p className="p-3 text-sm">日本語 · العربية · Preview</p>,
          },
        ]}
      />
      <KiraResizable className="h-40" panels={[]} />
    </div>
  );
}

const stressCode = `import { KiraResizable } from "@/components/ui/resizable"

export function StressDemo() {
  return (
    <div className="max-w-xs space-y-4">
      <KiraResizable
        className="h-56"
        disabled
        disabledReason="Layout is fixed while presenting."
        panels={[
          {
            id: "presenter",
            label: "International accessibility presenter notes",
            collapsible: true,
            content: (
              <p className="break-all p-3 text-sm">
                release-notes-for-the-international-accessibility-review.md
              </p>
            ),
          },
          {
            id: "slides",
            label: "Slides",
            content: <p className="p-3 text-sm">日本語 · العربية · Preview</p>,
          },
        ]}
      />
      <KiraResizable className="h-40" panels={[]} />
    </div>
  )
}`;

const usageCode = `import { KiraResizable } from "@/components/ui/resizable"

export function DocumentLayout() {
  return (
    <KiraResizable
      className="h-80"
      autoSaveId="document-review"
      defaultLayout={{ outline: 30, document: 70 }}
      panels={[
        {
          id: "outline",
          label: "Outline",
          collapsible: true,
          minSize: "15%",
          content: <p className="p-4">Introduction</p>,
        },
        {
          id: "document",
          label: "Document",
          minSize: "30%",
          content: <p className="p-4">Release notes</p>,
        },
      ]}
    />
  )
}`;

export default function ResizablePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Resizable"
        description="Accessible split layouts for editors, review tools and dashboards."
        version="v2.0.1"
      />

      <FeatureGrid
        features={resizablePageFeatures}
        description="Split-pane capabilities built into Kira Kit."
      />

      <DemoTabs tabs={resizablePageDemoTabs} defaultValue="basic" />

      <KeyboardShortcuts
        description="Group separator behavior is inherited from react-resizable-panels 4.16.0. Kira adds ordinary buttons."
        shortcuts={resizablePageShortcuts}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Compose ResizablePanelGroup primitives or use KiraResizable for named panels and toolbar controls."
        notes={[
          {
            label: "KiraResizable",
            body: "Use the data-driven wrapper when you want built-in collapse/expand buttons, restore/balance actions, tolerant localStorage persistence, and locked-layout messaging.",
          },
        ]}
      />

      <APIReference
        sections={resizablePageAPISections}
        description="Props, types, and defaults for each exported part."
      />

      <Changelog
        entries={resizablePageChangelogEntries}
        title="Changelog"
        description="Version history for this component."
      />
    </ComponentPage>
  );
}

const resizablePageFeatures = [
  {
    title: "Native resizing",
    description:
      "Pointer and keyboard controls, constraints and nested layouts.",
  },
  {
    title: "Remember your layout",
    description: "Saved sizes and a visible restore action.",
  },
  {
    title: "Named workspaces",
    description: "Collapse side panels without losing their content.",
  },
] satisfies ReactComponentProps<typeof FeatureGrid>["features"];

const resizablePageDemoTabs = [
  {
    value: "basic",
    label: "Basic",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Resize a document and its preview."
        description="Numbers are pixels. Percentage sizes use explicit % strings."
        code={basicCode}
      >
        <BasicDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "variants",
    label: "Handles",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Three separator treatments."
        description="Hover, keyboard focus and dragging use the primitive's real interaction state."
        code={variantsCode}
      >
        <VariantsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "constraints",
    label: "Constraints",
    group: "Core",
    demo: (
      <DemoWrapper
        title="A bounded inspector."
        description="The inspector starts at 30% and stays between 20% and 45%."
        code={constraintsCode}
      >
        <ConstraintsDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "collapse",
    label: "Collapse",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Make room for the main document."
        description="A visible button offers the same collapse and restore action as the separator's Enter key."
        code={collapseCode}
      >
        <CollapseDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "nested",
    label: "Nested",
    group: "Core",
    demo: (
      <DemoWrapper
        title="Editor above build output."
        description="Horizontal and vertical groups compose without a second resize implementation."
        code={nestedCode}
      >
        <NestedDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "kira",
    label: "Kira",
    group: "KiraResizable",
    demo: (
      <DemoWrapper
        title="A saved review workspace."
        description="Named panels, collapse buttons and restore share native layout state."
        code={kiraCode}
      >
        <KiraDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "persistence",
    label: "Saved layout",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Remember panel sizes."
        description="Resize, then remount the example or reload. Restore writes the default layout back to storage."
        code={persistenceCode}
      >
        <PersistenceDemo />
      </DemoWrapper>
    ),
  },
  {
    value: "preview",
    label: "Drag preview",
    group: "Behavior",
    demo: (
      <DemoWrapper
        title="Defer expensive panel reflows."
        description="A separator preview follows the pointer; panel content resizes on release."
        code={previewCode}
      >
        <PreviewDemo />
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
        description="Long panel labels, unbreakable filenames, multilingual text, disabled states, and empty panels in a max-w-xs container."
        code={stressCode}
      >
        <StressDemo />
      </DemoWrapper>
    ),
  },
] satisfies ReactComponentProps<typeof DemoTabs>["tabs"];

const resizablePageShortcuts = [
  {
    keys: "Tab / Shift + Tab",
    description: "Move through separators and buttons.",
  },
  {
    keys: "Arrow keys",
    description:
      "Resize along the group's axis (native). Shift uses a larger step.",
  },
  {
    keys: "Home / End",
    description: "Move the focused separator to its allowed boundary (native).",
  },
  {
    keys: "Enter",
    description:
      "On a separator next to a collapsible panel, collapse or expand it (native).",
  },
  {
    keys: "F6 / Shift + F6",
    description: "Cycle enabled separators in the group (native).",
  },
  {
    keys: "Enter / Space",
    description: "Activate Kira collapse, restore and balance buttons.",
  },
] satisfies ReactComponentProps<typeof KeyboardShortcuts>["shortcuts"];

const resizablePageAPISections = [
  {
    title: "ResizablePanelGroup",
    props: [
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description:
          "Direction panels are arranged. Native Group props are preserved.",
      },
      {
        prop: "autoSaveId",
        type: "string",
        default: "-",
        description:
          "Opt-in browser persistence. Stable panel IDs required; orientation has separate storage. Changing the key remounts the group.",
      },
      {
        prop: "defaultLayout",
        type: "Layout",
        default: "-",
        description:
          "Map of native panel IDs to numeric percentages. Used when no matching saved layout exists.",
      },
      {
        prop: "onLayoutChange / onLayoutChanged",
        type: "GroupProps callbacks",
        default: "-",
        description:
          "Live callback and committed callback with isUserInteraction/requestedLayout metadata.",
      },
      {
        prop: "groupRef / elementRef",
        type: "React.Ref<GroupImperativeHandle> / React.Ref<HTMLDivElement>",
        default: "-",
        description:
          "Imperative getLayout/setLayout API versus actual DOM node.",
      },
      {
        prop: "disabled / resizePreviewMode",
        type: 'boolean / "panel" | "separator"',
        default: 'false / "panel"',
        description:
          "Lock resizing, or defer pointer-driven layout changes until release.",
      },
      {
        prop: "resizeTargetMinimumSize",
        type: "{ fine: number; coarse: number }",
        default: "{ fine: 24, coarse: 44 }",
        description:
          "Pointer hit area in CSS pixels; visual separator stays compact.",
      },
    ],
  },
  {
    title: "ResizablePanel",
    props: [
      {
        prop: "defaultSize / minSize / maxSize",
        type: "number | string",
        default: "-",
        description:
          'Numbers are pixels; use "30%" for percentages. rem/em/vw/vh are supported.',
      },
      {
        prop: "panelRef / elementRef",
        type: "native PanelProps refs",
        default: "-",
        description:
          "Object or callback refs. panelRef exposes collapse, expand, resize, getSize and isCollapsed.",
      },
      {
        prop: "onResize",
        type: "(size: PanelSize, id: string | number | undefined, previous: PanelSize | undefined) => void",
        default: "-",
        description: "Native size report includes asPercentage and inPixels.",
      },
      {
        prop: "collapsible / collapsedSize / collapsedThreshold",
        type: "boolean / number | string / number | string",
        default: "-",
        description:
          "Native collapse constraints; the bare primitive leaves content focus policy to its caller.",
      },
      {
        prop: "groupResizeBehavior",
        type: '"preserve-relative-size" | "preserve-pixel-size"',
        default: "-",
        description:
          "Keep relative or absolute size when the group resizes. One panel must remain relative.",
      },
      {
        prop: "className / style",
        type: "string / React.CSSProperties",
        default: "-",
        description:
          "Native Panel applies these to its inner content element; attributes and elementRef target the outer panel.",
      },
    ],
  },
  {
    title: "ResizableHandle",
    props: [
      {
        prop: "variant",
        type: '"default" | "subtle" | "prominent"',
        default: '"default"',
        description: "Shared exported resizableHandleVariants.",
      },
      {
        prop: "withHandle / children",
        type: "boolean / React.ReactNode",
        default: "true",
        description: "Default decorative grip; supplied children replace it.",
      },
      {
        prop: "disabled / disableDoubleClick / preview",
        type: "native SeparatorProps",
        default: "-",
        description:
          "Disable this handle, prevent native double-click reset, or customize its deferred preview.",
      },
      {
        prop: "aria-label / elementRef",
        type: "string / React.Ref<HTMLDivElement>",
        default: "-",
        description: "Name the adjacent panes; reach the separator DOM node.",
      },
    ],
  },
  {
    title: "CollapsiblePanel",
    props: [
      {
        prop: "id",
        type: "string",
        default: "-",
        description:
          "Required stable panel ID; must be inside ResizablePanelGroup.",
      },
      {
        prop: "collapsible / defaultSize / minSize / collapsedSize",
        type: "native PanelProps",
        default: 'true / "20%" / "10%" / "0%"',
        description: "All native panel props remain available.",
      },
    ],
  },
  {
    title: "KiraResizable",
    props: [
      {
        prop: "panels",
        type: "ResizablePanelDefinition[]",
        default: "-",
        description:
          "Stable unique id, label, content, optional disabledReason, and native Panel sizing props. Names also label collapse controls.",
      },
      {
        prop: "autoSaveId / defaultLayout",
        type: "string / Layout",
        default: "-",
        description:
          "Saved public panel IDs remain stable across DOM instances. Unmatched saved panel sets fall back to defaults.",
      },
      {
        prop: "controls / disabledReason",
        type: "boolean / string",
        default: 'true / "Layout is locked."',
        description:
          "Collapse/expand and restore controls, plus a visible explanation when the group is locked.",
      },
      {
        prop: "handleProps / groupClassName / className",
        type: "ResizableHandleProps / string / string",
        default: "-",
        description:
          "Style handles, inner Group, or outer frame. Other Group props target the native group.",
      },
      {
        prop: "groupRef / onLayoutChange / onLayoutChanged",
        type: "native GroupProps",
        default: "-",
        description:
          "Kira translates generated DOM IDs to public panel IDs for layouts and callbacks.",
      },
      {
        prop: "Restore layout / Balance panels",
        type: "control behavior",
        default: "-",
        description:
          "Restores defaultLayout when provided; otherwise requests equal shares. Native min/max/disabled constraints still apply.",
      },
    ],
  },
  {
    title: "usePanelRef / useGroupRef / resizableHandleVariants",
    props: [
      {
        prop: "usePanelRef() / useGroupRef()",
        type: "typed native ref hooks",
        default: "-",
        description:
          "Call at component top level and attach to panelRef/groupRef. There is no toggle() method.",
      },
      {
        prop: "resizableHandleVariants({ variant })",
        type: "CVA function",
        default: "-",
        description: "Reuses separator styling for custom compositions.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof APIReference>["sections"];

const resizablePageChangelogEntries = [
  {
    version: "2.0.1",
    date: "26 November 2026",
    changes: [
      {
        type: "changed",
        title: "Shared validated layout storage helper",
        description:
          "Adopted createValidatedLayoutStorage from @/lib/layout-storage instead of duplicating localStorage persistence parsing inline.",
      },
    ],
  },
  {
    version: "2.0.0",
    date: "13 November 2026",
    changes: [
      {
        type: "added",
        title: "Saved layouts and KiraResizable",
        description:
          "Native persistence with tolerant storage, data-driven panels, collapse controls, restore and dedicated demos.",
      },
      {
        type: "fixed",
        title: "Native API parity",
        description:
          "Callback refs, complete onResize arguments, custom handle children, state styling, slots and reduced-motion gating.",
      },
      {
        type: "breaking",
        title: "Explicit percentage defaults",
        description:
          "CollapsiblePanel now starts at 20% with a 10% minimum; previous numeric defaults were pixels. Use numeric 20/10 to retain the old pixel behavior. SplitView keeps its percentage contract. autoSaveId now persists and requires stable IDs.",
      },
      {
        type: "changed",
        title: "October dependency baseline",
        description:
          "Audited Base UI 1.9.0; react-resizable-panels pinned to 4.16.0 for October resize/collapse and CSS-zoom fixes. No docking API is added.",
      },
    ],
  },
] satisfies ReactComponentProps<typeof Changelog>["entries"];
