"use client";

import { useState, useRef } from "react";
import { IconFile, IconFolder, IconSettings, IconDashboard, IconCode } from "@tabler/icons-react";
import { SplitView, type SplitViewRef } from "@/components/ui/split-view";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ComponentPage,
  PageHeader,
  FeatureGrid,
  DemoWrapper,
  DemoTabs,
  UsageBlock,
  APIReference,
} from "@/components/docs";

function BasicDemo() {
  return (
    <div className="h-[400px] rounded-lg border">
      <SplitView
        sidebarContent={
          <div className="p-4 space-y-4">
            <h3 className="font-semibold text-sm">Navigation</h3>
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <IconDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <IconFile className="mr-2 h-4 w-4" />
                Files
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <IconFolder className="mr-2 h-4 w-4" />
                Folders
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <IconSettings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>
        }
        mainContent={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Main Content</h2>
            <p className="text-muted-foreground mb-4">
              This is the main content area. Resize or collapse the sidebar to see the split view in action.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="p-4">
                <IconDashboard className="h-8 w-8 mb-2 text-primary" />
                <h4 className="font-semibold mb-1">Dashboard</h4>
                <p className="text-sm text-muted-foreground">View your stats</p>
              </Card>
              <Card className="p-4">
                <IconFile className="h-8 w-8 mb-2 text-primary" />
                <h4 className="font-semibold mb-1">Files</h4>
                <p className="text-sm text-muted-foreground">Manage documents</p>
              </Card>
              <Card className="p-4">
                <IconFolder className="h-8 w-8 mb-2 text-primary" />
                <h4 className="font-semibold mb-1">Folders</h4>
                <p className="text-sm text-muted-foreground">Organize content</p>
              </Card>
            </div>
          </div>
        }
      />
    </div>
  );
}

const basicCode = `import { SplitView } from "@/components/ui/split-view"
import { Button } from "@/components/ui/button"
import { IconDashboard, IconFile, IconFolder, IconSettings } from "@tabler/icons-react"

export function BasicSplitView() {
  return (
    <div className="h-[400px]">
      <SplitView
        sidebarContent={
          <div className="p-4 space-y-4">
            <h3 className="font-semibold text-sm">Navigation</h3>
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <IconDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <IconFile className="mr-2 h-4 w-4" />
                Files
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <IconFolder className="mr-2 h-4 w-4" />
                Folders
              </Button>
              <Button variant="ghost" className="w-full justify-start" size="sm">
                <IconSettings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </nav>
          </div>
        }
        mainContent={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Main Content</h2>
            <p className="text-muted-foreground">
              This is the main content area.
            </p>
          </div>
        }
      />
    </div>
  )
}`;

function VerticalDemo() {
  return (
    <div className="h-[400px] rounded-lg border">
      <SplitView
        orientation="vertical"
        sidebarContent={
          <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">Header Panel</Badge>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>This panel acts as a header for the content below.</p>
              <p>Drag the divider to resize vertically.</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Refresh</Button>
              <Button size="sm" variant="outline">Export</Button>
            </div>
          </div>
        }
        mainContent={
          <div className="p-6 space-y-4">
            <h3 className="text-xl font-semibold">Main Panel</h3>
            <p className="text-muted-foreground">
              This is the main content area in vertical orientation.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Card className="p-4">
                <IconFile className="h-5 w-5 mb-2" />
                <h4 className="font-medium text-sm">Document 1</h4>
              </Card>
              <Card className="p-4">
                <IconFile className="h-5 w-5 mb-2" />
                <h4 className="font-medium text-sm">Document 2</h4>
              </Card>
              <Card className="p-4">
                <IconFile className="h-5 w-5 mb-2" />
                <h4 className="font-medium text-sm">Document 3</h4>
              </Card>
              <Card className="p-4">
                <IconFile className="h-5 w-5 mb-2" />
                <h4 className="font-medium text-sm">Document 4</h4>
              </Card>
            </div>
          </div>
        }
      />
    </div>
  );
}

