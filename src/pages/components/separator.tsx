import { Separator } from "@/components/ui/separator";

export function SeparatorPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Separator</h1>
        <p className="text-muted-foreground">
          Visual divider to separate content sections.
        </p>
      </header>

      {/* Horizontal */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Horizontal
        </h2>
        <div className="space-y-4">
          <p>Content above the separator</p>
          <Separator />
          <p>Content below the separator</p>
        </div>
      </section>

      {/* Vertical */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Vertical
        </h2>
        <div className="flex items-center gap-4 h-8">
          <span>Left</span>
          <Separator orientation="vertical" />
          <span>Middle</span>
          <Separator orientation="vertical" />
          <span>Right</span>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-20 text-sm text-muted-foreground">xs</span>
            <Separator size="xs" className="max-w-48" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-20 text-sm text-muted-foreground">sm</span>
            <Separator size="sm" className="max-w-48" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-20 text-sm text-muted-foreground">default</span>
            <Separator size="default" className="max-w-48" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-20 text-sm text-muted-foreground">lg</span>
            <Separator size="lg" className="max-w-48" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-20 text-sm text-muted-foreground">xl</span>
            <Separator size="xl" className="max-w-48" />
          </div>
        </div>
      </section>

      {/* Line Styles */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Line Styles
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-24 text-sm text-muted-foreground">Solid</span>
            <Separator lineStyle="solid" className="max-w-64" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-24 text-sm text-muted-foreground">Dashed</span>
            <Separator lineStyle="dashed" className="max-w-64" />
          </div>
          <div className="flex items-center gap-2">
            <span className="w-24 text-sm text-muted-foreground">Dotted</span>
            <Separator lineStyle="dotted" className="max-w-64" />
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Colors
        </h2>
        <div className="flex flex-wrap gap-4">
          <Separator color="default" className="max-w-48" />
          <Separator color="primary" className="max-w-48" />
          <Separator color="secondary" className="max-w-48" />
          <Separator color="muted" className="max-w-48" />
          <Separator color="destructive" className="max-w-48" />
        </div>
      </section>

      {/* With Label */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Label
        </h2>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Center label (default)</p>
            <Separator label="Or continue with" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Start label</p>
            <Separator label="Section 1" labelAlign="start" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">End label</p>
            <Separator label="The End" labelAlign="end" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Vertical with label</p>
            <div className="flex h-24">
              <span className="p-2">Left</span>
              <Separator orientation="vertical" label="VS" />
              <span className="p-2">Right</span>
            </div>
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Separator } from "@/components/ui/separator"

// Horizontal
<Separator />

// Vertical
<Separator orientation="vertical" />

// With size
<Separator size="lg" />

// With line style
<Separator lineStyle="dashed" />

// With color
<Separator color="primary" />

// With label
<Separator label="Or continue with" />
<Separator label="Section" labelAlign="start" />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
