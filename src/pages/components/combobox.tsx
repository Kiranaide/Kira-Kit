import * as React from "react";
import { Combobox } from "@/components/ui/combobox";

const frameworks = [
  { label: "Next.js", value: "nextjs" },
  { label: "SvelteKit", value: "sveltekit" },
  { label: "Nuxt.js", value: "nuxtjs" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
];

export function ComboboxPage() {
  const [value, setValue] = React.useState("");

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Combobox</h1>
        <p className="text-muted-foreground">
          Searchable dropdown with filtering and selection.
        </p>
      </header>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Combobox
        </h2>
        <div className="max-w-sm">
          <Combobox
            items={frameworks}
            value={value}
            onValueChange={setValue}
            placeholder="Select framework..."
            searchPlaceholder="Search frameworks..."
          />
        </div>
        {value && (
          <p className="text-sm text-muted-foreground">Selected: {value}</p>
        )}
      </section>

      {/* Usage */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Usage
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
          <pre className="text-sm text-foreground">
            {`import { Combobox } from "@/components/ui/combobox"

const items = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
]

<Combobox
  items={items}
  value={value}
  onValueChange={setValue}
  placeholder="Select..."
/>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