const verticalCode = `import { SplitView } from "@/components/ui/split-view"
import { Card, Badge, Button } from "@/components/ui/button"
import { IconFile } from "@tabler/icons-react"

export function VerticalSplitView() {
  return (
    <div className="h-[400px]">
      <SplitView
        orientation="vertical"
        sidebarContent={
          <div className="p-4 space-y-4">
            <Badge variant="outline">Header Panel</Badge>
            <p className="text-sm text-muted-foreground">
              This panel acts as a header.
            </p>
          </div>
        }
        mainContent={
          <div className="p-6">
            <h3 className="text-xl font-semibold">Main Panel</h3>
            <p className="text-muted-foreground">
              Main content in vertical orientation.
            </p>
          </div>
        }
      />
    </div>
  )
}`;

function CustomSizesDemo() {
  return (
    <div className="h-[400px] rounded-lg border">
      <SplitView
        defaultSize={30}
        minSize={15}
        sidebarContent={
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Custom Sizes</h3>
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Default size: 30%</p>
                <p>• Minimum size: 15%</p>
                <p>• Collapsible: Yes</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="demo-input">Demo Input</Label>
              <Input id="demo-input" placeholder="Type something..." />
            </div>
          </div>
        }
        mainContent={
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Custom Configuration</h2>
            <p className="text-muted-foreground mb-4">
              This SplitView has a default sidebar size of 30% and a minimum of 15%.
              Resize the divider to see the constraints in action.
            </p>
            <Card className="p-4">
              <h4 className="font-semibold mb-2">Try it out:</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>Drag the divider to resize</li>
                <li>Try to make the sidebar smaller than 15%</li>
                <li>Click the toggle button to collapse</li>
              </ul>
            </Card>
          </div>
        }
      />
    </div>
  );
}

const customSizesCode = `import { SplitView } from "@/components/ui/split-view"
import { Input, Label } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export function CustomSizesSplitView() {
  return (
    <div className="h-[400px]">
      <SplitView
        defaultSize={30}
        minSize={15}
        sidebarContent={
          <div className="p-4 space-y-4">
            <h3 className="font-semibold text-sm">Custom Sizes</h3>
            <Label htmlFor="demo-input">Demo Input</Label>
            <Input id="demo-input" placeholder="Type something..." />
          </div>
        }
        mainContent={
          <div className="p-6">
            <h2 className="text-2xl font-bold">Custom Configuration</h2>
            <p className="text-muted-foreground">
              Default size: 30%, Minimum: 15%
            </p>
          </div>
        }
      />
    </div>
  )
}`;

