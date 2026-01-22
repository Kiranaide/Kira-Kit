import * as React from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  CollapsiblePanel,
  usePanelRef,
  type Layout,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { IconArrowsMove, IconColumns, IconRefresh } from "@tabler/icons-react"
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoTabs,
  DemoWrapper,
  KeyboardShortcuts,
  UsageBlock,
  APIReference,
} from "@/components/docs"

function BasicDemo() {
  const [layout, setLayout] = React.useState<Layout>({})

  return (
    <div className="h-48 rounded-lg border border-border overflow-hidden">
      <ResizablePanelGroup
        orientation="horizontal"
        onLayoutChange={(newLayout) => setLayout(newLayout)}
      >
        <ResizablePanel defaultSize={50} id="left">
          <div className="flex h-full items-center justify-center p-4 bg-muted/30">
            <span className="text-sm font-medium">
              Panel 1 ({layout.left?.toFixed(1) ?? 50}%)
            </span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} id="right">
          <div className="flex h-full items-center justify-center p-4 bg-muted/50">
            <span className="text-sm font-medium">
              Panel 2 ({layout.right?.toFixed(1) ?? 50}%)
            </span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

const basicCode = `import * as React from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  type Layout,
} from "@/components/ui/resizable"

function BasicDemo() {
  const [layout, setLayout] = React.useState<Layout>({})

  return (
    <div className="h-48 rounded-lg border border-border overflow-hidden">
      <ResizablePanelGroup
        orientation="horizontal"
        onLayoutChange={(newLayout) => setLayout(newLayout)}
      >
        <ResizablePanel defaultSize={50} id="left">
          <div className="flex h-full items-center justify-center p-4 bg-muted/30">
            <span className="text-sm font-medium">
              Panel 1 ({layout.left?.toFixed(1) ?? 50}%)
            </span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} id="right">
          <div className="flex h-full items-center justify-center p-4 bg-muted/50">
            <span className="text-sm font-medium">
              Panel 2 ({layout.right?.toFixed(1) ?? 50}%)
            </span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}`

function HandleVariantsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <div className="h-24 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-muted/30" />
            </ResizablePanel>
            <ResizableHandle variant="default" />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-muted/50" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Subtle</p>
        <div className="h-24 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-muted/30" />
            </ResizablePanel>
            <ResizableHandle variant="subtle" />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-muted/50" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Prominent</p>
        <div className="h-24 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-muted/30" />
            </ResizablePanel>
            <ResizableHandle variant="prominent" />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-muted/50" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">No Visible Handle</p>
        <div className="h-24 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-primary/5" />
            </ResizablePanel>
            <ResizableHandle withHandle={false} />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-primary/10" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}

const handleVariantsCode = `import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

function HandleVariantsDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Default</p>
        <div className="h-24 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-muted/30" />
            </ResizablePanel>
            <ResizableHandle variant="default" />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-muted/50" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Subtle</p>
        <div className="h-24 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-muted/30" />
            </ResizablePanel>
            <ResizableHandle variant="subtle" />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-muted/50" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Prominent</p>
        <div className="h-24 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-muted/30" />
            </ResizablePanel>
            <ResizableHandle variant="prominent" />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-muted/50" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">No Visible Handle</p>
        <div className="h-24 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-primary/5" />
            </ResizablePanel>
            <ResizableHandle withHandle={false} />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center bg-primary/10" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}`

function MinMaxDemo() {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const sidebarPanelRef = usePanelRef()

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => sidebarPanelRef.current?.collapse()}
        >
          Collapse
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => sidebarPanelRef.current?.expand()}
        >
          Expand
        </Button>
        <span className="text-sm text-muted-foreground flex items-center">
          Size: {isCollapsed ? "Collapsed (0%)" : "15-40%"}
        </span>
      </div>
      <div className="h-48 rounded-lg border border-border overflow-hidden">
        <ResizablePanelGroup orientation="horizontal">
          <CollapsiblePanel
            id="sidebar"
            panelRef={sidebarPanelRef}
            collapsible
            collapsedSize={0}
            defaultSize={25}
            minSize={15}
            maxSize={40}
            onResize={(size) => {
              setIsCollapsed(size.asPercentage <= 1)
            }}
          >
            <div className="flex h-full items-center justify-center p-4 bg-muted/30">
              <span className="text-sm font-medium">Sidebar</span>
            </div>
          </CollapsiblePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-4 bg-muted/50">
              <span className="text-sm font-medium">Main Content</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}

