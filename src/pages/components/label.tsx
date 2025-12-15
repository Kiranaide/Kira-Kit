import { Label } from "@/components/ui/label";

export function LabelPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Label</h1>
        <p className="text-muted-foreground">
          Accessible form labels for inputs and form elements.
        </p>
      </header>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Label
        </h2>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <input
            id="email"
            type="email"
            className="w-full max-w-sm px-3 py-2 border border-border rounded-lg bg-background"
            placeholder="Enter your email"
          />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Label } from "@/components/ui/label"

<Label htmlFor="input-id">Label Text</Label>
<input id="input-id" />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