function WithScrollDemo() {
  return (
    <div className="h-[400px] rounded-lg border">
      <SplitView
        sidebarContent={
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-sm">Scrollable Sidebar</h3>
              <Separator />
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 p-2 hover:bg-muted rounded cursor-pointer">
                  <IconFile className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">File {i + 1}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        }
        mainContent={
          <ScrollArea className="h-full">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Scrollable Content</h2>
              <p className="text-muted-foreground">
                Both panels have scrollable content areas.
              </p>
              <Separator />
              {Array.from({ length: 15 }).map((_, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-center gap-4">
                    <IconCode className="h-8 w-8 text-primary" />
                    <div>
                      <h4 className="font-semibold">Content Item {i + 1}</h4>
                      <p className="text-sm text-muted-foreground">Sample content description goes here.</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        }
      />
    </div>
  );
}

const withScrollCode = `import { SplitView } from "@/components/ui/split-view"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, Separator } from "@/components/ui/card"
import { IconFile, IconCode } from "@tabler/icons-react"

export function ScrollableSplitView() {
  return (
    <div className="h-[400px]">
      <SplitView
        sidebarContent={
          <ScrollArea className="h-full">
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-sm">Scrollable Sidebar</h3>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="p-2 hover:bg-muted rounded">
                  <IconFile className="h-4 w-4" />
                  <span className="text-sm">File {i + 1}</span>
                </div>
              ))}
            </div>
          </ScrollArea>
        }
        mainContent={
          <ScrollArea className="h-full">
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">Scrollable Content</h2>
              {Array.from({ length: 15 }).map((_, i) => (
                <Card key={i} className="p-4">Content {i + 1}</Card>
              ))}
            </div>
          </ScrollArea>
        }
      />
    </div>
  )
}`;

function ProgrammaticControlDemo() {
  const splitViewRef = useRef<SplitViewRef>(null);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 rounded-lg border p-4">
        <Button onClick={() => splitViewRef.current?.toggleSidebar()}>
          Toggle Sidebar
        </Button>
        <Button variant="outline" onClick={() => splitViewRef.current?.expandSidebar()}>
          Expand
        </Button>
        <Button variant="outline" onClick={() => splitViewRef.current?.collapseSidebar()}>
          Collapse
        </Button>
      </div>
      <div className="h-[400px] rounded-lg border">
        <SplitView
          ref={splitViewRef}
          sidebarContent={
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-sm">Programmatic Control</h3>
              <p className="text-sm text-muted-foreground">
                Use the buttons above to control this sidebar.
              </p>
              <Separator />
              <div className="space-y-2">
                <Label>Actions available:</Label>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-2">
                  <li>toggleSidebar()</li>
                  <li>expandSidebar()</li>
                  <li>collapseSidebar()</li>
                </ul>
              </div>
            </div>
          }
          mainContent={
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Imperative Control</h2>
              <p className="text-muted-foreground">
                The SplitView component exposes a ref with methods to programmatically
                control the sidebar state.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}

const programmaticControlCode = `"use client"

import { useRef } from "react"
import { SplitView, type SplitViewRef } from "@/components/ui/split-view"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export function ProgrammaticControlSplitView() {
  const splitViewRef = useRef<SplitViewRef>(null)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={() => splitViewRef.current?.toggleSidebar()}>
          Toggle Sidebar
        </Button>
        <Button variant="outline" onClick={() => splitViewRef.current?.expandSidebar()}>
          Expand
        </Button>
        <Button variant="outline" onClick={() => splitViewRef.current?.collapseSidebar()}>
          Collapse
        </Button>
      </div>
      <div className="h-[400px]">
        <SplitView
          ref={splitViewRef}
          sidebarContent={<div>Sidebar</div>}
          mainContent={<div>Main</div>}
        />
      </div>
    </div>
  )
}`;

function NoToggleDemo() {
  const [showToggle, setShowToggle] = useState(true);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-lg border p-4">
        <Switch
          id="show-toggle"
          checked={showToggle}
          onCheckedChange={setShowToggle}
        />
        <Label htmlFor="show-toggle" className="cursor-pointer">
          Show toggle button
          <span className="block text-sm text-muted-foreground">
            {showToggle ? "Toggle button is visible" : "Toggle button is hidden"}
          </span>
        </Label>
      </div>
      <div className="h-[400px] rounded-lg border">
        <SplitView
          showToggle={showToggle}
          sidebarContent={
            <div className="p-4 space-y-4">
              <h3 className="font-semibold text-sm">No Toggle Option</h3>
              <p className="text-sm text-muted-foreground">
                {showToggle
                  ? "Toggle button is visible in the header."
                  : "Toggle button is hidden. Use the divider to resize instead."}
              </p>
            </div>
          }
          mainContent={
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Toggle Control</h2>
              <p className="text-muted-foreground">
                Use the showToggle prop to control the visibility of the collapse/expand button.
              </p>
            </div>
          }
        />
      </div>
    </div>
  );
}

const noToggleCode = `"use client"

import { useState } from "react"
import { SplitView } from "@/components/ui/split-view"
import { Switch, Label } from "@/components/ui/switch"

export function NoToggleSplitView() {
  const [showToggle, setShowToggle] = useState(true)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Switch
          id="show-toggle"
          checked={showToggle}
          onCheckedChange={setShowToggle}
        />
        <Label htmlFor="show-toggle" className="cursor-pointer">
          Show toggle button
        </Label>
      </div>
      <div className="h-[400px]">
        <SplitView
          showToggle={showToggle}
          sidebarContent={<div>Sidebar</div>}
          mainContent={<div>Main</div>}
        />
      </div>
    </div>
  )
}`;

export default function SplitViewPage() {
  return (
    <ComponentPage>
      <PageHeader
        title="SplitView"
        description="A resizable split-pane layout with collapsible sidebar, built on top of resizable-panels. Perfect for master-detail views, IDE layouts, and dashboard interfaces."
        version="v1.0"
      />

      <FeatureGrid
        features={[
          {
            title: "Resizable Panels",
            description: "Drag the divider to resize panels proportionally. Supports both horizontal and vertical orientations.",
          },
          {
            title: "Collapsible Sidebar",
            description: "Built-in collapse/expand functionality with optional toggle button for maximum screen real estate.",
          },
          {
            title: "Imperative Control",
            description: "Expose a ref with toggleSidebar, expandSidebar, and collapseSidebar methods for programmatic control.",
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
                title="Basic Horizontal SplitView"
                description="Simple horizontal layout with navigation sidebar and main content area."
                code={basicCode}
              >
                <BasicDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "vertical",
            label: "Vertical",
            demo: (
              <DemoWrapper
                title="Vertical Orientation"
                description="Split panels arranged vertically with a header panel and main content area."
                code={verticalCode}
              >
                <VerticalDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "sizes",
            label: "Custom Sizes",
            demo: (
              <DemoWrapper
                title="Custom Panel Sizes"
                description="Configure default size and minimum size constraints for the sidebar panel."
                code={customSizesCode}
              >
                <CustomSizesDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "scroll",
            label: "Scrollable",
            demo: (
              <DemoWrapper
                title="Scrollable Panels"
                description="Both panels support scrolling independently for large content areas."
                code={withScrollCode}
              >
                <WithScrollDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "control",
            label: "Programmatic",
            demo: (
              <DemoWrapper
                title="Imperative Control"
                description="Use the exposed ref to programmatically toggle, expand, or collapse the sidebar."
                code={programmaticControlCode}
              >
                <ProgrammaticControlDemo />
              </DemoWrapper>
            ),
          },
          {
            value: "toggle",
            label: "No Toggle",
            demo: (
              <DemoWrapper
                title="Toggle Visibility"
                description="Control the visibility of the collapse/expand button with the showToggle prop."
                code={noToggleCode}
              >
                <NoToggleDemo />
              </DemoWrapper>
            ),
          },
        ]}
      />

      <UsageBlock
        title="Usage"
        description="Import and use the SplitView component with sidebar and main content slots."
        code={`import { SplitView } from "@/components/ui/split-view"

function App() {
  return (
    <div className="h-screen">
      <SplitView
        sidebarContent={<div>Sidebar content</div>}
        mainContent={<div>Main content</div>}
      />
    </div>
  )
}`}
      />

      <APIReference
        sections={[
          {
            title: "SplitView",
            props: [
              {
                prop: "children",
                type: "ReactNode",
                default: "-",
                description: "Optional children (not used, content goes in sidebarContent/mainContent)",
              },
              {
                prop: "orientation",
                type: "'horizontal' | 'vertical'",
                default: "horizontal",
                description: "Direction of the split layout.",
              },
              {
                prop: "defaultSize",
                type: "number",
                default: "20",
                description: "Default size of the sidebar panel as a percentage.",
              },
              {
                prop: "minSize",
                type: "number",
                default: "10",
                description: "Minimum size of the sidebar panel as a percentage.",
              },
              {
                prop: "collapsible",
                type: "boolean",
                default: "true",
                description: "Whether the sidebar can be collapsed.",
              },
              {
                prop: "collapsedSize",
                type: "number",
                default: "0",
                description: "Size of the sidebar when collapsed as a percentage.",
              },
              {
                prop: "sidebarContent",
                type: "ReactNode",
                default: "required",
                description: "Content to render in the sidebar panel.",
              },
              {
                prop: "mainContent",
                type: "ReactNode",
                default: "required",
                description: "Content to render in the main panel.",
              },
              {
                prop: "showToggle",
                type: "boolean",
                default: "true",
                description: "Whether to show the collapse/expand toggle button.",
              },
              {
                prop: "sidebarLabel",
                type: "string",
                default: "Sidebar",
                description: "Label text displayed in the sidebar header.",
              },
              {
                prop: "autoSaveId",
                type: "string",
                default: "-",
                description: "Key for auto-saving layout to localStorage.",
              },
              {
                prop: "onLayoutChange",
                type: "(layout) => void",
                default: "-",
                description: "Callback when layout changes.",
              },
            ],
          },
          {
            title: "SplitViewRef",
            props: [
              {
                prop: "toggleSidebar",
                type: "() => void",
                default: "-",
                description: "Toggle between collapsed and expanded states.",
              },
              {
                prop: "expandSidebar",
                type: "() => void",
                default: "-",
                description: "Expand the sidebar panel.",
              },
              {
                prop: "collapseSidebar",
                type: "() => void",
                default: "-",
                description: "Collapse the sidebar panel.",
              },
            ],
          },
        ]}
      />
    </ComponentPage>
  );
}
