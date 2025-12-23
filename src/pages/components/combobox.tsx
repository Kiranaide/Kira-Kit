import * as React from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";

const frameworks = [
  { label: "Next.js", value: "nextjs" },
  { label: "SvelteKit", value: "sveltekit" },
  { label: "Nuxt.js", value: "nuxtjs" },
  { label: "Remix", value: "remix" },
  { label: "Astro", value: "astro" },
];

export function ComboboxPage() {
  const [value, setValue] = React.useState<string | null>(null);

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
          <Combobox value={value} onValueChange={setValue}>
            <ComboboxInput placeholder="Select framework..." showTrigger />
            <ComboboxContent>
              <ComboboxEmpty>No framework found.</ComboboxEmpty>
              <ComboboxList>
                {frameworks.map((framework) => (
                  <ComboboxItem key={framework.value} value={framework.value}>
                    {framework.label}
                  </ComboboxItem>
                ))}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
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
            {`import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
} from "@/components/ui/combobox"

<Combobox value={value} onValueChange={setValue}>
  <ComboboxInput placeholder="Select..." showTrigger />
  <ComboboxContent>
    <ComboboxList>
      <ComboboxItem value="option1">Option 1</ComboboxItem>
      <ComboboxItem value="option2">Option 2</ComboboxItem>
    </ComboboxList>
  </ComboboxContent>
</Combobox>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
