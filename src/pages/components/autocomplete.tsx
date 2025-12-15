import * as React from "react";
import {
  Autocomplete,
  type AutocompleteOption,
} from "@/components/ui/autocomplete";

const fruits: AutocompleteOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
  { value: "elderberry", label: "Elderberry" },
  { value: "fig", label: "Fig" },
  { value: "grape", label: "Grape" },
  { value: "honeydew", label: "Honeydew" },
  { value: "kiwi", label: "Kiwi" },
  { value: "lemon", label: "Lemon" },
  { value: "mango", label: "Mango" },
  { value: "nectarine", label: "Nectarine" },
  { value: "orange", label: "Orange" },
  { value: "papaya", label: "Papaya" },
  { value: "quince", label: "Quince" },
  { value: "raspberry", label: "Raspberry" },
  { value: "strawberry", label: "Strawberry" },
  { value: "tangerine", label: "Tangerine" },
  { value: "watermelon", label: "Watermelon" },
];

export function AutocompletePage() {
  const [selected, setSelected] = React.useState<string>("");
  const [multiSelected, setMultiSelected] = React.useState<string[]>([]);

  // Simulated async search with cancellation support
  const asyncSearch = async (query: string): Promise<AutocompleteOption[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return fruits.filter((f) =>
      f.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <div className="p-8 max-w-4xl space-y-12">
      <header>
        <h1 className="text-3xl font-bold mb-2">Autocomplete</h1>
        <p className="text-muted-foreground">
          Advanced autocomplete with debouncing, async search, fuzzy matching,
          and more.
        </p>
      </header>

      {/* Basic */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Basic Autocomplete
        </h2>
        <div className="max-w-sm">
          <Autocomplete
            options={fruits}
            placeholder="Search fruits..."
            onChange={(v) => setSelected(v as string)}
          />
          {selected && (
            <p className="mt-2 text-sm text-muted-foreground">
              Selected: {selected}
            </p>
          )}
        </div>
      </section>

      {/* Multi-select (tags inside input) */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Multi-select (Tags Inside Input)
        </h2>
        <div className="max-w-sm">
          <Autocomplete
            options={fruits}
            multiple
            placeholder="Select multiple fruits..."
            value={multiSelected}
            onChange={(v) => setMultiSelected(v as string[])}
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Selected: {multiSelected.length} items
          </p>
        </div>
      </section>

      {/* Async Search */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Async Search
        </h2>
        <p className="text-sm text-muted-foreground mb-2">
          Results load after 500ms delay with debouncing (300ms).
        </p>
        <div className="max-w-sm">
          <Autocomplete
            onSearch={asyncSearch}
            debounceMs={300}
            placeholder="Type to search..."
          />
        </div>
      </section>

      {/* Fuzzy Matching */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Fuzzy Matching
        </h2>
        <p className="text-sm text-muted-foreground mb-2">
          Try typing "apl" to match "Apple" or "sby" to match "Strawberry".
        </p>
        <div className="max-w-sm">
          <Autocomplete
            options={fruits}
            fuzzyMatching
            placeholder="Fuzzy search..."
          />
        </div>
      </section>

      {/* Limited Results */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b border-border pb-2">
          Limited Results
        </h2>
        <div className="max-w-sm">
          <Autocomplete
            options={fruits}
            limit={5}
            placeholder="Max 5 results..."
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
            {`import { Autocomplete } from "@/components/ui/autocomplete"

<Autocomplete
  options={[{ value: "1", label: "Option 1" }]}
  placeholder="Search..."
  multiple={false}
  fuzzyMatching={true}
  debounceMs={300}
  limit={10}
  onSearch={async (q) => fetchResults(q)}
  onChange={(value) => console.log(value)}
/>`}
          </pre>
        </div>
      </section>
    </div>
  );
}
