import { Kbd, KbdShortcut } from "@/components/ui/kbd";

export function KbdPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Kbd</h1>
        <p className="text-muted-foreground">
          Display keyboard keys and shortcuts in a styled inline element.
        </p>
      </header>

      {/* Basic Keys */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Keys
        </h2>
        <div className="flex flex-wrap gap-2">
          <Kbd>⌘</Kbd>
          <Kbd>Ctrl</Kbd>
          <Kbd>Alt</Kbd>
          <Kbd>Shift</Kbd>
          <Kbd>Enter</Kbd>
          <Kbd>Esc</Kbd>
          <Kbd>Tab</Kbd>
          <Kbd>Space</Kbd>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          <Kbd>←</Kbd>
          <Kbd>→</Kbd>
        </div>
      </section>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Variants
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Default</p>
            <Kbd variant="default">Ctrl</Kbd>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Outline</p>
            <Kbd variant="outline">Ctrl</Kbd>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Ghost</p>
            <Kbd variant="ghost">Ctrl</Kbd>
          </div>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Small</p>
            <Kbd size="sm">K</Kbd>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Default</p>
            <Kbd size="default">K</Kbd>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Large</p>
            <Kbd size="lg">K</Kbd>
          </div>
        </div>
      </section>

      {/* Shortcuts */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Keyboard Shortcuts
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <span className="text-sm">Save</span>
            <KbdShortcut keys={["⌘", "S"]} />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <span className="text-sm">Copy</span>
            <KbdShortcut keys={["Ctrl", "C"]} />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <span className="text-sm">Paste</span>
            <KbdShortcut keys={["Ctrl", "V"]} />
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
            <span className="text-sm">Find</span>
            <KbdShortcut keys={["Ctrl", "Shift", "F"]} />
          </div>
        </div>
      </section>

      {/* Inline Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Inline Usage
        </h2>
        <p className="text-sm text-muted-foreground">
          Press <Kbd>⌘</Kbd> + <Kbd>K</Kbd> to open the command palette, or use{" "}
          <Kbd>Esc</Kbd> to close it.
        </p>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Kbd, KbdShortcut } from "@/components/ui/kbd"

{/* Single key */}
<Kbd>⌘</Kbd>

{/* With variants */}
<Kbd variant="outline" size="sm">K</Kbd>

{/* Keyboard shortcut */}
<KbdShortcut keys={["Ctrl", "Shift", "P"]} />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