const minMaxCode = `import * as React from "react"
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  CollapsiblePanel,
  usePanelRef,
} from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"

function MinMaxDemo() {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const sidebarPanelRef = usePanelRef()

  return (
    <div className="space-y-2">
      <div className="flex gap-2 mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => sidebarPanelRef.current?.collapse()}
        >
          Collapse
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => sidebarPanelRef.current?.expand()}
        >
          Expand
        </Button>
      </div>
      <div className="h-48 rounded-lg border border-border overflow-hidden">
        <ResizablePanelGroup orientation="horizontal">
          <CollapsiblePanel
            id="sidebar"
            panelRef={sidebarPanelRef}
            collapsible
            collapsedSize={0}
            defaultSize={25}
            minSize={15}
            maxSize={40}
            onResize={(size) => {
              setIsCollapsed(size.asPercentage <= 1)
            }}
          >
            <div className="flex h-full items-center justify-center p-4 bg-muted/30">
              <span className="text-sm font-medium">Sidebar</span>
            </div>
          </CollapsiblePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full items-center justify-center p-4 bg-muted/50">
              <span className="text-sm font-medium">Main Content</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}`

function MultipleDemo() {
  return (
    <div className="h-48 rounded-lg border border-border overflow-hidden">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="flex h-full items-center justify-center p-4 bg-muted/20">
            <span className="text-sm font-medium">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-4 bg-muted/40">
            <span className="text-sm font-medium">Main</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="flex h-full items-center justify-center p-4 bg-muted/20">
            <span className="text-sm font-medium">Details</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

const multipleCode = `import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

function MultipleDemo() {
  return (
    <div className="h-48 rounded-lg border border-border overflow-hidden">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="flex h-full items-center justify-center p-4 bg-muted/20">
            <span className="text-sm font-medium">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-4 bg-muted/40">
            <span className="text-sm font-medium">Main</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="flex h-full items-center justify-center p-4 bg-muted/20">
            <span className="text-sm font-medium">Details</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}`

function OrientationDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Horizontal</p>
        <div className="h-32 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6 bg-muted/30">
                <span className="font-semibold">Left Panel</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6 bg-muted/50">
                <span className="font-semibold">Right Panel</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Vertical</p>
        <div className="h-48 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={40}>
              <div className="flex h-full items-center justify-center p-6 bg-muted/30">
                <span className="font-semibold">Header</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={60}>
              <div className="flex h-full items-center justify-center p-6 bg-muted/50">
                <span className="font-semibold">Content</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}

const orientationCode = `import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable"

function OrientationDemo() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Horizontal</p>
        <div className="h-32 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6 bg-muted/30">
                <span className="font-semibold">Left Panel</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6 bg-muted/50">
                <span className="font-semibold">Right Panel</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-2">Vertical</p>
        <div className="h-48 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={40}>
              <div className="flex h-full items-center justify-center p-6 bg-muted/30">
                <span className="font-semibold">Header</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={60}>
              <div className="flex h-full items-center justify-center p-6 bg-muted/50">
                <span className="font-semibold">Content</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  )
}`

const usageCode = `import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  CollapsiblePanel,
  usePanelRef,
} from "@/components/ui/resizable"

// Basic usage
<ResizablePanelGroup orientation="horizontal">
  <ResizablePanel defaultSize={50}>
    Content 1
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50}>
    Content 2
  </ResizablePanel>
</ResizablePanelGroup>

// With layout callback
<ResizablePanelGroup 
  onLayoutChange={(layout) => {
    console.log(layout); // { left: 30, right: 70 }
  }}
>
  <ResizablePanel id="left" defaultSize={30}>...</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel id="right" defaultSize={70}>...</ResizablePanel>
</ResizablePanelGroup>

// Collapsible panel with imperative API
const panelRef = usePanelRef();

<CollapsiblePanel
  panelRef={panelRef}
  collapsible
  collapsedSize={0}
  minSize={15}
  maxSize={40}
  onResize={(size) => console.log(size.asPercentage)}
>
  Sidebar content
</CollapsiblePanel>

// Programmatic control
panelRef.current?.collapse();
panelRef.current?.expand();
panelRef.current?.resize(30);`

export function ResizablePage() {
  return (
    <ComponentPage>
      <PageHeader
        title="Resizable"
        description="Resizable panel groups with draggable handles for building split-pane layouts, sidebars, and dynamic UI regions."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Flexible Layouts",
            description: "Support for horizontal and vertical panel arrangements with any number of panels.",
            icon: <IconArrowsMove className="h-4 w-4" />,
          },
          {
            title: "Collapsible Panels",
            description: "Imperative API for collapsing and expanding panels with smooth transitions.",
            icon: <IconColumns className="h-4 w-4" />,
          },
          {
            title: "Real-time Updates",
            description: "Track layout changes with onLayoutChange callbacks and get precise size values.",
            icon: <IconRefresh className="h-4 w-4" />,
          },
        ]}
      />

      <DemoTabs
        defaultValue="basic"
        tabs={[
          {
            value: "basic",
            label: "Basic",
            demo: (
              <DemoWrapper
                title="Basic Resizable"
                description="Simple two-panel resizable layout with real-time size tracking."
                code={basicCode}
              >
                <BasicDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "handles",
            label: "Handles",
            demo: (
              <DemoWrapper
                title="Handle Variants"
                description="Different handle styles: default, subtle, prominent, and hidden handle options."
                code={handleVariantsCode}
              >
                <HandleVariantsDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "minmax",
            label: "Minimum/Maximum",
            demo: (
              <DemoWrapper
                title="Size Constraints"
                description="Set minimum and maximum panel sizes with collapsible functionality."
                code={minMaxCode}
              >
                <MinMaxDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "multiple",
            label: "Multiple",
            demo: (
              <DemoWrapper
                title="Multiple Panels"
                description="Three-panel layout commonly used for sidebar/main/details interfaces."
                code={multipleCode}
              >
                <MultipleDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "orientation",
            label: "Orientation",
            demo: (
              <DemoWrapper
                title="Horizontal & Vertical"
                description="Switch between horizontal and vertical panel orientations."
                code={orientationCode}
              >
                <OrientationDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <KeyboardShortcuts
        shortcuts={[
          { keys: "← / →", description: "Resize panels (horizontal)" },
          { keys: "↑ / ↓", description: "Resize panels (vertical)" },
          { keys: "Escape", description: "Stop resizing" },
        ]}
      />

      <UsageBlock
        code={usageCode}
        title="Usage"
        description="Basic implementation examples showing common patterns for resizable layouts."
      />

      <APIReference
        sections={[
          {
            title: "ResizablePanelGroup",
            props: [
              {
                prop: "orientation",
                type: "'horizontal' | 'vertical'",
                default: "'horizontal'",
                description: "Direction of panel layout.",
              },
              {
                prop: "onLayoutChange",
                type: "(layout: Layout) => void",
                default: "-",
                description: "Callback fired when layout changes.",
              },
              {
                prop: "children",
                type: "React.ReactNode",
                default: "-",
                description: "Panel and handle components.",
              },
            ],
          },
          {
            title: "ResizablePanel",
            props: [
              {
                prop: "defaultSize",
                type: "number",
                default: "50",
                description: "Initial size as percentage (0-100).",
              },
              {
                prop: "minSize",
                type: "number",
                default: "10",
                description: "Minimum size as percentage.",
              },
              {
                prop: "maxSize",
                type: "number",
                default: "100",
                description: "Maximum size as percentage.",
              },
              {
                prop: "id",
                type: "string",
                default: "-",
                description: "Panel identifier for layout tracking.",
              },
              {
                prop: "children",
                type: "React.ReactNode",
                default: "-",
                description: "Panel content.",
              },
            ],
          },
          {
            title: "ResizableHandle",
            props: [
              {
                prop: "variant",
                type: "'default' | 'subtle' | 'prominent'",
                default: "'default'",
                description: "Visual style of the handle.",
              },
              {
                prop: "withHandle",
                type: "boolean",
                default: "true",
                description: "Whether to show the visible handle.",
              },
            ],
          },
          {
            title: "CollapsiblePanel",
            props: [
              {
                prop: "panelRef",
                type: "React.RefObject<PanelRef>",
                default: "-",
                description: "Ref from usePanelRef for imperative control.",
              },
              {
                prop: "collapsible",
                type: "boolean",
                default: "false",
                description: "Enable collapse functionality.",
              },
              {
                prop: "collapsedSize",
                type: "number",
                default: "0",
                description: "Size when collapsed.",
              },
              {
                prop: "onResize",
                type: "(size: PanelSize) => void",
                default: "-",
                description: "Callback during resize with size info.",
              },
              {
                prop: "id",
                type: "string",
                default: "-",
                description: "Panel identifier.",
              },
            ],
          },
          {
            title: "usePanelRef Hook",
            props: [
              {
                prop: "current?.collapse",
                type: "() => void",
                default: "-",
                description: "Collapse the panel.",
              },
              {
                prop: "current?.expand",
                type: "() => void",
                default: "-",
                description: "Expand the panel.",
              },
              {
                prop: "current?.resize",
                type: "(size: number) => void",
                default: "-",
                description: "Resize to specific percentage.",
              },
              {
                prop: "current?.toggle",
                type: "() => void",
                default: "-",
                description: "Toggle between collapsed and expanded.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  )
}
