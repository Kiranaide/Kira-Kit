import { Textarea } from "@/components/ui/textarea";

export function TextareaPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Textarea</h1>
        <p className="text-muted-foreground">
          Multi-line text input for longer form content.
        </p>
      </header>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Textarea
        </h2>
        <div className="max-w-md">
          <Textarea placeholder="Type your message here..." />
        </div>
      </section>

      {/* With Rows */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Custom Rows
        </h2>
        <div className="max-w-md">
          <Textarea placeholder="This textarea has 6 rows..." rows={6} />
        </div>
      </section>

      {/* Disabled */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled
        </h2>
        <div className="max-w-md">
          <Textarea placeholder="Disabled textarea" disabled />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Type here..." />
<Textarea rows={6} />
<Textarea disabled />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
