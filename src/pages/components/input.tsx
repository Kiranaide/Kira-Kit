import { Input } from "@/components/ui/input";
import { IconSearch, IconMail, IconLock } from "@tabler/icons-react";

export function InputPage() {
  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Input</h1>
        <p className="text-muted-foreground">
          Text input field for forms and data entry.
        </p>
      </header>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Input
        </h2>
        <div className="max-w-sm space-y-3">
          <Input placeholder="Enter text..." />
          <Input type="email" placeholder="Email address" />
          <Input type="password" placeholder="Password" />
        </div>
      </section>

      {/* Disabled */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Disabled
        </h2>
        <div className="max-w-sm">
          <Input placeholder="Disabled input" disabled />
        </div>
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Input } from "@/components/ui/input"

<Input placeholder="Enter text..." />
<Input type="email" placeholder="Email" />
<Input disabled placeholder="Disabled" />`}
          </pre>
        </div>
      </section>
    </div>
  );
}
