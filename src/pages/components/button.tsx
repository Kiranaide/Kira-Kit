import { Button } from "@/components/ui/button";
import {
  IconPlus,
  IconDownload,
  IconTrash,
  IconMail,
} from "@tabler/icons-react";

export function ButtonPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Button</h1>
        <p className="text-muted-foreground">
          A versatile button component with multiple variants and sizes.
        </p>
      </header>

      {/* Variants Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Variants
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* Sizes Section */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Sizes
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Icon Buttons
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="icon-xs" variant="outline">
            <IconPlus className="w-4 h-4" />
          </Button>
          <Button size="icon-sm" variant="outline">
            <IconPlus className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="outline">
            <IconPlus className="w-4 h-4" />
          </Button>
          <Button size="icon-lg" variant="outline">
            <IconPlus className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          With Icons
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button>
            <IconMail data-icon="inline-start" className="w-4 h-4" />
            Send Email
          </Button>
          <Button variant="secondary">
            <IconDownload data-icon="inline-start" className="w-4 h-4" />
            Download
          </Button>
          <Button variant="destructive">
            <IconTrash data-icon="inline-start" className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Button } from "@/components/ui/button"

<Button>Click me</Button>
<Button variant="secondary" size="lg">Large Secondary</Button>
<Button variant="destructive">
  <IconTrash data-icon="inline-start" />
  Delete
</Button>`}
          </pre>
        </div>
      </section>

      {/* Disabled State */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button disabled>Disabled Default</Button>
          <Button variant="secondary" disabled>
            Disabled Secondary
          </Button>
          <Button variant="outline" disabled>
            Disabled Outline
          </Button>
        </div>
      </section>
    </div>
  );
}
