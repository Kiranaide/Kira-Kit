import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";

export function ResizablePage() {
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
          <ResizablePanelGroup direction="horizontal">
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
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={40}>
              <div className="flex h-full items-center justify-center p-6 bg-muted/30">
                <span className="font-semibold">Header</span>
              </div>
            </ResizablePanel>
            <ResizableHandle direction="vertical" />
            <ResizablePanel defaultSize={60}>
              <div className="flex h-full items-center justify-center p-6 bg-muted/50">
                <span className="font-semibold">Content</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </section>

      {/* Three Panels */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Three Panel Layout
        </h2>
        <div className="h-48 rounded-lg border border-border overflow-hidden">
          <ResizablePanelGroup direction="horizontal">
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
          <ResizablePanelGroup direction="horizontal">
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
} from "@/components/ui/resizable"

<ResizablePanelGroup direction="horizontal">
  <ResizablePanel defaultSize={50}>
    Content 1
  </ResizablePanel>
  <ResizableHandle />
  <ResizablePanel defaultSize={50}>
    Content 2
  </ResizablePanel>
</ResizablePanelGroup>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
