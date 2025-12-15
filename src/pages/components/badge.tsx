import { Badge } from "@/components/ui/badge";
import { IconCheck, IconX } from "@tabler/icons-react";

export function BadgePage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Badge</h1>
        <p className="text-muted-foreground">
          Small status indicators and labels to highlight information.
        </p>
      </header>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Variants
        </h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="ghost">Ghost</Badge>
          <Badge variant="link">Link</Badge>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Icons
        </h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">
            <IconCheck data-icon="inline-start" className="w-3 h-3" />
            Approved
          </Badge>
          <Badge variant="destructive">
            <IconX data-icon="inline-start" className="w-3 h-3" />
            Rejected
          </Badge>
          <Badge variant="secondary">
            New
            <IconCheck data-icon="inline-end" className="w-3 h-3" />
          </Badge>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
