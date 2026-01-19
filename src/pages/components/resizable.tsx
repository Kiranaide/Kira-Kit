import * as React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  CollapsiblePanel,
  usePanelRef,
  type Layout,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

export function ResizablePage() {
  const [layout, setLayout] = React.useState<Layout>({});
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const sidebarPanelRef = usePanelRef();

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Resizable</h1>
        <p className="text-muted-foreground">
          Resizable panel groups with draggable handles.
        </p>
      </header>

      {/* Horizontal */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Horizontal Layout
        </h2>
        <div className="h-48 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6 bg-muted/30">
                <span className="font-semibold">Panel 1</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6 bg-muted/50">
                <span className="font-semibold">Panel 2</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </section>

      {/* Vertical */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Vertical Layout
        </h2>
        <div className="h-64 rounded-lg border border-border overflow-hidden">
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
      </section>

      {/* Collapsible Panel */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Collapsible Panel
        </h2>
        <p className="text-sm text-muted-foreground">
          Panels can be collapsed and expanded programmatically.
        </p>
        <div className="flex gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => sidebarPanelRef.current?.collapse()}
          >
            <IconChevronLeft className="h-4 w-4 mr-1" />
            Collapse
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => sidebarPanelRef.current?.expand()}
          >
            <IconChevronRight className="h-4 w-4 mr-1" />
            Expand
          </Button>
          <span className="text-sm text-muted-foreground flex items-center">
            Status: {isCollapsed ? "Collapsed" : "Expanded"}
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
                // Update collapsed state based on size
                setIsCollapsed(size.asPercentage <= 1);
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
      </section>

      {/* Layout Callbacks */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Layout Callbacks
        </h2>
        <p className="text-sm text-muted-foreground">
          Track layout changes in real-time with onLayoutChange callback.
        </p>
        <div className="h-48 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup
            orientation="horizontal"
            onLayoutChange={(newLayout) => setLayout(newLayout)}
          >
            <ResizablePanel defaultSize={30} id="left">
              <div className="flex h-full items-center justify-center p-4 bg-muted/30">
                <span className="text-sm font-medium">
                  {layout.left?.toFixed(1) ?? 30}%
                </span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={70} id="right">
              <div className="flex h-full items-center justify-center p-4 bg-muted/50">
                <span className="text-sm font-medium">
                  {layout.right?.toFixed(1) ?? 70}%
                </span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </section>

      {/* Handle Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Handle Variants
        </h2>
        <div className="space-y-4">
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
        </div>
      </section>

      {/* Three Panels */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Three Panel Layout
        </h2>
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
      </section>

      {/* No Handle */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Without Visible Handle
        </h2>
        <div className="h-32 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup orientation="horizontal">
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6 bg-primary/5">
                <span className="font-semibold">Left</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle={false} />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-full items-center justify-center p-6 bg-primary/10">
                <span className="font-semibold">Right</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import {
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
  onResize={(size) => console.log(size.asPercentage)}
>
  Sidebar content
</CollapsiblePanel>

// Programmatic control
panelRef.current?.collapse();
panelRef.current?.expand();
panelRef.current?.resize(30);`}
          </pre>
        </div>
      </section>
    </div>
  );
}
