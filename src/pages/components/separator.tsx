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

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Separator } from "@/components/ui/separator"

{/* Horizontal */}
<Separator />

{/* Vertical */}
<Separator orientation="vertical" />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
